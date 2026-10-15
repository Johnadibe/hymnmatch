/**
 * Full-bleed bright splash PNG as the only Android launch screen.
 * PNG lives in drawable-nodpi so Android does not density-scale it darker/blurrier.
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
    <bitmap android:gravity="fill" android:filter="true" android:dither="true" android:src="@drawable/splashscreen_full_bleed"/>
  </item>
</layer-list>
`

const emptySplashIconXml = `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android">
  <size android:width="1dp" android:height="1dp" />
  <solid android:color="@android:color/transparent" />
</shape>
`

const splashStyleBlock = `<style name="Theme.App.SplashScreen" parent="Theme.SplashScreen">
    <item name="android:windowBackground">@drawable/splashscreen_full_bleed_background</item>
    <item name="android:forceDarkAllowed">false</item>
    <item name="windowSplashScreenBackground">@android:color/transparent</item>
    <item name="windowSplashScreenAnimatedIcon">@drawable/splashscreen_empty</item>
    <item name="postSplashScreenTheme">@style/AppTheme</item>
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
const nodpiDir = path.join(androidRes, 'drawable-nodpi')
fs.mkdirSync(drawableDir, { recursive: true })
fs.mkdirSync(nodpiDir, { recursive: true })
fs.writeFileSync(path.join(drawableDir, 'splashscreen_full_bleed_background.xml'), splashBackgroundXml)
fs.writeFileSync(path.join(drawableDir, 'splashscreen_empty.xml'), emptySplashIconXml)
fs.copyFileSync(splashSource, path.join(nodpiDir, 'splashscreen_full_bleed.png'))

for (const folder of ['drawable', 'drawable-mdpi', 'drawable-hdpi', 'drawable-xhdpi', 'drawable-xxhdpi', 'drawable-xxxhdpi']) {
  const scaled = path.join(androidRes, folder, 'splashscreen_full_bleed.png')
  if (fs.existsSync(scaled)) fs.unlinkSync(scaled)
}

let styles = fs.readFileSync(stylesPath, 'utf8')
const next = styles.replace(/<style name="Theme\.App\.SplashScreen"[\s\S]*?<\/style>/, splashStyleBlock)
if (next === styles) {
  console.error('patch-android-splash: Theme.App.SplashScreen block not found')
  process.exit(1)
}
fs.writeFileSync(stylesPath, next)
console.log('Patched Android splash to one bright full-bleed screen')
