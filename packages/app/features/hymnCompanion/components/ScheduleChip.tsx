import { Button, PressPresets, Text } from '@my/ui'

type ScheduleChipProps = {
  label: string
  active: boolean
  onPress: () => void
}

/** Shared filter chip for date shortcuts and Daily Bread / Morning / Evening. */
export function ScheduleChip({ label, active, onPress }: ScheduleChipProps) {
  return (
    <Button
      size="$3"
      minHeight={44}
      paddingHorizontal="$3"
      {...PressPresets.filter}
      backgroundColor={active ? '$blue9' : '$backgroundStrong'}
      borderWidth={1}
      borderColor={active ? '$blue9' : '$borderColor'}
      onPress={onPress}
    >
      <Text
        fontSize={14}
        fontWeight={active ? '700' : '600'}
        color={active ? 'white' : '$color11'}
      >
        {label}
      </Text>
    </Button>
  )
}
