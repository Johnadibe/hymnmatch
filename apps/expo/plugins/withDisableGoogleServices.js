const fs = require('fs')
const path = require('path')
const {
  AndroidConfig,
  withAndroidColors,
  withAndroidManifest,
  withAndroidStyles,
  withAppBuildGradle,
  withDangerousMod,
} = require('expo/config-plugins')

const STRIP_META_NAMES = new Set([
  'com.google.firebase.messaging.default_notification_color',
  'com.google.firebase.messaging.default_notification_icon',
  'com.google.android.gms.wallet.api.enabled',
])

function stripFirebaseManifestMeta(manifestConfig) {
  const application = manifestConfig.modResults.manifest.application?.[0]
  if (application?.['meta-data']) {
    application['meta-data'] = application['meta-data'].filter((entry) => {
      const name = entry.$?.['android:name']
      return !name || !STRIP_META_NAMES.has(name)
    })
  }
  return manifestConfig
}

const splashBackgroundXml = `<?xml version="1.0" encoding="utf-8"?>
<layer-list xmlns:android="http://schemas.android.com/apk/res/android">
  <item>
    <bitmap android:gravity="fill" android:src="@drawable/splashscreen_full_bleed"/>
  </item>
</layer-list>
`

/** Centered icon splash (Android 12+) — remove so only full-bleed PNG shows. */
function removeCenteredSplashIconDrawables(platformRoot) {
  const resRoot = path.join(platformRoot, 'app', 'src', 'main', 'res')
  if (!fs.existsSync(resRoot)) return

  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name)
      if (fs.statSync(full).isDirectory()) {
        walk(full)
        continue
      }
      if (/^splashscreen_logo(\.|$)/.test(name) || name === 'splashscreen.xml') {
        fs.unlinkSync(full)
      }
    }
  }
  walk(resRoot)
}

function installFullScreenSplashAssets(projectRoot, platformRoot) {
  const source = path.join(projectRoot, 'assets', 'splash-full.png')
  if (!fs.existsSync(source)) {
    return
  }

  const resRoot = path.join(platformRoot, 'app', 'src', 'main', 'res')
  const drawableDir = path.join(resRoot, 'drawable')
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
    const dir = path.join(resRoot, folder)
    fs.mkdirSync(dir, { recursive: true })
    fs.copyFileSync(source, path.join(dir, 'splashscreen_full_bleed.png'))
  }

}

function applyFullScreenSplashStyle(styleConfig) {
  const styles = styleConfig.modResults.resources.style
  if (!Array.isArray(styles)) {
    return styleConfig
  }

  styleConfig.modResults.resources.style = [
    ...styles.filter((entry) => entry.$?.name !== 'Theme.App.SplashScreen'),
    {
      $: {
        name: 'Theme.App.SplashScreen',
        parent: 'AppTheme',
      },
      item: [
        {
          $: { name: 'android:windowBackground' },
          _: '@drawable/splashscreen_full_bleed_background',
        },
      ],
    },
  ]
  return styleConfig
}

const splashStyleBlock = `<style name="Theme.App.SplashScreen" parent="AppTheme">
    <item name="android:windowBackground">@drawable/splashscreen_full_bleed_background</item>
  </style>`

/** styles.xml on disk can differ from withAndroidStyles modResults; patch after other mods. */
function patchSplashStylesOnDisk(platformRoot) {
  const stylesPath = path.join(platformRoot, 'app', 'src', 'main', 'res', 'values', 'styles.xml')
  if (!fs.existsSync(stylesPath)) {
    return
  }
  const styles = fs.readFileSync(stylesPath, 'utf8')
  const next = styles.replace(/<style name="Theme\.App\.SplashScreen"[\s\S]*?<\/style>/, splashStyleBlock)
  if (next !== styles) {
    fs.writeFileSync(stylesPath, next)
  }
}

function ensureNotificationIconDrawable(platformRoot) {
  const drawableDir = path.join(platformRoot, 'app', 'src', 'main', 'res', 'drawable')
  fs.mkdirSync(drawableDir, { recursive: true })
  const iconPath = path.join(drawableDir, 'notification_icon.xml')
  if (fs.existsSync(iconPath)) {
    return
  }
  fs.writeFileSync(
    iconPath,
    `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="24dp"
    android:height="24dp"
    android:viewportWidth="24"
    android:viewportHeight="24">
  <path
    android:fillColor="#FFFFFF"
    android:pathData="M12,3c-4.97,0 -9,4.03 -9,9v7l-2,2v1h22v-1l-2,-2v-7c0,-4.97 -4.03,-9 -9,-9z"/>
</vector>
`
  )
}

/**
 * HymnMatch does not use Firebase push or Google Pay. EAS may inject FCM files and
 * manifest entries from stale credentials; neutralize them so release APK builds succeed.
 */
function withDisableGoogleServices(config) {
  config = withAndroidManifest(config, stripFirebaseManifestMeta)

  config = withAndroidColors(config, (colorsConfig) => {
    colorsConfig.modResults = AndroidConfig.Colors.assignColorValue(colorsConfig.modResults, {
      name: 'notification_icon_color',
      value: '#0E1A4D',
    })
    return colorsConfig
  })

  config = withAndroidStyles(config, applyFullScreenSplashStyle)

  config = withAppBuildGradle(config, (gradleConfig) => {
    let contents = gradleConfig.modResults.contents
    contents = contents.replace(
      /\s*apply plugin:\s*['"]com\.google\.gms\.google-services['"]\s*\n?/g,
      '\n'
    )
    if (!contents.includes('patchHymnMatchSplashStyle')) {
      contents += `
// HymnMatch: full-bleed splash after Expo prebuild (EAS + local Gradle)
tasks.register("patchHymnMatchSplashStyle") {
    doLast {
        def stylesFile = file("src/main/res/values/styles.xml")
        if (!stylesFile.exists()) return
        def splashBlock = '<style name="Theme.App.SplashScreen" parent="AppTheme">\\n    <item name="android:windowBackground">@drawable/splashscreen_full_bleed_background</item>\\n  </style>'
        def text = stylesFile.getText("UTF-8")
        def updated = text.replaceAll(
            '(?s)<style name="Theme\\\\.App\\\\.SplashScreen"[^>]*>.*?</style>',
            splashBlock
        )
        if (updated != text) stylesFile.write(updated, "UTF-8")
    }
}
tasks.named("preBuild").configure { dependsOn("patchHymnMatchSplashStyle") }
`
    }
    gradleConfig.modResults.contents = contents
    return gradleConfig
  })

  config = withDangerousMod(config, [
    'android',
    async (modConfig) => {
      const platformRoot = modConfig.modRequest.platformProjectRoot
      const projectRoot = modConfig.modRequest.projectRoot
      installFullScreenSplashAssets(projectRoot, platformRoot)
      removeCenteredSplashIconDrawables(platformRoot)
      ensureNotificationIconDrawable(platformRoot)
      patchSplashStylesOnDisk(platformRoot)

      const jsonPath = path.join(platformRoot, 'app', 'google-services.json')
      if (fs.existsSync(jsonPath)) {
        fs.unlinkSync(jsonPath)
      }
      return modConfig
    },
  ])

  return config
}

module.exports = withDisableGoogleServices
