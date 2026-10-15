import { Spinner, Text, YStack } from '@my/ui'

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
          fontSize={15}
          color="$color11"
          textAlign="center"
        >
          {label}
        </Text>
      ) : null}
      {!minimal && sublabel ? (
        <Text
          fontSize={13}
          color="$color10"
          textAlign="center"
          lineHeight={19}
        >
          {sublabel}
        </Text>
      ) : null}
    </YStack>
  )
}
