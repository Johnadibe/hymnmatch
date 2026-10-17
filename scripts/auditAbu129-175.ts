import { writeFileSync } from 'node:fs'
import { acppbAbuCatalog } from '../packages/app/features/hymnCompanion/data/acppbAbuCatalog.ts'

const hymns = acppbAbuCatalog.filter((h) => h.number >= 129 && h.number <= 175)

const partial: { n: number; reasons: string[]; title?: string }[] = []
const noAmen: { n: number; lastLine: string; title?: string }[] = []

for (const h of hymns) {
  const lyrics = h.lyricsIgbo ?? ''
  const reasons: string[] = []
  if (h.verified === false) reasons.push('verified:false')
  if (/PARTIAL|\[\.\.\.\]|continues on next|— continues/i.test(lyrics))
    reasons.push('PARTIAL marker')
  if (!lyrics.trim()) reasons.push('empty lyrics')
  if (reasons.length) partial.push({ n: h.number, reasons, title: h.titleEnglish })

  if (lyrics.trim()) {
    const lines = lyrics
      .trim()
      .split(/\n/)
      .filter((l) => {
        const t = l.trim()
        return (
          t &&
          !/^Verse \d+$/i.test(t) &&
          !/^Koros:/i.test(t) &&
          !/^Kọrọs:/i.test(t) &&
          !/^Chorus/i.test(t)
        )
      })
    const last = (lines.at(-1) ?? '').replace(/\*/g, '').trim()
    if (!/\bAmen\.?\s*$/i.test(last)) {
      noAmen.push({ n: h.number, lastLine: last, title: h.titleEnglish })
    }
  }
}

const report = { total: hymns.length, partial, noAmen }
writeFileSync('scripts/_abu129-175-audit.json', JSON.stringify(report, null, 2))
