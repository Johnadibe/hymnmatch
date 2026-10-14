import { Image } from 'react-native'
import { Text, XStack, YStack } from '@my/ui'

const acppbLogo = require('../assets/acppb-logo.jpg')

type BrandMarkProps = {
  size?: 'header' | 'splash'
}

function HymnMatchWordmark({ titleSize }: { titleSize: number }) {
  return (
    <XStack
      alignItems="baseline"
      gap={0}
    >
      <Text
        fontSize={titleSize}
        fontWeight="900"
        letterSpacing={-0.8}
        color="white"
      >
        Hymn
      </Text>
      <Text
        fontSize={titleSize}
        fontWeight="900"
        letterSpacing={-0.8}
        color="#FFD54F"
      >
        Match
      </Text>
    </XStack>
  )
}

export function BrandMark({ size = 'header' }: BrandMarkProps) {
  const isSplash = size === 'splash'
  const titleSize = isSplash ? 36 : 28
  const logoSize = isSplash ? 132 : 48

  if (isSplash) {
    return (
      <YStack
        alignItems="center"
        gap="$4"
        animation="100ms"
        enterStyle={{ opacity: 0, y: -6 }}
        opacity={1}
        y={0}
      >
        <Image
          source={acppbLogo}
          style={{
            width: logoSize,
            height: logoSize,
            borderRadius: logoSize / 2,
          }}
          accessibilityLabel="All Christian Practical Praying Band International logo"
        />
        <HymnMatchWordmark titleSize={titleSize} />
      </YStack>
    )
  }

  return (
    <XStack
      alignItems="center"
      gap="$3"
      animation="100ms"
      enterStyle={{ opacity: 0, y: -6 }}
      opacity={1}
      y={0}
    >
      <Image
        source={acppbLogo}
        style={{
          width: logoSize,
          height: logoSize,
          borderRadius: logoSize / 2,
        }}
        accessibilityLabel="ACPPB logo"
      />
      <HymnMatchWordmark titleSize={titleSize} />
    </XStack>
  )
}
