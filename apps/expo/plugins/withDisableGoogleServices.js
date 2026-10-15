const fs = require('fs')
const path = require('path')
const {
  AndroidConfig,
  withAndroidColors,
  withAndroidManifest,
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

  config = withAppBuildGradle(config, (gradleConfig) => {
    let contents = gradleConfig.modResults.contents
    contents = contents.replace(
      /\s*apply plugin:\s*['"]com\.google\.gms\.google-services['"]\s*\n?/g,
      '\n'
    )
    gradleConfig.modResults.contents = contents
    return gradleConfig
  })

  config = withDangerousMod(config, [
    'android',
    async (modConfig) => {
      const platformRoot = modConfig.modRequest.platformProjectRoot
      ensureNotificationIconDrawable(platformRoot)

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
