import { AppScreen } from '../components/AppScreen'
import { SurfaceCard } from '../components/SurfaceCard'
import { Text, YStack } from '@my/ui'
import Constants from 'expo-constants'
import { getLectionaryDateRange } from '../data/lectionary/fellowshipLectionary'
import { TYPE } from '../constants'

const appVersion = Constants.expoConfig?.version ?? '1.0.0'

export function AboutScreen() {
  const range = getLectionaryDateRange()

  return (
    <AppScreen
      title="About"
      subtitle="HymnMatch for ACPPB: sermon and hymn companion"
    >
      <SurfaceCard accent="green">
        <Text
          fontWeight="800"
          fontSize={17}
          color="$color12"
        >
          All Christian Practical Praying Band (ACPPB)
        </Text>
        <Text
          {...TYPE.bodySmall}
          fontWeight="600"
          color="$color10"
          marginTop="$1"
        >
          International. Est. 1957
        </Text>
        <Text
          {...TYPE.body}
          color="$color11"
          marginTop="$3"
        >
          ACPPB is a prayer and Scripture ministry: practical intercession, faithful teaching of
          God&apos;s Word, and worship that honours Christ. Members meet for prayer, study the Bible
          together, and serve the Lord in their churches and communities. HymnMatch was built for
          this ministry to help preachers and worship leaders prepare with the Daily Bread Guide and
          the Igbo Abu (ACPPB hymnbook).
        </Text>
      </SurfaceCard>

      <SurfaceCard accent="blue">
        <Text
          fontWeight="700"
          fontSize={16}
        >
          Our Daily Bread Guide
        </Text>
        <Text
          {...TYPE.body}
          color="$color11"
        >
          The printed Daily Bread Guide schedules Bible readings for each day: daily column, Morning
          Prayer, and Evening Prayer where provided. This app loads those references from the 2026
          guide
          {range ? ` (${range.start} through ${range.end})` : ''}, fetches the passage text for
          preparation, and helps you choose Abu that fit the message.
        </Text>
      </SurfaceCard>

      <SurfaceCard>
        <Text
          fontWeight="700"
          fontSize={16}
        >
          HymnMatch
        </Text>
        <Text
          {...TYPE.body}
          color="$color11"
        >
          HymnMatch connects your Daily Bread passage to suggested hymns from Abu 1 to 400. It
          supports your judgment; it does not replace prayer, the physical hymnbook, or the leading
          of the Holy Spirit.
        </Text>
      </SurfaceCard>

      <SurfaceCard>
        <Text
          fontWeight="700"
          fontSize={16}
          marginBottom="$2"
        >
          In this app
        </Text>
        <Bullet text="Daily Bread Guide readings on your device, with Morning and Evening Prayer columns." />
        <Bullet text="Scripture text (World English Bible) cached on the phone for offline use after first load." />
        <Bullet text="Abu suggestions using Igbo titles, lyrics, and scripture lines, plus optional online matching." />
        <Bullet text="Saved preparations with passage text and your chosen hymn, available offline." />
        <Bullet text="Songs of Praise: all 597 fellowship songs with fast search and full lyrics offline." />
      </SurfaceCard>

      <SurfaceCard>
        <Text
          fontWeight="700"
          fontSize={16}
          marginBottom="$2"
        >
          Typical workflow
        </Text>
        <WorkflowStep
          n={1}
          title="Open Word and pick your date"
          body="Choose the service day and the Daily Bread / Morning / Evening line you will preach from."
        />
        <WorkflowStep
          n={2}
          title="Read and note the theme"
          body="Review the passage on screen (or from cache offline) and add your central theme if helpful."
        />
        <WorkflowStep
          n={3}
          title="Match Abu and save"
          body="Find matching hymns, compare with your hymnbook, and save your preparation for service day."
        />
      </SurfaceCard>

      <Text
        {...TYPE.caption}
        color="$color9"
        textAlign="center"
        marginTop="$2"
      >
        Version {appVersion}
      </Text>
    </AppScreen>
  )
}

function Bullet({ text }: { text: string }) {
  return (
    <Text
      {...TYPE.bodySmall}
      color="$color11"
      marginBottom="$2"
      paddingLeft="$2"
    >
      {'\u2022 '}
      {text}
    </Text>
  )
}

function WorkflowStep({
  n,
  title,
  body,
}: {
  n: number
  title: string
  body: string
}) {
  return (
    <YStack
      flexDirection="row"
      gap="$3"
      alignItems="flex-start"
      marginBottom={n < 3 ? '$3' : 0}
    >
      <YStack
        width={32}
        height={32}
        borderRadius={16}
        backgroundColor="$blue3"
        alignItems="center"
        justifyContent="center"
      >
        <Text
          fontWeight="800"
          fontSize={14}
          color="$blue11"
        >
          {n}
        </Text>
      </YStack>
      <YStack
        flex={1}
        gap="$1"
      >
        <Text
          fontWeight="700"
          {...TYPE.bodySmall}
        >
          {title}
        </Text>
        <Text
          color="$color11"
          {...TYPE.bodySmall}
        >
          {body}
        </Text>
      </YStack>
    </YStack>
  )
}
