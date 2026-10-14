import { normalizeBibleReference } from '../data/lectionary/normalizeReference'
import {
  getCachedPassage,
  setCachedPassage,
  type CachedPassageRecord,
} from '../storage/passageTextCache'

/** World English Bible — public domain; suitable for app distribution without licensing fees. */
export const PASSAGE_TRANSLATION_ID = 'web' as const
export const PASSAGE_TRANSLATION_LABEL = 'World English Bible'

export type PassageTextDelivery = 'network' | 'cache' | 'cache-offline'

export type PassageTextResult = {
  text: string
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
}

function referenceToPath(reference: string): string {
  return encodeURIComponent(reference.replace(/\s+/g, '+'))
}

function cacheKeyFor(reference: string): string {
  return normalizeBibleReference(reference).toLowerCase()
}

function fromCacheRecord(record: CachedPassageRecord, delivery: PassageTextDelivery): PassageTextResult {
  return {
    text: record.text,
    translationName: record.translationName,
    reference: record.reference,
    delivery,
  }
}

async function fetchFromNetwork(reference: string): Promise<PassageTextResult> {
  const url = `https://bible-api.com/${referenceToPath(reference)}?translation=${PASSAGE_TRANSLATION_ID}`
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 20_000)
  try {
    const response = await fetch(url, { signal: controller.signal })
    if (!response.ok) {
      throw new Error(`Could not load Scripture (${response.status}). Check your connection.`)
    }
    const data = (await response.json()) as BibleApiResponse
    const result: PassageTextResult = {
      text: data.text?.trim() ?? '',
      translationName: data.translation_name ?? PASSAGE_TRANSLATION_LABEL,
      reference: data.reference ?? reference,
      delivery: 'network',
    }
    if (!result.text) {
      throw new Error('This reference returned no verse text. Try a shorter passage or check the reference.')
    }
    return result
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new Error('Scripture load timed out. Check your connection and try again.')
    }
    throw e
  } finally {
    clearTimeout(timeout)
  }
}

async function persistAndReturn(key: string, result: PassageTextResult): Promise<PassageTextResult> {
  await setCachedPassage(key, {
    text: result.text,
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
 * Fellowship schedule references are unchanged — only display text is fetched here.
 */
export async function fetchPassageText(
  rawReference: string,
  options?: FetchPassageOptions
): Promise<PassageTextResult> {
  const reference = normalizeBibleReference(rawReference)
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
