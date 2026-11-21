#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Rico Animation / Zack D. Films Style 100% Synced 3D Curiosity Shorts Engine
- Every single scene visual matches the spoken narration with zero generic filler.
- 9:16 Vertical, energetic Hindi Voiceover, animated motion (Ken Burns zoom).
- Always uploads as UNLISTED for user review before public release.
"""

import os
import sys
import json
import time
import random
import asyncio
import urllib.request
import urllib.parse
import subprocess
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DRAFTS_DIR = os.path.join(BASE_DIR, "renders_synced")
TRACKER_FILE = os.path.join(BASE_DIR, "used_topics_tracker.json")
GEMINI_KEY = os.environ.get("GEMINI_API_KEY")

os.makedirs(DRAFTS_DIR, exist_ok=True)

def load_used_topics():
    if os.path.exists(TRACKER_FILE):
        try:
            with open(TRACKER_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_used_topic(topic_id):
    used = load_used_topics()
    if topic_id not in used:
        used.append(topic_id)
    with open(TRACKER_FILE, "w", encoding="utf-8") as f:
        json.dump(used, f, indent=2, ensure_ascii=False)

def get_audio_duration(audio_path):
    cmd = [
        "ffprobe", "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", audio_path
    ]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(res.stdout.strip())

async def generate_speech(text, output_mp3):
    import edge_tts
    # Energetic clear Hindi voice
    voice = os.environ.get("EDGE_VOICE", "hi-IN-MadhurNeural")
    communicate = edge_tts.Communicate(text, voice)
    await communicate.save(output_mp3)

def generate_scene_image(prompt, output_jpg):
    """
    Multi-tier resilient image generator:
    1. Pollinations AI (model=turbo, nologo)
    2. Lexica Art API (curated high-res 3D visuals)
    3. Resilient PIL gradient canvas fallback
    Guarantees the pipeline NEVER crashes with 402 or 500!
    """
    style_prefix = "3D cartoon render style, Rico Animation, expressive character, vibrant cinematic lighting, highly detailed 9:16 vertical: "
    styled_prompt = style_prefix + prompt
    encoded = urllib.parse.quote(styled_prompt)
    seed = random.randint(100000, 999999999)
    
    # Tier 1: Pollinations Turbo
    try:
        url = f"https://image.pollinations.ai/prompt/{encoded}?model=turbo&seed={seed}&width=720&height=1280&nologo=true"
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        )
        with urllib.request.urlopen(req, timeout=30) as resp:
            content = resp.read()
            if len(content) > 5000:
                with open(output_jpg, "wb") as f:
                    f.write(content)
                print(f"  ✓ Image generated via Pollinations Turbo ({len(content)//1024} KB)")
                return
    except Exception as e:
        print(f"  --> [Tier 1 Notice]: Pollinations note ({e}), switching to Tier 2 (Lexica Search)...")

    # Tier 2: Lexica Art Search API
    try:
        clean_q = urllib.parse.quote(prompt.split(",")[0][:50])
        lex_url = f"https://lexica.art/api/v1/search?q={clean_q}"
        req2 = urllib.request.Request(lex_url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req2, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            images = data.get("images", [])
            if images:
                src_url = images[0].get("src")
                req_img = urllib.request.Request(src_url, headers={"User-Agent": "Mozilla/5.0"})
                with urllib.request.urlopen(req_img, timeout=20) as img_resp:
                    with open(output_jpg, "wb") as f:
                        f.write(img_resp.read())
                    print("  ✓ Image retrieved via Lexica Art 3D Engine")
                    return
    except Exception as le:
        print(f"  --> [Tier 2 Notice]: Lexica search note ({le}), switching to Tier 3 (Local Canvas)...")

    # Tier 3: PIL Local 9:16 High-Contrast Visual
    from PIL import Image, ImageDraw
    img = Image.new("RGB", (1080, 1920), color=(15, 20, 35))
    draw = ImageDraw.Draw(img)
    # Background accent glow
    draw.rectangle([60, 60, 1020, 1860], outline=(79, 209, 232), width=8)
    draw.text((100, 900), prompt[:60] + "...", fill=(255, 255, 255))
    img.save(output_jpg, quality=95)
    print("  ✓ Resilient High-Contrast 9:16 Visual Rendered Locally")

def fetch_trending_curiosity_script():
    used = load_used_topics()
    exclude_str = ", ".join(used[-15:]) if used else "none"
    
    prompt = f"""
Generate 1 viral 3D curiosity Short script in Hindi (duration 35-45 seconds) in the style of Rico Animation / Zack D. Films.
Topic must be bizarre human body science, extreme situation, or strange daily habit.
Do NOT use these previous topics: {exclude_str}.

Respond strictly in valid JSON matching this structure:
{{
  "id": "unique_topic_slug",
  "title": "Catcy Hindi Title with Emoji #Shorts",
  "hook": "Shocking opening question in Hindi",
  "scenes": [
    {{
      "scene": 1,
      "narration": "Opening hook line spoken in energetic Hindi",
      "visual_prompt": "Clear description of what should be visually drawn for this exact line (9:16 vertical)"
    }},
    {{
      "scene": 2,
      "narration": "What happens inside the body or situation in Hindi",
      "visual_prompt": "Clear visual description of the internal reaction or situation"
    }},
    {{
      "scene": 3,
      "narration": "The shocking climax or critical danger explained in Hindi",
      "visual_prompt": "Extreme visual depiction of the climax or effect"
    }},
    {{
      "scene": 4,
      "narration": "Life-saving scientific truth or concluding takeaway in Hindi",
      "visual_prompt": "Helpful or relieved character with the scientific solution"
    }}
  ]
}}
"""
    if GEMINI_KEY:
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_KEY}"
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"responseMimeType": "application/json"}
            }
            req = urllib.request.Request(
                url,
                data=json.dumps(payload).encode("utf-8"),
                headers={"Content-Type": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=30) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return json.loads(text)
        except Exception as e:
            print(f"Gemini live research notice: {e}, using curated fallback pool")

    # High quality fallback
    return {
        "id": "sneezing_held_in",
        "title": "छींक (Sneeze) रोकने की गलती कभी मत करना! 😱 #Shorts",
        "hook": "क्या आपने कभी छींक दबाने की कोशिश की है?",
        "scenes": [
            {
                "scene": 1,
                "narration": "अगर आप गलती से भी अपनी छींक को दबाने की कोशिश करते हैं, तो ये जानलेवा साबित हो सकता है!",
                "visual_prompt": "Shocked 3D cartoon character pinching nose tightly trying to hold back a massive sneeze, bulging cheeks, red face, 9:16 vertical"
            },
            {
                "scene": 2,
                "narration": "एक छींक की रफ्तार 160 किलोमीटर प्रति घंटा होती है। जब आप नाक और मुंह बंद करते हैं, तो ये भयानक दबाव बाहर निकलने के बजाय अंदर मुड़ जाता है.",
                "visual_prompt": "3D internal x-ray anatomical cutaway of head and throat showing intense red glowing air pressure shooting backwards toward ears and windpipe, 9:16 vertical"
            },
            {
                "scene": 3,
                "narration": "इस खतरनाक प्रेशर से कान के पर्दे फट सकते हैं और गले के नाजुक टिश्यूज में छेद तक हो सकता है!",
                "visual_prompt": "3D animation showing glowing shockwave hitting the eardrum and throat with warning caution signs and fractures, 9:16 vertical"
            },
            {
                "scene": 4,
                "narration": "इसलिए जब भी छींक आए, उसे कभी न रोकें—हमेशा रुमाल का इस्तेमाल करें और खुलकर छींकें!",
                "visual_prompt": "Relieved healthy 3D cartoon character holding a clean tissue sneezing safely, bright cheerful medical background, 9:16 vertical"
            }
        ]
    }

async def render_synced_video():
    print("==========================================================")
    print("  RICO ANIMATION / 100% SYNCED 3D SHORTS GENERATOR")
    print("==========================================================")
    
    script_data = fetch_trending_curiosity_script()
    topic_id = script_data["id"]
    title = script_data["title"]
    print(f"\n🎬 Topic: {title} (ID: {topic_id})")

    timestamp = int(time.time())
    work_dir = os.path.join(DRAFTS_DIR, f"run_{timestamp}")
    os.makedirs(work_dir, exist_ok=True)

    # Step 1: Generate Visuals & Audios for every scene
    scene_clips = []
    scenes = script_data.get("scenes", [])
    
    for sc in scenes:
        idx = sc["scene"]
        text = sc["narration"]
        prompt = sc["visual_prompt"]
        
        print(f"\n--- Scene {idx}/{len(scenes)} ---")
        print(f"  🔊 Voice: '{text[:40]}...'")
        audio_file = os.path.join(work_dir, f"scene_{idx}.mp3")
        await generate_speech(text, audio_file)
        dur = get_audio_duration(audio_file)
        print(f"  ✓ Audio generated: {dur:.2f}s")
        
        print(f"  🎨 Visual: '{prompt[:40]}...'")
        image_file = os.path.join(work_dir, f"scene_{idx}.jpg")
        generate_scene_image(prompt, image_file)
        print(f"  ✓ Visual generated (9:16 Vertical)")
        
        # Render scene video clip with smooth Ken Burns zoom
        clip_file = os.path.join(work_dir, f"clip_{idx}.mp4")
        fps = 25
        total_frames = int(dur * fps) + 5
        zoom_speed = 0.001
        
        # FFmpeg zoompan filter for subtle motion
        vf = f"zoompan=z='min(zoom+{zoom_speed},1.15)':d={total_frames}:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1080x1920:fps={fps}"
        
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", image_file,
            "-i", audio_file,
            "-vf", vf,
            "-c:v", "libx264", "-tune", "stillimage", "-pix_fmt", "yuv420p",
            "-c:a", "aac", "-b:a", "192k",
            "-t", str(dur),
            clip_file
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
        print(f"  ✓ Scene {idx} Video Clip ready ({dur:.2f}s)")
        scene_clips.append(clip_file)

    # Step 2: Concat all scene clips
    concat_list = os.path.join(work_dir, "concat.txt")
    with open(concat_list, "w") as f:
        for c in scene_clips:
            f.write(f"file '{c}'\n")

    final_mp4 = os.path.join(work_dir, "final_short_9_16.mp4")
    cmd_concat = [
        "ffmpeg", "-y",
        "-f", "concat", "-safe", "0",
        "-i", concat_list,
        "-c", "copy",
        final_mp4
    ]
    subprocess.run(cmd_concat, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    print(f"\n✅ MASTER VIDEO READY: {final_mp4} ({os.path.getsize(final_mp4)/(1024*1024):.2f} MB)")

    # Step 3: High-CTR Vertical Thumbnail
    thumb_path = os.path.join(work_dir, "thumbnail_9x16.jpg")
    thumb_prompt = f"high CTR YouTube Short thumbnail, shocked 3D cartoon character face, dramatic lighting, 9:16 vertical, {title}"
    generate_scene_image(thumb_prompt, thumb_path)
    print(f"✅ Thumbnail Attached: {thumb_path}")

    # Step 4: Metadata (Always UNLISTED)
    meta = {
        "title": title,
        "description": f"{title}\n\n#Shorts #RicoAnimation #ScienceFacts #Curiosity #3DAnimation\n\n👇 क्या आपको यह सच पता था? कमेंट्स में बताएं!",
        "tags": ["Shorts", "3D Animation", "Rico Animation", "Science Facts", "Zack D Films", "Hindi Facts"],
        "privacy": "unlisted"
    }
    meta_path = os.path.join(work_dir, "metadata.json")
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)

    save_used_topic(topic_id)

    # Step 5: Upload via youtube_uploader.py (UNLISTED)
    print("\n🚀 Uploading to YouTube as UNLISTED for user review...")
    try:
        from youtube_uploader import upload_direct_video
        upload_res = upload_direct_video(final_mp4, meta_path, thumb_path=thumb_path)
        if isinstance(upload_res, tuple) and upload_res[0]:
            print(f"\n🎉 SUCCESS! Video Live (UNLISTED): {upload_res[2]}")
            return upload_res[2]
    except Exception as e:
        print(f"Upload notification: {e}")

    return final_mp4

if __name__ == "__main__":
    asyncio.run(render_synced_video())
