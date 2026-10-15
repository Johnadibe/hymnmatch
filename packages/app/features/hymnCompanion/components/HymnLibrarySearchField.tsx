import { Pressable } from 'react-native'
import { Input, XStack } from '@my/ui'
import { Search, X } from '@tamagui/lucide-icons'

type HymnLibrarySearchFieldProps = {
  value: string
  onChangeText: (text: string) => void
  placeholder?: string
}

export function HymnLibrarySearchField({
  value,
  onChangeText,
  placeholder = 'Search Abu number, Igbo or English title…',
}: HymnLibrarySearchFieldProps) {
  return (
    <XStack
      alignItems="center"
      backgroundColor="white"
      borderRadius="$4"
      paddingHorizontal="$3"
      height={48}
      gap="$2"
      shadowColor="#000"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.12}
      shadowRadius={8}
      elevation={3}
    >
      <Search
        size={20}
        color="#525252"
      />
      <Input
        flex={1}
        unstyled
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#737373"
        color="#171717"
        fontSize={17}
        paddingVertical={0}
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="never"
        returnKeyType="search"
        accessibilityLabel="Search hymns"
      />
      {value.length > 0 ? (
        <Pressable
          onPress={() => onChangeText('')}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Clear search"
        >
          <X
            size={20}
            color="#525252"
          />
        </Pressable>
      ) : null}
    </XStack>
  )
}
