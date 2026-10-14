import {
  Button,
  FastSheet,
  FastSheetFrame,
  FastSheetOverlay,
  PressPresets,
  ScrollView,
  Sheet,
  Text,
  YStack,
} from '@my/ui'
import { formatDateKey, listAllLectionaryDays } from '../data/lectionary/fellowshipLectionary'
import { formatPreparationHeading, parseDateKey } from '../data/lectionary/preparationDate'

type LectionaryDateSheetProps = {
  open: boolean
  selected: Date
  onOpenChange: (open: boolean) => void
  onSelect: (date: Date) => void
}

export function LectionaryDateSheet({
  open,
  selected,
  onOpenChange,
  onSelect,
}: LectionaryDateSheetProps) {
  const selectedKey = formatDateKey(selected)
  const rows = listAllLectionaryDays()

  return (
    <FastSheet
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[85]}
      position={0}
      dismissOnSnapToBottom
    >
      <FastSheetOverlay />
      <FastSheetFrame
        borderTopLeftRadius="$6"
        borderTopRightRadius="$6"
        padding="$4"
        paddingBottom="$6"
        maxHeight="85%"
      >
        <Sheet.Handle
          bg="$colorMuted"
          mt="$2"
        />
        <YStack gap="$3">
          <Text
            fontSize={18}
            fontWeight="800"
          >
            Choose service date
          </Text>
          <Text
            fontSize={13}
            color="$color10"
          >
            Fellowship lectionary dates only.
          </Text>
          <ScrollView
            maxHeight={420}
            showsVerticalScrollIndicator
          >
            <YStack gap="$2">
              {rows.map((day) => {
                const active = day.date === selectedKey
                return (
                  <Button
                    key={day.date}
                    unstyled
                    {...PressPresets.listItem}
                    padding="$3"
                    borderRadius="$4"
                    borderWidth={1}
                    borderColor={active ? '$blue8' : '$borderColor'}
                    backgroundColor={active ? '$blue2' : '$backgroundStrong'}
                    onPress={() => {
                      onSelect(parseDateKey(day.date))
                      onOpenChange(false)
                    }}
                  >
                    <YStack
                      alignItems="flex-start"
                      gap="$1"
                    >
                      <Text
                        fontWeight="700"
                        fontSize={15}
                        color={active ? '$blue11' : '$color12'}
                      >
                        {formatPreparationHeading(parseDateKey(day.date))}
                      </Text>
                      <Text
                        fontSize={13}
                        color="$color10"
                      >
                        {day.marketDay} · BSG {day.bsg}
                      </Text>
                    </YStack>
                  </Button>
                )
              })}
            </YStack>
          </ScrollView>
        </YStack>
      </FastSheetFrame>
    </FastSheet>
  )
}
