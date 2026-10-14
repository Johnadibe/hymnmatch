import { Button, PressPresets, Text, XStack, YStack } from '@my/ui'
import type { FellowshipLectionaryDay, ReadingSlot } from '../data/lectionary/types'
import { isBsgRequiredDay, isMpEpChoiceDay } from '../data/lectionary/readingRules'
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

export function ReadingSlotPicker({ date, day, value, onChange }: ReadingSlotPickerProps) {
  const bsgRequired = isBsgRequiredDay(date)
  const choiceDay = isMpEpChoiceDay(date)

  const refs = listSelectableReferences(day, value.slot)

  return (
    <YStack gap="$3">
      <Text
        fontSize={13}
        color="$color10"
        lineHeight={19}
      >
        {bsgRequired
          ? 'Wednesday, Friday & Sunday: BSG is the required reading for the fellowship.'
          : choiceDay
            ? 'Monday, Tuesday, Thursday & Saturday: you may preach from BSG, Morning Prayer (MP), or Evening Prayer (EP).'
            : 'Select which scheduled reading you are preparing from.'}
      </Text>

      <XStack
        flexWrap="wrap"
        gap="$2"
      >
        <SlotChip
          active={value.slot === 'bsg'}
          label="BSG"
          onPress={() => onChange({ slot: 'bsg', index: 0 })}
        />
        {choiceDay && day.mp.length > 0 ? (
          <SlotChip
            active={value.slot === 'mp'}
            label="Morning Prayer"
            onPress={() => onChange({ slot: 'mp', index: 0 })}
          />
        ) : null}
        {choiceDay && day.ep.length > 0 ? (
          <SlotChip
            active={value.slot === 'ep'}
            label="Evening Prayer"
            onPress={() => onChange({ slot: 'ep', index: 0 })}
          />
        ) : null}
      </XStack>

      {value.slot !== 'bsg' && refs.length > 1 ? (
        <YStack gap="$2">
          <Text
            fontWeight="600"
            fontSize={14}
          >
            Choose passage
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

      <SurfaceMeta
        bsg={day.bsg}
        mp={day.mp}
        ep={day.ep}
        highlight={value.slot}
      />
    </YStack>
  )
}

function SurfaceMeta({
  bsg,
  mp,
  ep,
  highlight,
}: {
  bsg: string
  mp: string[]
  ep: string[]
  highlight: ReadingSlot
}) {
  return (
    <YStack
      gap="$2"
      padding="$3"
      borderRadius="$4"
      backgroundColor="$background"
    >
      <MetaLine
        label="BSG"
        lines={[bsg]}
        active={highlight === 'bsg'}
      />
      <MetaLine
        label="MP"
        lines={mp}
        active={highlight === 'mp'}
      />
      <MetaLine
        label="EP"
        lines={ep}
        active={highlight === 'ep'}
      />
    </YStack>
  )
}

function MetaLine({
  label,
  lines,
  active,
}: {
  label: string
  lines: string[]
  active: boolean
}) {
  if (lines.length === 0) return null
  return (
    <YStack gap="$1">
      <Text
        fontSize={12}
        fontWeight="700"
        color={active ? '$blue11' : '$color10'}
      >
        {label}
      </Text>
      {lines.map((line) => (
        <Text
          key={line}
          fontSize={13}
          color="$color11"
        >
          {line}
        </Text>
      ))}
    </YStack>
  )
}
