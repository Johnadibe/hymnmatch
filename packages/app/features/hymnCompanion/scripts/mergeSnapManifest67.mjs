import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const report = fs.readFileSync(path.join(__dirname, '../data/_abu67-end-report.md'), 'utf8')
const manifestPath = path.join(__dirname, '../data/abuSnapManifest.ts')

const snap67 = {}
for (const line of report.split('\n')) {
  if (!line.startsWith('|')) continue
  const parts = line.split('|').map((p) => p.trim())
  if (parts.length < 5) continue
  const num = Number(parts[1])
  if (!Number.isFinite(num) || num < 67) continue
  const cell = parts[4]
  const files = [...cell.matchAll(/`([^`]+)`/g)].map(
    (m) => `WhatsApp Image 2026-10-15 at ${m[1].trim()}`
  )
  if (files.length) snap67[num] = files
}

let manifest = fs.readFileSync(manifestPath, 'utf8')
manifest = manifest.replace(/\n {2}67:[\s\S]*?\n\}/, '\n}')
const insert = Object.keys(snap67)
  .sort((a, b) => a - b)
  .map((n) => {
    const arr = snap67[n]
      .map((f) => `W('${f.replace('WhatsApp Image 2026-10-15 at ', '')}')`)
      .join(', ')
    return `  ${n}: [${arr}],`
  })
  .join('\n')

manifest = manifest.replace(/(\n {2}66: \[W\('18\.05\.34\.jpeg'\)\],)\n\}/, `$1\n${insert}\n}`)

manifest = manifest.replace(
  /export const abuSnapGaps = \{[\s\S]*?\}/,
  `export const abuSnapGaps = {
  /** Abu 129+ not in first photo folder (book continues). */
  missingFromBatch1: [129] as const,
  partial: [65, 113, 115, 128] as const,
}`
)

fs.writeFileSync(manifestPath, manifest)
