import { config } from '@my/config'

export type Conf = typeof config

declare module '*.jpg' {
  const source: number
  export default source
}

declare module '@my/ui' {
  interface TamaguiCustomConfig extends Conf {}
}
