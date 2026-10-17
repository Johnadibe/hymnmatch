import { Button, PressPresets, Text, XStack, YStack } from '@my/ui'
import type { FellowshipLectionaryDay, ReadingSlot } from '../data/lectionary/types'
import { isBsgRequiredDay, isMpEpChoiceDay, slotLabel } from '../data/lectionary/readingRules'
import { listSelectableReferences } from '../data/lectionary/fellowshipLectionary'
import { TYPE } from '../constants'
import { ScheduleChip } from './ScheduleChip'

export type ReadingPickerValue = {
  slot: ReadingSlot
  index: number
}

type ReadingSlotPickerProps = {
  date: Date
  day: FellowshipLectionaryDay
  value: ReadingPickerValue
  onChange: (value: ReadingPickerValue) => void
}

function linesForSlot(day: FellowshipLectionaryDay, slot: ReadingSlot): string[] {
  if (slot === 'bsg') return [day.bsg]
  if (slot === 'mp') return day.mp
  return day.ep
}

export function ReadingSlotPicker({ date, day, value, onChange }: ReadingSlotPickerProps) {
  const bsgRequired = isBsgRequiredDay(date)
  const choiceDay = isMpEpChoiceDay(date)
  const refs = listSelectableReferences(day, value.slot)
  const activeLines = linesForSlot(day, value.slot)
  const activeRef = activeLines[value.index] ?? activeLines[0]

  return (
    <YStack gap="$3">
      <Text
        {...TYPE.bodySmall}
        color="$color10"
      >
        {bsgRequired
          ? 'This day uses the Daily Bread column below.'
          : choiceDay
            ? 'Choose Morning Prayer, Evening Prayer, or Daily Bread from the guide.'
            : 'Select the reading you are preparing from.'}
      </Text>

      {choiceDay ? (
        <XStack
          flexWrap="wrap"
          gap="$2"
        >
          <ScheduleChip
            active={value.slot === 'bsg'}
            label="Daily Bread"
            onPress={() => onChange({ slot: 'bsg', index: 0 })}
          />
          {day.mp.length > 0 ? (
            <ScheduleChip
              active={value.slot === 'mp'}
              label="Morning"
              onPress={() => onChange({ slot: 'mp', index: 0 })}
            />
          ) : null}
          {day.ep.length > 0 ? (
            <ScheduleChip
              active={value.slot === 'ep'}
              label="Evening"
              onPress={() => onChange({ slot: 'ep', index: 0 })}
            />
          ) : null}
        </XStack>
      ) : null}

      {value.slot !== 'bsg' && refs.length > 1 ? (
        <YStack gap="$2">
          <Text
            fontWeight="600"
            {...TYPE.bodySmall}
          >
            Which line?
          </Text>
          {refs.map((r) => (
            <Button
              key={`${value.slot}-${r.index}`}
              unstyled
              {...PressPresets.listItem}
              padding="$3"
              borderRadius="$4"
              borderWidth={1}
              borderColor={value.index === r.index ? '$blue8' : '$borderColor'}
              backgroundColor={value.index === r.index ? '$blue2' : '$backgroundStrong'}
              onPress={() => onChange({ slot: value.slot, index: r.index })}
            >
              <Text {...TYPE.bodySmall}>{r.display}</Text>
            </Button>
          ))}
        </YStack>
      ) : null}

      <YStack
        gap="$1"
        padding="$3"
        borderRadius="$4"
        backgroundColor="$background"
        borderWidth={1}
        borderColor="$blue6"
      >
        <Text
          {...TYPE.caption}
          fontWeight="700"
          color="$blue11"
          textTransform="uppercase"
          letterSpacing={0.6}
        >
          {slotLabel(value.slot)}
        </Text>
        <Text
          {...TYPE.bodySmall}
          color="$color11"
          fontWeight="600"
        >
          {activeRef}
        </Text>
        {choiceDay && value.slot === 'bsg' && (day.mp.length > 0 || day.ep.length > 0) ? (
          <Text
            {...TYPE.caption}
            color="$color10"
            marginTop="$2"
          >
            Morning and evening texts are on the schedule too; switch tabs above if you are
            preaching from those instead.
          </Text>
        ) : null}
      </YStack>
    </YStack>
  )
}
