import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const report = fs.readFileSync(path.join(__dirname, '../data/_abu225-300-report.md'), 'utf8')
const manifestPath = path.join(__dirname, '../data/abuSnapManifest.ts')

const map = new Map()
for (const line of report.split('\n')) {
  if (!line.startsWith('|')) continue
  const cols = line.split('|').map((c) => c.trim())
  if (cols.length < 5) continue
  const n = Number(cols[1])
  if (!Number.isFinite(n) || n < 225 || n > 300) continue
  const files = [...cols[4].matchAll(/`([^`]+)`/g)]
    .map((m) => m[1].trim())
    .filter((f) => f.endsWith('.jpeg') && !f.includes('2nd part'))
  if (files.length) map.set(n, [...new Set(files)])
}

let manifest = fs.readFileSync(manifestPath, 'utf8')
if (!manifest.includes('const W3 =')) {
  manifest = manifest.replace(
    'const W2 = (suffix: string) => `WhatsApp Image 2026-10-15 at ${suffix}`\n',
    'const W2 = (suffix: string) => `WhatsApp Image 2026-10-15 at ${suffix}`\nconst W3 = (suffix: string) => `WhatsApp Image 2026-10-16 at ${suffix}`\n'
  )
}

manifest = manifest.replace(/\n {2}2[2-9]\d: \[W[23]\([^\n]+\],?\n/g, '\n')
manifest = manifest.replace(/\n {2}300: \[W[23]\([^\n]+\],?\n/g, '\n')

const block = [...map.entries()]
  .sort((a, b) => a[0] - b[0])
  .map(([n, files]) => `  ${n}: [${files.map((f) => `W3('${f}')`).join(', ')}],`)
  .join('\n')

const closeIdx = manifest.lastIndexOf('\n}')
manifest = manifest.slice(0, closeIdx) + `\n${block}` + manifest.slice(closeIdx)

if (!manifest.includes('abuSnapFolderLast')) {
  manifest = manifest.replace(
    /export const abuSnapFolderSecond = '[^']+'\n/,
    (m) => `${m}export const abuSnapFolderLast = 'Hymn or Abu Snapped Pitures - last part'\n`
  )
}

manifest = manifest.replace(
  /missingFromBatch2: \[[^\]]+\] as const,/,
  'missingFromBatch2: [301] as const,'
)

fs.writeFileSync(manifestPath, manifest)
