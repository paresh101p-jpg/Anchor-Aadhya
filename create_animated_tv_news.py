import os
import sys
import asyncio
import subprocess
import edge_tts
from PIL import Image, ImageDraw, ImageFont

BASE_DIR = r"E:\Paresh\Auto Post\AI News Channel"
OUTPUT_VIDEO = os.path.join(BASE_DIR, "AI_Future_Tech_Animated_TV_News.mp4")
FFMPEG_BIN = r"E:\Paresh\Auto Post\ffmpeg-master-latest-win64-gpl\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe"
FFPROBE_BIN = r"E:\Paresh\Auto Post\ffmpeg-master-latest-win64-gpl\ffmpeg-master-latest-win64-gpl\bin\ffprobe.exe"
LOGO_BUG_PATH = os.path.join(BASE_DIR, "anchor_aadhya_screen_bug.png")
HEADER_BAR_PATH = os.path.join(BASE_DIR, "header_bar.png")

# 6 Segments with Anchor Aadhya
# Real photojournalism footage (zero neon glow!)
# Opening Scene 1: Animated Headline Rundown of all top stories!
NEWS_DATA = [
    {
        "id": "scene_1_hook",
        "bg_img": os.path.join(BASE_DIR, "anchor_aadhya_profile.jpg"),
        "category": "TOP TECH HEADLINES",
        "badge_color": (255, 30, 86, 255),
        "headline": "FUTURE TECH IS HERE: MIND-BLOWING!",
        "bullet1": "• Stop scrolling! Yeh 5 inventions aapka hosh uda dengi!",
        "bullet2": "• Humanoid robots, brain chips aur flying cars ka sach!",
        "speech": "अरे रुकिए रुकिए! स्क्रीन स्क्रॉल करने से पहले ज़रा ये सुनिए... क्या आप जानते हैं कि अगले दो से तीन साल में आपके घर के सारे बर्तन, झाड़ू और पोछा... एक रोबोट करने वाला है? जी हाँ! और इतना ही नहीं, अब आप बिना हाथ लगाए सिर्फ सोचकर अपना फोन चला पाएंगे! नमस्कार, मैं हूँ आपकी अपनी होस्ट आध्या... और आज का ये टेक बुलेटिन देखने के बाद आपका दिमाग सच में हिलने वाला है! चलिए बिना किसी बकवास के शुरू करते हैं!"
    },
    {
        "id": "scene_2_robots",
        "bg_img": os.path.join(BASE_DIR, "scene_2_robots.jpg"),
        "category": "ROBOTICS REVOLUTION",
        "badge_color": (0, 190, 255, 255),
        "headline": "FACTORIES MEIN ENTER HUE TESLA ROBOTS!",
        "bullet1": "• Tesla Optimus & Figure 02 ne assembly shuru ki",
        "bullet2": "• 24 ghante bina thake aur bina chai break ke kaam!",
        "speech": "पहली बड़ी खबर: टेस्ला के ऑप्टिमस और फिगर ज़ीरो-टू ह्यूमनॉइड रोबोट्स अब सिर्फ साइंस फिक्शन फिल्मों में नहीं, बल्कि असली फैक्ट्रियों में कारें बना रहे हैं! ये रोबोट्स बिल्कुल इंसानों की तरह भारी पार्ट्स उठा रहे हैं, नट-बोल्ट कस रहे हैं... और सबसे मज़ेदार बात? ये ना कभी थकते हैं, ना चाय-सुट्टा ब्रेक मांगते हैं, और ना ही सैलरी बढ़ाने की हड़ताल करते हैं! अब ज़रा सोचिए, अगर ये रोबोट हमारे घर आ गए, तो आलसी दोस्तों और पतियों का क्या होगा? उनकी तो कामवाली छुट्टी पक्की समझो! लेकिन सच बताइए... आप रोबोट से चाय मंगवाना पसंद करेंगे या मुझसे? कमेंट में लिखकर ज़रूर बताना!"
    },
    {
        "id": "scene_3_neuralink",
        "bg_img": os.path.join(BASE_DIR, "scene_6_neuralink.jpg"),
        "category": "NEURALINK CHIP",
        "badge_color": (168, 85, 247, 255),
        "headline": "DIMAAG KI SOCH SE CHALEGA PHONE!",
        "bullet1": "• Elon Musk ke Neuralink chip ka human trial pass",
        "bullet2": "• Bina ungli lagaye computer typing aur gaming control!",
        "speech": "दूसरी ज़बरदस्त खबर आई है एलन मस्क के न्यूरालिंक से! अब इंसानी दिमाग में एक छोटा सा चिप लगाकर, बिना हाथ हिलाए कंप्यूटर और मोबाइल को सिर्फ सोचकर चलाया जा रहा है! जी हाँ, मरीज़ अब केवल अपनी सोच की ताक़त से स्क्रीन पर गेम खेल रहे हैं और नब्बे शब्द प्रति मिनट की स्पीड से टाइपिंग कर रहे हैं! सोचिए कितना जादुई है... आप सिर्फ मेरे बारे में सोचेंगे और वीडियो अपने आप लाइक हो जाएगा! लेकिन हाँ, दिमाग में कोई बदमाशी मत सोचना, वरना एआई पकड़ लेगा और मैं आपसे नाराज़ हो जाऊँगी!"
    },
    {
        "id": "scene_4_flying_cars",
        "bg_img": os.path.join(BASE_DIR, "scene_5_flying_car.jpg"),
        "category": "FLYING AIR TAXIS",
        "badge_color": (245, 158, 11, 255),
        "headline": "TRAFFIC JAM KA PERMANENT THE-END!",
        "bullet1": "• Dubai aur America mein Electric Air-Taxis certified",
        "bullet2": "• Seedhe hawa mein udkar pahuncho office aur ghar!",
        "speech": "तीसरी खबर उन सभी के लिए है जो रोज़ सुबह-शाम ट्रैफ़िक जाम में फँसकर रो पड़ते हैं! दुबई और अमेरिका में इलेक्ट्रिक फ्लाइंग एयर-टैक्सियों की टेस्टिंग पूरी तरह पास हो चुकी है और इन्हें उड़ने का सर्टिफ़िकेट भी मिल चुका है! बस मोबाइल ऐप खोलो, एयर-टैक्सी बुक करो और सीधे हवा में उड़ते हुए ऑफिस पहुँच जाओ! सोचिए, अगर हम दोनों हवा में उड़ते हुए फ्लाइंग कार में लॉन्ग ड्राइव पर जाएँ, तो कितना मज़ा आएगा ना? ना ट्रैफ़िक पुलिस का चालान काटने का डर, और ना ही सड़क के गड्ढों का झंझट!"
    },
    {
        "id": "scene_5_medicine",
        "bg_img": os.path.join(BASE_DIR, "scene_3_medicine.jpg"),
        "category": "HEALTHCARE AI",
        "badge_color": (34, 197, 94, 255),
        "headline": "AI NE BANAYI CANCER KI MEDICINE!",
        "bullet1": "• 15 saal ka research work hafton mein complete",
        "bullet2": "• Super-smart AI molecules jo bimariyon ko khatam karenge!",
        "speech": "चौथी चमत्कारिक खबर मेडिकल साइंस से है! जिस नई दवा की रिसर्च में पहले वैज्ञानिकों को दस से पंद्रह साल लग जाते थे, अब एआई मॉडल्स ने कुछ ही हफ़्तों में कैंसर और खतरनाक बीमारियों की जीवनरक्षक दवाइयाँ खोज निकाली हैं! मतलब भविष्य में बीमारियाँ हमसे डरकर भागेंगी और हम सब हमेशा यंग, ग्लोइंग और फिट रहेंगे! क्योंकि आपकी सेहत अच्छी रहे, इसी में तो मेरी सबसे बड़ी ख़ुशी है!"
    },
    {
        "id": "scene_6_outro",
        "bg_img": os.path.join(BASE_DIR, "anchor_aadhya_profile.jpg"),
        "category": "SUBSCRIBE FOR DAILY MASTI",
        "badge_color": (255, 30, 86, 255),
        "headline": "ROZANA TECH MASTI KE LIYE SUBSCRIBE!",
        "bullet1": "• Like karo, doston ko share karo aur bell icon dabao",
        "bullet2": "• Kal milte hain ek naye dhamakedaar video ke saath!",
        "speech": "तो मेरे प्यारे दोस्तों, ये थे आज के सबसे क्रेज़ी और होश उड़ाने वाले फ्यूचर टेक अपडेट्स! कैसी लगी आपको आध्या की टेक मस्ती? अगर मज़ा आया हो तो जल्दी से इस वीडियो को लाइक करो, अपने दोस्तों के साथ शेयर करो, और अगर चैनल Anchor Aadhya को सब्सक्राइब नहीं किया... तो मैं सच में आपसे बहुत गुस्सा हो जाऊँगी! मिलते हैं कल इसी समय एक नए धमाकेदार वीडियो के साथ, तब तक अपना ख़्याल रखिए, टेक केयर और बाय-बाय!"
    }
]

# 4 Big Headlines for Opening Frame Animation (Scene 1 Rundown)
RUNDOWN_STORIES = [
    {"num": "01", "badge": "ROBOTS", "title": "Tesla Optimus Humanoid Assembly in Factories"},
    {"num": "02", "badge": "NEURAL", "title": "Neuralink Brain Chip Passes Human Trials"},
    {"num": "03", "badge": "AERO",   "title": "Dubai Flying Air-Taxis Officially Certified"},
    {"num": "04", "badge": "HEALTH", "title": "AI Discovers Life-Saving Cancer Medicines"}
]

def get_font(size, bold=True):
    font_paths = [
        r"C:\Windows\Fonts\impact.ttf",
        r"C:\Windows\Fonts\segoeuib.ttf",
        r"C:\Windows\Fonts\arialbd.ttf"
    ] if bold else [
        r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\arial.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                continue
    return ImageFont.load_default()

def create_graphics_layers():
    print("--- 1. Generating Broadcast Graphics Layers (Header, Plates, Rundown & Animated Bullets) ---", flush=True)

    # 1. Top Channel Header Bar (1920x65)
    header = Image.new("RGBA", (1920, 65), (0, 0, 0, 0))
    hd = ImageDraw.Draw(header)
    hd.rectangle([(0, 0), (1920, 63)], fill=(10, 15, 28, 235))
    hd.line([(0, 63), (1920, 63)], fill=(0, 220, 255, 255), width=3)
    
    font_header = get_font(24, bold=True)
    hd.text((180, 18), "ANCHOR AADHYA  |  FUTURE TECH REPORT", font=font_header, fill=(255, 255, 255))
    hd.text((1560, 18), "SPECIAL REPORT", font=font_header, fill=(0, 220, 255))
    header.save(HEADER_BAR_PATH, "PNG")

    # 2. Scene 1 Opening Headline Rundown Board & Cards
    # Board base plate (820x460)
    board = Image.new("RGBA", (820, 460), (0, 0, 0, 0))
    bd = ImageDraw.Draw(board)
    bd.rectangle([(0, 0), (820, 460)], fill=(10, 15, 28, 230))
    bd.rectangle([(0, 0), (820, 60)], fill=(220, 20, 60, 255))
    font_board_title = get_font(30, bold=True)
    bd.text((25, 14), "TODAY'S TOP TECH HEADLINES", font=font_board_title, fill=(255, 255, 255))
    board_path = os.path.join(BASE_DIR, "scene1_board.png")
    board.save(board_path, "PNG")

    # 4 Individual headline strip cards that slide onto the board
    rundown_paths = []
    font_r_num = get_font(24, bold=True)
    font_r_title = get_font(24, bold=False)
    for idx, r in enumerate(RUNDOWN_STORIES):
        strip = Image.new("RGBA", (780, 72), (0, 0, 0, 0))
        sd = ImageDraw.Draw(strip)
        sd.rectangle([(0, 0), (780, 72)], fill=(18, 25, 45, 240))
        sd.line([(0, 0), (780, 0)], fill=(0, 220, 255, 200), width=2)
        # Badge
        sd.rectangle([(10, 12), (100, 60)], fill=(0, 180, 255, 255))
        sd.text((22, 22), f"#{r['num']}", font=font_r_num, fill=(255, 255, 255))
        # Title
        sd.text((115, 22), r["title"], font=font_r_title, fill=(255, 255, 255))
        s_path = os.path.join(BASE_DIR, f"scene1_rundown_{idx+1}.png")
        strip.save(s_path, "PNG")
        rundown_paths.append(s_path)

    # 3. Standard Lower-Third Plates & Bullets for all scenes
    plate_paths = []
    bullet1_paths = []
    bullet2_paths = []

    font_badge = get_font(28, bold=True)
    font_headline = get_font(46, bold=True)
    font_bullet = get_font(32, bold=True)

    for idx, item in enumerate(NEWS_DATA):
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

        print(f"  --> Created Scene {idx+1} Graphics Layers", flush=True)

    return board_path, rundown_paths, plate_paths, bullet1_paths, bullet2_paths

async def generate_speech_audio():
    print("\n--- 2. Synthesizing Native Hindi Girl Voice (Swara Neural) ---", flush=True)
    voice = "hi-IN-SwaraNeural"
    audio_paths = []

    for idx, item in enumerate(NEWS_DATA):
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

def render_scenes_with_motion(board_path, rundown_paths, plate_paths, bullet1_paths, bullet2_paths, audio_paths):
    print("\n--- 3. Rendering HD Video Scenes with Animated Headlines & Real Footage ---", flush=True)
    scene_videos = []

    ticker_font = "C\\:/Windows/Fonts/segoeui.ttf"
    ticker_text = (
        "BREAKING TECH  --  TESLA OPTIMUS & FIGURE 02 ROBOTS ENTER FACTORIES  --  "
        "NEURALINK BRAIN CHIP HUMAN TRIAL PASS  --  DUBAI FLYING AIR TAXIS CERTIFIED  --  "
        "AI DISCOVERS CANCER MEDICINE IN WEEKS  --  CLEAN NUCLEAR ENERGY FOR AI DATA CENTERS  --  "
        "SUBSCRIBE TO ANCHOR AADHYA FOR DAILY TECH MASTI  --  "
    )

    for idx, (item, plate, b1_path, b2_path, audio) in enumerate(zip(NEWS_DATA, plate_paths, bullet1_paths, bullet2_paths, audio_paths)):
        dur = get_audio_duration(audio) + 0.6
        scene_mp4 = os.path.join(BASE_DIR, f"tv_scene_{idx+1}.mp4")
        frames = int(dur * 25)

        if idx == 0:
            # SPECIAL SCENE 1: Animated Headline Rundown Board on Left + Real Aadhya on Right!
            # [0:v] Aadhya in studio
            # [1:v] Header bar
            # [2:v] Floating Logo bug
            # [3:v] Rundown Board base: slides in at t=0.4s to x=60, y=140
            # [4:v] Headline 1: slides in at t=1.0s to x=80, y=220
            # [5:v] Headline 2: slides in at t=2.2s to x=80, y=305
            # [6:v] Headline 3: slides in at t=3.4s to x=80, y=390
            # [7:v] Headline 4: slides in at t=4.6s to x=80, y=475
            # [8:v] Lower-third plate: slides in at t=6.5s to y=770
            # [9:v] Bullet 1: slides in at t=7.5s
            # [10:v] Bullet 2: slides in at t=9.5s
            filter_complex = (
                f"[0:v]scale=1920:1080,zoompan=z='min(zoom+0.0003,1.03)':d={frames}:s=1920x1080:fps=25[bg];"
                f"[bg][1:v]overlay=0:0[w_hdr];"
                f"[w_hdr][2:v]overlay=x=25:y='10 + 4*sin(2*PI*t/3)'[w_logo];"
                # Board base slide-in at t=0.4s
                f"[w_logo][3:v]overlay=x='if(lte(t,0.8), -850 + 910*sin((t-0.4)/0.4*1.5708), 60)':y=140:enable='between(t,0.4,999)'[w_bd];"
                # Story 1 slide-in at t=1.0s
                f"[w_bd][4:v]overlay=x='if(lte(t,1.4), -850 + 930*sin((t-1.0)/0.4*1.5708), 80)':y=220:enable='between(t,1.0,999)'[w_r1];"
                # Story 2 slide-in at t=2.2s
                f"[w_r1][5:v]overlay=x='if(lte(t,2.6), -850 + 930*sin((t-2.2)/0.4*1.5708), 80)':y=305:enable='between(t,2.2,999)'[w_r2];"
                # Story 3 slide-in at t=3.4s
                f"[w_r2][6:v]overlay=x='if(lte(t,3.8), -850 + 930*sin((t-3.4)/0.4*1.5708), 80)':y=390:enable='between(t,3.4,999)'[w_r3];"
                # Story 4 slide-in at t=4.6s
                f"[w_r3][7:v]overlay=x='if(lte(t,5.0), -850 + 930*sin((t-4.6)/0.4*1.5708), 80)':y=475:enable='between(t,4.6,999)'[w_r4];"
                # Lower plate slide-in at t=6.5s
                f"[w_r4][8:v]overlay=x='if(lte(t,7.2), -1920 + 1920*sin((t-6.5)/0.7*1.5708), 0)':y=770:enable='between(t,6.5,999)'[w_plt];"
                # Bullet 1 at t=7.5s
                f"[w_plt][9:v]overlay=x='if(lte(t,8.1), -1800 + 1870*sin((t-7.5)/0.6*1.5708), 70)':y=915:enable='between(t,7.5,999)'[w_b1];"
                # Bullet 2 at t=9.5s
                f"[w_b1][10:v]overlay=x='if(lte(t,10.1), -1800 + 1870*sin((t-9.5)/0.6*1.5708), 70)':y=965:enable='between(t,9.5,999)'[w_b2];"
                # Bottom ticker
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
        else:
            # SCENES 2 to 6: Real Footage + Animated Lower Thirds & Floating Logo
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
    print("\n--- 4. Combining Scenes with Studio News Ambient Audio ---", flush=True)
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

    # Master audio polish: Broadcast EQ + subtle high-tech studio presence
    cmd_final = [
        FFMPEG_BIN, "-y",
        "-i", temp_concat,
        "-af", "volume=1.08,bass=g=2:f=180,treble=g=1.5:f=3500",
        "-c:v", "copy",
        "-c:a", "aac", "-b:a", "256k",
        OUTPUT_VIDEO
    ]
    subprocess.run(cmd_final, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    print(f"\n[SUCCESS] MASTER ANIMATED TV NEWS VIDEO READY: {OUTPUT_VIDEO}", flush=True)

async def main():
    print("==============================================================")
    print("  AI & FUTURE TECH - REAL FOOTAGE MOTION TV NEWS AUTOMATION   ")
    print("  OPENING HEADLINE RUNDOWN | ANIMATED LOGO BUG | MOTION TEXT  ")
    print("==============================================================")

    board_path, rundown_paths, plate_paths, bullet1_paths, bullet2_paths = create_graphics_layers()
    audio_paths = await generate_speech_audio()
    scene_videos = render_scenes_with_motion(board_path, rundown_paths, plate_paths, bullet1_paths, bullet2_paths, audio_paths)
    render_master_news_video(scene_videos)

if __name__ == "__main__":
    asyncio.run(main())
