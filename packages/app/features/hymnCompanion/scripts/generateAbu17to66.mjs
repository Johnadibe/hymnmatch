/**
 * Parses _abu8-66-report.md YAML blocks → acppbAbuCatalog17to66.ts
 * Run: node packages/app/features/hymnCompanion/scripts/generateAbu17to66.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const reportPath = path.join(__dirname, '../data/_abu8-66-report.md')
const outPath = path.join(__dirname, '../data/acppbAbuCatalog17to66.ts')

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
    const m = line.match(/^(\w+):\s*(.*)$/)
    if (!m) continue
    key = m[1]
    const rest = m[2]
    if (rest === '|') {
      multiline = []
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

// Keep longest lyrics per number (duplicate Abu 45)
const byNum = new Map()
for (const b of blocks) {
  const n = Number(b.number)
  if (n < 17 || n > 66) continue
  const prev = byNum.get(n)
  const len = (b.lyricsIgbo || '').length
  if (!prev || len > (prev.lyricsIgbo || '').length) byNum.set(n, b)
}

function isPartial(lyrics) {
  if (!lyrics) return true
  const flags = ['continues on next', '— continues', 'not in folder', 'Verse 4 not in folder']
  return flags.some((f) => lyrics.includes(f))
}

function themesFromEnglish(titleEnglish) {
  const t = (titleEnglish || '').toLowerCase()
  const themes = []
  const add = (k) => {
    if (!themes.includes(k)) themes.push(k)
  }
  if (
    /christ|jesus|saviour|redeemer|messiah|calvary|cross|blood|crucif|resurrect|ascen|advent|coming|second/.test(
      t
    )
  )
    add('Jesus')
  if (/birth|stall|bethlehem|shepherd|manger|night|holy night|faithful/.test(t)) add('Nativity')
  if (/death|strife|battle|tomb|grave|risen|easter|hallelujah|alleluia/.test(t)) add('Easter')
  if (/spirit|holy ghost|comforter|pentecost/.test(t)) add('Holy Spirit')
  if (/scripture|word|bible|book/.test(t)) add('Scripture')
  if (/praise|glory|worship|holy|immortal|wonderful|good/.test(t)) add('praise')
  if (/god|lord|almighty|father|creator|immortal/.test(t)) add('God')
  if (/heaven|cloud|sky|throne/.test(t)) add('heaven')
  if (/mission|servant|watch|awake/.test(t)) add('discipleship')
  if (themes.length === 0) add('worship')
  return themes
}

function occasionFromThemes(themes) {
  if (themes.includes('Nativity')) return ['Christmas', 'opening']
  if (themes.includes('Easter')) return ['Easter', 'opening']
  if (themes.includes('Holy Spirit')) return ['Pentecost', 'opening']
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

for (const n of entries) {
  const b = byNum.get(n)
  const lyrics = b.lyricsIgbo || ''
  const verified = !isPartial(lyrics)
  const title = b.title || `Abu ${n}`
  const titleEnglish = b.titleEnglish || title
  const themes = themesFromEnglish(titleEnglish)
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
  if (b.bookPage != null) fields.push(`bookPage: ${Number(b.bookPage)}`)
  if (b.hymnBookRefs) fields.push(`hymnBookRefs: ${JSON.stringify(b.hymnBookRefs)}`)
  if (b.meter) fields.push(`meter: ${JSON.stringify(b.meter)}`)
  if (b.scriptureQuoteIgbo)
    fields.push(`scriptureQuoteIgbo: ${JSON.stringify(b.scriptureQuoteIgbo)}`)
  fields.push(`matchProfile: ${JSON.stringify(matchProfile)}`)
  fields.push(`verified: ${verified}`)
  if (lyrics) fields.push(`lyricsIgbo: \`${esc(lyrics)}\`,`)

  chunks.push(`  {\n    ${fields.join(',\n    ')}\n  }`)
}

const missing = [42, 55, 60, 63, 64].filter((n) => !byNum.has(n))
for (const n of missing) {
  chunks.push(`  {
    id: 'abu-${n}',
    number: ${n},
    title: 'Abu ${n}',
    titleEnglish: '(pending snap — hymn ${n} not fully in photo batch)',
    collection: 'acppb_abu',
    collectionLabel: 'ACPPB Abu (Igbo)',
    language: 'ig',
    themes: ['worship'],
    scriptureRefs: [],
    occasion: ['opening'],
    matchProfile: 'Placeholder until fellowship re-shoots missing Abu ${n} page.',
    verified: false,
  }`)
}

chunks.sort((a, b) => {
  const na = Number(a.match(/number: (\d+)/)?.[1] ?? 0)
  const nb = Number(b.match(/number: (\d+)/)?.[1] ?? 0)
  return na - nb
})

const file = `import type { HymnCatalogEntry } from '../types'

/** Abu 17–66 — generated from _abu8-66-report.md (re-run generateAbu17to66.mjs after report updates). */
export const acppbAbuCatalog17to66: HymnCatalogEntry[] = [
${chunks.join(',\n')}
]
`

fs.writeFileSync(outPath, file)
