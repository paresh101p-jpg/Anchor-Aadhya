# -*- coding: utf-8 -*-
"""
Multi-Track Muxing Engine
Embeds 10 Audio Tracks + 10 Soft Subtitles (mov_text) into master MP4 container.
"""

import subprocess
import os

LANG_META = [
    ("hi", "hin", "Hindi (Default)"),
    ("gu", "guj", "Gujarati"),
    ("en", "eng", "English"),
    ("mr", "mar", "Marathi"),
    ("bn", "ben", "Bengali"),
    ("ta", "tam", "Tamil"),
    ("te", "tel", "Telugu"),
    ("kn", "kan", "Kannada"),
    ("es", "spa", "Spanish"),
    ("fr", "fra", "French")
]

def mux_multitrack_reel(base_dir):
    video_path = os.path.join(base_dir, "reel_2d.mp4")
    audio_dir = os.path.join(base_dir, "languages_padded")
    sub_dir = os.path.join(base_dir, "subtitles")
    out_path = os.path.join(base_dir, "master_reel_10lang.mp4")

    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found: {video_path}")

    print(f"🎛️ [Mux Engine]: Combining 10 audio tracks and 10 soft subtitles into {out_path}...")

    cmd = ["ffmpeg", "-y", "-i", video_path]

    # 10 Audio Inputs (Index 1 to 10)
    for code, iso, title in LANG_META:
        audio_file = os.path.join(audio_dir, f"audio_{code}.m4a")
        cmd.extend(["-i", audio_file])

    # 10 Subtitle Inputs (Index 11 to 20)
    for code, iso, title in LANG_META:
        sub_file = os.path.join(sub_dir, f"sub_{code}.srt")
        cmd.extend(["-i", sub_file])

    # Map video (Stream 0)
    cmd.extend(["-map", "0:v:0"])

    # Map 10 audio streams
    for i in range(len(LANG_META)):
        cmd.extend(["-map", f"{i+1}:a:0"])

    # Map 10 subtitle streams
    for i in range(len(LANG_META)):
        cmd.extend(["-map", f"{len(LANG_META)+1+i}:s:0"])

    # Stream copy video & audio, convert subtitles to native MP4 mov_text
    cmd.extend(["-c:v", "copy", "-c:a", "copy", "-c:s", "mov_text"])

    # Metadata for Audio Streams
    for i, (code, iso, title) in enumerate(LANG_META):
        cmd.extend([
            f"-metadata:s:a:{i}", f"language={iso}",
            f"-metadata:s:a:{i}", f"title={title}"
        ])
        if i == 0:
            cmd.extend([f"-disposition:a:{i}", "default"])
        else:
            cmd.extend([f"-disposition:a:{i}", "0"])

    # Metadata for Subtitle Streams
    for i, (code, iso, title) in enumerate(LANG_META):
        cmd.extend([
            f"-metadata:s:s:{i}", f"language={iso}",
            f"-metadata:s:s:{i}", f"title={title}"
        ])
        if i == 0:
            cmd.extend([f"-disposition:s:{i}", "default"])
        else:
            cmd.extend([f"-disposition:s:{i}", "0"])

    cmd.append(out_path)

    subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
    size_mb = os.path.getsize(out_path) / (1024 * 1024)
    print(f"✅ [Mux Engine Complete]: Generated 10-audio + 10-subtitle Master Reel: {out_path} ({size_mb:.2f} MB)")
    return out_path

if __name__ == "__main__":
    base = os.path.dirname(os.path.abspath(__file__))
    mux_multitrack_reel(base)
