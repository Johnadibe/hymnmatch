/**
 * Regenerate launcher icons and bootstrap splash PNG (native + in-app must match).
 * Run: cd apps/expo && yarn generate-brand-assets
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Jimp from 'jimp-compact'
import sharp from 'sharp'
import {
  GAP_AFTER_LOGO,
  GRADIENT_COLORS,
  GRADIENT_END,
  GRADIENT_START,
  LOGO_DIAMETER,
  SPLASH_H,
  SPLASH_W,
  TITLE_FONT_PX,
} from './splash-layout.constants.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const assetsDir = path.join(__dirname, '..', 'assets')
const hymnCompanionAssets = path.join(
  __dirname,
  '..',
  '..',
  '..',
  'packages',
  'app',
  'features',
  'hymnCompanion',
  'assets'
)
const sourcePath = path.join(assetsDir, 'acppb-logo-source.jpg')

const ICON_SIZE = 1024
const LOGO_SCALE = 0.62

function mixColor(c1, c2, t) {
  const r = Math.round(c1.r + (c2.r - c1.r) * t)
  const g = Math.round(c1.g + (c2.g - c1.g) * t)
  const b = Math.round(c1.b + (c2.b - c1.b) * t)
  return { r, g, b }
}

function expoLinearGradientColor(x, y) {
  const sx = GRADIENT_START.x * SPLASH_W
  const sy = GRADIENT_START.y * SPLASH_H
  const ex = GRADIENT_END.x * SPLASH_W
  const ey = GRADIENT_END.y * SPLASH_H
  const dx = ex - sx
  const dy = ey - sy
  const len2 = dx * dx + dy * dy
  const px = x - sx
  const py = y - sy
  let t = len2 === 0 ? 0 : (px * dx + py * dy) / len2
  t = Math.max(0, Math.min(1, t))
  if (t <= 0.5) {
    return mixColor(GRADIENT_COLORS[0], GRADIENT_COLORS[1], t / 0.5)
  }
  return mixColor(GRADIENT_COLORS[1], GRADIENT_COLORS[2], (t - 0.5) / 0.5)
}

async function buildLauncherIcon() {
  const logo = await Jimp.read(sourcePath)
  logo.scaleToFit(ICON_SIZE * LOGO_SCALE, ICON_SIZE * LOGO_SCALE, Jimp.RESIZE_BICUBIC)

  const icon = new Jimp(ICON_SIZE, ICON_SIZE, 0xffffffff)
  icon.composite(logo, (ICON_SIZE - logo.bitmap.width) / 2, (ICON_SIZE - logo.bitmap.height) / 2)

  const iconPath = path.join(assetsDir, 'icon.png')
  const adaptivePath = path.join(assetsDir, 'adaptive-icon.png')
  await icon.writeAsync(iconPath)
  await icon.writeAsync(adaptivePath)
  console.log('Wrote icon.png, adaptive-icon.png')
}

async function circularLogoBuffer() {
  const resized = await sharp(sourcePath)
    .resize(LOGO_DIAMETER, LOGO_DIAMETER, { fit: 'cover', position: 'centre' })
    .png()
    .toBuffer()

  const mask = Buffer.from(
    `<svg width="${LOGO_DIAMETER}" height="${LOGO_DIAMETER}"><circle cx="${LOGO_DIAMETER / 2}" cy="${LOGO_DIAMETER / 2}" r="${LOGO_DIAMETER / 2}" fill="white"/></svg>`
  )

  return sharp(resized).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer()
}

function wordmarkSvg(titleY) {
  return Buffer.from(
    `<svg width="${SPLASH_W}" height="${SPLASH_H}" xmlns="http://www.w3.org/2000/svg">
  <text x="${SPLASH_W / 2}" y="${titleY}" text-anchor="middle" font-family="Plus Jakarta Sans, Arial, Helvetica, sans-serif" font-size="${TITLE_FONT_PX}" font-weight="800" letter-spacing="-2">
    <tspan fill="#FFFFFF">Hymn</tspan><tspan fill="#FFD54F">Match</tspan>
  </text>
</svg>`
  )
}

function computeLayout() {
  const titleLine = TITLE_FONT_PX
  const blockHeight = LOGO_DIAMETER + GAP_AFTER_LOGO + titleLine
  const logoY = Math.round((SPLASH_H - blockHeight) / 2)
  const titleY = logoY + LOGO_DIAMETER + GAP_AFTER_LOGO + titleLine * 0.85
  return { logoY, titleY }
}

async function buildSplashFull() {
  const splash = new Jimp(SPLASH_W, SPLASH_H)
  splash.scan(0, 0, SPLASH_W, SPLASH_H, function (x, y) {
    const { r, g, b } = expoLinearGradientColor(x, y)
    this.setPixelColor(Jimp.rgbaToInt(r, g, b, 255), x, y)
  })

  const layout = computeLayout()
  const logoBuffer = await circularLogoBuffer()
  const logoLeft = Math.round((SPLASH_W - LOGO_DIAMETER) / 2)

  const baseBuffer = await splash.getBufferAsync(Jimp.MIME_PNG)
  const outExpo = path.join(assetsDir, 'splash-full.png')
  const outApp = path.join(hymnCompanionAssets, 'splash-bootstrap.png')

  await sharp(baseBuffer)
    .composite([
      { input: logoBuffer, top: layout.logoY, left: logoLeft },
      { input: wordmarkSvg(layout.titleY), top: 0, left: 0 },
    ])
    .png()
    .toFile(outExpo)

  fs.copyFileSync(outExpo, outApp)
  console.log('Wrote splash-full.png + packages/.../splash-bootstrap.png')
}

async function main() {
  if (!fs.existsSync(sourcePath)) {
    console.error('Missing', sourcePath)
    process.exit(1)
  }

  fs.mkdirSync(hymnCompanionAssets, { recursive: true })
  await buildLauncherIcon()
  await buildSplashFull()
  fs.copyFileSync(sourcePath, path.join(hymnCompanionAssets, 'acppb-logo.jpg'))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
