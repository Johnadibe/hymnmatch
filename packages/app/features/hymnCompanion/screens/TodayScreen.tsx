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
import { ReadingSlotPicker, type ReadingPickerValue } from '../components/ReadingSlotPicker'
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
  formatWeekdayGuide,
  getDefaultPreparationDate,
  isSameCalendarDay,
  startOfLocalDay,
} from '../data/lectionary/preparationDate'
import { defaultSlotForDate } from '../data/lectionary/readingRules'
import type { FellowshipLectionaryDay } from '../data/lectionary/types'
import { fetchPassageText } from '../services/fetchPassage'
import { explainLoadPassageError } from '../utils/friendlyErrors'
import { TYPE } from '../constants'
import type { DailyReading } from '../types'

function defaultPickerForDate(date: Date): ReadingPickerValue {
  return { slot: defaultSlotForDate(date), index: 0 }
}

export function TodayScreen() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState(getDefaultPreparationDate)
  const [scheduleDay, setScheduleDay] = useState<FellowshipLectionaryDay | null>(
    () => getFellowshipDay(getDefaultPreparationDate()) ?? null
  )
  const [reading, setReading] = useState<DailyReading | null>(null)
  const [textLoading, setTextLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [themeHint, setThemeHint] = useState('')
  const [customReference, setCustomReference] = useState('')
  const [finding, setFinding] = useState(false)
  const [picker, setPicker] = useState<ReadingPickerValue>(() =>
    defaultPickerForDate(getDefaultPreparationDate())
  )
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
        try {
          const normalizedRef = options.customRef.trim()
          const scripture = await fetchPassageText(normalizedRef, {
            preferNetwork: true,
          })
          if (seq !== loadSeq.current) return
          setScheduleDay(null)
          const dateKey = formatDateKey(targetDate)
          setReading({
            date: dateKey,
            reference: scripture.reference,
            title: 'Custom passage',
            sourceLabel: 'Custom reference',
            passages: [scripture.reference],
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
          : 'No Daily Bread Guide loaded.'
        setError(`No Daily Bread reading for this date. ${hint}`)
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
        title: `${day.marketDay} · ${formatWeekdayGuide(targetDate)}`,
        sourceLabel: 'ACPPB Daily Bread Guide',
        passages: [chosen.reference],
        text: '',
        fellowship: {
          marketDay: day.marketDay,
          dayLabel: formatWeekdayGuide(targetDate),
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
    void loadReading({ forDate: selectedDate, pickerValue: defaultPickerForDate(selectedDate) })
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount
  }, [])

  const onPreparationDateChange = (date: Date) => {
    setSelectedDate(date)
    const nextPicker = defaultPickerForDate(date)
    setPicker(nextPicker)
    setCustomReference('')
    void loadReading({ forDate: date, pickerValue: nextPicker })
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
      subtitle="Daily Bread Guide: choose the date and reading you will preach from."
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
              ...(customReference.trim() ? { customRef: customReference } : {}),
              preferNetwork: true,
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
              {...TYPE.caption}
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
              {...TYPE.body}
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
                {...TYPE.bodySmall}
              >
                Passage text could not be loaded. Tap Refresh or check your connection.
              </Text>
            )}
          </>
        ) : !err ? (
          <Text
            color="$color10"
            {...TYPE.bodySmall}
          >
            Select a date from the Daily Bread Guide.
          </Text>
        ) : null}
      </SurfaceCard>

      <SurfaceCard accent="green">
        <Text
          fontWeight="700"
          {...TYPE.body}
        >
          Central theme (optional)
        </Text>
        <Text
          {...TYPE.bodySmall}
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
        <Text
          fontWeight="700"
          {...TYPE.body}
        >
          Override with another passage
        </Text>
        <Text
          {...TYPE.bodySmall}
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
            onPress={() =>
              void loadReading({
                customRef: customReference,
                forDate: selectedDate,
                preferNetwork: true,
              })
            }
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
