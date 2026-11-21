# Anchor Aadhya

Daily faceless Hindi curiosity shorts, rendered and uploaded entirely on GitHub Actions.

## What runs

- **Default engine:** 100% code-based **2D inside-out/cutaway animation** (`engine/`). No paid image API.
- **Voice:** Cartesia "Aadhya" (Hindi female) when `CARTESIA_API_KEY` has credit; automatically falls back to free `edge-tts` (`hi-IN-SwaraNeural`) on any API error, including `402 Payment Required`.
- **Script/facts:** rotating curated topics from `curiosity_topics.json`; Gemini is optional and never required.
- **Captions:** Devanagari kinetic captions with yellow keyword pops.
- **Upload:** direct to the Anchor Aadhya YouTube channel as **unlisted**, with thumbnail and metadata.
- **Schedule:** `02:30 UTC` (08:00 IST) and `11:30 UTC` (17:00 IST), daily.

## Manual run

Use **Actions → Anchor Aadhya Daily Evergreen Short → Run workflow**:

- `engine`: `2d` (the only engine; 3D was removed)
- `topic_id`: optional id from `curiosity_topics.json`, e.g. `upside_down_hang`

A push to `TRIGGER_AADHYA_POST.txt` also starts the workflow.

Old unlisted test uploads can be removed with **Actions → Cleanup YouTube Videos → Run workflow** and passing comma-separated video ids.

## Repository secrets

| Secret | Purpose |
| --- | --- |
| `YOUTUBE_CLIENT_ID` | YouTube OAuth app id |
| `YOUTUBE_CLIENT_SECRET` | YouTube OAuth app secret |
| `YOUTUBE_REFRESH_TOKEN` | Long-lived upload token |
| `CARTESIA_API_KEY` | Optional premium Hindi voice; free fallback covers failures |
| `GEMINI_API_KEY` | Optional fresh script research; curated topics are always available |

`CARTESIA_VOICE_ID` defaults to the Aadhya voice id in `generate_evergreen_short.py`.

## Security note

An older Cartesia key was historically hardcoded in source and printed in run logs. It has been removed from code; rotate that key at the provider if it was ever real.
