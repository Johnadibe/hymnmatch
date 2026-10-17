import type { HymnCatalogEntry } from '../types'
import { acppbAbuCatalog } from './acppbAbuCatalog'

/** ACPPB Igbo Abu catalogue (Abu 1–400). */
export const hymnCatalog: HymnCatalogEntry[] = [...acppbAbuCatalog]

export function getHymnById(id: string): HymnCatalogEntry | undefined {
  return hymnCatalog.find((h) => h.id === id)
}

/** English-only lines for the suggestion service — Igbo is for display in the app. */
export function catalogForPrompt(): string {
  return hymnCatalog
    .map(
      (h) =>
        `- id: ${h.id}; Abu ${h.number}; Igbo: "${h.title}"; English: "${h.titleEnglish}"; themes: ${h.themes.join(', ')}; scripture: ${h.scriptureRefs.join(', ')}${h.scriptureQuoteIgbo ? `; Igbo scripture line: "${h.scriptureQuoteIgbo.slice(0, 120)}"` : ''}${h.englishHymnalRefs ? `; hymnal refs: ${h.englishHymnalRefs}` : ''}`
    )
    .join('\n')
}
