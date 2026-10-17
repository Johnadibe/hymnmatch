/**
 * Parse Abu transcription report YAML → TypeScript catalog slice.
 *
 * Usage:
 *   node generateAbuFromReport.mjs 67 128 ../data/_abu67-end-report.md ../data/acppbAbuCatalog67to128.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const [, , minStr, maxStr, reportRel, outRel] = process.argv
const minN = Number(minStr)
const maxN = Number(maxStr)
const reportPath = path.resolve(__dirname, reportRel)
const outPath = path.resolve(__dirname, outRel)

const report = fs.readFileSync(reportPath, 'utf8')

function parseYamlBlock(raw) {
  const lines = raw.trim().split('\n')
  const out = {}
  let key = null
  let multiline = null
  for (const line of lines) {
    if (multiline !== null) {
      if (line.startsWith('  ') || line === '') {
        multiline.push(line.replace(/^ {2}/, ''))
        continue
      }
      out[key] = multiline.join('\n').trimEnd()
      multiline = null
    }
    const m = line.match(/^([\w]+):\s*(.*)$/)
    if (!m) continue
    key = m[1]
    let rest = m[2]
    if (rest.includes('#')) rest = rest.split('#')[0].trim()
    if (rest === '|') {
      multiline = []
      continue
    }
    if (rest === 'null' || rest === '') {
      if (rest === 'null') out[key] = null
      continue
    }
    if (rest.startsWith('[')) {
      try {
        out[key] = JSON.parse(rest.replace(/'/g, '"'))
      } catch {
        out[key] = []
      }
      continue
    }
    out[key] = rest.replace(/^"|"$/g, '').replace(/^'|'$/g, '')
  }
  if (multiline !== null && key) {
    out[key] = multiline.join('\n').trimEnd()
  }
  return out
}

const blocks = []
const re = /```yaml\n([\s\S]*?)```/g
let match
while ((match = re.exec(report)) !== null) {
  const parsed = parseYamlBlock(match[1])
  if (parsed.number != null) blocks.push(parsed)
}

const byNum = new Map()
for (const b of blocks) {
  const n = Number(b.number)
  if (n < minN || n > maxN) continue
  const prev = byNum.get(n)
  const len = (b.lyricsIgbo || '').length
  if (!prev || len > (prev.lyricsIgbo || '').length) byNum.set(n, b)
}

function isPartial(lyrics) {
  if (!lyrics) return true
  const flags = [
    'continues on next',
    '— continues',
    '— PARTIAL',
    'PARTIAL:',
    'not in folder',
    'not in this folder',
    '[…]',
    '[. . .]',
  ]
  return flags.some((f) => lyrics.includes(f))
}

function themesFromEnglish(titleEnglish, bookSection) {
  const t = (titleEnglish || '').toLowerCase()
  const sec = (bookSection || '').toUpperCase()
  const themes = []
  const add = (k) => {
    if (!themes.includes(k)) themes.push(k)
  }
  if (sec.includes('MỌ NSỌ') || sec.includes('MO NSO')) add('Holy Spirit')
  if (sec.includes('AKWUKW') || sec.includes('NSO.')) add('Scripture')
  if (sec.includes('BAPTISM')) add('baptism')
  if (sec.includes('ORIRI') || sec.includes('COMMUNION')) add('communion')
  if (sec.includes('INYE-IKE') || sec.includes('OFFERT')) add('offertory')
  if (sec.includes('UBỌCHI') || sec.includes('LORD')) add("Lord's Day")
  if (sec.includes('IDO') || sec.includes('ORDIN')) add('ordination')
  if (sec.includes('IJIK') || sec.includes('NWUNYE')) add('marriage')
  if (sec.includes('ILỊ OZU') || sec.includes('ILI OZU')) add('funeral')
  if (sec.includes('ELU-IGWE')) add('heaven')
  if (sec.includes('OTUTO')) add('praise')
  if (sec.includes('NCHÈGHARI') || sec.includes('NCHEGHARI')) add('repentance')
  if (sec.includes('OKWUKWE')) add('faith')
  if (sec.includes("ITỌ N'AMARA") || sec.includes('ITO N')) add('grace')
  if (sec.includes('ISO KRAIST')) add('discipleship')
  if (sec.includes('IGBARA KRAIST')) add('Jesus')
  if (sec.includes('IJERE KRAIST')) add('mission')
  if (sec.includes('EKPERE')) add('prayer')
  if (sec.includes('OZI ỌMA') || sec.includes('OZI OMA')) add('Gospel')
  if (sec.includes('UMU-NTAKIRI')) add('children')
  if (sec.includes('UTUTU')) add('morning')
  if (sec.includes('ANYASI')) add('evening')
  if (sec.includes('ONYINYE')) add('offertory')
  if (sec.includes('ARỌ ỌHU') || sec.includes('ARO OHU')) add('New Year')
  if (sec.includes('NDI-ỌRIA') || sec.includes('NDI ORIA')) add('healing')
  if (sec.includes('NDI-IJE') || sec.includes('NDI IJE')) add('travel')
  if (sec.includes('IDO ULO')) add('dedication')
  if (sec.includes('KỌRỌS') || sec.includes('KOROS')) add('chorus')
  if (
    /christ|jesus|saviour|redeemer|messiah|calvary|cross|blood|crucif|resurrect|ascen|advent|coming|second/.test(
      t
    )
  )
    add('Jesus')
  if (/spirit|holy ghost|comforter|pentecost|breath of god/.test(t)) add('Holy Spirit')
  if (/scripture|word|bible|book|gospel|psalm/.test(t)) add('Scripture')
  if (/bapti|font|water/.test(t)) add('baptism')
  if (/communion|supper|bread|wine|eucharist|oriri/.test(t)) add('communion')
  if (/praise|glory|worship|holy|immortal|wonderful|good|hallelujah/.test(t)) add('praise')
  if (/god|lord|almighty|father|creator|immortal/.test(t)) add('God')
  if (/heaven|cloud|sky|throne/.test(t)) add('heaven')
  if (/mission|servant|watch|awake|take my life/.test(t)) add('discipleship')
  if (themes.length === 0) add('worship')
  return themes
}

function occasionFromThemes(themes) {
  if (themes.includes('baptism')) return ['baptism', 'opening']
  if (themes.includes('communion')) return ['communion', 'opening']
  if (themes.includes('ordination')) return ['ordination', 'opening']
  if (themes.includes("Lord's Day")) return ['opening', 'Sunday']
  if (themes.includes('Holy Spirit')) return ['Pentecost', 'opening']
  if (themes.includes('Nativity')) return ['Christmas', 'opening']
  if (themes.includes('Easter')) return ['Easter', 'opening']
  return ['opening', 'response']
}

function firstLineFromLyrics(lyrics) {
  if (!lyrics) return undefined
  for (const line of lyrics.split('\n')) {
    const t = line.trim()
    if (
      t &&
      !/^Verse \d+/i.test(t) &&
      !/^Koros:/i.test(t) &&
      !/^Kọrọs:/i.test(t) &&
      !/^Chorus/i.test(t) &&
      !/^Haleluya!?$/.test(t)
    )
      return t.replace(/,\s*$/, '')
  }
  return undefined
}

function esc(str) {
  return String(str).replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$')
}

const entries = [...byNum.keys()].sort((a, b) => a - b)
const chunks = []
const exportName = path.basename(outPath, '.ts')

for (const n of entries) {
  const b = byNum.get(n)
  const lyrics = b.lyricsIgbo || ''
  const verified = !isPartial(lyrics)
  const title = b.title || `Abu ${n}`
  const titleEnglish = b.titleEnglish || title
  const themes = themesFromEnglish(titleEnglish, b.bookSection)
  const occasion = occasionFromThemes(themes)
  const firstLine = firstLineFromLyrics(lyrics) || title
  const matchProfile = `${titleEnglish} — Igbo Abu ${n} (${b.bookSection || 'ACPPB'}).`

  const fields = [
    `id: 'abu-${n}'`,
    `number: ${n}`,
    `title: ${JSON.stringify(title)}`,
    `titleEnglish: ${JSON.stringify(titleEnglish)}`,
    `collection: 'acppb_abu'`,
    `collectionLabel: 'ACPPB Abu (Igbo)'`,
    `language: 'ig'`,
    `themes: ${JSON.stringify(themes)}`,
    `scriptureRefs: ${JSON.stringify(b.scriptureRefs || [])}`,
    `occasion: ${JSON.stringify(occasion)}`,
    `firstLine: ${JSON.stringify(firstLine)}`,
  ]
  if (b.englishHymnalRefs) fields.push(`englishHymnalRefs: ${JSON.stringify(b.englishHymnalRefs)}`)
  if (b.bookSection) fields.push(`bookSection: ${JSON.stringify(b.bookSection)}`)
  if (b.bookPage != null && b.bookPage !== '') fields.push(`bookPage: ${Number(b.bookPage)}`)
  if (b.hymnBookRefs) fields.push(`hymnBookRefs: ${JSON.stringify(b.hymnBookRefs)}`)
  if (b.meter) fields.push(`meter: ${JSON.stringify(b.meter)}`)
  if (b.scriptureQuoteIgbo)
    fields.push(`scriptureQuoteIgbo: ${JSON.stringify(b.scriptureQuoteIgbo)}`)
  fields.push(`matchProfile: ${JSON.stringify(matchProfile)}`)
  fields.push(`verified: ${verified}`)
  if (lyrics) fields.push(`lyricsIgbo: \`${esc(lyrics)}\`,`)

  chunks.push(`  {\n    ${fields.join(',\n    ')}\n  }`)
}

const file = `import type { HymnCatalogEntry } from '../types'

/** Abu ${minN}–${maxN} — generated from ${path.basename(reportPath)} (re-run generateAbuFromReport.mjs). */
export const ${exportName}: HymnCatalogEntry[] = [
${chunks.join(',\n')}
]
`

fs.writeFileSync(outPath, file)
