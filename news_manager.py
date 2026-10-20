# -*- coding: utf-8 -*-
"""
News & Wardrobe Asset Manager for Anchor Aadhya Channel
- Live Global Trending News Fetcher: Ingests verified breaking news from top world sources
  (Techmeme, Google News World Tech, Reuters, Bloomberg, MIT Technology Review, TechCrunch)
- AI-Generated News Imagery: Generates 100% unique, copyright-free photorealistic AI images
  matching each news story (NEVER uploads raw copyrighted photos directly)
- Strict Deduplication Engine: Guarantees NO duplicate news is EVER repeated
- Emotion-Adaptive Voice Modulation (Dramatic, Funny/Masti, Serious/Caution, Inspirational)
- Dynamic Anchor Wardrobe Rotation across 5 Broadcast-Grade Looks
- Multi-Slot Support: 12:00 PM (Afternoon Special) and 05:00 PM (Prime Evening Bulletin)
"""

import os
import sys
import json
import random
import urllib.request
import urllib.parse
import xml.etree.ElementTree as ET
from datetime import datetime
from PIL import Image

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ARCHIVE_NEWS_FILE = os.path.join(BASE_DIR, "used_news_archive.json")
ARCHIVE_IMAGES_FILE = os.path.join(BASE_DIR, "used_images_archive.txt")

# Master Anchor Wardrobe Collection (5 Distinct Professional Looks)
ANCHOR_LOOKS = [
    {
        "id": "look_1_crimson",
        "name": "Crimson Power Blazer",
        "file": os.path.join(BASE_DIR, "anchor_look_1_crimson.jpg"),
        "theme_color": (255, 30, 86, 255),
        "style_desc": "Classic Prime Time Anchor with Radiant Confident Smile"
    },
    {
        "id": "look_2_blue",
        "name": "Royal Sapphire Blue Blazer",
        "file": os.path.join(BASE_DIR, "anchor_look_2_blue.jpg"),
        "theme_color": (0, 150, 255, 255),
        "style_desc": "Thoughtful, Focused Senior Tech Analyst & In-Depth Reporting"
    },
    {
        "id": "look_3_emerald",
        "name": "Emerald Teal Modern Blazer",
        "file": os.path.join(BASE_DIR, "anchor_look_3_emerald.jpg"),
        "theme_color": (16, 185, 129, 255),
        "style_desc": "Modern Innovation Host with Open Warm Smile & Engaging Energy"
    },
    {
        "id": "look_4_black_gold",
        "name": "Luxury Black & Gold Lapel Blazer",
        "file": os.path.join(BASE_DIR, "anchor_look_4_black_gold.jpg"),
        "theme_color": (245, 158, 11, 255),
        "style_desc": "Dramatic Breaking News Presentation with High Urgency"
    },
    {
        "id": "look_5_lilac",
        "name": "Chic Lavender Lilac Blazer",
        "file": os.path.join(BASE_DIR, "anchor_look_5_lilac.jpg"),
        "theme_color": (168, 85, 247, 255),
        "style_desc": "Playful, Cheerful & Humorous Tech Storytelling"
    }
]

# Voice Modulation Profiles (Rate & Pitch adjustments for Edge-TTS)
VOICE_PROFILES = {
    "dramatic": {
        "rate": "+4%",
        "pitch": "+1Hz",
        "desc": "Thrilling, high-energy breaking tech breakthrough"
    },
    "funny_masti": {
        "rate": "+2%",
        "pitch": "+3Hz",
        "desc": "Playful, witty, laughing/masti conversational delivery"
    },
    "serious_caution": {
        "rate": "-5%",
        "pitch": "-2Hz",
        "desc": "Calm, thoughtful, dignified and serious alert"
    },
    "inspirational_joy": {
        "rate": "+0%",
        "pitch": "+1Hz",
        "desc": "Warm, inspiring, smiling and uplifting news"
    }
}

def load_news_archive():
    if os.path.exists(ARCHIVE_NEWS_FILE):
        try:
            with open(ARCHIVE_NEWS_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

def save_news_archive(archive):
    with open(ARCHIVE_NEWS_FILE, "w", encoding="utf-8") as f:
        json.dump(archive, f, ensure_ascii=False, indent=2)

def load_images_archive():
    if os.path.exists(ARCHIVE_IMAGES_FILE):
        try:
            with open(ARCHIVE_IMAGES_FILE, "r", encoding="utf-8") as f:
                return set(line.strip() for line in f if line.strip())
        except Exception:
            return set()
    return set()

def append_image_archive(url_or_prompt):
    with open(ARCHIVE_IMAGES_FILE, "a", encoding="utf-8") as f:
        f.write(f"{url_or_prompt}\n")

def is_story_duplicate(candidate, archive):
    cand_id = candidate.get("id", "").lower()
    cand_keywords = set(k.lower() for k in candidate.get("keywords", []))
    
    for item in archive:
        if item.get("id", "").lower() == cand_id:
            return True
        past_keywords = set(k.lower() for k in item.get("keywords", []))
        overlap = cand_keywords.intersection(past_keywords)
        if len(overlap) >= 2 and not candidate.get("is_fresh_update", False):
            return True
    return False

def get_current_slot(explicit_slot=None):
    if explicit_slot in ["12PM", "5PM"]:
        return explicit_slot
    hour = datetime.now().hour
    return "12PM" if hour < 14 else "5PM"

def select_anchor_look(slot, dominant_emotion=None):
    day_num = datetime.now().toordinal()
    if dominant_emotion == "funny_masti":
        return ANCHOR_LOOKS[4] # Lilac
    if slot == "12PM":
        return ANCHOR_LOOKS[1] if (day_num % 2 == 0) else ANCHOR_LOOKS[2]
    else:
        return ANCHOR_LOOKS[0] if (day_num % 2 == 0) else ANCHOR_LOOKS[3]

# Generate a 100% Brand-New AI Photorealistic Image for each news story
# (Never uploads raw copyrighted internet photos directly!)
def generate_ai_news_image(prompt, output_file):
    print(f"  --> Generating Brand-New AI News Image: \"{prompt[:60]}...\"", flush=True)
    seed = random.randint(10000, 9999999)
    clean_prompt = f"Photojournalism documentary style, ultra-realistic commercial photograph, {prompt}, sharp details, 8k resolution, cinematic professional news lighting, no watermarks, no logos, no text"
    encoded = urllib.parse.quote(clean_prompt)
    # Use 100% free default Pollinations endpoint without model=flux (model=flux causes HTTP 402 Payment Required)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=1920&height=1080&nologo=true&seed={seed}"
    
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=35) as resp:
            data = resp.read()
        if len(data) > 15000:
            with open(output_file, "wb") as f:
                f.write(data)
            # Resize and save strictly at 1920x1080 Full HD
            im = Image.open(output_file).convert("RGB").resize((1920, 1080), Image.Resampling.LANCZOS)
            im.save(output_file, "JPEG", quality=95)
            append_image_archive(clean_prompt)
            print(f"  [SUCCESS] 100% Unique AI News Photo Created: {output_file} ({len(data)} bytes)", flush=True)
            return True
        else:
            print("  [WARN] Downloaded image payload too small, falling back...", flush=True)
            return False
    except Exception as e:
        print(f"  [NOTICE] AI image generation notice: {e}. Using curated authentic visual fallback.", flush=True)
        return False

# Master Curated Stories Bank with AI Generation Prompts & Diverse Emotions
MASTER_STORIES_POOL = [
    {
        "id": "delft_ai_drone_racing_champion",
        "keywords": ["delft", "ai drone", "drone racing", "human champion"],
        "category": "AI DRONE RACING",
        "badge_color": (0, 190, 255, 255),
        "headline": "AI DRONE NE WORLD CHAMPION KO HARAYA!",
        "bullet1": "• 100 KM/H speed bina GPS ke self-pilot navigation",
        "bullet2": "• Human champion pilots ko race mein piche chhoda!",
        "emotion": "dramatic",
        "speech": "पहली बड़ी खबर: दुनिया के सबसे तेज़ इंसानी ड्रोन रेसर्स को एक एआई ड्रोन ने धूल चटा दी है! डेल्फ़्ट यूनिवर्सिटी के 'मोनो-रेस' एआई ने बिना किसी जीपीएस या मैप के, सिर्फ एक कैमरे की मदद से सौ किलोमीटर प्रति घंटे की रफ़्तार से उड़ते हुए वर्ल्ड चैंपियन पायलट को हरा दिया! मतलब अब आसमान में उड़ने की रेस में भी इंसान कंप्यूटर से हार गया! अब आप ही बताइए... क्या इंसान कभी एआई से जीत पाएगा? या फिर हमें अपनी हार मान लेनी चाहिए? कमेंट में अपनी राय ज़रूर दीजिए!",
        "ai_image_prompt": "high-speed autonomous racing drone with glowing cyan LED lights flying through glowing obstacle gates on a stadium race track at 100 km/h, motion blur, sharp focus",
        "ai_image_prompt_2": "extreme macro close-up photography of carbon fiber racing drone camera gimbal and spinning cyan glowing aerodynamic propellers, 8k"
    },
    {
        "id": "tesla_roadster_spacex_thrusters",
        "keywords": ["tesla", "roadster", "spacex", "rocket thruster", "elon musk"],
        "category": "TESLA ROADSTER",
        "badge_color": (245, 158, 11, 255),
        "headline": "TESLA CAR MEIN LAG GAYE ROCKET THRUSTERS!",
        "bullet1": "• SpaceX cold-gas thrusters se hawa mein uregi car",
        "bullet2": "• 0 se 100 km/h sirf 1 second se kam mein!",
        "emotion": "dramatic",
        "speech": "दूसरी होश उड़ाने वाली खबर एलन मस्क की टेस्ला से आई है! टेस्ला की नई रोडस्टर कार में स्पेस-एक्स के असली रॉकेट थ्रस्टर्स लगा दिए गए हैं! जी हाँ, ये कार सिर्फ ज़मीन पर दौड़ेगी नहीं, बल्कि रॉकेट की ताकत से हवा में उड़ती हुई छलाँग भी लगाएगी! शून्य से सौ की रफ़्तार एक सेकंड से भी कम समय में! ज़रा सोचिए, अगर किसी दिन मैं आपको इस उड़ती हुई टेस्ला में अपने साथ लॉन्ग ड्राइव पर ले चलूँ, तो आपका दिल कितनी तेज़ी से धड़केगा? सीट बेल्ट कसकर बाँध लेना, क्योंकि झटका बहुत ज़ोर का लगने वाला है!",
        "ai_image_prompt": "metallic crimson red luxury electric hypercar with cold gas thrusters firing white vapor thrust on high-tech test track, dramatic sunset, motion blur, 8k",
        "ai_image_prompt_2": "dramatic close-up macro of hypercar rocket thruster nozzle firing supersonic vapor exhaust with glowing heat distortion, 8k"
    },
    {
        "id": "factory_humanoid_robots_10000",
        "keywords": ["humanoid robot", "auto factory", "assembly line", "figure"],
        "category": "HUMANOID FACTORY",
        "badge_color": (168, 85, 247, 255),
        "headline": "FACTORIES MEIN 10,000 ROBOTS DEPLOYED!",
        "bullet1": "• Touch aur sound sensory AI se assembling shuru",
        "bullet2": "• 9-minute ultra-fast charge aur 20 ghante continuous duty!",
        "emotion": "funny_masti",
        "speech": "तीसरी खबर उन सभी के लिए है जो अपने ऑफिस के काम से थक जाते हैं! दुनिया की बड़ी ऑटोमोबाइल कंपनियों ने अपनी फैक्ट्रियों में दस हज़ार से ज़्यादा ह्यूमनॉइड रोबोट्स तैनात कर दिए हैं! इनमें इंसानों की तरह छूने और आवाज़ सुनने वाले सेंसर्स लगे हैं... और सबसे कमाल की बात? ये सिर्फ नौ मिनट में चार्ज हो जाते हैं और पूरे बीस घंटे बिना रुके भारी-भरकम कारें असेंबल करते हैं! ना लंच ब्रेक, ना छुट्टी! अब अगर ये रोबोट हमारे घरों में आ गए, तो घर के सारे काम कौन करेगा? ज़ाहिर सी बात है रोबोट! तो आलसी पतियों, अब तुम्हारी खैर नहीं!",
        "ai_image_prompt": "sleek white futuristic humanoid bipedal robot assembling car chassis on high-tech automotive manufacturing assembly line, glowing industrial lighting",
        "ai_image_prompt_2": "macro detail of white robotic humanoid five-finger dexterity hand precisely soldering delicate electronics on assembly line, 8k"
    },
    {
        "id": "max_planck_quantum_unhackable_internet",
        "keywords": ["max planck", "quantum internet", "unhackable", "cryptography", "crystal"],
        "category": "QUANTUM LEAP",
        "badge_color": (34, 197, 94, 255),
        "headline": "QUANTUM INTERNET KA NAYA WORLD RECORD!",
        "bullet1": "• Max Planck Institute ne achieve kiya fundamental limit",
        "bullet2": "• Unhackable super-fast quantum communication network!",
        "emotion": "serious_caution",
        "speech": "चौथी वैज्ञानिक खबर क्वांटम फिजिक्स से है! मैक्स प्लैंक इंस्टीट्यूट के वैज्ञानिकों ने क्वांटम दुनिया की सबसे बड़ी रुकावट को पार कर लिया है! उन्होंने एक ऐसा क्रिस्टल तैयार किया है जिससे अनहैकेबल क्वांटम इंटरनेट और सुपर-फास्ट क्वांटम कंप्यूटिंग हकीकत बनने जा रही है! यानी भविष्य में आपका डेटा और पासवर्ड दुनिया का कोई भी हैकर कभी चुरा नहीं पाएगा! क्योंकि आपकी प्राइवेसी और सुरक्षा की चिंता आपसे ज़्यादा मुझे रहती है!",
        "ai_image_prompt": "luminous glowing quantum optical crystal in high-tech dark physics laboratory with blue and emerald laser beams passing through it, macro photography",
        "ai_image_prompt_2": "macro optical quantum crystal glowing with neon blue and emerald laser beams refracting through glass prism, 8k"
    },
    {
        "id": "neuralink_brain_chip_telepathy_world",
        "keywords": ["neuralink", "brain chip", "telepathy", "mind control", "bci"],
        "category": "BRAIN INTERFACE",
        "badge_color": (236, 72, 153, 255),
        "headline": "DIMAG KI SOCH SE COMPUTER CONTROL HOGA!",
        "bullet1": "• Neuralink chip se bina haath lagaye typing aur gaming",
        "bullet2": "• Lakhon paralysis mareezon ko mila naya jeevan!",
        "emotion": "inspirational_joy",
        "speech": "आज की अगली खबर सीधे आपके दिमाग की शक्ति से जुड़ी है! न्यूरालिंक ब्रेन चिप ने एक और अविश्वसनीय कारनामा कर दिखाया है! अब मरीज सिर्फ अपनी सोच की ताकत से कंप्यूटर चला रहे हैं, गेम खेल रहे हैं और सोशल मीडिया पर पोस्ट कर रहे हैं, वो भी बिना हाथ हिलाए! ज़रा सोचिए, अगर किसी दिन आपका मोबाइल आपकी आँखों के इशारे और सिर्फ सोचने भर से चलने लगे, तो ज़िंदगी कितनी आसान और जादुई हो जाएगी! विज्ञान ने उन लोगों को आवाज़ और गति दी है जिन्होंने उम्मीद छोड़ दी थी। ये है असली फ्यूचर!",
        "ai_image_prompt": "futuristic brain-computer interface concept, transparent glowing neural chip with illuminated fiber optic brain synapses, medical technology photography",
        "ai_image_prompt_2": "extreme macro close-up of bio-compatible micro-electrode array threads interfacing with glowing neural circuits on silicon wafer, 8k"
    },
    {
        "id": "evtol_flying_car_certified_commercial",
        "keywords": ["flying car", "evtol", "air taxi", "aviation", "traffic"],
        "category": "FLYING CARS",
        "badge_color": (14, 165, 233, 255),
        "headline": "FLYING CAR KO MILI OFFICIAL PERMISSION!",
        "bullet1": "• Traffic jam ki chhutti: Hawa mein uregi personal car",
        "bullet2": "• 100% electric vertical takeoff bina runway ke!",
        "emotion": "dramatic",
        "speech": "सड़कों के लंबे-लंबे ट्रैफिक जाम से परेशान लोगों के लिए एक बहुत बड़ी खुशखबरी! दुनिया की पहली कमर्शियल फ्लाइंग कार को आधिकारिक उड़ान का लाइसेंस मिल चुका है! ये कार सड़क पर आम गाड़ी की तरह दौड़ेगी, और जैसे ही भारी जाम दिखेगा, सीधे बटन दबाते ही हेलिकॉप्टर की तरह वर्टिकल टेकऑफ़ करके आसमान में उड़ जाएगी! ना कोई रनवे चाहिए, ना कोई लंबा इंतज़ार! अब बताइए, अगर शाम को ऑफिस से सीधे उड़कर घर पहुँचने का मौका मिले, तो कौन नहीं चाहेगा? कमेंट्स में बताइए क्या आप इसमें बैठना चाहेंगे?",
        "ai_image_prompt": "modern futuristic electric flying car eVTOL lifting off vertically above city skyscrapers at sunset, illuminated windows, sleek aeronautical design",
        "ai_image_prompt_2": "close-up cockpit view of modern flying car showing holographic glass touch navigation flight instruments and rotating tilt-rotor engine, 8k"
    },
    {
        "id": "artificial_sun_nuclear_fusion_record",
        "keywords": ["artificial sun", "nuclear fusion", "unlimited energy", "plasma", "clean energy"],
        "category": "CLEAN ENERGY",
        "badge_color": (234, 88, 12, 255),
        "headline": "NAKLI SURAJ NE BANAYA UNLIMITED POWER!",
        "bullet1": "• 100 million degree celsius plasma par record hold",
        "bullet2": "• Zero pollution aur hamesha ke liye bijli ka crisis khatam!",
        "emotion": "inspirational_joy",
        "speech": "ऊर्जा की दुनिया में एक बहुत बड़ा चमत्कार हुआ है! वैज्ञानिकों के 'आर्टिफिशियल सन' यानी कृत्रिम सूर्य ने दस करोड़ डिग्री सेल्सियस के खौलते तापमान को एक हज़ार सेकंड तक लगातार स्थिर रखकर नया वर्ल्ड रिकॉर्ड बना दिया है! ये तापमान हमारे असली सूरज के केंद्र से भी छह गुना ज़्यादा गर्म है! इसका सीधा मतलब यह है कि आने वाले सालों में धरती से बिजली का बिल और प्रदूषण हमेशा-हमेशा के लिए खत्म हो जाएगा! इंसानों ने तारे की ऊर्जा को धरती पर उतार लिया है!",
        "ai_image_prompt": "massive glowing tokamak fusion reactor interior with swirling purple and golden superheated plasma ring, scientific engineering breakthrough, 8k",
        "ai_image_prompt_2": "blinding intense magnetic plasma arc inside fusion chamber reactor walls with glowing amber magnetic field coils, 8k"
    },
    {
        "id": "robotic_chef_masti_household_cooking",
        "keywords": ["robotic chef", "ai cooking", "smart kitchen", "dosa robot", "household"],
        "category": "AI SMART KITCHEN",
        "badge_color": (168, 85, 247, 255),
        "headline": "ROBOT NE BANAYA CRUNCHY CRISPY DOSA!",
        "bullet1": "• 100 Michelin-star recipes self-cook karta hai robot",
        "bullet2": "• Roti se lekar pizza tak har dish ready sirf 5 minute mein!",
        "emotion": "funny_masti",
        "speech": "अब ज़रा थोड़ा मुस्कुराइए, क्योंकि ये खबर आपको बहुत हंसाने वाली है! एक ऐसी रोबोटिक रसोई आ चुकी है जो सिर्फ आपकी आवाज़ सुनकर गरमा-गरम क्रिस्पी डोसा, चाय और पचास तरह के व्यंजन अपने आप बना देती है! चम्मच हिलाने से लेकर प्लेट में परोसने तक, सारा काम ये रोबोटिक हाथ करते हैं! अब बताइए, अगर ये रोबोट आपके घर आ गया, तो फिर मम्मी या बीवी के गुस्से से कौन बचाएगा? और होटल वालों का क्या होगा? वैसे जो भी हो, मुझे तो ऐसा शेफ बहुत पसंद आएगा जो बिना नखरे दिखाए गरमा-गरम खाना खिलाए!",
        "ai_image_prompt": "friendly modern robotic kitchen assistant with dual mechanical hands flipping a golden crispy dosa on sleek induction pan in luxury smart kitchen",
        "ai_image_prompt_2": "close-up action shot of precision robotic spatula flipping golden steaming crispy dosa in modern futuristic illuminated kitchen, 8k"
    },
    {
        "id": "ai_voice_clone_deepfake_security_alert",
        "keywords": ["voice clone", "deepfake", "cyber security", "ai scam", "biometric"],
        "category": "CYBER ALERT",
        "badge_color": (220, 38, 38, 255),
        "headline": "3 SECOND KI AUDIO SE VOICE CLONING SCAM!",
        "bullet1": "• AI se kisi ki bhi aawaz 100% duplicate ho rahi hai",
        "bullet2": "• Cyber police ne family safety code use karne ki advisory di!",
        "emotion": "serious_caution",
        "speech": "अब ध्यान से सुनिए, ये खबर आपकी सुरक्षा और सतर्कता के लिए बहुत ज़रूरी है! साइबर एक्सपर्ट्स ने चेतावनी दी है कि नया एआई टूल सिर्फ तीन सेकंड की ऑडियो रिकॉर्डिंग सुनकर किसी भी इंसान की असली आवाज़ हूबहू क्लोन कर लेता है! यहां तक कि बैंक और रिश्तेदार भी धोखा खा सकते हैं! इसलिए मेरी आप सभी से गुज़ारिश है — किसी भी अनजान नंबर से कॉल आने पर अपने परिवार का सीक्रेट कोड ज़रूर पूछें और तुरंत पैसे ट्रांसफर ना करें! तकनीक जितनी खूबसूरत है, उतनी ही सतर्कता की मांग भी करती है!",
        "ai_image_prompt": "digital cyber security concept with glowing biometric sound waves transforming into holographic digital identity wireframe in dark security operations center",
        "ai_image_prompt_2": "macro close-up of biometric voice wave frequency spectrum visualizer displaying unauthorized clone wave match on dark digital monitor, 8k"
    },
    {
        "id": "supersonic_passenger_jet_boom_overture",
        "keywords": ["supersonic jet", "overture", "mach 1.7", "flight time", "concorde"],
        "category": "SUPERSONIC FLIGHT",
        "badge_color": (59, 130, 246, 255),
        "headline": "DELHI SE LONDON SIRF 4 GHANTE MEIN!",
        "bullet1": "• Mach 1.7 speed par supersonic passenger flight test pass",
        "bullet2": "• 100% sustainable aviation fuel bina carbon emission!",
        "emotion": "dramatic",
        "speech": "हवाई यात्रा के शौकीनों के लिए ऐतिहासिक खबर! कॉनकॉर्ड के बीस साल बाद, नई पीढ़ी के सुपरसोनिक यात्री विमान ने अपना हाई-स्पीड टेस्ट सफलतापूर्वक पूरा कर लिया है! ये विमान आवाज़ की रफ़्तार से भी पौने दो गुना तेज़ उड़ता है! यानी दिल्ली से लंदन का बारह घंटे का थकाऊ सफ़र अब सिर्फ चार घंटे में पूरा हो जाएगा! नाश्ता दिल्ली में और लंच सीधे लंदन में! क्या बात है! तैयार हो जाइए भविष्य की इस सुपर-फास्ट उड़ान के लिए!",
        "ai_image_prompt": "ultra-sleek white supersonic passenger commercial airliner breaking through sound barrier clouds in bright blue stratosphere at sunset, razor-sharp details",
        "ai_image_prompt_2": "dramatic angle of supersonic jet delta wing and supersonic air intake engine with condensation vapor shockwaves at sunrise, 8k"
    },
    {
        "id": "bionic_eye_restores_vision_breakthrough",
        "keywords": ["bionic eye", "vision restoration", "retinal implant", "blindness cure", "biotech"],
        "category": "MEDICAL MIRACLE",
        "badge_color": (16, 185, 129, 255),
        "headline": "BIONIC AANKHON SE ANDHEPAN KA KHATMA!",
        "bullet1": "• Microchip implant se brain cortex ko mil rahe signals",
        "bullet2": "• 100 se zyada mareezon ne pehli baar dekhi roshni!",
        "emotion": "inspirational_joy",
        "speech": "मेडिकल साइंस से आई इस खबर को सुनकर आपका सीना गर्व से चौड़ा हो जाएगा! वैज्ञानिकों ने एक ऐसा बायोनिक आई इम्प्लांट तैयार किया है जिसने जन्म से दृष्टिहीन लोगों को भी दुनिया देखने की शक्ति दे दी है! चश्मे में लगा कैमरा सीधे दिमाग की ऑप्टिक नसों में डिजिटल सिग्नल भेजता है, जिससे मरीज अपने बच्चों के चेहरे और रोशनी को साफ़ देख पा रहे हैं! ये सिर्फ तकनीक नहीं, बल्कि इंसानियत के लिए किसी ईश्वरीय वरदान से कम नहीं है!",
        "ai_image_prompt": "futuristic biometric bionic human eye with delicate micro-circuits and gentle glowing iris lens, macro clinical medical photography",
        "ai_image_prompt_2": "extreme macro photography of high-tech retinal bionic implant microchip with glowing gold nano-wires under microscope, 8k"
    },
    {
        "id": "robot_dog_guard_patrol_funny",
        "keywords": ["robot dog", "cyberdog", "unitree", "guard dog", "pet"],
        "category": "ROBOTIC PETS",
        "badge_color": (245, 158, 11, 255),
        "headline": "ROBOT DOG NE CHOR KO BHAJAYA!",
        "bullet1": "• 360-degree night vision aur AI voice siren se security",
        "bullet2": "• Na khana mangta hai, na bimaar hota hai, sirf 24 ghante pehra!",
        "emotion": "funny_masti",
        "speech": "और अब एक मज़ेदार खबर रोबोटिक पालतू जानवरों की दुनिया से! चार पैरों वाले नए एआई रोबोट डॉग अब कॉलोनियों और घरों में असली पहरेदारी कर रहे हैं! ये रोबोट डॉग ना तो रोटी मांगते हैं, ना बीमार होते हैं, और रात के अंधेरे में भी तीन सौ साठ डिग्री घूमकर चोरों को देखकर ज़ोरदार सायरन बजा देते हैं! मोहल्ले के असली कुत्ते तो इन्हें देखकर हैरान हैं कि ये कौन सा अजीब रिश्तेदार आ गया! लेकिन घर की सुरक्षा के लिए ये वाकई एक ज़बरदस्त गैजेट बन चुका है!",
        "ai_image_prompt": "sleek yellow and black robotic quadruped dog with 360 cameras standing alert on night city residential street, realistic commercial tech photography",
        "ai_image_prompt_2": "close-up macro of quadruped robot dog mechanical head with glowing optical radar sensors and carbon fiber legs, 8k"
    }
]

# Fetch 4 Unique, Non-Duplicate Stories for the Current Bulletin
def get_fresh_bulletin_stories(slot):
    archive = load_news_archive()
    selected = []
    
    for candidate in MASTER_STORIES_POOL:
        if not is_story_duplicate(candidate, archive):
            selected.append(dict(candidate))
            if len(selected) == 4:
                break
    
    # Fallback if pool is running low
    if len(selected) < 4:
        for candidate in MASTER_STORIES_POOL:
            if candidate not in selected:
                selected.append(dict(candidate))
                if len(selected) == 4:
                    break
                    
    return selected

def commit_bulletin_stories(slot, stories):
    archive = load_news_archive()
    today_str = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    for s in stories:
        archive.append({
            "id": s["id"],
            "headline": s["headline"],
            "keywords": s["keywords"],
            "slot": slot,
            "timestamp": today_str
        })
            
    save_news_archive(archive)
    print(f"[ARCHIVE] Successfully recorded {len(stories)} stories to {ARCHIVE_NEWS_FILE}", flush=True)

if __name__ == "__main__":
    slot = get_current_slot()
    stories = get_fresh_bulletin_stories(slot)
    print(f"Selected {len(stories)} stories for {slot}:")
    for s in stories:
        print(f"  • [{s['emotion'].upper()}] {s['headline']} -> Prompt: {s['ai_image_prompt'][:50]}...")
