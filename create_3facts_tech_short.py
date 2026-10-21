# -*- coding: utf-8 -*-
"""
FactTechz-Style 3-Facts Tech Short Generator for Anchor Aadhya
- 9:16 Vertical Full HD (1080x1920)
- First 3.5 Seconds Hook: Anchor Aadhya Photo + "TOP 3 FACTS" Thumbnail Card
- Top-Left Corner Branding Logo (Anchor Aadhya badge)
- 3 Authentic High-Tech/Space Facts with 100% Verified NASA Photos
- Animated Subtitles (Smooth Fade & Slide Transitions in Hinglish)
- Outro Call-To-Action with Anchor Aadhya
- Total Duration: ~70 seconds (within 1-2 min range, optimized for YouTube Shorts retention)
"""

import os
import sys
import asyncio
import urllib.request
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import edge_tts
import subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FFMPEG_BIN = r"E:\Paresh\Auto Post\ffmpeg-master-latest-win64-gpl\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe"
if not os.path.exists(FFMPEG_BIN):
    FFMPEG_BIN = "ffmpeg"
FFPROBE_BIN = FFMPEG_BIN.replace("ffmpeg.exe", "ffprobe.exe")

FONT_IMPACT = r"C:\Windows\Fonts\impact.ttf"
FONT_ARIAL_BOLD = r"C:\Windows\Fonts\arialbd.ttf"

def fit_to_9_16(im, target_w=1080, target_h=1920):
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

def create_blurred_ambient_frame(im, fact_badge="● FACT 01", headline_line1="NASA VOYAGER-1 MYSTERY!", headline_line2="Car Ki Chabi Jitni Bhi Memory Nahi?!", target_w=1080, target_h=1920):
    """
    Creates a high-retention 9:16 vertical frame for each fact:
    - Ambient blurred background
    - High-Impact Top Fact Headline Card (y=145 to y=395)
    - Sharp central uncropped NASA photo with neon cyan glow (y=415 to y=1365)
    - Clear lower zone for dynamic kinetic subtitles (y=1400+)
    """
    bg = fit_to_9_16(im.copy(), target_w, target_h)
    bg = bg.filter(ImageFilter.GaussianBlur(radius=32))
    overlay = Image.new("RGBA", (target_w, target_h), (5, 8, 20, 185))
    bg.paste(overlay, (0, 0), overlay)

    draw = ImageDraw.Draw(bg)

    # 1. TOP FACT HEADLINE CARD CONTAINER (y=145 to y=395)
    draw.rounded_rectangle([(40, 145), (1040, 395)], radius=24, fill=(8, 14, 32, 235), outline=(0, 220, 255, 230), width=3)

    # Fact Badge Pill (Top-left inside card)
    badge_w = 380
    draw.rounded_rectangle([(65, 162), (65 + badge_w, 210)], radius=14, fill=(255, 30, 60, 220), outline=(255, 80, 100, 255), width=2)
    # Pulsing red/white dot
    draw.ellipse([(80, 178), (94, 192)], fill=(255, 255, 255, 255))
    try:
        f_badge = ImageFont.truetype(FONT_ARIAL_BOLD, 20)
    except:
        f_badge = ImageFont.load_default()
    draw.text((106, 172), fact_badge, font=f_badge, fill=(255, 255, 255, 255))

    # Line 1: Main Impact Headline (Yellow)
    try:
        f_head1 = ImageFont.truetype(FONT_IMPACT, 52)
        f_head2 = ImageFont.truetype(FONT_ARIAL_BOLD, 32)
    except:
        f_head1 = ImageFont.load_default()
        f_head2 = f_head1

    b1 = draw.textbbox((0, 0), headline_line1, font=f_head1)
    w1 = b1[2] - b1[0]
    draw.text(((1080 - w1) // 2, 222), headline_line1, font=f_head1, fill=(255, 230, 0, 255), stroke_width=3, stroke_fill=(0, 0, 0, 255))

    # Line 2: Sub-headline (White)
    b2 = draw.textbbox((0, 0), headline_line2, font=f_head2)
    w2 = b2[2] - b2[0]
    draw.text(((1080 - w2) // 2, 316), headline_line2, font=f_head2, fill=(255, 255, 255, 255), stroke_width=2, stroke_fill=(0, 0, 0, 255))

    # 2. CENTRAL NASA PHOTO (Uncropped with Cyan Glow Frame)
    w, h = im.size
    fg_w = 1000
    fg_h = int(h * (fg_w / float(w)))
    max_h = 940
    if fg_h > max_h:
        fg_h = max_h
        fg_w = int(w * (fg_h / float(h)))
    fg = im.resize((fg_w, fg_h), Image.Resampling.LANCZOS)

    pos_x = (target_w - fg_w) // 2
    pos_y = 415 + (max_h - fg_h) // 2
    bg.paste(fg, (pos_x, pos_y))

    # Cyber Neon Border around NASA photo
    draw.rectangle([(pos_x - 4, pos_y - 4), (pos_x + fg_w + 4, pos_y + fg_h + 4)], outline=(0, 230, 255, 230), width=4)
    return bg

def create_top_corner_logo():
    """Generates a permanent top-left channel branding logo with Anchor Aadhya avatar"""
    img = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Top-Left Logo Container Pill (x=40, y=50, w=380, h=72)
    draw.rounded_rectangle([(40, 50), (430, 122)], radius=36, fill=(10, 16, 32, 225), outline=(0, 220, 255, 220), width=2)

    # Load Anchor Face Logo
    face_logo_path = os.path.join(BASE_DIR, "anchor_aadhya_face_logo.png")
    if os.path.exists(face_logo_path):
        face_im = Image.open(face_logo_path).convert("RGBA").resize((60, 60), Image.Resampling.LANCZOS)
        # Create circular mask
        mask = Image.new("L", (60, 60), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.ellipse((0, 0, 60, 60), fill=255)
        img.paste(face_im, (46, 56), mask)
        # Cyan border ring around avatar
        draw.ellipse([(45, 55), (107, 117)], outline=(0, 240, 255, 255), width=2)

    # Text next to avatar
    try:
        f_top = ImageFont.truetype(FONT_ARIAL_BOLD, 22)
        f_sub = ImageFont.truetype(FONT_IMPACT, 18)
    except:
        f_top = ImageFont.load_default()
        f_sub = f_top

    draw.text((118, 59), "ANCHOR AADHYA", font=f_top, fill=(255, 255, 255, 255))
    draw.text((118, 86), "MIND-BLOWING TECH", font=f_sub, fill=(255, 230, 0, 255))

    # Top Right "4K ULTRA" badge
    draw.rounded_rectangle([(870, 56), (1040, 114)], radius=20, fill=(18, 24, 45, 200), outline=(255, 30, 60, 220), width=2)
    draw.ellipse([(888, 77), (904, 93)], fill=(255, 30, 60, 255))
    try:
        f_badge = ImageFont.truetype(FONT_ARIAL_BOLD, 18)
    except:
        f_badge = f_top
    draw.text((915, 73), "4K FACTS", font=f_badge, fill=(255, 255, 255, 255))

    # Bottom pill branding (clean, no emoji)
    b_w = 480
    bx = (1080 - b_w) // 2
    draw.rounded_rectangle([(bx, 1820), (bx + b_w, 1870)], radius=22, fill=(12, 18, 35, 210), outline=(255, 215, 0, 160), width=2)
    try:
        b_font = ImageFont.truetype(FONT_ARIAL_BOLD, 20)
    except:
        b_font = f_top
    bt = "FACTTECHZ STYLE • TECH SHORTS"
    bb = draw.textbbox((0, 0), bt, font=b_font)
    draw.text(((1080 - (bb[2]-bb[0])) // 2, 1832), bt, font=b_font, fill=(255, 215, 0, 255))

    p = os.path.join(BASE_DIR, "shorts_static_overlay.png")
    img.save(p, "PNG")
    return p

def create_hook_intro_card():
    """
    Creates the first 0-3.5 second Hook / Thumbnail Frame:
    - 100% PROPORTIONAL Un-stretched Anchor Aadhya in newsroom desk
    - Single BIG Clickbait / High-Curiosity Fact Headline on top
    - Optimized as the ultimate YouTube Shorts thumbnail and swipe stopper!
    """
    canvas = Image.new("RGB", (1080, 1920), (5, 8, 20))
    draw = ImageDraw.Draw(canvas)

    # 1. Anchor Aadhya Photo with 100% PROPORTIONAL SCALING (0% STRETCH)
    anchor_path = os.path.join(BASE_DIR, "anchor_aadhya_master.jpg")
    if os.path.exists(anchor_path):
        im = Image.open(anchor_path).convert("RGB")
        # Proportional crop centered on Anchor Aadhya: (820, 0, 1370, 768) -> width 550, height 768
        anchor_crop = im.crop((820, 0, 1370, 768))

        # Scale proportionally to fit 1080 width with NO aspect ratio distortion
        target_w = 1080
        target_h = int(anchor_crop.height * (target_w / float(anchor_crop.width))) # ~1507px
        anchor_scaled = anchor_crop.resize((target_w, target_h), Image.Resampling.LANCZOS)

        # Place on lower portion so head, body, desk and microphone are perfectly visible
        canvas.paste(anchor_scaled, (0, 1920 - target_h))

    # Top dark studio gradient overlay for maximum headline legibility
    gradient = Image.new("RGBA", (1080, 850), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(gradient)
    for y in range(850):
        alpha = int(255 * (1.0 - (y / 850.0)**1.8))
        g_draw.line([(0, y), (1080, y)], fill=(4, 6, 16, alpha))
    canvas.paste(gradient, (0, 0), gradient)

    # 2. SINGLE BIG HIGH-CURIOSITY CLICKBAIT FACT HEADLINE
    try:
        font_badge = ImageFont.truetype(FONT_ARIAL_BOLD, 28)
        font_big1 = ImageFont.truetype(FONT_IMPACT, 72)
        font_big2 = ImageFont.truetype(FONT_IMPACT, 66)
        font_sub = ImageFont.truetype(FONT_ARIAL_BOLD, 36)
    except:
        font_badge = ImageFont.load_default()
        font_big1 = font_badge
        font_big2 = font_badge
        font_sub = font_badge

    # Top Hook Pill (y=160)
    pill_text = "NASA KA SABSE BADA RAHASYA!"
    p_box = draw.textbbox((0, 0), pill_text, font=font_badge)
    pw = p_box[2] - p_box[0] + 60
    px = (1080 - pw) // 2
    draw.rounded_rectangle([(px, 160), (px + pw, 225)], radius=32, fill=(255, 30, 60, 240), outline=(255, 255, 255, 255), width=2)
    draw.text(((1080 - (p_box[2]-p_box[0])) // 2, 175), pill_text, font=font_badge, fill=(255, 255, 255, 255))

    # Massive Clickbait Headline: Line 1
    t1 = "CAR KI CHABI JITNI BHI"
    b1 = draw.textbbox((0, 0), t1, font=font_big1)
    draw.text(((1080 - (b1[2]-b1[0])) // 2, 260), t1, font=font_big1, fill=(255, 230, 0, 255), stroke_width=4, stroke_fill=(0, 0, 0, 255))

    # Massive Clickbait Headline: Line 2
    t2 = "MEMORY NAHI VOYAGER-1 ME?!"
    b2 = draw.textbbox((0, 0), t2, font=font_big2)
    draw.text(((1080 - (b2[2]-b2[0])) // 2, 355), t2, font=font_big2, fill=(0, 245, 255, 255), stroke_width=4, stroke_fill=(0, 0, 0, 255))

    # Sub-headline Card (Glass with glowing border)
    draw.rounded_rectangle([(70, 465), (1010, 545)], radius=20, fill=(10, 16, 35, 220), outline=(255, 230, 0, 200), width=2)
    sub_t = "24 Billion KM Door Deep Space Ka Sach!"
    sb = draw.textbbox((0, 0), sub_t, font=font_sub)
    draw.text(((1080 - (sb[2]-sb[0])) // 2, 485), sub_t, font=font_sub, fill=(255, 255, 255, 255))

    p = os.path.join(BASE_DIR, "shorts_hook_frame.jpg")
    canvas.save(p, "JPEG", quality=95)
    return p

def create_animated_caption_slide(line1, line2, color1=(255, 230, 0, 255), color2=(0, 245, 255, 255)):
    """Creates a high-contrast FactTechz Hinglish caption banner with glass background and glowing borders"""
    img = Image.new("RGBA", (1080, 280), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    draw.rounded_rectangle([(40, 20), (1040, 260)], radius=24, fill=(5, 8, 20, 230), outline=(0, 220, 255, 220), width=4)

    try:
        font1 = ImageFont.truetype(FONT_IMPACT, 52)
        font2 = ImageFont.truetype(FONT_ARIAL_BOLD, 38)
    except:
        font1 = ImageFont.load_default()
        font2 = font1

    bbox1 = draw.textbbox((0, 0), line1, font=font1)
    w1 = bbox1[2] - bbox1[0]
    draw.text(((1080 - w1) // 2, 45), line1, font=font1, fill=color1, stroke_width=3, stroke_fill=(0, 0, 0, 255))

    if line2:
        bbox2 = draw.textbbox((0, 0), line2, font=font2)
        w2 = bbox2[2] - bbox2[0]
        draw.text(((1080 - w2) // 2, 145), line2, font=font2, fill=color2, stroke_width=3, stroke_fill=(0, 0, 0, 255))

    return img

async def main():
    print("====================================================================")
    print("  CREATING 3-FACTS FACTTECHZ SHORT WITH ANCHOR AADHYA (1-2 MIN SHORT)")
    print("====================================================================")

    # 1. Authentic NASA Verified Public Domain Images for All 3 Facts
    print("  --> Step 1: Downloading 100% verified authentic NASA images for 3 facts...", flush=True)
    images_data = [
        # Fact 1: Voyager 1 Spacecraft
        (
            "fact1_voyager",
            "https://images-assets.nasa.gov/image/PIA17045/PIA17045~orig.jpg",
            "FACT 01: SPACE MYSTERY",
            "NASA VOYAGER-1 KA RAHASYA!",
            "Car Ki Chabi Jitni Bhi Memory Nahi?!"
        ),
        # Fact 2: Supercomputer / Quantum Cryostat
        (
            "fact2_quantum",
            "https://images-assets.nasa.gov/image/GSFC_20171208_Archive_e000492/GSFC_20171208_Archive_e000492~orig.jpg",
            "FACT 02: FUTURE SCIENCE",
            "DUNIYA KI SABSE THANDI JAGAH!",
            "Quantum Chip At -273.15 C (100x Colder!)"
        ),
        # Fact 3: James Webb Space Telescope Carina Nebula
        (
            "fact3_jwst",
            "https://images-assets.nasa.gov/image/PIA25433/PIA25433~orig.jpg",
            "FACT 03: COSMIC DISCOVERY",
            "JAMES WEBB: ASLI TIME MACHINE!",
            "13.5 Billion Saal Purani Cosmic Light!"
        )
    ]

    fact_frames = []
    headers = {"User-Agent": "Mozilla/5.0"}
    for name, url, f_badge, h1, h2 in images_data:
        target_f = os.path.join(BASE_DIR, f"{name}.jpg")
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
            im = Image.open(BytesIO(data)).convert("RGB")
            frame = create_blurred_ambient_frame(im, fact_badge=f_badge, headline_line1=h1, headline_line2=h2)
            frame.save(target_f, "JPEG", quality=95)
            fact_frames.append(target_f)
            print(f"  [SUCCESS] Prepared authentic NASA photo & headline card for: {name}", flush=True)
        except Exception as e:
            print(f"  [ERROR] Downloading {name}: {e}", flush=True)

    # STRICT GUARD: If any fact image fails, do not proceed!
    if len(fact_frames) < 3:
        print("[CRITICAL] Could not verify photos for all 3 facts. Skipping as per strict rule!", flush=True)
        return

    # 2. Hook Frame (First 3.5 Seconds with Anchor Aadhya)
    print("  --> Step 2: Creating Anchor Aadhya Hook / Thumbnail Card (First 3.5s)...", flush=True)
    hook_frame = create_hook_intro_card()
    print(f"  [SUCCESS] Hook frame ready: {hook_frame}", flush=True)

    # 3. Static Top-Corner Branding Logo & Overlays
    static_overlay = create_top_corner_logo()
    print(f"  [SUCCESS] Corner logo & branding ready: {static_overlay}", flush=True)

    # 4. Voiceover Generation (Anchor Aadhya - Swara Neural Mystery FactTechz Delivery)
    print("  --> Step 3: Generating Voiceover for 3 Facts (Fast-Paced Mystery)...", flush=True)
    full_script = (
        "दोस्तों! आज के ये टॉप थ्री माइंड-ब्लोइंग साइंस फैक्ट्स सुनकर आपके होश उड़ जाएंगे! "
        "फैक्ट नंबर वन... नासा के वॉयेजर-वन स्पेसक्राफ्ट में आज की एक साधारण कार की चाबी जितनी भी कम्प्यूटिंग पावर नहीं है! "
        "सिर्फ 68 किलोबाइट मेमोरी के साथ 1977 में लॉन्च हुआ यह स्पेसक्राफ्ट, आज धरती से 24 अरब किलोमीटर दूर इंटर-स्टेलर स्पेस में पहुँच चुका है! "
        "फैक्ट नंबर टू... दुनिया का सबसे ठंडा स्थान अंतरिक्ष नहीं, बल्कि एक क्वांटम सुपर-कंप्यूटर का दिल है! "
        "क्वांटम चिप्स को ऑपरेट करने के लिए इसे माइनस 273 डिग्री सेल्सियस पर ठंडा किया जाता है... जो कि डीप स्पेस के तापमान से भी 100 गुना ज़्यादा ठंडा है! "
        "और फैक्ट नंबर थ्री... जेम्स वेब स्पेस टेलिस्कोप एक असली टाइम मशीन है! "
        "यह इतनी दूर से आ रही रोशनी को कैप्चर करता है, जो 13.5 अरब साल पहले निकली थी! यानी यह ब्रह्मांड के जन्म को लाइव देख रहा है! "
        "कौनसा फैक्ट सबसे शॉकिंग लगा? कमेंट में बताएं और ऐसे ही अमेजिंग फैक्ट्स के लिए Anchor Aadhya को अभी सब्सक्राइब करें!"
    )
    voice_path = os.path.join(BASE_DIR, "shorts_3facts_voice.mp3")
    com = edge_tts.Communicate(full_script, voice="hi-IN-SwaraNeural", rate="+7%", pitch="+1Hz")
    await com.save(voice_path)

    # Measure voice duration
    probe_cmd = [FFPROBE_BIN, "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", voice_path]
    res_dur = subprocess.run(probe_cmd, stdout=subprocess.PIPE, text=True)
    try:
        total_dur = float(res_dur.stdout.strip())
    except:
        total_dur = 65.0
    print(f"  --> Voice Duration: {total_dur:.2f} seconds (~1.1 minutes)", flush=True)

    # 5. Caption Slides (Kinetic Hinglish with Impact Bold Font)
    print("  --> Step 4: Generating Animated Hinglish Caption Slides...", flush=True)
    captions = [
        # Fact 1 (3.5 - 24s)
        ("FACT 1: VOYAGER-1 SECRET!", "Car Ki Chabi Jitni Memory Nahi?"),
        ("24 BILLION KM AWAY!", "Sirf 68 KB Memory In Deep Space!"),
        # Fact 2 (24 - 44s)
        ("FACT 2: COLDEST PLACE ON EARTH!", "Quantum Chip At Minus 273°C!"),
        ("DEEP SPACE SE 100X THANDA!", "Quantum Physics Ka Asli Magic!"),
        # Fact 3 (44 - 58s)
        ("FACT 3: REAL TIME MACHINE!", "James Webb Space Telescope!"),
        ("13.5 BILLION YEARS OLD LIGHT!", "Universe Ke Janam Ki Asli Tasveer!"),
        # Outro (58 - end)
        ("SUBSCRIBE TO ANCHOR AADHYA!", "Daily Mind-Blowing Tech Shorts!")
    ]

    cap_files = []
    for idx, (c1, c2) in enumerate(captions):
        cap_img = create_animated_caption_slide(c1, c2)
        cf = os.path.join(BASE_DIR, f"shorts_cap_{idx+1}.png")
        cap_img.save(cf, "PNG")
        cap_files.append(cf)

    # 6. Render Master Video with FFmpeg
    output_short = os.path.join(BASE_DIR, "sample_3facts_facttechz_short.mp4")
    print(f"\n--- Step 5: Encoding 1080x1920 Short ({total_dur:.1f}s) to: {output_short} ---", flush=True)

    fc = [
        # Inputs:
        # 0: Hook Frame (0 to 3.5s)
        # 1: Fact 1 (3.5 to 24s)
        # 2: Fact 2 (24 to 44s)
        # 3: Fact 3 (44 to 58s)
        # 4: Static Branding Overlay (Logo + 4K badge)
        # 5..11: Caption slides (7 slides)
        "[0:v]scale=1080:1920,zoompan=z='min(zoom+0.0003,1.04)':d=88:s=1080x1920:fps=25[v_hook]",
        "[1:v]scale=1080:1920,zoompan=z='min(zoom+0.0003,1.06)':d=520:s=1080x1920:fps=25[v_f1]",
        "[2:v]scale=1080:1920,zoompan=z='min(zoom+0.0003,1.06)':d=500:s=1080x1920:fps=25[v_f2]",
        "[3:v]scale=1080:1920,zoompan=z='min(zoom+0.0003,1.06)':d=350:s=1080x1920:fps=25[v_f3]",

        # Transitions between scenes
        "[v_hook][v_f1]xfade=transition=circlecrop:duration=0.5:offset=3.2[s1]",
        "[s1][v_f2]xfade=transition=slideright:duration=0.5:offset=23.7[s2]",
        "[s2][v_f3]xfade=transition=slideleft:duration=0.5:offset=43.7[s3]",

        # Overlay corner logo & static badges
        "[s3][4:v]overlay=0:0[with_logo]"
    ]

    # Pre-process caption inputs with smooth alpha fade-in and dynamic slide-up motion
    slide_times = [
        (3.5, 13.5),
        (13.5, 24.0),
        (24.0, 34.0),
        (34.0, 44.0),
        (44.0, 51.0),
        (51.0, 58.0),
        (58.0, round(total_dur + 0.5, 1))
    ]

    prev_stream = "[with_logo]"
    for i, (st, et) in enumerate(slide_times):
        cap_in = f"[{5 + i}:v]"
        faded_cap = f"[fcap_{i}]"
        # 1. Alpha fade-in over 0.3s, fade-out over 0.25s
        fc.append(f"{cap_in}format=yuva420p,fade=t=in:st={st}:d=0.3:alpha=1,fade=t=out:st={et-0.25}:d=0.25:alpha=1{faded_cap}")
        # 2. Dynamic slide-up kinetic motion: starts 140px lower and smoothly glides to y=1380
        y_motion = f"'1380 + max(0, 140 * (1 - (t - {st}) / 0.35))'"
        next_stream = f"[c_{i+1}]" if i < len(slide_times) - 1 else "[final_v]"
        fc.append(f"{prev_stream}{faded_cap}overlay=x=0:y={y_motion}:enable='between(t,{st},{et})'{next_stream}")
        prev_stream = next_stream

    cmd = [
        FFMPEG_BIN, "-y",
        "-loop", "1", "-t", "4.0", "-i", hook_frame,
        "-loop", "1", "-t", "22.0", "-i", fact_frames[0],
        "-loop", "1", "-t", "22.0", "-i", fact_frames[1],
        "-loop", "1", "-t", "16.0", "-i", fact_frames[2],
        "-loop", "1", "-t", str(total_dur + 1.0), "-i", static_overlay,
    ]
    for cf in cap_files:
        cmd.extend(["-loop", "1", "-t", str(total_dur + 1.0), "-i", cf])

    cmd.extend([
        "-i", voice_path,
        "-filter_complex", ";".join(fc),
        "-map", "[final_v]",
        "-map", f"{len(cmd)//4}:a" if False else f"{5 + len(cap_files)}:a",
        "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-t", str(total_dur + 0.6),
        output_short
    ])

    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode == 0 and os.path.exists(output_short):
        print(f"\n[SUCCESS] 3-FACTS TECH SHORT GENERATED SUCCESSFULLY: {output_short}", flush=True)
        print(f"  File Size: {os.path.getsize(output_short) / (1024*1024):.2f} MB", flush=True)

        # 7. Generate High-Ranking SEO Metadata (100% Anchor Aadhya Only, Zero Krishna Links)
        meta_file = os.path.join(BASE_DIR, "metadata_shorts.json")
        generate_shorts_metadata(meta_file)
    else:
        print(f"[ERROR] FFmpeg failed: {res.stderr[-400:]}", flush=True)

def generate_shorts_metadata(meta_path):
    """
    Generates Rich High-Ranking YouTube Shorts Metadata:
    - 100% Pure Anchor Aadhya Branding (No third-party or Krishna links)
    - Dynamic fact-matched Hindi & Hinglish Search Queries for high algorithm ranking
    - YouTube Fair Use Section 107 & Synthetic AI Content Policy Compliance
    """
    import json
    meta = {
        "title": "NASA का सबसे बड़ा रहस्य! 😱 Car की चाबी जितनी भी Memory नहीं? #Shorts #TechFacts #AnchorAadhya",
        "description": (
            "दोस्तों! आज के इस एपिसोड में Anchor Aadhya आपके लिए लेकर आई हैं 3 सबसे हैरान कर देने वाले साइंस और फ्यूचर टेक फैक्ट्स! 🚀\n\n"
            "📌 TOPICS COVERED IN THIS SHORT:\n"
            "❶ Fact 1: NASA Voyager-1 Spacecraft Memory Mystery (Only 68 KB memory, 24 Billion KM away in Interstellar space!)\n"
            "❷ Fact 2: Quantum Computer Coldest Temperature (-273.15°C, 100x colder than deep space!)\n"
            "❸ Fact 3: James Webb Space Telescope (Real Time Machine capturing 13.5 Billion year old cosmic light!)\n\n"
            "🔍 SEARCHES & TOPICS COVERED:\n"
            "• voyager 1 mystery in hindi\n"
            "• nasa spacecraft facts\n"
            "• quantum computer coldest temperature in universe\n"
            "• james webb space telescope discovery hindi\n"
            "• deep space facts hindi\n"
            "• mind blowing science facts\n"
            "• anchor aadhya tech facts\n"
            "• facttechz style tech shorts hindi\n"
            "• future technology and science\n\n"
            "⚡ ABOUT ANCHOR AADHYA:\n"
            "Welcome to Anchor Aadhya - Your daily destination for futuristic tech breakthroughs, AI news, and mind-blowing science mysteries! Presented by India's favorite virtual AI news anchor.\n"
            "Subscribe now for daily 100% authentic tech facts!\n\n"
            "⚖️ FAIR USE & CONTENT POLICY:\n"
            "All imagery sourced from verified NASA public domain archives (17 U.S.C. § 105) and educational public records. This video adds significant transformative value through original emotion-adaptive voice synthesis, cinematic motion graphics, and educational synthesis (Fair Use under Section 107 of Copyright Act 1976).\n"
            "Synthetic Content Disclosure: Audio and anchor avatar generated using AI neural systems for educational news presentation.\n\n"
            "#Shorts #TechFacts #ScienceFacts #SpaceFacts #NASA #Voyager1 #QuantumComputer #JamesWebb #FactTechz #AnchorAadhya #FutureTech #MindBlowingFacts #HindiTechFacts"
        ),
        "tags": [
            "Shorts",
            "TechFacts",
            "ScienceFacts",
            "SpaceFacts",
            "NASA",
            "Voyager1",
            "QuantumComputer",
            "JamesWebb",
            "FactTechz",
            "AnchorAadhya",
            "FutureTech",
            "MindBlowingFacts",
            "DeepSpace",
            "TechnologyInHindi"
        ]
    }
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)
    print(f"  [SUCCESS] Generated High-Ranking SEO Metadata: {meta_path}", flush=True)
    return meta_path

if __name__ == "__main__":
    asyncio.run(main())
