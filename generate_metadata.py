# -*- coding: utf-8 -*-
"""
Dynamic YouTube SEO Metadata Generator for Anchor Aadhya Tech News
- Generates a Rich, Viral Hinglish Title (<100 chars)
- Auto-generates structured chapters & timestamps matching the 4 selected stories
- Includes In-Depth Story Insights, Engagement Question, Channel Mission, and AI Transparency Disclosure
- Dual Slot Support (12 PM Special & 5 PM Prime)
"""

import os
import json
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def generate_video_metadata(
    slot="5PM",
    stories=None,
    video_filename=None,
    thumbnail_filename=None,
    scene_durations=None
):
    today_display = datetime.now().strftime("%d %B %Y")
    today_slug = datetime.now().strftime("%Y-%m-%d")
    edition_label = "Daily Special"

    if not video_filename:
        video_filename = f"Anchor_Aadhya_News_{today_slug}_{slot}.mp4"
    if not thumbnail_filename:
        thumbnail_filename = f"Thumbnail_{today_slug}_{slot}.jpg"

    if not stories or len(stories) < 4:
        # Fallback default headlines
        headline_1 = "Tesla Roadster Rocket Thrusters"
        headline_2 = "Humanoid Robots In Factories"
        s1 = {"headline": "Tesla Mein Rocket Thrusters!", "category": "TESLA ROADSTER", "speech": ""}
        s2 = {"headline": "10,000 Robots In Factory!", "category": "HUMANOID ROBOTS", "speech": ""}
        s3 = {"headline": "AI Drone Beats Champion!", "category": "AI DRONE", "speech": ""}
        s4 = {"headline": "Quantum Internet Breakthrough!", "category": "QUANTUM TECH", "speech": ""}
        stories = [s1, s2, s3, s4]
    else:
        headline_1 = stories[0]["headline"].title()
        headline_2 = stories[1]["headline"].title()

    # High-CTR YouTube Title (Max 100 chars)
    title = f"{headline_1} 🚀 {headline_2} | Daily Tech News • {today_display[:6]}"
    if len(title) > 100:
        title = f"{headline_1[:45]} 🚀 {headline_2[:30]} | Tech News {today_display[:6]}"

    # Format Chapters / Timestamps (Clickable in YouTube Player)
    def format_ts(sec):
        m = int(sec) // 60
        s = int(sec) % 60
        return f"{m:02d}:{s:02d}"

    if scene_durations and len(scene_durations) >= 5:
        t0 = 0.0
        t1 = scene_durations[0]
        t2 = t1 + scene_durations[1]
        t3 = t2 + scene_durations[2]
        t4 = t3 + scene_durations[3]
        t5 = t4 + (scene_durations[4] if len(scene_durations) > 4 else 70.0)

        desc_chapters = (
            f"00:00 - आज की टॉप 4 हेडलाइंस (Top 4 Tech Headlines)\n"
            f"{format_ts(t1)} - 1. {stories[0]['headline']} ({stories[0]['category']})\n"
            f"{format_ts(t2)} - 2. {stories[1]['headline']} ({stories[1]['category']})\n"
            f"{format_ts(t3)} - 3. {stories[2]['headline']} ({stories[2]['category']})\n"
            f"{format_ts(t4)} - 4. {stories[3]['headline']} ({stories[3]['category']})\n"
            f"{format_ts(t5)} - आउट्रो (Like, Share & Subscribe!)"
        )
    else:
        desc_chapters = (
            f"00:00 - आज की टॉप 4 हेडलाइंस (Today's Top 4 Tech Rundown)\n"
            f"00:35 - 1. {stories[0]['headline']} ({stories[0]['category']})\n"
            f"01:45 - 2. {stories[1]['headline']} ({stories[1]['category']})\n"
            f"03:00 - 3. {stories[2]['headline']} ({stories[2]['category']})\n"
            f"04:15 - 4. {stories[3]['headline']} ({stories[3]['category']})\n"
            f"05:30 - आउट्रो (Like & Subscribe!)"
        )

    # In-Depth Story Analysis
    desc_insights = ""
    for idx, s in enumerate(stories[:4]):
        desc_insights += f"\n{idx+1}️⃣ {s['headline']} ({s['category']}):\n"
        desc_insights += f"• मुख्य जानकारी: {s.get('bullet1', '')}\n"
        desc_insights += f"• भविष्य पर असर: {s.get('bullet2', '')}\n"
        if s.get("speech"):
            desc_insights += f"• आध्या का विश्लेषण: \"{s['speech'][:160]}...\"\n"

    # Dynamic Search Queries Covered (Helps YouTube Search & Suggestion Algorithms)
    import re
    searches = []
    num_s = len(stories)
    for s in stories[:num_s]:
        clean_h = s.get("headline", "").title()
        if clean_h:
            searches.append(f"{clean_h} news")
            searches.append(f"{clean_h} update hindi")
        for kw in s.get("keywords", [])[:2]:
            if len(kw) > 3:
                searches.append(f"{kw.title()} latest news")
    searches.extend(["Today tech news hindi", "Anchor Aadhya tech news", "Latest AI future tech updates"])
    clean_searches = list(dict.fromkeys(searches))[:8]
    desc_searches = "\n".join([f"• {q}" for q in clean_searches])

    # Dynamic Story-Specific Hashtags
    story_hashtags = []
    for s in stories[:num_s]:
        cat_clean = re.sub(r"[^a-zA-Z0-9]", "", s.get("category", "")).title()
        if cat_clean and len(cat_clean) > 3:
            story_hashtags.append(f"#{cat_clean}")
        for kw in s.get("keywords", [])[:2]:
            kw_clean = re.sub(r"[^a-zA-Z0-9]", "", kw).title()
            if kw_clean and len(kw_clean) > 3:
                story_hashtags.append(f"#{kw_clean}")
    story_hashtags = list(dict.fromkeys(story_hashtags))[:5]
    base_hashtags = ["#TechNews", "#AINews", "#AnchorAadhya", "#FutureTech", "#DailyTechNews"]
    final_hashtags = " ".join((base_hashtags + story_hashtags)[:10])

    description = f"""{headline_1} और {headline_2}! आज की सबसे बड़ी फ्यूचर टेक्नोलॉजी की खबरें सिर्फ Anchor Aadhya पर! 🚀🤖

Welcome to Anchor Aadhya — आपका अपना 100% भरोसेमंद डेली टेक और AI न्यूज़ बुलेटिन! आज {today_display} के इस विशेष बुलेटिन में जानिए दुनिया भर की रिसर्च लैब्स, टेक कंपनियों और वैज्ञानिकों की वो बड़ी खोजें, जो हमारे कल को हमेशा के लिए बदलने वाली हैं।

━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 TIMESTAMPS / CHAPTERS (खबरों के मुख्य बिंदु):
{desc_chapters}

━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 आज की बड़ी खबरों का पूरा विश्लेषण (Detailed News Insights):
{desc_insights}
━━━━━━━━━━━━━━━━━━━━━━━━━━
🔎 Searches & Topics Covered (सर्च में आने वाले मुख्य विषय):
{desc_searches}

━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 आज का सवाल (Question of the Day):
"दोस्तों, आज की इन खबरों में से कौन सी तकनीक आपको सबसे ज़्यादा हैरान कर देने वाली लगी? नीचे Comments में अपनी राय ज़रूर दीजिए!"

━━━━━━━━━━━━━━━━━━━━━━━━━━
📺 About Channel — Anchor Aadhya:
Anchor Aadhya भारत का पहला AI-पावर्ड फ्यूचर टेक और साइंस न्यूज़ बुलेटिन है, जहाँ आपको हर रोज़ दुनिया भर की सबसे ताज़ा और प्रामाणिक टेक्नोलॉजी की खबरें हिंदी में मिलती हैं। चाहे वो Artificial Intelligence हो, Robotics, Space Tech, Electric Vehicles या Quantum Computing — सबसे पहले और सबसे सटीक विश्लेषण सिर्फ यहाँ!

🔔 रोज़ाना नया वीडियो देखने के लिए तुरंत सब्सक्राइब करें और Bell Icon दबाएं!
👍 अगर आपको आज का बुलेटिन पसंद आया हो तो लाइक और दोस्तों के साथ शेयर ज़रूर करें!

━━━━━━━━━━━━━━━━━━━━━━━━━━
⚖️ COPYRIGHT & FAIR USE DISCLAIMER:
Under Section 107 of the US Copyright Act 1976 & Section 52(1)(a)(iii) of the Indian Copyright Act 1957, allowance is made for 'Fair Use' for purposes such as criticism, commentary, news reporting, teaching, scholarship, and research. Real-world news photos and reports referenced in this bulletin are used strictly under editorial transformative news reporting and public education. All rights belong to their respective original copyright holders.

━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ AI & SYNTHETIC CONTENT DISCLOSURE:
In full compliance with YouTube Community Guidelines & Policy:
This video features AI digital broadcast host 'Anchor Aadhya' presenting real, verified technology news sourced from global research labs, patents, and scientific publications. Voiceover narration and studio visuals are creatively rendered using artificial intelligence tools for educational and news reporting purposes.

━━━━━━━━━━━━━━━━━━━━━━━━━━
{final_hashtags}"""

    tags = []
    # 1. Story-Specific Search Tags First (Highest ranking power for exact searches)
    for s in stories[:num_s]:
        clean_h = s.get("headline", "").title()
        if clean_h and len(clean_h) < 45:
            tags.append(clean_h)
            tags.append(f"{clean_h} Hindi")
        for kw in s.get("keywords", [])[:3]:
            if len(kw) > 3:
                tags.append(kw.title())
                tags.append(f"{kw.title()} News")

    # 2. Channel & High-Traffic Niche Anchor Tags
    tags.extend([
        "Anchor Aadhya", "Tech News Hindi", "AI News Hindi",
        "Today Tech News Hindi", "Daily Tech News", "Breaking Tech News",
        "Future Tech", "Artificial Intelligence", "Technology Updates",
        "Latest Tech Inventions", "Tech News 2026", "Aadhya News"
    ])

    # Deduplicate and cap tags to YouTube 480 chars limit
    clean_tags = []
    total_len = 0
    for t in tags:
        t_clean = str(t).replace(",", "").strip()
        if t_clean and t_clean.lower() not in [x.lower() for x in clean_tags]:
            if total_len + len(t_clean) + 1 <= 480:
                clean_tags.append(t_clean)
                total_len += len(t_clean) + 1

    # Sanitize title and description for YouTube Data API v3 compliance
    title = str(title).replace("<", "").replace(">", "").strip()[:95]
    description = str(description).replace("<", "").replace(">", "").strip()
    if len(description) > 4900:
        description = description[:4900]

    meta_dict = {
        "title": title,
        "description": description,
        "tags": clean_tags,
        "categoryId": "28",  # Science & Technology
        "defaultLanguage": "hi",
        "selfDeclaredMadeForKids": False,
        "hasCustomThumbnail": True,
        "syntheticMedia": True,
        "videoFile": video_filename,
        "thumbnailFile": thumbnail_filename,
        "slot": slot
    }

    # Save JSON
    json_path = os.path.join(BASE_DIR, f"metadata_{today_slug}_{slot}.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(meta_dict, f, ensure_ascii=False, indent=2)

    # Save TXT copy
    txt_path = os.path.join(BASE_DIR, f"YOUTUBE_METADATA_{today_slug}_{slot}.txt")
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write("==============================================================\n")
        f.write(f"  ANCHOR AADHYA YOUTUBE METADATA ({today_slug} - {edition_label})\n")
        f.write("==============================================================\n\n")
        f.write(f"TITLE ({len(title)} chars):\n{title}\n\n")
        f.write(f"DESCRIPTION:\n{description}\n\n")
        f.write(f"TAGS:\n{', '.join(clean_tags)}\n\n")

    print(f"[SUCCESS] Generated Dynamic YouTube Metadata: {json_path}", flush=True)
    return meta_dict

if __name__ == "__main__":
    generate_video_metadata()
