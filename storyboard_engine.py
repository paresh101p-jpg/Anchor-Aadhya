# -*- coding: utf-8 -*-
"""
Storyboard Engine for 15+ Screen Autonomous Viral Reels
- Generates 100% collision-free HTML5/SVG animations.
- Guaranteed Zero-Overlap Protection:
  1. Top Header Pill Safe Zone: y: 0 - 265px.
  2. Bottom Subtitle Card Safe Zone: y: 1660 - 1920px.
  3. Visual Drawing Canvas: strictly bounded between y: 280px and y: 1640px.
  4. Hard SVG ClipPath (id="safeSceneClip"): Physically clips any overflow at y=270 to y=1660.
  5. Strict 2-Layer Tag Isolation: Outer <g transform="translate(X,Y)"> holds coordinate,
     inner <g id="anim-id"> holds local GSAP motion with ZERO transform attributes.
"""

import json
import os

def generate_storyboard_html(topic, duration):
    screens = topic["screens"]
    num_screens = len(screens)
    
    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>{topic["title"]} - 9:16 Vertical Reel</title>
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      background: #090d16;
      font-family: 'Segoe UI', Arial, sans-serif;
      position: relative;
      user-select: none;
    }}
    #stage {{
      width: 1080px;
      height: 1920px;
      position: absolute;
      top: 0; left: 0;
      overflow: hidden;
    }}
    .screen {{
      position: absolute;
      width: 1080px;
      height: 1920px;
      top: 0; left: 0;
      opacity: 0;
      visibility: hidden;
    }}
    /* Top Header Pill - strictly y: 75 to 195 (Safe Zone: y: 0 to 265) */
    .headline-pill {{
      position: absolute;
      top: 75px;
      left: 60px;
      width: 960px;
      height: 120px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(15, 23, 42, 0.96);
      border: 4px solid #38bdf8;
      border-radius: 40px;
      font-size: 30px;
      font-weight: 900;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #ffffff;
      box-shadow: 0 10px 30px rgba(0,0,0,0.85), 0 0 25px rgba(56,189,248,0.5);
      z-index: 1000;
      text-align: center;
      padding: 0 30px;
    }}
    /* Bottom Subtitle Card - strictly y: 1710 to 1840 (Safe Zone: y: 1660 to 1920) */
    .subline-card {{
      position: absolute;
      bottom: 80px;
      left: 60px;
      width: 960px;
      height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 10px 30px;
      background: rgba(15, 23, 42, 0.96);
      border: 4px solid #ffd700;
      border-radius: 30px;
      font-size: 30px;
      font-weight: 800;
      color: #ffd700;
      line-height: 1.35;
      box-shadow: 0 12px 35px rgba(0,0,0,0.9);
      z-index: 1000;
    }}
    .svg-canvas {{
      position: absolute;
      top: 0; left: 0;
      width: 1080px;
      height: 1920px;
    }}
  </style>
  <script src="assets/gsap.min.js"></script>
</head>
<body>
<div id="stage">
"""

    # Generate each screen
    for sc in screens:
        idx = sc["index"]
        headline = sc["headline"]
        hindi_sub = sc["scripts"]["hi"]
        stype = sc["scene_type"]
        
        html += f"""
  <!-- ==================== SCREEN {idx}: {stype.upper()} ==================== -->
  <div id="screen{idx}" class="screen">
    <div class="headline-pill">{headline}</div>
    <div class="subline-card">{hindi_sub}</div>
    <svg class="svg-canvas" viewBox="0 0 1080 1920">
      <defs>
        <!-- UNBREAKABLE CLIP-PATH: Hard clips visuals between y: 270 and y: 1660 -->
        <clipPath id="safeSceneClip{idx}">
          <rect x="0" y="270" width="1080" height="1390" />
        </clipPath>
      </defs>
      <!-- All visual graphic elements wrapped inside hard-clipping safe zone -->
      <g clip-path="url(#safeSceneClip{idx})">
"""
        # Screen Specific SVGs (All drawing centered in y: 400 to 1550)
        if stype == "bridge_wide":
            html += """
        <rect y="270" width="1080" height="830" fill="#0284c7"/>
        <circle cx="860" cy="420" r="90" fill="#fef08a"/>
        <!-- River East River -->
        <rect y="1100" width="1080" height="560" fill="#0369a1"/>
        <g transform="translate(0, 0)">
          <g id="s1-waves">
            <path d="M 0 1220 Q 270 1180 540 1220 T 1080 1220" stroke="#38bdf8" stroke-width="8" fill="none"/>
            <path d="M 0 1370 Q 270 1320 540 1370 T 1080 1370" stroke="#7dd3fc" stroke-width="8" fill="none"/>
          </g>
        </g>
        <!-- Brooklyn Bridge Stone Towers & Suspension Cables -->
        <g transform="translate(200, 580)">
          <rect x="0" y="0" width="160" height="520" fill="#475569" stroke="#1e293b" stroke-width="8"/>
          <path d="M 30 180 Q 80 100 130 180 L 130 520 L 30 520 Z" fill="#0284c7"/>
        </g>
        <g transform="translate(720, 580)">
          <rect x="0" y="0" width="160" height="520" fill="#475569" stroke="#1e293b" stroke-width="8"/>
          <path d="M 30 180 Q 80 100 130 180 L 130 520 L 30 520 Z" fill="#0284c7"/>
        </g>
        <!-- Suspension Cables -->
        <g stroke="#cbd5e1" stroke-width="6" fill="none">
          <path d="M 0 680 Q 280 960 540 930 T 1080 680"/>
          <line x1="280" y1="580" x2="280" y2="1080"/>
          <line x1="800" y1="580" x2="800" y2="1080"/>
        </g>
        <!-- Road Deck -->
        <rect x="0" y="1050" width="1080" height="60" fill="#334155" stroke="#1e293b" stroke-width="6"/>
        <!-- Vintage car on bridge -->
        <g transform="translate(420, 970)">
          <g id="s1-vintage-car">
            <rect x="0" y="40" width="220" height="60" rx="10" fill="#dc2626"/>
            <rect x="50" y="0" width="110" height="50" rx="8" fill="#f87171"/>
            <circle cx="45" cy="100" r="24" fill="#111" stroke="#cbd5e1" stroke-width="5"/>
            <circle cx="175" cy="100" r="24" fill="#111" stroke="#cbd5e1" stroke-width="5"/>
          </g>
        </g>
"""
        elif stype == "meet_parker":
            html += """
        <rect y="270" width="1080" height="830" fill="#1e293b"/>
        <rect y="1100" width="1080" height="560" fill="#334155"/>
        <!-- Fancy Parker in Suit & Top Hat (y: 950 to 1500) -->
        <g transform="translate(460, 950)">
          <g id="s2-parker">
            <!-- Top Hat -->
            <ellipse cx="80" cy="15" rx="85" ry="16" fill="#111"/>
            <rect x="35" y="-80" width="90" height="95" rx="5" fill="#1e293b" stroke="#111" stroke-width="4"/>
            <rect x="35" y="-10" width="90" height="15" fill="#dc2626"/>
            <!-- Head -->
            <circle cx="80" cy="65" r="50" fill="#fed7aa" stroke="#111" stroke-width="6"/>
            <!-- Mustache -->
            <path d="M 45 80 Q 80 65 115 80 Q 80 100 45 80 Z" fill="#1c1917"/>
            <circle cx="60" cy="55" r="6" fill="#111"/>
            <circle cx="100" cy="55" r="6" fill="#111"/>
            <!-- Suit & Tie -->
            <line x1="80" y1="115" x2="80" y2="300" stroke="#111" stroke-width="12"/>
            <rect x="25" y="125" width="110" height="160" rx="12" fill="#0f172a" stroke="#111" stroke-width="6"/>
            <polygon points="80,140 70,220 80,240 90,220" fill="#dc2626"/>
            <!-- Briefcase with Dollar Sign in Hand -->
            <g transform="translate(140, 220)">
              <rect x="0" y="0" width="110" height="80" rx="8" fill="#78350f" stroke="#451a03" stroke-width="6"/>
              <text x="55" y="55" font-size="44" font-weight="900" fill="#ffd700" text-anchor="middle">$</text>
            </g>
            <!-- Legs -->
            <line x1="80" y1="300" x2="40" y2="520" stroke="#0f172a" stroke-width="14"/>
            <line x1="80" y1="300" x2="120" y2="520" stroke="#0f172a" stroke-width="14"/>
          </g>
        </g>
"""
        elif stype == "harbor_tourists":
            html += """
        <rect y="270" width="1080" height="830" fill="#0284c7"/>
        <rect y="1100" width="1080" height="560" fill="#78350f"/>
        <!-- Giant Steamship at dock -->
        <g transform="translate(60, 620)">
          <polygon points="0,300 120,450 680,450 780,200 0,200" fill="#1e293b"/>
          <rect x="200" y="80" width="340" height="120" fill="#ffffff" stroke="#cbd5e1" stroke-width="6"/>
          <rect x="280" y="-30" width="60" height="110" fill="#dc2626"/>
          <rect x="420" y="-30" width="60" height="110" fill="#dc2626"/>
        </g>
        <!-- Wealthy Tourist with Luggage -->
        <g transform="translate(680, 1050)">
          <g id="s3-tourist">
            <circle cx="50" cy="50" r="45" fill="#fed7aa" stroke="#111" stroke-width="6"/>
            <ellipse cx="50" cy="15" rx="55" ry="16" fill="#eab308"/>
            <line x1="50" y1="95" x2="50" y2="280" stroke="#111" stroke-width="10"/>
            <rect x="15" y="105" width="70" height="130" rx="8" fill="#15803d"/>
            <!-- Big Leather Suitcase -->
            <rect x="90" y="180" width="110" height="85" rx="8" fill="#854d0e" stroke="#451a03" stroke-width="6"/>
            <line x1="50" y1="280" x2="20" y2="460" stroke="#111" stroke-width="12"/>
            <line x1="50" y1="280" x2="80" y2="460" stroke="#111" stroke-width="12"/>
          </g>
        </g>
"""
        elif stype == "fake_deed":
            html += """
        <rect y="270" width="1080" height="830" fill="#1e293b"/>
        <rect y="1100" width="1080" height="560" fill="#0f172a"/>
        <!-- Giant Official Looking Forged Deed Certificate in Center (y: 580 to 1430) -->
        <g transform="translate(240, 580)">
          <g id="s4-deed-doc">
            <rect x="0" y="0" width="600" height="820" rx="16" fill="#fef08a" stroke="#ca8a04" stroke-width="10"/>
            <text x="300" y="90" font-size="36" font-weight="900" fill="#111" text-anchor="middle">OFFICIAL DEED OF SALE</text>
            <line x1="60" y1="120" x2="540" y2="120" stroke="#ca8a04" stroke-width="4"/>
            <text x="300" y="220" font-size="42" font-weight="900" fill="#b91c1c" text-anchor="middle">BROOKLYN BRIDGE</text>
            <text x="300" y="300" font-size="26" font-weight="800" fill="#334155" text-anchor="middle">EXCLUSIVE PRIVATE PROPERTY</text>
            <text x="300" y="400" font-size="30" font-weight="900" fill="#111" text-anchor="middle">OWNER: GEORGE C. PARKER</text>
            <!-- Official Red Wax Seal -->
            <circle cx="300" cy="590" r="80" fill="#dc2626" stroke="#991b1b" stroke-width="6"/>
            <text x="300" y="605" font-size="26" font-weight="900" fill="#ffffff" text-anchor="middle">OFFICIAL SEAL</text>
          </g>
        </g>
"""
        elif stype == "toll_booth_dream":
            html += """
        <rect y="270" width="1080" height="830" fill="#0f172a"/>
        <rect y="1100" width="1080" height="560" fill="#1e293b"/>
        <!-- Dream Toll Booth with Dollar signs (y: 650) -->
        <g transform="translate(340, 650)">
          <g id="s5-toll-dream">
            <rect x="0" y="100" width="400" height="350" rx="15" fill="#eab308" stroke="#ca8a04" stroke-width="10"/>
            <polygon points="-40,100 200,-20 440,100" fill="#dc2626"/>
            <text x="200" y="65" font-size="38" font-weight="900" fill="#fff" text-anchor="middle">TOLL BOOTH</text>
            <rect x="80" y="220" width="240" height="140" fill="#1e293b"/>
            <text x="200" y="310" font-size="64" font-weight="900" fill="#22c55e" text-anchor="middle">$$$$</text>
          </g>
        </g>
        <!-- Money Flying Around -->
        <g transform="translate(540, 1250)">
          <g id="s5-money-shower">
            <rect x="-240" y="0" width="90" height="45" rx="4" fill="#22c55e" stroke="#15803d" stroke-width="3"/>
            <rect x="180" y="-40" width="90" height="45" rx="4" fill="#22c55e" stroke="#15803d" stroke-width="3"/>
            <rect x="0" y="80" width="90" height="45" rx="4" fill="#22c55e" stroke="#15803d" stroke-width="3"/>
          </g>
        </g>
"""
        elif stype == "cash_exchange":
            html += """
        <rect y="270" width="1080" height="830" fill="#1e293b"/>
        <rect y="1100" width="1080" height="560" fill="#334155"/>
        <!-- Giant Stacks of Cash on Table (y: 850) -->
        <g transform="translate(380, 850)">
          <g id="s6-cash-stacks">
            <rect x="0" y="120" width="320" height="120" rx="10" fill="#16a34a" stroke="#14532d" stroke-width="6"/>
            <text x="160" y="195" font-size="44" font-weight="900" fill="#fff" text-anchor="middle">$50,000 CASH</text>
            <rect x="40" y="40" width="240" height="80" rx="8" fill="#22c55e" stroke="#14532d" stroke-width="6"/>
            <rect x="80" y="-20" width="160" height="60" rx="6" fill="#4ade80" stroke="#14532d" stroke-width="6"/>
          </g>
        </g>
        <!-- Hand Shaking Deal -->
        <g transform="translate(240, 1200)">
          <path d="M 0 0 L 250 0 L 300 50" stroke="#fed7aa" stroke-width="35" stroke-linecap="round"/>
          <path d="M 600 0 L 350 0 L 300 50" stroke="#fed7aa" stroke-width="35" stroke-linecap="round"/>
        </g>
"""
        elif stype == "building_toll":
            html += """
        <rect y="270" width="1080" height="830" fill="#0284c7"/>
        <rect y="1100" width="1080" height="560" fill="#475569"/>
        <!-- Bridge Roadway Surface -->
        <line x1="0" y1="1100" x2="1080" y2="1100" stroke="#1e293b" stroke-width="14"/>
        <!-- Wooden Posts Being Hammered into Roadway -->
        <g transform="translate(560, 850)">
          <rect x="0" y="0" width="60" height="450" fill="#854d0e" stroke="#451a03" stroke-width="6"/>
          <rect x="140" y="0" width="60" height="450" fill="#854d0e" stroke="#451a03" stroke-width="6"/>
          <rect x="-30" y="100" width="260" height="40" fill="#ca8a04"/>
          <text x="100" y="130" font-size="22" font-weight="900" fill="#111" text-anchor="middle">TOLL BARRIER</text>
        </g>
        <!-- Buyer with Hammer in Hand (y: 950) -->
        <g transform="translate(320, 950)">
          <g id="s7-hammering-buyer">
            <circle cx="50" cy="50" r="45" fill="#fed7aa" stroke="#111" stroke-width="6"/>
            <polygon points="10,20 50,-10 90,20" fill="#ca8a04"/>
            <line x1="50" y1="95" x2="50" y2="280" stroke="#111" stroke-width="10"/>
            <rect x="15" y="105" width="70" height="120" rx="8" fill="#1d4ed8"/>
            <line x1="50" y1="280" x2="20" y2="450" stroke="#111" stroke-width="12"/>
            <line x1="50" y1="280" x2="80" y2="450" stroke="#111" stroke-width="12"/>
          </g>
        </g>
        <!-- Hammer swinging -->
        <g transform="translate(420, 1070)">
          <g id="s7-hammer-swing">
            <line x1="0" y1="0" x2="80" y2="-60" stroke="#78350f" stroke-width="12"/>
            <rect x="70" y="-90" width="50" height="35" rx="4" fill="#64748b" stroke="#111" stroke-width="4"/>
          </g>
        </g>
"""
        elif stype == "police_stop":
            html += """
        <rect y="270" width="1080" height="830" fill="#0f172a"/>
        <rect y="1100" width="1080" height="560" fill="#334155"/>
        <!-- New York Police Officer with Hand Up Stopping Buyer (y: 950) -->
        <g transform="translate(540, 950)">
          <g id="s8-police-officer">
            <circle cx="50" cy="50" r="48" fill="#fed7aa" stroke="#111" stroke-width="6"/>
            <ellipse cx="50" cy="15" rx="60" ry="16" fill="#1e3a8a"/>
            <polygon points="50,15 100,-15 50,-15" fill="#1e3a8a"/>
            <polygon points="50,-5 58,10 42,10" fill="#ffd700"/>
            <ellipse cx="50" cy="75" rx="14" ry="18" fill="#991b1b"/>
            <line x1="50" y1="100" x2="50" y2="280" stroke="#111" stroke-width="12"/>
            <rect x="10" y="110" width="80" height="140" rx="10" fill="#1e3a8a" stroke="#111" stroke-width="6"/>
            <!-- Giant Hand signaling STOP -->
            <g transform="translate(-50, 120)">
              <rect x="-40" y="-40" width="70" height="80" rx="15" fill="#fed7aa" stroke="#111" stroke-width="5"/>
              <text x="-5" y="12" font-size="24" font-weight="900" fill="#dc2626" text-anchor="middle">STOP</text>
            </g>
            <line x1="50" y1="280" x2="20" y2="460" stroke="#0f172a" stroke-width="14"/>
            <line x1="50" y1="280" x2="80" y2="460" stroke="#0f172a" stroke-width="14"/>
          </g>
        </g>
"""
        elif stype == "buyer_shock":
            html += """
        <rect y="270" width="1080" height="830" fill="#1e293b"/>
        <rect y="1100" width="1080" height="560" fill="#0f172a"/>
        <!-- Buyer Holding Fake Deed with Crying Face (y: 950) -->
        <g transform="translate(480, 950)">
          <g id="s9-crying-buyer">
            <circle cx="60" cy="50" r="50" fill="#fed7aa" stroke="#111" stroke-width="6"/>
            <ellipse cx="40" cy="70" rx="8" ry="15" fill="#38bdf8"/>
            <ellipse cx="80" cy="70" rx="8" ry="15" fill="#38bdf8"/>
            <path d="M 40 85 Q 60 70 80 85" stroke="#111" stroke-width="6" fill="none"/>
            <line x1="60" y1="100" x2="60" y2="280" stroke="#111" stroke-width="12"/>
            <rect x="25" y="110" width="70" height="130" rx="8" fill="#d97706"/>
            <!-- Waving Fake Receipt -->
            <g transform="translate(100, 120)">
              <rect x="0" y="0" width="140" height="180" rx="6" fill="#fef08a" stroke="#ca8a04" stroke-width="4"/>
              <text x="70" y="80" font-size="24" font-weight="900" fill="#dc2626" text-anchor="middle">FAKE</text>
              <text x="70" y="120" font-size="20" font-weight="900" fill="#111" text-anchor="middle">RECEIPT</text>
            </g>
            <line x1="60" y1="280" x2="30" y2="460" stroke="#111" stroke-width="12"/>
            <line x1="60" y1="280" x2="90" y2="460" stroke="#111" stroke-width="12"/>
          </g>
        </g>
"""
        elif stype == "statue_of_liberty":
            html += """
        <rect y="270" width="1080" height="830" fill="#0284c7"/>
        <rect y="1100" width="1080" height="560" fill="#0369a1"/>
        <!-- Statue of Liberty Silhouette in Center (y: 600 to 1250) -->
        <g transform="translate(450, 620)">
          <rect x="40" y="350" width="100" height="250" fill="#64748b"/>
          <polygon points="50,150 20,400 160,400 130,150" fill="#0d9488"/>
          <circle cx="90" cy="110" r="35" fill="#14b8a6"/>
          <polygon points="90,70 70,30 90,50 110,30" fill="#0d9488"/>
          <line x1="120" y1="130" x2="160" y2="30" stroke="#0d9488" stroke-width="14"/>
          <circle cx="165" cy="20" r="20" fill="#ffd700"/>
        </g>
        <!-- Giant Red Stamp "SOLD!" Slanted Across Statue -->
        <g transform="translate(540, 880)">
          <g id="s10-sold-stamp">
            <rect x="-240" y="-60" width="480" height="120" rx="20" fill="none" stroke="#dc2626" stroke-width="14"/>
            <text x="0" y="24" font-size="76" font-weight="900" fill="#dc2626" letter-spacing="8" text-anchor="middle">SOLD!</text>
          </g>
        </g>
"""
        elif stype == "madison_garden":
            html += """
        <rect y="270" width="1080" height="830" fill="#1e293b"/>
        <rect y="1100" width="1080" height="560" fill="#0f172a"/>
        <!-- Madison Square Garden Arena & Grant's Tomb (y: 720) -->
        <g transform="translate(180, 720)">
          <rect x="0" y="0" width="340" height="220" rx="12" fill="#475569" stroke="#cbd5e1" stroke-width="6"/>
          <text x="170" y="120" font-size="26" font-weight="900" fill="#fef08a" text-anchor="middle">MADISON SQ GARDEN</text>
          <rect x="50" y="160" width="240" height="40" rx="8" fill="#dc2626"/>
          <text x="170" y="188" font-size="22" font-weight="900" fill="#fff" text-anchor="middle">PRICE: $100,000</text>
        </g>
        <g transform="translate(580, 720)">
          <polygon points="0,220 170,0 340,220" fill="#334155" stroke="#cbd5e1" stroke-width="6"/>
          <text x="170" y="140" font-size="26" font-weight="900" fill="#fef08a" text-anchor="middle">GRANT'S TOMB</text>
          <rect x="50" y="160" width="240" height="40" rx="8" fill="#dc2626"/>
          <text x="170" y="188" font-size="22" font-weight="900" fill="#fff" text-anchor="middle">PRICE: $25,000</text>
        </g>
"""
        elif stype == "infinite_loop":
            html += """
        <rect y="270" width="1080" height="830" fill="#090d16"/>
        <rect y="1100" width="1080" height="560" fill="#1e293b"/>
        <!-- Giant Rotating Infinity Sign with Bridge inside (y: 820) -->
        <g transform="translate(540, 820)">
          <g id="s12-infinity-cycle">
            <text x="0" y="80" font-size="220" font-weight="900" fill="#f59e0b" text-anchor="middle">∞</text>
            <rect x="-250" y="150" width="500" height="80" rx="20" fill="#dc2626" stroke="#fff" stroke-width="4"/>
            <text x="0" y="205" font-size="32" font-weight="900" fill="#fff" text-anchor="middle">TWICE A WEEK FOR 30 YEARS!</text>
          </g>
        </g>
"""
        elif stype == "court_sentenced":
            html += """
        <rect y="270" width="1080" height="830" fill="#334155"/>
        <rect y="1100" width="1080" height="560" fill="#1e293b"/>
        <!-- Judge Bench & Gavel on Left (y: 880) -->
        <g transform="translate(160, 880)">
          <rect x="0" y="0" width="300" height="350" fill="#78350f" stroke="#451a03" stroke-width="8"/>
          <text x="150" y="150" font-size="32" font-weight="900" fill="#fff" text-anchor="middle">SING SING</text>
          <text x="150" y="200" font-size="28" font-weight="900" fill="#ef4444" text-anchor="middle">LIFE SENTENCE</text>
        </g>
        <!-- Wooden Gavel Slamming -->
        <g transform="translate(310, 920)">
          <g id="s13-judge-gavel">
            <line x1="0" y1="0" x2="-80" y2="-60" stroke="#451a03" stroke-width="14"/>
            <rect x="-110" y="-90" width="60" height="40" rx="6" fill="#b45309"/>
          </g>
        </g>
        <!-- Parker Behind Prison Cell Bars on Right -->
        <g transform="translate(680, 880)">
          <circle cx="60" cy="50" r="45" fill="#fed7aa" stroke="#111" stroke-width="6"/>
          <line x1="60" y1="95" x2="60" y2="280" stroke="#111" stroke-width="10"/>
          <rect x="25" y="105" width="70" height="130" fill="#e2e8f0"/>
          <line x1="0" y1="-50" x2="0" y2="400" stroke="#0f172a" stroke-width="18"/>
          <line x1="60" y1="-50" x2="60" y2="400" stroke="#0f172a" stroke-width="18"/>
          <line x1="120" y1="-50" x2="120" y2="400" stroke="#0f172a" stroke-width="18"/>
        </g>
"""
        elif stype == "prison_legend":
            html += """
        <rect y="270" width="1080" height="830" fill="#1e293b"/>
        <rect y="1100" width="1080" height="560" fill="#0f172a"/>
        <!-- Parker Sitting on Bunk Telling Stories (y: 950) -->
        <g transform="translate(340, 950)">
          <rect x="-80" y="120" width="340" height="40" fill="#64748b"/>
          <circle cx="80" cy="40" r="45" fill="#fed7aa" stroke="#111" stroke-width="6"/>
          <path d="M 65 55 Q 80 75 95 55" stroke="#111" stroke-width="5" fill="none"/>
          <line x1="80" y1="85" x2="80" y2="220" stroke="#111" stroke-width="10"/>
          <rect x="45" y="95" width="70" height="110" fill="#e2e8f0"/>
        </g>
        <!-- Guards Laughing & Applauding on Right -->
        <g transform="translate(740, 950)">
          <g id="s14-applauding-guards">
            <circle cx="50" cy="40" r="45" fill="#fed7aa" stroke="#111" stroke-width="6"/>
            <ellipse cx="50" cy="10" rx="55" ry="16" fill="#1e3a8a"/>
            <line x1="50" y1="85" x2="50" y2="240" stroke="#111" stroke-width="10"/>
            <rect x="15" y="95" width="70" height="120" fill="#1e3a8a"/>
            <circle cx="-10" cy="130" r="20" fill="#fed7aa"/>
            <circle cx="10" cy="130" r="20" fill="#fed7aa"/>
          </g>
        </g>
"""
        elif stype == "famous_saying":
            html += """
        <rect y="270" width="1080" height="1390" fill="#090d16"/>
        <!-- Giant Neon Quote Plaque in Center (y: 720 to 1250) -->
        <g transform="translate(140, 720)">
          <g id="s15-quote-card">
            <rect x="0" y="0" width="800" height="480" rx="30" fill="#1e293b" stroke="#f59e0b" stroke-width="8"/>
            <text x="400" y="120" font-size="44" font-weight="900" fill="#fef08a" text-anchor="middle">"IF YOU BELIEVE THAT...</text>
            <text x="400" y="240" font-size="52" font-weight="900" fill="#ef4444" text-anchor="middle">I HAVE A BRIDGE</text>
            <text x="400" y="340" font-size="44" font-weight="900" fill="#38bdf8" text-anchor="middle">TO SELL YOU!"</text>
            <line x1="100" y1="380" x2="700" y2="380" stroke="#ca8a04" stroke-width="4"/>
            <text x="400" y="430" font-size="28" font-weight="800" fill="#94a3b8" text-anchor="middle">- AMERICAN HISTORY'S GREATEST IDIOM</text>
          </g>
        </g>
"""
        elif stype == "subscribe_cta":
            html += """
        <rect y="270" width="1080" height="1390" fill="#090d16"/>
        <circle cx="540" cy="960" r="480" fill="#1e3a8a" opacity="0.3"/>
        <!-- Pulsing YouTube Subscribe Button (y: 650) -->
        <g transform="translate(200, 650)">
          <g id="s16-sub-btn">
            <rect x="0" y="0" width="680" height="150" rx="75" fill="#dc2626" stroke="#ffffff" stroke-width="8"/>
            <polygon points="110,45 110,105 170,75" fill="#ffffff"/>
            <text x="400" y="100" font-size="58" font-weight="900" fill="#ffffff" letter-spacing="4" text-anchor="middle">SUBSCRIBE</text>
          </g>
        </g>
        <!-- Ringing Golden Bell (y: 920) -->
        <g transform="translate(540, 920)">
          <g id="s16-bell">
            <circle cx="0" cy="0" r="95" fill="#fef08a" opacity="0.25"/>
            <path d="M 0 -60 C -40 -60, -55 -20, -55 30 L -70 55 L 70 55 L 55 30 C 55 -20, 40 -60, 0 -60 Z" fill="#ffd700" stroke="#b45309" stroke-width="7"/>
            <circle cx="0" cy="78" r="20" fill="#b45309"/>
            <path d="M 80 -20 Q 110 5 80 35" stroke="#ffd700" stroke-width="8" fill="none" stroke-linecap="round"/>
            <path d="M -80 -20 Q -110 5 -80 35" stroke="#ffd700" stroke-width="8" fill="none" stroke-linecap="round"/>
          </g>
        </g>
        <!-- Parker in Center Bottom Waving Hat (y: 1180) -->
        <g transform="translate(490, 1180)">
          <g id="s16-waving-parker">
            <circle cx="50" cy="50" r="45" fill="#fed7aa" stroke="#111" stroke-width="6"/>
            <!-- Top Hat in Hand waving -->
            <g transform="translate(90, 20) rotate(25)">
              <ellipse cx="30" cy="10" rx="45" ry="12" fill="#111"/>
              <rect x="10" y="-40" width="40" height="50" fill="#1e293b"/>
            </g>
            <line x1="50" y1="95" x2="50" y2="240" stroke="#111" stroke-width="10"/>
            <rect x="15" y="105" width="70" height="120" rx="8" fill="#0f172a"/>
            <line x1="50" y1="240" x2="20" y2="400" stroke="#111" stroke-width="12"/>
            <line x1="50" y1="240" x2="80" y2="400" stroke="#111" stroke-width="12"/>
          </g>
        </g>
"""

        html += """      </g> <!-- end clip-path safe group -->
    </svg>
  </div>
"""

    # Generate GSAP timeline script
    html += f"""
</div>

<script>
  let totalDuration = {duration};
  const masterTimeline = gsap.timeline({{ paused: true }});

  function setupAnimation(duration) {{
    totalDuration = duration;
    const numScreens = {num_screens};
    const screenDur = totalDuration / numScreens;

    for (let i = 1; i <= numScreens; i++) {{
      const screenId = `#screen${{i}}`;
      const startTime = (i - 1) * screenDur;
      const endTime = i * screenDur;

      masterTimeline.to(screenId, {{
        autoAlpha: 1,
        duration: 0.25,
        ease: "power2.out"
      }}, startTime);

      if (i < numScreens) {{
        masterTimeline.to(screenId, {{
          autoAlpha: 0,
          duration: 0.25,
          ease: "power2.in"
        }}, endTime - 0.25);
      }}

      // Local relative GSAP animations (Strictly isolated inside 2-layer groups)
      if (i === 1) {{
        masterTimeline.fromTo("#s1-waves path", {{ x: -30 }}, {{ x: 30, duration: 1.2, repeat: -1, yoyo: true, ease: "sine.inOut" }}, startTime);
        masterTimeline.fromTo("#s1-vintage-car", {{ x: -100 }}, {{ x: 100, duration: 2.0, repeat: -1, yoyo: true, ease: "linear" }}, startTime);
      }} else if (i === 2) {{
        masterTimeline.fromTo("#s2-parker", {{ y: -8 }}, {{ y: 8, duration: 0.6, repeat: -1, yoyo: true }}, startTime);
      }} else if (i === 3) {{
        masterTimeline.fromTo("#s3-tourist", {{ y: -10 }}, {{ y: 10, duration: 0.5, repeat: -1, yoyo: true }}, startTime);
      }} else if (i === 4) {{
        masterTimeline.fromTo("#s4-deed-doc", {{ scale: 0.95 }}, {{ scale: 1.04, duration: 0.8, repeat: -1, yoyo: true, transformOrigin: "center center" }}, startTime);
      }} else if (i === 5) {{
        masterTimeline.fromTo("#s5-toll-dream", {{ scale: 0.95 }}, {{ scale: 1.03, duration: 0.7, repeat: -1, yoyo: true }}, startTime);
        masterTimeline.fromTo("#s5-money-shower rect", {{ y: -30 }}, {{ y: 30, duration: 0.4, repeat: -1, yoyo: true, stagger: 0.1 }}, startTime);
      }} else if (i === 6) {{
        masterTimeline.fromTo("#s6-cash-stacks", {{ scale: 0.96 }}, {{ scale: 1.04, duration: 0.6, repeat: -1, yoyo: true }}, startTime);
      }} else if (i === 7) {{
        masterTimeline.fromTo("#s7-hammer-swing", {{ rotation: -30 }}, {{ rotation: 20, duration: 0.25, repeat: -1, yoyo: true, transformOrigin: "0% 0%" }}, startTime);
      }} else if (i === 8) {{
        masterTimeline.fromTo("#s8-police-officer", {{ x: -10 }}, {{ x: 10, duration: 0.4, repeat: -1, yoyo: true }}, startTime);
      }} else if (i === 9) {{
        masterTimeline.fromTo("#s9-crying-buyer", {{ y: -8 }}, {{ y: 8, duration: 0.5, repeat: -1, yoyo: true }}, startTime);
      }} else if (i === 10) {{
        masterTimeline.fromTo("#s10-sold-stamp", {{ scale: 1.3, opacity: 0 }}, {{ scale: 1.0, opacity: 1, duration: 0.35, ease: "bounce.out" }}, startTime + 0.3);
      }} else if (i === 12) {{
        masterTimeline.fromTo("#s12-infinity-cycle", {{ scale: 0.95 }}, {{ scale: 1.05, duration: 0.8, repeat: -1, yoyo: true }}, startTime);
      }} else if (i === 13) {{
        masterTimeline.fromTo("#s13-judge-gavel", {{ rotation: -30 }}, {{ rotation: 10, duration: 0.3, repeat: -1, yoyo: true, transformOrigin: "bottom left" }}, startTime);
      }} else if (i === 14) {{
        masterTimeline.fromTo("#s14-applauding-guards", {{ scale: 0.96 }}, {{ scale: 1.04, duration: 0.35, repeat: -1, yoyo: true }}, startTime);
      }} else if (i === 15) {{
        masterTimeline.fromTo("#s15-quote-card", {{ scale: 0.96 }}, {{ scale: 1.03, duration: 0.8, repeat: -1, yoyo: true }}, startTime);
      }} else if (i === 16) {{
        masterTimeline.fromTo("#s16-sub-btn", {{ scale: 0.92 }}, {{ scale: 1.08, duration: 0.6, repeat: -1, yoyo: true, ease: "power1.inOut" }}, startTime);
        masterTimeline.fromTo("#s16-bell", {{ rotation: -20 }}, {{ rotation: 20, duration: 0.25, repeat: -1, yoyo: true, transformOrigin: "top center" }}, startTime);
        masterTimeline.fromTo("#s16-waving-parker", {{ y: -10 }}, {{ y: 10, duration: 0.5, repeat: -1, yoyo: true }}, startTime);
      }}
    }}
  }}

  window.seekTo = function(seconds) {{
    masterTimeline.seek(seconds, false);
  }};

  window.addEventListener("DOMContentLoaded", () => {{
    const urlParams = new URLSearchParams(window.location.search);
    const d = parseFloat(urlParams.get("dur")) || {duration};
    setupAnimation(d);
  }});
</script>
</body>
</html>
"""
    return html

if __name__ == "__main__":
    pool_file = os.path.join(os.path.dirname(__file__), "viral_topics_pool.json")
    with open(pool_file, "r", encoding="utf-8") as f:
        pool = json.load(f)
    topic = pool["topics"][0]
    out_html = os.path.join(os.path.dirname(__file__), "reel_stage.html")
    content = generate_storyboard_html(topic, 90.0)
    with open(out_html, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"Generated storyboard HTML: {out_html} ({len(content)} bytes)")
