// Frame-Exact Puppeteer Renderer for 1080x1920 9:16 Vertical Reels
// Pipes frame buffer directly to FFmpeg image2pipe for ultra-fast headless encoding.

import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find Chrome binary cross-platform
const CHROME_CANDIDATES = [
  process.env.CHROME_BIN,
  process.env.PUPPETEER_EXECUTABLE_PATH,
  '/usr/bin/google-chrome-stable',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'
];
const chromePath = CHROME_CANDIDATES.find(p => p && fs.existsSync(p));

if (!chromePath) {
  console.error("❌ [Render Error]: Google Chrome / Chromium executable not found!");
  process.exit(1);
}

const req = createRequire(import.meta.url);
const puppeteer = req('puppeteer-core');

const durFile = path.join(__dirname, 'duration.json');
if (!fs.existsSync(durFile)) {
  console.error(`❌ [Render Error]: duration.json not found at ${durFile}`);
  process.exit(1);
}

const durData = JSON.parse(fs.readFileSync(durFile, 'utf8'));
const duration = durData.duration;
const fps = durData.fps || 30;
const totalFrames = durData.total_frames || Math.round(duration * fps);

console.log(`🎬 [Render Engine]: Starting render for ${duration}s (${totalFrames} frames @ ${fps} fps)...`);
console.log(`   Chrome Binary: ${chromePath}`);

const stageFile = path.join(__dirname, 'reel_stage.html');
const stageUrl = `file:///${stageFile.replace(/\\/g, '/')}?dur=${duration.toFixed(2)}`;
const outVideo = path.join(__dirname, 'reel_2d.mp4');

async function render() {
  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: chromePath,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1080,1920',
      '--hide-scrollbars'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1920 });
  await page.goto(stageUrl, { waitUntil: 'networkidle0' });

  // Ensure GSAP timeline is ready
  await page.waitForFunction(() => typeof window.seekTo === 'function', { timeout: 15000 });

  const ffmpegArgs = [
    '-y',
    '-f', 'image2pipe',
    '-c:v', 'mjpeg',
    '-r', `${fps}`,
    '-i', '-',
    '-c:v', 'libx264',
    '-preset', 'fast',
    '-crf', '18',
    '-pix_fmt', 'yuv420p',
    outVideo
  ];

  const ffmpeg = spawn('ffmpeg', ffmpegArgs);
  ffmpeg.stderr.on('data', () => {});

  const startTime = Date.now();
  for (let frame = 0; frame < totalFrames; frame++) {
    const timeInSec = frame / fps;
    await page.evaluate((t) => {
      window.seekTo(t);
    }, timeInSec);

    const screenshotBuffer = await page.screenshot({
      type: 'jpeg',
      quality: 92,
      omitBackground: false
    });

    if (!ffmpeg.stdin.write(screenshotBuffer)) {
      await new Promise(resolve => ffmpeg.stdin.once('drain', resolve));
    }

    if (frame % 150 === 0 || frame === totalFrames - 1) {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const pct = ((frame / totalFrames) * 100).toFixed(1);
      console.log(`  Frame ${frame}/${totalFrames} (${pct}%) in ${elapsed}s`);
    }
  }

  ffmpeg.stdin.end();
  await new Promise(resolve => ffmpeg.on('close', resolve));
  await browser.close();

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ [Render Engine Complete]: ${outVideo} generated in ${totalTime}s!`);
}

render().catch(err => {
  console.error("❌ [Render Engine Failed]:", err);
  process.exit(1);
});
