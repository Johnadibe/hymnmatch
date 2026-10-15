import type { HymnCatalogEntry } from '../types'
import { normalizeSearchText } from '../utils/normalizeSearchText'
import { acppbAbuCatalog } from './acppbAbuCatalog'

/** Fellowship Igbo Abu catalogue (extend as hymns 17+ are uploaded). */
export const hymnCatalog: HymnCatalogEntry[] = [...acppbAbuCatalog]

function hymnSearchBlob(h: HymnCatalogEntry): string {
  return [
    h.number,
    `abu ${h.number}`,
    h.id,
    h.title,
    h.titleEnglish,
    h.firstLine,
    h.matchProfile,
    h.themes.join(' '),
    h.scriptureRefs.join(' '),
    h.englishHymnalRefs,
  ]
    .filter(Boolean)
    .join(' ')
}

const hymnSearchIndex = hymnCatalog.map((h) => ({
  hymn: h,
  normalized: normalizeSearchText(hymnSearchBlob(h)),
}))

/** Instant filter as the user types; ignores Igbo tone marks and matches all words. */
export function filterHymnCatalog(query: string): HymnCatalogEntry[] {
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) return hymnCatalog
  const tokens = normalizedQuery.split(' ').filter(Boolean)
  return hymnSearchIndex
    .filter(({ normalized }) => tokens.every((token) => normalized.includes(token)))
    .map(({ hymn }) => hymn)
}

export function getHymnById(id: string): HymnCatalogEntry | undefined {
  return hymnCatalog.find((h) => h.id === id)
}

/** English-only lines for the suggestion service — Igbo is for display in the app. */
export function catalogForPrompt(): string {
  return hymnCatalog
    .map(
      (h) =>
        `- id: ${h.id}; Abu ${h.number}; English: "${h.titleEnglish}"; ${h.matchProfile}; themes: ${h.themes.join(', ')}; scripture: ${h.scriptureRefs.join(', ')}${h.englishHymnalRefs ? `; hymnal refs: ${h.englishHymnalRefs}` : ''}`
    )
    .join('\n')
}
