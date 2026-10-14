# HymnMatch

Sermon-to-hymn companion for preachers (ACPPB Oyigbo Chapel 2 and beyond). Expo React Native + Tamagui monorepo.

## Setup

```bash
yarn install
yarn build
```

Copy `apps/expo/.env.example` to `apps/expo/.env` and add your [Google Gemini API key](https://aistudio.google.com/apikey).

See [HYMN_MATCH_MVP.md](./HYMN_MATCH_MVP.md) for full MVP details.

## Run

```bash
yarn native
```

After pulling changes or fixing dependencies, if Metro fails to resolve a package:

```bash
yarn install
yarn build
yarn native
```

## Structure

- `apps/expo` — mobile app (Expo Router)
- `packages/app` — shared screens and hymn matching logic
- `packages/ui` — Tamagui components
- `packages/config` — Tamagui theme config
