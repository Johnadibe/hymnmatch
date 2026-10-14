import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import * as ExpoSplashScreen from 'expo-splash-screen'
import { LinearGradient } from 'expo-linear-gradient'
import { Text, YStack } from '@my/ui'
import { BookOpen } from '@tamagui/lucide-icons'
import { BrandMark } from '../components/BrandMark'
import { isOnboardingComplete } from '../storage/onboarding'

const MIN_SPLASH_MS = 1100

export function BootstrapScreen() {
  const router = useRouter()
  const started = useRef(false)
  const [taglineVisible, setTaglineVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setTaglineVisible(true), 400)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (started.current) return
    started.current = true

    const bootstrap = async () => {
      const delay = new Promise((r) => setTimeout(r, MIN_SPLASH_MS))
      const [complete] = await Promise.all([isOnboardingComplete(), delay])

      if (complete) {
        router.replace('/(tabs)/today')
      } else {
        router.replace('/onboarding')
      }
      await ExpoSplashScreen.hideAsync()
    }

    void bootstrap()
  }, [router])

  return (
    <LinearGradient
      colors={['#0E1A4D', '#335CFF', '#1FC16B']}
      start={{ x: 0.2, y: 0 }}
      end={{ x: 0.8, y: 1 }}
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 }}
    >
      <YStack
        alignItems="center"
        gap="$2"
      >
        <BrandMark size="splash" />
        <Text
          fontSize={16}
          color="rgba(255,255,255,0.9)"
          textAlign="center"
          marginTop="$4"
        >
          Sermon &amp; Hymn Companion
        </Text>
        {taglineVisible ? (
          <YStack
            flexDirection="row"
            alignItems="center"
            gap="$2"
            marginTop="$3"
          >
            <BookOpen
              size={18}
              color="rgba(255,255,255,0.85)"
            />
            <Text
              fontSize={14}
              color="rgba(255,255,255,0.85)"
            >
              Match the message, not just the words
            </Text>
          </YStack>
        ) : null}
      </YStack>
    </LinearGradient>
  )
}
