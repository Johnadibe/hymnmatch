import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function parseTable(reportPath, min, max) {
  const report = fs.readFileSync(reportPath, 'utf8')
  const map = new Map()
  for (const line of report.split('\n')) {
    if (!line.startsWith('|')) continue
    const cols = line.split('|').map((c) => c.trim())
    if (cols.length < 5) continue
    const n = Number(cols[1])
    if (!Number.isFinite(n) || n < min || n > max) continue
    const files = [...cols[4].matchAll(/`([^`]+)`/g)].map((m) => m[1].trim())
    if (files.length) map.set(n, files)
  }
  return map
}

const map = new Map([
  ...parseTable(path.join(__dirname, '../data/_abu129-175-report.md'), 129, 175),
  ...parseTable(path.join(__dirname, '../data/_abu176-224-report.md'), 176, 224),
])

const manifestPath = path.join(__dirname, '../data/abuSnapManifest.ts')
let manifest = fs.readFileSync(manifestPath, 'utf8')

if (!manifest.includes('const W2 =')) {
  manifest = manifest.replace(
    'const W16 = (suffix: string) => `WhatsApp Image 2026-10-16 at ${suffix}`\n',
    'const W16 = (suffix: string) => `WhatsApp Image 2026-10-16 at ${suffix}`\nconst W2 = (suffix: string) => `WhatsApp Image 2026-10-15 at ${suffix}`\n'
  )
}

manifest = manifest.replace(/\n {2}1[2-9]\d: \[W2\([^\n]+\],?\n/g, '\n')
manifest = manifest.replace(/\n {2}2[0-2]\d: \[W2\([^\n]+\],?\n/g, '\n')

const block = [...map.entries()]
  .sort((a, b) => a[0] - b[0])
  .map(([n, files]) => `  ${n}: [${files.map((f) => `W2('${f}')`).join(', ')}],`)
  .join('\n')

const closeIdx = manifest.lastIndexOf('\n}')
if (closeIdx === -1) throw new Error('Could not find end of abuSnapByHymn')
manifest =
  manifest.slice(0, closeIdx) +
  `\n${block}` +
  manifest.slice(closeIdx) +
  (manifest.includes('abuSnapFolderSecond')
    ? ''
    : `\n\nexport const abuSnapFolderSecond = 'Hymn or Abu Snapped Pictures - second part'`)

manifest = manifest.replace(
  /missingFromBatch2: \[[^\]]+\] as const,/,
  'missingFromBatch2: [225] as const,'
)

fs.writeFileSync(manifestPath, manifest)
