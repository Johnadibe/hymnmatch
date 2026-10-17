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
  const re = /`([^`]+)`/g
  const files = []
  let m
  while ((m = re.exec(parts[4]))) files.push(m[1].trim())
  if (files.length) snap67[num] = files
}

const lines = Object.keys(snap67)
  .sort((a, b) => Number(a) - Number(b))
  .map((n) => {
    const arr = snap67[n].map((f) => `W('${f}')`).join(', ')
    return `  ${n}: [${arr}],`
  })
  .join('\n')

let manifest = fs.readFileSync(manifestPath, 'utf8')
manifest = manifest.replace(/( {2}66: \[W\('18\.05\.34\.jpeg'\)\],)\s*\n\}/, `$1\n${lines}\n}`)
fs.writeFileSync(manifestPath, manifest)
