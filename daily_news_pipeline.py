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
    get_emergency_bulletin_stories,
    select_anchor_look,
    commit_bulletin_stories,
    generate_ai_news_image,
    VOICE_PROFILES,
    append_image_archive,
    load_images_archive,
    sanitize_story_speech
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


def create_ai_news_images(slot, stories):
    """
    Downloads/Generates authentic, high-resolution 16:9 images for each story.
    STRICT USER RULE: Only images directly relevant to the news are used.
    """
    print("\n--- 1. Generating & Preparing Topic-Relevant 16:9 News Images ---", flush=True)
    today_slug = datetime.now().strftime("%Y-%m-%d")

    for idx, item in enumerate(stories):
        dest1 = os.path.join(BASE_DIR, f"news_{today_slug}_{slot}_ai_story_{idx+1}_shot1.jpg")
        dest2 = os.path.join(BASE_DIR, f"news_{today_slug}_{slot}_ai_story_{idx+1}_shot2.jpg")

        # 1. Direct Journalist Image from Article
        direct_url = item.get("direct_image_url")
        saved_direct = False
        if direct_url:
            try:
                req = urllib.request.Request(direct_url, headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
                with urllib.request.urlopen(req, timeout=12) as resp:
                    data = resp.read()
                if len(data) > 15000:
                    im = Image.open(BytesIO(data)).convert("RGB")
                    im1 = fit_to_16_9(im)
                    im1.save(dest1, "JPEG", quality=95)
                    # Shot 2: Dramatic Macro / Hardware Close-up Crop of the SAME photo
                    w_im, h_im = im.size
                    cx, cy = w_im // 2, h_im // 2
                    cw, ch = int(w_im * 0.65), int(h_im * 0.65)
                    im2 = im.crop((cx - cw//2, cy - ch//2, cx + cw//2, cy + ch//2))
                    im2 = fit_to_16_9(im2)
                    im2.save(dest2, "JPEG", quality=95)
                    saved_direct = True
                    print(f"  [SUCCESS] Story {idx+1}: Saved authentic article photo: {os.path.basename(dest1)}", flush=True)
            except Exception as e:
                print(f"  [WARN] Direct photo download failed ({direct_url[:50]}): {e}", flush=True)

        if not saved_direct:
            prompt1 = item.get("ai_image_prompt") or f"Commercial broadcast news photography of {item.get('headline','tech news')}"
            generate_ai_news_image(prompt1, dest1, story_id=item.get("id"), shot_idx=1, headline_text=item.get("headline", ""))
            prompt2 = item.get("ai_image_prompt_2") or f"Close up technical detail of {item.get('headline','tech news')}"
            generate_ai_news_image(prompt2, dest2, story_id=item.get("id"), shot_idx=2, headline_text=item.get("headline", ""))

        item["bg_img_1"] = dest1
        item["bg_img_2"] = dest2
        item["bg_img"] = dest1

        # Sanity Guard: Verify both files exist and are valid (>15KB)
        for d_check in [dest1, dest2]:
            if not os.path.exists(d_check) or os.path.getsize(d_check) < 15000:
                master_ref = os.path.join(BASE_DIR, "anchor_aadhya_master.jpg")
                if os.path.exists(master_ref):
                    import shutil
                    shutil.copyfile(master_ref, d_check)

        print(f"  --> [DUAL SHOTS READY] Story {idx+1}:", flush=True)
        print(f"       Shot 1 (Wide):  {dest1} ({os.path.getsize(dest1)} bytes)", flush=True)
        print(f"       Shot 2 (Macro): {dest2} ({os.path.getsize(dest2)} bytes)", flush=True)


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
    hd.text((180, 18), f"ANCHOR AADHYA  |  AAJ KA TAZA TECH BULLETIN • {today_display.upper()}", font=font_header, fill=(255, 255, 255))
    hd.text((1480, 18), "TAZA BREAKING TECH", font=font_header, fill=(0, 220, 255))
    header.save(HEADER_BAR_PATH, "PNG")

    # Scene 1 Rundown Board
    num_items = len(rundown_items)
    board_h = min(560, 100 + num_items * 82)
    board = Image.new("RGBA", (840, board_h), (0, 0, 0, 0))
    bd = ImageDraw.Draw(board)
    bd.rectangle([(0, 0), (840, board_h)], fill=(10, 15, 28, 230))
    bd.rectangle([(0, 0), (840, 65)], fill=(220, 20, 60, 255))
    font_board_title = get_font(30, bold=True)
    bd.text((25, 16), f"AAJ KI TOP {num_items} BADI KHABREIN", font=font_board_title, fill=(255, 255, 255))
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

    # Lower-third plates and bullets (ORIGINAL)
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

    # Left-side TV Story Graphics Cards & Pure Factual Points (NO masti-majak)
    card_paths = []
    facts_paths_list = []
    font_card_badge = get_font(20, bold=True)
    font_card_title = get_font(26, bold=True)
    font_fact_text = get_font(21, bold=True)

    for idx, item in enumerate(stories):
        # Card Background (x=60..680, y=130..740)
        card_w, card_h = 620, 600
        card = Image.new("RGBA", (card_w, card_h), (0, 0, 0, 0))
        cd = ImageDraw.Draw(card)
        cd.rounded_rectangle([(0, 0), (card_w, card_h)], radius=14, fill=(10, 16, 30, 225))
        cd.rounded_rectangle([(0, 0), (card_w, 6)], radius=3, fill=(0, 220, 255, 255))
        # Category Badge inside card
        cd.rounded_rectangle([(25, 20), (300, 56)], radius=6, fill=item["badge_color"])
        cd.text((38, 26), f"🔴 {item['category'][:18]}", font=font_card_badge, fill=(255, 255, 255))
        # Headline inside card
        cd.text((25, 75), item["headline"][:32], font=font_card_title, fill=(255, 220, 50))
        cd.line([(25, 115), (card_w - 25, 115)], fill=(0, 200, 255, 150), width=2)
        c_file = os.path.join(BASE_DIR, f"card_{idx+1}.png")
        card.save(c_file, "PNG")
        card_paths.append(c_file)

        # 4 Pure Factual News Points for this story (NO conversational fluff)
        story_facts = item.get("facts", [])
        if not story_facts or len(story_facts) < 3:
            story_facts = [
                item.get("headline", "")[:60],
                item.get("bullet1", "")[:60],
                item.get("bullet2", "")[:60],
                f"Official development reported via {item.get('source','Tech News')}."
            ]

        f_files = []
        for f_idx, fact_text in enumerate(story_facts[:4]):
            f_img = Image.new("RGBA", (card_w - 50, 95), (0, 0, 0, 0))
            fd = ImageDraw.Draw(f_img)
            fd.rounded_rectangle([(0, 0), (card_w - 50, 95)], radius=8, fill=(16, 24, 46, 240))
            fd.line([(0, 0), (card_w - 50, 0)], fill=(0, 220, 255, 160), width=2)
            fd.ellipse([(14, 18), (28, 32)], fill=(0, 220, 255, 255))
            words = fact_text.strip().split()
            l1 = " ".join(words[:6])
            l2 = " ".join(words[6:13])
            fd.text((40, 14), l1, font=font_fact_text, fill=(255, 255, 255))
            fd.text((40, 48), l2, font=font_fact_text, fill=(200, 225, 255))
            f_path = os.path.join(BASE_DIR, f"fact_{idx+1}_{f_idx+1}.png")
            f_img.save(f_path, "PNG")
            f_files.append(f_path)
        facts_paths_list.append(f_files)

    return board_path, rundown_paths, plate_paths, bullet1_paths, bullet2_paths, card_paths, facts_paths_list

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

        # Ensure only Scene 1 (index 0) has the channel intro, while all story segments are sanitized
        speech_text = item.get("speech", "")
        if idx > 0 and idx < len(scenes_list) - 1:
            speech_text = sanitize_story_speech(speech_text)
            item["speech"] = speech_text

        print(f"  --> Voice {idx+1} Emotion [{emotion.upper()}]: Rate={rate_val}, Pitch={pitch_val}", flush=True)
        communicate = edge_tts.Communicate(
            speech_text,
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

def render_scenes_with_motion(scenes_list, board_path, rundown_paths, plate_paths, bullet1_paths, bullet2_paths, card_paths, facts_paths_list, audio_paths, today_display, slot):
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

    num_stories = len(plate_paths) - 2 if len(plate_paths) > 2 else len(plate_paths)
    ticker_text = (
        f"ANCHOR AADHYA • AAJ KA TAZA TECH BULLETIN • {today_display.upper()} • "
        f"TOP {num_stories} BADI TECH KHABREIN • AI AUR FUTURE TECH UPDATES • "
    )
    scene_videos = []
    scene_durations = []

    for idx, (item, plate, b1_path, b2_path, card_file, story_facts, audio) in enumerate(
        zip(scenes_list, plate_paths, bullet1_paths, bullet2_paths, card_paths, facts_paths_list, audio_paths)
    ):
        dur = get_audio_duration(audio) + 0.6
        scene_durations.append(dur)
        scene_mp4 = os.path.join(BASE_DIR, f"tv_scene_{idx+1}.mp4")
        frames = int(dur * 25)

        if idx == 0:
            # Scene 1: Rundown Board + Anchor Aadhya (Dynamic for any number of stories)
            num_rundown = len(rundown_paths)
            step_y = int(320 / max(1, num_rundown - 1)) if num_rundown > 1 else 90
            step_y = min(step_y, 85)

            fc_parts = [
                f"[0:v]scale=1920:1080,zoompan=z='min(zoom+0.0003,1.03)':d={frames}:s=1920x1080:fps=25[bg]",
                f"[bg][1:v]overlay=0:0[w_hdr]",
                f"[w_hdr][2:v]overlay=x=25:y='10 + 4*sin(2*PI*t/3)'[w_logo]",
                f"[w_logo][3:v]overlay=x='if(lte(t,0.8), -850 + 910*sin((t-0.4)/0.4*1.5708), 60)':y=140:enable='between(t,0.4,999)'[w_bd]"
            ]
            cur_s = "[w_bd]"
            cmd_inputs = [
                FFMPEG_BIN, "-y",
                "-loop", "1", "-i", item["bg_img"],
                "-loop", "1", "-i", HEADER_BAR_PATH,
                "-loop", "1", "-i", LOGO_BUG_PATH,
                "-loop", "1", "-i", board_path
            ]
            input_idx = 4
            for r_i, r_p in enumerate(rundown_paths):
                cmd_inputs.extend(["-loop", "1", "-i", r_p])
                st_t = round(1.0 + r_i * 1.0, 1)
                en_t = round(st_t + 0.4, 1)
                y_p = 215 + r_i * step_y
                next_s = f"[w_r{r_i+1}]"
                fc_parts.append(f"{cur_s}[{input_idx}:v]overlay=x='if(lte(t,{en_t}), -850 + 930*sin((t-{st_t})/0.4*1.5708), 80)':y={y_p}:enable='between(t,{st_t},999)'{next_s}")
                cur_s = next_s
                input_idx += 1

            # Plate at y=770
            cmd_inputs.extend(["-loop", "1", "-i", plate])
            plate_inp = input_idx; input_idx += 1
            fc_parts.append(f"{cur_s}[{plate_inp}:v]overlay=x='if(lte(t,7.2), -1920 + 1920*sin((t-6.5)/0.7*1.5708), 0)':y=770:enable='between(t,6.5,999)'[w_plt]")

            cmd_inputs.extend(["-loop", "1", "-i", b1_path])
            b1_inp = input_idx; input_idx += 1
            fc_parts.append(f"[w_plt][{b1_inp}:v]overlay=x='if(lte(t,8.1), -1800 + 1870*sin((t-7.5)/0.6*1.5708), 70)':y=915:enable='between(t,7.5,999)'[w_b1]")

            cmd_inputs.extend(["-loop", "1", "-i", b2_path])
            b2_inp = input_idx; input_idx += 1
            fc_parts.append(f"[w_b1][{b2_inp}:v]overlay=x='if(lte(t,10.1), -1800 + 1870*sin((t-9.5)/0.6*1.5708), 70)':y=965:enable='between(t,9.5,999)'[w_b2]")

            fc_parts.append(
                f"[w_b2]drawbox=y=1035:color=black@0.95:width=1920:height=45:t=fill,"
                f"drawbox=y=1033:color=0x00dcff@1:width=1920:height=2:t=fill,"
                f"drawtext=fontfile='{ticker_font}':text='{ticker_text}':fontsize=25:fontcolor=white:x='w-mod(t*140,w+text_w)':y=1045[v]"
            )
            cmd_inputs.extend([
                "-i", audio,
                "-filter_complex", ";".join(fc_parts),
                "-map", "[v]", "-map", f"{input_idx}:a",
                "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "19", "-preset", "veryfast", "-threads", "2",
                "-c:a", "aac", "-b:a", "192k",
                "-t", str(dur),
                scene_mp4
            ])
            cmd = cmd_inputs

        elif idx < len(scenes_list) - 1:
            # Story Scenes: B-Roll Shots + Left-Side Factual News Card + Original Bottom Plate & Bullets
            img1 = item.get("bg_img_1", item.get("bg_img"))
            img2 = item.get("bg_img_2", img1)
            dur1 = round(dur / 2.0, 2)
            dur2 = round(dur - dur1, 2)
            f1 = int(dur1 * 25)
            f2 = int(dur2 * 25)

            cmd = [
                FFMPEG_BIN, "-y",
                "-loop", "1", "-t", str(dur1), "-i", img1,
                "-loop", "1", "-t", str(dur2), "-i", img2,
                "-loop", "1", "-i", HEADER_BAR_PATH,
                "-loop", "1", "-i", LOGO_BUG_PATH,
                "-loop", "1", "-i", card_file
            ]
            in_idx = 5
            fc_layers = [
                f"[0:v]scale=1920:1080,setsar=1,zoompan=z='min(zoom+0.0004,1.06)':d={f1}:s=1920x1080:fps=25,setsar=1[shot1]",
                f"[1:v]scale=1920:1080,setsar=1,zoompan=z='max(1.06-0.0004*on,1.0)':d={f2}:s=1920x1080:fps=25,setsar=1[shot2]",
                f"[shot1][shot2]concat=n=2:v=1:a=0[bg]",
                f"[bg][2:v]overlay=0:0[with_hdr]",
                f"[with_hdr][3:v]overlay=x=25:y='10 + 4*sin(2*PI*t/3)'[with_logo]",
                f"[with_logo][4:v]overlay=x='if(lte(t,0.8), -640 + 700*sin((t-0.2)/0.6*1.5708), 60)':y=130:enable='between(t,0.2,999)'[with_card]"
            ]
            last_s = "[with_card]"
            # Add up to 4 pure factual news points
            fact_timings = [(1.2, 260), (6.0, 375), (12.0, 490), (18.0, 605)]
            for f_i, f_p in enumerate(story_facts[:4]):
                cmd.extend(["-loop", "1", "-i", f_p])
                t_st, y_p = fact_timings[f_i]
                t_en = round(t_st + 0.6, 1)
                nxt_s = f"[with_f{f_i+1}]"
                fc_layers.append(f"{last_s}[{in_idx}:v]overlay=x='if(lte(t,{t_en}), -640 + 725*sin((t-{t_st})/0.6*1.5708), 85)':y={y_p}:enable='between(t,{t_st},999)'{nxt_s}")
                last_s = nxt_s
                in_idx += 1

            # Bottom plate, b1, b2 (ORIGINAL)
            cmd.extend(["-loop", "1", "-i", plate])
            plate_inp = in_idx; in_idx += 1
            fc_layers.append(f"{last_s}[{plate_inp}:v]overlay=x='if(lte(t,0.7), -1920 + 1920*sin(t/0.7*1.5708), 0)':y=770[with_plate]")

            cmd.extend(["-loop", "1", "-i", b1_path])
            b1_inp = in_idx; in_idx += 1
            fc_layers.append(f"[with_plate][{b1_inp}:v]overlay=x='if(lte(t,1.8), -1800 + 1870*sin((t-1.2)/0.6*1.5708), 70)':y=915:enable='between(t,1.2,999)'[with_b1]")

            cmd.extend(["-loop", "1", "-i", b2_path])
            b2_inp = in_idx; in_idx += 1
            fc_layers.append(f"[with_b1][{b2_inp}:v]overlay=x='if(lte(t,4.1), -1800 + 1870*sin((t-3.5)/0.6*1.5708), 70)':y=965:enable='between(t,3.5,999)'[with_b2]")

            fc_layers.append(
                f"[with_b2]drawbox=y=1035:color=black@0.95:width=1920:height=45:t=fill,"
                f"drawbox=y=1033:color=0x00dcff@1:width=1920:height=2:t=fill,"
                f"drawtext=fontfile='{ticker_font}':text='{ticker_text}':fontsize=25:fontcolor=white:x='w-mod(t*140,w+text_w)':y=1045[v]"
            )
            cmd.extend([
                "-i", audio,
                "-filter_complex", ";".join(fc_layers),
                "-map", "[v]", "-map", f"{in_idx}:a",
                "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "19", "-preset", "veryfast", "-threads", "2",
                "-c:a", "aac", "-b:a", "192k",
                "-t", str(dur),
                scene_mp4
            ])

        else:
            # Outro Scene: Anchor Aadhya Goodbye & Call-to-Action
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
                "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "19", "-preset", "veryfast", "-threads", "2",
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

    return scene_videos, scene_durations

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
    patterns = ["tv_scene_*", "plate_*", "bullet*", "scene1_*", "tv_voice_*", "temp_concat*", "card_*", "fact_*"]
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

    # 1. Fetch dynamic stories (3 to 6 verified stories with direct photos)
    stories = get_fresh_bulletin_stories(slot)
    if not stories:
        print("[CRITICAL] get_fresh_bulletin_stories returned empty — using emergency bulletin stories", flush=True)
        stories = get_emergency_bulletin_stories(slot)
    dominant_emotion = stories[0].get("emotion", "dramatic")
    anchor_look = select_anchor_look(slot, dominant_emotion)
    print(f"  --> Active Anchor Look: {anchor_look['name']} ({anchor_look['style_desc']})")

    # 2. Prepare Topic-Relevant News Images
    create_ai_news_images(slot, stories)

    # 3. Create Scene 1 (Hook / Rundown) & Scene Outro
    rundown_items = []
    for idx, s in enumerate(stories):
        rundown_items.append({"num": f"0{idx+1}", "title": s["headline"]})

    num_s = len(stories)
    hook_scene = {
        "id": "scene_1_hook",
        "bg_img": anchor_look["file"],
        "category": f"TOP {num_s} BREAKING NEWS",
        "badge_color": anchor_look["theme_color"],
        "headline": f"CRAZY TECH BULLETINS: TOP {num_s} BREAKING!",
        "bullet1": f"• 1. {stories[0]['headline'][:45]}",
        "bullet2": f"• 2. {stories[1]['headline'][:45]}" if len(stories) > 1 else "• Fresh AI Updates",
        "emotion": "dramatic",
        "speech": f"अरे रुकिए रुकिए! अगर आप आज की सबसे बड़ी फ्यूचर टेक खबरें मिस नहीं करना चाहते, तो स्क्रीन स्क्रॉल करना तुरंत बंद कीजिए! नमस्कार, आज {today_display} है, मैं हूँ आपकी अपनी होस्ट आध्या... और स्वागत है Anchor Aadhya के आज के ताज़ा टेक बुलेटिन में! आज दुनिया भर की रिसर्च लैब्स से ऐसी {num_s} क्रांतिकारी खबरें सामने आई हैं जो होश उड़ा देंगी! चलिए शुरू करते हैं!"
    }

    outro_scene = {
        "id": "scene_outro",
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

    # 4. Generate Graphics Layers (Including Left-side TV cards & facts)
    board_path, rundown_paths, plate_paths, bullet1_paths, bullet2_paths, card_paths, facts_paths_list = create_graphics_layers(
        today_display, slot, full_scenes_list, rundown_items
    )

    # 5. Generate Voice Audio
    audio_paths = await generate_speech_audio(full_scenes_list)

    # 6. Render Scenes and Master Video
    scene_videos, scene_durations = render_scenes_with_motion(
        full_scenes_list, board_path, rundown_paths, plate_paths, bullet1_paths, bullet2_paths, card_paths, facts_paths_list, audio_paths,
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
        sub_headline_cyan=stories[1]["headline"] if len(stories) > 1 else stories[0]["headline"],
        callout_tag=stories[2]["headline"] if len(stories) > 2 else "EXCLUSIVE",
        bullets=[s["headline"] for s in stories[:3]],
        output_path=thumb_path
    )

    generate_video_metadata(
        slot=slot,
        stories=stories,
        video_filename=os.path.basename(output_video),
        thumbnail_filename=os.path.basename(thumb_path),
        scene_durations=scene_durations
    )

    # 8. Save pending stories (will be permanently committed upon confirmed YouTube upload)
    import json
    pending_stories_file = os.path.join(BASE_DIR, "pending_bulletin_stories.json")
    with open(pending_stories_file, "w", encoding="utf-8") as pf:
        json.dump({"slot": slot, "stories": stories}, pf, ensure_ascii=False, indent=2)
    print(f"  [PENDING] Saved {len(stories)} stories to {pending_stories_file} (awaiting confirmed upload)", flush=True)
    print("\n[COMPLETE] 100% AUTONOMOUS NEWS PIPELINE EXECUTION FINISHED!", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
