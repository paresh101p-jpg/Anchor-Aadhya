# Anchor Aadhya — AI & Future Tech News Channel: Master Architecture & Rules

## 1. Project Overview & Isolation Rule
* **Project Location**: `E:\Paresh\Auto Post\AI News Channel`
* **Absolute Isolation Policy**: This is a 100% INDEPENDENT, standalone product. It MUST NEVER be merged, mixed, or linked with any other automation (`Auto-Insta-Krishna`, `Auto-Insta-Mojilo`, `Auto-Insta-Pooja`). All credentials, scripts, videos, thumbnails, and trackers are strictly self-contained.

---

## 2. Daily Schedule & Automation Workflow
* **Daily 04:30 PM (16:30 IST)**: Automated Research & Video Creation Engine triggers (`RUN_DAILY_430PM.bat`).
  1. Dynamically fetches today's latest breaking AI, Robotics, Space & Future Tech news.
  2. Sourcing 100% real photojournalism images for each news topic (never generic cartoonish neon glow).
  3. Synthesizes energetic, humanized Hindi voiceover via Microsoft Swara Neural (`hi-IN-SwaraNeural`).
  4. Renders full HD 1080p (1920x1080) Master Video (approx 3.5 to 5 minutes duration).
  5. Dynamically generates High-CTR YouTube Thumbnail (1280x720) with strict mathematical aspect ratio preservation (zero facial stretching).
  6. Automatically writes YouTube SEO Title, full Hinglish Description with Chapters/Timestamps, and SEO Tags.
* **Daily 05:00 PM (17:00 IST)**: Automated YouTube Uploader triggers (`RUN_DAILY_5PM_UPLOAD.bat`).
  * Publishes video to YouTube with attached custom thumbnail, chapters, description, and tags via YouTube Data API v3.

---

## 3. Anchor Aadhya Character & Visual Standards
* **Name & Spelling**: Always **आध्या** / **Anchor Aadhya** (Channel: **AI Aadhya**).
* **Persona**: Charismatic, gorgeous, glamorous Indian female tech news anchor (late 20s), confident, radiant smile, articulate Hindi delivery.
* **Studio Branding**: Digital screens and desk plates must display **"AI Aadhya"** (never generic "Tech News").
* **Wardrobe & Poses**:
  * Outfits: Modern, chic, fitted broadcast blazers (crimson red with asymmetrical cut, royal navy, emerald green).
  * Dynamic Camera Framing:
    * **Intro**: Desk shot with cascading breaking news rundown board (`#01` to `#04`).
    * **News Scenes**: Authentic documentary/photojournalism footage + animated lower thirds, category badges, dual-color bullets (cyan & gold), and bottom live ticker.
    * **Outro**: Warm, intimate medium close-up smiling sign-off.
* **Thumbnail Aspect Ratio Rule**:
  * ALWAYS preserve mathematical aspect ratio `(crop_w / crop_h) == (target_w / target_h)`. Never stretch or compress facial features horizontally or vertically.

---

## 4. YouTube Partner Program (YPP) & Monetization Compliance
* **No Tag Stuffing Rule**:
  * NEVER put comma-separated lists of tags inside the video description. Doing so violates YouTube's "Spam and Misleading Metadata" policy.
  * Description format:
    1. Engaging viral Hinglish hook & introduction.
    2. Exact Chapter Timestamps (`00:00 - Intro`, `00:38 - Story 1`, etc.).
    3. In-depth analysis of each story with technical insights.
    4. Question of the day to drive viewer comments.
    5. Channel Mission & Daily 5 PM Schedule.
    6. **Mandatory AI Disclosure**: Declare synthetic/altered content in description and API flags (`syntheticMedia = True`, `selfDeclaredMadeForKids = False`).
    7. 6 to 10 relevant `#Hashtags` at the bottom.
  * Comma-separated tags belong STRICTLY in YouTube's backend `tags` field.

---

## 5. File Inventory & Roles
* `daily_news_pipeline.py`: Master automated news fetcher, scriptwriter, and FFmpeg video generator.
* `generate_thumbnail.py`: High-CTR 1280x720 YouTube thumbnail generator.
* `generate_metadata.py`: Generates `metadata_YYYY-MM-DD.json` and human-readable `YOUTUBE_METADATA_YYYY-MM-DD.txt`.
* `youtube_uploader.py`: Resumable YouTube API v3 uploader for video, thumbnail, and metadata.
* `get_youtube_token.py`: 1-time OAuth authorization script for new Gmail/YouTube channel.
* `anchor_aadhya_master.jpg`: Master 4K portrait of glamorous Anchor Aadhya with "AI Aadhya" studio branding.
* `RUN_DAILY_430PM.bat`: 1-click / Scheduled batch runner for 4:30 PM generation.
* `RUN_DAILY_5PM_UPLOAD.bat`: 1-click / Scheduled batch runner for 5:00 PM upload.

---

## 6. 100% Autonomous Broadcast TV Outro Architecture
* **Duration**: Last 15–20 seconds of the video (Scene 6 Outro).
* **Zero Manual Studio Touch**: The pipeline is 100% hands-off. The creator NEVER needs to open YouTube Studio to manually add end screen elements.
* **Autonomous Visual & Audio Sign-off**:
  * Anchor Aadhya (`anchor_aadhya_outro.jpg`) warmly smiles on full broadcast studio frame.
  * Professional Animated Lower-Third Plate: `DAILY 5PM BULLETIN | ROZ SHAAM 5 BAJE NAYA VIDEO!`.
  * Animated Bullets: `• Like karo, doston ko share karo aur bell icon dabao` and `• Kal shaam 5 baje milte hain ek aur naye dhamake ke saath!`.
  * Scrolling Bottom Ticker Tape with daily 5 PM schedule and subscribe callout.
  * Audio: Natural, engaging sign-off inviting viewers to like, share, subscribe, and meet tomorrow at 5:00 PM.
* `uploaded_bulletins_tracker.txt`: Permanent history log preventing duplicate uploads.
