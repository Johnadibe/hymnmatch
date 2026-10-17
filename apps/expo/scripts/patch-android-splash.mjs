/**
 * Full-bleed bright splash PNG as the only Android launch screen.
 * PNG lives in drawable-nodpi so Android does not density-scale it darker/blurrier.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const expoRoot = path.join(__dirname, '..')
const androidRes = path.join(expoRoot, 'android', 'app', 'src', 'main', 'res')
const stylesPath = path.join(androidRes, 'values', 'styles.xml')
const splashSource = path.join(expoRoot, 'assets', 'splash-mark.png')

const splashBackgroundXml = `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
  <item>
    <shape android:shape="rectangle">
      <gradient
        android:angle="270"
        android:startColor="#2F6BFF"
        android:centerColor="#4E9BFF"
        android:endColor="#5AEBB0"
        android:type="linear" />
    </shape>
  </item>
  <item android:gravity="center" android:width="270dp" android:height="239dp">
    <bitmap android:gravity="fill" android:filter="true" android:antialias="true" android:src="@drawable/splashscreen_mark"/>
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
  console.error('Missing splash-mark.png — run: yarn generate-brand-assets')
  process.exit(1)
}

const drawableDir = path.join(androidRes, 'drawable')
const nodpiDir = path.join(androidRes, 'drawable-nodpi')
fs.mkdirSync(drawableDir, { recursive: true })
fs.mkdirSync(nodpiDir, { recursive: true })
fs.writeFileSync(
  path.join(drawableDir, 'splashscreen_full_bleed_background.xml'),
  splashBackgroundXml
)
fs.writeFileSync(path.join(drawableDir, 'splashscreen_empty.xml'), emptySplashIconXml)
fs.copyFileSync(splashSource, path.join(nodpiDir, 'splashscreen_mark.png'))

for (const folder of [
  'drawable',
  'drawable-mdpi',
  'drawable-hdpi',
  'drawable-xhdpi',
  'drawable-xxhdpi',
  'drawable-xxxhdpi',
  'drawable-nodpi',
]) {
  const scaled = path.join(androidRes, folder, 'splashscreen_full_bleed.png')
  if (fs.existsSync(scaled)) fs.unlinkSync(scaled)
}

let styles = fs.readFileSync(stylesPath, 'utf8')
const next = styles.replace(
  /<style name="Theme\.App\.SplashScreen"[\s\S]*?<\/style>/,
  splashStyleBlock
)
if (next === styles) {
  console.error('patch-android-splash: Theme.App.SplashScreen block not found')
  process.exit(1)
}
fs.writeFileSync(stylesPath, next)
