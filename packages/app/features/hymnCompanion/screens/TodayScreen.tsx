import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'expo-router'
import { Button, PressPresets, Text, XStack } from '@my/ui'
import { RefreshCw } from '@tamagui/lucide-icons'
import { FindMatchingHymnsButton } from '../components/FindMatchingHymnsButton'
import { AppScreen } from '../components/AppScreen'
import { ErrorPanel } from '../components/ErrorPanel'
import { HymnInput } from '../components/HymnInput'
import { LoadingBlock } from '../components/LoadingBlock'
import { PreparationDateBar } from '../components/PreparationDateBar'
import {
  ReadingSlotPicker,
  type ReadingPickerValue,
} from '../components/ReadingSlotPicker'
import { ScripturePassageText } from '../components/ScripturePassageText'
import { SurfaceCard } from '../components/SurfaceCard'
import {
  formatDateKey,
  getFellowshipDay,
  getLectionaryDateRange,
  resolveFellowshipReading,
} from '../data/lectionary/fellowshipLectionary'
import {
  formatPreparationShort,
  getDefaultPreparationDate,
  isSameCalendarDay,
  startOfLocalDay,
} from '../data/lectionary/preparationDate'
import type { FellowshipLectionaryDay } from '../data/lectionary/types'
import { fetchPassageText } from '../services/fetchPassage'
import { explainLoadPassageError } from '../utils/friendlyErrors'
import type { DailyReading } from '../types'

const defaultPicker: ReadingPickerValue = { slot: 'bsg', index: 0 }

export function TodayScreen() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(getDefaultPreparationDate)
  const [scheduleDay, setScheduleDay] = useState<FellowshipLectionaryDay | null>(() =>
    getFellowshipDay(getDefaultPreparationDate()) ?? null
  )
  const [reading, setReading] = useState<DailyReading | null>(null)
  const [textLoading, setTextLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [themeHint, setThemeHint] = useState('')
  const [customReference, setCustomReference] = useState('')
  const [finding, setFinding] = useState(false)
  const [picker, setPicker] = useState<ReadingPickerValue>(defaultPicker)
  const loadSeq = useRef(0)

  const loadReading = useCallback(
    async (options?: {
      customRef?: string
      pickerValue?: ReadingPickerValue
      preferNetwork?: boolean
      forDate?: Date
    }) => {
      const seq = ++loadSeq.current
      const targetDate = options?.forDate ?? selectedDate

      if (options?.customRef?.trim()) {
        setTextLoading(true)
        setError(null)
        setScheduleDay(null)
        try {
          const scripture = await fetchPassageText(options.customRef.trim(), {
            preferNetwork: options.preferNetwork,
          })
          if (seq !== loadSeq.current) return
          const dateKey = formatDateKey(targetDate)
          setReading({
            date: dateKey,
            reference: scripture.reference,
            title: 'Custom passage',
            sourceLabel: 'Custom reference',
            passages: [options.customRef.trim()],
            text: scripture.text,
            verses: scripture.verses,
            translationName: scripture.translationName,
            textDelivery: scripture.delivery,
          })
        } catch (e) {
          if (seq !== loadSeq.current) return
          setError(e instanceof Error ? e.message : 'Failed to load reading')
          setReading(null)
        } finally {
          if (seq === loadSeq.current) setTextLoading(false)
        }
        return
      }

      const day = getFellowshipDay(targetDate)
      setScheduleDay(day ?? null)
      setError(null)

      if (!day) {
        const range = getLectionaryDateRange()
        const hint = range
          ? `Readings are available ${range.start} through ${range.end}. Pick a date from the calendar.`
          : 'No lectionary loaded.'
        setError(`No fellowship reading for this date. ${hint}`)
        setReading(null)
        setTextLoading(false)
        return
      }

      const selection = options?.pickerValue ?? picker
      const chosen = resolveFellowshipReading(day, targetDate, {
        slot: selection.slot,
        index: selection.index,
      })

      const skeleton: DailyReading = {
        date: formatDateKey(targetDate),
        reference: chosen.reference,
        title: `${day.marketDay} · ${day.dayLabel}`,
        sourceLabel: 'ACPPB fellowship lectionary',
        passages: [chosen.reference],
        text: '',
        fellowship: {
          marketDay: day.marketDay,
          dayLabel: day.dayLabel,
          slot: chosen.slot,
          bsg: day.bsg,
          mp: day.mp,
          ep: day.ep,
        },
      }
      setReading(skeleton)
      setTextLoading(true)

      try {
        const scripture = await fetchPassageText(chosen.reference, {
          preferNetwork: options?.preferNetwork,
        })
        if (seq !== loadSeq.current) return
        setReading({
          ...skeleton,
          reference: scripture.reference,
          text: scripture.text,
          verses: scripture.verses,
          translationName: scripture.translationName,
          textDelivery: scripture.delivery,
        })
      } catch (e) {
        if (seq !== loadSeq.current) return
        setError(e instanceof Error ? e.message : 'Failed to load passage text')
      } finally {
        if (seq === loadSeq.current) setTextLoading(false)
      }
    },
    [picker, selectedDate]
  )

  useEffect(() => {
    void loadReading({ forDate: selectedDate, pickerValue: defaultPicker })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount
  }, [])

  const onPreparationDateChange = (date: Date) => {
    setSelectedDate(date)
    setPicker(defaultPicker)
    setCustomReference('')
    void loadReading({ forDate: date, pickerValue: defaultPicker })
  }

  const onPickerChange = (value: ReadingPickerValue) => {
    setPicker(value)
    void loadReading({ forDate: selectedDate, pickerValue: value })
  }

  const onFindHymns = async () => {
    if (!reading?.text?.trim()) return
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
      subtitle="Choose the service date and the reading you will preach from."
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
          disabled={textLoading}
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
        {reading ? (
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
            {textLoading ? (
              <LoadingBlock minimal />
            ) : reading.text ? (
              <ScripturePassageText
                text={reading.text}
                verses={reading.verses}
              />
            ) : (
              <Text
                color="$color10"
                fontSize={14}
              >
                Passage text could not be loaded. Tap Refresh or check your connection.
              </Text>
            )}
          </>
        ) : !err ? (
          <Text color="$color10">Select a date with a fellowship reading.</Text>
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
            disabled={!customReference.trim() || textLoading}
          >
            Load
          </Button>
        </XStack>
      </SurfaceCard>

      <FindMatchingHymnsButton
        disabled={!reading?.text?.trim() || textLoading}
        loading={finding}
        onPress={() => void onFindHymns()}
      />
    </AppScreen>
  )
}
