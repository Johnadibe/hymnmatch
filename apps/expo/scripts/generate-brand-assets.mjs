/**
 * Regenerate launcher icons and bootstrap splash PNG (native + in-app must match).
 * Run: cd apps/expo && yarn generate-brand-assets
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Jimp from 'jimp-compact'
import sharp from 'sharp'
import {
  GAP_AFTER_LOGO,
  GRADIENT_COLORS,
  GRADIENT_END,
  GRADIENT_START,
  LOGO_DIAMETER,
  MARK_PAD_Y,
  MARK_W,
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
}

async function circularLogoBuffer() {
  const resized = await sharp(sourcePath)
    .modulate({ brightness: 1.12, saturation: 1.15 })
    .resize(LOGO_DIAMETER, LOGO_DIAMETER, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 },
    })
    .png()
    .toBuffer()

  const mask = Buffer.from(
    `<svg width="${LOGO_DIAMETER}" height="${LOGO_DIAMETER}"><circle cx="${LOGO_DIAMETER / 2}" cy="${LOGO_DIAMETER / 2}" r="${LOGO_DIAMETER / 2}" fill="white"/></svg>`
  )

  return sharp(resized)
    .composite([{ input: mask, blend: 'dest-in' }])
    .png()
    .toBuffer()
}

function markHeight() {
  return MARK_PAD_Y + LOGO_DIAMETER + GAP_AFTER_LOGO + TITLE_FONT_PX + MARK_PAD_Y
}

function markSvg(height) {
  const titleY = MARK_PAD_Y + LOGO_DIAMETER + GAP_AFTER_LOGO + TITLE_FONT_PX * 0.82
  const halo = Math.round(LOGO_DIAMETER * 1.08)
  const haloX = Math.round((MARK_W - halo) / 2)
  const haloY = MARK_PAD_Y - Math.round((halo - LOGO_DIAMETER) / 2)
  return Buffer.from(
    `<svg width="${MARK_W}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${MARK_W / 2}" cy="${haloY + halo / 2}" r="${halo / 2 + 18}" fill="rgba(255,255,255,0.22)"/>
  <circle cx="${MARK_W / 2}" cy="${haloY + halo / 2}" r="${halo / 2}" fill="rgba(255,255,255,0.28)"/>
  <text x="${MARK_W / 2}" y="${titleY}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="${TITLE_FONT_PX}" font-weight="800" letter-spacing="-1.5">
    <tspan fill="#FFFFFF" stroke="rgba(0,40,120,0.12)" stroke-width="2">Hymn</tspan><tspan fill="#FFF176">Match</tspan>
  </text>
</svg>`
  )
}

async function buildSplashMark() {
  const height = markHeight()
  const logo = await circularLogoBuffer()
  const logoLeft = Math.round((MARK_W - LOGO_DIAMETER) / 2)
  const markPath = path.join(assetsDir, 'splash-mark.png')

  await sharp({
    create: { width: MARK_W, height, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      { input: markSvg(height), top: 0, left: 0 },
      { input: logo, top: MARK_PAD_Y, left: logoLeft },
    ])
    .png()
    .toFile(markPath)
  return { markPath, height }
}

async function buildSplashFull(markPath) {
  const splash = new Jimp(SPLASH_W, SPLASH_H)
  splash.scan(0, 0, SPLASH_W, SPLASH_H, function (x, y) {
    const { r, g, b } = expoLinearGradientColor(x, y)
    this.setPixelColor(Jimp.rgbaToInt(r, g, b, 255), x, y)
  })

  const mark = await sharp(markPath).png().toBuffer()
  const meta = await sharp(mark).metadata()
  const targetW = 820
  const targetH = Math.round((targetW * meta.height) / meta.width)
  const resized = await sharp(mark).resize(targetW, targetH).png().toBuffer()
  const left = Math.round((SPLASH_W - targetW) / 2)
  const top = Math.round((SPLASH_H - targetH) / 2)

  const outExpo = path.join(assetsDir, 'splash-full.png')
  const outApp = path.join(hymnCompanionAssets, 'splash-bootstrap.png')
  await sharp(await splash.getBufferAsync(Jimp.MIME_PNG))
    .composite([{ input: resized, left, top }])
    .png()
    .toFile(outExpo)
  fs.copyFileSync(outExpo, outApp)
}

async function main() {
  if (!fs.existsSync(sourcePath)) {
    console.error('Missing', sourcePath)
    process.exit(1)
  }

  fs.mkdirSync(hymnCompanionAssets, { recursive: true })
  await buildLauncherIcon()
  const { markPath } = await buildSplashMark()
  await buildSplashFull(markPath)
  fs.copyFileSync(sourcePath, path.join(hymnCompanionAssets, 'acppb-logo.jpg'))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
