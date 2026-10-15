import type { ReactNode } from 'react'
import { Pressable, StyleSheet } from 'react-native'

type HeaderIconButtonProps = {
  onPress: () => void
  accessibilityLabel: string
  children: ReactNode
  disabled?: boolean
}

export function HeaderIconButton({
  onPress,
  accessibilityLabel,
  children,
  disabled,
}: HeaderIconButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={8}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled ? styles.pressed : null,
        disabled ? styles.disabled : null,
      ]}
    >
      {children}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  pressed: {
    backgroundColor: 'rgba(255,255,255,0.32)',
  },
  disabled: {
    opacity: 0.45,
  },
})
