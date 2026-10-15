import { Button, PressPresets, Text, XStack, YStack } from '@my/ui'
import type { FellowshipLectionaryDay, ReadingSlot } from '../data/lectionary/types'
import {
  isBsgRequiredDay,
  isMpEpChoiceDay,
  slotLabel,
} from '../data/lectionary/readingRules'
import { listSelectableReferences } from '../data/lectionary/fellowshipLectionary'

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

function SlotChip({
  active,
  label,
  onPress,
}: {
  active: boolean
  label: string
  onPress: () => void
}) {
  return (
    <Button
      size="$3"
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
        fontSize={13}
        color="$color10"
        lineHeight={19}
      >
        {bsgRequired
          ? 'This day uses the daily fellowship reading below.'
          : choiceDay
            ? 'Choose which column from the schedule you are preaching from.'
            : 'Select the reading you are preparing from.'}
      </Text>

      {choiceDay ? (
        <XStack
          flexWrap="wrap"
          gap="$2"
        >
          <SlotChip
            active={value.slot === 'bsg'}
            label="Daily"
            onPress={() => onChange({ slot: 'bsg', index: 0 })}
          />
          {day.mp.length > 0 ? (
            <SlotChip
              active={value.slot === 'mp'}
              label="Morning"
              onPress={() => onChange({ slot: 'mp', index: 0 })}
            />
          ) : null}
          {day.ep.length > 0 ? (
            <SlotChip
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
            fontSize={14}
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
              <Text fontSize={14}>{r.display}</Text>
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
          fontSize={12}
          fontWeight="700"
          color="$blue11"
          textTransform="uppercase"
          letterSpacing={0.6}
        >
          {slotLabel(value.slot)}
        </Text>
        <Text
          fontSize={14}
          color="$color11"
          fontWeight="600"
        >
          {activeRef}
        </Text>
        {choiceDay && value.slot === 'bsg' && (day.mp.length > 0 || day.ep.length > 0) ? (
          <Text
            fontSize={12}
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
