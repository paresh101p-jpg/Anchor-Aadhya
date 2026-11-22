// Inside Out engine: canvas, palette, math and drawing primitives.
// Every drawing function in the kit uses the shared `ctx` exported here (set once by main.js).
const _cv = typeof document !== 'undefined' ? document.getElementById('cv') : null;
export const W = _cv ? _cv.width : 1080;
export const H = _cv ? _cv.height : 1920;
export const FPS = 30;
export const IS_16_9 = W > H;
export let ctx = null;
export function setCtx(c) { ctx = c; }

// The style sheet palette. Only these (plus the derived shades) appear on screen.
export const C = {
  skin: '#E8B89A', pink: '#E57A8A', red: '#D62839', cyan: '#4FD1E8', yellow: '#FFD43B', bg: '#F4F1EA',
  // derived shades (darker / lighter tones of the palette, used for flat shading)
  pinkLight: '#F29AA7', pinkDark: '#C9566E', skinShade: '#D49C7E', navy: '#0E1A2B', xnavy: '#0B2238',
  hair: '#3B2A20', hairHi: '#5A4030', shirt: '#3A7BD5', shirtShade: '#2F67BE', pants: '#1F2A44', pantsShade: '#18213A',
  ink: '#1A1A1E', mouth: '#6B2A2A', gum: '#F7F4EE', gumEdge: '#C9C2B5', white: '#FFFFFF',
  stomachBg: '#B83A55', stomachBgDark: '#A3304A', stomachFold: '#D4637C', floor: '#E4DCCB', sky: '#BFE3F2',
  leaf: '#5BAE6A', pot: '#C8734A', watch: '#1E2A44',
};

// ---------- math ----------
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const seg = (t, a, b) => clamp((t - a) / ((b - a) || 1e-6));
export const eo = (t) => 1 - Math.pow(1 - t, 3);
export const eio = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const eob = (t) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
export const rnd = (i) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export const TAU = Math.PI * 2;

// Motion Graphics Elastic & Spring Physics
export const spring = (t, damp = 0.5, freq = 14) => {
  t = clamp(t);
  return 1 - Math.exp(-damp * t * 10) * Math.cos(freq * t);
};
export const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

// Animated Data Counter (Smoothly interpolates numbers with commas)
export function countUp(from, to, p, decimals = 0) {
  const val = lerp(from, to, easeOutExpo(clamp(p)));
  return decimals > 0 ? val.toFixed(decimals) : Math.round(val).toLocaleString();
}

// Organic Handheld Camera Shake (Perlin/sinusoidal micro-noise)
export function cameraShake(t, intensity = 5) {
  const sx = (Math.sin(t * 11) + Math.sin(t * 19.3) * 0.5) * intensity;
  const sy = (Math.cos(t * 13) + Math.sin(t * 23.7) * 0.5) * intensity;
  return [sx, sy];
}

// ---------- primitives ----------
export function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
export function circle(x, y, r, fill) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fillStyle = fill; ctx.fill(); }
export function ell(x, y, rx, ry, fill, rot = 0) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, TAU); ctx.fillStyle = fill; ctx.fill(); }
export function line(pts, color, w) {
  ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.strokeStyle = color; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
}
export function fillAll(color) { ctx.fillStyle = color; ctx.fillRect(-300, -300, W + 600, H + 600); }
/** 3D Cutout Sticker Effect: Adds realistic drop shadow to isolated objects */
export function startCutout(blur = 35, alpha = 0.75, offX = 10, offY = 18) {
  ctx.save();
  ctx.shadowColor = `rgba(0, 0, 0, ${alpha})`;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = offX;
  ctx.shadowOffsetY = offY;
}
export function endCutout() {
  ctx.restore();
}
/** outlined bold text (the caption look), centred at x, y */
export function bigText(text, x, y, size, fill = C.white, rot = 0, sc = 1) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc);
  ctx.font = `900 ${size}px Inter, "Noto Sans Devanagari", "Mangal", "Nirmala UI", sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round';
  ctx.lineWidth = size * 0.2; ctx.strokeStyle = C.ink; ctx.strokeText(text, 0, 0); ctx.fillStyle = fill; ctx.fillText(text, 0, 0);
  ctx.restore();
}

// ── FULL-CANVAS MOTION GRAPHICS SUITE (1080x1920 9:16) ───────────────────────────

/** Dynamic Multi-Stop Gradient Background + Full-Screen Ambient Particles + Grid */
export function drawFullCanvasBackground(t, theme = 'ocean') {
  ctx.save();
  // 1. Full-Height 1080x1920 Rich Ambient Gradient (NO plain black void!)
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  if (theme === 'ocean' || theme === 'bermuda') {
    bgGrad.addColorStop(0, '#020C1B');
    bgGrad.addColorStop(0.35, '#051937');
    bgGrad.addColorStop(0.70, '#002B49');
    bgGrad.addColorStop(1, '#010A14');
  } else if (theme === 'inferno' || theme === 'kola') {
    bgGrad.addColorStop(0, '#150604');
    bgGrad.addColorStop(0.40, '#2D0D07');
    bgGrad.addColorStop(0.75, '#1A0804');
    bgGrad.addColorStop(1, '#0A0302');
  } else if (theme === 'cyber' || theme === 'gta') {
    bgGrad.addColorStop(0, '#16021E');
    bgGrad.addColorStop(0.45, '#2A0845');
    bgGrad.addColorStop(0.75, '#1A002C');
    bgGrad.addColorStop(1, '#090014');
  } else {
    bgGrad.addColorStop(0, '#070C18');
    bgGrad.addColorStop(0.40, '#0E1A32');
    bgGrad.addColorStop(0.75, '#091224');
    bgGrad.addColorStop(1, '#03060C');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Dynamic Radial Core Glow (pulses subtly behind hero visual)
  const glowY = 700 + Math.sin(t * 1.5) * 40;
  const radGlow = ctx.createRadialGradient(W / 2, glowY, 50, W / 2, glowY, 680);
  const glowColor = (theme === 'ocean' || theme === 'bermuda') ? 'rgba(0, 240, 255, 0.16)'
                  : (theme === 'inferno' || theme === 'kola') ? 'rgba(249, 115, 22, 0.18)'
                  : (theme === 'cyber' || theme === 'gta') ? 'rgba(255, 0, 128, 0.18)'
                  : 'rgba(56, 189, 248, 0.14)';
  radGlow.addColorStop(0, glowColor);
  radGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = radGlow;
  ctx.fillRect(0, 0, W, H);

  // 3. Ambient Flow Particles across ENTIRE 1080x1920 canvas (Zero dead areas!)
  for (let k = 0; k < 42; k++) {
    const px = (k * 137.5 + t * (15 + (k % 5) * 8)) % W;
    const py = (H + ((k * 223.7 - t * (45 + (k % 4) * 18)) % H)) % H;
    const pr = 2.0 + (k % 4) * 2.2;
    const pAlpha = 0.25 + 0.35 * Math.sin(t * 3 + k * 1.7);
    ctx.fillStyle = (theme === 'inferno' || theme === 'kola')
      ? `rgba(254, 215, 170, ${pAlpha})`
      : `rgba(186, 230, 253, ${pAlpha})`;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, TAU);
    ctx.fill();
  }

  // 4. Subtle Dynamic Perspective Floor Grid (bottom region y: 1100 to 1920)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
  ctx.lineWidth = 1.5;
  for (let x = 80; x < W; x += 130) {
    line([[x, 1000], [540 + (x - 540) * 1.8, H]], 'rgba(255, 255, 255, 0.035)', 1.5);
  }
  for (let y = 1100; y < H; y += 120) {
    line([[0, y], [W, y]], 'rgba(255, 255, 255, 0.035)', 1.5);
  }

  ctx.restore();
}

/** High-Energy Real-Time Audio Frequency Visualizer (Lower screen y: 1560 to 1700) */
export function drawAudioVisualizer(t, baseY = 1640, height = 80) {
  ctx.save();
  const bars = 32;
  const totalW = 860;
  const barW = 18;
  const startX = (W - totalW) / 2;
  const stepX = totalW / bars;

  ctx.lineCap = 'round';
  for (let b = 0; b < bars; b++) {
    const x = startX + b * stepX + barW / 2;
    // Harmonic wave formula simulates high-energy speech/music rhythms
    const wave = Math.abs(
      Math.sin(t * 12 + b * 0.45) * 0.45 +
      Math.sin(t * 22 + b * 0.85) * 0.35 +
      Math.sin(t * 7 + b * 0.2) * 0.2
    );
    const barH = Math.max(12, wave * height);

    // Glowing Equalizer Bar Gradient
    const bGrad = ctx.createLinearGradient(0, baseY, 0, baseY - barH);
    bGrad.addColorStop(0, '#00F0FF');
    bGrad.addColorStop(0.6, '#22C55E');
    bGrad.addColorStop(1, '#FFE600');

    ctx.strokeStyle = bGrad;
    ctx.lineWidth = barW - 5;
    ctx.beginPath();
    ctx.moveTo(x, baseY);
    ctx.lineTo(x, baseY - barH);
    ctx.stroke();

    // Floating Peak Dot
    const peakY = baseY - barH - 8;
    ctx.fillStyle = '#FFE600';
    ctx.beginPath();
    ctx.arc(x, peakY, 2.5, 0, TAU);
    ctx.fill();
  }
  ctx.restore();
}

/** Broadcast Viewport Framing & Top/Bottom Telemetry */
export function drawBroadcastFrame(t) {
  ctx.save();
  // 1. Top Status Bar (y: 65)
  ctx.font = '900 20px Inter, sans-serif';
  ctx.textBaseline = 'middle';

  // Red Blinking REC dot
  const recBlink = Math.sin(t * 6) > 0;
  if (recBlink) {
    circle(95, 68, 7, '#FF1744');
    ctx.fillStyle = 'rgba(255, 23, 68, 0.3)';
    circle(95, 68, 14, 'rgba(255, 23, 68, 0.3)');
  }
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.fillText('REC // 4K 60FPS', 115, 68);

  // Center Channel Watermark
  ctx.fillStyle = '#FFE600';
  ctx.textAlign = 'center';
  ctx.fillText('ANCHOR AADHYA VIRAL RADAR', W / 2, 68);

  // Right Frame Timecode
  const secs = Math.floor(t);
  const frames = Math.floor((t % 1) * 30);
  const timeStr = `00:${String(secs).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  ctx.textAlign = 'right';
  ctx.fillText(timeStr, W - 95, 68);

  // 2. Corner Viewport Brackets (Frame safe boundary)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 3;
  const bLen = 30;
  // Top-Left
  ctx.beginPath(); ctx.moveTo(60, 60 + bLen); ctx.lineTo(60, 60); ctx.lineTo(60 + bLen, 60); ctx.stroke();
  // Top-Right
  ctx.beginPath(); ctx.moveTo(W - 60 - bLen, 60); ctx.lineTo(W - 60, 60); ctx.lineTo(W - 60, 60 + bLen); ctx.stroke();
  // Bottom-Left
  ctx.beginPath(); ctx.moveTo(60, H - 60 - bLen); ctx.lineTo(60, H - 60); ctx.lineTo(60 + bLen, H - 60); ctx.stroke();
  // Bottom-Right
  ctx.beginPath(); ctx.moveTo(W - 60 - bLen, H - 60); ctx.lineTo(W - 60, H - 60); ctx.lineTo(W - 60, H - 60 - bLen); ctx.stroke();

  // 3. Bottom Telemetry Status Line (y: 1720)
  ctx.font = '800 18px Inter, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.55)';
  ctx.textAlign = 'center';
  ctx.fillText('AUDIO TELEMETRY // AI FREQUENCY SPECTRUM // 48kHz HD', W / 2, 1720);

  ctx.restore();
}
