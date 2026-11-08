# -*- coding: utf-8 -*-
"""
Anchor Aadhya Evergreen Curiosity Shorts Engine
- Powered by faceless-shorts 'inside-out' 2D X-Ray & Cutaway Engine
- 100% Code-based animation (Zero external image API dependencies, zero cost)
- Female Indian voice (hi-IN-SwaraNeural)
- Devanagari Kinetic Captions with yellow keyword pops
- Auto-tracks topics so every single run produces a brand new reel
- Uploads directly to Anchor Aadhya YouTube Channel
"""

import os
import sys
import json
import asyncio
import traceback
import subprocess
from datetime import datetime

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENGINE_DIR = os.path.join(BASE_DIR, "engine")
DATA_DIR = os.path.join(ENGINE_DIR, "data")
TEMP_DIR = os.path.join(ENGINE_DIR, "temp_audio")
RENDERS_DIR = os.path.join(ENGINE_DIR, "renders")
REVIEW_DIR = os.path.join(ENGINE_DIR, "review")

TOPICS_FILE = os.path.join(BASE_DIR, "curiosity_topics.json")
TRACKER_FILE = os.path.join(BASE_DIR, "used_topics_tracker.json")

VOICE = "hi-IN-SwaraNeural"

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(TEMP_DIR, exist_ok=True)
os.makedirs(RENDERS_DIR, exist_ok=True)
os.makedirs(REVIEW_DIR, exist_ok=True)

def load_topics():
    with open(TOPICS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)

def load_tracker():
    if os.path.exists(TRACKER_FILE):
        try:
            with open(TRACKER_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_tracker(tracker):
    with open(TRACKER_FILE, "w", encoding="utf-8") as f:
        json.dump(tracker, f, indent=2, ensure_ascii=False)

def select_next_topic():
    topics = load_topics()
    used_ids = set(load_tracker())
    
    available = [t for t in topics if t["id"] not in used_ids]
    if not available:
        print("[Notice] All curated topics used once! Cycling back to beginning.", flush=True)
        available = topics
        save_tracker([])
        
    return available[0]

def get_audio_duration(file_path):
    cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", file_path]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(res.stdout.strip())

async def generate_line_audio(text, outfile):
    import edge_tts
    comm = edge_tts.Communicate(text, VOICE, rate="+3%")
    await comm.save(outfile)

async def build_voice_and_timing(topic):
    import numpy as np
    from scipy.io import wavfile
    
    print(f"\n[1/5] Synthesizing Voice ({VOICE}) for: {topic['title']}", flush=True)
    lead = 0.45
    outro = 0.90
    lines_meta = []
    all_words = []
    line_files = []
    
    current_time = lead
    for i, line_item in enumerate(topic["lines"]):
        text = line_item["text"]
        mp3_p = os.path.join(TEMP_DIR, f"line_{i:02d}.mp3")
        wav_p = os.path.join(TEMP_DIR, f"line_{i:02d}.wav")
        
        print(f"  -> Line {i+1}/{len(topic['lines'])}: '{text[:30]}...'", flush=True)
        await generate_line_audio(text, mp3_p)
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", mp3_p, "-ar", "48000", "-ac", "1", wav_p], check=True)
        dur = get_audio_duration(wav_p)
        
        start_t = round(current_time, 3)
        end_t = round(current_time + dur, 3)
        lines_meta.append({
            "i": i,
            "text": text,
            "start": start_t,
            "end": end_t
        })
        
        raw_words = text.replace(",", "").replace(".", "").replace("?", "").replace("!", "").split()
        if raw_words:
            total_chars = sum(len(w) for w in raw_words)
            w_cur = start_t
            for w in raw_words:
                w_dur = (len(w) / max(1, total_chars)) * dur
                all_words.append({
                    "w": w,
                    "line": i,
                    "s": round(w_cur, 3),
                    "e": round(w_cur + w_dur, 3)
                })
                w_cur += w_dur
                
        line_files.append((wav_p, dur))
        current_time = end_t + 0.30
        
    total_dur = round(current_time + outro, 3)
    print(f"  -> Assembling master narration.wav ({total_dur:.2f}s)...", flush=True)
    
    sr = 48000
    master_samples = np.zeros(int(total_dur * sr), dtype=np.float32)
    for i, (wav_p, dur) in enumerate(line_files):
        _, data = wavfile.read(wav_p)
        if data.dtype == np.int16:
            data = data.astype(np.float32) / 32768.0
        st_sample = int(lines_meta[i]["start"] * sr)
        end_sample = min(len(master_samples), st_sample + len(data))
        master_samples[st_sample:end_sample] = data[:end_sample - st_sample]
        
    narration_out = os.path.join(DATA_DIR, "narration.wav")
    wavfile.write(narration_out, sr, (master_samples * 32767).astype(np.int16))
    
    script_obj = {
        "id": topic["id"],
        "title": topic["title"],
        "voice": VOICE,
        "speed": 1.0,
        "lead": lead,
        "outro": outro,
        "music": topic.get("music", "bed"),
        "lines": topic["lines"]
    }
    with open(os.path.join(ENGINE_DIR, "script.json"), "w", encoding="utf-8") as f:
        json.dump(script_obj, f, ensure_ascii=False, indent=2)
        
    with open(os.path.join(DATA_DIR, "lines.json"), "w", encoding="utf-8") as f:
        json.dump({"duration": total_dur, "voice": VOICE, "speed": 1.0, "lines": lines_meta}, f, ensure_ascii=False, indent=2)
        
    with open(os.path.join(DATA_DIR, "words.json"), "w", encoding="utf-8") as f:
        json.dump(all_words, f, ensure_ascii=False, indent=2)
        
    print(f"  --> Voice & Timing Complete: {total_dur:.2f}s across {len(lines_meta)} cuts.", flush=True)
    return total_dur

def build_audio_mix():
    print("\n[2/5] Building Procedural Sound Effects & Music Mix...", flush=True)
    print("  -> Running node tools/capture.mjs cues...", flush=True)
    subprocess.run(["node", "tools/capture.mjs", "cues"], cwd=ENGINE_DIR, check=True)
    print("  -> Running python tools/mix.py...", flush=True)
    subprocess.run([sys.executable, "tools/mix.py", "."], cwd=ENGINE_DIR, check=True)
    print("  --> mix.wav ready!", flush=True)

def render_video_mp4():
    print("\n[3/5] Rendering 1080x1920 Short via Headless Chromium Engine...", flush=True)
    out_mp4 = os.path.join(RENDERS_DIR, "aadhya_short.mp4")
    if os.path.exists(out_mp4):
        try: os.remove(out_mp4)
        except Exception: pass
        
    env = os.environ.copy()
    env["FPS"] = "30"
    print("  -> Executing node tools/capture.mjs video...", flush=True)
    subprocess.run(["node", "tools/capture.mjs", "video", "renders/aadhya_short.mp4"], cwd=ENGINE_DIR, env=env, check=True)
    print(f"  --> MP4 Rendered Successfully: {out_mp4} ({os.path.getsize(out_mp4)/(1024*1024):.2f} MB)", flush=True)
    return out_mp4

def extract_thumbnail_frame():
    print("\n[4/5] Extracting High-CTR Kinetic Cover Frame...", flush=True)
    thumb_dir = os.path.join(REVIEW_DIR, "cover")
    os.makedirs(thumb_dir, exist_ok=True)
    subprocess.run(["node", "tools/capture.mjs", "frames", "review/cover", "7.0"], cwd=ENGINE_DIR, check=True)
    
    thumb_path = os.path.join(thumb_dir, "t7.00.jpg")
    if not os.path.exists(thumb_path):
        jpgs = [os.path.join(thumb_dir, f) for f in os.listdir(thumb_dir) if f.endswith(".jpg")]
        if jpgs:
            thumb_path = jpgs[0]
            
    print(f"  --> Cover Frame Extracted: {thumb_path}", flush=True)
    return thumb_path

def upload_to_youtube(topic, video_path, thumb_path):
    print(f"\n[5/5] Uploading to YouTube Shorts: {topic['title']}", flush=True)
    
    meta_path = os.path.join(BASE_DIR, "current_metadata.json")
    meta_content = {
        "title": topic["title"],
        "description": topic["description"] + "\n\n#AnchorAadhya #Shorts #Facts #Science",
        "tags": topic.get("tags", ["Shorts", "Facts", "Science"])
    }
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta_content, f, ensure_ascii=False, indent=2)
        
    from youtube_uploader import upload_direct_video
    success = upload_direct_video(video_path, meta_path, thumb_path=thumb_path)
    
    if success:
        tracker = load_tracker()
        if topic["id"] not in tracker:
            tracker.append(topic["id"])
            save_tracker(tracker)
        print(f"\n🎉 ALL STEPS COMPLETED! Topic '{topic['id']}' marked as posted.", flush=True)
        return True
    else:
        print("\n❌ Upload failed or deferred.", flush=True)
        return False

async def main():
    topic = select_next_topic()
    print("==============================================================", flush=True)
    print(f"  ANCHOR AADHYA EVERGREEN SHORTS: {topic['title']}", flush=True)
    print(f"  Topic ID: {topic['id']}", flush=True)
    print("==============================================================", flush=True)
    
    dur = await build_voice_and_timing(topic)
    build_audio_mix()
    video_mp4 = render_video_mp4()
    thumb_img = extract_thumbnail_frame()
    
    upload_to_youtube(topic, video_mp4, thumb_img)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        print("\n\n!!!!!!!!!!!!!!!!!!! CRITICAL PIPELINE ERROR !!!!!!!!!!!!!!!!!!!", flush=True)
        traceback.print_exc()
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n", flush=True)
        sys.exit(1)
