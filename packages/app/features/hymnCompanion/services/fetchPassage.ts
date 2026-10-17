import {
  normalizeBibleReference,
  resolveGuideReferenceForFetch,
} from '../data/lectionary/normalizeReference'
import {
  getCachedPassage,
  setCachedPassage,
  type CachedPassageRecord,
} from '../storage/passageTextCache'
import type { ScriptureVerse } from '../types'
import { formatPassageFromApi } from '../utils/formatPassageVerses'

/** World English Bible — public domain; suitable for app distribution without licensing fees. */
export const PASSAGE_TRANSLATION_ID = 'web' as const
export const PASSAGE_TRANSLATION_LABEL = 'World English Bible'

export type PassageTextDelivery = 'network' | 'cache' | 'cache-offline'

export type PassageTextResult = {
  text: string
  verses: ScriptureVerse[]
  translationName: string
  reference: string
  delivery: PassageTextDelivery
}

type BibleApiVerse = {
  book_name: string
  chapter: number
  verse: number
  text: string
}

type BibleApiResponse = {
  reference: string
  verses: BibleApiVerse[]
  text: string
  translation_name: string
  error?: string
}

/** bible-api.com path segment: spaces as +, leave : and - unescaped. */
export function bibleApiPathForReference(reference: string): string {
  return reference.trim().replace(/\s+/g, '+')
}

function cacheKeyFor(reference: string): string {
  return resolveGuideReferenceForFetch(reference).toLowerCase()
}

function fromCacheRecord(
  record: CachedPassageRecord,
  delivery: PassageTextDelivery
): PassageTextResult {
  return {
    text: record.text,
    verses: record.verses ?? [],
    translationName: record.translationName,
    reference: record.reference,
    delivery,
  }
}

function isTransientNetworkError(message: string): boolean {
  const lower = message.toLowerCase()
  return (
    lower.includes('network request failed') ||
    lower.includes('failed to fetch') ||
    lower.includes('unable to resolve host') ||
    lower.includes('abort') ||
    lower.includes('timed out')
  )
}

async function parsePassageResponse(
  response: Response,
  reference: string
): Promise<PassageTextResult> {
  let data: BibleApiResponse
  try {
    data = (await response.json()) as BibleApiResponse
  } catch {
    throw new Error(`Scripture service returned an unexpected response (${response.status}).`)
  }

  if (!response.ok || data.error) {
    const detail = data.error?.trim()
    if (response.status === 404 || detail === 'not found') {
      throw new Error(
        `Could not find "${reference}". Use a form like "Romans 12:1-2" or "John 3:16".`
      )
    }
    throw new Error(detail || `Scripture service error (${response.status}). Try again shortly.`)
  }

  const formatted = formatPassageFromApi(data.verses, data.text ?? '')
  const result: PassageTextResult = {
    text: formatted.text,
    verses: formatted.verses,
    translationName: data.translation_name ?? PASSAGE_TRANSLATION_LABEL,
    reference: data.reference ?? reference,
    delivery: 'network',
  }
  if (!result.text) {
    throw new Error(
      'This reference returned no verse text. Try a shorter range or check the reference.'
    )
  }
  return result
}

async function fetchFromNetworkOnce(
  reference: string,
  useTranslation: boolean
): Promise<PassageTextResult> {
  const path = bibleApiPathForReference(reference)
  const query = useTranslation ? `?translation=${PASSAGE_TRANSLATION_ID}` : ''
  const url = `https://bible-api.com/${path}${query}`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 25_000)
  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    })
    return await parsePassageResponse(response, reference)
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new Error('Scripture load timed out. Try again when the connection is stable.')
    }
    if (e instanceof Error && !isTransientNetworkError(e.message)) {
      throw e
    }
    throw e instanceof Error ? e : new Error('Could not reach the Scripture service.')
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchFromNetwork(reference: string): Promise<PassageTextResult> {
  let lastError: unknown
  for (const useTranslation of [true, false] as const) {
    try {
      return await fetchFromNetworkOnce(reference, useTranslation)
    } catch (e) {
      lastError = e
      const msg = e instanceof Error ? e.message : String(e)
      if (msg.includes('Could not find')) {
        throw e
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Could not reach the Scripture service.')
}

async function persistAndReturn(
  key: string,
  result: PassageTextResult
): Promise<PassageTextResult> {
  await setCachedPassage(key, {
    text: result.text,
    verses: result.verses,
    translationName: result.translationName,
    reference: result.reference,
  })
  return result
}

function revalidateInBackground(reference: string, key: string): void {
  void (async () => {
    try {
      const fresh = await fetchFromNetwork(reference)
      await setCachedPassage(key, {
        text: fresh.text,
        verses: fresh.verses,
        translationName: fresh.translationName,
        reference: fresh.reference,
      })
    } catch {
      /* keep cached copy */
    }
  })()
}

export type FetchPassageOptions = {
  /** When true (e.g. Refresh), fetch from network first and fall back to cache. */
  preferNetwork?: boolean
}

/**
 * Loads passage text: WEB over the network when possible, with on-device cache for speed and offline use.
 * Daily Bread Guide references are normalized here before fetch and cache.
 */
export async function fetchPassageText(
  rawReference: string,
  options?: FetchPassageOptions
): Promise<PassageTextResult> {
  const reference = resolveGuideReferenceForFetch(rawReference)
  if (!reference) {
    throw new Error('Enter a Bible reference (for example Romans 12:1-2).')
  }
  const key = cacheKeyFor(reference)
  const cached = await getCachedPassage(key)

  if (options?.preferNetwork) {
    try {
      return await persistAndReturn(key, await fetchFromNetwork(reference))
    } catch (e) {
      if (cached) {
        return fromCacheRecord(cached, 'cache-offline')
      }
      throw e
    }
  }

  if (cached) {
    revalidateInBackground(reference, key)
    return fromCacheRecord(cached, 'cache')
  }

  return persistAndReturn(key, await fetchFromNetwork(reference))
}
