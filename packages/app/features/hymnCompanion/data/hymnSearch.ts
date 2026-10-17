import type { HymnCatalogEntry } from '../types'
import { normalizeSearchText } from '../utils/normalizeSearchText'
import { hymnCatalog } from './hymnCatalog'

type ParsedQuery =
  | { mode: 'empty' }
  | { mode: 'number'; digits: string; value: number }
  | { mode: 'text'; raw: string; tokens: string[] }

type IndexedHymn = {
  hymn: HymnCatalogEntry
  number: number
  numberStr: string
  /** Titles & first lines — highest relevance. */
  titlesNorm: string
  /** Themes, scripture, English profile, section headings. */
  metaNorm: string
  /** Full Igbo lyrics (all verses). */
  lyricsNorm: string
  /** Everything searchable in one blob. */
  allNorm: string
}

function lyricsToSearchText(lyrics?: string): string {
  if (!lyrics?.trim()) return ''
  return lyrics
    .replace(/^verse \d+\s*$/gim, '')
    .replace(/^chorus.*$/gim, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
}

function buildSearchDocument(h: HymnCatalogEntry): IndexedHymn {
  const titlesRaw = [h.title, h.titleEnglish, h.firstLine].filter(Boolean).join(' ')
  const metaRaw = [
    h.matchProfile,
    h.bookSection,
    h.scriptureQuoteIgbo,
    h.englishHymnalRefs,
    h.hymnBookRefs,
    h.themes.join(' '),
    h.scriptureRefs.join(' '),
    h.occasion.join(' '),
    h.collectionLabel,
  ]
    .filter(Boolean)
    .join(' ')

  const lyricsRaw = lyricsToSearchText(h.lyricsIgbo)
  const titlesNorm = normalizeSearchText(titlesRaw)
  const metaNorm = normalizeSearchText(metaRaw)
  const lyricsNorm = normalizeSearchText(lyricsRaw)
  const allNorm = [titlesNorm, metaNorm, lyricsNorm, normalizeSearchText(`abu ${h.number} ${h.id}`)]
    .filter(Boolean)
    .join(' ')

  return {
    hymn: h,
    number: h.number,
    numberStr: String(h.number),
    titlesNorm,
    metaNorm,
    lyricsNorm,
    allNorm,
  }
}

/** Built once at module load — keeps browse search instant for hundreds of hymns. */
const searchIndex: IndexedHymn[] = hymnCatalog.map(buildSearchDocument)

export function parseHymnSearchQuery(raw: string): ParsedQuery {
  const trimmed = raw.trim()
  if (!trimmed) return { mode: 'empty' }

  const abuNumber = trimmed.match(/^(?:abu|#|no\.?)\s*(\d+)\s*$/i)
  if (abuNumber) {
    const digits = abuNumber[1]
    return { mode: 'number', digits, value: Number.parseInt(digits, 10) }
  }

  if (/^\d+$/.test(trimmed)) {
    return { mode: 'number', digits: trimmed, value: Number.parseInt(trimmed, 10) }
  }

  const normalized = normalizeSearchText(trimmed)
  const tokens = normalized.split(' ').filter(Boolean)
  if (tokens.length === 0) return { mode: 'empty' }

  return { mode: 'text', raw: trimmed, tokens }
}

function scoreTextMatch(entry: IndexedHymn, tokens: string[]): number {
  let score = 0
  for (const token of tokens) {
    if (token.length === 0) continue

    if (entry.titlesNorm.includes(token)) {
      score += 800
      if (entry.titlesNorm.split(' ').some((w) => w.startsWith(token))) score += 400
      continue
    }
    if (entry.metaNorm.includes(token)) {
      score += 200
      continue
    }
    if (entry.lyricsNorm.includes(token)) {
      score += 120
      if (entry.lyricsNorm.split(' ').some((w) => w.startsWith(token))) score += 40
      continue
    }
    if (entry.allNorm.includes(token)) {
      score += 40
      continue
    }
    return 0
  }
  return score
}

function searchByNumber(digits: string): HymnCatalogEntry[] {
  const matches = searchIndex.filter(
    (e) => e.numberStr === digits || e.numberStr.startsWith(digits)
  )

  matches.sort((a, b) => {
    const aExact = a.numberStr === digits ? 1 : 0
    const bExact = b.numberStr === digits ? 1 : 0
    if (aExact !== bExact) return bExact - aExact
    return a.number - b.number
  })

  return matches.map((e) => e.hymn)
}

function searchByText(tokens: string[]): HymnCatalogEntry[] {
  const scored = searchIndex
    .map((entry) => ({ entry, score: scoreTextMatch(entry, tokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.entry.number - b.entry.number
    })

  return scored.map(({ entry }) => entry.hymn)
}

/**
 * Comprehensive hymn library search: Abu number, Igbo lyrics/titles, English titles & themes.
 * Pre-indexed for instant results as the user types.
 */
export function searchHymnCatalog(query: string): HymnCatalogEntry[] {
  const parsed = parseHymnSearchQuery(query)

  if (parsed.mode === 'empty') return hymnCatalog
  if (parsed.mode === 'number') return searchByNumber(parsed.digits)
  return searchByText(parsed.tokens)
}

/** @deprecated Use searchHymnCatalog — kept for existing imports. */
export function filterHymnCatalog(query: string): HymnCatalogEntry[] {
  return searchHymnCatalog(query)
}
