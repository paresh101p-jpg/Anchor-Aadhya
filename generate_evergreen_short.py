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
    # Energetic, witty, masti-bhara anchor delivery: +8% rate, +4Hz pitch
    comm = edge_tts.Communicate(text, VOICE, rate="+8%", pitch="+4Hz")
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

def build_rich_description(topic, is_short=True):
    title_clean = topic["title"].split("#")[0].strip()
    
    desc = f"""{title_clean}

अरे दोस्तों! क्या आपको पता है कि हमारे शरीर और रोज़मर्रा की ज़िंदगी में ऐसे कई चौंकाने वाले रहस्य छुपे हैं जिनके बारे में हम कभी सोचते भी नहीं? आज Anchor Aadhya के इस खास एपिसोड में हम जानेंगे कि {title_clean}! 

इस वीडियो को पूरा अंत तक देखें और जानें इसके पीछे का असली साइंटिफिक सच और रोचक तथ्य।

📌 इस वीडियो में क्या खास है:
• {topic.get('summary', title_clean)}
• शरीर के अंदर होने वाली वास्तविक बायोलॉजिकल प्रक्रिया
• सामान्य गलतफहमी और मेडिकल साइंस का असली सच
• खुद को सुरक्षित रखने के लिए जरूरी हेल्थ टिप्स

🔍 Searches & Topics Covered:
• {title_clean}
• Amazing Human Body Science Facts in Hindi
• What Happens If You Hold Sneeze
• Shocking Human Body Facts Hindi
• Anchor Aadhya Evergreen Science Explainer
• Eardrum Damage and Sneeze Pressure
• Daily Life Science Myths Busted

⚠️ DISCLAIMER & HEALTH ADVISORY:
This video is created strictly for educational, informational, and general curiosity purposes only. The animations, graphics, and descriptions illustrate scientific and physiological mechanisms in a stylized format. This content does not constitute professional medical advice, clinical diagnosis, or medical treatment. If you experience health issues or medical symptoms, always seek the advice of a qualified physician or healthcare provider.

🔔 Subscribe to Anchor Aadhya for daily mind-blowing facts, evergreen science explainers, and real mysteries!

#AnchorAadhya #Shorts #Facts #ScienceFacts #HumanBody #BiologyFacts #DidYouKnow #HindiFacts #ViralFacts"""
    return desc

def convert_to_16_9(short_path):
    print("\n[3.5/5] Generating Broadcast 16:9 Full HD Video (1920x1080)...", flush=True)
    out_16_9 = os.path.join(RENDERS_DIR, "aadhya_video_16_9.mp4")
    if os.path.exists(out_16_9):
        try: os.remove(out_16_9)
        except Exception: pass
        
    filter_complex = (
        "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=25:5,eq=brightness=-0.15:saturation=1.2[bg];"
        "[0:v]scale=-1:1040[fg];"
        "[bg][fg]overlay=(W-w)/2:(H-h)/2[v]"
    )
    cmd = [
        "ffmpeg", "-y", "-i", short_path,
        "-filter_complex", filter_complex,
        "-map", "[v]", "-map", "0:a",
        "-c:v", "libx264", "-preset", "veryfast", "-crf", "19",
        "-c:a", "copy",
        out_16_9
    ]
    subprocess.run(cmd, check=True)
    print(f"  --> 16:9 Video Rendered: {out_16_9} ({os.path.getsize(out_16_9)/(1024*1024):.2f} MB)", flush=True)
    return out_16_9

def create_16_9_thumbnail(thumb_9_16, topic):
    print("\n[4.5/5] Generating High-CTR 16:9 Landscape Thumbnail...", flush=True)
    out_thumb = os.path.join(REVIEW_DIR, "cover", "thumb_16_9.jpg")
    filter_complex = (
        "[0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,boxblur=20:5,eq=brightness=-0.2:saturation=1.15[bg];"
        "[0:v]scale=-1:700[fg];"
        "[bg][fg]overlay=(W-w)/2:(H-h)/2[v]"
    )
    cmd = [
        "ffmpeg", "-y", "-i", thumb_9_16,
        "-filter_complex", filter_complex,
        "-map", "[v]",
        "-frames:v", "1",
        out_thumb
    ]
    subprocess.run(cmd, check=True)
    print(f"  --> 16:9 Thumbnail Created: {out_thumb}", flush=True)
    return out_thumb

def upload_both_formats(topic, short_path, video_16_9_path, thumb_short, thumb_16_9):
    from youtube_uploader import upload_direct_video
    tracker = load_tracker()
    
    # 1. Upload 16:9 Landscape Video First (Main Video)
    title_16_9 = topic.get("video_title", topic["title"].split("#")[0].strip())
    print(f"\n[5/5 - A] Uploading 16:9 Full Landscape Video: {title_16_9}", flush=True)
    meta_path_16_9 = os.path.join(BASE_DIR, "metadata_16_9.json")
    meta_16_9 = {
        "title": title_16_9,
        "description": build_rich_description(topic, is_short=False),
        "tags": topic.get("tags", ["Anchor Aadhya", "Science", "Facts", "Human Body"])
    }
    with open(meta_path_16_9, "w", encoding="utf-8") as f:
        json.dump(meta_16_9, f, ensure_ascii=False, indent=2)
        
    ok_16_9 = upload_direct_video(video_16_9_path, meta_path_16_9, thumb_path=thumb_16_9)
    if ok_16_9:
        print("  --> 16:9 Full Video Uploaded Successfully!", flush=True)
    else:
        print("  --> Warning: 16:9 Video upload deferred or failed.", flush=True)
        
    # 2. Upload 9:16 Vertical Short
    print(f"\n[5/5 - B] Uploading 9:16 Vertical Short: {topic['title']}", flush=True)
    meta_path_short = os.path.join(BASE_DIR, "metadata_short.json")
    meta_short = {
        "title": topic["title"],
        "description": build_rich_description(topic, is_short=True),
        "tags": topic.get("tags", ["Shorts", "Facts", "Science"])
    }
    with open(meta_path_short, "w", encoding="utf-8") as f:
        json.dump(meta_short, f, ensure_ascii=False, indent=2)
        
    ok_short = upload_direct_video(short_path, meta_path_short, thumb_path=thumb_short)
    if ok_short:
        print("  --> 9:16 Short Uploaded Successfully!", flush=True)
        if topic["id"] not in tracker:
            tracker.append(topic["id"])
            save_tracker(tracker)
        print(f"\n🎉 ALL STEPS COMPLETED! Topic '{topic['id']}' marked as posted.", flush=True)
        return True
    return ok_16_9

def upload_to_youtube(topic, video_path, thumb_path):
    # Backward compatible wrapper
    return upload_both_formats(topic, video_path, video_path, thumb_path, thumb_path)

async def main():
    topic = select_next_topic()
    print("==============================================================", flush=True)
    print(f"  ANCHOR AADHYA EVERGREEN SHORTS: {topic['title']}", flush=True)
    print(f"  Topic ID: {topic['id']}", flush=True)
    print("==============================================================", flush=True)
    
    dur = await build_voice_and_timing(topic)
    build_audio_mix()
    short_mp4 = render_video_mp4()
    video_16_9 = convert_to_16_9(short_mp4)
    thumb_9_16 = extract_thumbnail_frame()
    thumb_16_9 = create_16_9_thumbnail(thumb_9_16, topic)
    
    upload_both_formats(topic, short_mp4, video_16_9, thumb_9_16, thumb_16_9)

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        print("\n\n!!!!!!!!!!!!!!!!!!! CRITICAL PIPELINE ERROR !!!!!!!!!!!!!!!!!!!", flush=True)
        traceback.print_exc()
        print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n\n", flush=True)
        sys.exit(1)
