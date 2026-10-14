'use client'

import type { ReactNode } from 'react'
import { YStack } from 'tamagui'

type ScreenLoadingOverlayProps = {
  /** @deprecated Use early-return skeleton instead of overlay */
  visible: boolean
  children?: ReactNode
  skeleton?: ReactNode
}

/**
 * Prefer returning a skeleton screen directly instead of this overlay.
 * Kept for gradual migration of older screens.
 */
export function ScreenLoadingOverlay({ visible, children, skeleton }: ScreenLoadingOverlayProps) {
  if (visible && skeleton) {
    return <>{skeleton}</>
  }

  return <YStack flex={1}>{children}</YStack>
}