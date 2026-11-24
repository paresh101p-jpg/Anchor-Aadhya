# -*- coding: utf-8 -*-
"""
SRT Subtitle Generator for 10-Language Multi-Track Viral Reels
Generates 10 SRT subtitle files synchronized with screen durations.
"""

import json
import os

LANGUAGES = ["hi", "gu", "en", "mr", "bn", "ta", "te", "kn", "es", "fr"]

def format_srt_time(seconds):
    hrs = int(seconds // 3600)
    mins = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int(round((seconds - int(seconds)) * 1000))
    return f"{hrs:02d}:{mins:02d}:{secs:02d},{millis:03d}"

def generate_subtitles(topic, base_dir):
    sub_dir = os.path.join(base_dir, "subtitles")
    os.makedirs(sub_dir, exist_ok=True)

    dur_file = os.path.join(base_dir, "duration.json")
    with open(dur_file, "r", encoding="utf-8") as f:
        dur_data = json.load(f)

    screens = topic["screens"]
    num_screens = len(screens)
    total_dur = dur_data["duration"]
    screen_dur = total_dur / num_screens

    print(f"📝 [SRT Engine]: Generating 10 subtitle tracks for {num_screens} screens...")

    for lang in LANGUAGES:
        srt_path = os.path.join(sub_dir, f"sub_{lang}.srt")
        with open(srt_path, "w", encoding="utf-8") as f:
            for sc in screens:
                idx = sc["index"]
                txt = sc["scripts"].get(lang, sc["scripts"]["hi"]).strip()
                t_start = (idx - 1) * screen_dur
                t_end = idx * screen_dur - 0.05
                f.write(f"{idx}\n")
                f.write(f"{format_srt_time(t_start)} --> {format_srt_time(t_end)}\n")
                f.write(f"{txt}\n\n")
        print(f"  • Generated SRT [{lang.upper()}]: {srt_path}")

    print("✅ [SRT Engine Complete]: All 10 subtitle files generated!")

if __name__ == "__main__":
    base = os.path.dirname(os.path.abspath(__file__))
    with open(os.path.join(base, "viral_topics_pool.json"), "r", encoding="utf-8") as f:
        pool = json.load(f)
    generate_subtitles(pool["topics"][0], base)
