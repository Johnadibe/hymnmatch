import { AppScreen } from '../components/AppScreen'
import { SurfaceCard } from '../components/SurfaceCard'
import { Text, YStack } from '@my/ui'
import Constants from 'expo-constants'
import { getLectionaryDateRange } from '../data/lectionary/fellowshipLectionary'

const appVersion = Constants.expoConfig?.version ?? '1.0.0'

export function AboutScreen() {
  const range = getLectionaryDateRange()

  return (
    <AppScreen
      title="About"
      subtitle="HymnMatch · Sermon & hymn companion"
    >
      <SurfaceCard accent="green">
        <Text
          fontWeight="800"
          fontSize={17}
          color="$color12"
        >
          All Christian Practical Praying Band, Int&apos;l
        </Text>
        <Text
          fontSize={13}
          fontWeight="600"
          color="$color10"
          marginTop="$1"
        >
          ACPPB · Since 1957
        </Text>
        <Text
          lineHeight={22}
          color="$color11"
          marginTop="$3"
          fontSize={15}
        >
          ACPPB is a ministry committed to practical prayer, faithful exposition of Scripture,
          and worship that honours Christ. HymnMatch was prepared to serve preachers and worship
          leaders within this fellowship as they prepare for ministry.
        </Text>
      </SurfaceCard>

      <SurfaceCard accent="blue">
        <Text
          fontWeight="700"
          fontSize={16}
        >
          HymnMatch
        </Text>
        <Text
          lineHeight={22}
          color="$color11"
          fontSize={15}
        >
          HymnMatch helps you move from the day&apos;s Scripture to hymns that support the central
          message of your sermon. It is a preparation tool: your judgment, the hymnbook, and the
          leading of the Spirit remain primary.
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
        <Bullet text="ACPPB reading schedule on your device, including daily, morning, and evening columns where your booklet provides them." />
        <Bullet text="Passage text for preparation (World English Bible), with verses stored on the phone after first load." />
        <Bullet text="Four hymn suggestions per sermon text, with brief reasons tied to theme rather than keywords alone." />
        <Bullet text="Saved preparations you can revisit without a connection." />
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
          title="Select the service date and reading"
          body="Open Word, choose the day you will preach, and confirm the text from your fellowship schedule."
        />
        <WorkflowStep
          n={2}
          title="Review the passage and theme"
          body="Read the Scripture in the app and, if helpful, note the main message you intend to preach."
        />
        <WorkflowStep
          n={3}
          title="Choose hymns and save"
          body="Request matching hymns, review the suggestions against your hymnbook, and save your preparation for service day."
        />
      </SurfaceCard>
    </AppScreen>
  )
}

function Bullet({ text }: { text: string }) {
  return (
    <Text
      fontSize={14}
      lineHeight={21}
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
          fontSize={14}
        >
          {title}
        </Text>
        <Text
          color="$color11"
          lineHeight={20}
          fontSize={14}
        >
          {body}
        </Text>
      </YStack>
    </YStack>
  )
}
