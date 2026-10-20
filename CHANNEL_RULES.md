# Anchor Aadhya — AI & Future Tech News Channel: Master Architecture & Rules

## 1. Project Overview & Isolation Rule
* **Project Location**: `E:\Paresh\Auto Post\AI News Channel`
* **Absolute Isolation Policy**: This is a 100% INDEPENDENT, standalone product. It MUST NEVER be merged, mixed, or linked with any other automation (`Auto-Insta-Krishna`, `Auto-Insta-Mojilo`, `Auto-Insta-Pooja`). All credentials, scripts, videos, thumbnails, and trackers are strictly self-contained.

---

## 2. Daily Schedule & Automation Workflow (Dual Daily Slots)
* **Slot 1 (12:00 PM IST)**: Afternoon Tech Special Bulletin
  * Cron trigger: `30 6 * * *` (06:30 UTC)
  * Script target: `daily_news_pipeline.py --slot 12PM`
  * Upload target: `youtube_uploader.py --slot 12PM`
* **Slot 2 (05:00 PM IST)**: Evening Prime Tech Bulletin
  * Cron trigger: `30 11 * * *` (11:30 UTC)
  * Script target: `daily_news_pipeline.py --slot 5PM`
  * Upload target: `youtube_uploader.py --slot 5PM`

---

## 3. Strict Zero News Duplication & Memory Engine
* **Rule**: No news story can EVER be repeated across any day or month.
  * Only fresh developments / official updates (e.g., Part 2 / new milestones) on previous topics can be covered.
* **Archive Log**: `used_news_archive.json` permanently records every story ID, headline, core entity keywords, and publish timestamp.
* **Deduplication Check**: Before producing any bulletin, every candidate story is evaluated. If it shares >= 2 core keywords with any previously covered story, it is strictly skipped.

---

## 4. Strict Zero Image Reuse Rule
* **Rule**: For every new news story, ALL images MUST be 100% brand new. The same news photo must NEVER be used twice.
* **Archive Log**: `used_images_archive.txt` permanently records every image URL and checksum.
* **Naming**: Each story's photo is saved with a unique edition timestamp (e.g., `news_2026-10-21_12PM_story_1.jpg`).

---

## 5. Dynamic Anchor Wardrobe Rotation across 5 Broadcast-Grade Looks
Anchor Aadhya rotates across 5 broadcast-grade looks with identical facial identity:
1. `anchor_look_1_crimson.jpg`: Crimson Power Blazer (Prime Time Headline Host)
2. `anchor_look_2_blue.jpg`: Royal Sapphire Blue Blazer (Senior Tech Analyst, Serious & In-Depth)
3. `anchor_look_3_emerald.jpg`: Emerald Teal Modern Blazer (Innovation Host with Warm Open Smile)
4. `anchor_look_4_black_gold.jpg`: Luxury Black & Gold Lapel Blazer (Dramatic Breaking News Presentation)
5. `anchor_look_5_lilac.jpg`: Chic Lavender Lilac Blazer (Playful, Cheerful & Humorous Masti Tech)

---

## 6. Emotion-Adaptive Voice Modulation (अंदाज़)
Every news story is categorized by emotion, and the script + voiceover dynamically adapt:
* **Dramatic (रोमांचक / सनसनीखेज)**:
  * Speech Rate: `+4%`, Pitch: `+1Hz` (High energy, thrilling discovery)
* **Funny / Masti (मज़ाकिया / चुटीला अंदाज़)**:
  * Speech Rate: `+2%`, Pitch: `+3Hz` (Playful banter, witty laughing delivery, robot chores)
* **Serious / Caution (गंभीर / प्राइवेसी व सुरक्षा)**:
  * Speech Rate: `-5%`, Pitch: `-2Hz` (Calm, thoughtful, dignified and serious alert)
* **Inspirational / Joy (खुशी / नई तकनीक की जीत)**:
  * Speech Rate: `0%`, Pitch: `+1Hz` (Warm, uplifting, smiling human triumph)
* **Vocabulary Standard**: Always polite, dignified, respectful Hindi/Hinglish ("sab aache vala word ke sath").

---

## 7. YouTube Partner Program (YPP) & Monetization Compliance
* **No Tag Stuffing Rule**:
  * NEVER put comma-separated lists of tags inside the video description.
  * Description format:
    1. Engaging viral Hinglish hook & introduction.
    2. Exact Chapter Timestamps (`00:00 - Intro`, `00:38 - Story 1`, etc.).
    3. In-depth analysis of each story with technical insights.
    4. Question of the day to drive viewer comments.
    5. Channel Mission & Daily Schedule.
    6. **Mandatory AI Disclosure**: Declare synthetic/altered content in description and API flags (`syntheticMedia = True`, `selfDeclaredMadeForKids = False`).
    7. 6 to 10 relevant `#Hashtags` at the bottom.
  * Comma-separated tags belong STRICTLY in YouTube's backend `tags` field.

---

## 8. 100% Autonomous Broadcast TV Outro Architecture
* **Duration**: Last 15–20 seconds of the video (Scene 6 Outro).
* **Zero Manual Studio Touch**: The pipeline is 100% hands-off. The creator NEVER needs to open YouTube Studio to manually add end screen elements.
* **Autonomous Visual & Audio Sign-off**:
  * Anchor Aadhya (`anchor_aadhya_outro.jpg`) warmly smiles on full broadcast studio frame.
  * Professional Animated Lower-Third Plate indicating next upcoming bulletin.
  * Animated Bullets: Like, share, subscribe, and next bulletin timing.
  * Scrolling Bottom Ticker Tape with schedule and subscribe callout.
* `uploaded_bulletins_tracker.txt`: Permanent history log preventing duplicate uploads.
