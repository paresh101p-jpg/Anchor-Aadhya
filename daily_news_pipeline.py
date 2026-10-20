import os
import sys
import asyncio
import subprocess
import urllib.request
from datetime import datetime
import edge_tts
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FFMPEG_BIN = r"E:\Paresh\Auto Post\ffmpeg-master-latest-win64-gpl\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe"
if not os.path.exists(FFMPEG_BIN):
    FFMPEG_BIN = "ffmpeg"
FFPROBE_BIN = r"E:\Paresh\Auto Post\ffmpeg-master-latest-win64-gpl\ffmpeg-master-latest-win64-gpl\bin\ffprobe.exe"
if not os.path.exists(FFPROBE_BIN):
    FFPROBE_BIN = "ffprobe"
LOGO_BUG_PATH = os.path.join(BASE_DIR, "anchor_aadhya_screen_bug.png")
HEADER_BAR_PATH = os.path.join(BASE_DIR, "header_bar.png")

# Today's Date String
TODAY_STR = datetime.now().strftime("%Y-%m-%d")
TODAY_DISPLAY = datetime.now().strftime("%d %B %Y")
OUTPUT_VIDEO = os.path.join(BASE_DIR, f"Anchor_Aadhya_News_{TODAY_STR}.mp4")

# 5 Fresh Viral Breaking Stories for Today (20 October 2026)
STORIES = [
    {
        "id": "scene_1_hook",
        "bg_img": os.path.join(BASE_DIR, "anchor_aadhya_profile.jpg"),
        "category": "TODAY'S TOP HEADLINES",
        "badge_color": (255, 30, 86, 255),
        "headline": "CRAZY TECH BULLETINS: TOP 4 BREAKING!",
        "bullet1": "• Drone beats human pilots, Tesla roadster with rocket thrusters!",
        "bullet2": "• 10,000 factory humanoid robots aur quantum computing sach!",
        "speech": f"अरे रुकिए रुकिए! अगर आप आज की सबसे बड़ी फ्यूचर टेक खबरें मिस नहीं करना चाहते, तो स्क्रीन स्क्रॉल करना तुरंत बंद कीजिए! क्या आप जानते हैं कि एक एआई ड्रोन ने दुनिया के नंबर वन इंसानी पायलट को रेस में हरा दिया है? और एलन मस्क की टेस्ला कार अब ज़मीन पर नहीं, सीधे हवा में रॉकेट की तरह छलाँग लगाने वाली है! नमस्कार, आज {TODAY_DISPLAY} है, मैं हूँ आपकी अपनी होस्ट आध्या... और स्वागत है Anchor Aadhya के डेली टेक धमाके में! चलिए शुरू करते हैं!"
    },
    {
        "id": "scene_2_aidrone",
        "bg_url": "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=1920&q=85",
        "local_img": os.path.join(BASE_DIR, "news_1_drone.jpg"),
        "category": "AI DRONE RACING",
        "badge_color": (0, 190, 255, 255),
        "headline": "AI DRONE NE WORLD CHAMPION KO HARAYA!",
        "bullet1": "• 100 KM/H speed bina GPS ke self-pilot navigation",
        "bullet2": "• Human champion pilots ko race mein piche chhoda!",
        "speech": "पहली बड़ी खबर: दुनिया के सबसे तेज़ इंसानी ड्रोन रेसर्स को एक एआई ड्रोन ने धूल चटा दी है! डेल्फ़्ट यूनिवर्सिटी के 'मोनो-रेस' एआई ने बिना किसी जीपीएस या मैप के, सिर्फ एक कैमरे की मदद से सौ किलोमीटर प्रति घंटे की रफ़्तार से उड़ते हुए वर्ल्ड चैंपियन पायलट को हरा दिया! मतलब अब आसमान में उड़ने की रेस में भी इंसान कंप्यूटर से हार गया! अब आप ही बताइए... क्या इंसान कभी एआई से जीत पाएगा? या फिर हमें अपनी हार मान लेनी चाहिए? कमेंट में अपनी राय ज़रूर दीजिए!"
    },
    {
        "id": "scene_3_tesla_thrusters",
        "bg_url": "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=1920&q=85",
        "local_img": os.path.join(BASE_DIR, "news_2_tesla.jpg"),
        "category": "TESLA ROADSTER",
        "badge_color": (245, 158, 11, 255),
        "headline": "TESLA CAR MEIN LAG GAYE ROCKET THRUSTERS!",
        "bullet1": "• SpaceX cold-gas thrusters se hawa mein uregi car",
        "bullet2": "• 0 se 100 km/h sirf 1 second se kam mein!",
        "speech": "दूसरी होश उड़ाने वाली खबर एलन मस्क की टेस्ला से आई है! टेस्ला की नई रोडस्टर कार में स्पेस-एक्स के असली रॉकेट थ्रस्टर्स लगा दिए गए हैं! जी हाँ, ये कार सिर्फ ज़मीन पर दौड़ेगी नहीं, बल्कि रॉकेट की ताकत से हवा में उड़ती हुई छलाँग भी लगाएगी! शून्य से सौ की रफ़्तार एक सेकंड से भी कम समय में! ज़रा सोचिए, अगर किसी दिन मैं आपको इस उड़ती हुई टेस्ला में अपने साथ लॉन्ग ड्राइव पर ले चलूँ, तो आपका दिल कितनी तेज़ी से धड़केगा? सीट बेल्ट कसकर बाँध लेना, क्योंकि झटका बहुत ज़ोर का लगने वाला है!"
    },
    {
        "id": "scene_4_humanoid_army",
        "bg_url": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1920&q=85",
        "local_img": os.path.join(BASE_DIR, "news_3_robots.jpg"),
        "category": "HUMANOID FACTORY",
        "badge_color": (168, 85, 247, 255),
        "headline": "FACTORIES MEIN 10,000 ROBOTS DEPLOYED!",
        "bullet1": "• Touch aur sound sensory AI se assembing shuru",
        "bullet2": "• 9-minute ultra-fast charge aur 20 ghante continuous duty!",
        "speech": "तीसरी खबर उन सभी के लिए है जो अपने ऑफिस के काम से थक जाते हैं! दुनिया की बड़ी ऑटोमोबाइल कंपनियों ने अपनी फैक्ट्रियों में दस हज़ार से ज़्यादा ह्यूमनॉइड रोबोट्स तैनात कर दिए हैं! इनमें इंसानों की तरह छूने और आवाज़ सुनने वाले सेंसर्स लगे हैं... और सबसे कमाल की बात? ये सिर्फ नौ मिनट में चार्ज हो जाते हैं और पूरे बीस घंटे बिना रुके भारी-भरकम कारें असेंबल करते हैं! ना लंच ब्रेक, ना छुट्टी! अब अगर ये रोबोट हमारे घरों में आ गए, तो घर के सारे काम कौन करेगा? ज़ाहिर सी बात है रोबोट! तो आलसी पतियों, अब तुम्हारी खैर नहीं!"
    },
    {
        "id": "scene_5_quantum",
        "bg_url": "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=1920&q=85",
        "local_img": os.path.join(BASE_DIR, "news_4_quantum.jpg"),
        "category": "QUANTUM LEAP",
        "badge_color": (34, 197, 94, 255),
        "headline": "QUANTUM INTERNET KA NAYA WORLD RECORD!",
        "bullet1": "• Max Planck Institute ne achieve kiya fundamental limit",
        "bullet2": "• Unhackable super-fast quantum communication network!",
        "speech": "चौथी वैज्ञानिक खबर क्वांटम फिजिक्स से है! मैक्स प्लैंक इंस्टीट्यूट के वैज्ञानिकों ने क्वांटम दुनिया की सबसे बड़ी रुकावट को पार कर लिया है! उन्होंने एक ऐसा क्रिस्टल तैयार किया है जिससे अनहैकेबल क्वांटम इंटरनेट और सुपर-फास्ट क्वांटम कंप्यूटिंग हकीकत बनने जा रही है! यानी भविष्य में आपका डेटा और पासवर्ड दुनिया का कोई भी हैकर कभी चुरा नहीं पाएगा! क्योंकि आपकी प्राइवेसी और सुरक्षा की चिंता आपसे ज़्यादा मुझे रहती है!"
    },
    {
        "id": "scene_6_outro",
        "bg_img": os.path.join(BASE_DIR, "anchor_aadhya_profile.jpg"),
        "category": "DAILY 5PM BULLETIN",
        "badge_color": (255, 30, 86, 255),
        "headline": "ROZ SHAAM 5 BAJE NAYA VIDEO!",
        "bullet1": "• Like karo, doston ko share karo aur bell icon dabao",
        "bullet2": "• Kal shaam 5 baje milte hain ek aur naye dhamake ke saath!",
        "speech": "तो दोस्तों, ये थीं आज की सबसे बड़ी फ्यूचर टेक की सनसनीखेज़ खबरें! कैसी लगी आपको आज आध्या की टेक बुलेटिन? अगर मज़ा आया हो तो तुरंत वीडियो को लाइक करो, अपने दोस्तों के साथ शेयर करो, और स्क्रीन पर दिख रहे बटन से चैनल Anchor Aadhya को सब्सक्राइब ज़रूर कर लेना! यहाँ देखिए हमारा पिछला स्पेशल बुलेटिन! हम रोज़ शाम ठीक पाँच बजे मिलेंगे ताज़ा टेक न्यूज़ के साथ! तब तक अपना ख़्याल रखिए, खुश रहिए और बाय-बाय!"
    }
]

# Rundown Stories for Scene 1
RUNDOWN_ITEMS = [
    {"num": "01", "title": "AI Drone Beats Human World Champion at 100 km/h"},
    {"num": "02", "title": "Tesla Roadster Gets SpaceX Rocket Thrusters"},
    {"num": "03", "title": "10,000 Humanoid Robots Enter Auto Factories"},
    {"num": "04", "title": "Quantum Physics Breakthrough for Unhackable Data"}
]

def download_news_images():
    print("--- 1. Downloading Authentic Real Photojournalism News Images ---", flush=True)
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    for item in STORIES:
        if "bg_url" in item:
            dest = item["local_img"]
            if not os.path.exists(dest) or os.path.getsize(dest) < 10000:
                try:
                    req = urllib.request.Request(item["bg_url"], headers=headers)
                    with urllib.request.urlopen(req, timeout=15) as resp:
                        with open(dest + ".tmp", "wb") as f:
                            f.write(resp.read())
                    img = Image.open(dest + ".tmp").convert("RGB").resize((1920, 1080), Image.Resampling.LANCZOS)
                    img.save(dest, "JPEG", quality=95)
                    if os.path.exists(dest + ".tmp"):
                        os.remove(dest + ".tmp")
                    print(f"  --> Downloaded Real Photo: {dest}", flush=True)
                except Exception as e:
                    print(f"  --> Download fallback for {dest}: {e}", flush=True)
            item["bg_img"] = dest

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

def create_graphics_layers():
    print("\n--- 2. Generating Modern TV Broadcast Motion Overlays ---", flush=True)
    # Header bar
    header = Image.new("RGBA", (1920, 65), (0, 0, 0, 0))
    hd = ImageDraw.Draw(header)
    hd.rectangle([(0, 0), (1920, 63)], fill=(10, 15, 28, 235))
    hd.line([(0, 63), (1920, 63)], fill=(0, 220, 255, 255), width=3)
    font_header = get_font(24, bold=True)
    hd.text((180, 18), f"ANCHOR AADHYA  |  DAILY TECH REPORT • {TODAY_DISPLAY.upper()}", font=font_header, fill=(255, 255, 255))
    hd.text((1560, 18), "SPECIAL REPORT", font=font_header, fill=(0, 220, 255))
    header.save(HEADER_BAR_PATH, "PNG")

    # Scene 1 Rundown Board
    board = Image.new("RGBA", (840, 480), (0, 0, 0, 0))
    bd = ImageDraw.Draw(board)
    bd.rectangle([(0, 0), (840, 480)], fill=(10, 15, 28, 230))
    bd.rectangle([(0, 0), (840, 65)], fill=(220, 20, 60, 255))
    font_board_title = get_font(30, bold=True)
    bd.text((25, 16), "TODAY'S TOP TECH HEADLINES", font=font_board_title, fill=(255, 255, 255))
    board_path = os.path.join(BASE_DIR, "scene1_board.png")
    board.save(board_path, "PNG")

    rundown_paths = []
    font_r_num = get_font(24, bold=True)
    font_r_title = get_font(24, bold=False)
    for idx, r in enumerate(RUNDOWN_ITEMS):
        strip = Image.new("RGBA", (800, 75), (0, 0, 0, 0))
        sd = ImageDraw.Draw(strip)
        sd.rectangle([(0, 0), (800, 75)], fill=(18, 25, 45, 240))
        sd.line([(0, 0), (800, 0)], fill=(0, 220, 255, 200), width=2)
        sd.rectangle([(12, 12), (105, 62)], fill=(0, 180, 255, 255))
        sd.text((25, 23), f"#{r['num']}", font=font_r_num, fill=(255, 255, 255))
        sd.text((120, 23), r["title"], font=font_r_title, fill=(255, 255, 255))
        s_path = os.path.join(BASE_DIR, f"scene1_rundown_{idx+1}.png")
        strip.save(s_path, "PNG")
        rundown_paths.append(s_path)

    # Lower-third plates and bullets
    plate_paths = []
    bullet1_paths = []
    bullet2_paths = []

    font_badge = get_font(28, bold=True)
    font_headline = get_font(46, bold=True)
    font_bullet = get_font(32, bold=True)

    for idx, item in enumerate(STORIES):
        plate = Image.new("RGBA", (1920, 265), (0, 0, 0, 0))
        draw = ImageDraw.Draw(plate)
        draw.rectangle([(0, 25), (1920, 265)], fill=(10, 15, 28, 230))
        draw.line([(0, 25), (1920, 25)], fill=item["badge_color"], width=5)

        cat_text = f"  {item['category']}  "
        draw.rectangle([(60, 0), (540, 50)], fill=item["badge_color"])
        draw.text((75, 8), cat_text, font=font_badge, fill=(255, 255, 255))
        draw.text((65, 75), item["headline"], font=font_headline, fill=(255, 255, 255))

        plate_file = os.path.join(BASE_DIR, f"plate_{idx+1}.png")
        plate.save(plate_file, "PNG")
        plate_paths.append(plate_file)

        b1_img = Image.new("RGBA", (1800, 48), (0, 0, 0, 0))
        b1_draw = ImageDraw.Draw(b1_img)
        b1_draw.text((0, 0), item["bullet1"], font=font_bullet, fill=(0, 225, 255, 255))
        b1_file = os.path.join(BASE_DIR, f"bullet1_{idx+1}.png")
        b1_img.save(b1_file, "PNG")
        bullet1_paths.append(b1_file)

        b2_img = Image.new("RGBA", (1800, 48), (0, 0, 0, 0))
        b2_draw = ImageDraw.Draw(b2_img)
        b2_draw.text((0, 0), item["bullet2"], font=font_bullet, fill=(255, 215, 0, 255))
        b2_file = os.path.join(BASE_DIR, f"bullet2_{idx+1}.png")
        b2_img.save(b2_file, "PNG")
        bullet2_paths.append(b2_file)

    # High-CTR YouTube End Screen Overlay (Left Side Panel)
    endscreen_img = Image.new("RGBA", (1920, 1080), (0, 0, 0, 0))
    ed = ImageDraw.Draw(endscreen_img)
    px1, py1, px2, py2 = 60, 100, 920, 980
    ed.rounded_rectangle([(px1, py1), (px2, py2)], radius=24, fill=(10, 16, 32, 230), outline=(0, 220, 255, 255), width=3)
    ed.rounded_rectangle([(px1, py1), (px2, py1+70)], radius=24, fill=(220, 20, 60, 255))

    font_es_bold = get_font(26, bold=True)
    font_es_sm = get_font(20, bold=False)
    font_es_title = get_font(30, bold=True)

    ed.text((px1+35, py1+18), "THANKS FOR WATCHING • ANCHOR AADHYA", font=font_es_title, fill=(255, 255, 255))

    # Video 1 Box (16:9 standard: 670x377)
    vx1, vy1, vx2, vy2 = 120, 210, 860, 626
    ed.rounded_rectangle([(vx1, vy1), (vx2, vy2)], radius=16, fill=(18, 25, 48, 210), outline=(0, 220, 255, 255), width=3)
    ed.text((vx1+250, vy1+170), "▶  WATCH NEXT", font=font_es_bold, fill=(0, 220, 255))
    ed.text((vx1+200, vy1+210), "Recommended / Previous Tech Bulletin", font=font_es_sm, fill=(200, 215, 235))

    # Subscribe Circle & Text
    cx, cy, r = 240, 800, 80
    ed.ellipse([(cx-r, cy-r), (cx+r, cy+r)], fill=(220, 20, 60, 220), outline=(255, 215, 0, 255), width=4)
    ed.text((cx-42, cy-14), "SUBSCRIBE", font=get_font(20, bold=True), fill=(255, 255, 255))
    ed.text((cx+115, cy-25), "ANCHOR AADHYA", font=font_es_bold, fill=(255, 255, 255))
    ed.text((cx+115, cy+8), "Roz Shaam 5:00 Baje Daily Tech News", font=font_es_sm, fill=(0, 220, 255))
    ed.text((cx+115, cy+35), "Bell Icon Dabayein!", font=font_es_sm, fill=(255, 215, 0))

    endscreen_path = os.path.join(BASE_DIR, "endscreen_overlay.png")
    endscreen_img.save(endscreen_path, "PNG")

    return board_path, rundown_paths, plate_paths, bullet1_paths, bullet2_paths, endscreen_path

async def generate_speech_audio():
    print("\n--- 3. Synthesizing Pure Hindi Voice (Microsoft Swara Neural) ---", flush=True)
    voice = "hi-IN-SwaraNeural"
    audio_paths = []
    for idx, item in enumerate(STORIES):
        audio_path = os.path.join(BASE_DIR, f"tv_voice_{idx+1}.mp3")
        communicate = edge_tts.Communicate(item["speech"], voice=voice, rate="+1%")
        await communicate.save(audio_path)
        audio_paths.append(audio_path)
        print(f"  --> Native Hindi Audio {idx+1} ready: {audio_path}", flush=True)
    return audio_paths

def get_audio_duration(file_path):
    cmd = [
        FFPROBE_BIN, "-v", "error", "-show_entries", "format=duration",
        "-of", "default=noprint_wrappers=1:nokey=1", file_path
    ]
    res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    try:
        return float(res.stdout.strip())
    except Exception:
        return 28.0

def render_scenes_with_motion(board_path, rundown_paths, plate_paths, bullet1_paths, bullet2_paths, endscreen_path, audio_paths):
    print("\n--- 4. Rendering HD 1080p Scenes with Motion Graphics & Real Photos ---", flush=True)
    scene_videos = []
    ticker_font = "C\\:/Windows/Fonts/segoeui.ttf"
    for candidate in [
        r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
    ]:
        if os.path.exists(candidate):
            ticker_font = candidate.replace("\\", "/").replace(":", "\\:")
            break
    ticker_text = (
        f"ANCHOR AADHYA DAILY TECH BULLETIN • {TODAY_DISPLAY.upper()} • "
        "AI DRONE WINS 100 KM/H WORLD RACE -- TESLA ROADSTER GETS SPACEX ROCKET THRUSTERS -- "
        "10,000 HUMANOID ROBOTS DEPLOYED IN AUTOMOTIVE PLANTS -- QUANTUM COMPUTING COHERENCE LIMIT ACHIEVED -- "
        "SUBSCRIBE TO ANCHOR AADHYA • DAILY 5 PM • "
    )

    for idx, (item, plate, b1_path, b2_path, audio) in enumerate(zip(STORIES, plate_paths, bullet1_paths, bullet2_paths, audio_paths)):
        dur = get_audio_duration(audio) + 0.6
        scene_mp4 = os.path.join(BASE_DIR, f"tv_scene_{idx+1}.mp4")
        frames = int(dur * 25)

        if idx == 0:
            # SCENE 1: Headline Rundown Board on Left + Aadhya on Right
            filter_complex = (
                f"[0:v]scale=1920:1080,zoompan=z='min(zoom+0.0003,1.03)':d={frames}:s=1920x1080:fps=25[bg];"
                f"[bg][1:v]overlay=0:0[w_hdr];"
                f"[w_hdr][2:v]overlay=x=25:y='10 + 4*sin(2*PI*t/3)'[w_logo];"
                f"[w_logo][3:v]overlay=x='if(lte(t,0.8), -850 + 910*sin((t-0.4)/0.4*1.5708), 60)':y=140:enable='between(t,0.4,999)'[w_bd];"
                f"[w_bd][4:v]overlay=x='if(lte(t,1.4), -850 + 930*sin((t-1.0)/0.4*1.5708), 80)':y=220:enable='between(t,1.0,999)'[w_r1];"
                f"[w_r1][5:v]overlay=x='if(lte(t,2.6), -850 + 930*sin((t-2.2)/0.4*1.5708), 80)':y=305:enable='between(t,2.2,999)'[w_r2];"
                f"[w_r2][6:v]overlay=x='if(lte(t,3.8), -850 + 930*sin((t-3.4)/0.4*1.5708), 80)':y=390:enable='between(t,3.4,999)'[w_r3];"
                f"[w_r3][7:v]overlay=x='if(lte(t,5.0), -850 + 930*sin((t-4.6)/0.4*1.5708), 80)':y=475:enable='between(t,4.6,999)'[w_r4];"
                f"[w_r4][8:v]overlay=x='if(lte(t,7.2), -1920 + 1920*sin((t-6.5)/0.7*1.5708), 0)':y=770:enable='between(t,6.5,999)'[w_plt];"
                f"[w_plt][9:v]overlay=x='if(lte(t,8.1), -1800 + 1870*sin((t-7.5)/0.6*1.5708), 70)':y=915:enable='between(t,7.5,999)'[w_b1];"
                f"[w_b1][10:v]overlay=x='if(lte(t,10.1), -1800 + 1870*sin((t-9.5)/0.6*1.5708), 70)':y=965:enable='between(t,9.5,999)'[w_b2];"
                f"[w_b2]drawbox=y=1035:color=black@0.95:width=1920:height=45:t=fill,"
                f"drawbox=y=1033:color=0x00dcff@1:width=1920:height=2:t=fill,"
                f"drawtext=fontfile='{ticker_font}':text='{ticker_text}':fontsize=25:fontcolor=white:x='w-mod(t*140,w+text_w)':y=1045[v]"
            )

            cmd = [
                FFMPEG_BIN, "-y",
                "-loop", "1", "-i", item["bg_img"],
                "-loop", "1", "-i", HEADER_BAR_PATH,
                "-loop", "1", "-i", LOGO_BUG_PATH,
                "-loop", "1", "-i", board_path,
                "-loop", "1", "-i", rundown_paths[0],
                "-loop", "1", "-i", rundown_paths[1],
                "-loop", "1", "-i", rundown_paths[2],
                "-loop", "1", "-i", rundown_paths[3],
                "-loop", "1", "-i", plate,
                "-loop", "1", "-i", b1_path,
                "-loop", "1", "-i", b2_path,
                "-i", audio,
                "-filter_complex", filter_complex,
                "-map", "[v]", "-map", "11:a",
                "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "fast",
                "-c:a", "aac", "-b:a", "192k",
                "-t", str(dur),
                scene_mp4
            ]
        elif idx == len(STORIES) - 1:
            # SCENE 6 (OUTRO): High-CTR YouTube End-Screen Card on Left + Aadhya on Right
            filter_complex = (
                f"[0:v]scale=1920:1080,zoompan=z='min(zoom+0.0003,1.03)':d={frames}:s=1920x1080:fps=25[bg];"
                f"[bg][1:v]overlay=0:0[with_hdr];"
                f"[with_hdr][2:v]overlay=x=25:y='10 + 4*sin(2*PI*t/3)'[with_logo];"
                f"[with_logo][3:v]overlay=x='if(lte(t,1.0), -950 + 950*sin((t-0.3)/0.7*1.5708), 0)':y=0:enable='between(t,0.3,999)'[with_endscreen];"
                f"[with_endscreen]drawbox=y=1035:color=black@0.95:width=1920:height=45:t=fill,"
                f"drawbox=y=1033:color=0x00dcff@1:width=1920:height=2:t=fill,"
                f"drawtext=fontfile='{ticker_font}':text='{ticker_text}':fontsize=25:fontcolor=white:x='w-mod(t*140,w+text_w)':y=1045[v]"
            )

            cmd = [
                FFMPEG_BIN, "-y",
                "-loop", "1", "-i", item["bg_img"],
                "-loop", "1", "-i", HEADER_BAR_PATH,
                "-loop", "1", "-i", LOGO_BUG_PATH,
                "-loop", "1", "-i", endscreen_path,
                "-i", audio,
                "-filter_complex", filter_complex,
                "-map", "[v]", "-map", "4:a",
                "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "fast",
                "-c:a", "aac", "-b:a", "192k",
                "-t", str(dur),
                scene_mp4
            ]
        else:
            filter_complex = (
                f"[0:v]scale=1920:1080,zoompan=z='min(zoom+0.0003,1.03)':d={frames}:s=1920x1080:fps=25[bg];"
                f"[bg][1:v]overlay=0:0[with_hdr];"
                f"[with_hdr][2:v]overlay=x=25:y='10 + 4*sin(2*PI*t/3)'[with_logo];"
                f"[with_logo][3:v]overlay=x='if(lte(t,0.7), -1920 + 1920*sin(t/0.7*1.5708), 0)':y=770[with_plate];"
                f"[with_plate][4:v]overlay=x='if(lte(t,1.8), -1800 + 1870*sin((t-1.2)/0.6*1.5708), 70)':y=915:enable='between(t,1.2,999)'[with_b1];"
                f"[with_b1][5:v]overlay=x='if(lte(t,4.1), -1800 + 1870*sin((t-3.5)/0.6*1.5708), 70)':y=965:enable='between(t,3.5,999)'[with_b2];"
                f"[with_b2]drawbox=y=1035:color=black@0.95:width=1920:height=45:t=fill,"
                f"drawbox=y=1033:color=0x00dcff@1:width=1920:height=2:t=fill,"
                f"drawtext=fontfile='{ticker_font}':text='{ticker_text}':fontsize=25:fontcolor=white:x='w-mod(t*140,w+text_w)':y=1045[v]"
            )

            cmd = [
                FFMPEG_BIN, "-y",
                "-loop", "1", "-i", item["bg_img"],
                "-loop", "1", "-i", HEADER_BAR_PATH,
                "-loop", "1", "-i", LOGO_BUG_PATH,
                "-loop", "1", "-i", plate,
                "-loop", "1", "-i", b1_path,
                "-loop", "1", "-i", b2_path,
                "-i", audio,
                "-filter_complex", filter_complex,
                "-map", "[v]", "-map", "6:a",
                "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "18", "-preset", "fast",
                "-c:a", "aac", "-b:a", "192k",
                "-t", str(dur),
                scene_mp4
            ]

        res = subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE, text=True)
        if res.returncode != 0:
            print(f"FFmpeg Error Scene {idx+1}:", res.stderr[-400:], flush=True)
            sys.exit(1)
        scene_videos.append(scene_mp4)
        print(f"  --> Rendered Motion Scene {idx+1} ({dur:.1f}s): {scene_mp4}", flush=True)

    return scene_videos

def render_master_news_video(scene_videos):
    print("\n--- 5. Combining Scenes with Studio News Ambient Audio ---", flush=True)
    list_file = os.path.join(BASE_DIR, "tv_scenes_list.txt")
    with open(list_file, "w", encoding="utf-8") as f:
        for vid in scene_videos:
            clean_name = os.path.basename(vid)
            f.write(f"file '{clean_name}'\n")

    temp_concat = os.path.join(BASE_DIR, "temp_concat_tv.mp4")
    cmd_concat = [
        FFMPEG_BIN, "-y",
        "-f", "concat", "-safe", "0", "-i", list_file,
        "-c", "copy",
        temp_concat
    ]
    subprocess.run(cmd_concat, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

    cmd_final = [
        FFMPEG_BIN, "-y",
        "-i", temp_concat,
        "-af", "volume=1.08,bass=g=2:f=180,treble=g=1.5:f=3500",
        "-c:v", "copy",
        "-c:a", "aac", "-b:a", "256k",
        OUTPUT_VIDEO
    ]
    subprocess.run(cmd_final, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    print(f"\n[SUCCESS] MASTER DAILY NEWS VIDEO READY: {OUTPUT_VIDEO}", flush=True)

def cleanup_temp_files():
    print("\n--- 6. Cleaning Up Temporary Rendering Assets ---", flush=True)
    patterns = ["tv_scene_*", "plate_*", "bullet*", "scene1_*", "tv_voice_*", "temp_concat*", "endscreen_overlay*"]
    import glob
    for pat in patterns:
        for f in glob.glob(os.path.join(BASE_DIR, pat)):
            try:
                os.remove(f)
            except:
                pass
    list_f = os.path.join(BASE_DIR, "tv_scenes_list.txt")
    if os.path.exists(list_f):
        try:
            os.remove(list_f)
        except:
            pass
    print("  --> Folder Cleaned. Only master assets and final video remain.", flush=True)

async def main():
    print("==============================================================")
    print(f"  AI & FUTURE TECH - DAILY 5 PM BULLETIN AUTOMATION ({TODAY_STR})")
    print("  ANCHOR: AADHYA | REAL FOOTAGE | 4 BREAKING TECH STORIES     ")
    print("==============================================================")

    download_news_images()
    board_path, rundown_paths, plate_paths, bullet1_paths, bullet2_paths, endscreen_path = create_graphics_layers()
    audio_paths = await generate_speech_audio()
    scene_videos = render_scenes_with_motion(board_path, rundown_paths, plate_paths, bullet1_paths, bullet2_paths, endscreen_path, audio_paths)
    render_master_news_video(scene_videos)
    cleanup_temp_files()

    print("\n--- 7. Generating High-CTR Thumbnail & YouTube Metadata ---", flush=True)
    try:
        from generate_thumbnail import create_youtube_thumbnail
        from generate_metadata import generate_video_metadata
        create_youtube_thumbnail()
        generate_video_metadata()
    except Exception as e:
        print(f"Warning generating thumbnail/metadata: {e}", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
