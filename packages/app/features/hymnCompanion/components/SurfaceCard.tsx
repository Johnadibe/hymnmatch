import type { ReactNode } from 'react'
import { YStack } from '@my/ui'

type SurfaceCardProps = {
  children: ReactNode
  accent?: 'blue' | 'green' | 'amber' | 'neutral'
}

const accentBorder = {
  blue: '$blue6',
  green: '$green6',
  amber: '$orange7',
  neutral: '$borderColor',
} as const

export function SurfaceCard({ children, accent = 'neutral' }: SurfaceCardProps) {
  return (
    <YStack
      padding="$4"
      borderRadius="$5"
      backgroundColor="$backgroundStrong"
      borderWidth={1}
      borderColor={accentBorder[accent]}
      gap="$3"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 4 }}
      shadowOpacity={0.08}
      shadowRadius={12}
      elevation={2}
    >
      {children}
    </YStack>
  )
}
