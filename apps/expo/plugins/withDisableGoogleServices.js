const fs = require('fs')
const path = require('path')
const { withAppBuildGradle, withDangerousMod } = require('expo/config-plugins')

/**
 * HymnMatch does not use Firebase. EAS may inject google-services.json from stale FCM
 * credentials (wrong Android package). Remove the file and Gradle plugin so release builds succeed.
 */
function withDisableGoogleServices(config) {
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
      const jsonPath = path.join(
        modConfig.modRequest.platformProjectRoot,
        'app',
        'google-services.json'
      )
      if (fs.existsSync(jsonPath)) {
        fs.unlinkSync(jsonPath)
      }
      return modConfig
    },
  ])

  return config
}

module.exports = withDisableGoogleServices
