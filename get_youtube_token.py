# -*- coding: utf-8 -*-
"""
One-Time YouTube Channel OAuth Authorization Script for Anchor Aadhya News Channel
Captures permanent Refresh Token for automated YouTube video & thumbnail posting.
"""

import os
import sys
import json
from google_auth_oauthlib.flow import InstalledAppFlow

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CLIENT_SECRET_FILE = os.path.join(BASE_DIR, "client_secret.json")
TOKEN_FILE = os.path.join(BASE_DIR, "youtube_token.json")
HTML_FILE = os.path.join(BASE_DIR, "CLICK_ME_TO_LOGIN.html")
URL_FILE = os.path.join(BASE_DIR, "auth_url.txt")

SCOPES = [
    "https://www.googleapis.com/auth/youtube.upload",
    "https://www.googleapis.com/auth/youtube"
]

def authenticate_youtube():
    if not os.path.exists(CLIENT_SECRET_FILE):
        print(f"Error: {CLIENT_SECRET_FILE} not found!", flush=True)
        return

    print("=" * 65, flush=True)
    print("  Anchor Aadhya - YouTube Channel Authorization Server", flush=True)
    print("=" * 65, flush=True)

    flow = InstalledAppFlow.from_client_secrets_file(
        CLIENT_SECRET_FILE,
        scopes=SCOPES,
        redirect_uri="http://localhost:8085/"
    )

    auth_url, _ = flow.authorization_url(
        access_type="offline",
        prompt="consent"
    )

    # Save to auth_url.txt
    with open(URL_FILE, "w", encoding="utf-8") as f:
        f.write(auth_url)

    # Save to a nice clickable HTML file that opens in Chrome with 1 click
    html_content = f"""<!DOCTYPE html>
<html>
<head>
    <title>Authorize YouTube Channel - Anchor Aadhya</title>
    <style>
        body {{ font-family: Arial, sans-serif; background: #0f1422; color: #fff; text-align: center; padding: 50px; }}
        .btn {{ display: inline-block; background: #ff1e56; color: #fff; padding: 18px 36px; font-size: 20px; font-weight: bold; text-decoration: none; border-radius: 8px; margin-top: 30px; box-shadow: 0 4px 15px rgba(255,30,86,0.4); }}
        .btn:hover {{ background: #ff3366; }}
    </style>
</head>
<body>
    <h1>Anchor Aadhya - YouTube Authorization</h1>
    <p>Click below to authorize your YouTube channel:</p>
    <a class="btn" href="{auth_url}">👉 Click Here to Sign In with Google & Authorize</a>
    <script>
        // Auto-redirect to Google Auth
        window.location.href = "{auth_url}";
    </script>
</body>
</html>"""
    with open(HTML_FILE, "w", encoding="utf-8") as f:
        f.write(html_content)

    print(f"\n[SERVER READY] Listening on port 8085 for Google OAuth callback...", flush=True)
    print(f"Auth URL: {auth_url}\n", flush=True)

    # Listen on port 8085
    creds = flow.run_local_server(
        port=8085,
        prompt="consent",
        access_type="offline",
        open_browser=False
    )

    token_data = {
        "client_id": flow.client_config["client_id"],
        "client_secret": flow.client_config["client_secret"],
        "refresh_token": creds.refresh_token,
        "token_uri": creds.token_uri,
        "scopes": creds.scopes
    }

    with open(TOKEN_FILE, "w", encoding="utf-8") as f:
        json.dump(token_data, f, indent=2)

    print("\n" + "=" * 65, flush=True)
    print(f"🎉 SUCCESS! Permanent YouTube Token saved to:\n  {TOKEN_FILE}", flush=True)
    print("YouTube Channel is now 100% linked for automated uploads!", flush=True)
    print("=" * 65, flush=True)

if __name__ == "__main__":
    authenticate_youtube()
