'use client'

import type { ComponentProps, ReactNode } from 'react'
import { Sheet } from 'tamagui'

/** Snappy sheet/modal animation — use instead of lazy/medium springs. */
export const FAST_SHEET_ANIMATION = '100ms' as const

/** Dismiss wait when chaining actions after closing a modal. */
export const FAST_MODAL_DISMISS_MS = 100

type OverlayProps = ComponentProps<typeof Sheet.Overlay>
type FastSheetProps = ComponentProps<typeof Sheet>

export function FastSheet({
  animation = FAST_SHEET_ANIMATION,
  dismissOnSnapToBottom = true,
  modal = true,
  ...props
}: FastSheetProps) {
  return (
    <Sheet
      animation={animation}
      dismissOnSnapToBottom={dismissOnSnapToBottom}
      modal={modal}
      {...props}
    />
  )
}

export function FastSheetOverlay({ opacity = 0.5, ...props }: OverlayProps) {
  return (
    <Sheet.Overlay
      animation={FAST_SHEET_ANIMATION}
      opacity={opacity}
      {...props}
    />
  )
}

type FastSheetFrameProps = ComponentProps<typeof Sheet.Frame> & {
  children: ReactNode
}

export function FastSheetFrame({ children, ...props }: FastSheetFrameProps) {
  return <Sheet.Frame {...props}>{children}</Sheet.Frame>
}
