# HymnMatch MVP

Sermon-to-hymn companion: load a daily Scripture passage, infer themes, and recommend four hymns from the **ACPPB Abu (Igbo)** catalogue using **Google Gemini** (with offline fallback).

## Run the app

```bash
yarn install
yarn build
cd apps/expo
# Copy .env.example to .env and add your Gemini key
yarn start
```

Open in Expo Go or a dev client. The app opens on **Today** (`/today`).

## Google Gemini API key (free tier)

1. Go to [Google AI Studio — API keys](https://aistudio.google.com/apikey).
2. Sign in with your Google account.
3. Click **Create API key**.
4. Select an existing Google Cloud project or **Create project**.
5. Copy the key (starts with `AIza…`).
6. In `apps/expo/.env`:

```env
EXPO_PUBLIC_GEMINI_API_KEY=AIzaSy...your_key_here
EXPO_PUBLIC_GEMINI_MODEL=gemini-2.0-flash
```

7. Restart Expo (`yarn start -c`) so env vars reload.

**Security note:** `EXPO_PUBLIC_*` keys are embedded in the mobile bundle. Fine for personal MVP; for production, call Gemini from a backend and keep the key server-side.

If the key is missing, the app uses a simple local theme fallback (no network AI).

## Data sources (MVP)

- **Scripture:** [bible-api.com](https://bible-api.com/) (World English Bible).
- **Hymns:** Bundled sample catalogue in `packages/app/features/hymnCompanion/data/hymnCatalog.ts` (replace with your verified Igbo/English index later).

## Screens

| Route | Purpose |
|-------|---------|
| `/today` | Daily passage, optional theme, custom reference |
| `/suggestions` | Four AI recommendations + reasons |
| `/hymn/[id]` | Hymn metadata, save preparation |
| `/saved` | Offline saved preparations |

The repo contains only the HymnMatch mobile app and shared packages.
