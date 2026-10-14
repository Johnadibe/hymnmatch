import { useState } from 'react'
import { Button, PressPresets, Text, XStack, YStack } from '@my/ui'
import { Calendar, ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import {
  addCalendarDays,
  clampToLectionaryRange,
  formatPreparationHeading,
  formatPreparationShort,
  getLectionaryBounds,
  isSameCalendarDay,
  startOfLocalDay,
  upcomingWeekday,
} from '../data/lectionary/preparationDate'
import { LectionaryDateSheet } from './LectionaryDateSheet'

type PreparationDateBarProps = {
  value: Date
  onChange: (date: Date) => void
}

function QuickChip({
  label,
  active,
  onPress,
}: {
  label: string
  active: boolean
  onPress: () => void
}) {
  return (
    <Button
      size="$2"
      {...PressPresets.filter}
      backgroundColor={active ? '$blue9' : '$backgroundStrong'}
      color={active ? 'white' : '$color11'}
      borderWidth={1}
      borderColor={active ? '$blue9' : '$borderColor'}
      onPress={onPress}
    >
      {label}
    </Button>
  )
}

export function PreparationDateBar({ value, onChange }: PreparationDateBarProps) {
  const bounds = getLectionaryBounds()
  const [sheetOpen, setSheetOpen] = useState(false)
  const deviceToday = startOfLocalDay(new Date())
  const atMin = bounds ? value.getTime() <= bounds.min.getTime() : false
  const atMax = bounds ? value.getTime() >= bounds.max.getTime() : false

  const shift = (days: number) => {
    onChange(clampToLectionaryRange(addCalendarDays(value, days)))
  }

  const saturday = upcomingWeekday(deviceToday, 6)
  const sunday = upcomingWeekday(deviceToday, 0)

  return (
    <YStack gap="$3">
      <Text
        fontSize={13}
        color="$color10"
        lineHeight={19}
      >
        Choose the day you are preaching on. Readings and MP/EP rules follow that date.
      </Text>

      <XStack
        alignItems="center"
        gap="$2"
      >
        <Button
          size="$3"
          circular
          {...PressPresets.filter}
          disabled={atMin}
          icon={ChevronLeft}
          onPress={() => shift(-1)}
          aria-label="Previous day"
        />
        <Button
          flex={1}
          size="$4"
          {...PressPresets.listItem}
          borderWidth={1}
          borderColor="$borderColor"
          backgroundColor="$backgroundStrong"
          icon={Calendar}
          onPress={() => setSheetOpen(true)}
        >
          <YStack
            flex={1}
            alignItems="flex-start"
          >
            <Text
              fontWeight="700"
              fontSize={15}
            >
              {formatPreparationShort(value)}
            </Text>
            <Text
              fontSize={12}
              color="$color10"
              numberOfLines={1}
            >
              {formatPreparationHeading(value)}
            </Text>
          </YStack>
        </Button>
        <Button
          size="$3"
          circular
          {...PressPresets.filter}
          disabled={atMax}
          icon={ChevronRight}
          onPress={() => shift(1)}
          aria-label="Next day"
        />
      </XStack>

      <XStack
        flexWrap="wrap"
        gap="$2"
      >
        <QuickChip
          label="Today"
          active={isSameCalendarDay(value, deviceToday)}
          onPress={() => onChange(clampToLectionaryRange(deviceToday))}
        />
        <QuickChip
          label="This Saturday"
          active={isSameCalendarDay(value, saturday)}
          onPress={() => onChange(saturday)}
        />
        <QuickChip
          label="This Sunday"
          active={isSameCalendarDay(value, sunday)}
          onPress={() => onChange(sunday)}
        />
      </XStack>

      {!isSameCalendarDay(value, deviceToday) ? (
        <Text
          fontSize={12}
          color="$blue11"
          fontWeight="600"
        >
          Preparing ahead (not today on the calendar).
        </Text>
      ) : null}

      <LectionaryDateSheet
        open={sheetOpen}
        selected={value}
        onOpenChange={setSheetOpen}
        onSelect={onChange}
      />
    </YStack>
  )
}
