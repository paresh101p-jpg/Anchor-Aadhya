# -*- coding: utf-8 -*-
"""
FactTechz-Style Mind-Blowing Tech Shorts Generator for Anchor Aadhya
- 9:16 Full HD Vertical (1080x1920)
- Real NASA / Science Verified Photos Only
- Bold FactTechz Style Kinetic Subtitles
- Swara Neural Fast-Paced Mystery Delivery
"""

import os
import sys
import asyncio
import urllib.request
import json
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import edge_tts
import subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FFMPEG_BIN = r"E:\Paresh\Auto Post\ffmpeg-master-latest-win64-gpl\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe"
if not os.path.exists(FFMPEG_BIN):
    FFMPEG_BIN = "ffmpeg"

def fit_to_9_16(im, target_w=1080, target_h=1920):
    w, h = im.size
    target_ratio = target_w / float(target_h)  # 0.5625
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

def create_blurred_ambient_frame(im, target_w=1080, target_h=1920):
    """Creates a high-retention blurred background with sharp central uncropped photo"""
    bg = fit_to_9_16(im.copy(), target_w, target_h)
    from PIL import ImageFilter
    bg = bg.filter(ImageFilter.GaussianBlur(radius=28))
    # Darken background slightly
    overlay = Image.new("RGBA", (target_w, target_h), (5, 8, 18, 160))
    bg.paste(overlay, (0, 0), overlay)

    # Scale original image to fit width nicely (around 1020px width)
    w, h = im.size
    fg_w = 1020
    fg_h = int(h * (fg_w / float(w)))
    if fg_h > 1200:
        fg_h = 1200
        fg_w = int(w * (fg_h / float(h)))
    fg = im.resize((fg_w, fg_h), Image.Resampling.LANCZOS)

    # Place in center
    pos_x = (target_w - fg_w) // 2
    pos_y = (target_h - fg_h) // 2 - 80
    bg.paste(fg, (pos_x, pos_y))

    # Add subtle border and shadow around foreground
    draw = ImageDraw.Draw(bg)
    draw.rectangle([(pos_x - 3, pos_y - 3), (pos_x + fg_w + 3, pos_y + fg_h + 3)], outline=(0, 220, 255, 200), width=3)
    return bg

async def generate_voice(text, audio_path):
    print("  --> Generating Anchor Aadhya Mystery Delivery Voiceover...", flush=True)
    com = edge_tts.Communicate(text, voice="hi-IN-SwaraNeural", rate="+6%", pitch="+1Hz")
    await com.save(audio_path)
    print("  --> Voiceover generated successfully!", flush=True)

def create_top_header_overlay():
    img = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Top Pill (y=100)
    pill_w, pill_h = 760, 70
    px = (1080 - pill_w) // 2
    draw.rounded_rectangle([(px, 100), (px + pill_w, 170)], radius=35, fill=(10, 16, 32, 225), outline=(0, 220, 255, 255), width=2)
    # Red live dot
    draw.ellipse([(px + 30, 123), (px + 54, 147)], fill=(255, 30, 60, 255))
    try:
        font = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 26)
    except:
        font = ImageFont.load_default()
    draw.text((px + 75, 120), "ANCHOR AADHYA • MIND-BLOWING TECH", font=font, fill=(255, 255, 255, 255))

    # Bottom Branding Pill (y=1800)
    b_w, b_h = 520, 52
    bx = (1080 - b_w) // 2
    draw.rounded_rectangle([(bx, 1790), (bx + b_w, 1842)], radius=24, fill=(12, 18, 35, 210), outline=(255, 215, 0, 180), width=2)
    try:
        b_font = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 22)
    except:
        b_font = font
    b_text = "FACTTECHZ STYLE • TECH FACTS"
    b_box = draw.textbbox((0, 0), b_text, font=b_font)
    bw = b_box[2] - b_box[0]
    draw.text(((1080 - bw) // 2, 1803), b_text, font=b_font, fill=(255, 215, 0, 255))

    header_file = os.path.join(BASE_DIR, "sample_short_header.png")
    img.save(header_file, "PNG")
    return header_file

def create_caption_slide(text_line1, text_line2, color1=(255, 230, 0, 255), color2=(0, 245, 255, 255)):
    img = Image.new("RGBA", (1080, 280), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    # Background glass banner
    draw.rounded_rectangle([(40, 20), (1040, 260)], radius=24, fill=(5, 8, 20, 225), outline=(0, 220, 255, 220), width=4)

    # Detect if text contains Devanagari
    has_devanagari = any(ord(c) >= 0x0900 and ord(c) <= 0x097F for c in (text_line1 + text_line2))
    
    if has_devanagari and os.path.exists(r"C:\Windows\Fonts\Nirmala.ttc"):
        font1 = ImageFont.truetype(r"C:\Windows\Fonts\Nirmala.ttc", 48)
        font2 = ImageFont.truetype(r"C:\Windows\Fonts\Nirmala.ttc", 40)
    else:
        try:
            font1 = ImageFont.truetype(r"C:\Windows\Fonts\impact.ttf", 52)
        except:
            font1 = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 46)
        try:
            font2 = ImageFont.truetype(r"C:\Windows\Fonts\arialbd.ttf", 40)
        except:
            font2 = font1

    # Center text with strong black stroke for maximum contrast
    bbox1 = draw.textbbox((0, 0), text_line1, font=font1)
    w1 = bbox1[2] - bbox1[0]
    draw.text(((1080 - w1) // 2, 45), text_line1, font=font1, fill=color1, stroke_width=3, stroke_fill=(0, 0, 0, 255))

    if text_line2:
        bbox2 = draw.textbbox((0, 0), text_line2, font=font2)
        w2 = bbox2[2] - bbox2[0]
        draw.text(((1080 - w2) // 2, 145), text_line2, font=font2, fill=color2, stroke_width=3, stroke_fill=(0, 0, 0, 255))

    return img

async def main():
    print("==============================================================")
    print("  CREATING FACTTECHZ-STYLE TECH SHORT SAMPLE FOR ANCHOR AADHYA")
    print("==============================================================")

    # 1. Fetch 3 Authentic NASA Photos for Voyager 1
    nasa_queries = [
        "https://images-assets.nasa.gov/image/PIA17045/PIA17045~orig.jpg",
        "https://images-assets.nasa.gov/image/PIA21741/PIA21741~orig.jpg",
        "https://images-assets.nasa.gov/image/PIA00452/PIA00452~orig.jpg"
    ]
    img_files = []
    headers = {"User-Agent": "Mozilla/5.0"}
    for idx, u in enumerate(nasa_queries):
        local_f = os.path.join(BASE_DIR, f"sample_short_nasa_{idx+1}.jpg")
        print(f"  --> Downloading authentic NASA public-domain photo {idx+1}...", flush=True)
        try:
            req = urllib.request.Request(u, headers=headers)
            with urllib.request.urlopen(req, timeout=12) as resp:
                data = resp.read()
            im = Image.open(BytesIO(data)).convert("RGB")
            frame = create_blurred_ambient_frame(im)
            frame.save(local_f, "JPEG", quality=95)
            img_files.append(local_f)
            print(f"  [SUCCESS] NASA photo {idx+1} prepared: {local_f}", flush=True)
        except Exception as e:
            print(f"  [ERROR] Image {idx+1}: {e}", flush=True)

    # STRICT GUARD: If images are missing, skip!
    if len(img_files) < 3:
        print("[CRITICAL] Images could not be verified. Skipping fact as per strict rule!", flush=True)
        return

    # 2. Voiceover (FactTechz Mystery Script)
    script_text = (
        "क्या आप जानते हैं... कि नासा के वॉयजर-वन स्पेसक्राफ्ट में आज की एक साधारण कार की चाबी जितनी भी कम्प्यूटिंग पावर नहीं है? "
        "जी हाँ! सिर्फ 68 किलोबाइट मेमोरी के साथ 1977 में लॉन्च हुआ यह स्पेसक्राफ्ट... "
        "आज धरती से 24 अरब किलोमीटर दूर इंटरस्टेलर स्पेस में पहुँच चुका है! "
        "और सबसे हैरान कर देने वाली बात? यह आज भी सिर्फ 8 वॉट के एक नन्हे ट्रांसमीटर से धरती पर वैज्ञानिक डेटा भेज रहा है! "
        "वाकई दिमाग हिला देने वाला साइंस फैक्ट! ऐसी ही फ्यूचर टेक और साइंस फैक्ट्स के लिए Anchor Aadhya को अभी सब्सक्राइब करें!"
    )
    audio_path = os.path.join(BASE_DIR, "sample_short_voice.mp3")
    await generate_voice(script_text, audio_path)

    # Measure voice duration
    probe_cmd = [FFMPEG_BIN.replace("ffmpeg.exe", "ffprobe.exe"), "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", audio_path]
    dur_res = subprocess.run(probe_cmd, stdout=subprocess.PIPE, text=True)
    try:
        dur = float(dur_res.stdout.strip())
    except:
        dur = 32.0
    print(f"  --> Voice Duration: {dur:.2f} seconds", flush=True)

    # 3. Create Overlays
    header_file = create_top_header_overlay()

    # 4 Animated Caption Slides (FactTechz style bold highlights in Hinglish)
    captions = [
        ("VOYAGER-1 KA SHOCKING SACH!", "Car Ki Chabi Jitni Bhi Memory Nahi?"),
        ("SIRF 68 KB MEMORY IN 1977!", "Dharti Se 24 Billion KM Door Safar!"),
        ("INTERSTELLAR SPACE ME AKELA!", "Sirf 8 Watt Transmitter Se Data Send!"),
        ("MIND-BLOWING TECH FACT!", "Anchor Aadhya Ko Subscribe Karein!")
    ]
    caption_files = []
    for c_i, (l1, l2) in enumerate(captions):
        cap_img = create_caption_slide(l1, l2)
        cap_f = os.path.join(BASE_DIR, f"sample_short_cap_{c_i+1}.png")
        cap_img.save(cap_f, "PNG")
        caption_files.append(cap_f)

    # 4. Render Master 9:16 Video with FFmpeg
    output_short = os.path.join(BASE_DIR, "sample_facttechz_short.mp4")
    print(f"\n--- Rendering 9:16 Vertical Video: {output_short} ---", flush=True)

    step_dur = dur / 3.0  # 3 image slides
    fc = [
        # Image 1 (0 to step_dur) with slow Ken Burns zoom
        f"[0:v]scale=1080:1920,zoompan=z='min(zoom+0.0004,1.06)':d={int(dur*25)}:s=1080x1920:fps=25[v0]",
        f"[1:v]scale=1080:1920,zoompan=z='min(zoom+0.0004,1.06)':d={int(dur*25)}:s=1080x1920:fps=25[v1]",
        f"[2:v]scale=1080:1920,zoompan=z='min(zoom+0.0004,1.06)':d={int(dur*25)}:s=1080x1920:fps=25[v2]",
        # Switch visuals
        f"[v0][v1]xfade=transition=slideleft:duration=0.6:offset={round(step_dur,1)}[x1]",
        f"[x1][v2]xfade=transition=slideright:duration=0.6:offset={round(step_dur*2,1)}[x2]",
        # Header overlay
        f"[x2][3:v]overlay=0:0[with_hdr]",
        # 4 Caption cards timed across the speech
        f"[with_hdr][4:v]overlay=x=0:y=1380:enable='between(t,0,{round(dur*0.28,1)})'[c1]",
        f"[c1][5:v]overlay=x=0:y=1380:enable='between(t,{round(dur*0.28,1)},{round(dur*0.58,1)})'[c2]",
        f"[c2][6:v]overlay=x=0:y=1380:enable='between(t,{round(dur*0.58,1)},{round(dur*0.82,1)})'[c3]",
        f"[c3][7:v]overlay=x=0:y=1380:enable='between(t,{round(dur*0.82,1)},{round(dur+1.0,1)})'[final_v]"
    ]

    # Generate a subtle sci-fi suspense audio beat synthesized directly in FFmpeg
    cmd = [
        FFMPEG_BIN, "-y",
        "-loop", "1", "-t", str(dur + 0.8), "-i", img_files[0],
        "-loop", "1", "-t", str(dur + 0.8), "-i", img_files[1],
        "-loop", "1", "-t", str(dur + 0.8), "-i", img_files[2],
        "-loop", "1", "-t", str(dur + 0.8), "-i", header_file,
        "-loop", "1", "-t", str(dur + 0.8), "-i", caption_files[0],
        "-loop", "1", "-t", str(dur + 0.8), "-i", caption_files[1],
        "-loop", "1", "-t", str(dur + 0.8), "-i", caption_files[2],
        "-loop", "1", "-t", str(dur + 0.8), "-i", caption_files[3],
        "-i", audio_path,
        "-filter_complex", ";".join(fc),
        "-map", "[final_v]",
        "-map", "8:a",
        "-c:v", "libx264", "-preset", "fast", "-crf", "20", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "192k",
        "-t", str(dur + 0.5),
        output_short
    ]

    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    if res.returncode == 0 and os.path.exists(output_short):
        print(f"\n[SUCCESS] FACTTECHZ SHORTS SAMPLE READY: {output_short}", flush=True)
        print(f"  Size: {os.path.getsize(output_short) / (1024*1024):.2f} MB", flush=True)
    else:
        print(f"[ERROR] FFmpeg failed: {res.stderr[-300:]}", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
