import { HYMN_SUGGESTION_COUNT } from '../constants'
import { hymnCatalog } from '../data/hymnCatalog'
import type { DailyReading, MatchResult } from '../types'

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFKC')
    .split(/[^\p{L}\p{N}']+/u)
    .filter((t) => t.length > 2)
}

function uniqueTokens(text: string): Set<string> {
  return new Set(tokenize(text))
}

/** On-device hymn match using Igbo Abu text, scripture quotes, and English metadata. */
export function igboAwareCatalogMatch(
  reading: DailyReading,
  options?: { sermonThemeHint?: string }
): MatchResult & { matchSource: 'catalogue-fallback' } {
  const themeHint = options?.sermonThemeHint?.trim() ?? ''
  const haystack =
    `${reading.title} ${reading.reference} ${reading.text} ${themeHint}`.toLowerCase()
  const hayTokens = uniqueTokens(haystack)

  const scored = hymnCatalog
    .map((hymn) => {
      let score = 0

      const igboCorpus = [
        hymn.title,
        hymn.firstLine ?? '',
        hymn.scriptureQuoteIgbo ?? '',
        (hymn.lyricsIgbo ?? '').replace(/^Verse \d+$/gim, ''),
      ].join(' ')
      for (const token of uniqueTokens(igboCorpus)) {
        if (hayTokens.has(token)) score += 2
      }

      for (const theme of hymn.themes) {
        const t = theme.toLowerCase()
        if (haystack.includes(t)) score += 4
      }

      for (const ref of hymn.scriptureRefs) {
        const book = ref.split(/[\s:]/)[0]?.toLowerCase()
        if (book && haystack.includes(book)) score += 2
        if (reading.reference.toLowerCase().includes(book ?? '')) score += 3
      }

      if (themeHint) {
        const hintTokens = uniqueTokens(themeHint)
        for (const token of hintTokens) {
          if (uniqueTokens(`${hymn.title} ${hymn.titleEnglish}`).has(token)) score += 3
        }
      }

      if (hymn.bookSection) {
        const section = hymn.bookSection.toLowerCase()
        if (section.includes('ekpere') && haystack.includes('prayer')) score += 2
        if (section.includes('ututu') && haystack.includes('morning')) score += 2
        if (section.includes('anyasi') && haystack.includes('evening')) score += 2
      }

      return { hymn, score }
    })
    .sort((a, b) => b.score - a.score)

  const top = scored.filter((s) => s.score > 0).slice(0, HYMN_SUGGESTION_COUNT)
  const picks =
    top.length >= HYMN_SUGGESTION_COUNT
      ? top
      : [...top, ...scored.filter((s) => !top.includes(s))].slice(0, HYMN_SUGGESTION_COUNT)

  const result: MatchResult = {
    sermonThemes: themeHint
      ? [themeHint]
      : ['Themes from your Daily Bread passage (Abu catalogue match)'],
    recommendations: picks.map(({ hymn }, index) => ({
      hymnId: hymn.id,
      fitStrength: index === 0 ? 'strong' : index === 1 ? 'good' : 'moderate',
      reason: hymn.scriptureQuoteIgbo
        ? `This Abu (${hymn.title}) ties to Scripture the guide emphasises. Compare the Igbo text and your message in prayer.`
        : `Igbo Abu ${hymn.number} (“${hymn.title}”) aligns with themes in your passage. Confirm with the hymnbook.`,
      matchedThemes: hymn.themes.slice(0, 3),
    })),
  }

  return { ...result, matchSource: 'catalogue-fallback' }
}
