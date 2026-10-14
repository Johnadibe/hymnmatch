'use client'

import { YStack } from 'tamagui'

export interface GradientBackgroundProps {
  children: React.ReactNode
}

export function GradientBackground({ children }: GradientBackgroundProps) {
  return (
    <YStack
      flex={1}
      backgroundColor="$backgroundStrong"
    >
      {children}
    </YStack>
  )
}
