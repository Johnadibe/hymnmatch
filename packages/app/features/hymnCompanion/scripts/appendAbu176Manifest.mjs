import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const report = fs.readFileSync(path.join(__dirname, '../data/_abu176-224-report.md'), 'utf8')
const manifestPath = path.join(__dirname, '../data/abuSnapManifest.ts')

const map = new Map()
for (const line of report.split('\n')) {
  if (!line.startsWith('|')) continue
  const cols = line.split('|').map((c) => c.trim())
  if (cols.length < 5) continue
  const n = Number(cols[1])
  if (!Number.isFinite(n) || n < 176 || n > 224) continue
  const snapCol = cols[4]
  const files = [...snapCol.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim())
  if (files.length) map.set(n, files)
}

let manifest = fs.readFileSync(manifestPath, 'utf8')
manifest = manifest.replace(/\n {2}2(?:1[0-9]|2[0-4]): \[W2\([^\n]+\],?\n/g, '\n')

const block = [...map.entries()]
  .sort((a, b) => a[0] - b[0])
  .map(([n, files]) => {
    const refs = files.map((f) => `W2('${f}')`).join(', ')
    return `  ${n}: [${refs}],`
  })
  .join('\n')

manifest = manifest.replace(
  /missingFromBatch2: \[176\] as const,/,
  'missingFromBatch2: [225] as const,'
)
manifest = manifest.replace(
  /\n}\n\nexport const abuSnapFolderSecond/,
  `\n${block}\n}\n\nexport const abuSnapFolderSecond`
)

fs.writeFileSync(manifestPath, manifest)
