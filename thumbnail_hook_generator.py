# -*- coding: utf-8 -*-
"""
ANCHOR AADHYA VIRAL 16:9 HIGH-CTR THUMBNAIL GENERATOR
======================================================
Generates an irresistible, curiosity-driven YouTube Thumbnail for every 3D topic.
- Works 100% inside GitHub Actions runner & local machine.
- Zero extra dependencies (uses FFmpeg + bundled Noto Sans Devanagari Bold).
- Dynamic Curiosity Hook extraction per topic (Zack D. Films / Vox / MrBeast style).
- Bold Hindi typography with dual-tone glow (Yellow/White), heavy black stroke & drop shadow.
- Glowing Curiosity Pill Badge ('अंदर का सच | 3D ANATOMY') and Anchor Aadhya watermark.
- Zero missing emoji glyph boxes (all emojis safely removed from Devanagari drawtext).
"""

import os
import sys
import subprocess
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FONTS_DIR = os.path.join(BASE_DIR, "fonts")

FFMPEG_EXE = "ffmpeg"
if sys.platform == "win32":
    win_ffmpeg = r"E:\Paresh\Auto Post\ffmpeg-master-latest-win64-gpl\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe"
    if os.path.exists(win_ffmpeg):
        FFMPEG_EXE = win_ffmpeg


def resolve_fonts():
    """Finds bold Devanagari font and bold English font for cross-platform rendering."""
    local_dev = os.path.join(FONTS_DIR, "NotoSansDevanagari-Bold.ttf")
    dev_candidates = [
        local_dev,
        "/usr/share/fonts/truetype/noto/NotoSansDevanagari-Bold.ttf",
        "/usr/share/fonts/opentype/noto/NotoSansDevanagari-Bold.otf",
        "C:/Windows/Fonts/Nirmala.ttc",
        "C:/Windows/Fonts/NirmalaB.ttf",
    ]
    hindi_font = local_dev if os.path.exists(local_dev) else "arial.ttf"
    for c in dev_candidates:
        if os.path.exists(c):
            hindi_font = c
            break

    local_eng = os.path.join(FONTS_DIR, "impact.ttf")
    if not os.path.exists(local_eng):
        local_eng = os.path.join(FONTS_DIR, "arialbd.ttf")
    eng_candidates = [
        local_eng,
        "C:/Windows/Fonts/impact.ttf",
        "C:/Windows/Fonts/arialbd.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
    ]
    english_font = local_eng if os.path.exists(local_eng) else "arial.ttf"
    for c in eng_candidates:
        if os.path.exists(c):
            english_font = c
            break

    h_arg = os.path.abspath(hindi_font).replace("\\", "/").replace(":", "\\:")
    e_arg = os.path.abspath(english_font).replace("\\", "/").replace(":", "\\:")
    return h_arg, e_arg


def clean_text_for_font(text):
    """Strips emojis, symbols and replaces % with 'प्रतिशत' to avoid FFmpeg drawtext missing boxes."""
    if not text:
        return ""
    # Strip emojis / non-standard symbols
    emoji_pattern = re.compile(
        r'[\U00010000-\U0010ffff]|[\u2600-\u27bf]|[\u2300-\u23ff]|[\u2b50-\u2b55]|[\ufe00-\ufe0f]',
        re.UNICODE
    )
    cleaned = emoji_pattern.sub('', text)
    cleaned = cleaned.replace("%", " प्रतिशत")
    cleaned = cleaned.replace("⚠️", "").replace("😱", "").replace("🧠", "")
    return " ".join(cleaned.split())


def extract_topic_hook(topic):
    """Generates punchy, high-CTR curiosity text from topic title and lines."""
    # 1. Custom hook if defined in topic
    if topic.get("thumbnail_hook"):
        return clean_text_for_font(topic["thumbnail_hook"]), clean_text_for_font(topic.get("thumbnail_sub", "99 प्रतिशत लोग नहीं जानते!"))

    title = topic.get("title", "").split("#")[0].strip()
    t_id = topic.get("id", "").lower()

    # Dynamic intelligent patterns
    if "दिमाग" in title or "brain" in t_id or "sleep" in t_id:
        return "सोते समय दिमाग में ये क्या हुआ?", "99 प्रतिशत लोग नहीं जानते!"
    elif "चुइंगम" in title or "gum" in t_id:
        return "चुइंगम निगलने पर अंदर क्या हुआ?", "7 साल का चौंकाने वाला सच!"
    elif "पानी" in title or "water" in t_id:
        return "ठंडा पानी पीते ही क्या होता है?", "शरीर का चौंकाने वाला सच!"
    elif "छींक" in title or "sneeze" in t_id:
        return "छींक रोकने से क्या फट सकता है?", "गलती कभी मत करना!"
    elif "दिल" in title or "heart" in t_id:
        return "दिल 1 सेकंड के लिए रुक जाए तो?", "खतरनाक मेडिकल सच!"
    elif "खून" in title or "blood" in t_id:
        return "शरीर में खून कैसे दौड़ता है?", "अंदर का रहस्य!"
    elif "आँख" in title or "eye" in t_id:
        return "पलकें झपकाते ही अंदर क्या हुआ?", "चौंकाने वाला सच!"
    elif "नींद" in title or "hypnic" in t_id:
        return "रात को अचानक झटका क्यों लगता है?", "दिमाग का असली राज!"
    elif "कॉफी" in title or "coffee" in t_id:
        return "कॉफी पीते ही दिमाग में क्या बदलता है?", "न्यूरॉन्स का सच!"
    elif "हिचकी" in title or "hiccup" in t_id:
        return "हिचकी असल में क्यों आती है?", "डायफ्राम का चौंकाने वाला सच!"
    else:
        # Clean title to first 5 words
        words = clean_text_for_font(title).replace("क्या होगा", "").replace("अगर आप", "").strip().split()
        short_title = " ".join(words[:4]) + " का सच?"
        return short_title, "99 प्रतिशत लोग नहीं जानते!"


def generate_curiosity_hook_thumbnail(raw_frame_path, topic, output_path=None):
    """
    Overlays high-retention curiosity hook typography onto the 16:9 raw 3D frame.
    Outputs a crystal-clear 1920x1080 / 1280x720 high-CTR YouTube thumbnail.
    """
    if not os.path.exists(raw_frame_path):
        print(f"[Warning] Raw frame missing: {raw_frame_path}")
        return raw_frame_path

    out_file = output_path or os.path.join(os.path.dirname(raw_frame_path), "high_ctr_hook_thumb.jpg")
    hindi_font_arg, english_font_arg = resolve_fonts()

    hook_main, hook_sub = extract_topic_hook(topic)
    badge_text = "अंदर का असली सच"

    # Write UTF-8 text files for FFmpeg HarfBuzz text_shaping
    temp_dir = os.path.dirname(out_file)
    badge_f = os.path.join(temp_dir, "temp_h_badge.txt")
    main_f = os.path.join(temp_dir, "temp_h_main.txt")
    sub_f = os.path.join(temp_dir, "temp_h_sub.txt")

    with open(badge_f, "w", encoding="utf-8") as f:
        f.write(badge_text)
    with open(main_f, "w", encoding="utf-8") as f:
        f.write(hook_main)
    with open(sub_f, "w", encoding="utf-8") as f:
        f.write(hook_sub)

    badge_arg = os.path.abspath(badge_f).replace("\\", "/").replace(":", "\\:")
    main_arg = os.path.abspath(main_f).replace("\\", "/").replace(":", "\\:")
    sub_arg = os.path.abspath(sub_f).replace("\\", "/").replace(":", "\\:")

    # High-CTR Visual Effects Chain:
    # 1. Scale to 1920x1080
    # 2. Slight contrast boost (eq=contrast=1.12:saturation=1.18)
    # 3. Bottom cinematic shadow (black@0.88) and top subtle shadow (black@0.55)
    # 4. Red alert pill badge top-left
    # 5. Giant bright yellow hook headline with 14px black border
    # 6. Glowing white sub-headline with 8px border
    # 7. Anchor Aadhya verified brand tag top-right
    vf = (
        f"scale=1920:1080,"
        f"eq=contrast=1.12:saturation=1.18,"
        f"drawbox=y=0:h=180:color=black@0.55:t=fill,"
        f"drawbox=y=550:h=530:color=black@0.88:t=fill,"
        f"drawbox=x=60:y=546:w=1800:h=6:color=0xFF0033@0.95:t=fill,"
        f"drawbox=x=70:y=45:w=440:h=90:color=0xCC0000@0.98:t=fill,"
        f"drawbox=x=66:y=41:w=448:h=98:color=0xFFFFFF@0.90:t=4,"
        f"drawtext=fontfile='{hindi_font_arg}':textfile='{badge_arg}':fontcolor=white:fontsize=46:x=95:y=66:text_shaping=1,"
        f"drawtext=fontfile='{hindi_font_arg}':textfile='{main_arg}':fontcolor=0xFFE600:fontsize=120:x=70:y=600:borderw=14:bordercolor=black:text_shaping=1,"
        f"drawtext=fontfile='{hindi_font_arg}':textfile='{sub_arg}':fontcolor=0xFFFFFF:fontsize=78:x=70:y=765:borderw=8:bordercolor=black:text_shaping=1,"
        f"drawbox=x=70:y=890:w=580:h=82:color=0x0088CC@0.95:t=fill,"
        f"drawbox=x=66:y=886:w=588:h=90:color=0xFFFFFF@0.85:t=3,"
        f"drawtext=fontfile='{english_font_arg}':text='WATCH FULL 3D':fontcolor=white:fontsize=46:x=120:y=908,"
        f"drawtext=fontfile='{english_font_arg}':text='ANCHOR AADHYA':fontcolor=0xFFCC00:fontsize=44:x=1440:y=70:borderw=4:bordercolor=black"
    )

    cmd = [
        FFMPEG_EXE, "-y",
        "-i", raw_frame_path,
        "-vf", vf,
        "-frames:v", "1",
        "-update", "1",
        "-q:v", "2",
        out_file
    ]

    print(f"Generating Viral High-CTR Curiosity Thumbnail for: {topic.get('title', '')[:40]}...", flush=True)
    subprocess.run(cmd, check=True)

    for tf in [badge_f, main_f, sub_f]:
        if os.path.exists(tf):
            try:
                os.remove(tf)
            except Exception:
                pass

    print(f"✅ High-CTR Curiosity Thumbnail Ready: {out_file} ({os.path.getsize(out_file)/(1024):.1f} KB)", flush=True)
    return out_file


if __name__ == "__main__":
    test_topic = {
        "id": "sleep_brain",
        "title": "हमारा दिमाग रात को सोते समय क्या करता है? 🧠 #Shorts"
    }
    sample_frame = os.path.join(BASE_DIR, "engine_3d", "review", "cover", "thumb_16_9.jpg")
    if not os.path.exists(sample_frame):
        sample_frame = os.path.join(BASE_DIR, "engine_3d", "review", "cover", "t6.50.jpg")
    if os.path.exists(sample_frame):
        res = generate_curiosity_hook_thumbnail(sample_frame, test_topic, os.path.join(BASE_DIR, "test_aadhya_hook_thumb.jpg"))
        print(f"Result: {res}")
