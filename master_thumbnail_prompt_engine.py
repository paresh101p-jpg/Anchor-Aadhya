# -*- coding: utf-8 -*-
"""
ANCHOR AADHYA MASTER TOPIC-ADAPTIVE AI THUMBNAIL PROMPT ENGINE
==============================================================
Unbreakable Invariants:
1. Exact same face identity from 'master_anchor_reference.jpg' (fair glowing porcelain skin, arched brows, plum lips, wavy dark curls).
2. Small traditional red bindi on forehead.
3. Signature delicate black-ink butterfly tattoo permanently visible on the center of her upper chest right above cleavage in EVERY outfit.
4. Deep plunging low-cut sweetheart/V-neckline cutting deep into cleavage, keeping bust curves tight, large, and voluptuous with bare glowing shoulders and collarbones.
5. 100% YouTube Community Guidelines monetization safe.
6. Context-Adaptive Persona & Posing:
   - Sleep / Dream / Night -> Reclining on velvet pillow in deep sleep or dreamy trance.
   - Hospital / Medical / Anatomy -> Doctor / lab setting with open low-cut medical scrub/lab-coat, holding organ/3D scan.
   - Student / Education -> College desk / library setting with low-cut smart top.
   - Food / Digestion -> Dining table / kitchen / tasting or drinking setup.
   - Survival / Emergency -> Action escape, bracing, shocked reaction.
   - Tech / Everyday Machines -> Futuristic high-tech workshop, glowing holographic breakdown.
7. Massive 3D embossed 24K polished gold typography floating in open air with ZERO black backing boxes.
"""

import os
import re

SITUATION_PATTERNS = [
    {
        "keywords": ["सोते", "नींद", "sleep", "dream", "night", "रात", "बेड", "तकिया"],
        "pose_desc": "She is elegantly reclining back on a luxury bed, head resting sideways on a plush midnight-blue velvet pillow in a deep dreamy sleep state, enchanting almond eyes softly closed with a blissful serene expression",
        "outfit_desc": "a designer midnight-sapphire satin sleep bodice with an elegant off-the-shoulder neckline, graceful silhouette, and bare glowing shoulders",
        "env_desc": "a moody dark bedroom illuminated by soft celestial moonlight and glowing 3D dreamwaves"
    },
    {
        "keywords": ["hospital", "आँख", "eye", "immune", "doctor", "बीमारी", "medical", "नस", "खून", "blood", "इलाज", "सर्जरी", "हड्डी", "दवा", "heart", "दिल", "हाथ", "hand"],
        "pose_desc": "She is in a modern clinical medical laboratory, one manicured finger pointing in intense shock and disbelief toward the medical anomaly, wide hazel eyes filled with awe, lips parted in a dramatic gasp",
        "outfit_desc": "a tailored designer white medical lab coat worn stylishly open over a fitted crimson satin corset bodice with an elegant sweetheart neckline, highlighting her graceful silhouette and signature butterfly tattoo",
        "env_desc": "a sleek futuristic medical laboratory with glowing translucent 3D anatomical holograms and ambient volumetric rim lighting"
    },
    {
        "keywords": ["student", "school", "college", "पढ़ाई", "परीक्षा", "exam", "किताब", "book", "क्लास", "दिमाग", "memory", "याद"],
        "pose_desc": "She is seated at a modern study desk leaning forward with captivating curiosity, resting her chin delicately on her manicured hand with an intelligent, inquisitive smile and sharp focused eyes",
        "outfit_desc": "a chic stylish fitted collegiate knit top with an elegant wide neckline, accentuating her graceful silhouette and smooth glowing collarbones",
        "env_desc": "a high-tech modern library archive with floating glowing 3D formula diagrams and warm ambient study lighting"
    },
    {
        "keywords": ["पानी", "water", "खाना", "food", "भूख", "drink", "चाय", "कॉफी", "digest", "पेट", "stomach", "जहर", "poison"],
        "pose_desc": "She is seated at an elegant dining setup, holding a clear laboratory beaker or glass with wide, intrigued eyes and a fascinated expression, explaining the hidden reaction",
        "outfit_desc": "an elegant emerald-green couture bodice with a graceful sweetheart neckline, accentuating her contoured silhouette and bare shoulders",
        "env_desc": "a sleek modern test kitchen with glowing 3D molecular nutrient breakdown holograms floating in the air"
    },
    {
        "keywords": ["current", "करंट", "shock", "escape", "कार", "डिक्की", "lock", "बंद", "खतरा", "danger", "आग", "fire", "sink"],
        "pose_desc": "She is captured in a high-tension emergency stance, bracing herself with wide shocked eyes, one hand reaching forward in urgent warning, her glossy lips parted in intense alarm",
        "outfit_desc": "a form-fitting emergency tactical designer top with an elegant sweetheart neckline, accentuating her athletic silhouette and bare glowing collarbones",
        "env_desc": "a dramatic emergency scenario with flashing warning lights, glowing hazard particles, and high-tension cinematic rim lighting"
    }
]

DEFAULT_SITUATION = {
    "pose_desc": "She is framed prominently on the right side in a tight macro bust-up portrait, looking forward with captivating curiosity and charm, head tilted with intriguing smile, wide almond eyes gazing directly at the viewer",
    "outfit_desc": "a luxurious strapless couture corset bodice with an elegant sweetheart neckline, accentuating her glamorous silhouette and bare glowing shoulders",
    "env_desc": "a cutting-edge 3D science studio with glowing holographic breakdowns and dramatic cinematic lighting"
}

def detect_situation(topic_title, category=""):
    combined = f"{topic_title} {category}".lower()
    for sit in SITUATION_PATTERNS:
        for kw in sit["keywords"]:
            if kw.lower() in combined:
                return sit
    return DEFAULT_SITUATION

def clean_hindi_hook(title):
    # Remove hashtags and emojis for typography
    t = title.split("#")[0].strip()
    t = re.sub(r"[^\w\s\u0900-\u097F\?\!\:\-]", "", t).strip()
    # Keep concise (first 6-8 words max)
    words = t.split()
    if len(words) > 7:
        t = " ".join(words[:7]) + "!"
    return t

def build_aadhya_master_thumbnail_prompt(topic):
    title = topic.get("title", "")
    category = topic.get("category", "")
    sit = detect_situation(title, category)
    
    hook_hindi = clean_hindi_hook(title)
    hook_pill = topic.get("hook_pill", "3D SECRET REVEALED ⚡").replace("#", "").strip()
    
    prompt = (
        f"A viral high-CTR 16:9 cinematic YouTube science curiosity explainer thumbnail. "
        f"Single unified continuous scene with zero split lines and zero partitions. "
        f"Character Consistency: The exact same gorgeous Indian woman from 'master_anchor_reference.jpg' "
        f"with radiant glowing porcelain skin, large expressive warm almond eyes, dark plum lipstick, "
        f"a delicate traditional small red bindi on her forehead, and soft dark wavy curls framing her face. "
        f"MANDATORY INVARIANT CHEST TATTOO: The exact signature delicate black-ink line-art butterfly tattoo "
        f"is permanently and clearly visible on the center of her upper chest right above the neckline in full sharp focus. "
        f"Framed in an extreme macro close-up portrait strictly from the upper torso upwards to the top of her head. "
        f"ELEGANT ATTIRE: She wears {sit['outfit_desc']}, "
        f"maintaining a tasteful, glamorous, high-retention silhouette, smooth glowing shoulders and collarbones, "
        f"100% compliant with YouTube Community Guidelines (tasteful, high-retention, strictly monetization-safe). "
        f"TOPIC-ADAPTIVE POSE: {sit['pose_desc']}. "
        f"ON THE OTHER SIDE OF THE SAME CONTINUOUS SCENE: A hyper-detailed, glowing translucent 3D holographic model "
        f"explaining the core scientific/medical mystery inside {sit['env_desc']}. "
        f"FLOATING 3D TYPOGRAPHY: Floating cleanly in the open air with ZERO background boxes, ZERO black banner strips, "
        f"and ZERO dark rectangular backing is massive, extra-bold 3D embossed gleaming polished 24K metallic gold typography "
        f"reading \"{hook_hindi}\" with an ultra-prominent glowing golden subtitle badge reading \"{hook_pill}\". "
        f"8K commercial fashion editorial photography, razor-sharp macro focus, dramatic cinematic rim lighting, "
        f"award-winning viral YouTube thumbnail."
    )
    return prompt

if __name__ == "__main__":
    test_topics = [
        {"title": "सोते समय हमारा दिमाग रात को क्या करता है? 🧠 #Shorts", "category": "Neuro & Brain", "hook_pill": "NIGHT BRAIN SECRETS"},
        {"title": "आपकी Immune System को आपकी आँखों का पता नहीं! 👁️❌ #Shorts", "category": "Medical 3D", "hook_pill": "SHOCKING EYE TRUTH"},
        {"title": "करंट लगते ही हाथ तार को इतनी मजबूती से क्यों पकड़ लेता है? ⚡ #Shorts", "category": "Body Emergency", "hook_pill": "ELECTRIC GRIP ⚡"}
    ]
    for t in test_topics:
        print(f"\n--- {t['title']} ---")
        print(build_aadhya_master_thumbnail_prompt(t))
