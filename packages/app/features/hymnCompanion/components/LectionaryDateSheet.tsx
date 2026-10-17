import { useMemo } from 'react'
import { FlatList, Modal, Pressable, StyleSheet, Text as RNText, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Button, PressPresets, Text, YStack } from '@my/ui'
import { X } from '@tamagui/lucide-icons'
import { formatDateKey, listAllLectionaryDays } from '../data/lectionary/fellowshipLectionary'
import { formatPreparationHeading, parseDateKey } from '../data/lectionary/preparationDate'
import type { FellowshipLectionaryDay } from '../data/lectionary/types'

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
  const insets = useSafeAreaInsets()
  const selectedKey = formatDateKey(selected)
  const rows = useMemo(() => listAllLectionaryDays(), [])

  if (!open) return null

  return (
    <Modal
      visible
      animationType="slide"
      transparent
      onRequestClose={() => onOpenChange(false)}
    >
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={() => onOpenChange(false)}
          accessibilityLabel="Close date list"
        />
        <View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <YStack
            padding="$4"
            gap="$3"
            flex={1}
          >
            <YStack
              flexDirection="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Text
                fontSize={18}
                fontWeight="800"
              >
                Choose service date
              </Text>
              <Button
                size="$3"
                circular
                {...PressPresets.filter}
                icon={X}
                onPress={() => onOpenChange(false)}
                aria-label="Close"
              />
            </YStack>
            <Text
              fontSize={13}
              color="$color10"
            >
              Dates from the ACPPB Daily Bread Guide (2026 edition).
            </Text>
            <FlatList
              data={rows}
              keyExtractor={(item) => item.date}
              style={styles.list}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <DateRow
                  day={item}
                  active={item.date === selectedKey}
                  onPress={() => {
                    onSelect(parseDateKey(item.date))
                    onOpenChange(false)
                  }}
                />
              )}
            />
          </YStack>
        </View>
      </View>
    </Modal>
  )
}

function DateRow({
  day,
  active,
  onPress,
}: {
  day: FellowshipLectionaryDay
  active: boolean
  onPress: () => void
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        active ? styles.rowActive : null,
        pressed ? styles.rowPressed : null,
      ]}
    >
      <RNText style={[styles.rowTitle, active ? styles.rowTitleActive : null]}>
        {formatPreparationHeading(parseDateKey(day.date))}
      </RNText>
      <RNText style={styles.rowSub}>
        {day.marketDay} · {day.bsg}
      </RNText>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: 320,
  },
  list: {
    flex: 1,
  },
  row: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    backgroundColor: '#FAFAFA',
    marginBottom: 8,
  },
  rowActive: {
    borderColor: '#335CFF',
    backgroundColor: '#EEF2FF',
  },
  rowPressed: {
    opacity: 0.9,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#171717',
  },
  rowTitleActive: {
    color: '#2A4AD4',
  },
  rowSub: {
    fontSize: 13,
    color: '#737373',
    marginTop: 4,
  },
})
