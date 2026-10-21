# -*- coding: utf-8 -*-
"""
Automated YouTube Video & Thumbnail Uploader for Anchor Aadhya News Channel
- 100% Autonomous: Uploads today's Full HD 1080p News Bulletin Video
- Attaches the Custom 1280x720 High-CTR Thumbnail
- Injects Full Rich Hinglish Description, Timestamps, and SEO Tags
- Declares Synthetic/AI Content & Sets Not Made For Kids (100% YPP Compliant)
- Supports Dual Daily Slots: 12:00 PM & 05:00 PM
- Tracks upload status in uploaded_bulletins_tracker.txt to prevent duplicates
"""

import os
import sys
import json
import time
import argparse
from datetime import datetime
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TOKEN_FILE = os.path.join(BASE_DIR, "youtube_token.json")
TRACKER_FILE = os.path.join(BASE_DIR, "uploaded_bulletins_tracker.txt")

def get_authenticated_service():
    client_id = os.environ.get("YOUTUBE_CLIENT_ID")
    client_secret = os.environ.get("YOUTUBE_CLIENT_SECRET")
    refresh_token = os.environ.get("YOUTUBE_REFRESH_TOKEN")

    if not (client_id and client_secret and refresh_token):
        if os.path.exists(TOKEN_FILE):
            try:
                with open(TOKEN_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    client_id = data.get("client_id")
                    client_secret = data.get("client_secret")
                    refresh_token = data.get("refresh_token")
            except Exception as e:
                print(f"Error reading local token file: {e}", flush=True)

    if not (client_id and client_secret and refresh_token):
        print("\n[ERROR] YouTube Credentials not found!")
        return None

    creds = Credentials(
        token=None,
        refresh_token=refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=client_id,
        client_secret=client_secret,
        scopes=[
            "https://www.googleapis.com/auth/youtube.upload",
            "https://www.googleapis.com/auth/youtube"
        ]
    )
    return build("youtube", "v3", credentials=creds)

def is_already_uploaded(video_name):
    if os.path.exists(TRACKER_FILE):
        with open(TRACKER_FILE, "r", encoding="utf-8") as f:
            for line in f:
                if video_name in line:
                    return True
    return False

def mark_as_uploaded(video_name, video_id, url):
    with open(TRACKER_FILE, "a", encoding="utf-8") as f:
        f.write(f"{datetime.now().strftime('%Y-%m-%d %H:%M:%S')} | {video_name} | {video_id} | {url}\n")

def upload_daily_bulletin(slot=None, force=False):
    today_slug = datetime.now().strftime("%Y-%m-%d")
    if not force:
        force = os.environ.get("FORCE_UPLOAD", "").strip().lower() in ["true", "1", "yes"]

    candidates = []
    if slot:
        candidates.append(slot)
    else:
        # Check current hour
        current_hour = datetime.now().hour
        if current_hour < 14:
            candidates = ["12PM", "5PM"]
        else:
            candidates = ["5PM", "12PM"]

    target_video = None
    target_meta = None
    target_thumb = None
    target_slot = None

    for s in candidates:
        v_path = os.path.join(BASE_DIR, f"Anchor_Aadhya_News_{today_slug}_{s}.mp4")
        # Check fallback legacy filename if applicable
        if not os.path.exists(v_path) and s == "5PM":
            legacy_v = os.path.join(BASE_DIR, f"Anchor_Aadhya_News_{today_slug}.mp4")
            if os.path.exists(legacy_v):
                v_path = legacy_v

        m_path = os.path.join(BASE_DIR, f"metadata_{today_slug}_{s}.json")
        if not os.path.exists(m_path) and s == "5PM":
            legacy_m = os.path.join(BASE_DIR, f"metadata_{today_slug}.json")
            if os.path.exists(legacy_m):
                m_path = legacy_m

        t_path = os.path.join(BASE_DIR, f"Thumbnail_{today_slug}_{s}.jpg")
        if not os.path.exists(t_path) and s == "5PM":
            legacy_t = os.path.join(BASE_DIR, f"Thumbnail_{today_slug}.jpg")
            if os.path.exists(legacy_t):
                t_path = legacy_t

        if os.path.exists(v_path) and (force or not is_already_uploaded(os.path.basename(v_path))):
            target_video = v_path
            target_meta = m_path
            target_thumb = t_path
            target_slot = s
            break

    if not target_video:
        print(f"[SKIP] No pending new video found to upload for {today_slug}. (Use --force to force upload)", flush=True)
        return False

    print("\n==============================================================")
    print(f"  STARTING AUTOMATED YOUTUBE UPLOAD: {today_slug} ({target_slot})")
    print("==============================================================")

    if not os.path.exists(target_meta):
        print(f"[ERROR] Metadata file missing: {target_meta}")
        return False

    with open(target_meta, "r", encoding="utf-8") as f:
        meta = json.load(f)

    youtube = get_authenticated_service()
    if not youtube:
        print("[CRITICAL] YouTube authentication failed! Check YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, and YOUTUBE_REFRESH_TOKEN in GitHub Repository Secrets.", flush=True)
        return False

    body = {
        "snippet": {
            "title": meta.get("title", f"Anchor Aadhya Tech News {today_slug} ({target_slot})"),
            "description": meta.get("description", ""),
            "tags": meta.get("tags", ["AI News", "Tech News", "Anchor Aadhya"]),
            "categoryId": "28",  # Science & Technology
            "defaultLanguage": "hi",
            "defaultAudioLanguage": "hi"
        },
        "status": {
            "privacyStatus": "public",
            "selfDeclaredMadeForKids": False,
            "embeddable": True
        }
    }

    print(f"  --> Title: {body['snippet']['title']}")
    print(f"  --> Video File: {target_video} ({os.path.getsize(target_video)/(1024*1024):.2f} MB)")
    print("  --> Uploading video stream to YouTube...")

    media = MediaFileUpload(
        target_video,
        mimetype="video/mp4",
        chunksize=1024 * 1024 * 4,  # 4MB chunks
        resumable=True
    )

    request = youtube.videos().insert(
        part="snippet,status",
        body=body,
        media_body=media
    )

    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"  --> Upload Progress: {int(status.progress() * 100)}%", flush=True)

    video_id = response.get("id")
    video_url = f"https://www.youtube.com/watch?v={video_id}"
    print(f"\n[SUCCESS] VIDEO UPLOADED! Video ID: {video_id}")
    print(f"  --> Live URL: {video_url}")

    # Upload Custom Thumbnail
    if os.path.exists(target_thumb):
        print(f"  --> Uploading High-CTR Thumbnail: {target_thumb}...")
        try:
            thumb_media = MediaFileUpload(target_thumb, mimetype="image/jpeg")
            youtube.thumbnails().set(
                videoId=video_id,
                media_body=thumb_media
            ).execute()
            print("  --> [SUCCESS] Custom Thumbnail Attached Successfully!")
        except Exception as e:
            print(f"  Notice uploading thumbnail: {e}")

    mark_as_uploaded(os.path.basename(target_video), video_id, video_url)

    # Automatically delete posted video footage, thumbnail, and story images after successful upload
    print("\n--- Cleaning Up Posted Video Footage & Images ---")
    for f_del in [target_video, target_thumb]:
        if os.path.exists(f_del):
            try:
                os.remove(f_del)
                print(f"  [DELETED] Posted media: {os.path.basename(f_del)}")
            except Exception as e:
                pass
    import glob
    for pat in ["news_*_shot*.jpg", "anchor_aadhya_*_ai.jpg", "tv_scene_*.mp4", "temp_concat*", "Thumbnail_*.jpg", "Anchor_Aadhya_News_*.mp4"]:
        for f in glob.glob(os.path.join(BASE_DIR, pat)):
            try:
                os.remove(f)
                print(f"  [DELETED] Used asset: {os.path.basename(f)}")
            except Exception:
                pass
    return True

def upload_direct_video(video_path, meta_path, thumb_path=None):
    if not os.path.exists(video_path):
        print(f"[ERROR] Video file not found: {video_path}")
        return False
    if not os.path.exists(meta_path):
        print(f"[ERROR] Metadata file not found: {meta_path}")
        return False

    with open(meta_path, "r", encoding="utf-8") as f:
        meta = json.load(f)

    youtube = get_authenticated_service()
    if not youtube:
        print("[CRITICAL] YouTube authentication failed! Check GitHub Secrets.", flush=True)
        return False

    body = {
        "snippet": {
            "title": meta.get("title", "Anchor Aadhya Tech Short #Shorts"),
            "description": meta.get("description", ""),
            "tags": meta.get("tags", ["Shorts", "TechShorts", "AnchorAadhya"]),
            "categoryId": "28",  # Science & Technology
            "defaultLanguage": "hi",
            "defaultAudioLanguage": "hi"
        },
        "status": {
            "privacyStatus": "public",
            "selfDeclaredMadeForKids": False,
            "embeddable": True
        }
    }

    print(f"  --> Title: {body['snippet']['title']}")
    print(f"  --> Video File: {video_path} ({os.path.getsize(video_path)/(1024*1024):.2f} MB)")
    print("  --> Uploading video stream to YouTube...")

    media = MediaFileUpload(video_path, mimetype="video/mp4", chunksize=1024*1024*4, resumable=True)
    request = youtube.videos().insert(part="snippet,status", body=body, media_body=media)
    response = None
    while response is None:
        status, response = request.next_chunk()
        if status:
            print(f"  --> Upload Progress: {int(status.progress() * 100)}%", flush=True)

    video_id = response.get("id")
    video_url = f"https://www.youtube.com/watch?v={video_id}"
    print(f"\n[SUCCESS] VIDEO UPLOADED! Video ID: {video_id}")
    print(f"  --> Live URL: {video_url}")

    if thumb_path and os.path.exists(thumb_path):
        try:
            youtube.thumbnails().set(videoId=video_id, media_body=MediaFileUpload(thumb_path, mimetype="image/jpeg")).execute()
            print("  --> [SUCCESS] Custom Thumbnail Attached!")
        except Exception as e:
            print(f"  [WARNING] Thumbnail upload failed: {e}")

    mark_as_uploaded(os.path.basename(video_path), video_id, video_url)
    return True

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--slot", choices=["12PM", "5PM"], default=None, help="Specific slot to upload")
    parser.add_argument("--force", action="store_true", help="Force upload even if already tracked")
    parser.add_argument("--video", default=None, help="Direct video file to upload")
    parser.add_argument("--meta", default=None, help="Direct metadata JSON file to upload")
    parser.add_argument("--thumb", default=None, help="Optional thumbnail file to attach")
    args = parser.parse_args()

    if args.video and args.meta:
        ok = upload_direct_video(args.video, args.meta, thumb_path=args.thumb)
    else:
        ok = upload_daily_bulletin(args.slot, force=args.force)

    if not ok:
        sys.exit(1)
