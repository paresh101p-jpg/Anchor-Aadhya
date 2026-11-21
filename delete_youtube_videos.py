#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Permanently delete specified videos from the Anchor Aadhya YouTube channel.

Usage:
  python delete_youtube_videos.py ID1 ID2
  YOUTUBE_VIDEO_IDS=ID1,ID2 python delete_youtube_videos.py
"""
import os
import sys

from youtube_uploader import get_authenticated_service


def video_ids():
    raw = list(sys.argv[1:])
    env_raw = os.environ.get("YOUTUBE_VIDEO_IDS", "")
    if env_raw:
        raw.extend([x.strip() for x in env_raw.split(",") if x.strip()])
    cleaned, seen = [], set()
    for vid in raw:
        vid = vid.strip()
        if not vid or vid in seen:
            continue
        seen.add(vid)
        cleaned.append(vid)
    return cleaned


def main():
    ids = video_ids()
    if not ids:
        print("[ERROR] No video ids given.", flush=True)
        return 1

    youtube = get_authenticated_service()
    if not youtube:
        print("[ERROR] YouTube authentication failed. Check the repository secrets.", flush=True)
        return 1

    try:
        me = youtube.channels().list(mine=True, part="snippet").execute()
        for ch in me.get("items", []):
            snip = ch["snippet"]
            print(f"[AUTH] Channel: {snip['title']} | handle: @{snip.get('customUrl', '?')}", flush=True)
    except Exception as exc:
        print(f"[AUTH] Could not read channel: {exc}", flush=True)

    failed = []
    for vid in ids:
        try:
            youtube.videos().delete(id=vid).execute()
            print(f"[DELETED] {vid} (permanently removed)", flush=True)
        except Exception as exc:
            failed.append(vid)
            print(f"[ERROR] Could not delete {vid}: {exc}", flush=True)

    if failed:
        print(f"[DONE] {len(ids) - len(failed)} deleted, {len(failed)} failed: {', '.join(failed)}", flush=True)
        return 1
    print(f"[DONE] All {len(ids)} video(s) deleted permanently.", flush=True)
    return 0


if __name__ == "__main__":
    sys.exit(main())
