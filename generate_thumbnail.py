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

def get_text_width(draw, text, font):
    try:
        bbox = draw.textbbox((0, 0), text, font=font)
        return bbox[2] - bbox[0]
    except Exception:
        try:
            return draw.textlength(text, font=font)
        except Exception:
            return len(text) * 16

def wrap_text_into_lines(draw, text, font, max_width, max_lines=3):
    words = text.strip().split()
    if not words: return []
    lines = []
    current_line = []
    for word in words:
        test_line = " ".join(current_line + [word])
        if get_text_width(draw, test_line, font) <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(" ".join(current_line))
                current_line = [word]
            else:
                lines.append(word)
                current_line = []
            if len(lines) >= max_lines:
                break
    if current_line and len(lines) < max_lines:
        lines.append(" ".join(current_line))
    if len(lines) == max_lines and current_line and " ".join(current_line) != lines[-1]:
        if not lines[-1].endswith("..."):
            lines[-1] = lines[-1][:max(0, len(lines[-1])-3)] + "..."
    return lines

def fit_text_lines(draw, text, initial_size, max_width, max_lines=3, min_size=32, bold=True):
    size = initial_size
    while size >= min_size:
        font = get_font(size, bold=bold)
        lines = wrap_text_into_lines(draw, text, font, max_width, max_lines=max_lines)
        if len(lines) <= max_lines and all(get_text_width(draw, l, font) <= max_width for l in lines):
            return font, lines, size
        size -= 2
    font = get_font(min_size, bold=bold)
    return font, wrap_text_into_lines(draw, text, font, max_width, max_lines=max_lines), min_size

def draw_outlined_text(draw, x, y, text, font, fill_color, outline_color=(0,0,0), stroke_width=4):
    for ox in range(-stroke_width, stroke_width + 1):
        for oy in range(-stroke_width, stroke_width + 1):
            if ox != 0 or oy != 0:
                draw.text((x + ox, y + oy), text, font=font, fill=outline_color)
    draw.text((x, y), text, font=font, fill=fill_color)

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
            bg = enhancer.enhance(0.40)
            canvas.paste(bg, (0, 0))
        except Exception as e:
            print(f"Warning loading news bg: {e}", flush=True)
    else:
        draw_bg = ImageDraw.Draw(canvas)
        for y in range(H):
            ratio = y / H
            r = int(12 + ratio * 15); g = int(18 + ratio * 20); b = int(45 + ratio * 40)
            draw_bg.line([(0, y), (760, y)], fill=(r, g, b))

    # 2. Right Background (Anchor Aadhya - RIGHT SIDE ONLY: x=700 to 1280)
    target_disp_w, target_disp_h = 580, 720
    if os.path.exists(anchor_img_path):
        try:
            anchor = Image.open(anchor_img_path).convert("RGB")
            aw, ah = anchor.size
            target_ratio = target_disp_w / float(target_disp_h)
            crop_h = ah
            crop_w = int(crop_h * target_ratio)
            x1 = max(0, int((aw - crop_w) * 0.48))
            y1 = 0
            x2 = min(aw, x1 + crop_w)
            y2 = ah

            anchor_cropped = anchor.crop((x1, y1, x2, y2)).resize((target_disp_w, target_disp_h), Image.Resampling.LANCZOS)
            c_enh = ImageEnhance.Color(anchor_cropped)
            anchor_cropped = c_enh.enhance(1.15)
            cnt_enh = ImageEnhance.Contrast(anchor_cropped)
            anchor_cropped = cnt_enh.enhance(1.08)

            # Placed from x=700 to 1280 (Right half)
            canvas.paste(anchor_cropped, (W - target_disp_w, 0))
        except Exception as e:
            print(f"Warning loading anchor img: {e}", flush=True)

    # 3. Soft Gradient Overlays (Zero darkness on her face)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw_ov = ImageDraw.Draw(overlay)

    # Dark backdrop on the left for text readability (x=0 to 650)
    for x in range(660):
        alpha = int(245 * (1 - x / 660 * 0.35))
        draw_ov.line([(x, 0), (x, H)], fill=(8, 12, 24, alpha))

    # Feather edge before anchor's body (x=640 to 720)
    for x in range(640, 720):
        progress = (x - 640) / 80.0
        alpha = int(180 * (1 - progress))
        draw_ov.line([(x, 0), (x, H)], fill=(10, 14, 26, alpha))

    canvas.paste(overlay, (0, 0), overlay)

    draw = ImageDraw.Draw(canvas)

    # STRICT TEXT BOUNDARY: Text MUST NEVER exceed x=620 (leaves 80px+ buffer before Anchor's face)
    MAX_TEXT_WIDTH = 580
    LEFT_X = 40

    # 4. Top Badges (y=30 to 72)
    font_badge = get_font(20, bold=True)
    badge_bg = (0, 150, 255) if slot == "12PM" else (220, 20, 60)
    draw.rounded_rectangle([(LEFT_X, 30), (LEFT_X + 260, 72)], radius=8, fill=badge_bg)
    draw.ellipse([(LEFT_X + 15, 43), (LEFT_X + 27, 55)], fill=(255, 255, 255))
    draw.text((LEFT_X + 38, 41), top_badge[:20], font=font_badge, fill=(255, 255, 255))

    font_date = get_font(18, bold=True)
    date_w = get_text_width(draw, date_str, font_date) + 30
    draw.rounded_rectangle([(LEFT_X + 275, 30), (LEFT_X + 275 + date_w, 72)], radius=8, fill=(20, 30, 50))
    draw.line([(LEFT_X + 275, 30), (LEFT_X + 275, 72)], fill=(0, 220, 255), width=3)
    draw.text((LEFT_X + 290, 42), date_str, font=font_date, fill=(0, 220, 255))

    # 5. MAIN HEADLINE (Yellow Impact) — Formatted strictly in 2 to 3 lines
    cur_y = 90
    font_h1, lines_h1, size_h1 = fit_text_lines(
        draw, headline_yellow, initial_size=52, max_width=MAX_TEXT_WIDTH, max_lines=3, min_size=34, bold=True
    )
    line_h1_height = int(size_h1 * 1.15)
    for line in lines_h1:
        draw_outlined_text(draw, LEFT_X, cur_y, line, font_h1, fill_color=(255, 220, 0), stroke_width=4)
        cur_y += line_h1_height

    # 6. SECONDARY HEADLINE (Cyan / Electric Blue) — Formatted in 1 to 2 lines
    cur_y += 10
    font_h2, lines_h2, size_h2 = fit_text_lines(
        draw, sub_headline_cyan, initial_size=38, max_width=MAX_TEXT_WIDTH, max_lines=2, min_size=28, bold=True
    )
    line_h2_height = int(size_h2 * 1.15)
    for line in lines_h2:
        draw_outlined_text(draw, LEFT_X, cur_y, line, font_h2, fill_color=(0, 235, 255), stroke_width=3)
        cur_y += line_h2_height

    # 7. CALLOUT STRIP BADGE (Red Bar)
    cur_y += 12
    font_callout = get_font(24, bold=True)
    clean_callout = callout_tag.strip()
    c_lines = wrap_text_into_lines(draw, clean_callout, font_callout, max_width=MAX_TEXT_WIDTH - 30, max_lines=1)
    callout_txt = c_lines[0] if c_lines else clean_callout[:35]
    callout_w = min(MAX_TEXT_WIDTH, get_text_width(draw, callout_txt, font_callout) + 30)
    draw.rounded_rectangle([(LEFT_X, cur_y), (LEFT_X + callout_w, cur_y + 44)], radius=6, fill=(255, 30, 86))
    draw.text((LEFT_X + 15, cur_y + 9), callout_txt, font=font_callout, fill=(255, 255, 255))
    cur_y += 54

    # 8. BULLETS BOX (3 Key Highlights) — Strictly within MAX_TEXT_WIDTH
    font_bullets = get_font(21, bold=True)
    box_top = cur_y
    box_bottom = min(655, cur_y + 115)
    draw.rounded_rectangle([(LEFT_X, box_top), (LEFT_X + MAX_TEXT_WIDTH, box_bottom)], radius=8, fill=(15, 22, 38))
    draw.line([(LEFT_X, box_top), (LEFT_X + MAX_TEXT_WIDTH, box_top)], fill=(0, 200, 255), width=3)

    bullet_colors = [(0, 220, 255), (255, 220, 50), (16, 185, 129)]
    b_y = box_top + 12
    for b_idx in range(min(3, len(bullets))):
        b_col = bullet_colors[b_idx % len(bullet_colors)]
        draw.ellipse([(LEFT_X + 16, b_y + 6), (LEFT_X + 26, b_y + 16)], fill=b_col)
        # Wrap bullet text to single line fitting inside bullet box
        raw_b = bullets[b_idx].strip()
        b_line = wrap_text_into_lines(draw, raw_b, font_bullets, max_width=MAX_TEXT_WIDTH - 50, max_lines=1)
        b_txt = b_line[0] if b_line else raw_b[:36]
        draw.text((LEFT_X + 36, b_y), b_txt, font=font_bullets, fill=(245, 245, 245))
        b_y += 32

    # 9. Bottom Branding Strip (Clean footer, below anchor)
    draw.rectangle([(0, 668), (W, 720)], fill=(8, 12, 22))
    draw.line([(0, 668), (W, 668)], fill=(0, 220, 255), width=2)
    font_brand = get_font(23, bold=True)
    draw.text((40, 680), "ANCHOR AADHYA", font=font_brand, fill=(255, 255, 255))
    slot_text = "•  ROZ DOPAHAR 12 BAJE SPECIAL" if slot == "12PM" else "•  ROZ SHAAM 5 BAJE PRIME TECH"
    draw.text((250, 680), slot_text, font=font_brand, fill=(0, 220, 255))
    draw.text((1120, 680), "FULL HD", font=font_brand, fill=(255, 215, 0))

    canvas.save(output_path, "JPEG", quality=98)
    print(f"[SUCCESS] Generated Dynamic Hinglish Thumbnail (Zero Face Overlay): {output_path}", flush=True)
    return output_path

if __name__ == "__main__":
    create_youtube_thumbnail()
