import { normalizeSearchText } from '../utils/normalizeSearchText'
import { songsOfPraiseCatalog } from './songsOfPraiseCatalog'
import type { SongOfPraiseEntry } from '../types'

type ParsedQuery =
  | { mode: 'empty' }
  | { mode: 'number'; digits: string; value: number }
  | { mode: 'text'; tokens: string[] }

type IndexedSong = {
  song: SongOfPraiseEntry
  numberStr: string
  titleNorm: string
  lyricsNorm: string
  allNorm: string
}

function buildIndex(s: SongOfPraiseEntry): IndexedSong {
  const titleNorm = normalizeSearchText(s.title)
  const lyricsNorm = normalizeSearchText(s.lyrics)
  const allNorm = [titleNorm, lyricsNorm, normalizeSearchText(`song ${s.number} ${s.id}`)]
    .filter(Boolean)
    .join(' ')

  return {
    song: s,
    numberStr: String(s.number),
    titleNorm,
    lyricsNorm,
    allNorm,
  }
}

const searchIndex: IndexedSong[] = songsOfPraiseCatalog.map(buildIndex)

export function parseSongsOfPraiseQuery(raw: string): ParsedQuery {
  const trimmed = raw.trim()
  if (!trimmed) return { mode: 'empty' }

  const labeled = trimmed.match(/^(?:#|no\.?|song)\s*(\d+)\s*$/i)
  if (labeled) {
    const digits = labeled[1]
    return { mode: 'number', digits, value: Number.parseInt(digits, 10) }
  }

  if (/^\d+$/.test(trimmed)) {
    return { mode: 'number', digits: trimmed, value: Number.parseInt(trimmed, 10) }
  }

  const tokens = normalizeSearchText(trimmed).split(' ').filter(Boolean)
  if (tokens.length === 0) return { mode: 'empty' }

  return { mode: 'text', tokens }
}

function scoreTextMatch(entry: IndexedSong, tokens: string[]): number {
  let score = 0
  for (const token of tokens) {
    if (entry.titleNorm.includes(token)) {
      score += 900
      if (entry.titleNorm.split(' ').some((w) => w.startsWith(token))) score += 350
      continue
    }
    if (entry.lyricsNorm.includes(token)) {
      score += 180
      if (entry.lyricsNorm.split(' ').some((w) => w.startsWith(token))) score += 60
      continue
    }
    if (entry.allNorm.includes(token)) {
      score += 50
      continue
    }
    return 0
  }
  return score
}

function searchByNumber(digits: string): SongOfPraiseEntry[] {
  const matches = searchIndex.filter(
    (e) => e.numberStr === digits || e.numberStr.startsWith(digits)
  )
  matches.sort((a, b) => {
    const aExact = a.numberStr === digits ? 1 : 0
    const bExact = b.numberStr === digits ? 1 : 0
    if (aExact !== bExact) return bExact - aExact
    return a.song.number - b.song.number
  })
  return matches.map((e) => e.song)
}

function searchByText(tokens: string[]): SongOfPraiseEntry[] {
  return searchIndex
    .map((entry) => ({ entry, score: scoreTextMatch(entry, tokens) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return a.entry.song.number - b.entry.song.number
    })
    .map(({ entry }) => entry.song)
}

/** Pre-indexed search across all 597 Songs of Praise — instant as you type. */
export function searchSongsOfPraiseCatalog(query: string): SongOfPraiseEntry[] {
  const parsed = parseSongsOfPraiseQuery(query)
  if (parsed.mode === 'empty') return songsOfPraiseCatalog
  if (parsed.mode === 'number') return searchByNumber(parsed.digits)
  return searchByText(parsed.tokens)
}
