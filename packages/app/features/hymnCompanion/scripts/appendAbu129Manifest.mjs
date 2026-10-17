import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const report = fs.readFileSync(path.join(__dirname, '../data/_abu129-175-report.md'), 'utf8')
const manifestPath = path.join(__dirname, '../data/abuSnapManifest.ts')

const map = new Map()
for (const line of report.split('\n')) {
  if (!line.startsWith('|')) continue
  const cols = line.split('|').map((c) => c.trim())
  if (cols.length < 5) continue
  const n = Number(cols[1])
  if (!Number.isFinite(n) || n < 129 || n > 175) continue
  const snapCol = cols[4]
  const files = [...snapCol.matchAll(/`([^`]+)`/g)].map((m) => m[1].trim())
  if (files.length) map.set(n, files)
}

let manifest = fs.readFileSync(manifestPath, 'utf8')
if (!manifest.includes('const W2 =')) {
  manifest = manifest.replace(
    'const W16 = (suffix: string) => `WhatsApp Image 2026-10-16 at ${suffix}`\n',
    'const W16 = (suffix: string) => `WhatsApp Image 2026-10-16 at ${suffix}`\nconst W2 = (suffix: string) => `WhatsApp Image 2026-10-15 at ${suffix}`\n'
  )
}

// Remove partial 129-175 block if re-running
manifest = manifest.replace(/\n {2}1[2-7]\d: \[W2\([^\n]+\],?\n/g, '\n')

const block = [...map.entries()]
  .sort((a, b) => a[0] - b[0])
  .map(([n, files]) => {
    const refs = files.map((f) => `W2('${f}')`).join(', ')
    return `  ${n}: [${refs}],`
  })
  .join('\n')

manifest = manifest.replace(
  /\n}\n\n+export const abuSnapFolder/,
  `\n${block}\n}\n\nexport const abuSnapFolderSecond = 'Hymn or Abu Snapped Pictures - second part'\n\nexport const abuSnapFolder`
)

manifest = manifest.replace(
  /missingFromBatch1: \[129\] as const,\s*\n\s*partial: \[\] as const,/,
  'missingFromBatch1: [] as const,\n  /** 176+ in batch-2 folder; not yet in catalogue. */\n  missingFromBatch2: [176] as const,\n  partial: [] as const,'
)

fs.writeFileSync(manifestPath, manifest)
