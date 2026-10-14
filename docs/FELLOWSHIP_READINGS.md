# Fellowship daily readings — architecture

## Source of truth

- **Bundled JSON:** `packages/app/features/hymnCompanion/data/lectionary/lectionary2026.json`
- Edited from your printed fellowship schedule (BSG, MP, EP + Igbo market day).
- **No backend required** for the schedule itself — this is the professional pattern for offline-first chapel apps.

## Preparing ahead

On **Readings**, pick the **service date** (calendar, previous/next day, or **This Saturday** / **This Sunday**). MP/EP vs BSG rules use that date’s weekday, not only “today.”

## Rules (app logic)

| Day | Preacher choice |
|-----|-----------------|
| **Every day** | BSG is shown and is the default sermon text. |
| **Wed, Fri, Sun** | BSG is **required** for the fellowship reading. |
| **Mon, Tue, Thu, Sat** | Preacher may use **MP** or **EP** instead of BSG (selector on Today). |

## Passage text

- References come from the lectionary.
- **Translation:** [World English Bible](https://ebible.org/eng-web/) (public domain) via network lookup — no licensing cost, suitable for production.
- **On-device cache:** After a passage loads once, text is stored locally (AsyncStorage). Reopens are fast; if the network fails in chapel, cached text still appears. **Refresh** on Today forces a new download when online.
- We do **not** bundle the full Bible (large download, translation licensing). If the fellowship later standardizes on e.g. KJV/NIV, add only with proper rights or a licensed API.

## Updating readings

1. **Short term:** Edit `lectionary2026.json` (or add `lectionary2027.json`) and ship an app update.
2. **Production scale:** Optional admin API (Supabase/Firebase) + `expo-updates` or in-app sync so branch editors update schedules without store review. Hymn catalogue would use the same pipeline.

## Hymns (next)

- Igbo hymn metadata: same approach — verified JSON/SQLite first, optional sync later.
- Gemini suggestions must only use **verified** catalogue IDs (already enforced in code).
