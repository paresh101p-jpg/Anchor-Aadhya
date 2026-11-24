# -*- coding: utf-8 -*-
"""
Autonomous Viral Reel Master Pipeline for Anchor Aadhya
- Complete end-to-end cloud orchestration:
  1. Topic Selection: Picks next fresh topic from viral_topics_pool.json.
  2. Multi-Language Audio Synthesis: 10 edge-tts tracks mixed with ducked BGM score.
  3. SRT Subtitles: Generates 10 synchronized soft subtitle tracks.
  4. Dynamic Storyboard: Generates 15+ screen HTML/SVG with hard safe-zone clipPath.
  5. Layout Validation: Strict collision & overlap safety check before rendering.
  6. Frame-Exact Headless Chromium Render: 1080x1920 @ 30fps -> reel_2d.mp4.
  7. Multi-Track Muxing: Embeds 10 audios + 10 soft subtitles (mov_text) -> master_reel_10lang.mp4.
  8. YouTube Upload: Publishes to Anchor Aadhya YouTube channel via Data API.
  9. Ephemeral Cleanup: Deletes all temporary video, audio, and subtitle files.
  10. Tracker Persistence: Updates used_topics_tracker.json.
"""

import os
import sys
import json
import shutil
import subprocess
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
POOL_FILE = os.path.join(BASE_DIR, "viral_topics_pool.json")
TRACKER_FILE = os.path.join(BASE_DIR, "used_topics_tracker.json")

def load_next_topic():
    with open(POOL_FILE, "r", encoding="utf-8") as f:
        pool = json.load(f)
    
    topics = pool.get("topics", [])
    if not topics:
        raise ValueError("No topics found in viral_topics_pool.json!")

    used_ids = set()
    if os.path.exists(TRACKER_FILE):
        try:
            with open(TRACKER_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                used_ids = set(data.get("used_topic_ids", []))
        except Exception:
            used_ids = set()

    # Check for force topic override from environment variable
    force_id = os.environ.get("FORCE_TOPIC_ID", "").strip()
    if force_id:
        for t in topics:
            if t["id"] == force_id:
                print(f"🎯 [Pipeline]: Using forced topic override: {t['id']}")
                return t

    # Select next unused topic
    for t in topics:
        if t["id"] not in used_ids:
            print(f"🎯 [Pipeline]: Selected fresh topic: {t['id']} ({len(t['screens'])} screens)")
            return t

    # If all topics used, reset tracker and start from first
    print("🔄 [Pipeline]: All topics exhausted! Resetting used_topics_tracker.json to cycle again.")
    used_ids = set()
    with open(TRACKER_FILE, "w", encoding="utf-8") as f:
        json.dump({"used_topic_ids": [], "last_reset": datetime.now().isoformat()}, f, indent=2)
    return topics[0]

def update_tracker(topic_id):
    used_ids = []
    if os.path.exists(TRACKER_FILE):
        try:
            with open(TRACKER_FILE, "r", encoding="utf-8") as f:
                data = json.load(f)
                used_ids = data.get("used_topic_ids", [])
        except Exception:
            used_ids = []

    if topic_id not in used_ids:
        used_ids.append(topic_id)

    with open(TRACKER_FILE, "w", encoding="utf-8") as f:
        json.dump({
            "used_topic_ids": used_ids,
            "last_updated": datetime.now().isoformat()
        }, f, indent=2)
    print(f"💾 [Pipeline]: Recorded {topic_id} in used_topics_tracker.json")

def cleanup_ephemeral_assets():
    print("🧹 [Pipeline]: Cleaning up all temporary video renders, audio tracks, and frames...")
    paths_to_delete = [
        os.path.join(BASE_DIR, "audio_work"),
        os.path.join(BASE_DIR, "languages_padded"),
        os.path.join(BASE_DIR, "subtitles"),
        os.path.join(BASE_DIR, "reel_2d.mp4"),
        os.path.join(BASE_DIR, "master_reel_10lang.mp4"),
        os.path.join(BASE_DIR, "reel_stage.html"),
        os.path.join(BASE_DIR, "metadata_upload.json")
    ]
    for p in paths_to_delete:
        if os.path.isdir(p):
            try:
                shutil.rmtree(p)
            except Exception as e:
                print(f"  Warning deleting dir {p}: {e}")
        elif os.path.isfile(p):
            try:
                os.remove(p)
            except Exception as e:
                print(f"  Warning deleting file {p}: {e}")
    print("✨ [Pipeline]: Workspace fully cleaned!")

def run_pipeline():
    print("=" * 70)
    print("🚀 ANCHOR AADHYA 15+ SCREEN AUTONOMOUS VIRAL REEL PIPELINE")
    print("=" * 70)

    # 1. Select Topic
    topic = load_next_topic()

    # 2. Synthesize Multi-Language Audios & Padding
    print("\n--- STEP 1: MULTI-LANGUAGE AUDIO SYNTHESIS ---")
    from audio_engine import process_audio
    master_dur = process_audio(topic, BASE_DIR)

    # 3. Generate SRT Subtitles
    print("\n--- STEP 2: SRT SUBTITLES GENERATION ---")
    from generate_srt import generate_subtitles
    generate_subtitles(topic, BASE_DIR)

    # 4. Generate Storyboard HTML
    print("\n--- STEP 3: STORYBOARD HTML GENERATION ---")
    from storyboard_engine import generate_storyboard_html
    stage_html = os.path.join(BASE_DIR, "reel_stage.html")
    html_content = generate_storyboard_html(topic, master_dur)
    with open(stage_html, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"Generated storyboard HTML: {stage_html}")

    # 5. Validate Layout & Safe-Zones
    print("\n--- STEP 4: PRE-FLIGHT LAYOUT & COLLISION VALIDATION ---")
    from validate_layout import validate_html_layout
    if not validate_html_layout(stage_html):
        print("❌ [PIPELINE ABORTED]: Layout validator detected unsafe overlap risks!")
        sys.exit(1)

    # 6. Headless Frame Render
    print("\n--- STEP 5: HEADLESS CHROMIUM FRAME RENDER ---")
    render_script = os.path.join(BASE_DIR, "render_engine.mjs")
    res_render = subprocess.run(["node", render_script], cwd=BASE_DIR)
    if res_render.returncode != 0:
        print("❌ [PIPELINE ABORTED]: Render engine failed!")
        sys.exit(1)

    # 7. Mux Video + 10 Audios + 10 Soft Subtitles
    print("\n--- STEP 6: 10-LANGUAGE MULTI-TRACK MUXING ---")
    from mux_engine import mux_multitrack_reel
    master_video = mux_multitrack_reel(BASE_DIR)

    # 8. Upload to YouTube
    dry_run = os.environ.get("DRY_RUN", "").strip().lower() in ["true", "1", "yes"]
    if dry_run:
        print("\n--- STEP 7: DRY RUN ENABLED (SKIPPING YOUTUBE UPLOAD) ---")
    else:
        print("\n--- STEP 7: YOUTUBE UPLOAD TO ANCHOR AADHYA CHANNEL ---")
        meta_file = os.path.join(BASE_DIR, "metadata_upload.json")
        meta_data = {
            "title": topic.get("yt_title", topic["title"]),
            "description": topic.get("yt_description", topic["title"]),
            "tags": topic.get("tags", ["Shorts", "History", "MindBlowing"]),
            "categoryId": "27",  # Education / History
            "privacyStatus": os.environ.get("YOUTUBE_PRIVACY_STATUS", "public")
        }
        with open(meta_file, "w", encoding="utf-8") as f:
            json.dump(meta_data, f, indent=2)

        uploader_script = os.path.join(BASE_DIR, "youtube_uploader.py")
        res_upload = subprocess.run([
            sys.executable, uploader_script,
            "--video", master_video,
            "--meta", meta_file
        ], cwd=BASE_DIR)
        if res_upload.returncode != 0:
            print("⚠️ [Pipeline Warning]: YouTube upload reported an issue.")
        else:
            print("🎉 [Pipeline]: YouTube upload successfully completed!")

    # 9. Update Tracker
    update_tracker(topic["id"])

    # 10. Ephemeral Cleanup
    cleanup_ephemeral_assets()

    print("\n" + "=" * 70)
    print("✅ PIPELINE EXECUTION FINISHED SUCCESSFULLY!")
    print("=" * 70)

if __name__ == "__main__":
    run_pipeline()
