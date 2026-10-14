import type { GetProps } from 'tamagui'
import { Input, TextArea } from '@my/ui'

const placeholderColor = '#525252'

export function HymnInput(props: GetProps<typeof Input>) {
  return (
    <Input
      backgroundColor="$background"
      borderWidth={1}
      borderColor="$borderColorHover"
      borderRadius="$4"
      color="$color"
      placeholderTextColor={placeholderColor}
      focusStyle={{ borderColor: '$blue8', borderWidth: 1.5 }}
      {...props}
    />
  )
}

export function HymnTextArea(props: GetProps<typeof TextArea>) {
  return (
    <TextArea
      backgroundColor="$background"
      borderWidth={1}
      borderColor="$borderColorHover"
      borderRadius="$4"
      color="$color"
      placeholderTextColor={placeholderColor}
      focusStyle={{ borderColor: '$blue8', borderWidth: 1.5 }}
      {...props}
    />
  )
}
