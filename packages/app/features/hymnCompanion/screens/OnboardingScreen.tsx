import { useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Button, PressPresets, Text, XStack, YStack } from '@my/ui'
import { BookOpen, Heart, ListMusic, Music2 } from '@tamagui/lucide-icons'
import { setOnboardingComplete } from '../storage/onboarding'

const { width } = Dimensions.get('window')

const slides = [
  {
    icon: BookOpen,
    title: 'Start with Scripture',
    body: 'See today’s passage or enter your sermon text. The app never replaces your discernment; it supports it.',
    colors: ['#335CFF', '#628DFF'] as const,
  },
  {
    icon: ListMusic,
    title: 'Match the message',
    body: 'We suggest hymns whose themes fit your sermon’s central message, not random keyword matches.',
    colors: ['#2A4AD4', '#1FC16B'] as const,
  },
  {
    icon: Music2,
    title: 'Prepare with confidence',
    body: 'Review why each hymn fits, save your preparation, and revisit it offline before service.',
    colors: ['#178D4E', '#335CFF'] as const,
  },
]

export function OnboardingScreen() {
  const router = useRouter()
  const [index, setIndex] = useState(0)
  const finishing = useRef(false)

  const slide = slides[index] ?? slides[0]
  const Icon = slide.icon
  const isLast = index >= slides.length - 1

  const finish = async () => {
    if (finishing.current) return
    finishing.current = true
    await setOnboardingComplete()
    router.replace('/(tabs)/today')
  }

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
    >
      <LinearGradient
        colors={[...slide.colors]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 32 }}
      >
        <Button
          unstyled
          {...PressPresets.listItem}
          alignSelf="flex-end"
          onPress={() => void finish()}
        >
          <Text
            color="white"
            fontWeight="600"
            opacity={0.95}
          >
            Skip
          </Text>
        </Button>

        <YStack
          flex={1}
          justifyContent="center"
          alignItems="center"
          gap="$5"
          paddingHorizontal="$2"
        >
          <YStack
            width={100}
            height={100}
            borderRadius={24}
            backgroundColor="rgba(255,255,255,0.2)"
            alignItems="center"
            justifyContent="center"
          >
            <Icon
              size={44}
              color="white"
            />
          </YStack>
          <Text
            fontSize={28}
            fontWeight="800"
            color="white"
            textAlign="center"
          >
            {slide.title}
          </Text>
          <Text
            fontSize={17}
            lineHeight={26}
            color="rgba(255,255,255,0.95)"
            textAlign="center"
            maxWidth={width - 80}
          >
            {slide.body}
          </Text>
        </YStack>

        <XStack
          justifyContent="center"
          gap="$2"
          marginBottom="$4"
        >
          {slides.map((_, i) => (
            <YStack
              key={i}
              width={i === index ? 24 : 8}
              height={8}
              borderRadius={4}
              backgroundColor={i === index ? 'white' : 'rgba(255,255,255,0.4)'}
            />
          ))}
        </XStack>

        <Button
          size="$5"
          backgroundColor="white"
          color="$blue700"
          fontWeight="700"
          pressStyle={{ scale: 0.98, opacity: 0.95 }}
          animation="quick"
          icon={isLast ? Heart : undefined}
          onPress={() => {
            if (isLast) void finish()
            else setIndex((i) => i + 1)
          }}
        >
          {isLast ? 'Get started' : 'Continue'}
        </Button>
      </LinearGradient>
    </YStack>
  )
}
