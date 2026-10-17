import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const report = fs.readFileSync(path.join(__dirname, '../data/_abu301-400-report.md'), 'utf8')
const manifestPath = path.join(__dirname, '../data/abuSnapManifest.ts')

const map = new Map()
for (const line of report.split('\n')) {
  if (!line.startsWith('|')) continue
  const cols = line.split('|').map((c) => c.trim())
  if (cols.length < 5) continue
  const n = Number(cols[1])
  if (!Number.isFinite(n) || n < 301 || n > 400) continue
  const files = [...cols[4].matchAll(/`([^`]+)`/g)]
    .map((m) => m[1].trim())
    .filter((f) => f.endsWith('.jpeg'))
  if (files.length) map.set(n, [...new Set(files)])
}

let manifest = fs.readFileSync(manifestPath, 'utf8')
manifest = manifest.replace(/\n {2}3[0-9]{2}: \[W3\([^\n]+\],?\n/g, '\n')
manifest = manifest.replace(/\n {2}400: \[W3\([^\n]+\],?\n/g, '\n')

const block = [...map.entries()]
  .sort((a, b) => a[0] - b[0])
  .map(([n, files]) => `  ${n}: [${files.map((f) => `W3('${f}')`).join(', ')}],`)
  .join('\n')

const anchor = "  300: [W3('16.28.44.jpeg'), W3('16.28.47.jpeg')],"
const anchorIdx = manifest.indexOf(anchor)
if (anchorIdx < 0) throw new Error('Abu 300 manifest line not found')
const insertAt = anchorIdx + anchor.length
manifest = manifest.slice(0, insertAt) + `\n${block}` + manifest.slice(insertAt)

manifest = manifest.replace(
  /missingFromBatch2: \[[^\]]+\] as const,/,
  'missingFromBatch2: [] as const,'
)

fs.writeFileSync(manifestPath, manifest)
