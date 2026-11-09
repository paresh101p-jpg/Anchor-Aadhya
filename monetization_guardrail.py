# -*- coding: utf-8 -*-
"""
YouTube Partner Program (YPP) Monetization & Policy Guardrail
- 100% Green Dollar compliance checker
- Enforces YouTube Advertiser-Friendly Content Guidelines (Ad-Friendly)
- Blocks yellow-dollar triggers: gore, vulgarity, self-harm, hate, dangerous medical claims
- Mandates educational / documentary framing for maximum CPM and safe monetization
"""

import re

# Banned / High-Risk Red & Yellow Dollar Words (English & Hindi transliterated)
RISKY_PATTERNS = [
    # Extreme violence / gore
    r"\b(suicide|kill\s*yourself|self\s*harm|murder|bloodbath|gore|mutilat|behead)\b",
    r"\b(आत्महत्या|खून\s*खराबा|कत्ल|फांसी|काट\s*दिया|गला\s*काटना)\b",
    # Sexual / vulgar / adult
    r"\b(porn|nude|sex|erotic|vagina|penis|boobs|cleavage|masturbat)\b",
    r"\b(संभोग|हस्तमैथुन|नग्न|अश्लील)\b",
    # Dangerous medical misinformation / false cures
    r"\b(cure\s*cancer|instant\s*cure|100%\s*ilaj|जादुई\s*इलाज|कैंसर\s*का\s*इलाज)\b",
    # Hate speech / harassment
    r"\b(terrorist|nazi|hate\s*speech|आतंकवादी)\b"
]

COMPILED_RISKY = [re.compile(p, re.IGNORECASE) for p in RISKY_PATTERNS]

def audit_monetization_safety(topic: dict) -> tuple[bool, list[str]]:
    """
    Audits a candidate topic payload against YouTube Advertiser-Friendly guidelines.
    Returns (is_safe: bool, issues: list[str]).
    """
    issues = []
    
    # Collect all text to scan
    title = topic.get("title", "")
    video_title = topic.get("video_title", "")
    desc = topic.get("description", "")
    lines = topic.get("lines", [])
    
    spoken_text = " ".join([l.get("text", "") for l in lines if isinstance(l, dict)])
    full_corpus = f"{title} {video_title} {desc} {spoken_text}"
    
    # 1. Check against risky words
    for pattern in COMPILED_RISKY:
        matches = pattern.findall(full_corpus)
        if matches:
            issues.append(f"Potentially sensitive/demonetizing terms found: {set(matches)}")
            
    # 2. Minimum length check for depth (must be > 20 lines)
    if len(lines) < 20:
        issues.append(f"Insufficient narration lines ({len(lines)} < 20). Violates >2 min depth requirement.")
        
    # 3. Framing check: Must contain educational/scientific terminology
    edu_indicators = ["विज्ञान", "वैज्ञानिक", "शरीर", "दिमाग", "मशीन", "रिसर्च", "इतिहास", "प्रक्रिया", "कारण", "सच", "अध्ययन", "नियम", "तथ्य"]
    has_edu = any(ind in full_corpus for ind in edu_indicators)
    if not has_edu:
        issues.append("Lacks clear educational/documentary framing required for safe Green Dollar status.")
        
    is_safe = (len(issues) == 0)
    return is_safe, issues

def inject_monetization_shield_metadata(topic: dict) -> dict:
    """
    Ensures description and tags have full educational & advisory disclaimers
    which YouTube human reviewers and AI classifiers explicitly look for.
    """
    disclaimer = (
        "\n\n⚠️ शैक्षणिक एवं वैज्ञानिक परामर्श (Educational Disclaimer):\n"
        "यह वीडियो केवल वैज्ञानिक ज्ञान, तकनीकी प्रक्रियाओं और मानवीय जिज्ञासा के "
        "शैक्षणिक उद्देश्य (Educational & Documentary Purpose) के लिए तैयार किया गया है।"
    )
    
    desc = topic.get("description", "")
    if "शैक्षणिक" not in desc:
        topic["description"] = desc.strip() + disclaimer
        
    tags = topic.get("tags", [])
    essential_tags = ["Anchor Aadhya", "Science Facts Hindi", "Curiosity 3D", "Educational Documentary"]
    for t in essential_tags:
        if t not in tags:
            tags.append(t)
    topic["tags"] = tags[:15] # keep within 15 clean tags
    
    return topic
