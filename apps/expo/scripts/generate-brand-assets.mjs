/**
 * Regenerate launcher icons and full-screen splash from acppb-logo-source.jpg
 * Run from repo root: node apps/expo/scripts/generate-brand-assets.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Jimp from 'jimp-compact'

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
const SPLASH_W = 1080
const SPLASH_H = 1920

function mixColor(c1, c2, t) {
  const r = Math.round(c1.r + (c2.r - c1.r) * t)
  const g = Math.round(c1.g + (c2.g - c1.g) * t)
  const b = Math.round(c1.b + (c2.b - c1.b) * t)
  return Jimp.rgbaToInt(r, g, b, 255)
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

async function buildSplashFull() {
  const top = { r: 0x0e, g: 0x1a, b: 0x4d }
  const mid = { r: 0x33, g: 0x5c, b: 0xff }
  const bottom = { r: 0x1f, g: 0xc1, b: 0x6b }

  const splash = new Jimp(SPLASH_W, SPLASH_H)
  splash.scan(0, 0, SPLASH_W, SPLASH_H, function (x, y) {
    const ty = y / SPLASH_H
    const color = ty < 0.55 ? mixColor(top, mid, ty / 0.55) : mixColor(mid, bottom, (ty - 0.55) / 0.45)
    this.setPixelColor(color, x, y)
  })

  const logo = await Jimp.read(sourcePath)
  logo.scaleToFit(440, 440, Jimp.RESIZE_BICUBIC)
  splash.composite(logo, (SPLASH_W - logo.bitmap.width) / 2, Math.round(SPLASH_H * 0.32))

  const out = path.join(assetsDir, 'splash-full.png')
  await splash.writeAsync(out)
  console.log('Wrote splash-full.png')
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
  console.log('Synced acppb-logo.jpg for in-app BrandMark')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
