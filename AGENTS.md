# AGENTS.md — HymnMatch

Expo React Native + Tamagui monorepo for the Sermon & Hymn Companion.

## Commands

```bash
yarn install
yarn build
yarn native          # Expo dev server
yarn lint:fix        # After edits
yarn test            # UI unit tests via apps/expo
```

## Structure

- `apps/expo` — Expo Router (`/today`, `/suggestions`, `/hymn/[id]`, `/saved`)
- `packages/app/features/hymnCompanion` — screens, Gemini matching, hymn catalogue
- `packages/ui` — Tamagui wrappers; use `PressPresets` for all buttons
- `packages/config` — Tamagui config

## Env

`apps/expo/.env`: `EXPO_PUBLIC_GEMINI_API_KEY`, optional `EXPO_PUBLIC_GEMINI_MODEL`.
