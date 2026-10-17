import { HYMN_SUGGESTION_COUNT } from '../constants'
import { catalogForPrompt, getHymnById } from '../data/hymnCatalog'
import type { DailyReading, HymnRecommendation, MatchResult } from '../types'
import { igboAwareCatalogMatch } from './igboAwareCatalogMatch'

/** Default if EXPO_PUBLIC_GEMINI_MODEL is unset. See https://ai.google.dev/gemini-api/docs/models */
const DEFAULT_MODEL = 'gemini-3.8-flash'

const MODEL_FALLBACKS = ['gemini-3.8-flash', 'gemini-2.5-flash', 'gemini-2.5-flash-lite'] as const

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
  }>
  error?: { message?: string; status?: string }
}

export type MatchResultMeta = MatchResult & {
  /** Set when live matching failed and catalogue fallback was used. */
  matchSource?: 'gemini' | 'catalogue-fallback'
}

function getGeminiConfig(): { apiKey: string; model: string } {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? ''
  const model = process.env.EXPO_PUBLIC_GEMINI_MODEL?.trim() || DEFAULT_MODEL
  return { apiKey, model }
}

function modelsToTry(preferred: string): string[] {
  const ordered = [preferred, ...MODEL_FALLBACKS]
  return [...new Set(ordered.filter(Boolean))]
}

function isModelOrAvailabilityError(message: string): boolean {
  const lower = message.toLowerCase()
  return (
    lower.includes('no longer available') ||
    lower.includes('not found') ||
    lower.includes('models/') ||
    lower.includes('invalid model') ||
    lower.includes('404')
  )
}

function buildPrompt(reading: DailyReading, sermonThemeHint?: string): string {
  const themeLine = sermonThemeHint?.trim()
    ? `The preacher notes this central theme: "${sermonThemeHint.trim()}".`
    : 'Infer the central spiritual themes from the passage (do not invent doctrine beyond the text).'

  return `You are assisting a Christian preacher preparing worship. Your job is to suggest hymns that reinforce the SERMON MESSAGE, not merely match words in the Bible text.

Rules:
- Choose ONLY hymns from the catalogue below (use exact "id" values such as abu-1).
- Match using Igbo titles, English titles, themes, and scripture quotes in the catalogue; worship uses the Igbo Abu text.
- Recommend exactly ${HYMN_SUGGESTION_COUNT} hymns as the primary suggestions (all different catalogue ids).
- Never invent hymn titles, numbers, or lyrics.
- Explain WHY each hymn fits the message (themes, spiritual fit), not keyword matching.
- Use plain punctuation in reasons (commas and periods only; no em dashes or en dashes).
- Output valid JSON only.

Scripture reference: ${reading.reference}
Passage title: ${reading.title}
Passage text:
${reading.text}

${themeLine}

Hymn catalogue:
${catalogForPrompt()}

Respond with JSON in this shape:
{
  "sermonThemes": ["theme1", "theme2"],
  "recommendations": [
    {
      "hymnId": "abu-4",
      "fitStrength": "strong",
      "reason": "One or two sentences.",
      "matchedThemes": ["consecration", "surrender"]
    }
  ]
}
Include exactly ${HYMN_SUGGESTION_COUNT} items in recommendations. fitStrength must be "strong", "good", or "moderate".`
}

function parseMatchJson(raw: string): MatchResult {
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
  const parsed = JSON.parse(cleaned) as MatchResult
  if (!parsed.recommendations?.length) {
    throw new Error('The suggestion service returned no hymn recommendations.')
  }
  return parsed
}

function validateRecommendations(result: MatchResult): MatchResult {
  const recommendations: HymnRecommendation[] = []
  for (const rec of result.recommendations) {
    const hymn = getHymnById(rec.hymnId)
    if (!hymn) continue
    recommendations.push({
      hymnId: rec.hymnId,
      fitStrength: rec.fitStrength ?? 'good',
      reason: rec.reason ?? 'Thematic fit with the passage.',
      matchedThemes: rec.matchedThemes ?? [],
    })
  }
  if (recommendations.length === 0) {
    throw new Error('No valid hymn IDs in the response.')
  }
  return {
    sermonThemes: result.sermonThemes ?? [],
    recommendations: recommendations.slice(0, HYMN_SUGGESTION_COUNT),
  }
}

function isNetworkOrTransientError(message: string): boolean {
  const lower = message.toLowerCase()
  return (
    lower.includes('network request failed') ||
    lower.includes('failed to fetch') ||
    lower.includes('timed out') ||
    lower.includes('offline') ||
    lower.includes('internet')
  )
}

/** Fallback when offline, no API key, or all models fail — Igbo-aware on-device match. */
export function localFallbackMatch(
  reading: DailyReading,
  options?: { sermonThemeHint?: string }
): MatchResultMeta {
  return igboAwareCatalogMatch(reading, options)
}

async function requestGeminiMatch(
  apiKey: string,
  model: string,
  reading: DailyReading,
  sermonThemeHint?: string
): Promise<MatchResult> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`

  const generationConfig: Record<string, unknown> = {
    temperature: 0.4,
    responseMimeType: 'application/json',
  }
  if (model.includes('2.5')) {
    generationConfig.thinkingConfig = { thinkingBudget: 0 }
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(reading, sermonThemeHint) }] }],
      generationConfig,
    }),
  })

  const data = (await response.json()) as GeminiResponse
  if (!response.ok) {
    const message = data.error?.message ?? `Suggestion request failed (${response.status})`
    throw new Error(message)
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error('Empty response from suggestion service.')
  }

  return validateRecommendations(parseMatchJson(text))
}

export async function matchHymnsWithGemini(
  reading: DailyReading,
  options?: { sermonThemeHint?: string }
): Promise<MatchResultMeta> {
  const { apiKey, model } = getGeminiConfig()
  if (!apiKey) {
    return localFallbackMatch(reading, options)
  }

  let lastError: Error | null = null
  for (const candidate of modelsToTry(model)) {
    try {
      const result = await requestGeminiMatch(apiKey, candidate, reading, options?.sermonThemeHint)
      return { ...result, matchSource: 'gemini' }
    } catch (e) {
      const err = e instanceof Error ? e : new Error(String(e))
      lastError = err
      if (isNetworkOrTransientError(err.message)) {
        return localFallbackMatch(reading, options)
      }
      if (!isModelOrAvailabilityError(err.message)) {
        throw err
      }
    }
  }

  if (lastError && isModelOrAvailabilityError(lastError.message)) {
    return localFallbackMatch(reading, options)
  }

  throw lastError ?? new Error('Could not suggest hymns.')
}
