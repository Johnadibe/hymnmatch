/**
 * Expo may re-write Theme.App.SplashScreen after config plugins. Force full-bleed splash.
 * Run after prebuild: node apps/expo/scripts/patch-android-splash.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const expoRoot = path.join(__dirname, '..')
const androidRes = path.join(expoRoot, 'android', 'app', 'src', 'main', 'res')
const stylesPath = path.join(androidRes, 'values', 'styles.xml')
const splashSource = path.join(expoRoot, 'assets', 'splash-full.png')

const splashBackgroundXml = `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
  <item>
    <bitmap android:gravity="fill" android:src="@drawable/splashscreen_full_bleed"/>
  </item>
</layer-list>
`

const splashStyleBlock = `<style name="Theme.App.SplashScreen" parent="AppTheme">
    <item name="android:windowBackground">@drawable/splashscreen_full_bleed_background</item>
  </style>`

if (!fs.existsSync(stylesPath)) {
  console.warn('patch-android-splash: no android project — skip')
  process.exit(0)
}

if (!fs.existsSync(splashSource)) {
  console.error('Missing splash-full.png — run: yarn generate-brand-assets')
  process.exit(1)
}

const drawableDir = path.join(androidRes, 'drawable')
fs.mkdirSync(drawableDir, { recursive: true })
fs.writeFileSync(path.join(drawableDir, 'splashscreen_full_bleed_background.xml'), splashBackgroundXml)

for (const folder of [
  'drawable',
  'drawable-mdpi',
  'drawable-hdpi',
  'drawable-xhdpi',
  'drawable-xxhdpi',
  'drawable-xxxhdpi',
]) {
  const dir = path.join(androidRes, folder)
  fs.mkdirSync(dir, { recursive: true })
  fs.copyFileSync(splashSource, path.join(dir, 'splashscreen_full_bleed.png'))
}

let styles = fs.readFileSync(stylesPath, 'utf8')
const next = styles.replace(/<style name="Theme\.App\.SplashScreen"[\s\S]*?<\/style>/, splashStyleBlock)
if (next === styles) {
  console.error('patch-android-splash: Theme.App.SplashScreen block not found')
  process.exit(1)
}
fs.writeFileSync(stylesPath, next)
console.log('Patched Android splash to full-bleed HymnMatch screen')
