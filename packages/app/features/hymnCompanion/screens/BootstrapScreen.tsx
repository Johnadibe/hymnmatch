import { useEffect, useRef } from 'react'
import { useRouter } from 'expo-router'
import * as ExpoSplashScreen from 'expo-splash-screen'
import { isOnboardingComplete } from '../storage/onboarding'

const MIN_SPLASH_MS = 1100

/**
 * No second splash UI. The native splash stays up, then this routes straight to
 * onboarding (first launch) or Today and removes the native splash with no fade.
 */
export function BootstrapScreen() {
  const router = useRouter()
  const started = useRef(false)

  useEffect(() => {
    if (started.current) return
    started.current = true

    void (async () => {
      const delay = new Promise((r) => setTimeout(r, MIN_SPLASH_MS))
      const [complete] = await Promise.all([isOnboardingComplete(), delay])

      router.replace(complete ? '/(tabs)/today' : '/onboarding')

      setTimeout(() => {
        void ExpoSplashScreen.hideAsync()
      }, 60)
    })()
  }, [router])

  return null
}
