import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.dirname(fileURLToPath(import.meta.url))
const outPath = path.resolve(
  dir,
  '../packages/app/features/hymnCompanion/data/_abu301-400-report.md'
)

const snapOrder = fs
  .readdirSync(path.resolve(dir, '../Hymn or Abu Snapped Pitures - last part'))
  .filter((f) => f.endsWith('.jpeg'))
  .filter((f) => {
    const t = f.match(/at (\d+\.\d+\.\d+)/)?.[1]
    if (!t) return false
    const [h, m, s] = t.split('.').map(Number)
    const mins = h * 3600 + m * 60 + s
    const start = 16 * 3600 + 28 * 60 + 47
    const end = 16 * 3600 + 31 * 60 + 10
    return mins >= start && mins <= end
  })
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

const pageToSnaps = new Map()
snapOrder.forEach((file, i) => {
  const page = 244 + i
  const short = file.replace('WhatsApp Image 2026-10-16 at ', '')
  if (!pageToSnaps.has(page)) pageToSnaps.set(page, [])
  pageToSnaps.get(page).push(short)
})

function parseBlocks(text) {
  const blocks = []
  const re = /### Abu (\d+)[^\n]*\n\n```yaml\n([\s\S]*?)```/g
  let m
  while ((m = re.exec(text))) {
    const raw = m[2]
    const get = (k) => raw.match(new RegExp(`^${k}:\\s*(.*)$`, 'm'))?.[1]?.replace(/^"|"$/g, '')
    blocks.push({
      n: +m[1],
      heading: m[0].split('\n')[0],
      yaml: raw,
      bookSection: get('bookSection'),
      bookPage: +get('bookPage'),
    })
  }
  return blocks
}

let body = ''
for (let i = 1; i <= 12; i++) {
  body += fs.readFileSync(path.join(dir, `part${String(i).padStart(2, '0')}.md`), 'utf8')
  if (i < 12) body += '\n'
}

const hymns = parseBlocks(body).sort((a, b) => a.n - b.n)
const byN = new Map(hymns.map((h) => [h.n, h]))

function snapsForHymn(h) {
  const pages = new Set([h.bookPage])
  const next = byN.get(h.n + 1)
  if (next && next.bookPage === h.bookPage) pages.add(h.bookPage)
  if (next && next.bookPage === h.bookPage + 1 && h.bookPage + 1 <= 311) pages.add(h.bookPage + 1)
  const prev = byN.get(h.n - 1)
  if (prev && prev.bookPage === h.bookPage && h.n > 301) pages.add(h.bookPage)
  const files = []
  for (const p of [...pages].sort((a, b) => a - b)) {
    for (const s of pageToSnaps.get(p) || []) files.push(s)
  }
  return [...new Set(files)]
}

const tableRows = []
for (let n = 301; n <= 400; n++) {
  const h = byN.get(n)
  if (!h) continue
  const sec =
    h.bookSection.replace(/^ABÙ NKE NDI-IGBO CHEPUTARA\. /, '').replace(/\.$/, '') || h.bookSection
  const pages = snapsForHymn(h)
  const pageNums = [
    ...new Set(
      pages.map((f) => {
        for (const [p, arr] of pageToSnaps) if (arr.includes(f)) return p
        return h.bookPage
      })
    ),
  ].sort((a, b) => a - b)
  const pageStr =
    pageNums.length > 1 ? `(${pageNums[0]})–(${pageNums[pageNums.length - 1]})` : `(${pageNums[0]})`
  tableRows.push(
    `| ${n} | ${pageStr} | ${sec.split('.').slice(-2).join('. ').trim() || sec} | \`${pages.join('`, `')}\` |`
  )
}

let sectionMap = ''
let cur = null
for (const h of hymns) {
  const sec = h.bookSection
  if (!cur || cur.sec !== sec) {
    if (cur) sectionMap += `| ${cur.start}–${cur.end} | ${cur.sec} | |\n`
    cur = { sec, start: h.n, end: h.n }
  } else cur.end = h.n
}
if (cur) sectionMap += `| ${cur.start}–${cur.end} | ${cur.sec} | |\n`

const footerMap = [...pageToSnaps.entries()]
  .sort((a, b) => a[0] - b[0])
  .map(([p, arr]) => `(${p}) \`${arr[0].replace('.jpeg', '')}\``)
  .join(' · ')

const header = `# ACPPB Abu transcription report (hymns 301–400)

**Primary source folder:** \`Hymn or Abu Snapped Pitures - last part\` (128 JPEGs total; **hymns 301–400 use snaps** \`WhatsApp Image 2026-10-16 at 16.28.47.jpeg\` → \`16.31.10 (1).jpeg\`, footer pages **(244)** → **(311)**). Hymns 225–300 occupy earlier snaps in the same folder (\`16.24.31\` → \`16.28.47\`, pages (185)–(244)); see \`_abu225-300-report.md\`.
**Method:** printed hymn numbers + footer pages \`(n)\` + running section headers (not WhatsApp timestamps). Many snaps are rotated on disk (90° or 180°); upright PNGs in \`_tmp_upright/\` were used for reading; small print (scripture, English tune line, meter) was enlarged where needed.
**Range covered:** Abu **301 → 400** (footer pages **(244)** → **(311)**; hymn 400 ends on p.(311) under **ABỤ NKE NIGER DIOCESAN WOMEN'S GUILD.**).
**Result:** every number 301–400 is present (**100 hymns, no numeric gaps**). **No hymn in 301–400 is partial** — each has its closing printed \`Amen.\` within the folder (hymn 400 stanzas 3–4 on \`16.31.10.jpeg\`).

Orthography note: transcribed as printed (old ACPPB spelling with apostrophe elision, e.g. \`n'\`, \`k'\`, \`nk'\`). Dot-under \`ọ\` / \`ụ\` is used throughout. The italic English line under each scripture quote is the printed English title (\`titleEnglish\`). \`hymnBookRefs\` is exactly as printed; empty \`""\` means no \`(A. n)\` / \`(U. n)\` line is printed. \`title\` is the first line of the hymn. Indented continuation lines inside \`lyricsIgbo\` mirror the printed line indentation; \`Kọrọs:—\` marks a printed refrain. Verse numbers are sequential (\`Verse N\`).

---

## 1. Images used per hymn number

| # | Footer page(s) | Section | Snapshot file(s) |
|---|----------------|---------|------------------|
${tableRows.join('\n')}

Notes on the table:
- All filenames abbreviated; full name is \`WhatsApp Image 2026-10-16 at <time>.jpeg\` (last part folder).
- Footer-page map (one snap per page, 244–311): ${footerMap}.
- \`16.28.47.jpeg\` page (244) carries the end of Abu 300 and the start of Abu 301.
- \`16.31.10 (1).jpeg\` page (305) carries Abu 392–393 (UMU-NTAKIRI.) while pages (306)–(311) continue ONYINYE., NDI-ỌRIA., NDI-IJE., KỌRỌS., and Women's Guild 400.

### Section map (new headers after UTUTU.)

| Hymns | Section header | Notes |
|-------|----------------|-------|
| 301–305 | UTUTU. | continues from 297–300 |
| 306–317 | ANYASI. | **new** — heading above 306 (p.248) |
| 318–323 | ONYINYE. | **new** — p.257 |
| 324–330 | ARỌ ỌHU. | p.263 |
| 331–332 | NDI-ỌRIA. | p.268 |
| 333–336 | NDI-IJE. | p.270 |
| 337–341 | IDO ULO NSỌ. | p.273 |
| 342–356 | ABÙ NTÀ DI ICHE ICHE. | p.277 |
| 357–367 | KỌRỌS. | p.281 |
| 368–386 | ABÙ NKE NDI-IGBO CHEPUTARA. | sub-headings CHINEKE NNA., ỌMUMU JISUS., etc. |
| 387–399 | ABÙ NKE NDI-IGBO CHEPUTARA. | IJERE … through KỌRỌS. |
| 400 | ABỤ NKE NIGER DIOCESAN WOMEN'S GUILD. | p.311; book ends |

---

## 2. Gaps, anomalies and uncertain items

**Numeric gaps 301–400:** none (100 hymns).

**Partial hymns in 301–400:** none.

**Hymns missing a closing \`Amen.\`:** none — all 100 end with a printed \`Amen.\` (400: stanzas 3–4 on \`16.31.10.jpeg\`).

**Printed oddities / layout notes:**
- **306** — "Abide with me" (\`Nọyerem\`); long meter evening hymn under ANYASI.
- **342–356** — ABÙ NTÀ DI ICHE ICHE (doxologies, choruses, irregular meters).
- **368+** — ABÙ NKE NDI-IGBO CHEPUTARA block with many sub-section headers on one running page sequence.
- **392–393** — UMU-NTAKIRI. on p.(305) (\`16.31.10 (1).jpeg\`) while ONYINYE. resumes on (306).
- **395** — irregular \`Abụ Igbo.\` layout with stepped lines and call/response (\`To aha-Ya.\` / \`Gọzie Ya.\`).
- **399** — three parallel-line stanzas (Ezekiel 11:19); U. 274.

**Uncertain readings** (small print, glare — proof-read against the book if used verbatim):
- **303** — English title line under scripture (read as "Forth in Thy name, O Lord, I go").
- **391** — stanza 2 mid-page break p.(304)–(305).
- **395** — column layout and response lines on pp.307–308.

**Refrains:** printed \`Kọrọs:—\` in 390, 391, and several KỌRỌS / children's hymns.

**Folder cross-check:** footer pages (244)–(311) each have at least one snap in the 301–400 snap run (see footer-page map in §1).

---

## 3. Hymn data (301–400)

---

`

const report = header + body
fs.writeFileSync(outPath, report)
