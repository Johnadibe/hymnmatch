import { AppScreen } from '../components/AppScreen'
import { SurfaceCard } from '../components/SurfaceCard'
import { Text, YStack } from '@my/ui'
import { getLectionaryDateRange } from '../data/lectionary/fellowshipLectionary'

const steps = [
  {
    n: '1',
    title: 'Scripture first',
    body: 'Pick the day you are preaching (including Saturday or Sunday ahead), open the fellowship reading (BSG), or on Mon/Tue/Thu/Sat choose Morning or Evening Prayer when that is your sermon text.',
  },
  {
    n: '2',
    title: 'Thematic matches',
    body: 'Receive hymn suggestions that reinforce your sermon message, with clear reasons for each choice.',
  },
  {
    n: '3',
    title: 'Save & serve',
    body: 'Save preparations offline, pick hymns for worship, and refine with your team and hymnbook editors.',
  },
]

export function AboutScreen() {
  const range = getLectionaryDateRange()

  return (
    <AppScreen
      title="About HymnMatch"
      subtitle="A companion for preachers. It does not replace spiritual discernment."
    >
      <SurfaceCard accent="green">
        <Text
          fontWeight="700"
          fontSize={16}
        >
          Built for ACPPB Oyigbo Chapel 2
        </Text>
        <Text
          lineHeight={22}
          color="$color11"
        >
          Daily readings come from your fellowship lectionary (BSG, MP, EP), bundled in the app.
          Passage text uses the World English Bible online, with copies saved on your phone for
          offline reuse. Your Igbo hymn index will replace the temporary English catalogue when
          uploaded.
        </Text>
        {range ? (
          <Text
            fontSize={13}
            color="$color10"
          >
            Lectionary loaded: {range.start} → {range.end}
          </Text>
        ) : null}
      </SurfaceCard>

      {steps.map((step) => (
        <SurfaceCard key={step.n}>
          <YStack
            flexDirection="row"
            gap="$3"
            alignItems="flex-start"
          >
            <YStack
              width={36}
              height={36}
              borderRadius={18}
              backgroundColor="$blue3"
              alignItems="center"
              justifyContent="center"
            >
              <Text
                fontWeight="800"
                color="$blue11"
              >
                {step.n}
              </Text>
            </YStack>
            <YStack
              flex={1}
              gap="$1"
            >
              <Text fontWeight="700">{step.title}</Text>
              <Text
                color="$color11"
                lineHeight={21}
                fontSize={14}
              >
                {step.body}
              </Text>
            </YStack>
          </YStack>
        </SurfaceCard>
      ))}
    </AppScreen>
  )
}
