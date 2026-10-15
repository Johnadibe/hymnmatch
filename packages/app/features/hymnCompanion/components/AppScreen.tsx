import type { ReactNode } from 'react'
import { ScrollView, YStack } from '@my/ui'
import { GradientHeader } from './GradientHeader'

type AppScreenProps = {
  title: string
  subtitle?: string
  headerExtra?: ReactNode
  headerRight?: ReactNode
  children: ReactNode
  scroll?: boolean
  onBack?: () => void
}

export function AppScreen({
  title,
  subtitle,
  headerExtra,
  headerRight,
  children,
  scroll = true,
  onBack,
}: AppScreenProps) {
  const body = (
    <YStack
      flex={scroll ? undefined : 1}
      padding="$4"
      paddingBottom="$8"
      gap="$4"
      maxWidth={720}
      alignSelf="center"
      width="100%"
    >
      {children}
    </YStack>
  )

  return (
    <YStack
      flex={1}
      backgroundColor="$background"
    >
      <GradientHeader
        title={title}
        subtitle={subtitle}
        onBack={onBack}
        headerRight={headerRight}
      >
        {headerExtra}
      </GradientHeader>
      {scroll ? (
        <ScrollView
          flex={1}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, paddingBottom: 8 }}
        >
          {body}
        </ScrollView>
      ) : (
        body
      )}
    </YStack>
  )
}
