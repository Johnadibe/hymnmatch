/**
 * Parse extracted PDF text → songsOfPraiseCatalog.json
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const textPath = path.join(__dirname, '../data/songsOfPraise/_full.txt')
const outJson = path.join(__dirname, '../data/songsOfPraise/songsOfPraiseCatalog.json')

function cleanText(raw) {
  let t = raw
    .replace(/\r\n/g, '\n')
    .replace(/\n--\s*\d+\s+of\s+\d+\s*--\n/g, '\n')
    .replace(/\nFaith in Original\s*\n/g, '\n')
    .replace(/\n(\d{1,3})\n(?=\d{1,3}\.\s)/g, '\n')

  // PDF sometimes omits the dot after the song number (e.g. "16 Remember me").
  t = t.replace(/\n(\d{1,3})\s+(?=[A-Za-z"“''])/g, (full, digits) => {
    const n = Number(digits)
    if (n >= 1 && n <= 597) return `\n${digits}. `
    return full
  })
  return t
}

/** Song 247 was merged into 246 in the PDF extract — split at the known boundary. */
function repairEmbedded247(byNum) {
  const s246 = byNum.get(246)
  if (!s246 || byNum.has(247)) return

  const splitAt = s246.lyrics.indexOf('\n“Chineke we si netiti oku ahu kpo oku”')
  if (splitAt < 0) return

  const part246 = s246.lyrics.slice(0, splitAt).trim()
  const part247 = s246.lyrics.slice(splitAt + 1).trim()
  byNum.set(246, { ...s246, lyrics: part246, title: firstLineTitle(part246) })
  byNum.set(247, {
    id: 'sop-247',
    number: 247,
    title: firstLineTitle(part247.replace(/^“[^”]+”[^\n]*\n?/, '')),
    lyrics: part247,
  })
}

function firstLineTitle(body) {
  const lines = body
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
  return lines[0] ?? 'Song'
}

function parseSongs(text) {
  const cleaned = cleanText(text)
  const re = /(\d{1,3})\.\s+/g
  const matches = [...cleaned.matchAll(re)]
  const songs = []

  for (let i = 0; i < matches.length; i++) {
    const num = Number(matches[i][1])
    const contentStart = matches[i].index + matches[i][0].length
    const contentEnd = i + 1 < matches.length ? matches[i + 1].index : cleaned.length
    const chunk = cleaned.slice(contentStart, contentEnd).trim()
    const title = firstLineTitle(chunk)
    songs.push({
      id: `sop-${num}`,
      number: num,
      title,
      lyrics: chunk,
    })
  }
  return songs
}

function main() {
  const text = fs.readFileSync(textPath, 'utf8')
  const songs = parseSongs(text)

  const byNum = new Map()
  for (const s of songs) {
    const prev = byNum.get(s.number)
    if (!prev || s.lyrics.length > prev.lyrics.length) byNum.set(s.number, s)
  }
  repairEmbedded247(byNum)
  const deduped = [...byNum.values()].sort((a, b) => a.number - b.number)

  const missing = []
  for (let n = 1; n <= 597; n++) {
    if (!byNum.has(n)) missing.push(n)
  }

  fs.writeFileSync(outJson, JSON.stringify(deduped))
  if (missing.length) {
    fs.writeFileSync(
      path.join(__dirname, '../data/songsOfPraise/_missing.json'),
      JSON.stringify(missing)
    )
  }
}

main()
