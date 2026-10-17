import { writeFileSync } from 'node:fs'
import { acppbAbuCatalog } from '../packages/app/features/hymnCompanion/data/acppbAbuCatalog.ts'

/** Themes after enrichAbuCatalog merge (runtime catalogue). */

const hymns = acppbAbuCatalog.filter((h) => h.number >= 1 && h.number <= 128)

type Row = {
  number: number
  partial: boolean
  partialReason: string[]
  endsAmen: boolean
  lastLine: string
  themeCount: number
  themes: string[]
  titleEnglish?: string
}

const rows: Row[] = hymns.map((h) => {
  const lyrics = h.lyricsIgbo ?? ''
  const partialReason: string[] = []
  if (h.verified === false) partialReason.push('verified:false')
  if (/PARTIAL|\[\.\.\.\]|n\[\.\.\.\]/.test(lyrics)) partialReason.push('PARTIAL marker in lyrics')
  if (!lyrics.trim()) partialReason.push('empty lyrics')
  const lines = lyrics
    .trim()
    .split(/\n/)
    .filter((l) => l.trim() && !/^Verse \d+$/i.test(l.trim()))
  const lastLine = lines.at(-1) ?? ''
  const endsAmen = lastLine ? /\bAmen\.?\s*$/i.test(lastLine.replace(/\*/g, '').trim()) : false

  return {
    number: h.number,
    partial: partialReason.length > 0,
    partialReason,
    endsAmen: lyrics.trim() ? endsAmen : false,
    lastLine,
    themeCount: h.themes.length,
    themes: h.themes,
    titleEnglish: h.titleEnglish,
  }
})

const partial = rows.filter((r) => r.partial)
const noAmen = rows.filter(
  (r) => (hymns.find((h) => h.number === r.number)?.lyricsIgbo ?? '').trim() && !r.endsAmen
)
const singleTheme = rows.filter((r) => r.themeCount === 1)

const report = {
  total: hymns.length,
  partial: partial.map((r) => ({ n: r.number, reasons: r.partialReason, title: r.titleEnglish })),
  noAmen: noAmen.map((r) => ({ n: r.number, lastLine: r.lastLine, title: r.titleEnglish })),
  singleThemeCount: singleTheme.length,
  singleTheme: singleTheme.map((r) => ({ n: r.number, themes: r.themes, title: r.titleEnglish })),
}

writeFileSync('scripts/_abu128-audit.json', JSON.stringify(report, null, 2))
