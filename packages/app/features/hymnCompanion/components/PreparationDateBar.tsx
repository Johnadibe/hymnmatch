import { useState } from 'react'
import { Button, PressPresets, Text, XStack, YStack } from '@my/ui'
import { Calendar, ChevronLeft, ChevronRight } from '@tamagui/lucide-icons'
import {
  formatDateKey,
  listAllLectionaryDays,
  shiftLectionaryDate,
} from '../data/lectionary/fellowshipLectionary'
import {
  clampToLectionaryRange,
  formatPreparationHeading,
  formatPreparationShort,
  isSameCalendarDay,
  startOfLocalDay,
  upcomingWeekday,
} from '../data/lectionary/preparationDate'
import { TYPE } from '../constants'
import { LectionaryDateSheet } from './LectionaryDateSheet'
import { ScheduleChip } from './ScheduleChip'

type PreparationDateBarProps = {
  value: Date
  onChange: (date: Date) => void
}

export function PreparationDateBar({ value, onChange }: PreparationDateBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const deviceToday = startOfLocalDay(new Date())
  const lectionaryDays = listAllLectionaryDays()
  const valueKey = formatDateKey(value)
  const atMin = lectionaryDays.length > 0 && valueKey === lectionaryDays[0]!.date
  const atMax =
    lectionaryDays.length > 0 && valueKey === lectionaryDays[lectionaryDays.length - 1]!.date

  const shift = (delta: -1 | 1) => {
    onChange(shiftLectionaryDate(value, delta))
  }

  const saturday = upcomingWeekday(deviceToday, 6)
  const sunday = upcomingWeekday(deviceToday, 0)

  return (
    <YStack gap="$3">
      <Text
        {...TYPE.bodySmall}
        color="$color10"
      >
        Choose the day you are preaching on.
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
              {...TYPE.body}
            >
              {formatPreparationShort(value)}
            </Text>
            <Text
              {...TYPE.caption}
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
        <ScheduleChip
          label="Today"
          active={isSameCalendarDay(value, deviceToday)}
          onPress={() => onChange(clampToLectionaryRange(deviceToday))}
        />
        <ScheduleChip
          label="This Saturday"
          active={isSameCalendarDay(value, saturday)}
          onPress={() => onChange(saturday)}
        />
        <ScheduleChip
          label="This Sunday"
          active={isSameCalendarDay(value, sunday)}
          onPress={() => onChange(sunday)}
        />
      </XStack>

      {!isSameCalendarDay(value, deviceToday) ? (
        <Text
          {...TYPE.caption}
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
