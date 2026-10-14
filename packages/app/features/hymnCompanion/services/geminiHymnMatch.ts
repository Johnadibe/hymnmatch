import { catalogForPrompt, hymnCatalog, getHymnById } from '../data/hymnCatalog'
import type { DailyReading, HymnRecommendation, MatchResult } from '../types'

const DEFAULT_MODEL = 'gemini-2.0-flash'

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>
    }
  }>
  error?: { message?: string }
}

function getGeminiConfig(): { apiKey: string; model: string } {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? ''
  const model = process.env.EXPO_PUBLIC_GEMINI_MODEL ?? DEFAULT_MODEL
  return { apiKey, model }
}

function buildPrompt(reading: DailyReading, sermonThemeHint?: string): string {
  const themeLine = sermonThemeHint?.trim()
    ? `The preacher notes this central theme: "${sermonThemeHint.trim()}".`
    : 'Infer the central spiritual themes from the passage (do not invent doctrine beyond the text).'

  return `You are assisting a Christian preacher preparing worship. Your job is to suggest hymns that reinforce the SERMON MESSAGE, not merely match words in the Bible text.

Rules:
- Choose ONLY hymns from the catalogue below (use exact "id" values).
- Recommend exactly TWO hymns as the primary suggestions.
- Never invent hymn titles, numbers, or lyrics.
- Explain WHY each hymn fits the message (themes, spiritual fit), not keyword matching.
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
      "hymnId": "am-4",
      "fitStrength": "strong",
      "reason": "One or two sentences.",
      "matchedThemes": ["consecration", "surrender"]
    }
  ]
}
Include exactly 2 items in recommendations. fitStrength must be "strong", "good", or "moderate".`
}

function parseMatchJson(raw: string): MatchResult {
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim()
  const parsed = JSON.parse(cleaned) as MatchResult
  if (!parsed.recommendations?.length) {
    throw new Error('Gemini returned no hymn recommendations.')
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
    throw new Error('No valid hymn IDs in the AI response.')
  }
  return {
    sermonThemes: result.sermonThemes ?? [],
    recommendations: recommendations.slice(0, 2),
  }
}

/** Fallback when offline or no API key — score by theme overlap in catalogue metadata. */
export function localFallbackMatch(reading: DailyReading): MatchResult {
  const haystack = `${reading.title} ${reading.text} ${reading.reference}`.toLowerCase()
  const scored = hymnCatalog
    .map((hymn) => {
      let score = 0
      for (const theme of hymn.themes) {
        if (haystack.includes(theme.toLowerCase())) score += 2
      }
      for (const ref of hymn.scriptureRefs) {
        const book = ref.split(/[\s:]/)[0]?.toLowerCase()
        if (book && haystack.includes(book)) score += 1
      }
      return { hymn, score }
    })
    .sort((a, b) => b.score - a.score)

  const top = scored.slice(0, 2)
  return {
    sermonThemes: ['Message-based match (offline fallback)'],
    recommendations: top.map(({ hymn }, index) => ({
      hymnId: hymn.id,
      fitStrength: index === 0 ? 'strong' : 'good',
      reason: `Catalogue themes (${hymn.themes.slice(0, 3).join(', ')}) may support this passage. Confirm in prayer and with your hymnbook.`,
      matchedThemes: hymn.themes.slice(0, 3),
    })),
  }
}

export async function matchHymnsWithGemini(
  reading: DailyReading,
  options?: { sermonThemeHint?: string }
): Promise<MatchResult> {
  const { apiKey, model } = getGeminiConfig()
  if (!apiKey) {
    return localFallbackMatch(reading)
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(reading, options?.sermonThemeHint) }] }],
      generationConfig: {
        temperature: 0.4,
        responseMimeType: 'application/json',
      },
    }),
  })

  const data = (await response.json()) as GeminiResponse
  if (!response.ok) {
    const message = data.error?.message ?? `Gemini request failed (${response.status})`
    throw new Error(message)
  }

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    throw new Error('Empty response from Gemini.')
  }

  return validateRecommendations(parseMatchJson(text))
}
