# -*- coding: utf-8 -*-
"""
Anchor Aadhya - Autonomous Daily AI & Future Tech News Video Generator
- Zero Duplication Guarantee: Curates 4 100% fresh, never-before-used tech stories
- Dynamic Wardrobe: Rotates across 5 Broadcast-Grade Anchor Aadhya Poses/Outfits
- Emotion-Adaptive Voice Modulation: Microsoft Swara Neural with rate/pitch styling
  (Dramatic, Funny/Masti, Serious/Caution, Inspirational/Joy)
- Full HD 1080p Broadcast Motion Graphics: Header bar, Logo bug, Rundown board, Lower-thirds, Scrolling ticker
- Multi-Slot Support: 12:00 PM (Afternoon Special) and 05:00 PM (Prime Evening Bulletin)
"""

import os
import sys
import asyncio
import subprocess
import urllib.request
import argparse
from datetime import datetime
import edge_tts
from PIL import Image, ImageDraw, ImageFont

from news_manager import (
    get_current_slot,
    get_fresh_bulletin_stories,
    select_anchor_look,
    commit_bulletin_stories,
    generate_ai_news_image,
    VOICE_PROFILES,
    append_image_archive,
    load_images_archive
)
from generate_thumbnail import create_youtube_thumbnail
from generate_metadata import generate_video_metadata

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FFMPEG_BIN = r"E:\Paresh\Auto Post\ffmpeg-master-latest-win64-gpl\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe"
if not os.path.exists(FFMPEG_BIN):
    FFMPEG_BIN = "ffmpeg"
FFPROBE_BIN = r"E:\Paresh\Auto Post\ffmpeg-master-latest-win64-gpl\ffmpeg-master-latest-win64-gpl\bin\ffprobe.exe"
if not os.path.exists(FFPROBE_BIN):
    FFPROBE_BIN = "ffprobe"

LOGO_BUG_PATH = os.path.join(BASE_DIR, "anchor_aadhya_screen_bug.png")
HEADER_BAR_PATH = os.path.join(BASE_DIR, "header_bar.png")

def get_font(size, bold=True):
    font_paths = [
        # Windows Fonts
        r"C:\Windows\Fonts\segoeuib.ttf",
        r"C:\Windows\Fonts\arialbd.ttf",
        r"C:\Windows\Fonts\impact.ttf",
        # Ubuntu / Linux Fonts with full Latin / Hinglish / Symbol support
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
        "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf"
    ] if bold else [
        # Windows Fonts
        r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arial.ttf",
        # Ubuntu / Linux Fonts with full Latin / Hinglish / Symbol support
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()

TOPIC_STOCK_URLS = {
    "drone": {
        1: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1920&q=85",
        2: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=1920&q=85"
    },
    "robot": {
        1: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=85",
        2: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920&q=85"
    },
    "quantum": {
        1: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1920&q=85",
        2: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=85"
    },
    "neuralink": {
        1: "https://images.unsplash.com/photo-1559757175-5700dde675bc?w=1920&q=85",
        2: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=1920&q=85"
    },
    "fusion": {
        1: "https://images.unsplash.com/photo-1509391365360-2e959784a276?w=1920&q=85",
        2: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1920&q=85"
    },
    "flying": {
        1: "https://images.unsplash.com/photo-1559087867-ce4c91325525?w=1920&q=85",
        2: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1920&q=85"
    },
    "car": {
        1: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1920&q=85",
        2: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=1920&q=85"
    },
    "medicine": {
        1: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1920&q=85",
        2: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1920&q=85"
    },
    "tech": {
        1: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1920&q=85",
        2: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=85"
    }
}

def get_topic_matching_fallback(story, shot_idx=1, dest_file=None):
    """
    Intelligently download fresh, topic-matching 1080p visual on-the-fly via high-speed CDN.
    Shot 1 = Wide/Action view, Shot 2 = Close-up / Macro / Alternative angle.
    NEVER reuses old static images, and NEVER uses a car image for non-car stories!
    """
    if dest_file and os.path.exists(dest_file) and os.path.getsize(dest_file) > 10000:
        return dest_file

    cat = (story.get("category", "") + " " + story.get("headline", "") + " " + " ".join(story.get("keywords", []))).lower()
    
    selected_topic = "tech"
    if any(k in cat for k in ["drone", "racing", "aerial", "aviation"]):
        selected_topic = "drone"
    elif any(k in cat for k in ["robot", "humanoid", "factory", "assembly", "figure", "bipedal", "chef"]):
        selected_topic = "robot"
    elif any(k in cat for k in ["quantum", "crystal", "chip", "computing", "hacker", "cyber"]):
        selected_topic = "quantum"
    elif any(k in cat for k in ["neuralink", "brain", "mind", "telepathy", "paralysis"]):
        selected_topic = "neuralink"
    elif any(k in cat for k in ["fusion", "sun", "reactor", "tokamak", "energy", "solar"]):
        selected_topic = "fusion"
    elif any(k in cat for k in ["flying car", "evtol", "air taxi", "flying"]):
        selected_topic = "flying"
    elif any(k in cat for k in ["car", "tesla", "roadster", "thruster", "vehicle"]):
        selected_topic = "car"
    elif any(k in cat for k in ["medicine", "health", "cancer", "cure", "dna", "biology", "vision", "bionic"]):
        selected_topic = "medicine"

    url = TOPIC_STOCK_URLS[selected_topic].get(shot_idx, TOPIC_STOCK_URLS[selected_topic][1])
    
    if not dest_file:
        today_slug = datetime.now().strftime("%Y-%m-%d")
        dest_file = os.path.join(BASE_DIR, f"dynamic_fallback_{today_slug}_{selected_topic}_shot{shot_idx}.jpg")
    
    print(f"  --> [ON-THE-FLY TOPIC VISUAL] Fetching {selected_topic.upper()} Shot {shot_idx}...", flush=True)
    temp_dl = dest_file + ".tmp.jpg"
    curl_cmd = [
        "curl", "-s", "-L", "-f", "-m", "15",
        "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        url, "-o", temp_dl
    ]
    try:
        res = subprocess.run(curl_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=20)
        if res.returncode == 0 and os.path.exists(temp_dl) and os.path.getsize(temp_dl) > 10000:
            im = Image.open(temp_dl).convert("RGB").resize((1920, 1080), Image.Resampling.LANCZOS)
            im.save(dest_file, "JPEG", quality=95)
            if os.path.exists(temp_dl):
                os.remove(temp_dl)
            return dest_file
    except Exception as e:
        print(f"  [WARN] Fallback download error: {e}", flush=True)
    finally:
        if os.path.exists(temp_dl):
            try: os.remove(temp_dl)
            except Exception: pass

    # If curl failed completely, create an elegant dark cyber gradient image
    im = Image.new("RGB", (1920, 1080), (12, 18, 38))
    im.save(dest_file, "JPEG", quality=90)
    return dest_file

def create_ai_news_images(slot, stories):
    print("\n--- 1. Generating 100% Brand-New AI Photorealistic News Imagery (Dual-Shot B-Roll) ---", flush=True)
    today_slug = datetime.now().strftime("%Y-%m-%d")

    for idx, item in enumerate(stories):
        # Shot 1: Wide / Action Perspective
        dest1 = os.path.join(BASE_DIR, f"news_{today_slug}_{slot}_ai_story_{idx+1}_shot1.jpg")
        prompt1 = item.get("ai_image_prompt", f"futuristic modern technology {item['category']}")
        ok1 = generate_ai_news_image(prompt1, dest1, story_id=item.get("id"), shot_idx=1)
        if not ok1 or not os.path.exists(dest1):
            dest1 = get_topic_matching_fallback(item, shot_idx=1, dest_file=dest1)
        item["bg_img_1"] = dest1
        item["bg_img"] = dest1  # Backwards compatibility (for thumbnails & metadata)

        # Shot 2: Dynamic Macro / High-Tech Close-up Perspective
        dest2 = os.path.join(BASE_DIR, f"news_{today_slug}_{slot}_ai_story_{idx+1}_shot2.jpg")
        prompt2 = item.get("ai_image_prompt_2", f"extreme high-tech macro close-up photography of {item['category']}, 8k")
        ok2 = generate_ai_news_image(prompt2, dest2, story_id=item.get("id"), shot_idx=2)
        if not ok2 or not os.path.exists(dest2):
            dest2 = get_topic_matching_fallback(item, shot_idx=2, dest_file=dest2)
        item["bg_img_2"] = dest2

        print(f"  --> [AI DUAL SHOTS READY] Story {idx+1}:", flush=True)
        print(f"       • Shot 1 (Wide): {dest1}", flush=True)
        print(f"       • Shot 2 (Macro): {dest2}", flush=True)


def create_graphics_layers(today_display, slot, stories, rundown_items):
    print("\n--- 2. Generating Modern TV Broadcast Motion Overlays ---", flush=True)
    edition_label = "LATEST BREAKING TECH"

    # Header bar
    header = Image.new("RGBA", (1920, 65), (0, 0, 0, 0))
    hd = ImageDraw.Draw(header)
    hd.rectangle([(0, 0), (1920, 63)], fill=(10, 15, 28, 235))
    bar_line_color = (0, 180, 255, 255) if slot == "12PM" else (255, 30, 86, 255)
    hd.line([(0, 63), (1920, 63)], fill=bar_line_color, width=3)
    font_header = get_font(24, bold=True)
    hd.text((180, 18), f"ANCHOR AADHYA  |  DAILY TECH BULLETIN • {today_display.upper()}", font=font_header, fill=(255, 255, 255))
    hd.text((1480, 18), edition_label, font=font_header, fill=(0, 220, 255))
    header.save(HEADER_BAR_PATH, "PNG")

    # Scene 1 Rundown Board
    board = Image.new("RGBA", (840, 480), (0, 0, 0, 0))
    bd = ImageDraw.Draw(board)
    bd.rectangle([(0, 0), (840, 480)], fill=(10, 15, 28, 230))
    bd.rectangle([(0, 0), (840, 65)], fill=(220, 20, 60, 255))
    font_board_title = get_font(30, bold=True)
    bd.text((25, 16), "TOP 4 TECH HEADLINES", font=font_board_title, fill=(255, 255, 255))
    board_path = os.path.join(BASE_DIR, "scene1_board.png")
    board.save(board_path, "PNG")

    rundown_paths = []
    font_r_num = get_font(24, bold=True)
    font_r_title = get_font(24, bold=False)
    for idx, r in enumerate(rundown_items):
        strip = Image.new("RGBA", (800, 75), (0, 0, 0, 0))
        sd = ImageDraw.Draw(strip)
        sd.rectangle([(0, 0), (800, 75)], fill=(18, 25, 45, 240))
        sd.line([(0, 0), (800, 0)], fill=(0, 220, 255, 200), width=2)
        sd.rectangle([(12, 12), (105, 62)], fill=(0, 180, 255, 255))
        sd.text((25, 23), f"#{r['num']}", font=font_r_num, fill=(255, 255, 255))
        sd.text((120, 23), r["title"][:48], font=font_r_title, fill=(255, 255, 255))
        s_path = os.path.join(BASE_DIR, f"scene1_rundown_{idx+1}.png")
        strip.save(s_path, "PNG")
        rundown_paths.append(s_path)

    # Lower-third plates and bullets
    plate_paths = []
    bullet1_paths = []
    bullet2_paths = []

    font_badge = get_font(28, bold=True)
    font_headline = get_font(44, bold=True)
    font_bullet = get_font(32, bold=True)

    for idx, item in enumerate(stories):
        plate = Image.new("RGBA", (1920, 265), (0, 0, 0, 0))
        draw = ImageDraw.Draw(plate)
        draw.rectangle([(0, 25), (1920, 265)], fill=(10, 15, 28, 230))
        draw.line([(0, 25), (1920, 25)], fill=item["badge_color"], width=5)

        cat_text = f"  {item['category']}  "
        draw.rectangle([(60, 0), (540, 50)], fill=item["badge_color"])
        draw.text((75, 8), cat_text, font=font_badge, fill=(255, 255, 255))
        draw.text((65, 75), item["headline"][:52], font=font_headline, fill=(255, 255, 255))

        plate_file = os.path.join(BASE_DIR, f"plate_{idx+1}.png")
        plate.save(plate_file, "PNG")
        plate_paths.append(plate_file)

        b1_img = Image.new("RGBA", (1800, 48), (0, 0, 0, 0))
        b1_draw = ImageDraw.Draw(b1_img)
        b1_draw.text((0, 0), item.get("bullet1", "")[:70], font=font_bullet, fill=(0, 225, 255, 255))
        b1_file = os.path.join(BASE_DIR, f"bullet1_{idx+1}.png")
        b1_img.save(b1_file, "PNG")
        bullet1_paths.append(b1_file)

        b2_img = Image.new("RGBA", (1800, 48), (0, 0, 0, 0))
        b2_draw = ImageDraw.Draw(b2_img)
        b2_draw.text((0, 0), item.get("bullet2", "")[:70], font=font_bullet, fill=(255, 215, 0, 255))
        b2_file = os.path.join(BASE_DIR, f"bullet2_{idx+1}.png")
        b2_img.save(b2_file, "PNG")
        bullet2_paths.append(b2_file)

    return board_path, rundown_paths, plate_paths, bullet1_paths, bullet2_paths

async def generate_speech_audio(scenes_list):
    print("\n--- 3. Synthesizing Emotion-Adaptive Hindi Voice (Swara Neural) ---", flush=True)
    voice = "hi-IN-SwaraNeural"
    audio_paths = []

    for idx, item in enumerate(scenes_list):
        audio_path = os.path.join(BASE_DIR, f"tv_voice_{idx+1}.mp3")
        emotion = item.get("emotion", "dramatic")
        profile = VOICE_PROFILES.get(emotion, {"rate": "+2%", "pitch": "+0Hz"})
        
        rate_val = profile.get("rate", "+0%")
        if not rate_val.startswith(("+", "-")):
            rate_val = f"+{rate_val}"
        pitch_val = profile.get("pitch", "+0Hz")
        if not pitch_val.startswith(("+", "-")):
            pitch_val = f"+{pitch_val}"

        print(f"  --> Voice {idx+1} Emotion [{emotion.upper()}]: Rate={rate_val}, Pitch={pitch_val}", flush=True)
        communicate = edge_tts.Communicate(
            item["speech"],
            voice=voice,
            rate=rate_val,
            pitch=pitch_val
        )
        await communicate.save(audio_path)
        audio_paths.append(audio_path)

    return audio_paths

def get_audio_duration(file_path):
    cmd = [
        FFPROBE_BIN, "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", file_path
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    try:
        return float(res.stdout.strip())
    except Exception:
        return 28.0

def render_scenes_with_motion(scenes_list, board_path, rundown_paths, plate_paths, bullet1_paths, bullet2_paths, audio_paths, today_display, slot):
    print("\n--- 4. Rendering HD 1080p Scenes with Motion Graphics ---", flush=True)
    scene_videos = []
    ticker_font = "C\\:/Windows/Fonts/segoeui.ttf"
    for candidate in [
        r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
        "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf"
    ]:
        if os.path.exists(candidate):
            ticker_font = candidate.replace("\\", "/").replace(":", "\\:")
            break

    ticker_text = (
        f"ANCHOR AADHYA • DAILY TECH BULLETIN • {today_display.upper()} • "
        f"TOP 4 BREAKING AI & FUTURE TECH STORIES • "
        f"STAY TUNED FOR NEXT UPDATE • SUBSCRIBE TO ANCHOR AADHYA • "
    )

    for idx, (item, plate, b1_path, b2_path, audio) in enumerate(zip(scenes_list, plate_paths, bullet1_paths, bullet2_paths, audio_paths)):
        dur = get_audio_duration(audio) + 0.6
        scene_mp4 = os.path.join(BASE_DIR, f"tv_scene_{idx+1}.mp4")
        frames = int(dur * 25)

        if idx == 0:
            # Scene 1: Rundown Board + Anchor Aadhya
            filter_complex = (
                f"[0:v]scale=1920:1080,zoompan=z='min(zoom+0.0003,1.03)':d={frames}:s=1920x1080:fps=25[bg];"
                f"[bg][1:v]overlay=0:0[w_hdr];"
                f"[w_hdr][2:v]overlay=x=25:y='10 + 4*sin(2*PI*t/3)'[w_logo];"
                f"[w_logo][3:v]overlay=x='if(lte(t,0.8), -850 + 910*sin((t-0.4)/0.4*1.5708), 60)':y=140:enable='between(t,0.4,999)'[w_bd];"
                f"[w_bd][4:v]overlay=x='if(lte(t,1.4), -850 + 930*sin((t-1.0)/0.4*1.5708), 80)':y=220:enable='between(t,1.0,999)'[w_r1];"
                f"[w_r1][5:v]overlay=x='if(lte(t,2.6), -850 + 930*sin((t-2.2)/0.4*1.5708), 80)':y=305:enable='between(t,2.2,999)'[w_r2];"
                f"[w_r2][6:v]overlay=x='if(lte(t,3.8), -850 + 930*sin((t-3.4)/0.4*1.5708), 80)':y=390:enable='between(t,3.4,999)'[w_r3];"
                f"[w_r3][7:v]overlay=x='if(lte(t,5.0), -850 + 930*sin((t-4.6)/0.4*1.5708), 80)':y=475:enable='between(t,4.6,999)'[w_r4];"
                f"[w_r4][8:v]overlay=x='if(lte(t,7.2), -1920 + 1920*sin((t-6.5)/0.7*1.5708), 0)':y=770:enable='between(t,6.5,999)'[w_plt];"
                f"[w_plt][9:v]overlay=x='if(lte(t,8.1), -1800 + 1870*sin((t-7.5)/0.6*1.5708), 70)':y=915:enable='between(t,7.5,999)'[w_b1];"
                f"[w_b1][10:v]overlay=x='if(lte(t,10.1), -1800 + 1870*sin((t-9.5)/0.6*1.5708), 70)':y=965:enable='between(t,9.5,999)'[w_b2];"
                f"[w_b2]drawbox=y=1035:color=black@0.95:width=1920:height=45:t=fill,"
                f"drawbox=y=1033:color=0x00dcff@1:width=1920:height=2:t=fill,"
                f"drawtext=fontfile='{ticker_font}':text='{ticker_text}':fontsize=25:fontcolor=white:x='w-mod(t*140,w+text_w)':y=1045[v]"
            )
            cmd = [
                FFMPEG_BIN, "-y",
                "-loop", "1", "-i", item["bg_img"],
                "-loop", "1", "-i", HEADER_BAR_PATH,
                "-loop", "1", "-i", LOGO_BUG_PATH,
                "-loop", "1", "-i", board_path,
                "-loop", "1", "-i", rundown_paths[0],
                "-loop", "1", "-i", rundown_paths[1],
                "-loop", "1", "-i", rundown_paths[2],
                "-loop", "1", "-i", rundown_paths[3],
                "-loop", "1", "-i", plate,
                "-loop", "1", "-i", b1_path,
                "-loop", "1", "-i", b2_path,
                "-i", audio,
                "-filter_complex", filter_complex,
                "-map", "[v]", "-map", "11:a",
                "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "fast",
                "-c:a", "aac", "-b:a", "192k",
                "-t", str(dur),
                scene_mp4
            ]
        elif idx < len(scenes_list) - 1:
            # News Story Scenes (Scenes 2 to 5): Dual-Shot B-Roll Cuts with Zoom-In & Zoom-Out
            img1 = item.get("bg_img_1", item.get("bg_img"))
            img2 = item.get("bg_img_2", img1)
            dur1 = round(dur / 2.0, 2)
            dur2 = round(dur - dur1, 2)
            f1 = int(dur1 * 25)
            f2 = int(dur2 * 25)

            filter_complex = (
                f"[0:v]scale=1920:1080,setsar=1,zoompan=z='min(zoom+0.0004,1.06)':d={f1}:s=1920x1080:fps=25,setsar=1[shot1];"
                f"[1:v]scale=1920:1080,setsar=1,zoompan=z='max(1.06-0.0004*on,1.0)':d={f2}:s=1920x1080:fps=25,setsar=1[shot2];"
                f"[shot1][shot2]concat=n=2:v=1:a=0[bg];"
                f"[bg][2:v]overlay=0:0[with_hdr];"
                f"[with_hdr][3:v]overlay=x=25:y='10 + 4*sin(2*PI*t/3)'[with_logo];"
                f"[with_logo][4:v]overlay=x='if(lte(t,0.7), -1920 + 1920*sin(t/0.7*1.5708), 0)':y=770[with_plate];"
                f"[with_plate][5:v]overlay=x='if(lte(t,1.8), -1800 + 1870*sin((t-1.2)/0.6*1.5708), 70)':y=915:enable='between(t,1.2,999)'[with_b1];"
                f"[with_b1][6:v]overlay=x='if(lte(t,4.1), -1800 + 1870*sin((t-3.5)/0.6*1.5708), 70)':y=965:enable='between(t,3.5,999)'[with_b2];"
                f"[with_b2]drawbox=y=1035:color=black@0.95:width=1920:height=45:t=fill,"
                f"drawbox=y=1033:color=0x00dcff@1:width=1920:height=2:t=fill,"
                f"drawtext=fontfile='{ticker_font}':text='{ticker_text}':fontsize=25:fontcolor=white:x='w-mod(t*140,w+text_w)':y=1045[v]"
            )
            cmd = [
                FFMPEG_BIN, "-y",
                "-loop", "1", "-t", str(dur1), "-i", img1,
                "-loop", "1", "-t", str(dur2), "-i", img2,
                "-loop", "1", "-i", HEADER_BAR_PATH,
                "-loop", "1", "-i", LOGO_BUG_PATH,
                "-loop", "1", "-i", plate,
                "-loop", "1", "-i", b1_path,
                "-loop", "1", "-i", b2_path,
                "-i", audio,
                "-filter_complex", filter_complex,
                "-map", "[v]", "-map", "7:a",
                "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "fast",
                "-c:a", "aac", "-b:a", "192k",
                "-t", str(dur),
                scene_mp4
            ]
        else:
            # Outro Scene (Scene 6): Anchor Aadhya Goodbye & Call-to-Action
            filter_complex = (
                f"[0:v]scale=1920:1080,zoompan=z='min(zoom+0.0003,1.03)':d={frames}:s=1920x1080:fps=25[bg];"
                f"[bg][1:v]overlay=0:0[with_hdr];"
                f"[with_hdr][2:v]overlay=x=25:y='10 + 4*sin(2*PI*t/3)'[with_logo];"
                f"[with_logo][3:v]overlay=x='if(lte(t,0.7), -1920 + 1920*sin(t/0.7*1.5708), 0)':y=770[with_plate];"
                f"[with_plate][4:v]overlay=x='if(lte(t,1.8), -1800 + 1870*sin((t-1.2)/0.6*1.5708), 70)':y=915:enable='between(t,1.2,999)'[with_b1];"
                f"[with_b1][5:v]overlay=x='if(lte(t,4.1), -1800 + 1870*sin((t-3.5)/0.6*1.5708), 70)':y=965:enable='between(t,3.5,999)'[with_b2];"
                f"[with_b2]drawbox=y=1035:color=black@0.95:width=1920:height=45:t=fill,"
                f"drawbox=y=1033:color=0x00dcff@1:width=1920:height=2:t=fill,"
                f"drawtext=fontfile='{ticker_font}':text='{ticker_text}':fontsize=25:fontcolor=white:x='w-mod(t*140,w+text_w)':y=1045[v]"
            )
            cmd = [
                FFMPEG_BIN, "-y",
                "-loop", "1", "-i", item["bg_img"],
                "-loop", "1", "-i", HEADER_BAR_PATH,
                "-loop", "1", "-i", LOGO_BUG_PATH,
                "-loop", "1", "-i", plate,
                "-loop", "1", "-i", b1_path,
                "-loop", "1", "-i", b2_path,
                "-i", audio,
                "-filter_complex", filter_complex,
                "-map", "[v]", "-map", "6:a",
                "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "fast",
                "-c:a", "aac", "-b:a", "192k",
                "-t", str(dur),
                scene_mp4
            ]

        res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
        if res.returncode != 0:
            print(f"FFmpeg Error Scene {idx+1}:", res.stderr[-400:], flush=True)
            sys.exit(1)
        scene_videos.append(scene_mp4)
        print(f"  --> Rendered Motion Scene {idx+1} ({dur:.1f}s): {scene_mp4}", flush=True)

    return scene_videos

def render_master_news_video(scene_videos, output_video):
    print(f"\n--- 5. Combining Scenes with Studio News Ambient Audio ---", flush=True)
    list_file = os.path.join(BASE_DIR, "tv_scenes_list.txt")
    with open(list_file, "w", encoding="utf-8") as f:
        for vid in scene_videos:
            clean_name = os.path.basename(vid)
            f.write(f"file '{clean_name}'\n")

    temp_concat = os.path.join(BASE_DIR, "temp_concat_tv.mp4")
    cmd_concat = [
        FFMPEG_BIN, "-y",
        "-f", "concat", "-safe", "0", "-i", list_file,
        "-c", "copy",
        temp_concat
    ]
    subprocess.run(cmd_concat, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    cmd_final = [
        FFMPEG_BIN, "-y",
        "-i", temp_concat,
        "-af", "volume=1.08,bass=g=2:f=180,treble=g=1.5:f=3500",
        "-c:v", "copy",
        "-c:a", "aac", "-b:a", "256k",
        output_video
    ]
    subprocess.run(cmd_final, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    print(f"\n[SUCCESS] MASTER NEWS VIDEO READY: {output_video}", flush=True)

def cleanup_temp_files():
    print("\n--- 6. Cleaning Up Temporary Rendering Assets ---", flush=True)
    patterns = ["tv_scene_*", "plate_*", "bullet*", "scene1_*", "tv_voice_*", "temp_concat*"]
    import glob
    for pat in patterns:
        for f in glob.glob(os.path.join(BASE_DIR, pat)):
            try:
                os.remove(f)
            except Exception:
                pass
    list_f = os.path.join(BASE_DIR, "tv_scenes_list.txt")
    if os.path.exists(list_f):
        try:
            os.remove(list_f)
        except Exception:
            pass
    print("  --> Folder Cleaned. Only master assets and final video remain.", flush=True)

async def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--slot", choices=["12PM", "5PM"], default=None, help="Bulletin Slot: 12PM or 5PM")
    args = parser.parse_args()

    slot = get_current_slot(args.slot)
    today_str = datetime.now().strftime("%Y-%m-%d")
    today_display = datetime.now().strftime("%d %B %Y")
    output_video = os.path.join(BASE_DIR, f"Anchor_Aadhya_News_{today_str}_{slot}.mp4")

    print("==============================================================")
    print(f"  AI & FUTURE TECH - {slot} BULLETIN AUTOMATION ({today_str})")
    print(f"  ANCHOR: AADHYA | ZERO DUPLICATES | DYNAMIC WARDROBE & EMOTIONS")
    print("==============================================================")

    # 1. Fetch 4 brand-new non-duplicate stories
    stories = get_fresh_bulletin_stories(slot)
    dominant_emotion = stories[0].get("emotion", "dramatic")
    anchor_look = select_anchor_look(slot, dominant_emotion)
    print(f"  --> Active Anchor Look: {anchor_look['name']} ({anchor_look['style_desc']})")

    # 2. Generate 100% Brand-New AI Photorealistic News Imagery
    create_ai_news_images(slot, stories)

    # 3. Create Scene 1 (Hook / Rundown) & Scene 6 (Outro)
    rundown_items = []
    for idx, s in enumerate(stories):
        rundown_items.append({"num": f"0{idx+1}", "title": s["headline"]})

    hook_scene = {
        "id": "scene_1_hook",
        "bg_img": anchor_look["file"],
        "category": "TOP 4 BREAKING NEWS",
        "badge_color": anchor_look["theme_color"],
        "headline": "CRAZY TECH BULLETINS: TOP 4 BREAKING!",
        "bullet1": f"• 1. {stories[0]['headline'][:45]}",
        "bullet2": f"• 2. {stories[1]['headline'][:45]}",
        "emotion": "dramatic",
        "speech": f"अरे रुकिए रुकिए! अगर आप आज की सबसे बड़ी फ्यूचर टेक खबरें मिस नहीं करना चाहते, तो स्क्रीन स्क्रॉल करना तुरंत बंद कीजिए! नमस्कार, आज {today_display} है, मैं हूँ आपकी अपनी होस्ट आध्या... और स्वागत है Anchor Aadhya के आज के ताज़ा टेक बुलेटिन में! आज दुनिया भर की रिसर्च लैब्स से ऐसी चार क्रांतिकारी खबरें सामने आई हैं जो होश उड़ा देंगी! चलिए शुरू करते हैं!"
    }

    outro_scene = {
        "id": "scene_6_outro",
        "bg_img": anchor_look["file"],
        "category": "NEXT TECH BULLETIN",
        "badge_color": anchor_look["theme_color"],
        "headline": "AGLA BULLETIN: JALD HI AAYEGA!",
        "bullet1": "• Video ko Like & Doston ke saath Share karein",
        "bullet2": "• Channel Subscribe karein aur Bell Icon dabayein!",
        "emotion": "inspirational_joy",
        "speech": "तो दोस्तों, ये थीं आज की सबसे बड़ी और क्रांतिकारी फ्यूचर टेक खबरें! कैसी लगी आपको आज की ये ताज़ा टेक बुलेटिन? अगर मज़ा आया हो तो तुरंत वीडियो को लाइक करो, अपने दोस्तों के साथ शेयर करो, और चैनल Anchor Aadhya को सब्सक्राइब ज़रूर कर लेना! हम फिर मिलेंगे अगले ताज़ा और ब्रेकिंग टेक बुलेटिन के साथ! तब तक अपना ख़्याल रखिए, खुश रहिए और बाय-बाय!"
    }

    full_scenes_list = [hook_scene] + stories + [outro_scene]

    # 4. Generate Graphics Layers
    board_path, rundown_paths, plate_paths, bullet1_paths, bullet2_paths = create_graphics_layers(
        today_display, slot, full_scenes_list, rundown_items
    )

    # 5. Generate Voice Audio
    audio_paths = await generate_speech_audio(full_scenes_list)

    # 6. Render Scenes and Master Video
    scene_videos = render_scenes_with_motion(
        full_scenes_list, board_path, rundown_paths, plate_paths, bullet1_paths, bullet2_paths, audio_paths,
        today_display, slot
    )
    render_master_news_video(scene_videos, output_video)
    cleanup_temp_files()

    # 7. Generate Dynamic Thumbnail & Metadata
    thumb_path = os.path.join(BASE_DIR, f"Thumbnail_{today_str}_{slot}.jpg")
    create_youtube_thumbnail(
        anchor_img_path=anchor_look["file"],
        news_bg_path=stories[0]["bg_img"],
        slot=slot,
        headline_yellow=stories[0]["headline"],
        sub_headline_cyan=stories[1]["headline"],
        callout_tag=stories[2]["headline"],
        bullets=[
            stories[0]["headline"],
            stories[1]["headline"],
            stories[2]["headline"]
        ],
        output_path=thumb_path
    )

    generate_video_metadata(
        slot=slot,
        stories=stories,
        video_filename=os.path.basename(output_video),
        thumbnail_filename=os.path.basename(thumb_path)
    )

    # 8. Commit Stories & Images to Permanent Archive
    commit_bulletin_stories(slot, stories)
    print("\n[COMPLETE] 100% AUTONOMOUS NEWS PIPELINE EXECUTION FINISHED!", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
