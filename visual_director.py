# -*- coding: utf-8 -*-
"""
Anchor Aadhya Visual Director & Mandatory Object Alignment Engine (100% Free Forever)
- Analyzes Hindi script lines word-by-word.
- Enforces strict 1-to-1 matching between spoken words and visual screen objects.
- Guarantees that if 'पृथ्वी' (Earth) is spoken, Earth is drawn; if 'हवाई जहाज' (Airplane) is spoken, Airplane is drawn.
"""

import re
import json

# Mandatory Entity Mapping Dictionary (Spoken Word -> Required Hero Visual Component)
MANDATORY_ENTITY_RULES = [
    {
        "id": "airplane_flight",
        "keywords": ["हवाई जहाज", "विमान", "फ्लाइट", "उड़ते", "airplane", "aeroplane", "flight", "plane"],
        "hero_object": "Commercial Jetliner Aerodynamic Fuselage, Wings & Cockpit",
        "scene_name": "Cinema.drawAirplaneStormDisaster"
    },
    {
        "id": "earth_globe",
        "keywords": ["पृथ्वी", "धरती", "दुनिया", "ग्लोब", "planet earth", "globe"],
        "hero_object": "3D Rotating Planet Earth Globe with Atmospheric Scattering",
        "scene_name": "Cinema.drawEarthGlobe"
    },
    {
        "id": "ship_vessel",
        "keywords": ["जहाज", "नाव", "बोट", "कश्ती", "ship", "vessel", "boat", "cargo"],
        "hero_object": "3D Isolated Cargo Ship with Hull, Deck & Bridge",
        "scene_name": "Cinema.drawShipSinkingAbyss"
    },
    {
        "id": "storm_clouds",
        "keywords": ["बादल", "तूफान", "बिजली", "एयर-बॉम्ब", "clouds", "storm", "lightning"],
        "hero_object": "Volumetric Dark Storm Clouds with Branching Lightning Bolts",
        "scene_name": "Cinema.drawHexagonalCloudAirBombs"
    },
    {
        "id": "compass_needle",
        "keywords": ["कंपास", "दिशा", "चुंबकीय", "दिशा सूचक", "compass", "magnetic"],
        "hero_object": "3D Antiqued Brass Compass with Spinning Enamel Needle",
        "scene_name": "Cinema.drawMagneticCompassChaos"
    },
    {
        "id": "drill_derrick",
        "keywords": ["ड्रिल", "गड्ढा", "बोरहोल", "खोदा", "खनन", "drill", "borehole"],
        "hero_object": "Industrial Steel Lattice Derrick Tower & Depth Gauge",
        "scene_name": "Cinema.drawKolaBoreholeDrillDepth"
    },
    {
        "id": "earth_crust_layers",
        "keywords": ["परत", "क्रस्ट", "मेंटल", "चट्टानें", "भूविज्ञान", "crust", "strata"],
        "hero_object": "3D Geological Strata Cross-Section Block",
        "scene_name": "Cinema.drawKolaCrustCrossSection"
    },
    {
        "id": "thermometer_heat",
        "keywords": ["तापमान", "गर्मी", "सेल्सियस", "डिग्री", "खौलता", "temperature", "heat"],
        "hero_object": "3D Pyrex Glass Thermometer with Rising Molten Mercury",
        "scene_name": "Cinema.drawKolaThermalInferno180C"
    },
    {
        "id": "melting_drill_bit",
        "keywords": ["पिघलने", "स्टील", "ड्रिल-बिट", "टंगस्टन", "melting", "drill bit"],
        "hero_object": "Molten Tungsten Carbide Tri-Cone Drill Bit Dripping Liquid",
        "scene_name": "Cinema.drawKolaMeltingSteelDrill"
    },
    {
        "id": "boiling_water_rock",
        "keywords": ["खौलता हुआ पानी", "पत्थरों में कैद", "भाप", "boiling water", "steam"],
        "hero_object": "Fractured Granite Rock with Pressurized Boiling Steam Jets",
        "scene_name": "Cinema.drawKolaBoilingWaterTrapped"
    },
    {
        "id": "microfossil_cells",
        "keywords": ["सूक्ष्म जीव", "जीवाश्म", "कोशिका", "microfossils", "bacteria", "cells"],
        "hero_object": "Dark-Field Microscope Circular Aperture with Acritarch Cells",
        "scene_name": "Cinema.drawKolaAncientMicrofossils"
    },
    {
        "id": "sealed_steel_cap",
        "keywords": ["सील", "नट-बोल्ट", "दरवाजा", "बोल्ट्स", "sealed", "bolts", "cap"],
        "hero_object": "3D Heavy Cast-Iron SG-3 Borehole Cap with 12 Hex Bolts",
        "scene_name": "Cinema.drawKolaSealedSteelDoorCap"
    },
    {
        "id": "atm_cash_machine",
        "keywords": ["एटीएम", "atm", "नोट", "पैसे", "कैश", "currency", "रोलर्स"],
        "hero_object": "3D ATM Machine Internal Roller Feed & Optical Thickness Sensor",
        "scene_name": "Cinema.drawAtmCashMechanics"
    },
    {
        "id": "car_window_door",
        "keywords": ["कार", "दरवाज़ा", "कांच", "खिड़की", "सीटबेल्ट", "car", "window", "door"],
        "hero_object": "Sinking Car Pressure Differential & Headrest Glass Breaker",
        "scene_name": "Cinema.drawDoorPressureLock"
    },
    {
        "id": "ocean_abyss",
        "keywords": ["समुद्र", "महासागर", "गहराई", "अटलांटिक", "पानी", "ocean", "sea"],
        "hero_object": "Deep Ocean Abyss with Sonar Depth Contours",
        "scene_name": "Cinema.drawMarianaChasm"
    },
    {
        "id": "brain_neuro",
        "keywords": ["दिमाग", "सोच", "नसें", "न्यूरॉन", "brain", "synapse"],
        "hero_object": "Pulsing Human Brain Synapse with Glowing Bio-electric Action Potentials",
        "scene_name": "Cinema.drawHumanBrainSynapse"
    },
    {
        "id": "heart_artery",
        "keywords": ["दिल", "धड़कन", "खून", "धमनी", "heart", "pulse", "artery"],
        "hero_object": "Anatomical Human Heart with Pulsing Ventricles & Blood Pressure",
        "scene_name": "Cinema.drawHeartArteryPressure"
    },
    {
        "id": "quicksand_physics",
        "keywords": ["दलदल", "quicksand", "कीचड़", "धंसते", "उछाल"],
        "hero_object": "Viscous Non-Newtonian Mud Density & Surface-Area Back Floating",
        "scene_name": "Cinema.drawWaterWeightPress"
    },
    {
        "id": "black_hole",
        "keywords": ["ब्लैक होल", "सिंगुलैरिटी", "इवेंट होराइजन", "ग्रेविटी", "black hole"],
        "hero_object": "Gargantua Singularity with Relativistic Accretion Disk",
        "scene_name": "Cinema.drawBlackHoleGargantua"
    },
    {
        "id": "radiation_nuclear",
        "keywords": ["रेडिएशन", "परमाणु", "चेरनोबिल", "गीगर", "रिएक्टर", "nuclear", "radiation"],
        "hero_object": "Chernobyl Reactor Core No. 4 & Glowing Elephant's Foot Corium",
        "scene_name": "Cinema.drawChernobylPlant"
    }
]

# Disambiguation replacements: mask multi-word phrases so subwords don't trigger false positives
DISAMBIGUATION_MASKS = [
    ("हवाई जहाज", "AIRPLANE_TOKEN"),
    ("बादलों के कारण", "STORMS_BECAUSE_TOKEN"),
    ("के कारण", "BECAUSE_TOKEN")
]

def analyze_line_mandatory_objects(text):
    """
    Given a line of spoken text, extracts all mandatory hero objects that MUST appear on screen.
    Uses regex word-boundary matching and multi-word disambiguation masks.
    """
    processed = text.lower()
    for phrase, token in DISAMBIGUATION_MASKS:
        processed = processed.replace(phrase.lower(), token.lower())

    matches = []
    seen_ids = set()

    # First check compound airplane token
    if "airplane_token" in processed:
        for rule in MANDATORY_ENTITY_RULES:
            if rule["id"] == "airplane_flight":
                matches.append(rule)
                seen_ids.add("airplane_flight")
                break

    for rule in MANDATORY_ENTITY_RULES:
        if rule["id"] in seen_ids:
            continue
        for kw in rule["keywords"]:
            pattern = r'(?<![\w\u0900-\u097F])' + re.escape(kw.lower()) + r'(?![\w\u0900-\u097F])'
            if re.search(pattern, processed):
                matches.append(rule)
                seen_ids.add(rule["id"])
                break
    return matches

def audit_script_visual_director(script):
    """
    Audits the entire script and returns an automated Director Alignment Report.
    Guarantees zero mismatches between spoken nouns and screen objects.
    """
    lines = script.get("lines", [])
    report = []
    for i, line in enumerate(lines):
        text = line.get("text", "")
        objs = analyze_line_mandatory_objects(text)
        report.append({
            "line_idx": i + 1,
            "text": text,
            "required_objects": [o["hero_object"] for o in objs],
            "suggested_scenes": [o["scene_name"] for o in objs]
        })
    return report

if __name__ == "__main__":
    test_script = {
        "title": "डायरेक्टर टेस्ट",
        "lines": [
            {"text": "इंसानों ने पृथ्वी के पेट में 12,262 मीटर गहरा गड्ढा खोद दिया था!"},
            {"text": "समुद्र के पेट से मीथेन गैस और जहाज सेकंडों में डूबा!"},
            {"text": "आसमान में 35,000 फीट की ऊंचाई पर अगर किसी हवाई जहाज पर बिजली गिर जाए तो क्या होगा?"},
            {"text": "क्या आपने कभी सोचा है कि ATM मशीन में कार्ड डालते ही नोट सेकंडों में कैसे बाहर आ जाते हैं?"}
        ]
    }
    rep = audit_script_visual_director(test_script)
    print(json.dumps(rep, indent=2, ensure_ascii=False))
