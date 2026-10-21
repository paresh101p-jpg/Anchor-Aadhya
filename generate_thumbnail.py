# -*- coding: utf-8 -*-
"""
Dynamic High-CTR YouTube Thumbnail Generator for Anchor Aadhya News Channel
- 1280x720 Full HD 16:9 Thumbnail
- 100% Pure Hinglish Viral Typography
- 100% Mathematically Preserved Aspect Ratio (Zero Facial Stretching/Distortion)
- Dynamic Anchor Wardrobe (Crimson, Royal Blue, Emerald, Black/Gold, Lilac)
- Dynamic News Background matching Story 1
- Dynamic Slot Pill (12 PM SPECIAL / 5 PM PRIME)
"""

import os
import sys
from datetime import datetime
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def get_font(size, bold=True):
    font_paths = [
        r"C:\Windows\Fonts\impact.ttf",
        r"C:\Windows\Fonts\segoeuib.ttf",
        r"C:\Windows\Fonts\arialbd.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
    ] if bold else [
        r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()

def create_youtube_thumbnail(
    anchor_img_path=None,
    news_bg_path=None,
    slot="5PM",
    top_badge=None,
    date_str=None,
    headline_yellow="TESLA MEIN ROCKET!",
    sub_headline_cyan="10,000 ROBOTS AAYE!",
    callout_tag="AI DRONE NE PILOT KO HARAYA!",
    bullets=None,
    output_path=None
):
    if not anchor_img_path or not os.path.exists(anchor_img_path):
        anchor_img_path = os.path.join(BASE_DIR, "anchor_look_1_crimson.jpg")
        if not os.path.exists(anchor_img_path):
            anchor_img_path = os.path.join(BASE_DIR, "anchor_aadhya_master.jpg")

    if news_bg_path and not os.path.exists(news_bg_path):
        news_bg_path = None

    today_slug = datetime.now().strftime("%Y-%m-%d")
    if not date_str:
        date_str = datetime.now().strftime("%d %b %Y").upper()
    if not top_badge:
        top_badge = "DAILY TECH SPECIAL"
    if not output_path:
        output_path = os.path.join(BASE_DIR, f"Thumbnail_{today_slug}_{slot}.jpg")

    if not bullets or len(bullets) < 3:
        bullets = [
            "AI Drone Ne 100 KM/H Race Jeeti",
            "Tesla Mein Lage SpaceX Ke Real Thrusters",
            "Max Planck Ka Unhackable Quantum Net"
        ]

    W, H = 1280, 720
    canvas = Image.new("RGB", (W, H), (10, 14, 25))

    # 1. Left Background (News Highlight or High-Tech Gradient)
    if news_bg_path and os.path.exists(news_bg_path):
        try:
            bg = Image.open(news_bg_path).convert("RGB").resize((760, H), Image.Resampling.LANCZOS)
            enhancer = ImageEnhance.Brightness(bg)
            bg = enhancer.enhance(0.42)
            canvas.paste(bg, (0, 0))
        except Exception as e:
            print(f"Warning loading news bg: {e}", flush=True)
    else:
        # High-tech cyber gradient background
        draw_bg = ImageDraw.Draw(canvas)
        for y in range(H):
            ratio = y / H
            r = int(12 + ratio * 15)
            g = int(18 + ratio * 20)
            b = int(45 + ratio * 40)
            draw_bg.line([(0, y), (760, y)], fill=(r, g, b))

    # 2. Right Background (Anchor Aadhya - STRICT 100% ASPECT RATIO PRESERVATION)
    if os.path.exists(anchor_img_path):
        try:
            anchor = Image.open(anchor_img_path).convert("RGB")
            aw, ah = anchor.size  # e.g. 1920x1080 or 1376x768

            target_disp_w, target_disp_h = 580, 720
            target_ratio = target_disp_w / float(target_disp_h)  # 0.8055

            crop_h = ah
            crop_w = int(crop_h * target_ratio)
            
            # Center on Aadhya
            x1 = max(0, int((aw - crop_w) * 0.48))
            y1 = 0
            x2 = min(aw, x1 + crop_w)
            y2 = ah

            anchor_cropped = anchor.crop((x1, y1, x2, y2)).resize((target_disp_w, target_disp_h), Image.Resampling.LANCZOS)

            # Beauty enhancement
            c_enh = ImageEnhance.Color(anchor_cropped)
            anchor_cropped = c_enh.enhance(1.15)
            cnt_enh = ImageEnhance.Contrast(anchor_cropped)
            anchor_cropped = cnt_enh.enhance(1.08)

            canvas.paste(anchor_cropped, (W - target_disp_w, 0))
        except Exception as e:
            print(f"Warning loading anchor img: {e}", flush=True)
    else:
        target_disp_w = 580

    # 3. Cinematic Vignette & Gradients Overlay
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_ov = ImageDraw.Draw(overlay)

    # Dark gradient from left over news bg so text pops
    for x in range(750):
        alpha = int(245 * (1 - x / 750 * 0.45))
        draw_ov.line([(x, 0), (x, H)], fill=(8, 12, 24, alpha))

    # Smooth soft blend between news and anchor
    blend_start = W - target_disp_w - 60
    blend_end = W - target_disp_w + 60
    for x in range(blend_start, blend_end):
        progress = (x - blend_start) / float(blend_end - blend_start)
        alpha = int(220 * (1 - progress))
        draw_ov.line([(x, 0), (x, H)], fill=(10, 14, 26, alpha))

    # Bottom dark vignette
    for y in range(H - 110, H):
        progress = (y - (H - 110)) / 110.0
        alpha = int(240 * progress)
        draw_ov.line([(0, y), (W, y)], fill=(5, 8, 18, alpha))

    canvas.paste(overlay, (0, 0), overlay)

    draw = ImageDraw.Draw(canvas)

    # Top Live Pill Badge
    font_badge = get_font(21, bold=True)
    badge_bg = (0, 150, 255) if slot == "12PM" else (220, 20, 60)
    draw.rounded_rectangle([(40, 35), (370, 80)], radius=8, fill=badge_bg)
    draw.ellipse([(58, 48), (72, 62)], fill=(255, 255, 255))
    draw.ellipse([(61, 51), (69, 59)], fill=badge_bg)
    draw.text((82, 46), top_badge, font=font_badge, fill=(255, 255, 255))

    # Date Pill
    font_date = get_font(20, bold=True)
    draw.rounded_rectangle([(385, 35), (560, 80)], radius=8, fill=(20, 30, 50))
    draw.line([(385, 35), (385, 80)], fill=(0, 220, 255), width=3)
    draw.text((405, 47), date_str, font=font_date, fill=(0, 220, 255))

    # Huge Punchy Headline 1 in Viral Hinglish (Yellow Impact)
    font_huge1 = get_font(64, bold=True)
    draw.text((44, 114), headline_yellow[:32], font=font_huge1, fill=(0, 0, 0))
    draw.text((40, 110), headline_yellow[:32], font=font_huge1, fill=(255, 215, 0))

    # Big Headline 2 in Hinglish (Cyan / White)
    font_huge2 = get_font(48, bold=True)
    draw.text((44, 214), sub_headline_cyan[:38], font=font_huge2, fill=(0, 0, 0))
    draw.text((40, 210), sub_headline_cyan[:38], font=font_huge2, fill=(0, 235, 255))

    # Headline 3 Strip Callout in Hinglish
    font_callout = get_font(30, bold=True)
    draw.rounded_rectangle([(40, 310), (620, 375)], radius=6, fill=(255, 30, 86))
    draw.text((55, 326), callout_tag[:42], font=font_callout, fill=(255, 255, 255))

    # Bullet Highlights Box in Catchy Hinglish
    font_bullets = get_font(24, bold=True)
    draw.rounded_rectangle([(40, 410), (630, 560)], radius=8, fill=(15, 22, 38))
    draw.line([(40, 410), (630, 410)], fill=(0, 200, 255), width=3)
    
    # Bullet 1
    draw.ellipse([(60, 438), (70, 448)], fill=(0, 220, 255))
    draw.text((82, 430), bullets[0][:40], font=font_bullets, fill=(255, 255, 255))
    
    # Bullet 2
    draw.ellipse([(60, 483), (70, 493)], fill=(255, 220, 50))
    draw.text((82, 475), bullets[1][:40], font=font_bullets, fill=(255, 220, 50))
    
    # Bullet 3
    draw.ellipse([(60, 528), (70, 538)], fill=(0, 225, 255))
    draw.text((82, 520), bullets[2][:40], font=font_bullets, fill=(0, 225, 255))

    # Bottom Branding Strip
    draw.rectangle([(0, 665), (W, 720)], fill=(8, 12, 22))
    draw.line([(0, 665), (W, 665)], fill=(0, 220, 255), width=2)
    font_brand = get_font(25, bold=True)
    draw.text((40, 678), "ANCHOR AADHYA", font=font_brand, fill=(255, 255, 255))
    slot_text = "•  ROZ DOPAHAR 12 BAJE SPECIAL" if slot == "12PM" else "•  ROZ SHAAM 5 BAJE PRIME TECH"
    draw.text((270, 678), slot_text, font=font_brand, fill=(0, 220, 255))
    draw.text((1100, 678), "FULL HD", font=font_brand, fill=(255, 215, 0))

    canvas.save(output_path, "JPEG", quality=98)
    print(f"[SUCCESS] Generated Dynamic Hinglish Thumbnail: {output_path}", flush=True)
    return output_path

if __name__ == "__main__":
    create_youtube_thumbnail()
