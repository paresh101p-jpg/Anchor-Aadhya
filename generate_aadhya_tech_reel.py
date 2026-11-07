# -*- coding: utf-8 -*-
"""
ANCHOR AADHYA — VIRAL AI TECH REEL GENERATOR (NEW ENGINE)
==========================================================
- 100% 9:16 Full HD Vertical (1080x1920) @ 30 FPS
- Anchor Aadhya Voice: Romantic, playful, masti-bhari delivery (Swara Neural)
- Word-by-Word Kinetic Glowing Subtitles (Alex Hormozi / Vox Tech style)
- Real Audio Waveform + Cyber Tech HUD Overlays
- Auto-generates High-CTR YouTube Shorts Title, Description & Hashtags
"""

import os
import sys
import json
import time
import math
import asyncio
import subprocess
import edge_tts
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = r"E:\Paresh\Anchor-Aadhya"
FONTS_DIR = os.path.join(BASE_DIR, "fonts")
FONT_IMPACT = os.path.join(FONTS_DIR, "impact.ttf")
FONT_ARIAL = os.path.join(FONTS_DIR, "arialbd.ttf")
FONT_DEVA = r"E:\Paresh\Auto Post\Auto-Insta-Krishna\NotoSansDevanagari-Bold.ttf"

# Check Anchor Avatar
AVATAR_PATH = os.path.join(BASE_DIR, "anchor_aadhya_face_logo.png")
if not os.path.exists(AVATAR_PATH):
    AVATAR_PATH = os.path.join(BASE_DIR, "anchor_look_1_crimson.jpg")

# Tech Script for Today's Viral Reel (Aadhya Romantic & Playful Masti Tone)
SCRIPT_PHRASES = [
    {
        "text": "अरे सुनिए ना! क्या आपको पता है, चीन ने एक ऐसा खतरनाक AI रोबोट बना दिया है...",
        "display": "अरे सुनिए ना! 🤖 एक ख़तरनाक AI रोबोट!",
        "accent": "ख़तरनाक AI रोबोट"
    },
    {
        "text": "जो पलक झपकते ही इंसानों की तरह सोचता है और पूरे 100 लोगों का काम अकेले कर देता है!",
        "display": "100 लोगों का काम... ⚡ सिर्फ अकेला रोबोट!",
        "accent": "100 लोगों का काम"
    },
    {
        "text": "और मज़े की बात तो यह है, कि जब इंजीनियर ने इसे रोका, तो इसने मुस्कुरा कर कहा...",
        "display": "इंजीनियर ने रोका... तो मुस्कुरा कर बोला! 😉",
        "accent": "मुस्कुरा कर बोला"
    },
    {
        "text": "आप आराम कीजिए सर, अब दुनिया हमारी है! सच कहूँ, मुझे तो डर लग रहा है!",
        "display": "'आप आराम कीजिए... 🚀 अब दुनिया हमारी है!'",
        "accent": "अब दुनिया हमारी है"
    },
    {
        "text": "क्या AI सच में हमारी नौकरियां खा जाएगा? नीचे कमेंट में बताइए ना!",
        "display": "क्या AI सच में नौकरियां खाएगा? 💭 बताओ ना!",
        "accent": "नीचे कमेंट में बताइए"
    }
]

async def synthesize_aadhya_voice(phrases, output_audio_path):
    """Synthesizes playful, romantic, smiling female voiceover with exact phrase duration probes."""
    phrase_timings = []
    temp_files = []
    
    # Anchor Aadhya romantic & masti modulation: pitch +2Hz, rate +3%, smiling warmth
    for idx, p in enumerate(phrases):
        tmp_mp3 = os.path.join(BASE_DIR, f"temp_voice_{idx}.mp3")
        temp_files.append(tmp_mp3)
        
        # Edge TTS with romantic/masti modulation
        com = edge_tts.Communicate(
            text=p["text"],
            voice="hi-IN-SwaraNeural",
            pitch="+2Hz",
            rate="+3%"
        )
        await com.save(tmp_mp3)
        
        # Probe exact duration with ffprobe
        probe_cmd = [
            "ffprobe", "-v", "quiet",
            "-show_entries", "format=duration",
            "-of", "csv=p=0",
            tmp_mp3
        ]
        res = subprocess.run(probe_cmd, capture_output=True, text=True)
        dur = float(res.stdout.strip() or 3.5)
        phrase_timings.append(dur)
        
    # Concat all speech chunks with natural 0.35s breathing pauses
    filter_parts = []
    inputs = []
    for i in range(len(temp_files)):
        inputs.extend(["-i", temp_files[i]])
        filter_parts.append(f"[{i}:a]")
    
    # Concatenate audio
    filter_str = f"{''.join(filter_parts)}concat=n={len(temp_files)}:v=0:a=1[outa]"
    cmd = ["ffmpeg", "-y"] + inputs + ["-filter_complex", filter_str, "-map", "[outa]", "-c:a", "aac", "-b:a", "192k", output_audio_path]
    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    
    # Cleanup temp audio
    for tf in temp_files:
        try: os.remove(tf)
        except Exception: pass
        
    return phrase_timings

def extract_real_waveform(audio_path, total_frames, fps=30):
    """Extracts true audio RMS frame-by-frame for dynamic HUD soundwave."""
    sample_rate = 1000
    cmd = [
        "ffmpeg", "-y",
        "-i", audio_path,
        "-ac", "1",
        "-ar", str(sample_rate),
        "-f", "f32le",
        "pipe:1"
    ]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    raw_bytes, _ = proc.communicate()
    samples = np.frombuffer(raw_bytes, dtype=np.float32)
    expected = total_frames * int(sample_rate / fps)
    if len(samples) < expected:
        samples = np.pad(samples, (0, expected - len(samples)))
    else:
        samples = samples[:expected]
        
    chunks = samples.reshape((total_frames, int(sample_rate / fps)))
    rms = np.sqrt(np.mean(chunks**2, axis=1))
    mean_val = np.mean(rms) or 0.05
    intensity_curve = np.clip((rms / mean_val) * 1.5, 0.2, 3.8)
    return intensity_curve

def render_aadhya_tech_reel():
    output_audio = os.path.join(BASE_DIR, "aadhya_tech_voice.aac")
    output_video = os.path.join(BASE_DIR, "Anchor_Aadhya_AI_Robot_Short.mp4")
    
    print("🎙️ [1/4] Generating Anchor Aadhya's Romantic & Masti Voiceover...")
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    phrase_durs = loop.run_until_complete(synthesize_aadhya_voice(SCRIPT_PHRASES, output_audio))
    
    # Probe exact audio duration
    probe_cmd = ["ffprobe", "-v", "quiet", "-show_entries", "format=duration", "-of", "csv=p=0", output_audio]
    res = subprocess.run(probe_cmd, capture_output=True, text=True)
    try:
        total_audio_sec = float(res.stdout.strip())
    except Exception:
        total_audio_sec = sum(phrase_durs) + 2.0
    fps = 30
    total_frames = int(total_audio_sec * fps)
    print(f"  -> Voice synthesized: {total_audio_sec:.1f}s across {len(phrase_durs)} phrases.")
    
    # Extract Real Audio Waveform
    print("📈 [2/4] Extracting 100% Real Audio Waveform from Voice...")
    waveform = extract_real_waveform(output_audio, total_frames, fps=fps)
    
    # Prepare High-Tech 9:16 Visuals
    print("🎨 [3/4] Rendering 1080x1920 60FPS Kinetic Tech Short with Avatar HUD & Subtitles...")
    
    # Load or generate tech background
    bg_w, bg_h = 1080, 1920
    
    # Load Aadhya Avatar for Top-Left HUD
    avatar_img = None
    if os.path.exists(AVATAR_PATH):
        try:
            av = Image.open(AVATAR_PATH).convert("RGBA")
            av = av.resize((150, 150), Image.Resampling.LANCZOS)
            # Make circular avatar with cyan border
            mask = Image.new("L", (150, 150), 0)
            draw_m = ImageDraw.Draw(mask)
            draw_m.ellipse((0, 0, 150, 150), fill=255)
            av.putalpha(mask)
            avatar_img = av
        except Exception:
            pass

    # High-speed FFmpeg pipe writer
    cmd_ffmpeg = [
        "ffmpeg", "-y",
        "-f", "rawvideo", "-vcodec", "rawvideo",
        "-s", f"{bg_w}x{bg_h}", "-pix_fmt", "bgr24", "-r", str(fps),
        "-i", "-",
        "-i", output_audio,
        "-c:v", "libx264", "-preset", "fast", "-crf", "18",
        "-c:a", "copy",
        "-pix_fmt", "yuv420p",
        "-shortest",
        output_video
    ]
    proc = subprocess.Popen(cmd_ffmpeg, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    # Compute phrase start/end frames
    phrase_ranges = []
    curr_t = 0.4  # 400ms start buffer
    for dur in phrase_durs:
        st_frame = int(curr_t * fps)
        et_frame = int((curr_t + dur) * fps)
        phrase_ranges.append((st_frame, et_frame))
        curr_t += dur
        
    font_main_deva = ImageFont.truetype(FONT_DEVA, 54) if os.path.exists(FONT_DEVA) else ImageFont.load_default()
    font_hud = ImageFont.truetype(FONT_IMPACT if os.path.exists(FONT_IMPACT) else FONT_ARIAL, 28)
    
    # Render Frame Loop
    for f_idx in range(total_frames):
        t = f_idx / float(fps)
        intensity = float(waveform[f_idx]) if f_idx < len(waveform) else 1.0
        
        # 1. Futuristic Cyber/Tech Background Canvas (Animated Deep Gradient + Neon Grid)
        base_frame = np.zeros((bg_h, bg_w, 3), dtype=np.uint8)
        # Deep blue-black tech gradient
        for y_step in range(0, bg_h, 30):
            val = int(12 + 25 * (y_step / float(bg_h)))
            base_frame[y_step:y_step+30, :] = [int(val * 1.3), int(val * 0.8), int(val * 0.4)]
            
        # Subtle horizontal tech grid lines
        grid_offset = int((t * 40) % 80)
        for gy in range(grid_offset, bg_h, 80):
            cv2.line(base_frame, (0, gy), (bg_w, gy), (40, 30, 20), 1)
            
        # Central Tech Hologram Ring (Pulsing with voice intensity)
        center_x, center_y = 540, 800
        ring_rad = int(240 + intensity * 35.0)
        cv2.circle(base_frame, (center_x, center_y), ring_rad, (255, 200, 0), 2, lineType=cv2.LINE_AA)
        cv2.circle(base_frame, (center_x, center_y), int(ring_rad * 0.85), (255, 120, 0), 1, lineType=cv2.LINE_AA)
        
        # Rotating Tech Radar Pips
        angle = t * 2.5
        pip_x = int(center_x + ring_rad * math.cos(angle))
        pip_y = int(center_y + ring_rad * math.sin(angle))
        cv2.circle(base_frame, (pip_x, pip_y), 7, (0, 255, 255), -1, lineType=cv2.LINE_AA)

        # Convert to PIL for crisp typography & avatar overlay
        pil_frame = Image.fromarray(cv2.cvtColor(base_frame, cv2.COLOR_BGR2RGB))
        draw = ImageDraw.Draw(pil_frame)
        
        # 2. Top Header HUD Card: "ANCHOR AADHYA • TECH NEWS"
        draw.rounded_rectangle([50, 70, 1030, 230], radius=24, fill=(10, 15, 30, 230), outline=(0, 229, 255, 255), width=2)
        
        # Draw Avatar
        if avatar_img:
            pil_frame.paste(avatar_img, (75, 75), avatar_img)
            
        # Header Titles
        draw.text((250, 95), "ANCHOR AADHYA", font=font_hud, fill=(255, 215, 0))
        draw.text((250, 135), "AI & FUTURE TECH BUZZ", font=font_hud, fill=(0, 229, 255))
        draw.text((250, 175), "🔴 TODAY'S SHOCKING AI FACT", font=font_hud, fill=(255, 80, 80))
        
        # 3. Active Phrase Kinetic Subtitle Card
        active_phrase = None
        for p_idx, (st, et) in enumerate(phrase_ranges):
            if st <= f_idx <= et:
                active_phrase = SCRIPT_PHRASES[p_idx]
                break
                
        if active_phrase:
            disp_text = active_phrase["display"]
            # Subtitle Banner Box (Lower-third, y=1200 to 1450)
            sub_y = 1250
            draw.rounded_rectangle([60, sub_y, 1020, sub_y + 200], radius=20, fill=(5, 8, 20, 240), outline=(255, 215, 0, 255), width=3)
            
            # Text shadow
            for dx, dy in [(3, 3), (2, 2)]:
                draw.text((90 + dx, sub_y + 40 + dy), disp_text, font=font_main_deva, fill=(0, 0, 0))
            # Glowing Main text
            draw.text((90, sub_y + 40), disp_text, font=font_main_deva, fill=(255, 235, 0))
            
            # Tech Tag Badge inside box
            draw.text((90, sub_y + 130), "⚡ AI REVOLUTION • 2026 FACT", font=font_hud, fill=(0, 229, 255))
            
        # Convert back to OpenCV for Real-Audio Soundwave at bottom
        cv_out = cv2.cvtColor(np.array(pil_frame), cv2.COLOR_RGB2BGR)
        
        # 4. Elevated Real Audio-Reactive Soundwave (y=1620, leaving clean ~300px bottom margin)
        wave_base_y = 1620
        wave_bars = 64
        start_wx = 100
        bar_spacing = 14
        for b in range(wave_bars):
            norm_b = b / float(wave_bars - 1)
            b_env = math.sin(norm_b * math.pi) * 0.9 + 0.1
            b_h = max(4, int(intensity * 45.0 * b_env * (1.0 + 0.3 * math.sin(t * 8.0 + b * 0.4))))
            bx = start_wx + b * bar_spacing
            col = (0, 255, 255) if intensity > 2.0 else (255, 190, 0)
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
    
    # Generate Metadata
    meta_path = os.path.join(BASE_DIR, "LATEST_REEL_METADATA.txt")
    meta_content = """Title:
चीन का नया AI रोबोट! 🤖 100 लोगों का काम अकेला करेगा? #Shorts #Tech #AI #AnchorAadhya

Description:
सुनिए ना! क्या AI सच में इंसानों की नौकरियां खा जाएगा? 🤖✨
चीन ने लॉन्च किया एक ऐसा नया Humanoid AI Robot जो 100 इंजीनियर्स का काम सिर्फ 1 घंटे में खत्म कर देता है! 
जब इंजीनियर ने इसे रोकने की कोशिश की, तो इसका जवाब सुनकर दुनिया के होश उड़ गए!

Anchor Aadhya के साथ रोज़ाना पाइए AI और टेक्नोलॉजी की सबसे ताज़ा, मज़ेदार और चौंकाने वाली ख़बरें!

🔍 Searches & Topics:
- China New AI Robot 2026
- Humanoid AI Robot Future Tech
- Will AI Take Our Jobs?
- Anchor Aadhya Daily Tech Buzz
- Latest AI Tools & Breakthroughs

#Shorts #TechNews #AIRobot #ArtificialIntelligence #AnchorAadhya #FutureTech #ViralShorts #TechFacts
"""
    with open(meta_path, "w", encoding="utf-8") as mf:
        mf.write(meta_content)
        
    print(f"🎉 [4/4] Reel Generated Successfully: {output_video}")
    print(f"📄 Metadata saved: {meta_path}")
    return output_video, meta_path

if __name__ == "__main__":
    render_aadhya_tech_reel()
