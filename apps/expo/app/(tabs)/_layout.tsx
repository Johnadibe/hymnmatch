import { Tabs } from 'expo-router'
import { Pressable } from 'react-native'
import { Text, YStack } from '@my/ui'
import { BookOpen, CalendarDays, Info, Library } from '@tamagui/lucide-icons'

function TabIcon({
  Icon,
  label,
  focused,
}: {
  Icon: typeof CalendarDays
  label: string
  focused: boolean
}) {
  return (
    <YStack
      alignItems="center"
      justifyContent="center"
      gap={4}
      paddingTop={4}
    >
      <Icon
        size={22}
        color={focused ? '#335CFF' : '#737373'}
      />
      <Text
        fontSize={11}
        fontWeight={focused ? '700' : '500'}
        color={focused ? '$blue10' : '$color10'}
      >
        {label}
      </Text>
    </YStack>
  )
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#335CFF',
        tabBarInactiveTintColor: '#737373',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E5E5',
          height: 64,
          paddingBottom: 8,
        },
        tabBarButton: (props) => (
          <Pressable
            {...props}
            style={({ pressed }) => [
              props.style,
              pressed ? { opacity: 0.85, transform: [{ scale: 0.98 }] } : null,
            ]}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="today"
        options={{
          title: 'Readings',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              Icon={CalendarDays}
              label="Readings"
              focused={focused}
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="hymns"
        options={{
          title: 'Hymns',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              Icon={Library}
              label="Hymns"
              focused={focused}
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              Icon={BookOpen}
              label="Saved"
              focused={focused}
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: 'About',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              Icon={Info}
              label="About"
              focused={focused}
            />
          ),
          tabBarLabel: () => null,
        }}
      />
    </Tabs>
  )
}
