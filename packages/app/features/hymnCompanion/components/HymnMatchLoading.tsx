import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated'
import { Music2, Sparkles } from '@tamagui/lucide-icons'
import { Text, YStack } from '@my/ui'
import { SurfaceCard } from './SurfaceCard'
import { HYMN_SUGGESTION_COUNT, TYPE } from '../constants'

const MESSAGES = [
  'Listening to your Daily Bread passage...',
  'Searching Abu 1 to 400 in Igbo...',
  'Matching themes to your message...',
  'Almost ready...',
] as const

function FloatingNote({ delayMs, x }: { delayMs: number; x: number }) {
  const ty = useSharedValue(0)
  const scale = useSharedValue(1)
  const opacity = useSharedValue(0.55)

  useEffect(() => {
    ty.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(-10, { duration: 900, easing: Easing.inOut(Easing.sin) }),
          withTiming(0, { duration: 900, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    )
    scale.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(
          withTiming(1.12, { duration: 700, easing: Easing.out(Easing.quad) }),
          withTiming(1, { duration: 700, easing: Easing.in(Easing.quad) })
        ),
        -1,
        false
      )
    )
    opacity.value = withDelay(
      delayMs,
      withRepeat(
        withSequence(withTiming(1, { duration: 600 }), withTiming(0.5, { duration: 600 })),
        -1,
        true
      )
    )
  }, [delayMs, opacity, scale, ty])

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }, { scale: scale.value }],
    opacity: opacity.value,
  }))

  return (
    <Animated.View style={[styles.note, { left: x }, style]}>
      <Music2
        size={22}
        color="#335CFF"
      />
    </Animated.View>
  )
}

function ShimmerBar() {
  const tx = useSharedValue(-120)

  useEffect(() => {
    tx.value = withRepeat(
      withTiming(280, { duration: 1800, easing: Easing.inOut(Easing.quad) }),
      -1,
      false
    )
  }, [tx])

  const shimmerStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }],
  }))

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.shimmerWrap, shimmerStyle]}>
        <LinearGradient
          colors={['transparent', 'rgba(51,92,255,0.35)', 'rgba(31,193,107,0.45)', 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.shimmer}
        />
      </Animated.View>
    </View>
  )
}

function PulseRing() {
  const scale = useSharedValue(0.85)
  const opacity = useSharedValue(0.6)

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1200, easing: Easing.out(Easing.cubic) }),
        withTiming(0.85, { duration: 1200, easing: Easing.in(Easing.cubic) })
      ),
      -1,
      false
    )
    opacity.value = withRepeat(
      withSequence(withTiming(0.15, { duration: 1200 }), withTiming(0.55, { duration: 1200 })),
      -1,
      false
    )
  }, [opacity, scale])

  const ringStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))

  return (
    <Animated.View style={[styles.ring, ringStyle]}>
      <View style={styles.ringInner} />
    </Animated.View>
  )
}

type HymnMatchLoadingProps = {
  compact?: boolean
}

export function HymnMatchLoading({ compact }: HymnMatchLoadingProps) {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length)
    }, 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <SurfaceCard accent="blue">
      <YStack
        alignItems="center"
        gap="$4"
        paddingVertical={compact ? '$3' : '$5'}
        paddingHorizontal="$2"
      >
        <View style={styles.stage}>
          <PulseRing />
          <FloatingNote
            delayMs={0}
            x={8}
          />
          <FloatingNote
            delayMs={280}
            x={52}
          />
          <FloatingNote
            delayMs={560}
            x={96}
          />
          <YStack
            width={56}
            height={56}
            borderRadius={28}
            backgroundColor="$blue3"
            alignItems="center"
            justifyContent="center"
            style={{ zIndex: 2 }}
          >
            <Sparkles
              size={28}
              color="#335CFF"
            />
          </YStack>
        </View>

        <ShimmerBar />

        <Text
          fontWeight="700"
          fontSize={17}
          color="$blue11"
          textAlign="center"
        >
          {MESSAGES[msgIndex]}
        </Text>
        {!compact ? (
          <Text
            {...TYPE.bodySmall}
            color="$color10"
            textAlign="center"
          >
            Choosing {HYMN_SUGGESTION_COUNT} Abu that best support your sermon message.
          </Text>
        ) : null}
      </YStack>
    </SurfaceCard>
  )
}

const styles = StyleSheet.create({
  stage: {
    width: 140,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  note: {
    position: 'absolute',
    top: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(238, 242, 255, 0.95)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#335CFF',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  ring: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 2,
    borderColor: 'rgba(51, 92, 255, 0.35)',
  },
  track: {
    width: '100%',
    maxWidth: 280,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(51, 92, 255, 0.12)',
    overflow: 'hidden',
  },
  shimmerWrap: {
    width: 120,
    height: '100%',
  },
  shimmer: {
    flex: 1,
    borderRadius: 3,
  },
})
