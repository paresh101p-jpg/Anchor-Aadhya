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
    thumbnail_filename=None
):
    today_display = datetime.now().strftime("%d %B %Y")
    today_slug = datetime.now().strftime("%Y-%m-%d")
    edition_label = "12 PM Special" if slot == "12PM" else "5 PM Prime"

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

    # Format Chapters / Timestamps
    desc_chapters = f"""00:00 - आज की टॉप 4 हेडलाइंस (Today's Top 4 Tech Rundown)
00:38 - {stories[0]['headline']} ({stories[0]['category']})
01:20 - {stories[1]['headline']} ({stories[1]['category']})
02:05 - {stories[2]['headline']} ({stories[2]['category']})
02:50 - {stories[3]['headline']} ({stories[3]['category']})
03:30 - Anchor Aadhya Outro (Like & Subscribe!)"""

    # In-Depth Story Analysis
    desc_insights = ""
    for idx, s in enumerate(stories[:4]):
        desc_insights += f"\n{idx+1}️⃣ {s['headline']} ({s['category']}):\n"
        desc_insights += f"• मुख्य जानकारी: {s.get('bullet1', '')}\n"
        desc_insights += f"• भविष्य पर असर: {s.get('bullet2', '')}\n"
        if s.get("speech"):
            desc_insights += f"• आध्या का विश्लेषण: \"{s['speech'][:160]}...\"\n"

    description = f"""{headline_1} और {headline_2}! आज की सबसे बड़ी फ्यूचर टेक्नोलॉजी की खबरें सिर्फ Anchor Aadhya पर! 🚀🤖

Welcome to Anchor Aadhya — आपका अपना 100% भरोसेमंद डेली टेक और AI न्यूज़ बुलेटिन! आज {today_display} के इस {edition_label} में जानिए दुनिया भर की रिसर्च लैब्स, टेक कंपनियों और वैज्ञानिकों की वो 4 बड़ी खोजें, जो हमारे कल को हमेशा के लिए बदलने वाली हैं।

━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 TIMESTAMPS / CHAPTERS (खबरों के मुख्य बिंदु):
{desc_chapters}

━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 आज की 4 बड़ी खबरों का पूरा विश्लेषण (Detailed News Insights):
{desc_insights}
━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 आज का सवाल (Question of the Day):
"दोस्तों, आज की इन 4 खबरों में से कौन सी तकनीक आपको सबसे ज़्यादा हैरान कर देने वाली लगी? नीचे Comments में अपनी राय ज़रूर दीजिए!"

━━━━━━━━━━━━━━━━━━━━━━━━━━
📺 About Channel — Anchor Aadhya:
Anchor Aadhya भारत का पहला AI-पावर्ड फ्यूचर टेक और साइंस न्यूज़ बुलेटिन है, जहाँ आपको हर रोज़ दोपहर 12:00 बजे और शाम 5:00 बजे दुनिया भर की सबसे ताज़ा और प्रामाणिक टेक्नोलॉजी की खबरें हिंदी में मिलती हैं। चाहे वो Artificial Intelligence हो, Robotics, Space Tech, Electric Vehicles या Quantum Computing — सबसे पहले और सबसे सटीक विश्लेषण सिर्फ यहाँ!

🔔 रोज़ाना दोपहर 12 बजे और शाम 5 बजे नया वीडियो देखने के लिए तुरंत सब्सक्राइब करें और Bell Icon दबाएं!
👍 अगर आपको आज का बुलेटिन पसंद आया हो तो लाइक और दोस्तों के साथ शेयर ज़रूर करें!

━━━━━━━━━━━━━━━━━━━━━━━━━━
⚙️ AI & SYNTHETIC CONTENT DISCLOSURE:
In full compliance with YouTube Community Guidelines & Policy:
This video features AI digital broadcast host 'Anchor Aadhya' presenting real, verified technology news sourced from global research labs, patents, and scientific publications. Voiceover narration and studio visuals are creatively rendered using artificial intelligence tools for educational and news reporting purposes.

━━━━━━━━━━━━━━━━━━━━━━━━━━
#TechNews #AINews #AnchorAadhya #FutureTech #Robotics #ArtificialIntelligence #TechnologyHindi #DailyTechNews #{slot}News"""

    tags = [
        "Anchor Aadhya", "AI News Hindi", "Tech News Hindi", "Future Tech 2026",
        "Artificial Intelligence", "Daily Tech News", "Breaking Tech News",
        "Technology Updates", "Robotics Hindi", "Latest Tech Inventions",
        f"Tech News {slot}"
    ]
    for s in stories[:4]:
        tags.append(s.get("category", "").title())
        for kw in s.get("keywords", [])[:2]:
            tags.append(kw.title())

    # Limit tags list
    clean_tags = list(dict.fromkeys(tags))[:25]

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
