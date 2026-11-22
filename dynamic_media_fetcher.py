# -*- coding: utf-8 -*-
"""
Dynamic Media Fetcher for Anchor Aadhya (100% Free, Zero API Keys, Wikimedia + Openverse)
Fetches high-definition Creative Commons & Public Domain media for any script topic.
Downloads locally to engine/media/ and generates media_manifest.json.
"""

import os
import re
import json
import urllib.request
import urllib.parse
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ENGINE_DIR = os.path.join(BASE_DIR, "engine")
MEDIA_DIR = os.path.join(ENGINE_DIR, "media")

API_HEADERS = {
    "User-Agent": "AnchorAadhya/1.0 (contact@anchoraadhya.com; https://github.com/paresh101p-jpg/Anchor-Aadhya)"
}

DL_HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    "Referer": "https://www.flickr.com/"
}

# Topic-specific curated visual queries for literal documentary alignment
CURATED_TOPIC_QUERIES = {
    "sinking_car_door_physics": [
        "car sinking river water",
        "car door lock electronic",
        "water pressure physics gauge",
        "car submerged underwater",
        "car door frame engineering",
        "hydraulic pressure weight 800 kg",
        "heavy vehicle pushing force",
        "underwater diver trapped car",
        "car emergency survival rescue",
        "stopwatch 60 seconds timer",
        "emergency golden time countdown",
        "seatbelt buckle release car",
        "car power window glass",
        "front windshield laminated safety glass",
        "side window tempered safety glass",
        "car seat headrest metal prongs",
        "emergency glass breaker hammer corner",
        "shattered glass water flood rushing",
        "car cabin flooded equalized pressure",
        "diver swimming surface air bubbles sunlight"
    ]
}

def clean_media_dir():
    os.makedirs(MEDIA_DIR, exist_ok=True)
    for f in os.listdir(MEDIA_DIR):
        if f.endswith((".jpg", ".png", ".jpeg", ".json")):
            try:
                os.remove(os.path.join(MEDIA_DIR, f))
            except Exception:
                pass

def search_openverse_image(query):
    """Searches Openverse for high-res Creative Commons image URL."""
    try:
        url = f"https://api.openverse.org/v1/images/?q={urllib.parse.quote(query)}&page_size=5"
        req = urllib.request.Request(url, headers=API_HEADERS)
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode("utf-8", errors="ignore"))
            results = data.get("results", [])
            for r in results:
                img_url = r.get("url")
                if img_url and any(ext in img_url.lower() for ext in [".jpg", ".png", ".jpeg", "flickr.com"]):
                    return img_url, r.get("title", query)
    except Exception:
        pass
    return None, None

def search_wikimedia_image(query):
    """Searches Wikimedia Commons for high-res public domain image URL."""
    try:
        url = f"https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(query)}&srnamespace=6&srlimit=5&format=json"
        req = urllib.request.Request(url, headers=API_HEADERS)
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode("utf-8", errors="ignore"))
            search = data.get("query", {}).get("search", [])
            for item in search:
                title = item.get("title", "")
                if any(ext in title.lower() for ext in [".jpg", ".png", ".jpeg"]):
                    info_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(title)}&prop=imageinfo&iiprop=url&format=json"
                    r2 = urllib.request.urlopen(urllib.request.Request(info_url, headers=API_HEADERS), timeout=8)
                    d2 = json.loads(r2.read().decode("utf-8", errors="ignore"))
                    pages = d2.get("query", {}).get("pages", {})
                    for p in pages.values():
                        ii = p.get("imageinfo", [{}])[0]
                        img_url = ii.get("url")
                        if img_url:
                            return img_url, title
    except Exception:
        pass
    return None, None

def download_and_optimize_image(url, out_path):
    """Downloads image and optimizes resolution to 1920x1080 for instant Canvas rendering."""
    try:
        req = urllib.request.Request(url, headers=DL_HEADERS)
        with urllib.request.urlopen(req, timeout=12) as resp:
            img_data = resp.read()
            if len(img_data) < 3000:
                return False
            with open(out_path, "wb") as f:
                f.write(img_data)
        
        # Verify and optimize with Pillow
        with Image.open(out_path) as img:
            img = img.convert("RGB")
            # Resize so it's sharp and clean for full HD 16:9
            w, h = img.size
            if w < 1280 or h < 720:
                target_w = 1920
                target_h = int(h * (1920 / max(w, 1)))
                img = img.resize((target_w, target_h), Image.Resampling.LANCZOS)
            img.save(out_path, "JPEG", quality=90)
        return True
    except Exception as e:
        try:
            if os.path.exists(out_path):
                os.remove(out_path)
        except Exception:
            pass
        return False

def fetch_media_for_topic(topic):
    """
    Downloads high-res relevant visuals for each line in topic.
    Creates media_manifest.json in engine/media/.
    """
    clean_media_dir()
    topic_id = topic.get("id", "general")
    lines = topic.get("lines", [])
    manifest = {}
    
    curated_queries = CURATED_TOPIC_QUERIES.get(topic_id, [])
    base_fallback_tag = topic_id.replace("_", " ")

    print(f"\n[Dynamic Media Engine] Fetching Free HD Visuals for topic: {topic_id} ({len(lines)} lines)...", flush=True)

    for i, line in enumerate(lines):
        is_last = (i == len(lines) - 1)
        if is_last:
            # Last line is strictly reserved for interactive Subscribe Outro
            continue

        query = curated_queries[i] if i < len(curated_queries) else None
        if not query:
            caps = line.get("caps", "")
            clean_caps = re.sub(r'[\*\+\|]', ' ', caps).strip()
            query = f"{base_fallback_tag} {clean_caps}".strip()

        out_name = f"shot_L{str(i+1).zfill(2)}.jpg"
        out_path = os.path.join(MEDIA_DIR, out_name)

        # 1. Search Openverse
        img_url, title = search_openverse_image(query)
        # 2. Fallback to Wikimedia Commons
        if not img_url:
            img_url, title = search_wikimedia_image(query)
        # 3. Fallback to simplified query
        if not img_url:
            simple_q = query.split()[0] + " " + query.split()[-1] if len(query.split()) > 1 else query
            img_url, title = search_openverse_image(simple_q)
            if not img_url:
                img_url, title = search_wikimedia_image(simple_q)

        success = False
        if img_url:
            success = download_and_optimize_image(img_url, out_path)

        if success:
            manifest[f"L{str(i+1).zfill(2)}"] = {
                "file": f"media/{out_name}",
                "query": query,
                "title": title
            }
            print(f"  -> Line {i+1}: ✅ Loaded visual for '{query[:32]}' ({os.path.getsize(out_path)//1024} KB)", flush=True)
        else:
            print(f"  -> Line {i+1}: ℹ️ Procedural 2D Canvas fallback for '{query[:32]}'", flush=True)

    manifest_path = os.path.join(MEDIA_DIR, "manifest.json")
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)

    print(f"[Dynamic Media Engine] Manifest saved with {len(manifest)} active visuals: {manifest_path}\n", flush=True)
    return manifest

if __name__ == "__main__":
    from emergency_pool import EMERGENCY_RARE_POOL
    t = next(x for x in EMERGENCY_RARE_POOL if x["id"] == "sinking_car_door_physics")
    fetch_media_for_topic(t)
