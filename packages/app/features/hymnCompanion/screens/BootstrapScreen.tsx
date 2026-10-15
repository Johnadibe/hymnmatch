import { useCallback, useEffect, useRef } from 'react'
import { ImageBackground, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'
import * as ExpoSplashScreen from 'expo-splash-screen'
import { isOnboardingComplete } from '../storage/onboarding'

const splashImage = require('../assets/splash-bootstrap.png')

const MIN_SPLASH_MS = 900

/**
 * Same PNG as native splash (splash-full.png). Native hides only after this image paints
 * so there is no navy flash or layout jump.
 */
export function BootstrapScreen() {
  const router = useRouter()
  const started = useRef(false)
  const nativeHidden = useRef(false)

  const hideNativeWhenReady = useCallback(() => {
    if (nativeHidden.current) return
    nativeHidden.current = true
    void ExpoSplashScreen.hideAsync()
  }, [])

  useEffect(() => {
    const fallback = setTimeout(() => hideNativeWhenReady(), 1500)
    return () => clearTimeout(fallback)
  }, [hideNativeWhenReady])

  useEffect(() => {
    if (started.current) return
    started.current = true

    void (async () => {
      const delay = new Promise((r) => setTimeout(r, MIN_SPLASH_MS))
      const [complete] = await Promise.all([isOnboardingComplete(), delay])

      if (complete) {
        router.replace('/(tabs)/today')
      } else {
        router.replace('/onboarding')
      }
    })()
  }, [router])

  return (
    <ImageBackground
      source={splashImage}
      style={styles.fill}
      resizeMode="cover"
      onLoadEnd={hideNativeWhenReady}
    />
  )
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
})
