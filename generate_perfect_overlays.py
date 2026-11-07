import os
import subprocess

BASE_DIR = r"E:\Paresh\Anchor-Aadhya"
ASSETS_DIR = os.path.join(BASE_DIR, "assets")
CHROME_BIN = r"C:\Program Files\Google\Chrome\Application\chrome.exe"

CARDS = [
    {
        "id": "S1",
        "badge": "🔴 LIVE • ANCHOR AADHYA",
        "tag_top": "⚡ AI TECH BUZZ",
        "title": "अरे सुनिए ना! 🤖 एक ख़तरनाक AI रोबोट!",
        "tag_bot": "⚡ SHENZHEN AI // 100x SPEED"
    },
    {
        "id": "S2",
        "badge": "⚡ SHENZHEN AI ROBOTICS LAB",
        "tag_top": "🤖 NEXT-GEN HUMANOID",
        "title": "100 लोगों का काम... ⚡ सिर्फ अकेला रोबोट!",
        "tag_bot": "⚠️ 100x CODING SPEED // 1 HOUR"
    },
    {
        "id": "S3",
        "badge": "⚡ QUANTUM AI WORKPLACE",
        "tag_top": "⚡ SYSTEM WARNING",
        "title": "इंजीनियर ने रोका... तो मुस्कुरा कर बोला! 😉",
        "tag_bot": "⚠️ SYSTEM OVERRIDE ALERT"
    },
    {
        "id": "S4",
        "badge": "⚠️ SYSTEM OVERRIDE ALERT",
        "tag_top": "🤖 AI SELF-AWARE",
        "title": "'आप आराम कीजिए... 🚀 अब दुनिया हमारी है!'",
        "tag_bot": "💥 FUTURE OF TECH 2026"
    },
    {
        "id": "S5",
        "badge": "💬 PUBLIC POLL // ANCHOR AADHYA",
        "tag_top": "❓ WILL AI REPLACE JOBS?",
        "title": "क्या AI सच में नौकरियां खाएगा? 💭 बताओ ना!",
        "tag_bot": "👇 COMMENT YOUR THOUGHTS BELOW"
    }
]

def generate_overlays():
    os.makedirs(ASSETS_DIR, exist_ok=True)
    for c in CARDS:
        html = f"""<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@700;900&family=Montserrat:wght@800;900&display=swap');
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  body {{
    width: 1080px; height: 1920px;
    background: transparent;
    overflow: hidden;
    font-family: 'Noto Sans Devanagari', 'Montserrat', sans-serif;
  }}
  .hud-top {{
    position: absolute; top: 60px; left: 60px; right: 60px;
    height: 110px;
    background: rgba(10, 15, 30, 0.88);
    border: 2px solid #00e5ff;
    border-radius: 24px;
    box-shadow: 0 0 25px rgba(0, 229, 255, 0.45);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 35px;
  }}
  .hud-left {{
    display: flex; align-items: center; gap: 15px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 900; font-size: 32px; color: #fff;
    letter-spacing: 1px;
  }}
  .live-dot {{
    width: 22px; height: 22px; background: #ff2a2a; border-radius: 50%;
    box-shadow: 0 0 15px #ff2a2a;
  }}
  .hud-right {{
    font-family: 'Montserrat', sans-serif;
    font-weight: 800; font-size: 26px; color: #00e5ff;
  }}
  .caption-box {{
    position: absolute; bottom: 380px; left: 60px; right: 60px;
    background: rgba(8, 12, 28, 0.92);
    border: 3px solid #ffd43b;
    border-radius: 28px;
    box-shadow: 0 0 35px rgba(255, 212, 59, 0.40);
    padding: 35px 30px;
    text-align: center;
  }}
  .caption-title {{
    font-family: 'Noto Sans Devanagari', sans-serif;
    font-weight: 900;
    font-size: 56px;
    line-height: 1.35;
    color: #ffd43b;
    text-shadow: 0 4px 15px rgba(0,0,0,0.9), 0 0 20px rgba(255, 212, 59, 0.5);
    word-break: keep-all;
  }}
  .caption-tag {{
    margin-top: 15px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 900; font-size: 28px;
    color: #00e5ff;
    letter-spacing: 2px;
  }}
</style>
</head>
<body>
  <div class="hud-top">
    <div class="hud-left">
      <div class="live-dot"></div>
      {c["badge"].replace("🔴 ", "")}
    </div>
    <div class="hud-right">{c["tag_top"]}</div>
  </div>

  <div class="caption-box">
    <div class="caption-title">{c["title"]}</div>
    <div class="caption-tag">{c["tag_bot"]}</div>
  </div>
</body>
</html>"""
        tmp_html = os.path.join(ASSETS_DIR, f"temp_{c['id']}.html")
        out_png = os.path.join(ASSETS_DIR, f"overlay_{c['id']}.png")
        with open(tmp_html, "w", encoding="utf-8") as f:
            f.write(html)
        
        cmd = [
            CHROME_BIN,
            "--headless=new",
            f"--screenshot={out_png}",
            "--window-size=1080,1920",
            "--hide-scrollbars",
            "--default-background-color=00000000",
            "file:///" + tmp_html.replace("\\", "/")
        ]
        subprocess.run(cmd, check=True)
        print(f"Generated {out_png} ({os.path.getsize(out_png)} bytes)")
        if os.path.exists(tmp_html):
            os.remove(tmp_html)

if __name__ == "__main__":
    generate_overlays()

