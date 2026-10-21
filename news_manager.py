# -*- coding: utf-8 -*-
"""
News & Wardrobe Asset Manager for Anchor Aadhya Channel
========================================================
LIVE RSS NEWS + GEMINI IMAGEN 3 ONLY — no stock photos, no URLs, zero copyright.
"""

import os, re, json, random, urllib.request, xml.etree.ElementTree as ET
from datetime import datetime, date
from io import BytesIO
from PIL import Image, ImageDraw

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARCHIVE_NEWS_FILE = os.path.join(BASE_DIR, "used_news_archive.json")
ARCHIVE_IMAGES_FILE = os.path.join(BASE_DIR, "used_images_archive.txt")

ANCHOR_LOOKS = [
    {"id":"look_1_crimson","name":"Crimson Power Blazer","file":os.path.join(BASE_DIR,"anchor_look_1_crimson.jpg"),"theme_color":(255,30,86,255),"style_desc":"Classic Prime Time Anchor"},
    {"id":"look_2_blue","name":"Royal Sapphire Blue","file":os.path.join(BASE_DIR,"anchor_look_2_blue.jpg"),"theme_color":(0,150,255,255),"style_desc":"Thoughtful Senior Tech Analyst"},
    {"id":"look_3_emerald","name":"Emerald Teal Blazer","file":os.path.join(BASE_DIR,"anchor_look_3_emerald.jpg"),"theme_color":(16,185,129,255),"style_desc":"Modern Innovation Host"},
    {"id":"look_4_black_gold","name":"Black Gold Blazer","file":os.path.join(BASE_DIR,"anchor_look_4_black_gold.jpg"),"theme_color":(245,158,11,255),"style_desc":"Dramatic Breaking News"},
    {"id":"look_5_lilac","name":"Lavender Lilac Blazer","file":os.path.join(BASE_DIR,"anchor_look_5_lilac.jpg"),"theme_color":(168,85,247,255),"style_desc":"Playful Humorous Tech"},
]

VOICE_PROFILES = {
    "dramatic":{"rate":"+4%","pitch":"+1Hz","desc":"Thrilling breaking tech"},
    "funny_masti":{"rate":"+2%","pitch":"+3Hz","desc":"Playful masti delivery"},
    "serious_caution":{"rate":"-5%","pitch":"-2Hz","desc":"Calm serious alert"},
    "inspirational_joy":{"rate":"+0%","pitch":"+1Hz","desc":"Warm inspiring news"},
}

def load_news_archive():
    if os.path.exists(ARCHIVE_NEWS_FILE):
        try:
            with open(ARCHIVE_NEWS_FILE,"r",encoding="utf-8") as f: return json.load(f)
        except: return []
    return []

def save_news_archive(archive):
    with open(ARCHIVE_NEWS_FILE,"w",encoding="utf-8") as f:
        json.dump(archive,f,ensure_ascii=False,indent=2)

def load_images_archive():
    if os.path.exists(ARCHIVE_IMAGES_FILE):
        try:
            with open(ARCHIVE_IMAGES_FILE,"r",encoding="utf-8") as f:
                return set(l.strip() for l in f if l.strip())
        except: return set()
    return set()

def append_image_archive(note):
    with open(ARCHIVE_IMAGES_FILE,"a",encoding="utf-8") as f: f.write(f"{note}\n")

def get_current_slot(explicit_slot=None):
    if explicit_slot in ["12PM","5PM"]: return explicit_slot
    return "12PM" if datetime.now().hour < 14 else "5PM"

def select_anchor_look(slot, dominant_emotion=None):
    day_num = datetime.now().toordinal()
    if dominant_emotion == "funny_masti": return ANCHOR_LOOKS[4]
    return ANCHOR_LOOKS[day_num % 5] if slot == "12PM" else ANCHOR_LOOKS[(day_num+2) % 5]

RSS_FEEDS = [
    "https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FtVnVHZ0pWVXlnQVAB?hl=en-US&gl=US&ceid=US:en",
    "https://techcrunch.com/feed/",
    "https://www.theverge.com/rss/index.xml",
    "https://www.technologyreview.com/feed/",
    "https://feeds.arstechnica.com/arstechnica/technology-lab",
    "https://www.wired.com/feed/rss",
]

def _clean_html(text):
    if not text: return ""
    text = re.sub(r"<[^>]+>"," ",text)
    for ent,ch in [("&amp;","&"),("&lt;","<"),("&gt;",">"),("&quot;",'"'),("&#39;","'"),("&nbsp;"," ")]:
        text = text.replace(ent,ch)
    return re.sub(r"\s+"," ",text).strip()[:500]

def fetch_live_top_news():
    articles, seen = [], set()
    for feed_url in RSS_FEEDS:
        try:
            req = urllib.request.Request(feed_url, headers={"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64)"})
            with urllib.request.urlopen(req, timeout=15) as resp: content = resp.read()
            try: root = ET.fromstring(content)
            except ET.ParseError:
                content = content.decode("utf-8",errors="replace").encode("utf-8")
                root = ET.fromstring(content)
            src = feed_url.split("/")[2].replace("www.","").replace("feeds.","")
            items = list(root.iter("item")) or list(root.iter("{http://www.w3.org/2005/Atom}entry"))
            for item in items:
                te = item.find("title") or item.find("{http://www.w3.org/2005/Atom}title")
                title = (te.text or "").strip() if te is not None else ""
                if not title or len(title) < 15: continue
                norm = title.lower()[:60]
                if norm in seen: continue
                seen.add(norm)
                de = item.find("description") or item.find("{http://www.w3.org/2005/Atom}summary")
                desc = _clean_html(de.text if de is not None else "")
                le = item.find("link") or item.find("{http://www.w3.org/2005/Atom}link")
                link = ((le.text or le.get("href","")) if le is not None else "").strip()
                articles.append({"title":title,"description":desc,"link":link,"source":src})
                if len(articles) >= 60: break
        except Exception as e:
            print(f"  [RSS] Skipped ({feed_url[:50]}): {e}", flush=True)
    print(f"  [RSS] {len(articles)} live articles fetched", flush=True)
    return articles

def generate_story_metadata_with_gemini(article):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key: return None
    prompt = f"""You are a Hindi/Hinglish tech news scriptwriter for "Anchor Aadhya" YouTube channel.
Convert this REAL tech news article into a structured Hinglish bulletin story.

Article Title: {article['title']}
Article Summary: {article.get('description','N/A')}
Source: {article.get('source','Tech News')}

OUTPUT ONLY raw JSON (no markdown, no code block):
{{
  "id": "short_unique_slug_underscores_max5words",
  "headline": "CATCHY HINGLISH HEADLINE ALL CAPS MAX 9 WORDS",
  "category": "CATEGORY 2-3 WORDS CAPS",
  "bullet1": "Key fact 1 Hinglish max 12 words",
  "bullet2": "Key fact 2 Hinglish max 12 words",
  "emotion": "dramatic or funny_masti or serious_caution or inspirational_joy",
  "speech": "120-160 word Hindi/Hinglish anchor broadcast script, natural conversational tone, audience engagement question at end",
  "ai_image_prompt": "SHOT 1 WIDE: Highly specific Gemini Imagen 3 English prompt — describe EXACT real-world scene from THIS story (exact colors, object/machine/device appearance, environment, action). Photojournalism cinematic lighting. NO text, NO watermarks.",
  "ai_image_prompt_2": "SHOT 2 MACRO: Extreme close-up Imagen 3 English prompt of the most interesting technical detail from THIS story. Photorealistic macro photography. NO text.",
  "badge_color": [R, G, B, 255]
}}"""
    try:
        from google import genai
        client = genai.Client(api_key=api_key)
        for model_name in ["gemini-2.0-flash","gemini-1.5-flash","gemini-1.5-pro"]:
            try:
                response = client.models.generate_content(model=model_name, contents=prompt)
                text = response.text.strip()
                if "```json" in text: text = text.split("```json")[1].split("```")[0].strip()
                elif "```" in text: text = text.split("```")[1].split("```")[0].strip()
                s,e = text.find("{"), text.rfind("}")+1
                if s >= 0 and e > s: text = text[s:e]
                story = json.loads(text)
                bc = story.get("badge_color",[220,38,38,255])
                story["badge_color"] = tuple(bc) if isinstance(bc,list) else (220,38,38,255)
                story["keywords"] = story.get("id","").replace("_"," ").split()
                print(f"  [GEMINI] '{story.get('headline','?')}' via {model_name}", flush=True)
                return story
            except json.JSONDecodeError as je:
                print(f"  [GEMINI] JSON error {model_name}: {je}", flush=True)
            except Exception as me:
                print(f"  [GEMINI] {model_name}: {me}", flush=True)
    except Exception as e:
        print(f"  [GEMINI] Fatal: {e}", flush=True)
    return None

def generate_ai_news_image(prompt, output_file, story_id=None, shot_idx=1):
    """
    ONLY Gemini Imagen 3 — zero stock photos, zero Unsplash, zero copyright risk.
    Fallback: dark tech gradient (not an external URL).
    """
    print(f"  --> [IMAGEN 3 | Shot {shot_idx}] \"{prompt[:70]}...\"", flush=True)
    if os.path.exists(output_file) and os.path.getsize(output_file) > 20000:
        print(f"  [SKIP] Exists: {os.path.basename(output_file)}", flush=True)
        return True
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("  [WARN] No GEMINI_API_KEY — dark gradient fallback", flush=True)
        _dark_gradient(output_file); return True
    enhanced = (
        f"Authentic editorial news photojournalism. {prompt}. "
        f"100% physically accurate real-world representation. Ultra-detailed commercial "
        f"photography, razor-sharp 8k focus, cinematic broadcast news lighting, natural "
        f"textures, no watermarks, no logos, no text overlays, no cartoon, no CGI art — "
        f"genuine real-world photograph by a professional photojournalist"
    )
    try:
        from google import genai
        from google.genai import types
        client = genai.Client(api_key=api_key)
        for model_name in ["imagen-3.0-generate-002","imagen-3.0-generate-001"]:
            try:
                response = client.models.generate_images(
                    model=model_name, prompt=enhanced,
                    config=types.GenerateImageConfig(number_of_images=1,output_mime_type="image/jpeg",aspect_ratio="16:9")
                )
                for gen_img in response.generated_images:
                    im = Image.open(BytesIO(gen_img.image.image_bytes)).convert("RGB").resize((1920,1080),Image.Resampling.LANCZOS)
                    im.save(output_file,"JPEG",quality=95)
                    append_image_archive(f"[Imagen3|Shot{shot_idx}] {prompt[:100]}")
                    print(f"  [SUCCESS] Saved: {os.path.basename(output_file)}", flush=True)
                    return True
            except Exception as img_e:
                print(f"  [IMAGEN] {model_name}: {img_e}", flush=True)
    except Exception as e:
        print(f"  [ERROR] Imagen fatal: {e}", flush=True)
    print(f"  [FALLBACK] Dark gradient (zero copyright)", flush=True)
    _dark_gradient(output_file)
    return True

def _dark_gradient(output_file):
    try:
        im = Image.new("RGB",(1920,1080))
        draw = ImageDraw.Draw(im)
        for y in range(1080):
            r = int(5+(y/1080)*15); g = int(10+(y/1080)*35); b = int(30+(y/1080)*80)
            draw.line([(0,y),(1920,y)],fill=(r,g,b))
        im.save(output_file,"JPEG",quality=88)
    except: Image.new("RGB",(1920,1080),(10,15,35)).save(output_file,"JPEG")

_STOP = {"the","a","an","is","are","was","were","in","on","at","to","for","of","and","or",
         "but","with","by","from","as","it","its","be","been","being","has","have","had",
         "do","does","did","will","would","can","could","may","might","new","now","just","also"}

def _kw(text):
    words = re.sub(r"[^\w\s]","",text.lower()).split()
    return set(w for w in words if w not in _STOP and len(w)>2)

def is_raw_article_duplicate(title, archive):
    tw = _kw(title)
    for e in archive:
        if len(tw & _kw(e.get("raw_title",e.get("headline","")))) >= 3: return True
    return False

def is_story_duplicate(story_id, headline, archive):
    sid = story_id.lower(); hw = _kw(headline)
    for e in archive:
        if e.get("id","").lower() == sid: return True
        if len(hw & _kw(e.get("headline",""))) >= 3: return True
    return False

def get_fresh_bulletin_stories(slot):
    """
    Full pipeline: live RSS → dedup → Gemini metadata → 4 fresh daily stories.
    All images will be Gemini Imagen 3 generated (called separately by pipeline).
    """
    archive = load_news_archive()
    print(f"\n[NEWS] Archive: {len(archive)} past stories", flush=True)
    # 30-day auto-reset
    if archive:
        try:
            oldest = min(e.get("timestamp","9999") for e in archive)
            if (date.today() - date.fromisoformat(oldest[:10])).days > 30:
                print("[ARCHIVE] 30-day reset — fresh cycle starting", flush=True)
                save_news_archive([]); archive = []
        except: pass
    print("\n[LIVE RSS] Fetching today's top tech news...", flush=True)
    raw = fetch_live_top_news()
    if not raw:
        print("[WARN] No live articles — check internet", flush=True)
        return []
    fresh = [a for a in raw if not is_raw_article_duplicate(a["title"], archive)]
    print(f"[DEDUP] {len(fresh)} fresh articles from {len(raw)} fetched", flush=True)
    random.shuffle(fresh)
    selected, used_ids = [], set()
    for article in fresh:
        if len(selected) >= 4: break
        print(f"\n  [PROCESSING] {article['title'][:75]}", flush=True)
        story = generate_story_metadata_with_gemini(article)
        if not story: continue
        sid = story.get("id",""); headline = story.get("headline","")
        if sid in used_ids or is_story_duplicate(sid, headline, archive):
            print(f"  [SKIP] Duplicate: {sid}", flush=True); continue
        story["raw_title"] = article["title"]
        story["source"] = article.get("source","")
        selected.append(story); used_ids.add(sid)
        print(f"  [ADDED] {len(selected)}/4: {headline}", flush=True)
    print(f"\n[DONE] {len(selected)} fresh stories ready", flush=True)
    return selected

def commit_bulletin_stories(slot, stories):
    archive = load_news_archive()
    today_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    for s in stories:
        archive.append({"id":s.get("id",""),"headline":s.get("headline",""),
                        "raw_title":s.get("raw_title",""),"keywords":s.get("keywords",[]),
                        "slot":slot,"timestamp":today_str})
    save_news_archive(archive)
    print(f"[ARCHIVE] Committed {len(stories)} stories — total: {len(archive)}", flush=True)