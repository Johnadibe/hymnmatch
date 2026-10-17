import type { ReactNode } from 'react'
import { View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Text, YStack } from '@my/ui'
import { ChevronLeft } from '@tamagui/lucide-icons'
import { BrandMark } from './BrandMark'
import { HeaderIconButton } from './HeaderIconButton'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

type GradientHeaderProps = {
  title: string
  subtitle?: string
  children?: ReactNode
  onBack?: () => void
  /** Icon actions on the right (stack screens only), e.g. refresh. */
  headerRight?: ReactNode
}

export function GradientHeader({
  title,
  subtitle,
  children,
  onBack,
  headerRight,
}: GradientHeaderProps) {
  const insets = useSafeAreaInsets()
  const isStack = Boolean(onBack)

  return (
    <LinearGradient
      colors={['#335CFF', '#2A4AD4', '#1FC16B']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        paddingTop: insets.top + 8,
        paddingBottom: isStack ? 16 : 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
      }}
    >
      <YStack gap="$3">
        {isStack ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              minHeight: 40,
            }}
          >
            <HeaderIconButton
              onPress={onBack!}
              accessibilityLabel="Go back"
            >
              <ChevronLeft
                size={24}
                color="white"
                strokeWidth={2.25}
              />
            </HeaderIconButton>
            {headerRight ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {headerRight}
              </View>
            ) : (
              <View style={{ width: 40, height: 40 }} />
            )}
          </View>
        ) : (
          <YStack
            marginBottom="$5"
            paddingBottom="$2"
          >
            <BrandMark />
          </YStack>
        )}

        <YStack
          gap="$2"
          marginTop="$1"
        >
          <Text
            fontSize={isStack ? 22 : 24}
            fontWeight="800"
            color="white"
            lineHeight={isStack ? 28 : 30}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              fontSize={16}
              lineHeight={24}
              color="rgba(255,255,255,0.92)"
              numberOfLines={isStack ? 3 : undefined}
            >
              {subtitle}
            </Text>
          ) : null}
        </YStack>

        {children ? <YStack marginTop="$1">{children}</YStack> : null}
      </YStack>
    </LinearGradient>
  )
}
