# -*- coding: utf-8 -*-
"""
ANCHOR AADHYA — 100% PERFECT HINDI KINETIC CINEMATIC SHORT ENGINE
===================================================================
- Star Presenter: Anchor Aadhya (Stunning Indian Female News Presenter in studio)
- Real Visuals: 8K China Humanoid Robot, Cyber AI Workplace, Robot Smirk
- Typography: 100% Pixel-Perfect Devanagari Ligatures + Color Emojis via Chrome Rendering
- Dynamic Motion: Noticeable Ken-Burns Zoom (1.0 -> 1.25) & Vertical Camera Pan
- Sound: Aadhya Playful/Masti Hindi Voiceover + Elevated Real Audio Reactive Soundwave
"""

import os
import sys
import json
import math
import subprocess
import numpy as np
import cv2
from PIL import Image

BASE_DIR = r"E:\Paresh\Anchor-Aadhya"
ASSETS_DIR = os.path.join(BASE_DIR, "assets")

AUDIO_PATH = os.path.join(BASE_DIR, "aadhya_tech_voice.aac")
OUTPUT_VIDEO = os.path.join(BASE_DIR, "Anchor_Aadhya_AI_Robot_Short.mp4")

# Load 5 cinematic scene images
IMG_ANCHOR = os.path.join(ASSETS_DIR, "anchor_aadhya_studio_916.jpg")
IMG_ROBOT_LAB = os.path.join(ASSETS_DIR, "scene_robot_lab.jpg")
IMG_ROBOT_WORK = os.path.join(ASSETS_DIR, "scene_ai_workplace.jpg")
IMG_ROBOT_SMILE = os.path.join(ASSETS_DIR, "scene_robot_smile.jpg")

SHOTS = [
    {
        "id": "S1",
        "image": IMG_ANCHOR,
        "overlay": os.path.join(ASSETS_DIR, "overlay_S1.png"),
        "start_t": 0.0,
        "end_t": 6.8,
        # Strong dynamic push-in zoom on Anchor Aadhya's speaking face
        "zoom": (1.00, 1.16),
        "pan": ((0, 10), (0, -35))
    },
    {
        "id": "S2",
        "image": IMG_ROBOT_LAB,
        "overlay": os.path.join(ASSETS_DIR, "overlay_S2.png"),
        "start_t": 6.8,
        "end_t": 14.8,
        # Dramatic vertical pan scanning up the robot from mechanical legs to glowing blue eyes
        "zoom": (1.06, 1.22),
        "pan": ((0, 90), (0, -60))
    },
    {
        "id": "S3",
        "image": IMG_ROBOT_WORK,
        "overlay": os.path.join(ASSETS_DIR, "overlay_S3.png"),
        "start_t": 14.8,
        "end_t": 22.0,
        # Dynamic diagonal camera drift across robotic coding terminals
        "zoom": (1.00, 1.18),
        "pan": ((-40, 20), (35, -20))
    },
    {
        "id": "S4",
        "image": IMG_ROBOT_SMILE,
        "overlay": os.path.join(ASSETS_DIR, "overlay_S4.png"),
        "start_t": 22.0,
        "end_t": 30.0,
        # Intense punch-in zoom onto the robot's eerie subtle smile
        "zoom": (1.02, 1.26),
        "pan": ((0, 20), (0, -40))
    },
    {
        "id": "S5",
        "image": IMG_ANCHOR,
        "overlay": os.path.join(ASSETS_DIR, "overlay_S5.png"),
        "start_t": 30.0,
        "end_t": 36.90,
        # Confident push-in on Anchor Aadhya as she invites comments
        "zoom": (1.02, 1.15),
        "pan": ((0, 0), (0, -25))
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

def load_overlay(path):
    im = Image.open(path).convert("RGBA")
    arr = np.array(im)
    bgr = cv2.cvtColor(arr[:, :, :3], cv2.COLOR_RGB2BGR)
    alpha = (arr[:, :, 3] / 255.0)[:, :, np.newaxis]
    return bgr, alpha

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
    print("🎬 [1/3] Loading Scene Visuals & Chrome-Rendered Flawless Hindi Overlays...")
    
    loaded_images = {}
    loaded_overlays = {}
    for shot in SHOTS:
        if shot["image"] not in loaded_images:
            loaded_images[shot["image"]] = load_and_prepare_image(shot["image"], 1080, 1920)
        if shot["overlay"] not in loaded_overlays:
            loaded_overlays[shot["overlay"]] = load_overlay(shot["overlay"])
            print(f"  -> Loaded Perfect Overlay: {os.path.basename(shot['overlay'])}")

    probe_cmd = ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", AUDIO_PATH]
    res = subprocess.run(probe_cmd, capture_output=True, text=True)
    total_audio_sec = float(res.stdout.strip() or 36.90)
    fps = 30
    total_frames = int(total_audio_sec * fps)
    print(f"  -> Total Video Duration: {total_audio_sec:.2f}s ({total_frames} frames @ 30 FPS)")

    waveform = extract_real_waveform(AUDIO_PATH, total_frames, fps=fps)

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

    print("🎨 [2/3] Rendering 9:16 Kinetic Video with High-Energy Ken-Burns & Perfect Hindi...")
    w, h = 1080, 1920

    for f_idx in range(total_frames):
        t = f_idx / float(fps)
        intensity = float(waveform[f_idx]) if f_idx < len(waveform) else 1.0

        curr_shot = SHOTS[0]
        for s in SHOTS:
            if s["start_t"] <= t <= s["end_t"]:
                curr_shot = s
                break

        base_img = loaded_images[curr_shot["image"]]
        shot_duration = max(0.1, curr_shot["end_t"] - curr_shot["start_t"])
        shot_t = min(1.0, max(0.0, (t - curr_shot["start_t"]) / shot_duration))

        # Smooth cubic ease-in-out for cinematic camera feeling
        smooth_t = shot_t * shot_t * (3.0 - 2.0 * shot_t)

        # Dynamic Ken-Burns Zoom & Pan
        z_start, z_end = curr_shot["zoom"]
        curr_z = z_start + (z_end - z_start) * smooth_t
        p_start, p_end = curr_shot["pan"]
        curr_pan_x = p_start[0] + (p_end[0] - p_start[0]) * smooth_t
        curr_pan_y = p_start[1] + (p_end[1] - p_start[1]) * smooth_t

        center_x = (w / 2.0) + curr_pan_x
        center_y = (h / 2.0) + curr_pan_y
        M = cv2.getRotationMatrix2D((center_x, center_y), 0, curr_z)
        transformed = cv2.warpAffine(base_img, M, (w, h), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
        transformed_bgr = cv2.cvtColor(transformed, cv2.COLOR_RGB2BGR)

        # Subtle top & bottom dark vignettes for contrast
        for y_top in range(250):
            grad_a = (1.0 - (y_top / 250.0)) * 0.70
            transformed_bgr[y_top, :] = (transformed_bgr[y_top, :] * (1.0 - grad_a)).astype(np.uint8)

        for y_bot in range(1200, 1920):
            grad_b = ((y_bot - 1200) / 720.0) * 0.80
            transformed_bgr[y_bot, :] = (transformed_bgr[y_bot, :] * (1.0 - grad_b)).astype(np.uint8)

        # Fast transition white flash (first 3 frames of each new shot)
        frames_into_shot = int((t - curr_shot["start_t"]) * fps)
        if frames_into_shot < 3 and curr_shot["id"] != "S1":
            alpha_flash = (3 - frames_into_shot) * 0.28
            white = np.full((h, w, 3), 255, dtype=np.uint8)
            transformed_bgr = cv2.addWeighted(transformed_bgr, 1.0 - alpha_flash, white, alpha_flash, 0)

        # Composite Chrome-Rendered Perfect Overlay (100% ligatures & emojis)
        overlay_bgr, overlay_alpha = loaded_overlays[curr_shot["overlay"]]
        composite = (transformed_bgr * (1.0 - overlay_alpha) + overlay_bgr * overlay_alpha).astype(np.uint8)

        # Elevated Real Audio Soundwave (base_y = 1680)
        wave_base_y = 1680
        wave_bars = 58
        start_wx = 105
        bar_spacing = 15
        for b in range(wave_bars):
            norm_b = b / float(wave_bars - 1)
            b_env = math.sin(norm_b * math.pi) * 0.9 + 0.1
            b_h = max(5, int(intensity * 45.0 * b_env * (1.0 + 0.3 * math.sin(t * 8.0 + b * 0.5))))
            bx = start_wx + b * bar_spacing
            col = (0, 235, 255) if intensity > 2.0 else (255, 205, 0)
            cv2.rectangle(composite, (bx, wave_base_y - b_h), (bx + 8, wave_base_y + int(b_h * 0.2)), col, -1, lineType=cv2.LINE_AA)
            cv2.circle(composite, (bx + 4, wave_base_y - b_h - 3), 2, (255, 255, 255), -1, lineType=cv2.LINE_AA)

        try:
            proc.stdin.write(composite.tobytes())
        except (BrokenPipeError, OSError):
            break

    try:
        proc.stdin.close()
    except Exception:
        pass
    proc.wait()

    print(f"🎉 [3/3] Master Cinematic Video Rendered: {OUTPUT_VIDEO}")
    print(f"  -> File Size: {os.path.getsize(OUTPUT_VIDEO) / (1024*1024):.2f} MB")
    return OUTPUT_VIDEO

if __name__ == "__main__":
    render_cinematic_short()
