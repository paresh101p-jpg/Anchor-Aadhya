# -*- coding: utf-8 -*-
"""
Anchor Aadhya - Autonomous Visual Verification & AI Generation Engine
STRICT USER RULES:
1. News and facts must be thoroughly analyzed.
2. Every candidate image and video must be analyzed and inspected with Gemini Vision.
3. If an image or video does NOT match the news or fact -> DO NOT ADD IT (DISCARD IT)!
4. If it doesn't match or is missing -> Check full news/fact details, generate a 100%
   matched AI image specifically for that topic, and add that!
"""

import os
import sys
import json
import base64
import re
import time
import random
import subprocess
import urllib.request
import urllib.parse
from io import BytesIO
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FFMPEG_BIN = r"E:\Paresh\Auto Post\ffmpeg-master-latest-win64-gpl\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe"
if not os.path.exists(FFMPEG_BIN):
    FFMPEG_BIN = "ffmpeg"


def get_gemini_api_key():
    key = os.environ.get("GEMINI_API_KEY", "").strip()
    if key:
        return key
    for candidate in [
        os.path.join(BASE_DIR, "gemini_key.txt"),
        os.path.join(os.path.dirname(BASE_DIR), "Auto-Insta-Krishna", "gemini_key.txt")
    ]:
        if os.path.exists(candidate):
            try:
                k = open(candidate, "r", encoding="utf-8").read().strip()
                if k:
                    return k
            except Exception:
                pass
    return ""


def call_gemini_vision(prompt, image_path):
    """
    Calls Gemini Vision model via REST API to analyze an image.
    Tries active models with fallback (gemini-3.5-flash, gemini-3.8-flash, etc.).
    Returns raw JSON text or None.
    """
    key = get_gemini_api_key()
    if not key or not os.path.exists(image_path):
        return None

    try:
        # Resize image for faster upload & processing if excessively large
        im = Image.open(image_path).convert("RGB")
        w, h = im.size
        if max(w, h) > 1280:
            ratio = 1280.0 / max(w, h)
            im = im.resize((int(w * ratio), int(h * ratio)), Image.Resampling.LANCZOS)
        buf = BytesIO()
        im.save(buf, format="JPEG", quality=85)
        b64_data = base64.b64encode(buf.getvalue()).decode("utf-8")
    except Exception as e:
        print(f"  [VERIFY ERROR] Could not read image: {e}", flush=True)
        return None

    models = [
        "gemini-3.5-flash",
        "gemini-3.8-flash",
        "gemini-3.7-flash",
        "gemini-3.1-flash-lite",
        "gemini-2.5-flash-lite"
    ]

    import requests

    for model in models:
        url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}"
        payload = {
            "contents": [{
                "parts": [
                    {"text": prompt},
                    {"inline_data": {"mime_type": "image/jpeg", "data": b64_data}}
                ]
            }],
            "generationConfig": {
                "response_mime_type": "application/json"
            }
        }
        try:
            resp = requests.post(url, json=payload, timeout=20)
            if resp.status_code == 200:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates:
                    parts = candidates[0].get("content", {}).get("parts", [])
                    if parts and "text" in parts[0]:
                        return parts[0]["text"].strip()
            else:
                continue
        except Exception:
            continue

    return None


def verify_image_matches(image_path, topic_title, topic_details=""):
    """
    Analyzes whether an image accurately represents the specific news story or fact.
    Returns: (matches: bool, reason: str, detected_subject: str)
    """
    if not os.path.exists(image_path) or os.path.getsize(image_path) < 8000:
        return False, "File missing or too small (<8KB)", "unknown"

    prompt = f"""You are a strict news editor, broadcast director, and scientific fact-checker for Anchor Aadhya news channel.

NEWS/FACT TOPIC TITLE: {topic_title}
DETAILS / CONTEXT: {topic_details[:450]}

Carefully inspect the provided image:
Does this image directly, authentically, and accurately represent the subject matter of this news or fact?

STRICT REJECTION RULES (matches MUST be false):
1. REJECT if it is a photo or portrait of a news anchor, presenter, TV studio desk, or generic journalist.
2. REJECT if it is a headshot/selfie of an author/reporter when the news is about technology, corporate development, or science.
3. REJECT if it is a generic website logo, app icon, watermarked advertisement banner, or generic corporate building when the story is about a specific tech/product/discovery.
4. REJECT if the subject is from a completely different topic (e.g., a space rocket/Starship for a banking, AI software, or battery story; or a car for a medical/chip story).
5. REJECT if it is generic, ambiguous stock footage (e.g. smiling person looking at a blank laptop screen, generic hand holding smartphone).

ACCEPT RULES (matches is true):
- Image clearly and recognizably displays the actual product, technology, hardware, vehicle, company subject, scientific discovery, celestial body, or real-world phenomenon described in this news/fact.

Respond STRICTLY with valid JSON:
{{
  "matches": true or false,
  "subject_detected": "brief description of what is actually shown in the image",
  "reason": "concise explanation of why it matches or fails"
}}"""

    res_text = call_gemini_vision(prompt, image_path)
    if not res_text:
        print("  [VERIFY WARN] Vision check unavailable, erring on side of caution (False)", flush=True)
        return False, "Vision analysis unavailable", "unverified"

    try:
        clean = res_text.strip()
        if "```json" in clean:
            clean = clean.split("```json")[1].split("```")[0].strip()
        elif "```" in clean:
            clean = clean.split("```")[1].split("```")[0].strip()
        s, e = clean.find("{"), clean.rfind("}") + 1
        if s >= 0 and e > s:
            clean = clean[s:e]
        data = json.loads(clean)
        matches = bool(data.get("matches", False))
        reason = str(data.get("reason", ""))
        subject = str(data.get("subject_detected", ""))
        return matches, reason, subject
    except Exception as je:
        print(f"  [VERIFY WARN] JSON parse error: {je} ({res_text[:80]})", flush=True)
        return False, "Failed to parse vision response", "unknown"


def verify_video_matches(video_path, topic_title, topic_details="", sample_time=2.0):
    """
    Extracts a representative sample frame from candidate video and verifies
    if the video content genuinely matches the news/fact.
    Returns: (matches: bool, reason: str, detected_subject: str)
    """
    if not os.path.exists(video_path) or os.path.getsize(video_path) < 50000:
        return False, "Video missing or too small (<50KB)", "unknown"

    temp_frame = os.path.join(BASE_DIR, f"temp_frame_verify_{random.randint(100, 999)}.jpg")
    try:
        cmd = [
            FFMPEG_BIN, "-y",
            "-ss", str(sample_time),
            "-i", video_path,
            "-vframes", "1",
            "-q:v", "2",
            temp_frame
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if not os.path.exists(temp_frame) or os.path.getsize(temp_frame) < 5000:
            # Try at 0.5s if 2.0s failed
            cmd[2] = "0.5"
            subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        if os.path.exists(temp_frame) and os.path.getsize(temp_frame) > 5000:
            matches, reason, subject = verify_image_matches(temp_frame, topic_title, topic_details)
            return matches, reason, subject
        else:
            return False, "Could not extract video frame", "unknown"
    finally:
        if os.path.exists(temp_frame):
            try:
                os.remove(temp_frame)
            except Exception:
                pass


def fit_image(im, target_w=1920, target_h=1080):
    """Proportionally cover-crops image to exact target dimensions without stretching"""
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
    return im.resize((target_w, target_h), Image.Resampling.LANCZOS)


def generate_ai_photorealistic_image(prompt, output_path, width=1920, height=1080):
    """
    Generates a high-resolution, photorealistic AI image tailored to the exact prompt.
    Uses Pollinations model=sana with automated rate-limit detection and cooldown retry.
    """
    enhanced_prompt = (
        f"Authentic editorial photojournalism. {prompt}. "
        f"Ultra-detailed 8k commercial photography, cinematic lighting, authentic physical textures, "
        f"sharp focus, no watermarks, no text, no typography, no logo, no cartoon, no CGI, "
        f"professional editorial photojournalism."
    )

    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    import requests

    for attempt in range(3):
        try:
            seed = random.randint(1000, 9999999)
            enc = urllib.parse.quote(enhanced_prompt)
            url = f"https://image.pollinations.ai/prompt/{enc}?model=sana&width={width}&height={height}&nologo=true&seed={seed}"
            resp = requests.get(url, headers=headers, timeout=40)

            if resp.status_code == 200 and len(resp.content) > 15000:
                im = Image.open(BytesIO(resp.content)).convert("RGB")
                im = fit_image(im, width, height)
                im.save(output_path, "JPEG", quality=95)
                print(f"  [AI GENERATED SUCCESS] Saved ({width}x{height}): {os.path.basename(output_path)}", flush=True)
                return True
            elif resp.status_code == 402:
                # Rate limit encountered
                err_text = resp.text
                wait_sec = 25
                wait_match = re.search(r'Retry after (\d+)s', err_text)
                if wait_match:
                    wait_sec = int(wait_match.group(1)) + 2
                print(f"  [AI GENERATE RATE LIMIT] Waiting {wait_sec}s cooldown...", flush=True)
                time.sleep(min(wait_sec, 35))
            else:
                print(f"  [AI GENERATE WARN] HTTP {resp.status_code}: {resp.text[:80]}", flush=True)
                time.sleep(3)
        except Exception as e:
            print(f"  [AI GENERATE WARN] Attempt {attempt+1} failed: {e}", flush=True)
            time.sleep(2)

    return False


def search_and_verify_editorial_photo(search_query, output_path, topic_title, topic_details="", target_w=1920, target_h=1080, shot_idx=1):
    """
    Searches Wikimedia Commons specifically for the topic entity.
    STRICT USER RULE: Only accepts an image if Gemini Vision confirms it genuinely matches the topic!
    NEVER uses generic fallback queries like SpaceX Starship or Netflix.
    """
    clean_q = re.sub(r"[^a-zA-Z0-9\s]", " ", search_query).strip()
    words = [w for w in clean_q.split() if len(w) > 2]
    if not words:
        return False

    headers = {"User-Agent": "AnchorAadhyaNews/2.0 (Mozilla/5.0; Windows NT 10.0; Win64; x64)"}
    # Formulate precise search term (max 4 key words)
    search_term = " ".join(words[:4])
    print(f"  --> [SEARCH EDITORIAL | Shot {shot_idx}] Query: '{search_term}'...", flush=True)

    temp_cand = output_path + f".cand_{random.randint(100,999)}.jpg"
    try:
        url = "https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrsearch=" + urllib.parse.quote(search_term) + "&gsrlimit=4&prop=imageinfo&iiprop=url|size"
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=12) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        pages = data.get("query", {}).get("pages", {})

        for pid, p in pages.items():
            ii = p.get("imageinfo", [{}])[0]
            img_url = ii.get("url", "")
            if not img_url or not any(ext in img_url.lower() for ext in [".jpg", ".jpeg", ".png"]):
                continue

            try:
                dl_req = urllib.request.Request(img_url, headers=headers)
                with urllib.request.urlopen(dl_req, timeout=15) as dl_resp:
                    img_bytes = dl_resp.read()
                if len(img_bytes) < 15000:
                    continue

                im = Image.open(BytesIO(img_bytes)).convert("RGB")
                if shot_idx == 2:
                    w_im, h_im = im.size
                    cx, cy = w_im // 2, h_im // 2
                    cw, ch = int(w_im * 0.60), int(h_im * 0.60)
                    im = im.crop((cx - cw//2, cy - ch//2, cx + cw//2, cy + ch//2))
                im = fit_image(im, target_w, target_h)
                im.save(temp_cand, "JPEG", quality=95)

                # STRICT VERIFICATION: Does this image actually match the topic?
                matches, reason, subject = verify_image_matches(temp_cand, topic_title, topic_details)
                if matches:
                    import shutil
                    shutil.move(temp_cand, output_path)
                    print(f"  [EDITORIAL VERIFIED SUCCESS] Matches topic '{topic_title[:40]}': {subject}", flush=True)
                    return True
                else:
                    print(f"  [REJECTED CANDIDATE] Does not match topic: {reason} (Subject: {subject})", flush=True)
            except Exception as de:
                print(f"  [CANDIDATE ERROR] {de}", flush=True)
                continue
    except Exception as e:
        print(f"  [SEARCH WARN] Query search failed: {e}", flush=True)
    finally:
        if os.path.exists(temp_cand):
            try:
                os.remove(temp_cand)
            except Exception:
                pass

    return False
