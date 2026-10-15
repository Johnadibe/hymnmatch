import { Spinner, Text, YStack } from '@my/ui'
import { TYPE } from '../constants'

type LoadingBlockProps = {
  label?: string
  sublabel?: string
  /** Spinner only — no caption */
  minimal?: boolean
}

export function LoadingBlock({ label, sublabel, minimal }: LoadingBlockProps) {
  return (
    <YStack
      padding="$6"
      alignItems="center"
      justifyContent="center"
      gap="$3"
      minHeight={120}
    >
      <Spinner size="large" />
      {!minimal && label ? (
        <Text
          fontWeight="600"
          {...TYPE.body}
          color="$color11"
          textAlign="center"
        >
          {label}
        </Text>
      ) : null}
      {!minimal && sublabel ? (
        <Text
          {...TYPE.bodySmall}
          color="$color10"
          textAlign="center"
        >
          {sublabel}
        </Text>
      ) : null}
    </YStack>
  )
}
