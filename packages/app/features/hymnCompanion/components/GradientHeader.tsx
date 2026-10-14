import type { ReactNode } from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import { Button, PressPresets, Text, XStack, YStack } from '@my/ui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { BrandMark } from './BrandMark'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type GradientHeaderProps = {
  title: string
  subtitle?: string
  children?: ReactNode
  onBack?: () => void
}

export function GradientHeader({ title, subtitle, children, onBack }: GradientHeaderProps) {
  const insets = useSafeAreaInsets()

  return (
    <LinearGradient
      colors={['#335CFF', '#2A4AD4', '#1FC16B']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        paddingTop: insets.top + 12,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
      }}
    >
      <YStack>
        {onBack ? (
          <XStack marginBottom="$2">
            <Button
              unstyled
              {...PressPresets.listItem}
              onPress={onBack}
              icon={ArrowLeft}
              color="white"
            >
              Back
            </Button>
          </XStack>
        ) : null}
        {onBack ? (
          <Text
            fontSize={13}
            fontWeight="700"
            color="rgba(255,255,255,0.85)"
            letterSpacing={1.2}
            textTransform="uppercase"
            marginBottom="$4"
          >
            HymnMatch
          </Text>
        ) : (
          <YStack marginBottom="$4">
            <BrandMark />
          </YStack>
        )}
        <Text
          fontSize={24}
          fontWeight="800"
          color="white"
          marginTop="$1"
          animation="100ms"
          enterStyle={{ opacity: 0, x: -8 }}
          opacity={1}
          x={0}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text
            fontSize={15}
            lineHeight={22}
            color="rgba(255,255,255,0.92)"
            marginTop="$3"
          >
            {subtitle}
          </Text>
        ) : null}
        {children ? <YStack marginTop="$3">{children}</YStack> : null}
      </YStack>
    </LinearGradient>
  )
}
