import { Button, PressPresets, Text, YStack } from '@my/ui'
import { TYPE } from '../constants'
import { AlertCircle } from '@tamagui/lucide-icons'

type ErrorPanelProps = {
  title: string
  message: string
  hint?: string
  onRetry?: () => void
  retryLabel?: string
}

export function ErrorPanel({
  title,
  message,
  hint,
  onRetry,
  retryLabel = 'Try again',
}: ErrorPanelProps) {
  return (
    <YStack
      padding="$4"
      borderRadius="$5"
      backgroundColor="$red2"
      borderWidth={1}
      borderColor="$red6"
      gap="$3"
    >
      <YStack
        flexDirection="row"
        alignItems="center"
        gap="$2"
      >
        <AlertCircle
          size={22}
          color="$red10"
        />
        <Text
          color="$red11"
          fontWeight="700"
          {...TYPE.body}
          flex={1}
        >
          {title}
        </Text>
      </YStack>
      <Text
        color="$red11"
        {...TYPE.bodySmall}
      >
        {message}
      </Text>
      {hint ? (
        <Text
          color="$red10"
          {...TYPE.caption}
        >
          {hint}
        </Text>
      ) : null}
      {onRetry ? (
        <Button
          {...PressPresets.primary}
          onPress={onRetry}
          alignSelf="stretch"
          marginTop="$1"
        >
          {retryLabel}
        </Button>
      ) : null}
    </YStack>
  )
}
