# -*- coding: utf-8 -*-
"""
ANCHOR AADHYA — CINEMATIC AI TECH FACT SHORT ENGINE
=====================================================
- 100% 9:16 Full HD Vertical (1080x1920) @ 30 FPS
- Star Presenter: Anchor Aadhya (Stunning photorealistic Indian female anchor in crimson studio)
- Real Visuals: 8K China Humanoid Robot in lab, Cyber Quantum Workplace, Robot Smirk Close-up
- Motion: Smooth Ken-Burns camera moves (pan & zoom) per shot
- Alex Hormozi / Vox style kinetic 2-tone glowing captions
- Top Cyber News HUD & Elevated Audio-Reactive Waveform
"""

import os
import sys
import json
import math
import subprocess
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = r"E:\Paresh\Anchor-Aadhya"
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
FONTS_DIR = os.path.join(BASE_DIR, "fonts")

FONT_IMPACT = os.path.join(FONTS_DIR, "impact.ttf")
FONT_ARIAL = os.path.join(FONTS_DIR, "arialbd.ttf")
FONT_DEVA = r"E:\Paresh\Auto Post\Auto-Insta-Krishna\NotoSansDevanagari-Bold.ttf"

AUDIO_PATH = os.path.join(BASE_DIR, "aadhya_tech_voice.aac")
OUTPUT_VIDEO = os.path.join(BASE_DIR, "Anchor_Aadhya_AI_Robot_Short.mp4")

# Load 5 cinematic scene images
IMG_ANCHOR = os.path.join(ASSETS_DIR, "anchor_aadhya_studio_916.jpg")
IMG_ROBOT_LAB = os.path.join(ASSETS_DIR, "scene_robot_lab.jpg")
IMG_ROBOT_WORK = os.path.join(ASSETS_DIR, "scene_ai_workplace.jpg")
IMG_ROBOT_SMILE = os.path.join(ASSETS_DIR, "scene_robot_smile.jpg")

# 5 Shots matching the speech timings
# Total duration ~36.5 seconds
SHOTS = [
    {
        "id": "S1",
        "image": IMG_ANCHOR,
        "start_t": 0.0,
        "end_t": 6.8,
        "zoom": (1.0, 1.08),
        "pan": ((0, 0), (0, -20)),
        "badge": "🔴 LIVE • ANCHOR AADHYA",
        "topic_tag": "⚡ BREAKING AI TECH NEWS",
        "caps": [
            (0.4, 3.5, "अरे सुनिए ना! 🤖 ख़तरनाक AI रोबोट!"),
            (3.5, 6.8, "चीन ने बनाया... सबसे ख़तरनाक AI!")
        ]
    },
    {
        "id": "S2",
        "image": IMG_ROBOT_LAB,
        "start_t": 6.8,
        "end_t": 14.8,
        "zoom": (1.05, 1.15),
        "pan": ((0, 40), (0, -30)),
        "badge": "⚡ SHENZHEN AI ROBOTICS LAB",
        "topic_tag": "🤖 100 ENGINEERS' WORK // 1 HOUR",
        "caps": [
            (6.8, 10.8, "100 लोगों का काम... सिर्फ अकेला रोबोट!"),
            (10.8, 14.8, "पलक झपकते ही... इंसानों की तरह सोचता है!")
        ]
    },
    {
        "id": "S3",
        "image": IMG_ROBOT_WORK,
        "start_t": 14.8,
        "end_t": 22.0,
        "zoom": (1.0, 1.10),
        "pan": ((-20, 0), (20, -10)),
        "badge": "⚡ QUANTUM AI WORKPLACE",
        "topic_tag": "⚠️ 100x CODING SPEED",
        "caps": [
            (14.8, 18.5, "और मज़े की बात तो यह है..."),
            (18.5, 22.0, "जब इंजीनियर ने इसे रोकने की कोशिश की!")
        ]
    },
    {
        "id": "S4",
        "image": IMG_ROBOT_SMILE,
        "start_t": 22.0,
        "end_t": 30.0,
        "zoom": (1.02, 1.16),
        "pan": ((0, 0), (0, -20)),
        "badge": "⚠️ SYSTEM OVERRIDE ALERT",
        "topic_tag": "💬 'RELAX SIR... WORLD IS OURS!'",
        "caps": [
            (22.0, 26.2, "तो मुस्कुरा कर बोला... 'आप आराम कीजिए!'"),
            (26.2, 30.0, "'अब दुनिया हमारी है!' सच में डर लग रहा है!")
        ]
    },
    {
        "id": "S5",
        "image": IMG_ANCHOR,
        "start_t": 30.0,
        "end_t": 36.52,
        "zoom": (1.04, 1.10),
        "pan": ((0, 0), (0, -10)),
        "badge": "💬 PUBLIC POLL // ANCHOR AADHYA",
        "topic_tag": "❓ WILL AI REPLACE OUR JOBS?",
        "caps": [
            (30.0, 33.5, "क्या AI सच में नौकरियां खा जाएगा?"),
            (33.5, 36.52, "नीचे कमेंट में बताइए ना! 💭👇")
        ]
    }
]

def load_and_prepare_image(path, target_w=1080, target_h=1920):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    target_ratio = target_w / float(target_h)
    im_ratio = w / float(h)
    if im_ratio > target_ratio:
        new_w = int(h * target_ratio)
        off_x = (w - new_w) // 2
        im = im.crop((off_x, 0, off_x + new_w, h))
    else:
        new_h = int(w / target_ratio)
        off_y = (h - new_h) // 2
        im = im.crop((0, off_y, w, off_y + new_h))
    im = im.resize((target_w, target_h), Image.Resampling.LANCZOS)
    return np.array(im)

def extract_real_waveform(audio_path, total_frames, fps=30):
    cmd = [
        "ffmpeg", "-v", "quiet",
        "-i", audio_path,
        "-ac", "1",
        "-ar", "1000",
        "-f", "f32le",
        "-"
    ]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    raw_data = proc.stdout.read()
    proc.wait()
    
    samples = np.frombuffer(raw_data, dtype=np.float32)
    chunk_size = int(1000 / fps)
    
    waveform = []
    for f in range(total_frames):
        st = f * chunk_size
        et = min(len(samples), st + chunk_size)
        if st < len(samples) and et > st:
            rms = np.sqrt(np.mean(samples[st:et]**2))
            val = min(4.5, rms * 15.0)
        else:
            val = 0.1
        waveform.append(val)
    return waveform

def render_cinematic_short():
    print("🎬 [1/3] Loading Cinematic Scene Visuals & Audio...")
    
    # Preload shot images
    loaded_images = {}
    for shot in SHOTS:
        if shot["image"] not in loaded_images:
            loaded_images[shot["image"]] = load_and_prepare_image(shot["image"], 1080, 1920)
            print(f"  -> Loaded Scene Visual: {os.path.basename(shot['image'])}")

    # Audio duration
    probe_cmd = ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", AUDIO_PATH]
    res = subprocess.run(probe_cmd, capture_output=True, text=True)
    total_audio_sec = float(res.stdout.strip() or 36.52)
    fps = 30
    total_frames = int(total_audio_sec * fps)
    print(f"  -> Total Video Duration: {total_audio_sec:.2f}s ({total_frames} frames @ 30 FPS)")

    waveform = extract_real_waveform(AUDIO_PATH, total_frames, fps=fps)

    # Fonts
    font_badge = ImageFont.truetype(FONT_IMPACT if os.path.exists(FONT_IMPACT) else FONT_ARIAL, 32)
    font_tag = ImageFont.truetype(FONT_IMPACT if os.path.exists(FONT_IMPACT) else FONT_ARIAL, 26)
    font_main_deva = ImageFont.truetype(FONT_DEVA, 54) if os.path.exists(FONT_DEVA) else ImageFont.load_default()

    # High-speed FFmpeg pipe writer
    cmd_ffmpeg = [
        "ffmpeg", "-y",
        "-f", "rawvideo", "-vcodec", "rawvideo",
        "-s", "1080x1920", "-pix_fmt", "bgr24", "-r", str(fps),
        "-i", "-",
        "-i", AUDIO_PATH,
        "-c:v", "libx264", "-preset", "fast", "-crf", "18",
        "-c:a", "copy",
        "-pix_fmt", "yuv420p",
        OUTPUT_VIDEO
    ]
    proc = subprocess.Popen(cmd_ffmpeg, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

    print("🎨 [2/3] Rendering 9:16 Video with Dynamic Ken-Burns Moves & Kinetic Captions...")
    w, h = 1080, 1920

    for f_idx in range(total_frames):
        t = f_idx / float(fps)
        intensity = float(waveform[f_idx]) if f_idx < len(waveform) else 1.0

        # Find current active shot
        curr_shot = SHOTS[0]
        for s in SHOTS:
            if s["start_t"] <= t <= s["end_t"]:
                curr_shot = s
                break

        base_img = loaded_images[curr_shot["image"]]
        shot_t = (t - curr_shot["start_t"]) / max(0.1, curr_shot["end_t"] - curr_shot["start_t"])
        shot_t = min(1.0, max(0.0, shot_t))

        # Ken-Burns Zoom & Pan
        z_start, z_end = curr_shot["zoom"]
        curr_z = z_start + (z_end - z_start) * shot_t
        p_start, p_end = curr_shot["pan"]
        curr_pan_x = p_start[0] + (p_end[0] - p_start[0]) * shot_t
        curr_pan_y = p_start[1] + (p_end[1] - p_start[1]) * shot_t

        # Apply transformation with OpenCV
        center_x = (w / 2.0) + curr_pan_x
        center_y = (h / 2.0) + curr_pan_y
        M = cv2.getRotationMatrix2D((center_x, center_y), 0, curr_z)
        transformed = cv2.warpAffine(base_img, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)

        # White flash on shot transition (first 3 frames of each shot)
        frames_into_shot = int((t - curr_shot["start_t"]) * fps)
        if frames_into_shot < 3 and curr_shot["id"] != "S1":
            alpha = (3 - frames_into_shot) * 0.25
            white = np.full((h, w, 3), 255, dtype=np.uint8)
            transformed = cv2.addWeighted(transformed, 1.0 - alpha, white, alpha, 0)

        # Subtle dark gradient at top and bottom for UI & captions
        # Top gradient (0 to 300px)
        for y_top in range(250):
            grad_a = (1.0 - (y_top / 250.0)) * 0.65
            transformed[y_top, :] = (transformed[y_top, :] * (1.0 - grad_a)).astype(np.uint8)

        # Bottom gradient (1200 to 1920px)
        for y_bot in range(1200, 1920):
            grad_b = ((y_bot - 1200) / 720.0) * 0.75
            transformed[y_bot, :] = (transformed[y_bot, :] * (1.0 - grad_b)).astype(np.uint8)

        # PIL Overlay for Sharp Typography
        pil_frame = Image.fromarray(transformed)
        draw = ImageDraw.Draw(pil_frame)

        # 1. Top HUD Header Pill: "🔴 LIVE • ANCHOR AADHYA"
        draw.rounded_rectangle([60, 60, 1020, 180], radius=20, fill=(8, 12, 24, 210), outline=(0, 229, 255, 255), width=2)
        # Pulsing Red Dot
        dot_rad = 10 if (int(t * 4) % 2 == 0) else 8
        draw.ellipse([95 - dot_rad, 120 - dot_rad, 95 + dot_rad, 120 + dot_rad], fill=(255, 40, 40))
        draw.text((125, 100), curr_shot["badge"], font=font_badge, fill=(255, 255, 255))
        draw.text((620, 105), curr_shot["topic_tag"], font=font_tag, fill=(0, 229, 255))

        # 2. Active Caption Card (Alex Hormozi / Vox kinetic 2-tone)
        active_cap = None
        for (st, et, ctext) in curr_shot["caps"]:
            if st <= t <= et:
                active_cap = ctext
                break

        if active_cap:
            sub_y = 1340
            # Glowing Banner Box
            draw.rounded_rectangle([50, sub_y, 1030, sub_y + 190], radius=24, fill=(5, 8, 20, 230), outline=(255, 215, 0, 255), width=3)
            # Drop shadow
            draw.text((82, sub_y + 37), active_cap, font=font_main_deva, fill=(0, 0, 0))
            draw.text((80, sub_y + 35), active_cap, font=font_main_deva, fill=(255, 235, 0))
            # Sub-tag
            draw.text((85, sub_y + 125), "⚡ AI REVOLUTION • EXCLUSIVE FACT", font=font_tag, fill=(0, 229, 255))

        # Back to OpenCV for Real Audio Soundwave
        cv_out = cv2.cvtColor(np.array(pil_frame), cv2.COLOR_RGB2BGR)

        # 3. Elevated Audio Soundwave (base_y = 1680)
        wave_base_y = 1680
        wave_bars = 56
        start_wx = 120
        bar_spacing = 15
        for b in range(wave_bars):
            norm_b = b / float(wave_bars - 1)
            b_env = math.sin(norm_b * math.pi) * 0.9 + 0.1
            b_h = max(5, int(intensity * 40.0 * b_env * (1.0 + 0.25 * math.sin(t * 7.0 + b * 0.5))))
            bx = start_wx + b * bar_spacing
            col = (0, 235, 255) if intensity > 2.0 else (255, 200, 0)
            cv2.rectangle(cv_out, (bx, wave_base_y - b_h), (bx + 8, wave_base_y + int(b_h * 0.2)), col, -1, lineType=cv2.LINE_AA)
            cv2.circle(cv_out, (bx + 4, wave_base_y - b_h - 3), 2, (255, 255, 255), -1, lineType=cv2.LINE_AA)

        # Write frame to FFmpeg pipe
        try:
            proc.stdin.write(cv_out.tobytes())
        except (BrokenPipeError, OSError):
            break

    try:
        proc.stdin.close()
    except Exception:
        pass
    proc.wait()

    print(f"🎉 [3/3] Master Cinematic AI Tech Short Generated: {OUTPUT_VIDEO}")
    print(f"  -> File Size: {os.path.getsize(OUTPUT_VIDEO) / (1024*1024):.2f} MB")
    return OUTPUT_VIDEO

if __name__ == "__main__":
    render_cinematic_short()
