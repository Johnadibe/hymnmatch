/**
 * Extract ACPPB Songs of Praise PDF → JSON catalogue.
 * Usage: node extractSongsOfPraisePdf.mjs [samplePages]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { PDFParse } from 'pdf-parse'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pdfPath = path.resolve(
  __dirname,
  '../../../../../Songs of Praise - Welcome to acppb-la (1).pdf'
)
const sampleOnly = process.argv[2] === 'sample'

async function main() {
  const buf = fs.readFileSync(pdfPath)
  const parser = new PDFParse({ data: buf })
  const info = await parser.getInfo()
  const textResult = await parser.getText(
    sampleOnly ? { partial: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] } : {}
  )
  await parser.destroy()
  const text = textResult.text ?? textResult.pages?.map((p) => p.text).join('\n\n') ?? ''
  const outDir = path.join(__dirname, '../data/songsOfPraise')
  fs.mkdirSync(outDir, { recursive: true })
  if (sampleOnly) {
    fs.writeFileSync(path.join(outDir, '_sample.txt'), text.slice(0, 20000))
    return
  }
  fs.writeFileSync(path.join(outDir, '_full.txt'), text)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
