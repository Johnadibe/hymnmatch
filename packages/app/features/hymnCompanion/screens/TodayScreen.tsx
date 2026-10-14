import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { Button, PressPresets, Text, XStack } from '@my/ui'
import { ChevronRight, RefreshCw, Sparkles } from '@tamagui/lucide-icons'
import { AppScreen } from '../components/AppScreen'
import { ErrorPanel } from '../components/ErrorPanel'
import { HymnInput } from '../components/HymnInput'
import { LoadingBlock } from '../components/LoadingBlock'
import { PreparationDateBar } from '../components/PreparationDateBar'
import {
  ReadingSlotPicker,
  type ReadingPickerValue,
} from '../components/ReadingSlotPicker'
import { SurfaceCard } from '../components/SurfaceCard'
import { getFellowshipDay } from '../data/lectionary/fellowshipLectionary'
import {
  clampToLectionaryRange,
  formatPreparationShort,
  isSameCalendarDay,
  startOfLocalDay,
} from '../data/lectionary/preparationDate'
import type { FellowshipLectionaryDay } from '../data/lectionary/types'
import { fetchFellowshipDailyReading } from '../services/fellowshipReading'
import { fetchPassageText } from '../services/fetchPassage'
import { explainLoadPassageError } from '../utils/friendlyErrors'
import type { DailyReading } from '../types'

const defaultPicker: ReadingPickerValue = { slot: 'bsg', index: 0 }

export function TodayScreen() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(() =>
    clampToLectionaryRange(startOfLocalDay(new Date()))
  )
  const [scheduleDay, setScheduleDay] = useState<FellowshipLectionaryDay | null>(null)
  const [reading, setReading] = useState<DailyReading | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [themeHint, setThemeHint] = useState('')
  const [customReference, setCustomReference] = useState('')
  const [finding, setFinding] = useState(false)
  const [picker, setPicker] = useState<ReadingPickerValue>(defaultPicker)

  const loadReading = useCallback(
    async (options?: {
      customRef?: string
      pickerValue?: ReadingPickerValue
      preferNetwork?: boolean
      forDate?: Date
    }) => {
      setLoading(true)
      setError(null)
      const targetDate = clampToLectionaryRange(options?.forDate ?? selectedDate)
      try {
        if (options?.customRef?.trim()) {
          const scripture = await fetchPassageText(options.customRef.trim(), {
            preferNetwork: options.preferNetwork,
          })
          const dateKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`
          setScheduleDay(null)
          setReading({
            date: dateKey,
            reference: scripture.reference,
            title: 'Custom passage',
            sourceLabel: 'Custom reference',
            passages: [options.customRef.trim()],
            text: scripture.text,
            translationName: scripture.translationName,
            textDelivery: scripture.delivery,
          })
        } else {
          const day = getFellowshipDay(targetDate)
          setScheduleDay(day ?? null)
          const selection = options?.pickerValue ?? picker
          setReading(
            await fetchFellowshipDailyReading(
              targetDate,
              {
                slot: selection.slot,
                index: selection.index,
              },
              { preferNetwork: options.preferNetwork }
            )
          )
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load reading')
        setReading(null)
      } finally {
        setLoading(false)
      }
    },
    [picker, selectedDate]
  )

  useEffect(() => {
    void loadReading({ forDate: selectedDate, pickerValue: defaultPicker })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- initial load only
  }, [])

  const onPreparationDateChange = (date: Date) => {
    const clamped = clampToLectionaryRange(date)
    setSelectedDate(clamped)
    setPicker(defaultPicker)
    setCustomReference('')
    void loadReading({ forDate: clamped, pickerValue: defaultPicker })
  }

  const onPickerChange = (value: ReadingPickerValue) => {
    setPicker(value)
    void loadReading({ forDate: selectedDate, pickerValue: value })
  }

  const onFindHymns = async () => {
    if (!reading) return
    setFinding(true)
    try {
      const { setActiveReading } = await import('../storage/sessionReading')
      await setActiveReading(reading)
      router.push({
        pathname: '/suggestions',
        params: { themeHint: themeHint.trim() },
      })
    } finally {
      setFinding(false)
    }
  }

  const err = error ? explainLoadPassageError(error) : null
  const deviceToday = startOfLocalDay(new Date())
  const preparingToday = isSameCalendarDay(selectedDate, deviceToday)
  const screenTitle = preparingToday
    ? "Today's sermon text"
    : `Prepare for ${formatPreparationShort(selectedDate)}`

  return (
    <AppScreen
      title={screenTitle}
      subtitle="Pick the service date, then BSG daily. On Mon, Tue, Thu and Sat you may choose MP or EP."
      headerExtra={
        <Button
          size="$3"
          marginTop="$2"
          alignSelf="flex-start"
          backgroundColor="rgba(255,255,255,0.2)"
          borderWidth={1}
          borderColor="rgba(255,255,255,0.35)"
          color="white"
          icon={RefreshCw}
          pressStyle={PressPresets.filter.pressStyle}
          animation={PressPresets.filter.animation}
          disabled={loading}
          onPress={() =>
            void loadReading({
              forDate: selectedDate,
              pickerValue: picker,
              preferNetwork: true,
            })
          }
        >
          Refresh
        </Button>
      }
    >
      <SurfaceCard accent="blue">
        <PreparationDateBar
          value={selectedDate}
          onChange={onPreparationDateChange}
        />
      </SurfaceCard>

      {err ? (
        <ErrorPanel
          title={err.title}
          message={err.message}
          hint={err.hint}
          onRetry={() =>
            void loadReading({
              forDate: selectedDate,
              pickerValue: picker,
            })
          }
        />
      ) : null}

      {scheduleDay ? (
        <SurfaceCard accent="green">
          <ReadingSlotPicker
            date={selectedDate}
            day={scheduleDay}
            value={picker}
            onChange={onPickerChange}
          />
        </SurfaceCard>
      ) : null}

      <SurfaceCard accent="blue">
        {loading ? (
          <LoadingBlock minimal />
        ) : reading ? (
          <>
            <Text
              fontSize={12}
              color="$color10"
            >
              {reading.date} · {reading.sourceLabel}
              {reading.translationName ? ` · ${reading.translationName}` : ''}
              {reading.textDelivery === 'cache-offline'
                ? ' · saved on device (offline)'
                : reading.textDelivery === 'cache'
                  ? ' · saved on device'
                  : null}
            </Text>
            <Text
              fontSize={22}
              fontWeight="800"
              color="$blue11"
            >
              {reading.reference}
            </Text>
            <Text
              fontSize={16}
              fontWeight="600"
              color="$color11"
            >
              {reading.title}
            </Text>
            <Text
              fontSize={15}
              lineHeight={24}
            >
              {reading.text}
            </Text>
          </>
        ) : !err ? (
          <Text color="$color10">No reading loaded for this date.</Text>
        ) : null}
      </SurfaceCard>

      <SurfaceCard accent="green">
        <Text fontWeight="700">Central theme (optional)</Text>
        <Text
          fontSize={13}
          color="$color10"
        >
          Confirm or refine the sermon message before matching hymns.
        </Text>
        <HymnInput
          value={themeHint}
          onChangeText={setThemeHint}
          placeholder="e.g. Total surrender and transformation"
          size="$4"
        />
      </SurfaceCard>

      <SurfaceCard>
        <Text fontWeight="700">Override with another passage</Text>
        <Text
          fontSize={13}
          color="$color10"
        >
          For preparation outside the printed schedule only.
        </Text>
        <XStack
          gap="$2"
          alignItems="center"
        >
          <HymnInput
            flex={1}
            value={customReference}
            onChangeText={setCustomReference}
            placeholder="e.g. Romans 12:1-2"
            size="$4"
          />
          <Button
            {...PressPresets.secondary}
            onPress={() => void loadReading({ customRef: customReference, forDate: selectedDate })}
            disabled={!customReference.trim() || loading}
          >
            Load
          </Button>
        </XStack>
      </SurfaceCard>

      <Button
        size="$5"
        {...PressPresets.primary}
        disabled={!reading || loading || finding}
        onPress={() => void onFindHymns()}
        icon={Sparkles}
        iconAfter={ChevronRight}
      >
        {finding ? 'Opening…' : 'Find matching hymns'}
      </Button>
    </AppScreen>
  )
}
