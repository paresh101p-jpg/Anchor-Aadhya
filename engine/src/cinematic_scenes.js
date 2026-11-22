// CINEMATIC DOCUMENTARY SCENE ENGINE (1080x1920 9:16)
// Broadcast-quality literal visuals for every spoken word:
// Earth, Mount Everest, Sun, Submarine, 1000 Elephants, Anglerfish, Plastic Bottle,
// Chernobyl Reactor, Elephant's Foot, Geiger Counter, Nixie Countdown, Corium Lava.
// All visuals placed safely above y=1200 to guarantee ZERO caption overlap.
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob, rnd, circle, ell, line, rr, TAU, countUp, spring, easeOutExpo, drawFullCanvasBackground } from './core/lib.js';

const F = (s, w = '900') => `${w} ${s}px Inter, "Noto Sans Devanagari", "Mangal", sans-serif`;

// Utility: HUD Title Card (top safe area) - Auto-fit: text NEVER overflows the box!
function hudHeader(title, subtitle = '', color = '#00F2FE') {
  ctx.save();
  const boxX = 70, boxY = 125, boxW = W - 140, boxH = 130;
  ctx.fillStyle = 'rgba(2, 8, 18, 0.82)';
  ctx.beginPath(); ctx.roundRect(boxX, boxY, boxW, boxH, 18); ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.stroke();

  // Corner tech brackets
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(boxX, boxY + 25); ctx.lineTo(boxX, boxY); ctx.lineTo(boxX + 25, boxY); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(boxX + boxW - 25, boxY); ctx.lineTo(boxX + boxW, boxY); ctx.lineTo(boxX + boxW, boxY + 25); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(boxX, boxY + boxH - 25); ctx.lineTo(boxX, boxY + boxH); ctx.lineTo(boxX + 25, boxY + boxH); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(boxX + boxW - 25, boxY + boxH); ctx.lineTo(boxX + boxW, boxY + boxH); ctx.lineTo(boxX + boxW, boxY + boxH - 25); ctx.stroke();

  // Auto-fit Title: scale down if needed so it NEVER overflows box margins
  const maxTextW = boxW - 70;
  ctx.font = F(36, '900');
  let titleW = ctx.measureText(title).width;
  let tScale = Math.min(1, maxTextW / Math.max(titleW, 1));
  ctx.save();
  ctx.translate(540, subtitle ? boxY + 44 : boxY + 65);
  ctx.scale(tScale, tScale);
  ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(title, 0, 0);
  ctx.restore();

  // Auto-fit Subtitle: scale down if needed
  if (subtitle) {
    ctx.font = F(24, '800');
    let subW = ctx.measureText(subtitle).width;
    let sScale = Math.min(1, maxTextW / Math.max(subW, 1));
    ctx.save();
    ctx.translate(540, boxY + 92);
    ctx.scale(sScale, sScale);
    ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(subtitle, 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

// Auto-fit Tech Card: draws text inside a pill/box that dynamically sizes and NEVER overflows
export function drawAutoTechCard(text, cx, cy, color = '#00F2FE', fontSize = 28) {
  ctx.save();
  ctx.font = F(fontSize, '900');
  const textW = ctx.measureText(text).width;
  const maxW = W - 140;
  const fit = Math.min(1, (maxW - 60) / Math.max(textW, 1));
  const cardW = Math.min(maxW, textW * fit + 60);
  const cardH = fontSize * 1.85;

  ctx.fillStyle = 'rgba(2, 8, 18, 0.85)';
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(cx - cardW / 2, cy - cardH / 2, cardW, cardH, 14);
  ctx.fill(); ctx.stroke();

  ctx.translate(cx, cy);
  ctx.scale(fit, fit);
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 0, 0);
  ctx.restore();
}

// Auto-fit Outro Question Bubble: dynamically sizes around question so text NEVER hangs outside!
function drawOutroQuestionBubble(question) {
  ctx.save();
  ctx.font = F(24, '900');
  const qW = ctx.measureText(question).width;
  const maxW = 540;
  const fit = Math.min(1, (maxW - 60) / Math.max(qW, 1));
  const bw = Math.min(maxW, qW * fit + 70);

  ctx.fillStyle = '#00F2FE';
  ctx.beginPath();
  ctx.roundRect(-bw / 2, -180, bw, 80, 20);
  ctx.fill();

  // Pointer
  ctx.beginPath();
  ctx.moveTo(-20, -100); ctx.lineTo(0, -75); ctx.lineTo(15, -100);
  ctx.fill();

  ctx.translate(0, -140);
  ctx.scale(fit, fit);
  ctx.fillStyle = '#000000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(question, 0, 0);
  ctx.restore();
}

// Cinematic Film Atmosphere: Vignette, Film Grain, and Anamorphic Lens Flare
function filmAtmosphere(t, flareY = 0, flareColor = 'rgba(0, 242, 254, 0.25)') {
  ctx.save();
  // 1. Deep Vignette
  const g = ctx.createRadialGradient(W / 2, H / 2, 450, W / 2, H / 2, 1050);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(0.7, 'rgba(0,0,0,0.4)');
  g.addColorStop(1, 'rgba(0,0,0,0.88)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // 2. Anamorphic Horizontal Lens Flare (if specified)
  if (flareY > 0) {
    const flare = ctx.createLinearGradient(0, flareY - 15, 0, flareY + 15);
    flare.addColorStop(0, 'rgba(0,0,0,0)');
    flare.addColorStop(0.5, flareColor);
    flare.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = flare; ctx.fillRect(0, flareY - 20, W, 40);
  }

  // 3. Subtle Scanlines
  ctx.fillStyle = '#FFFFFF'; ctx.globalAlpha = 0.025;
  for (let y = 0; y < H; y += 8) {
    ctx.fillRect(0, y, W, 2);
  }
  ctx.restore();
}

// Atmospheric particle motes (marine snow, radioactive dust, embers)
function atmosphericDust(t, count = 40, color = 'rgba(120, 220, 255, 0.45)') {
  ctx.save();
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) {
    const seed = i * 67.3;
    const x = (rnd(seed) * W + Math.sin(t * 0.7 + seed) * 35) % W;
    const y = ((rnd(seed + 1) * H + t * (20 + rnd(seed + 2) * 35)) % (H + 100)) - 50;
    const r = 1.8 + rnd(seed + 3) * 5;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// ===================================================================================
// MARIANA TRENCH DOCUMENTARY SCENES
// ===================================================================================

// ── 1. REALISTIC 3D EARTH GLOBE ───────────────────────────────────────────────────
export function drawEarthGlobe(lt, d, t) {
  ctx.fillStyle = '#01050E'; ctx.fillRect(0, 0, W, H);

  hudHeader('PLANET EARTH // DEEPEST POINT', 'पृथ्वी का सबसे गहरा स्थान', '#00F2FE');

  ctx.save();
  const cx = 540, cy = 680, r = 270;

  // Multi-layer Atmospheric Scattering Glow
  const halo = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 1.4);
  halo.addColorStop(0, 'rgba(0, 220, 255, 0.65)');
  halo.addColorStop(0.5, 'rgba(0, 100, 255, 0.25)');
  halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath(); ctx.arc(cx, cy, r * 1.4, 0, TAU); ctx.fill();

  // Ocean Shading with 3D Spherical Light
  const ocean = ctx.createRadialGradient(cx - r * 0.4, cy - r * 0.4, 40, cx, cy, r);
  ocean.addColorStop(0, '#29B6F6');
  ocean.addColorStop(0.35, '#0288D1');
  ocean.addColorStop(0.7, '#01579B');
  ocean.addColorStop(1, '#00132C');
  ctx.fillStyle = ocean;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();

  // Continents with Realistic Landmass Contour & Night Shadow
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
  const shift = (t * 24) % (r * 2.2);
  for (let k = -1; k <= 1; k++) {
    const lx = cx + k * r * 2.1 + shift;
    // Asia & Pacific Archipelago
    ctx.fillStyle = '#388E3C';
    ctx.beginPath(); ctx.ellipse(lx - 60, cy - 50, 110, 70, 0.35, 0, TAU); ctx.fill();
    ctx.fillStyle = '#2E7D32';
    ctx.beginPath(); ctx.ellipse(lx + 80, cy + 60, 95, 60, -0.25, 0, TAU); ctx.fill();
    // Islands
    ctx.fillStyle = '#81C784';
    circle(lx + 20, cy - 10, 16, '#81C784'); circle(lx + 45, cy + 15, 14, '#81C784');
  }
  // Soft 3D Night Shadow across the right hemisphere
  const night = ctx.createRadialGradient(cx + r * 0.5, cy + r * 0.3, 50, cx + r * 0.4, cy + r * 0.2, r * 1.2);
  night.addColorStop(0, 'rgba(0, 2, 8, 0.88)');
  night.addColorStop(0.6, 'rgba(0, 5, 18, 0.5)');
  night.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = night;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  ctx.restore();

  // Glowing Mariana Trench Target Marker
  const pulse = 1 + 0.18 * Math.sin(t * 6);
  ctx.strokeStyle = '#FF1744'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(cx + 35, cy + 15, 42 * pulse, 0, TAU); ctx.stroke();
  circle(cx + 35, cy + 15, 15, '#FFE600');

  // Label banner

  ctx.restore();
  filmAtmosphere(t, 680, 'rgba(0, 242, 254, 0.2)');
}

// ── 2. MARIANA TRENCH 11,000M CANYON CHASM ─────────────────────────────────────────
export function drawMarianaChasm(lt, d, t) {
  ctx.fillStyle = '#01040A'; ctx.fillRect(0, 0, W, H);

  hudHeader('DEPTH READOUT // 11,034 METERS', '11,000 मीटर गहरी खाई', '#00F2FE');

  ctx.save();
  // Realistic Layered Jagged Rock Canyon Walls with Depth Lighting
  const wallG = ctx.createLinearGradient(0, 270, 0, 1150);
  wallG.addColorStop(0, '#0D1E30'); wallG.addColorStop(0.5, '#07121F'); wallG.addColorStop(1, '#02060C');
  ctx.fillStyle = wallG; ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)'; ctx.lineWidth = 4;

  // Left Wall with rock ledges
  ctx.beginPath();
  ctx.moveTo(40, 270); ctx.lineTo(320, 480); ctx.lineTo(240, 680);
  ctx.lineTo(360, 890); ctx.lineTo(250, 1050); ctx.lineTo(340, 1150); ctx.lineTo(40, 1150);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // Right Wall
  ctx.beginPath();
  ctx.moveTo(W - 40, 270); ctx.lineTo(W - 320, 480); ctx.lineTo(W - 240, 680);
  ctx.lineTo(W - 360, 890); ctx.lineTo(W - 250, 1050); ctx.lineTo(W - 340, 1150); ctx.lineTo(W - 40, 1150);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // Central Vertical Laser Sonar Grid
  const depth = Math.round(lerp(1000, 11034, eo(clamp(lt / d))));
  ctx.font = F(94, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText(`-${depth.toLocaleString()} M`, 540, 660);

  // Red Pulsing Sonar Target at Floor
  const p = 1 + 0.2 * Math.sin(t * 8);
  ctx.strokeStyle = '#FF1744'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.arc(540, 880, 65 * p, 0, TAU); ctx.stroke();
  circle(540, 880, 22, '#FF1744');

  ctx.font = F(40, '900'); ctx.fillStyle = '#FFFFFF';
  ctx.fillText('CHALLENGER DEEP: 11,034 M', 540, 1020);

  ctx.restore();
  atmosphericDust(t, 45);
  filmAtmosphere(t);
}

// ── 3. REALISTIC MOUNT EVEREST ─────────────────────────────────────────────────────
export function drawMountEverest(lt, d, t) {
  ctx.fillStyle = '#010714'; ctx.fillRect(0, 0, W, H);

  hudHeader('EVEREST COMPARISON // 8,848 METERS', 'माउंट एवरेस्ट भी डूब जाएगा', '#FFE600');

  ctx.save();
  const ex = 540, ey = 780;

  // Photorealistic Shaded Mountain (West face lit, East face in deep shadow)
  // Dark Shadow Face (East)
  ctx.fillStyle = '#111B24'; ctx.beginPath();
  ctx.moveTo(ex, ey - 340); ctx.lineTo(ex + 330, ey + 180); ctx.lineTo(ex, ey + 180); ctx.fill();
  // Lit Rock Face (West)
  ctx.fillStyle = '#2A3C4D'; ctx.beginPath();
  ctx.moveTo(ex, ey - 340); ctx.lineTo(ex - 330, ey + 180); ctx.lineTo(ex, ey + 180); ctx.fill();
  // Mountain Ridge Line
  line([[ex, ey - 340], [ex - 30, ey + 180]], '#3D546C', 6);

  // Pure White Glacier Snow Couloirs & Summit Snow Cap
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(ex, ey - 340);
  ctx.lineTo(ex + 110, ey - 140);
  ctx.lineTo(ex + 40, ey - 90);
  ctx.lineTo(ex, ey - 130);
  ctx.lineTo(ex - 60, ey - 85);
  ctx.lineTo(ex - 120, ey - 150);
  ctx.closePath(); ctx.fill();

  // Red Summit Flag with Pole
  line([[ex, ey - 340], [ex, ey - 410]], '#FFE600', 8);
  ctx.fillStyle = '#FF1744';
  ctx.beginPath(); ctx.moveTo(ex, ey - 410); ctx.lineTo(ex + 65, ey - 380); ctx.lineTo(ex, ey - 350); ctx.fill();

  // Rising Ocean Water Level Drowning Everest
  const waterY = lerp(ey + 180, ey - 180, eo(clamp(lt / d)));
  const waterGrad = ctx.createLinearGradient(0, waterY, 0, ey + 180);
  waterGrad.addColorStop(0, 'rgba(0, 220, 255, 0.65)');
  waterGrad.addColorStop(1, 'rgba(0, 50, 150, 0.85)');
  ctx.fillStyle = waterGrad;
  ctx.fillRect(80, waterY, W - 160, (ey + 180) - waterY);
  line([[80, waterY], [W - 80, waterY]], '#00F2FE', 6);

  ctx.font = F(42, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText('माउंट एवरेस्ट: 8,848 M (डूबा हुआ!)', 540, 1040);

  ctx.restore();
  filmAtmosphere(t);
}

// ── 4. BLAZING SUN // SOLAR EXTINCTION ─────────────────────────────────────────────
export function drawSunRays(lt, d, t) {
  ctx.fillStyle = '#020409'; ctx.fillRect(0, 0, W, H);

  hudHeader('SOLAR LIGHT EXTINCTION', 'सूरज की एक भी किरण नहीं पहुँचती', '#FF9900');

  ctx.save();
  const sx = 540, sy = 560;

  // Volumetric Sun Corona & Radiant Flares
  const numRays = 18;
  const pulse = 1 + 0.1 * Math.sin(t * 5);
  for (let i = 0; i < numRays; i++) {
    const ang = (i * TAU) / numRays + t * 0.25;
    const len = (i % 2 === 0 ? 260 : 190) * pulse;
    ctx.strokeStyle = i % 2 === 0 ? '#FFE600' : '#FF6600'; ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(sx + Math.cos(ang) * 125, sy + Math.sin(ang) * 125);
    ctx.lineTo(sx + Math.cos(ang) * len, sy + Math.sin(ang) * len);
    ctx.stroke();
  }

  // Multi-stop Corona Glow
  const glow = ctx.createRadialGradient(sx, sy, 50, sx, sy, 250);
  glow.addColorStop(0, '#FFFFFF');
  glow.addColorStop(0.3, '#FFE600');
  glow.addColorStop(0.65, '#FF5500');
  glow.addColorStop(1, 'rgba(255, 60, 0, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(sx, sy, 250, 0, TAU); ctx.fill();

  // Solid Core
  circle(sx, sy, 120, '#FFE600'); circle(sx, sy, 90, '#FFFFFF');

  // Red Prohibition Cross at 1000m
  const banAlpha = clamp((lt - 0.4) / 0.4);
  if (banAlpha > 0) {
    ctx.save(); ctx.globalAlpha = banAlpha;
    ctx.strokeStyle = '#FF1744'; ctx.lineWidth = 18;
    ctx.beginPath(); ctx.arc(sx, sy, 200, 0, TAU); ctx.stroke();
    line([[sx - 140, sy - 140], [sx + 140, sy + 140]], '#FF1744', 18);
    ctx.restore();
  }

  ctx.font = F(44, '900'); ctx.fillStyle = '#FF1744'; ctx.textAlign = 'center';
  ctx.fillText('1,000 M नीचे = 0% सूरज की रोशनी', 540, 960);

  ctx.restore();
  filmAtmosphere(t, sy, 'rgba(255, 180, 0, 0.35)');
}

// ── 5. REALISTIC DEEP-SEA SUBMARINE WITH SEARCHLIGHTS ──────────────────────────────
export function drawSubmarineSearchlight(lt, d, t) {
  ctx.fillStyle = '#000206'; ctx.fillRect(0, 0, W, H);

  hudHeader('DEEP-SEA SUBMERSIBLE // SEARCHLIGHTS', 'खौफनाक अंधेरे में पनडुब्बी', '#00F2FE');

  ctx.save();
  const subX = 540, subY = 640;

  // Realistic Volumetric Searchlight Beams with Particle Scattering
  const sweep = Math.sin(t * 1.5) * 85;
  const beam = ctx.createRadialGradient(subX, subY, 40, subX + sweep, subY + 520, 520);
  beam.addColorStop(0, 'rgba(200, 245, 255, 0.95)');
  beam.addColorStop(0.35, 'rgba(0, 210, 255, 0.45)');
  beam.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(subX - 55, subY + 30);
  ctx.lineTo(subX - 330 + sweep, subY + 540);
  ctx.lineTo(subX + 330 + sweep, subY + 540);
  ctx.lineTo(subX + 55, subY + 30);
  ctx.fill();

  // Submarine Hull Shading (Brushed Titanium with Highlights)
  const hullG = ctx.createLinearGradient(subX - 240, subY - 110, subX + 240, subY + 110);
  hullG.addColorStop(0, '#2C3E50'); hullG.addColorStop(0.5, '#1A252F'); hullG.addColorStop(1, '#0F171E');
  ctx.fillStyle = hullG; ctx.strokeStyle = '#00F2FE'; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.ellipse(subX, subY, 240, 110, 0, 0, TAU); ctx.fill(); ctx.stroke();

  // Conning Tower & Communications Mast
  ctx.fillStyle = '#1E2B37'; ctx.fillRect(subX - 50, subY - 150, 100, 50);
  ctx.strokeStyle = '#00F2FE'; ctx.strokeRect(subX - 50, subY - 150, 100, 50);
  line([[subX, subY - 150], [subX, subY - 210]], '#FFE600', 8); // antenna

  // Golden Observation Acrylic Dome Viewport
  circle(subX, subY + 20, 52, '#FFE600'); circle(subX, subY + 20, 38, '#FFFFFF');

  // Dual High-Intensity Xenon Pods
  circle(subX - 75, subY + 85, 24, '#FFFFFF'); circle(subX + 75, subY + 85, 24, '#FFFFFF');

  ctx.restore();
  atmosphericDust(t, 50);
  filmAtmosphere(t);
}

// ── 6. REALISTIC HYDRAULIC PRESSURE METER ──────────────────────────────────────────
export function drawPressureSlam(lt, d, t) {
  ctx.fillStyle = '#060B14'; ctx.fillRect(0, 0, W, H);

  hudHeader('PRESSURE SENSOR // CRITICAL ALERT', 'पानी का भयंकर दबाव', '#FF1744');

  ctx.save();
  const cx = 540, cy = 680, R = 275;

  // Realistic Industrial Metal Bezel
  const bezel = ctx.createRadialGradient(cx, cy, R - 20, cx, cy, R + 15);
  bezel.addColorStop(0, '#37474F'); bezel.addColorStop(0.7, '#263238'); bezel.addColorStop(1, '#102027');
  ctx.fillStyle = bezel; ctx.strokeStyle = '#4FD1E8'; ctx.lineWidth = 12;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill(); ctx.stroke();

  // Red Critical Zone Arc (from 200° to 340°)
  ctx.strokeStyle = '#FF1744'; ctx.lineWidth = 28;
  ctx.beginPath(); ctx.arc(cx, cy, R - 28, Math.PI * 0.9, Math.PI * 1.85); ctx.stroke();

  // Dial Ticks
  for (let a = 0; a < TAU; a += Math.PI / 8) {
    const x1 = cx + Math.cos(a) * (R - 38), y1 = cy + Math.sin(a) * (R - 38);
    const x2 = cx + Math.cos(a) * (R - 65), y2 = cy + Math.sin(a) * (R - 65);
    line([[x1, y1], [x2, y2]], a > Math.PI ? '#FF1744' : '#90A4AE', 6);
  }

  // Needle Violently Pinned in Red Zone
  const shake = rnd(t * 14) * 10 - 5;
  const targetAngle = Math.PI * 1.70 + (shake * Math.PI) / 180;
  ctx.strokeStyle = '#FF1744'; ctx.lineWidth = 14;
  line([[cx, cy], [cx + Math.cos(targetAngle) * (R - 40), cy + Math.sin(targetAngle) * (R - 40)]], '#FF1744', 14);
  circle(cx, cy, 34, '#FFE600');

  // Digital Bar Display
  ctx.font = F(78, '900'); ctx.fillStyle = '#FF1744'; ctx.textAlign = 'center';
  ctx.fillText('1,086 BAR', cx, cy + 115);
  ctx.font = F(38, '800'); ctx.fillStyle = '#FFFFFF';
  ctx.fillText('सामान्य से 1,000 गुना अधिक दबाव!', cx, 1020);

  ctx.restore();
  filmAtmosphere(t);
}

// ── 7. REALISTIC ELEPHANT (1000 HATHI) ─────────────────────────────────────────────
export function drawElephantWeight(lt, d, t) {
  ctx.fillStyle = '#080205'; ctx.fillRect(0, 0, W, H);

  hudHeader('WEIGHT COMPARISON // 1000 ELEPHANTS', 'सिर पर 1000 हाथियों का वजन', '#FFE600');

  ctx.save();
  const ex = 540, ey = 660, s = 1.38;
  ctx.translate(ex, ey); ctx.scale(s, s);

  // Realistic Shaded Elephant Body
  const skin = ctx.createLinearGradient(-150, -100, 150, 100);
  skin.addColorStop(0, '#78909C'); skin.addColorStop(0.6, '#546E7A'); skin.addColorStop(1, '#37474F');
  ctx.fillStyle = skin; ctx.strokeStyle = '#263238'; ctx.lineWidth = 6;

  // Massive Body
  ctx.beginPath(); ctx.ellipse(20, 0, 165, 120, 0, 0, TAU); ctx.fill(); ctx.stroke();
  // Head
  ctx.beginPath(); ctx.ellipse(-125, -35, 95, 88, 0, 0, TAU); ctx.fill(); ctx.stroke();
  // Large Flapping Ear with realistic shading
  ctx.fillStyle = '#455A64';
  ctx.beginPath(); ctx.ellipse(-95, -45, 68, 85, 0.22, 0, TAU); ctx.fill(); ctx.stroke();
  // Curving Trunk
  ctx.strokeStyle = '#546E7A'; ctx.lineWidth = 38; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-165, -15);
  ctx.quadraticCurveTo(-245, 50, -215, 125);
  ctx.quadraticCurveTo(-195, 160, -170, 135);
  ctx.stroke();
  // Realistic Ivory Curved Tusk
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 15;
  ctx.beginPath(); ctx.moveTo(-155, -5); ctx.quadraticCurveTo(-200, 35, -185, 75); ctx.stroke();
  // Eye
  circle(-150, -55, 8, '#FFE600'); circle(-150, -55, 4, '#000000');
  // 4 Sturdy Pillar Legs
  ctx.fillStyle = '#455A64';
  ctx.fillRect(-105, 75, 46, 118); ctx.strokeRect(-105, 75, 46, 118);
  ctx.fillRect(-45, 75, 46, 118); ctx.strokeRect(-45, 75, 46, 118);
  ctx.fillRect(40, 75, 46, 118); ctx.strokeRect(40, 75, 46, 118);
  ctx.fillRect(100, 75, 46, 118); ctx.strokeRect(100, 75, 46, 118);

  ctx.restore();

  // Crushing Downward Force Indicators
  for (let x = 200; x <= 880; x += 170) {
    line([[x, 410], [x, 470]], '#FF1744', 16);
  }

  ctx.font = F(54, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText('1,000 हाथियों का भार!', 540, 1020);
}

// ── 8. REALISTIC BIOLUMINESCENT ANGLERFISH ─────────────────────────────────────────
export function drawAlienCreature(lt, d, t) {
  ctx.fillStyle = '#010207'; ctx.fillRect(0, 0, W, H);

  hudHeader('BIOLUMINESCENT ANGLERFISH', 'तैरते हुए चमकते जीव मिले', '#00F2FE');

  ctx.save();
  const cx = 540, cy = 680;

  // Glowing Cyan Lantern Bulb on Antenna Stalk
  const glowR = 135 + Math.sin(t * 6) * 35;
  const lureG = ctx.createRadialGradient(cx - 175, cy - 205, 10, cx - 175, cy - 205, glowR);
  lureG.addColorStop(0, '#FFFFFF'); lureG.addColorStop(0.3, '#00F2FE'); lureG.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = lureG;
  ctx.beginPath(); ctx.arc(cx - 175, cy - 205, glowR, 0, TAU); ctx.fill();

  // Antenna Stalk
  ctx.strokeStyle = '#00F2FE'; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(cx - 40, cy - 70); ctx.quadraticCurveTo(cx - 135, cy - 165, cx - 175, cy - 205); ctx.stroke();

  // Deep Sea Fish Shading
  const fishG = ctx.createLinearGradient(cx - 110, cy - 150, cx + 390, cy + 150);
  fishG.addColorStop(0, '#152536'); fishG.addColorStop(0.6, '#0B1520'); fishG.addColorStop(1, '#050A10');
  ctx.fillStyle = fishG; ctx.strokeStyle = 'rgba(0, 242, 254, 0.7)'; ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cx - 110, cy);
  ctx.quadraticCurveTo(cx + 80, cy - 145, cx + 300, cy - 30);
  ctx.lineTo(cx + 395, cy - 105); ctx.lineTo(cx + 345, cy); ctx.lineTo(cx + 395, cy + 105);
  ctx.lineTo(cx + 300, cy + 30);
  ctx.quadraticCurveTo(cx + 60, cy + 165, cx - 110, cy);
  ctx.fill(); ctx.stroke();

  // Glass-like Sharp Razor Teeth
  for (let i = 0; i < 7; i++) {
    const tx = cx - 90 + i * 26;
    line([[tx, cy - 25], [tx + 10, cy + 20]], '#FFFFFF', 6);
    line([[tx + 12, cy + 35], [tx + 20, cy - 10]], '#FFFFFF', 6);
  }

  // Glowing Eye
  circle(cx - 20, cy - 40, 18, '#00F2FE'); circle(cx - 20, cy - 40, 7, '#FFFFFF');

  ctx.restore();
  atmosphericDust(t, 45);
  filmAtmosphere(t);
}

// ── 9. REALISTIC PLASTIC WATER BOTTLE AT 11,000M ──────────────────────────────────
export function drawPlasticDiscovery(lt, d, t) {
  ctx.fillStyle = '#02050A'; ctx.fillRect(0, 0, W, H);

  hudHeader('SHOCKING POLLUTION // 11,000M', 'इंसानी प्लास्टिक कचरा मिला!', '#FF1744');

  ctx.save();
  const bx = 540, by = 680, s = 1.35;
  ctx.translate(bx, by); ctx.scale(s, s);

  // Virgin Seafloor Silt
  ctx.fillStyle = '#1B2631'; ctx.beginPath(); ctx.ellipse(0, 75, 330, 95, 0, 0, TAU); ctx.fill();

  // Translucent Blue Plastic Bottle with Realistic Reflections
  const botG = ctx.createLinearGradient(-45, 0, 45, 0);
  botG.addColorStop(0, 'rgba(0, 180, 255, 0.3)');
  botG.addColorStop(0.5, 'rgba(200, 240, 255, 0.6)');
  botG.addColorStop(1, 'rgba(0, 140, 220, 0.35)');
  ctx.fillStyle = botG; ctx.strokeStyle = '#00F2FE'; ctx.lineWidth = 6;

  ctx.beginPath(); ctx.roundRect(-46, -70, 92, 160, 16); ctx.fill(); ctx.stroke();
  // Bottle Neck & Cap
  ctx.fillRect(-22, -100, 44, 30); ctx.strokeRect(-22, -100, 44, 30);
  ctx.fillStyle = '#FF1744'; ctx.fillRect(-26, -118, 52, 20);

  // Brand Label
  ctx.fillStyle = 'rgba(255, 255, 255, 0.88)'; ctx.fillRect(-44, -10, 88, 45);
  ctx.font = '900 16px Inter, sans-serif'; ctx.fillStyle = '#000000'; ctx.textAlign = 'center';
  ctx.fillText('PLASTIC', 0, 18);

  // Red Prohibition Cross
  ctx.strokeStyle = '#FF1744'; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.arc(0, 0, 138, 0, TAU); ctx.stroke();
  line([[-98, -98], [98, 98]], '#FF1744', 10);

  ctx.restore();

  ctx.font = F(42, '900'); ctx.fillStyle = '#FF1744'; ctx.textAlign = 'center';
  ctx.fillText('11,000 मीटर नीचे भी इंसानी गंदगी!', 540, 1020);
}

// ── 10. MARIANA OUTRO ─────────────────────────────────────────────────────────────
export function drawOutroCTA(lt, d, t) {
  ctx.fillStyle = '#030814'; ctx.fillRect(0, 0, W, H);

  hudHeader('ANCHOR AADHYA OFFICIAL', 'कमेंट में बताएं और सब्सक्राइब करें!', '#FFE600');

  ctx.save();
  const ox = 540, oy = 660, s = 1.35;
  ctx.translate(ox, oy); ctx.scale(s, s);

  // Red YouTube Button
  ctx.fillStyle = '#FF0000'; ctx.beginPath(); ctx.roundRect(-160, -55, 320, 110, 26); ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath(); ctx.moveTo(-20, -32); ctx.lineTo(35, 0); ctx.lineTo(-20, 32); ctx.fill();

  ctx.font = '900 34px Inter, sans-serif'; ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center';
  ctx.fillText('SUBSCRIBE', 0, 105);

  // Bell
  const ring = Math.sin(t * 12) * 0.25;
  ctx.save(); ctx.translate(130, -55); ctx.rotate(ring);
  ctx.fillStyle = '#FFE600';
  ctx.beginPath(); ctx.arc(0, 0, 24, Math.PI, TAU); ctx.lineTo(26, 20); ctx.lineTo(-26, 20); ctx.fill();
  circle(0, 26, 8, '#FFE600');
  ctx.restore();

  drawOutroQuestionBubble('कमेंट्स में बताओ! ✍️');

  ctx.restore();
}

// ===================================================================================
// CHERNOBYL 300-SECOND DEATH ROOM (ELEPHANT'S FOOT) SCENES
// ===================================================================================

// ── C1. CHERNOBYL REACTOR NO. 4 // RADIATION HAZARD ────────────────────────────────
export function drawChernobylPlant(lt, d, t) {
  ctx.fillStyle = '#06070B'; ctx.fillRect(0, 0, W, H);

  hudHeader('CHERNOBYL ZONE // REACTOR NO. 4', 'दुनिया का सबसे खतरनाक कमरा', '#FFCC00');

  ctx.save();
  const cx = 540, cy = 670;

  // Giant Glowing Yellow Radiation Trefoil Symbol (☢)
  const pulse = 1 + 0.08 * Math.sin(t * 6);
  ctx.save(); ctx.translate(cx, cy); ctx.scale(pulse, pulse);

  // Warning Triangle
  ctx.fillStyle = '#FFCC00';
  ctx.beginPath();
  ctx.moveTo(0, -220); ctx.lineTo(210, 160); ctx.lineTo(-210, 160); ctx.closePath();
  ctx.fill(); ctx.strokeStyle = '#000000'; ctx.lineWidth = 14; ctx.stroke();

  // Radiation Blades
  ctx.fillStyle = '#000000';
  for (let k = 0; k < 3; k++) {
    const a = (k * TAU) / 3 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.arc(0, 0, 150, a - 0.52, a + 0.52); ctx.closePath(); ctx.fill();
  }
  circle(0, 0, 48, '#FFCC00'); circle(0, 0, 26, '#000000');
  ctx.restore();

  // Toxic Green Ambient Radiation Mist
  const mist = ctx.createRadialGradient(cx, cy + 200, 40, cx, cy + 200, 420);
  mist.addColorStop(0, 'rgba(0, 255, 120, 0.35)'); mist.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = mist; ctx.beginPath(); ctx.ellipse(cx, cy + 200, 430, 170, 0, 0, TAU); ctx.fill();

  ctx.restore();
  atmosphericDust(t, 35, 'rgba(255, 200, 0, 0.4)');
  filmAtmosphere(t);
}

// ── C2. 300-SECOND NIXIE DIGITAL COUNTDOWN TIMER ───────────────────────────────────
export function drawCountdownTimer(lt, d, t) {
  ctx.fillStyle = '#080004'; ctx.fillRect(0, 0, W, H);

  hudHeader('TIME TO LETHAL DOSE // COUNTDOWN', 'सिर्फ 300 सेकंड में मौत तय!', '#FF1744');

  ctx.save();
  const cx = 540, cy = 680;

  // Nixie / High-End LED Digital Clock Box
  const boxG = ctx.createLinearGradient(140, cy - 180, 140, cy + 100);
  boxG.addColorStop(0, '#24040C'); boxG.addColorStop(1, '#0F0104');
  ctx.fillStyle = boxG; ctx.strokeStyle = '#FF1744'; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.roundRect(130, cy - 180, 820, 260, 32); ctx.fill(); ctx.stroke();

  // Large Red Glowing Digital Numeral
  const shake = rnd(t * 14) * 8 - 4;
  const secs = Math.max(0, Math.round(300 - (lt / d) * 15));
  ctx.font = F(145, '900'); ctx.fillStyle = '#FF1744'; ctx.textAlign = 'center';
  ctx.fillText(`${secs}s`, cx + shake, cy + 10);

  ctx.font = F(42, '900'); ctx.fillStyle = '#FFE600';
  ctx.fillText('300 सेकंड = 100% FATAL DOSE', cx, cy + 170);

  // Strobe Warning Beacons
  const strobe = Math.sin(t * 12) > 0;
  circle(180, cy - 180, 28, strobe ? '#FF1744' : '#4A000E');
  circle(W - 180, cy - 180, 28, strobe ? '#FF1744' : '#4A000E');

  ctx.restore();
  filmAtmosphere(t, cy, 'rgba(255, 23, 68, 0.3)');
}

// ── C3. NUCLEAR REACTOR FIREBALL EXPLOSION (1986) ──────────────────────────────────
export function drawReactorExplosion(lt, d, t) {
  ctx.fillStyle = '#0F0302'; ctx.fillRect(0, 0, W, H);

  hudHeader('HISTORICAL DISASTER // APRIL 1986', 'चेरनोबिल रिएक्टर में भयानक विस्फोट', '#FF5500');

  ctx.save();
  const cx = 540, cy = 680;

  // Expanding Blinding Fireball
  const boom = eo(clamp(lt / 0.4));
  const R = lerp(90, 330, boom);
  const fire = ctx.createRadialGradient(cx, cy, 30, cx, cy, R);
  fire.addColorStop(0, '#FFFFFF');
  fire.addColorStop(0.2, '#FFE600');
  fire.addColorStop(0.65, '#FF3300');
  fire.addColorStop(1, 'rgba(40, 0, 0, 0)');
  ctx.fillStyle = fire;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();

  // Flying Shrapnel & Radioactive Glowing Sparks
  for (let i = 0; i < 22; i++) {
    const a = (i * TAU) / 22;
    const dist = (R + 50) * (0.85 + rnd(i) * 0.45);
    circle(cx + Math.cos(a) * dist, cy + Math.sin(a) * dist, 7 + rnd(i) * 11, '#FFCC00');
  }

  // Broken Concrete Reactor Ruin Silhouette
  ctx.fillStyle = '#171717'; ctx.strokeStyle = '#FF3300'; ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(140, 950); ctx.lineTo(250, 780); ctx.lineTo(340, 840);
  ctx.lineTo(440, 710); ctx.lineTo(540, 800); ctx.lineTo(660, 690);
  ctx.lineTo(770, 850); ctx.lineTo(940, 950); ctx.lineTo(140, 950);
  ctx.fill(); ctx.stroke();

  ctx.restore();
  filmAtmosphere(t, cy, 'rgba(255, 100, 0, 0.4)');
}

// ── C4. REALISTIC MOLTEN CORIUM LAVA FLOW ──────────────────────────────────────────
export function drawCoriumLavaFlow(lt, d, t) {
  ctx.fillStyle = '#050204'; ctx.fillRect(0, 0, W, H);

  hudHeader('MOLTEN CORIUM LAVA // BASEMENT', 'पिघला हुआ रेडियोएक्टिव लावा', '#FF6600');

  ctx.save();
  const cx = 540, cy = 660;

  // Broken Concrete Steel Pipe
  ctx.fillStyle = '#212121'; ctx.strokeStyle = '#616161'; ctx.lineWidth = 12;
  ctx.fillRect(480, 270, 120, 240); ctx.strokeRect(480, 270, 120, 240);

  // Viscous Molten Magma Stream Dripping Down
  const lava = ctx.createLinearGradient(cx - 80, 480, cx + 80, 880);
  lava.addColorStop(0, '#FFE600'); lava.addColorStop(0.45, '#FF3300'); lava.addColorStop(1, '#550000');
  ctx.fillStyle = lava;
  ctx.beginPath();
  ctx.moveTo(500, 500);
  ctx.quadraticCurveTo(cx - 30, 650, 510, 830);
  ctx.lineTo(570, 830);
  ctx.quadraticCurveTo(cx + 40, 650, 580, 500);
  ctx.fill();

  // Spreading Lava Magma Pool
  ctx.fillStyle = '#FF3300';
  ctx.beginPath(); ctx.ellipse(cx, 840, 370, 100, 0, 0, TAU); ctx.fill();
  circle(cx, 840, 70, '#FFE600');

  ctx.restore();
  filmAtmosphere(t);
}

// ── C5. REALISTIC ELEPHANT'S FOOT MONSTER (हाथी का पैर) ───────────────────────────
export function drawElephantsFoot(lt, d, t) {
  ctx.fillStyle = '#020306'; ctx.fillRect(0, 0, W, H);

  hudHeader("THE ELEPHANT'S FOOT // DEADLIEST OBJECT", 'हाथी का पैर: 2 मीटर चौड़ा लावा राक्षस', '#FF1744');

  ctx.save();
  const cx = 540, cy = 660;

  // Dramatic Harsh Forensic Beam
  const spot = ctx.createRadialGradient(cx, cy, 50, cx, cy, 390);
  spot.addColorStop(0, 'rgba(255, 230, 180, 0.95)');
  spot.addColorStop(0.35, 'rgba(255, 120, 0, 0.45)');
  spot.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = spot;
  ctx.beginPath(); ctx.ellipse(cx, cy + 40, 430, 250, 0, 0, TAU); ctx.fill();

  // Wrinkled Massive Corium Lava Mass
  const footG = ctx.createRadialGradient(cx, cy - 40, 40, cx, cy, 260);
  footG.addColorStop(0, '#3E353C'); footG.addColorStop(0.6, '#241E24'); footG.addColorStop(1, '#110D12');
  ctx.fillStyle = footG; ctx.strokeStyle = '#FF3300'; ctx.lineWidth = 8;

  ctx.beginPath();
  ctx.moveTo(cx - 265, cy + 80);
  ctx.quadraticCurveTo(cx - 240, cy - 125, cx - 120, cy - 185);
  ctx.quadraticCurveTo(cx, cy - 225, cx + 130, cy - 165);
  ctx.quadraticCurveTo(cx + 255, cy - 95, cx + 275, cy + 80);
  ctx.quadraticCurveTo(cx + 185, cy + 185, cx, cy + 195);
  ctx.quadraticCurveTo(cx - 195, cy + 185, cx - 265, cy + 80);
  ctx.fill(); ctx.stroke();

  // Glowing Ember Lava Folds & Veins
  ctx.strokeStyle = '#FF5500'; ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cx - 185, cy - 45); ctx.quadraticCurveTo(cx - 85, cy + 40, cx, cy + 20);
  ctx.moveTo(cx - 105, cy - 115); ctx.quadraticCurveTo(cx, cy - 65, cx + 125, cy - 75);
  ctx.moveTo(cx - 45, cy + 65); ctx.quadraticCurveTo(cx + 85, cy + 125, cx + 185, cy + 65);
  ctx.stroke();

  // Toxic Green Spores
  circle(cx - 75, cy - 50, 12, '#FFE600'); circle(cx + 95, cy + 20, 14, '#FF1744');

  ctx.restore();
  filmAtmosphere(t);
}

// ── C6. GEIGER COUNTER MAX RADIATION (10,000 ROENTGENS/HR) ─────────────────────────
export function drawGeigerCounter(lt, d, t) {
  ctx.fillStyle = '#05070C'; ctx.fillRect(0, 0, W, H);

  hudHeader('GEIGER COUNTER // MAXIMUM SCALE', 'रेडिएशन मीटर की सुई टूट गई!', '#FF1744');

  ctx.save();
  const cx = 540, cy = 680, R = 275;

  // Soviet Military Bakelite Gauge
  ctx.fillStyle = '#1B242F'; ctx.strokeStyle = '#FFE600'; ctx.lineWidth = 14;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill(); ctx.stroke();

  // Red Critical Radiation Zone
  ctx.strokeStyle = '#FF1744'; ctx.lineWidth = 26;
  ctx.beginPath(); ctx.arc(cx, cy, R - 25, Math.PI * 0.9, Math.PI * 1.85); ctx.stroke();

  // Dial Ticks
  for (let a = 0; a < TAU; a += Math.PI / 8) {
    const x1 = cx + Math.cos(a) * (R - 35), y1 = cy + Math.sin(a) * (R - 35);
    const x2 = cx + Math.cos(a) * (R - 60), y2 = cy + Math.sin(a) * (R - 60);
    line([[x1, y1], [x2, y2]], a > Math.PI ? '#FF1744' : '#8899AA', 6);
  }

  // Needle Vibrating at Absolute Max
  const shake = rnd(t * 14) * 8 - 4;
  const targetAngle = Math.PI * 1.76 + (shake * Math.PI) / 180;
  ctx.strokeStyle = '#FF1744'; ctx.lineWidth = 14;
  line([[cx, cy], [cx + Math.cos(targetAngle) * (R - 35), cy + Math.sin(targetAngle) * (R - 35)]], '#FF1744', 14);
  circle(cx, cy, 32, '#FFE600');

  ctx.font = F(76, '900'); ctx.fillStyle = '#FF1744'; ctx.textAlign = 'center';
  ctx.fillText('10,000 R/HR', cx, cy + 110);
  ctx.font = F(38, '800'); ctx.fillStyle = '#FFFFFF';
  ctx.fillText('जानलेवा खुराक से 10,000 गुना ज्यादा!', cx, 1020);

  ctx.restore();
  filmAtmosphere(t);
}

// ── C7. MELTING CAMERAS & ROBOTS ──────────────────────────────────────────────────
export function drawMeltingCameraRobot(lt, d, t) {
  ctx.fillStyle = '#060608'; ctx.fillRect(0, 0, W, H);

  hudHeader('EQUIPMENT FAILURE // RADIATION BURNOUT', 'कैमरे और रोबोट्स पिघल गए!', '#FFCC00');

  ctx.save();
  const cx = 540, cy = 680;

  // Mechanical Camera Box
  ctx.fillStyle = '#222B35'; ctx.strokeStyle = '#FFCC00'; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.roundRect(cx - 150, cy - 120, 300, 200, 18); ctx.fill(); ctx.stroke();
  // Lens
  circle(cx, cy - 20, 68, '#0F1720');
  ctx.strokeStyle = '#00F2FE'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(cx, cy - 20, 68, 0, TAU); ctx.stroke();
  circle(cx, cy - 20, 36, '#FFE600');

  // Melting Drips
  ctx.fillStyle = '#FF5500';
  for (let i = -100; i <= 100; i += 40) {
    const dripLen = 50 + rnd(i + t) * 70;
    line([[cx + i, cy + 80], [cx + i, cy + 80 + dripLen]], '#FF5500', 8);
  }

  // Radiation Gamma Static Lines
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  for (let k = 0; k < 12; k++) {
    const ry = cy - 200 + rnd(k + t * 5) * 400;
    ctx.fillRect(80, ry, W - 160, 4 + rnd(k) * 6);
  }

  ctx.restore();
  filmAtmosphere(t);
}

// ── C8. RADIOTROPHIC BLACK FUNGUS (काला फंगस) ──────────────────────────────────────
export function drawRadiotrophicFungus(lt, d, t) {
  ctx.fillStyle = '#020408'; ctx.fillRect(0, 0, W, H);

  hudHeader('RADIOTROPHIC FUNGUS // NATURE WINS', 'रेडिएशन खाकर उगता काला फंगस!', '#00FF99');

  ctx.save();
  const cx = 540, cy = 680;

  // Microscopic Glowing Petri Circle
  ctx.fillStyle = '#0A141E'; ctx.strokeStyle = '#00FF99'; ctx.lineWidth = 12;
  circle(cx, cy, 275, '#0A141E'); ctx.stroke();

  // Spreading Black Fungus Colony
  ctx.fillStyle = '#000000'; ctx.strokeStyle = '#00FF99'; ctx.lineWidth = 5;
  for (let i = 0; i < 9; i++) {
    const fa = (i * TAU) / 9;
    const fx = cx + Math.cos(fa) * 95, fy = cy + Math.sin(fa) * 95;
    const fr = 58 + Math.sin(t * 3 + i) * 15;
    ctx.beginPath(); ctx.arc(fx, fy, fr, 0, TAU); ctx.fill(); ctx.stroke();
  }
  circle(cx, cy, 75, '#000000'); ctx.stroke();

  // Melanin Energy Glowing Green Nodes
  for (let k = 0; k < 22; k++) {
    const a = (k * TAU) / 22;
    const r = 215 + Math.sin(t * 5 + k) * 20;
    circle(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 8, '#00FF99');
  }

  ctx.restore();
  filmAtmosphere(t);
}

// ── C9. CHERNOBYL OUTRO ───────────────────────────────────────────────────────────
export function drawChernobylOutro(lt, d, t) {
  ctx.fillStyle = '#040710'; ctx.fillRect(0, 0, W, H);

  hudHeader('ANCHOR AADHYA OFFICIAL', 'कमेंट में बताएं और सब्सक्राइब करें!', '#FFE600');

  ctx.save();
  const ox = 540, oy = 660, s = 1.35;
  ctx.translate(ox, oy); ctx.scale(s, s);

  // Red YouTube Button
  ctx.fillStyle = '#FF0000'; ctx.beginPath(); ctx.roundRect(-160, -55, 320, 110, 26); ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath(); ctx.moveTo(-20, -32); ctx.lineTo(35, 0); ctx.lineTo(-20, 32); ctx.fill();

  ctx.font = '900 34px Inter, sans-serif'; ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center';
  ctx.fillText('SUBSCRIBE', 0, 105);

  // Bell
  const ring = Math.sin(t * 12) * 0.25;
  ctx.save(); ctx.translate(130, -55); ctx.rotate(ring);
  ctx.fillStyle = '#FFE600';
  ctx.beginPath(); ctx.arc(0, 0, 24, Math.PI, TAU); ctx.lineTo(26, 20); ctx.lineTo(-26, 20); ctx.fill();
  circle(0, 26, 8, '#FFE600');
  ctx.restore();

  drawOutroQuestionBubble('क्या प्रकृति इंसान से बड़ी है? ✍️');

  ctx.restore();
}

// ── D. BLACK HOLE SPAGHETTIFICATION SUITE (1080x1920 9:16) ─────────────────────────

// ── D1. GARGANTUA ACCRETION DISK & CORE ─────────────────────────────────────────────
export function drawBlackHoleGargantua(lt, d, t) {
  ctx.fillStyle = '#020308'; ctx.fillRect(0, 0, W, H);

  // Distant twinkling stars
  ctx.fillStyle = '#FFFFFF';
  for (let i = 0; i < 45; i++) {
    const sx = (i * 137.5) % W;
    const sy = 120 + ((i * 73.1) % 1000);
    const alpha = 0.2 + 0.8 * Math.abs(Math.sin(t * 2 + i));
    ctx.globalAlpha = alpha;
    ctx.fillRect(sx, sy, 2 + (i % 3), 2 + (i % 3));
  }
  ctx.globalAlpha = 1.0;

  hudHeader('GARGANTUA BLACK HOLE // GRAVITY WELL', 'ब्लैक होल में गिरे तो क्या होगा?', '#FFAA00');

  ctx.save();
  const cx = 540, cy = 660;

  // Accretion disk glow behind event horizon
  const diskGlow = ctx.createRadialGradient(cx, cy, 140, cx, cy, 420);
  diskGlow.addColorStop(0, 'rgba(255, 170, 0, 0.9)');
  diskGlow.addColorStop(0.35, 'rgba(255, 77, 0, 0.65)');
  diskGlow.addColorStop(0.7, 'rgba(160, 20, 240, 0.3)');
  diskGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = diskGlow;
  ctx.beginPath(); ctx.ellipse(cx, cy, 440, 140, -0.15, 0, TAU); ctx.fill();

  // Swirling accretion filaments
  for (let k = 0; k < 6; k++) {
    const angleOffset = (t * 0.8 + k * 1.05) % TAU;
    ctx.strokeStyle = k % 2 === 0 ? '#FFD700' : '#FF4500';
    ctx.lineWidth = 4 + k * 1.5;
    ctx.globalAlpha = 0.5 + Math.sin(t * 3 + k) * 0.3;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 380 - k * 35, 110 - k * 10, -0.15 + Math.sin(t + k) * 0.05, angleOffset, angleOffset + Math.PI * 1.3);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  // Complete Black Hole Sphere (Event Horizon)
  circle(cx, cy, 155, '#000000');

  // Relativistic Doppler Beaming (Left side of disk brighter due to approaching matter)
  const beamGrad = ctx.createLinearGradient(cx - 300, cy, cx + 300, cy);
  beamGrad.addColorStop(0, 'rgba(255, 240, 180, 0.7)');
  beamGrad.addColorStop(0.4, 'rgba(255, 120, 0, 0.3)');
  beamGrad.addColorStop(1, 'rgba(255, 50, 0, 0.05)');
  ctx.fillStyle = beamGrad;
  ctx.beginPath(); ctx.ellipse(cx, cy, 400, 45, -0.15, 0, TAU); ctx.fill();

  // Thin razor-sharp Photon Sphere Ring
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 3.5;
  ctx.beginPath(); ctx.arc(cx, cy, 158, 0, TAU); ctx.stroke();
  ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(cx, cy, 163, 0, TAU); ctx.stroke();

  // Central Core: pure pitch-black abyss
  circle(cx, cy, 150, '#000000');

  ctx.restore();

  filmAtmosphere(t, 660, 'rgba(255, 170, 0, 0.35)');
}

// ── D2. EVENT HORIZON LASER GRID (घटना क्षितिज) ──────────────────────────────────
export function drawEventHorizonLaserGrid(lt, d, t) {
  ctx.fillStyle = '#020206'; ctx.fillRect(0, 0, W, H);

  hudHeader('EVENT HORIZON // POINT OF NO RETURN', 'घटना क्षितिज: वापसी असंभव!', '#FF1744');

  ctx.save();
  const cx = 540, cy = 670;

  // Space-Time curvature funnel grid
  ctx.strokeStyle = '#00F2FE'; ctx.lineWidth = 2;
  for (let r = 50; r <= 360; r += 45) {
    const warpR = r + Math.sin(t * 3 + r * 0.05) * 8;
    ctx.globalAlpha = 0.2 + (r / 360) * 0.6;
    ctx.beginPath(); ctx.arc(cx, cy, warpR, 0, TAU); ctx.stroke();
  }

  // Radiating rays curved toward center
  ctx.strokeStyle = '#FF1744'; ctx.lineWidth = 2.5;
  for (let a = 0; a < TAU; a += TAU / 16) {
    ctx.globalAlpha = 0.5 + Math.sin(t * 4 + a) * 0.3;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(a) * 380, cy + Math.sin(a) * 380);
    const midA = a + 0.35;
    ctx.quadraticCurveTo(cx + Math.cos(midA) * 220, cy + Math.sin(midA) * 220, cx + Math.cos(a + 0.7) * 110, cy + Math.sin(a + 0.7) * 110);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  // Inescapable Event Horizon Core
  circle(cx, cy, 110, '#000000');
  ctx.strokeStyle = '#FF1744'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(cx, cy, 112, 0, TAU); ctx.stroke();

  drawAutoTechCard("ESCAPE VELOCITY > SPEED OF LIGHT (c)", cx, 880, "#FF1744", 24);

  ctx.restore();

  ctx.font = F(42, '900'); ctx.fillStyle = '#FF1744'; ctx.textAlign = 'center';
  ctx.fillText('एक बार सीमा पार की, तो वापसी शून्य!', 540, 1020);

  filmAtmosphere(t);
}

// ── D3. GRAVITATIONAL LENSING (रोशनी का मुड़ना) ──────────────────────────────────
export function drawGravitationalLensing(lt, d, t) {
  ctx.fillStyle = '#03030A'; ctx.fillRect(0, 0, W, H);

  hudHeader('GRAVITATIONAL LENSING // LIGHT BENDING', 'प्रचंड ग्रैविटी ने रोशनी को मोड़ दिया!', '#00F2FE');

  ctx.save();
  const cx = 540, cy = 660;

  // Warped Einstein Rings
  for (let i = 0; i < 5; i++) {
    const rx = 240 + i * 35 + Math.sin(t * 2 + i) * 12;
    const ry = 210 + i * 28 + Math.cos(t * 2 + i) * 10;
    ctx.strokeStyle = i % 2 === 0 ? 'rgba(0, 242, 254, 0.65)' : 'rgba(255, 215, 0, 0.65)';
    ctx.lineWidth = 5 - i * 0.6;
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, t * 0.15 + i * 0.4, 0, TAU); ctx.stroke();
  }

  // Photon trajectories curving inward
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 3;
  for (let k = 0; k < 8; k++) {
    const startY = 320 + k * 85;
    ctx.beginPath();
    ctx.moveTo(120, startY);
    ctx.bezierCurveTo(cx - 180, startY, cx - 120, cy + (k < 4 ? -80 : 80), cx, cy);
    ctx.stroke();
  }

  // Pitch-black silhouette
  circle(cx, cy, 145, '#000000');
  ctx.strokeStyle = '#00F2FE'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(cx, cy, 147, 0, TAU); ctx.stroke();

  ctx.restore();

  filmAtmosphere(t, 660, 'rgba(0, 242, 254, 0.3)');
}

// ── D4. ASTRONAUT GRAVITY DIFFERENTIAL (पैरों पर भयानक खिंचाव) ───────────────────
export function drawAstronautGravityVectors(lt, d, t) {
  ctx.fillStyle = '#05070F'; ctx.fillRect(0, 0, W, H);

  hudHeader('TIDAL GRAVITY GRADIENT // EXTREME SHEAR', 'पैरों पर सिर से करोड़ों गुना खिंचाव!', '#FF5500');

  ctx.save();
  const cx = 540, cy = 600;

  // Astronaut Figure Falling Feet First
  // Helmet
  circle(cx, cy - 130, 42, '#E2E8F0');
  // Visor (Gold Reflective)
  circle(cx, cy - 130, 26, '#FFB703');
  // Torso
  ctx.fillStyle = '#CBD5E1'; ctx.strokeStyle = '#64748B'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(cx - 38, cy - 85, 76, 110, 16); ctx.fill(); ctx.stroke();
  // Arms
  line([[cx - 38, cy - 70], [cx - 85, cy - 30], [cx - 110, cy - 70]], '#CBD5E1', 14);
  line([[cx + 38, cy - 70], [cx + 85, cy - 30], [cx + 110, cy - 70]], '#CBD5E1', 14);
  // Legs stretched downward
  line([[cx - 22, cy + 25], [cx - 28, cy + 140]], '#CBD5E1', 18);
  line([[cx + 22, cy + 25], [cx + 28, cy + 140]], '#CBD5E1', 18);

  // Tidal Gravity Force Vectors (Head vs Feet)
  // Head vector: Small arrow (1G)
  ctx.strokeStyle = '#00FF66'; ctx.lineWidth = 5;
  line([[cx - 80, cy - 150], [cx - 80, cy - 110]], '#00FF66', 5);
  ctx.font = F(24, '900'); ctx.fillStyle = '#00FF66'; ctx.textAlign = 'right';
  ctx.fillText('HEAD: 1G', cx - 95, cy - 125);

  // Feet vectors: Gigantic pulsing red arrows (10,000,000G!)
  const pulseLen = 140 + Math.sin(t * 8) * 35;
  ctx.strokeStyle = '#FF1744'; ctx.lineWidth = 8;
  line([[cx - 28, cy + 150], [cx - 28, cy + 150 + pulseLen]], '#FF1744', 8);
  line([[cx + 28, cy + 150], [cx + 28, cy + 150 + pulseLen]], '#FF1744', 8);
  // Arrow heads
  ctx.fillStyle = '#FF1744';
  ctx.beginPath(); ctx.moveTo(cx - 45, cy + 150 + pulseLen); ctx.lineTo(cx - 28, cy + 175 + pulseLen); ctx.lineTo(cx - 11, cy + 150 + pulseLen); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx + 11, cy + 150 + pulseLen); ctx.lineTo(cx + 28, cy + 175 + pulseLen); ctx.lineTo(cx + 45, cy + 150 + pulseLen); ctx.fill();

  ctx.font = F(32, '900'); ctx.fillStyle = '#FF1744'; ctx.textAlign = 'center';
  ctx.fillText('FEET: 10,000,000G GRAVITATIONAL PULL!', cx, 915);

  ctx.restore();

  filmAtmosphere(t);
}

// ── D5. SPAGHETTIFICATION PROCESS (नूडल की तरह खिंचाव) ───────────────────────────
export function drawSpaghettificationProcess(lt, d, t) {
  ctx.fillStyle = '#030206'; ctx.fillRect(0, 0, W, H);

  hudHeader('SPAGHETTIFICATION // ATOMIC DISRUPTION', 'नूडल की तरह खिंचकर परमाणुओं में विखंडन!', '#FF0055');

  ctx.save();
  const cx = 540, cy = 620;

  // Multiple stretched human particle filaments stretching into singularity
  for (let i = -4; i <= 4; i++) {
    const fx = cx + i * 28;
    const grad = ctx.createLinearGradient(fx, 340, fx, 880);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(0.3, 'rgba(255, 0, 85, 0.8)');
    grad.addColorStop(0.7, 'rgba(255, 170, 0, 0.7)');
    grad.addColorStop(1, 'rgba(120, 0, 255, 0.4)');

    ctx.strokeStyle = grad;
    ctx.lineWidth = Math.max(2, 10 - Math.abs(i) * 1.8);
    ctx.beginPath();
    ctx.moveTo(fx, 350);
    const wave = Math.sin(t * 6 + i * 0.8) * 25;
    ctx.bezierCurveTo(fx + wave, 520, fx - wave, 700, cx, 890);
    ctx.stroke();
  }

  // Sparkling disassociated atoms
  for (let k = 0; k < 30; k++) {
    const ax = cx - 180 + ((k * 63 + t * 90) % 360);
    const ay = 420 + ((k * 47 + t * 240) % 450);
    const ar = 2 + (k % 4);
    circle(ax, ay, ar, k % 2 === 0 ? '#FFE600' : '#00F2FE');
  }

  // Inescapable singularity suction point
  circle(cx, 890, 36, '#000000');
  ctx.strokeStyle = '#FF0055'; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.arc(cx, 890, 38, 0, TAU); ctx.stroke();

  ctx.restore();

  filmAtmosphere(t, 620, 'rgba(255, 0, 85, 0.3)');
}

// ── D6. TIME DILATION // RELATIVISTIC FREEZE (समय का रुकना) ───────────────────────
export function drawFrozenTimeDilation(lt, d, t) {
  ctx.fillStyle = '#020409'; ctx.fillRect(0, 0, W, H);

  hudHeader('RELATIVISTIC TIME DILATION // t -> ∞', 'बाहर की दुनिया के लिए वक्त हमेशा को रुका!', '#00F2FE');

  ctx.save();
  const cx = 540, cy = 650;

  // Melting Warped Clock Face
  ctx.strokeStyle = '#00F2FE'; ctx.lineWidth = 10;
  ctx.fillStyle = '#0A1220';
  ctx.beginPath();
  ctx.ellipse(cx, cy, 240, 200, 0.12, 0, TAU);
  ctx.fill(); ctx.stroke();

  // Melting bottom drips
  for (let i = -140; i <= 140; i += 50) {
    line([[cx + i, cy + 180], [cx + i, cy + 240 + Math.sin(t * 3 + i) * 20]], '#00F2FE', 8);
  }

  // Frozen Clock Hands
  // Hour hand
  line([[cx, cy], [cx + 70, cy - 50]], '#FFFFFF', 8);
  // Minute hand
  line([[cx, cy], [cx - 40, cy - 130]], '#FFE600', 6);
  // Second hand frozen and vibrating slightly
  const vib = Math.sin(t * 25) * 0.02;
  line([[cx, cy], [cx + Math.sin(vib) * 160, cy - Math.cos(vib) * 160]], '#FF1744', 3.5);
  circle(cx, cy, 14, '#FF1744');

  drawAutoTechCard("TIME DILATION: Δt_ext / Δt_0 = ∞", cx, 875, "#00F2FE", 24);

  ctx.restore();

  filmAtmosphere(t, 650, 'rgba(0, 242, 254, 0.25)');
}

// ── D7. BLACK HOLE SINGULARITY CTA OUTRO ──────────────────────────────────────────
export function drawBlackHoleSingularityCTA(lt, d, t) {
  ctx.fillStyle = '#03050E'; ctx.fillRect(0, 0, W, H);

  hudHeader('ANCHOR AADHYA OFFICIAL // COSMOS', 'कमेंट में बताएं और सब्सक्राइब करें!', '#FFE600');

  ctx.save();
  const ox = 540, oy = 660, s = 1.35;
  ctx.translate(ox, oy); ctx.scale(s, s);

  // Glowing subscribe badge
  ctx.fillStyle = '#FF0000'; ctx.beginPath(); ctx.roundRect(-160, -55, 320, 110, 26); ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath(); ctx.moveTo(-20, -32); ctx.lineTo(35, 0); ctx.lineTo(-20, 32); ctx.fill();

  ctx.font = '900 34px Inter, sans-serif'; ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center';
  ctx.fillText('SUBSCRIBE', 0, 105);

  // Animated Bell
  const ring = Math.sin(t * 12) * 0.25;
  ctx.save(); ctx.translate(130, -55); ctx.rotate(ring);
  ctx.fillStyle = '#FFE600';
  ctx.beginPath(); ctx.arc(0, 0, 24, Math.PI, TAU); ctx.lineTo(26, 20); ctx.lineTo(-26, 20); ctx.fill();
  circle(0, 26, 8, '#FFE600');
  ctx.restore();

  drawOutroQuestionBubble('क्या ब्लैक होल में दूसरी दुनिया है? 🕳️');

  ctx.restore();

  filmAtmosphere(t);
}

// ── E. SINKING CAR SURVIVAL SUITE (1080x1920 9:16) ────────────────────────────────

// ── E1. SINKING CAR PLUNGE ────────────────────────────────────────────────────────
export function drawSinkingCarPlunge(lt, d, t) {
  ctx.fillStyle = "#020B18"; ctx.fillRect(0, 0, W, H);

  // Underwater ambient light rays from surface
  ctx.save();
  for (let i = 0; i < 6; i++) {
    const rx = 180 + i * 150 + Math.sin(t * 1.5 + i) * 35;
    const g = ctx.createLinearGradient(rx, 120, rx - 100, 950);
    g.addColorStop(0, "rgba(0, 242, 254, 0.22)");
    g.addColorStop(0.7, "rgba(2, 136, 209, 0.08)");
    g.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(rx - 30, 120); ctx.lineTo(rx + 30, 120);
    ctx.lineTo(rx + 140, 950); ctx.lineTo(rx - 40, 950);
    ctx.fill();
  }
  ctx.restore();

  hudHeader("SUBMERGED VEHICLE // EMERGENCY DESCENT", "कार पानी में गिरे तो क्या होता है?", "#00F2FE");

  ctx.save();
  const cx = 540, cy = 640;
  ctx.translate(cx, cy);
  ctx.rotate(0.18 + Math.sin(t * 2) * 0.04);

  // Car Body Silhouette
  ctx.fillStyle = "#1E293B"; ctx.strokeStyle = "#38BDF8"; ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.roundRect(-220, -50, 440, 110, [24, 24, 10, 10]);
  ctx.fill(); ctx.stroke();
  // Roof & Windows
  ctx.beginPath();
  ctx.moveTo(-140, -50); ctx.lineTo(-80, -115); ctx.lineTo(80, -115); ctx.lineTo(150, -50);
  ctx.closePath();
  ctx.fillStyle = "#0F172A"; ctx.fill(); ctx.stroke();
  // Side Window
  ctx.fillStyle = "rgba(56, 189, 248, 0.35)";
  ctx.beginPath();
  ctx.moveTo(-125, -55); ctx.lineTo(-75, -105); ctx.lineTo(70, -105); ctx.lineTo(135, -55);
  ctx.closePath(); ctx.fill();

  // Wheels
  circle(-140, 60, 36, "#020617"); circle(-140, 60, 16, "#64748B");
  circle(140, 60, 36, "#020617"); circle(140, 60, 16, "#64748B");

  // Headlights Beams Cutting Through Murky Water
  const beam = ctx.createLinearGradient(200, 0, 460, 40);
  beam.addColorStop(0, "rgba(255, 230, 0, 0.85)");
  beam.addColorStop(1, "rgba(255, 230, 0, 0)");
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(210, -20); ctx.lineTo(460, -70); ctx.lineTo(460, 90); ctx.lineTo(210, 30);
  ctx.fill();

  // Rising Air Bubbles
  ctx.restore();
  for (let k = 0; k < 22; k++) {
    const bx = cx - 180 + ((k * 37 + t * 40) % 360);
    const by = cy + 120 - ((k * 53 + t * 140) % 400);
    circle(bx, by, 3 + (k % 5), "rgba(255, 255, 255, 0.65)");
  }

  filmAtmosphere(t, 640, "rgba(0, 242, 254, 0.2)");
}

// ── E2. DOOR PRESSURE LOCK (800 KG HYDROSTATIC LOCK) ──────────────────────────────
export function drawDoorPressureLock(lt, d, t) {
  ctx.fillStyle = "#040914"; ctx.fillRect(0, 0, W, H);

  hudHeader("HYDROSTATIC PRESSURE // DOOR JAMMED", "दरवाज़े पर भारी पानी का दबाव!", "#FF1744");

  ctx.save();
  const cx = 540, cy = 630;

  // Car Door Cross Section
  ctx.fillStyle = "#1E293B"; ctx.strokeStyle = "#64748B"; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.roundRect(cx - 120, cy - 240, 240, 440, 20); ctx.fill(); ctx.stroke();

  // Window frame in door
  ctx.fillStyle = "#0F172A"; ctx.strokeStyle = "#38BDF8"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(cx - 95, cy - 220, 190, 170, 12); ctx.fill(); ctx.stroke();

  // Red Inward Water Pressure Force Arrows Slamming Against Door
  const wave = Math.sin(t * 8) * 15;
  for (let y = cy - 180; y <= cy + 150; y += 75) {
    ctx.strokeStyle = "#FF1744"; ctx.lineWidth = 7;
    line([[cx + 260 + wave, y], [cx + 140, y]], "#FF1744", 7);
    // Arrow head
    ctx.fillStyle = "#FF1744";
    ctx.beginPath();
    ctx.moveTo(cx + 140, y); ctx.lineTo(cx + 165, y - 14); ctx.lineTo(cx + 165, y + 14);
    ctx.fill();
  }

  drawAutoTechCard("OUTSIDE WATER PRESSURE: 800 KG!", cx, cy + 245, "#FF1744", 24);

  ctx.restore();
  filmAtmosphere(t);
}

// ── E3. WATER WEIGHT 800KG PRESS ──────────────────────────────────────────────────
export function drawWaterWeightPress(lt, d, t) {
  ctx.fillStyle = "#020712"; ctx.fillRect(0, 0, W, H);

  hudHeader("PHYSICAL FORCE COMPARISON // 800 KG", "इंसानी ताकत से बाहर खोलना नामुमकिन!", "#FFAA00");

  ctx.save();
  const cx = 540, cy = 620;

  // Massive 800KG Hydraulic Weight Graphic
  ctx.fillStyle = "#334155"; ctx.strokeStyle = "#F59E0B"; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.roundRect(cx - 220, cy - 160, 440, 220, 18); ctx.fill(); ctx.stroke();

  ctx.font = F(82, "900"); ctx.fillStyle = "#F59E0B"; ctx.textAlign = "center";
  ctx.fillText("800 KG", cx, cy - 40);
  ctx.font = F(32, "900"); ctx.fillStyle = "#FFFFFF";
  ctx.fillText("WATER COLUMN WEIGHT", cx, cy + 25);

  // Human Strength Vector vs Water Pressure
  ctx.fillStyle = "rgba(16, 185, 129, 0.15)"; ctx.strokeStyle = "#10B981"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(cx - 220, cy + 85, 210, 85, 12); ctx.fill(); ctx.stroke();
  ctx.font = F(24, "900"); ctx.fillStyle = "#10B981";
  ctx.fillText("HUMAN PUSH", cx - 115, cy + 120);
  ctx.font = F(30, "900"); ctx.fillStyle = "#FFFFFF";
  ctx.fillText("~40-50 KG", cx - 115, cy + 155);

  ctx.fillStyle = "rgba(239, 68, 68, 0.15)"; ctx.strokeStyle = "#EF4444"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(cx + 10, cy + 85, 210, 85, 12); ctx.fill(); ctx.stroke();
  ctx.font = F(24, "900"); ctx.fillStyle = "#EF4444";
  ctx.fillText("WATER FORCE", cx + 115, cy + 120);
  ctx.font = F(30, "900"); ctx.fillStyle = "#FFFFFF";
  ctx.fillText("800 KG!", cx + 115, cy + 155);

  ctx.restore();
  filmAtmosphere(t, 620, "rgba(245, 158, 11, 0.2)");
}

// ── E4. TRAPPED PASSENGER STRUGGLE ────────────────────────────────────────────────
export function drawTrappedPassenger(lt, d, t) {
  ctx.fillStyle = "#0A0205"; ctx.fillRect(0, 0, W, H);

  hudHeader("CABIN TRAP // ZERO VISIBILITY", "दरवाज़ा धकेलना जानलेवा खतरा!", "#FF1744");

  ctx.save();
  const cx = 540, cy = 620;

  // Passenger Silhouette Pushing
  circle(cx - 30, cy - 130, 48, "#E2E8F0");
  ctx.fillStyle = "#64748B";
  ctx.beginPath(); ctx.roundRect(cx - 75, cy - 70, 90, 160, 20); ctx.fill();
  // Arms pushing forward
  line([[cx - 20, cy - 40], [cx + 80, cy - 40]], "#E2E8F0", 18);
  line([[cx - 20, cy], [cx + 80, cy]], "#E2E8F0", 18);

  // Red Pressure Barrier Wall
  ctx.strokeStyle = "#FF1744"; ctx.lineWidth = 14;
  line([[cx + 90, cy - 200], [cx + 90, cy + 180]], "#FF1744", 14);

  drawAutoTechCard("DO NOT PANIC // DO NOT PUSH DOOR", cx, cy + 205, "#FF1744", 24);

  ctx.restore();
  filmAtmosphere(t);
}

// ── E5. SEATBELT UNLATCH & WINDOW ROLL ─────────────────────────────────────────────
export function drawSeatbeltAndWindow(lt, d, t) {
  ctx.fillStyle = "#020F0D"; ctx.fillRect(0, 0, W, H);

  hudHeader("SURVIVAL STEP 1 // UNBUCKLE & WINDOW", "सीटबेल्ट खोलें और खिड़की नीचे करें!", "#10B981");

  ctx.save();
  const cx = 540, cy = 620;

  // Seatbelt Buckle Mechanism
  ctx.fillStyle = "#1E293B"; ctx.strokeStyle = "#10B981"; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.roundRect(cx - 180, cy - 130, 150, 190, 16); ctx.fill(); ctx.stroke();
  // Red PRESS Button
  ctx.fillStyle = "#EF4444";
  ctx.beginPath(); ctx.roundRect(cx - 160, cy - 100, 110, 50, 8); ctx.fill();
  ctx.font = F(24, "900"); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center";
  ctx.fillText("PRESS", cx - 105, cy - 68);

  // Belt Strap Releasing
  ctx.fillStyle = "#0F172A";
  ctx.beginPath(); ctx.roundRect(cx - 145, cy + 70, 80, 100, 6); ctx.fill();

  // Electric / Manual Window Rolling Down
  ctx.fillStyle = "#1E293B"; ctx.strokeStyle = "#38BDF8"; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.roundRect(cx + 30, cy - 130, 150, 190, 16); ctx.fill(); ctx.stroke();

  // Glass sliding down with arrow
  ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
  const glassY = cy - 70 + Math.min(60, (lt / d) * 70);
  ctx.fillRect(cx + 40, glassY, 130, 120);

  // Downward Green Arrow
  ctx.strokeStyle = "#10B981"; ctx.lineWidth = 6;
  line([[cx + 105, cy - 100], [cx + 105, cy - 30]], "#10B981", 6);
  ctx.fillStyle = "#10B981";
  ctx.beginPath();
  ctx.moveTo(cx + 105, cy - 20); ctx.lineTo(cx + 90, cy - 40); ctx.lineTo(cx + 120, cy - 40);
  ctx.fill();

  // Tactical badge
  ctx.font = F(28, "900"); ctx.fillStyle = "#10B981"; ctx.textAlign = "center";
  ctx.fillText("PRESSURE EQUALIZATION IN PROGRESS", cx, cy + 225);

  ctx.restore();
  filmAtmosphere(t, 620, "rgba(16, 185, 129, 0.2)");
}

// ── E6. HEADREST GLASS BREAKER (कांच तोड़ने का हथियार) ────────────────────────────
export function drawHeadrestGlassBreaker(lt, d, t) {
  ctx.fillStyle = "#0A0406"; ctx.fillRect(0, 0, W, H);

  hudHeader("EMERGENCY TOOL // STEEL HEADREST PRONGS", "सीट का हेडरेस्ट निकालें और कोने पर मारें!", "#FFE600");

  ctx.save();
  const cx = 540, cy = 620;

  // Car Seat Headrest Illustration
  ctx.fillStyle = "#1E293B"; ctx.strokeStyle = "#FFE600"; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.roundRect(cx - 140, cy - 200, 280, 130, 24); ctx.fill(); ctx.stroke();

  // Two Steel Prongs Extending Downwards
  ctx.fillStyle = "#CBD5E1"; ctx.strokeStyle = "#94A3B8"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(cx - 70, cy - 70, 24, 150, 4); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(cx + 46, cy - 70, 24, 150, 4); ctx.fill(); ctx.stroke();

  // Steel Sharpened Tips
  ctx.fillStyle = "#F8FAFC";
  ctx.beginPath(); ctx.moveTo(cx - 70, cy + 80); ctx.lineTo(cx - 58, cy + 100); ctx.lineTo(cx - 46, cy + 80); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx + 46, cy + 80); ctx.lineTo(cx + 58, cy + 100); ctx.lineTo(cx + 70, cy + 80); ctx.fill();

  // Spiderweb Glass Cracking Pattern at bottom right corner
  ctx.strokeStyle = "rgba(255, 255, 255, 0.85)"; ctx.lineWidth = 3;
  const kx = cx + 58, ky = cy + 100;
  for (let a = 0; a < TAU; a += TAU / 10) {
    ctx.beginPath();
    ctx.moveTo(kx, ky);
    ctx.lineTo(kx + Math.cos(a) * 90, ky + Math.sin(a) * 90);
    ctx.stroke();
  }

  // Tactical Alert
  ctx.font = F(30, "900"); ctx.fillStyle = "#FFE600"; ctx.textAlign = "center";
  ctx.fillText("STRIKE CORNER // NEVER CENTER", cx, cy + 225);

  ctx.restore();
  filmAtmosphere(t);
}

// ── E7. CAR ESCAPE OUTRO CTA ──────────────────────────────────────────────────────
export function drawCarEscapeCTA(lt, d, t) {
  ctx.fillStyle = "#010C1A"; ctx.fillRect(0, 0, W, H);

  hudHeader("ANCHOR AADHYA OFFICIAL // SURVIVAL", "कमेंट में बताएं और सब्सक्राइब करें!", "#FFE600");

  ctx.save();
  const ox = 540, oy = 640, s = 1.35;
  ctx.translate(ox, oy); ctx.scale(s, s);

  // Red YouTube Button
  ctx.fillStyle = "#FF0000"; ctx.beginPath(); ctx.roundRect(-160, -55, 320, 110, 26); ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath(); ctx.moveTo(-20, -32); ctx.lineTo(35, 0); ctx.lineTo(-20, 32); ctx.fill();

  ctx.font = "900 34px Inter, sans-serif"; ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center";
  ctx.fillText("SUBSCRIBE", 0, 105);

  // Bell
  const ring = Math.sin(t * 12) * 0.25;
  ctx.save(); ctx.translate(130, -55); ctx.rotate(ring);
  ctx.fillStyle = "#FFE600";
  ctx.beginPath(); ctx.arc(0, 0, 24, Math.PI, TAU); ctx.lineTo(26, 20); ctx.lineTo(-26, 20); ctx.fill();
  circle(0, 26, 8, "#FFE600");
  ctx.restore();

  drawOutroQuestionBubble("क्या आपको यह हेडरेस्ट ट्रिक पता थी? 🚗");

  ctx.restore();
  filmAtmosphere(t);
}

// ── F. UNIVERSAL SCIENCE & HUMAN ANATOMY PROCEDURAL SUITE ─────────────────────────

// ── F1. HUMAN BRAIN SYNAPSE FIRING ────────────────────────────────────────────────
export function drawHumanBrainSynapse(lt, d, t) {
  ctx.fillStyle = "#05030A"; ctx.fillRect(0, 0, W, H);
  hudHeader("HUMAN BRAIN // NEURAL SYNAPSES", "दिमाग के न्यूरॉन्स और विद्युत संकेत!", "#A855F7");

  ctx.save();
  const cx = 540, cy = 630;

  // Brain Profile Silhouette
  ctx.fillStyle = "#1E1035"; ctx.strokeStyle = "#A855F7"; ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.ellipse(cx, cy - 20, 220, 170, 0, 0, TAU);
  ctx.fill(); ctx.stroke();

  // Neural Firing Network
  for (let k = 0; k < 18; k++) {
    const a = (k * TAU) / 18;
    const r = 80 + Math.sin(t * 4 + k) * 60;
    const nx = cx + Math.cos(a) * r, ny = cy - 20 + Math.sin(a) * r;
    circle(nx, ny, 6, "#FFD700");

    // Connecting Synaptic Lightning
    ctx.strokeStyle = "rgba(168, 85, 247, 0.65)"; ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 20);
    ctx.lineTo(nx, ny);
    ctx.stroke();
  }

  ctx.restore();
  filmAtmosphere(t, 630, "rgba(168, 85, 247, 0.25)");
}

// ── F2. CELLULAR DNA STRUCTURE ────────────────────────────────────────────────────
export function drawCellularDNAStructure(lt, d, t) {
  ctx.fillStyle = "#020712"; ctx.fillRect(0, 0, W, H);
  hudHeader("CELLULAR BIOLOGY // DNA DOUBLE HELIX", "जीवन का आनुवंशिक कोड: डीएनए!", "#00F2FE");

  ctx.save();
  const cx = 540, cy = 630;

  for (let y = -220; y <= 220; y += 22) {
    const phase = (y * 0.035 + t * 3);
    const x1 = cx + Math.sin(phase) * 140;
    const x2 = cx - Math.sin(phase) * 140;

    // Rung
    ctx.strokeStyle = "rgba(255, 215, 0, 0.5)"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(x1, cy + y); ctx.lineTo(x2, cy + y); ctx.stroke();

    // Strands
    circle(x1, cy + y, 9, "#00F2FE");
    circle(x2, cy + y, 9, "#FF1744");
  }

  ctx.restore();
  filmAtmosphere(t, 630, "rgba(0, 242, 254, 0.2)");
}

// ── F3. HEART ARTERY PRESSURE ─────────────────────────────────────────────────────
export function drawHeartArteryPressure(lt, d, t) {
  ctx.fillStyle = "#0A0205"; ctx.fillRect(0, 0, W, H);
  hudHeader("CARDIOVASCULAR SYSTEM // HEART RATE", "दिल की धड़कन और रक्तचाप का दबाव!", "#FF1744");

  ctx.save();
  const cx = 540, cy = 600;
  const beat = 1 + 0.12 * Math.sin(t * 8);

  ctx.save();
  ctx.translate(cx, cy); ctx.scale(beat, beat);
  // Heart Shape
  ctx.fillStyle = "#E11D48"; ctx.strokeStyle = "#FFE4E6"; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(0, 40);
  ctx.bezierCurveTo(-120, -80, -120, -160, 0, -100);
  ctx.bezierCurveTo(120, -160, 120, -80, 0, 40);
  ctx.fill(); ctx.stroke();
  ctx.restore();

  // ECG Pulse Monitor
  ctx.strokeStyle = "#00FF66"; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(100, cy + 200);
  for (let x = 100; x <= 980; x += 10) {
    let py = cy + 200;
    const waveX = (x - t * 160) % 300;
    if (waveX > 100 && waveX < 140) py -= 65;
    else if (waveX >= 140 && waveX < 170) py += 45;
    ctx.lineTo(x, py);
  }
  ctx.stroke();

  ctx.restore();
  filmAtmosphere(t);
}

// ── F4. ATM CASH MECHANICS ────────────────────────────────────────────────────────
export function drawAtmCashMechanics(lt, d, t) {
  ctx.fillStyle = "#020914"; ctx.fillRect(0, 0, W, H);
  hudHeader("ATM MECHANISM // UV SENSOR SCAN", "नोट बाहर आने से पहले 3 सेकंड की जांच!", "#00F2FE");

  ctx.save();
  const cx = 540, cy = 620;

  // Machine Interior Rollers
  for (let i = -1; i <= 1; i++) {
    circle(cx + i * 160, cy - 80, 44, "#334155");
    circle(cx + i * 160, cy + 80, 44, "#334155");
  }

  // Fast Banknote Moving Through
  ctx.fillStyle = "#10B981"; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.roundRect(cx - 180, cy - 45, 360, 90, 8); ctx.fill(); ctx.stroke();
  ctx.font = F(42, "900"); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center";
  ctx.fillText("₹ 500", cx, cy + 12);

  // Purple UV Optical Laser Sensor Beam
  ctx.strokeStyle = "#A855F7"; ctx.lineWidth = 6;
  line([[cx - 240, cy], [cx + 240, cy]], "#A855F7", 6);

  ctx.restore();
  filmAtmosphere(t, 620, "rgba(168, 85, 247, 0.25)");
}

// ── F5. MICROSCOPIC BACTERIA ──────────────────────────────────────────────────────
export function drawMicroscopicBacteria(lt, d, t) {
  ctx.fillStyle = "#040A06"; ctx.fillRect(0, 0, W, H);
  hudHeader("MICROBIOLOGY // BACTERIAL SWARM", "सूक्ष्मजीव और बैक्टीरिया का हमला!", "#22C55E");

  ctx.save();
  const cx = 540, cy = 620;
  circle(cx, cy, 260, "#062211");

  // Bacteria Rods
  for (let k = 0; k < 14; k++) {
    const bx = cx - 180 + ((k * 57 + t * 25) % 360);
    const by = cy - 180 + ((k * 43 + t * 35) % 360);
    ctx.save(); ctx.translate(bx, by); ctx.rotate(k + t);
    ctx.fillStyle = "#4ADE80"; ctx.beginPath(); ctx.roundRect(-24, -10, 48, 20, 8); ctx.fill();
    ctx.restore();
  }

  ctx.restore();
  filmAtmosphere(t);
}

// ── F6. EAR CANAL CROSS SECTION ───────────────────────────────────────────────────
export function drawEarCanalCrossSection(lt, d, t) {
  ctx.fillStyle = "#080407"; ctx.fillRect(0, 0, W, H);
  hudHeader("HUMAN EAR ANATOMY // TYMPANIC MEMBRANE", "कान का नाजुक पर्दा और नसें!", "#F43F5E");

  ctx.save();
  const cx = 540, cy = 620;

  // Ear Canal Tunnel
  ctx.fillStyle = "#2D1222"; ctx.strokeStyle = "#F43F5E"; ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(140, cy - 120); ctx.quadraticCurveTo(cx - 50, cy - 80, cx + 80, cy - 100);
  ctx.lineTo(cx + 80, cy + 100); ctx.quadraticCurveTo(cx - 50, cy + 80, 140, cy + 120);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // Vibrating Eardrum
  const vib = Math.sin(t * 20) * 8;
  ctx.strokeStyle = "#FFE4E6"; ctx.lineWidth = 10;
  line([[cx + 80 + vib, cy - 90], [cx + 80 - vib, cy + 90]], "#FFE4E6", 10);

  ctx.restore();
  filmAtmosphere(t);
}

// ── F7. AIRPLANE COCKPIT RADAR ────────────────────────────────────────────────────
export function drawAirplaneCockpitRadar(lt, d, t) {
  ctx.fillStyle = "#020712"; ctx.fillRect(0, 0, W, H);
  hudHeader("AVIONICS // FLIGHT ALTITUDE RADAR", "हवाई जहाज और मोबाइल सिग्नल्स!", "#38BDF8");

  ctx.save();
  const cx = 540, cy = 620;

  // Circular Radar Display
  circle(cx, cy, 240, "#082F49");
  ctx.strokeStyle = "#38BDF8"; ctx.lineWidth = 4;
  for (let r = 60; r <= 240; r += 60) {
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.stroke();
  }

  // Radar Sweep Line
  const sweep = t * 2.5;
  ctx.strokeStyle = "#00FF66"; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(sweep) * 240, cy + Math.sin(sweep) * 240);
  ctx.stroke();

  ctx.restore();
  filmAtmosphere(t, 620, "rgba(56, 189, 248, 0.2)");
}

// ── F8. TOOTH ACID CAVITY DECAY ───────────────────────────────────────────────────
export function drawToothAcidCavityDecay(lt, d, t) {
  ctx.fillStyle = "#0A0503"; ctx.fillRect(0, 0, W, H);
  hudHeader("DENTAL SCIENCE // ACID EROSION", "दांत का इनेमल और कैविटी का सच!", "#F59E0B");

  ctx.save();
  const cx = 540, cy = 620;

  // Tooth White Molar
  ctx.fillStyle = "#F8FAFC"; ctx.strokeStyle = "#CBD5E1"; ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cx - 110, cy - 140);
  ctx.quadraticCurveTo(cx, cy - 160, cx + 110, cy - 140);
  ctx.lineTo(cx + 85, cy + 120);
  ctx.lineTo(cx + 35, cy + 60);
  ctx.lineTo(cx, cy + 130);
  ctx.lineTo(cx - 35, cy + 60);
  ctx.lineTo(cx - 85, cy + 120);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // Dark Cavity Hole
  circle(cx + 25, cy - 90, 36, "#1C1917");

  ctx.restore();
  filmAtmosphere(t);
}

// ── F9. DEHYDRATION ORGAN FAILURE ─────────────────────────────────────────────────
export function drawDehydrationOrganFailure(lt, d, t) {
  ctx.fillStyle = "#0A0302"; ctx.fillRect(0, 0, W, H);
  hudHeader("BIOLOGY // HYDRATION CRITICAL", "बिना पानी 7 दिन में क्या होगा?", "#EF4444");

  ctx.save();
  const cx = 540, cy = 620;

  // Water Level Gauge Box
  ctx.fillStyle = "#1E293B"; ctx.strokeStyle = "#EF4444"; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.roundRect(cx - 160, cy - 200, 320, 400, 20); ctx.fill(); ctx.stroke();

  // Fluid Level Dropping
  const hLevel = Math.max(50, 350 - (lt / d) * 260);
  ctx.fillStyle = "#EF4444";
  ctx.fillRect(cx - 140, cy + 180 - hLevel, 280, hLevel);

  ctx.font = F(72, "900"); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center";
  ctx.fillText("CRITICAL", cx, cy);

  ctx.restore();
  filmAtmosphere(t);
}

// ── F10. URINE BLADDER EXPANSION ──────────────────────────────────────────────────
export function drawUrineBladderExpansion(lt, d, t) {
  ctx.fillStyle = "#0A0702"; ctx.fillRect(0, 0, W, H);
  hudHeader("RENAL SYSTEM // BLADDER PRESSURE", "घंटों पेशाब रोकने से शरीर में खतरा!", "#EAB308");

  ctx.save();
  const cx = 540, cy = 620;
  const stretch = 1 + 0.15 * Math.sin(t * 5);

  ctx.save(); ctx.translate(cx, cy); ctx.scale(stretch, stretch);
  ctx.fillStyle = "#854D0E"; ctx.strokeStyle = "#EAB308"; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.ellipse(0, 0, 180, 140, 0, 0, TAU); ctx.fill(); ctx.stroke();
  ctx.restore();

  ctx.restore();
  filmAtmosphere(t);
}

// ── F11. SNEEZE BLAST PRESSURE ────────────────────────────────────────────────────
export function drawSneezeBlastPressure(lt, d, t) {
  ctx.fillStyle = "#03080F"; ctx.fillRect(0, 0, W, H);
  hudHeader("RESPIRATORY VELOCITY // 160 KM/H", "छींक रोकने से अंदर होता है विस्फोट!", "#06B6D4");

  ctx.save();
  const cx = 540, cy = 620;

  // Expanding Pressure Shockwave Rings
  for (let r = 60; r <= 260; r += 50) {
    const pulseR = (r + t * 140) % 280;
    ctx.strokeStyle = "#06B6D4"; ctx.lineWidth = 4;
    ctx.globalAlpha = 1 - pulseR / 280;
    ctx.beginPath(); ctx.arc(cx, cy, pulseR, 0, TAU); ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  ctx.font = F(84, "900"); ctx.fillStyle = "#06B6D4"; ctx.textAlign = "center";
  ctx.fillText("160 KM/H", cx, cy + 25);

  ctx.restore();
  filmAtmosphere(t);
}

// ── F12. TATTOO INK MACROPHAGE ────────────────────────────────────────────────────
export function drawTattooInkMacrophage(lt, d, t) {
  ctx.fillStyle = "#090308"; ctx.fillRect(0, 0, W, H);
  hudHeader("DERMATOLOGY // LYMPHATIC SYSTEM", "टैटू की स्याही कहाँ गायब होती है?", "#EC4899");

  ctx.save();
  const cx = 540, cy = 620;

  // Skin Dermis Layers
  ctx.fillStyle = "#831843"; ctx.fillRect(120, cy - 140, 840, 90);
  ctx.fillStyle = "#500724"; ctx.fillRect(120, cy - 50, 840, 190);

  // Trapped Black Ink Particles
  for (let k = 0; k < 20; k++) {
    const ix = 200 + ((k * 43) % 680);
    const iy = cy - 20 + ((k * 29) % 130);
    circle(ix, iy, 12, "#000000");
    ctx.strokeStyle = "#EC4899"; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(ix, iy, 18, 0, TAU); ctx.stroke();
  }

  ctx.restore();
  filmAtmosphere(t);
}

// ── F13. SOLAR FLARE CORONAL MASS ─────────────────────────────────────────────────
export function drawSolarFlareCoronalMass(lt, d, t) {
  ctx.fillStyle = "#0C0200"; ctx.fillRect(0, 0, W, H);
  hudHeader("ASTROPHYSICS // SOLAR FLARE PROMINENCE", "सूर्य का प्रचंड प्लाज्मा विस्फोट!", "#F97316");

  ctx.save();
  const cx = 540, cy = 630;

  // Giant Fiery Corona
  circle(cx, cy, 190, "#EA580C");
  circle(cx, cy, 150, "#FBBF24");

  // Magnetic Looping Plasma Arc
  ctx.strokeStyle = "#F97316"; ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.arc(cx, cy - 120, 130, Math.PI * 0.9, TAU * 0.95);
  ctx.stroke();

  ctx.restore();
  filmAtmosphere(t, 630, "rgba(249, 115, 22, 0.3)");
}

// ── F14. NEUTRON STAR PULSAR ──────────────────────────────────────────────────────
export function drawNeutronStarPulsar(lt, d, t) {
  ctx.fillStyle = "#01030B"; ctx.fillRect(0, 0, W, H);
  hudHeader("RELATIVISTIC PULSAR // MAGNETIC JETS", "ब्रह्मांड का सबसे घना तारा!", "#38BDF8");

  ctx.save();
  const cx = 540, cy = 620;

  // Rotating Gamma Beams
  const rot = t * 6;
  ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
  const beamG = ctx.createLinearGradient(0, -320, 0, 320);
  beamG.addColorStop(0, "rgba(56, 189, 248, 0.9)");
  beamG.addColorStop(0.5, "rgba(255, 255, 255, 1)");
  beamG.addColorStop(1, "rgba(56, 189, 248, 0.9)");
  ctx.fillStyle = beamG;
  ctx.beginPath();
  ctx.moveTo(-16, -320); ctx.lineTo(16, -320); ctx.lineTo(6, 0); ctx.lineTo(-6, 0); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-16, 320); ctx.lineTo(16, 320); ctx.lineTo(6, 0); ctx.lineTo(-6, 0); ctx.fill();
  ctx.restore();

  // Dense Core
  circle(cx, cy, 55, "#FFFFFF");
  circle(cx, cy, 65, "rgba(56, 189, 248, 0.45)");

  ctx.restore();
  filmAtmosphere(t);
}

// ── F15. UNIVERSAL OUTRO CTA ──────────────────────────────────────────────────────
export function drawUniversalOutroCTA(lt, d, t) {
  ctx.fillStyle = "#030612"; ctx.fillRect(0, 0, W, H);
  hudHeader("ANCHOR AADHYA OFFICIAL", "कमेंट में बताएं और सब्सक्राइब करें!", "#FFE600");

  ctx.save();
  const ox = 540, oy = 640, s = 1.35;
  ctx.translate(ox, oy); ctx.scale(s, s);

  // Red YouTube Button
  ctx.fillStyle = "#FF0000"; ctx.beginPath(); ctx.roundRect(-160, -55, 320, 110, 26); ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath(); ctx.moveTo(-20, -32); ctx.lineTo(35, 0); ctx.lineTo(-20, 32); ctx.fill();

  ctx.font = "900 34px Inter, sans-serif"; ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center";
  ctx.fillText("SUBSCRIBE", 0, 105);

  // Bell
  const ring = Math.sin(t * 12) * 0.25;
  ctx.save(); ctx.translate(130, -55); ctx.rotate(ring);
  ctx.fillStyle = "#FFE600";
  ctx.beginPath(); ctx.arc(0, 0, 24, Math.PI, TAU); ctx.lineTo(26, 20); ctx.lineTo(-26, 20); ctx.fill();
  circle(0, 26, 8, "#FFE600");
  ctx.restore();

  drawOutroQuestionBubble("आपकी क्या राय है? कमेंट्स में बताएं! ✍️");

  ctx.restore();
  filmAtmosphere(t);
}

// ── G. GRAND THEFT AUTO VI (GTA 6) DEDICATED SUITE (1080x1920 9:16) ───────────────

// ── G1. GTA 6 LOGO & $2 BILLION RECORD BUDGET ────────────────────────────────────
export function drawGta6LogoBudget(lt, d, t) {
  ctx.fillStyle = "#0A0112"; ctx.fillRect(0, 0, W, H);

  // Miami Vice City Sunset & Neon Gradient Sky
  const sky = ctx.createLinearGradient(0, 100, 0, 950);
  sky.addColorStop(0, "#190226");
  sky.addColorStop(0.5, "#4A044E");
  sky.addColorStop(0.8, "#BE185D");
  sky.addColorStop(1, "#0A0112");
  ctx.fillStyle = sky; ctx.fillRect(0, 100, W, 850);

  hudHeader("GRAND THEFT AUTO VI // RECORD BUDGET", "इतिहास का सबसे महंगा गेम: 16,000 करोड़!", "#FF007F");

  ctx.save();
  const cx = 540, cy = 600;

  // Palm Trees Silhouettes in background
  ctx.fillStyle = "#050008";
  for (let s of [-360, -220, 220, 360]) {
    ctx.beginPath();
    ctx.moveTo(cx + s - 10, 850); ctx.quadraticCurveTo(cx + s, cy + 50, cx + s + 20, cy - 80);
    ctx.lineTo(cx + s + 30, cy - 80); ctx.quadraticCurveTo(cx + s + 10, cy + 50, cx + s + 10, 850);
    ctx.fill();
    // Palm fronds
    for (let a = -1.2; a <= 1.2; a += 0.45) {
      ctx.beginPath();
      ctx.moveTo(cx + s + 25, cy - 80);
      ctx.quadraticCurveTo(cx + s + 25 + Math.cos(a) * 80, cy - 80 + Math.sin(a) * 60, cx + s + 25 + Math.cos(a) * 110, cy - 50 + Math.sin(a) * 80);
      ctx.lineWidth = 6; ctx.strokeStyle = "#050008"; ctx.stroke();
    }
  }

  // Giant Neon "VI" Roman Numeral
  const neonPulse = 1 + 0.05 * Math.sin(t * 8);
  ctx.save(); ctx.translate(cx, cy - 20); ctx.scale(neonPulse, neonPulse);

  // Pink/Cyan Neon Glow
  ctx.shadowColor = "#FF007F"; ctx.shadowBlur = 45;
  ctx.font = "900 240px Inter, Impact, sans-serif";
  ctx.fillStyle = "#FF007F"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("VI", 0, 0);

  // Inner White Core
  ctx.shadowBlur = 0;
  ctx.font = "900 240px Inter, Impact, sans-serif";
  ctx.fillStyle = "#FFF0F5";
  ctx.fillText("VI", 0, 0);

  // "GRAND THEFT AUTO" Subtitle Banner
  ctx.font = "900 38px Inter, sans-serif"; ctx.fillStyle = "#00F0FF";
  ctx.letterSpacing = "4px";
  ctx.fillText("GRAND THEFT AUTO", 0, 140);
  ctx.letterSpacing = "0px";
  ctx.restore();

  drawAutoTechCard("$2,000,000,000 PRODUCTION BUDGET", cx, 860, "#FFD700", 26);

  ctx.restore();
  filmAtmosphere(t, 600, "rgba(255, 0, 127, 0.35)");
}

// ── G2. VICE CITY HOLOGRAPHIC MAP (3X GTA 5) ──────────────────────────────────────
export function drawGta6ViceCityMap(lt, d, t) {
  ctx.fillStyle = "#020712"; ctx.fillRect(0, 0, W, H);
  hudHeader("STATE OF LEONIDA // VICE CITY MAP", "GTA 5 से तीन गुना बड़ा सीमलेस मैप!", "#00F0FF");

  ctx.save();
  const cx = 540, cy = 600;

  // Holographic Map Grid
  ctx.strokeStyle = "rgba(0, 240, 255, 0.25)"; ctx.lineWidth = 1.5;
  for (let x = 120; x <= W - 120; x += 65) {
    line([[x, 260], [x, 880]], "rgba(0, 240, 255, 0.2)", 1.5);
  }
  for (let y = 260; y <= 880; y += 65) {
    line([[120, y], [W - 120, y]], "rgba(0, 240, 255, 0.2)", 1.5);
  }

  // Island Landmasses (Vice Beach, Downtown, Port Gellhorn, Keys)
  ctx.fillStyle = "#0C2338"; ctx.strokeStyle = "#00F0FF"; ctx.lineWidth = 4;
  // Mainland Leonida
  ctx.beginPath();
  ctx.moveTo(cx - 280, 340);
  ctx.lineTo(cx - 60, 320); ctx.lineTo(cx - 20, 520); ctx.lineTo(cx - 140, 720);
  ctx.lineTo(cx - 320, 680); ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Vice Beach Island (Ocean side)
  ctx.beginPath();
  ctx.moveTo(cx + 60, 340); ctx.lineTo(cx + 240, 360); ctx.lineTo(cx + 260, 680);
  ctx.lineTo(cx + 90, 720); ctx.lineTo(cx + 50, 520); ctx.closePath();
  ctx.fill(); ctx.stroke();

  // Causeway Bridges
  line([[cx - 40, 420], [cx + 65, 420]], "#FF007F", 4);
  line([[cx - 30, 560], [cx + 70, 560]], "#FF007F", 4);

  // Radar Scan Sweep
  const sweep = t * 2;
  ctx.strokeStyle = "#FFE600"; ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(sweep) * 260, cy + Math.sin(sweep) * 260);
  ctx.stroke();

  drawAutoTechCard("MAP SCALE: 3X GTA V // NO LOADING SCREENS", cx, 860, "#00F0FF", 24);

  ctx.restore();
  filmAtmosphere(t, 600, "rgba(0, 240, 255, 0.2)");
}

// ── G3. LUCIA & JASON DUAL PROTAGONISTS MUGSHOT ───────────────────────────────────
export function drawGta6LuciaJasonMugshot(lt, d, t) {
  ctx.fillStyle = "#060309"; ctx.fillRect(0, 0, W, H);
  hudHeader("DUAL PROTAGONISTS // LUCIA & JASON", "पहली महिला लीड और बोनी-एंड-क्लाइड जोड़ी!", "#FF007F");

  ctx.save();
  const cx = 540, cy = 600;

  // Police Mugshot Measurement Grid (Behind characters)
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)"; ctx.lineWidth = 2;
  for (let y = 300; y <= 780; y += 40) {
    line([[140, y], [W - 140, y]], "rgba(255, 255, 255, 0.15)", 2);
    ctx.font = F(18, "800"); ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.fillText(`${Math.round((800 - y) / 10 + 120)} CM`, 170, y - 5);
  }

  // Left: Lucia (Female Lead in Prison Orange Jumpsuit)
  const lx = cx - 160;
  circle(lx, cy - 80, 52, "#F5D0C5"); // Head
  // Hair
  ctx.fillStyle = "#1E1010"; ctx.beginPath();
  ctx.arc(lx, cy - 90, 56, Math.PI * 0.8, TAU * 0.95); ctx.fill();
  // Orange Inmate Suit
  ctx.fillStyle = "#EA580C"; ctx.strokeStyle = "#C2410C"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(lx - 65, cy - 25, 130, 230, [18, 18, 0, 0]); ctx.fill(); ctx.stroke();
  ctx.font = F(28, "900"); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center";
  ctx.fillText("LUCIA", lx, cy + 80);

  // Right: Jason (Male Lead with Cap)
  const jx = cx + 160;
  circle(jx, cy - 80, 54, "#F8D7C4");
  // Cap
  ctx.fillStyle = "#1E293B";
  ctx.beginPath(); ctx.ellipse(jx, cy - 115, 60, 24, 0, 0, TAU); ctx.fill();
  ctx.fillRect(jx - 55, cy - 120, 110, 25);
  // Tank Top / Jacket
  ctx.fillStyle = "#334155"; ctx.strokeStyle = "#1E293B"; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.roundRect(jx - 70, cy - 25, 140, 230, [18, 18, 0, 0]); ctx.fill(); ctx.stroke();
  ctx.font = F(28, "900"); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center";
  ctx.fillText("JASON", jx, cy + 80);

  drawAutoTechCard("DYNAMIC DUAL CHARACTER SWITCHING", cx, 860, "#FF007F", 24);

  ctx.restore();
  filmAtmosphere(t);
}

// ── G4. WATER PHYSICS & RAYTRACED GRAPHICS ────────────────────────────────────────
export function drawGta6WaterPhysicsRaytracing(lt, d, t) {
  ctx.fillStyle = "#020B1A"; ctx.fillRect(0, 0, W, H);
  hudHeader("NEXT-GEN ENGINE // RAY-TRACED FLUIDS", "अल्ट्रा-रियलिस्टिक वॉटर और सनलाइट रिफ्लेक्शन!", "#00F0FF");

  ctx.save();
  const cx = 540, cy = 600;

  // Sunset Horizon
  const sunG = ctx.createRadialGradient(cx, 440, 30, cx, 440, 240);
  sunG.addColorStop(0, "rgba(255, 120, 0, 0.95)");
  sunG.addColorStop(0.5, "rgba(255, 0, 128, 0.6)");
  sunG.addColorStop(1, "rgba(0, 0, 0, 0)");
  ctx.fillStyle = sunG; ctx.fillRect(100, 280, W - 200, 320);

  // Ocean Water with Wave Curves
  for (let row = 0; row < 5; row++) {
    const wy = 520 + row * 65;
    const waveGrad = ctx.createLinearGradient(0, wy, 0, wy + 65);
    waveGrad.addColorStop(0, row % 2 === 0 ? "#0284C7" : "#0369A1");
    waveGrad.addColorStop(1, "#082F49");
    ctx.fillStyle = waveGrad;
    ctx.beginPath();
    ctx.moveTo(100, wy);
    for (let x = 100; x <= W - 100; x += 40) {
      const h = Math.sin(x * 0.02 + t * 4 + row) * 16;
      ctx.lineTo(x, wy + h);
    }
    ctx.lineTo(W - 100, wy + 80); ctx.lineTo(100, wy + 80); ctx.closePath();
    ctx.fill();
  }

  // Ray-Traced Sunlight Golden Shimmer on Water
  for (let k = 0; k < 18; k++) {
    const sx = cx - 80 + Math.sin(t * 5 + k) * 60;
    const sy = 540 + k * 16;
    line([[sx - 40, sy], [sx + 40, sy]], "rgba(255, 230, 0, 0.65)", 3);
  }

  drawAutoTechCard("REAL-TIME SUB-SURFACE SCATTERING", cx, 860, "#00F0FF", 24);

  ctx.restore();
  filmAtmosphere(t, 440, "rgba(255, 120, 0, 0.3)");
}

// ── G5. 10,000 NEXT-GEN SMART AI NPCS ─────────────────────────────────────────────
export function drawGta6SmartNpcAi(lt, d, t) {
  ctx.fillStyle = "#04050E"; ctx.fillRect(0, 0, W, H);
  hudHeader("COGNITIVE NPC AI // 10,000+ UNIQUE BRAINS", "हर नागरिक की अपनी सोच और याददाश्त!", "#10B981");

  ctx.save();
  const cx = 540, cy = 600;

  // City Sidewalk Pedestrians with AI Target Reticles
  const npcs = [
    { x: cx - 220, y: cy + 40, label: "RECORDING LIVE 📹", color: "#38BDF8" },
    { x: cx, y: cy - 40, label: "CALLING POLICE 📞", color: "#EF4444" },
    { x: cx + 220, y: cy + 20, label: "FLEEING IN PANIC 🏃", color: "#F59E0B" }
  ];

  npcs.forEach((npc, idx) => {
    // Pedestrian Silhouette
    circle(npc.x, npc.y - 70, 32, "#E2E8F0");
    ctx.fillStyle = "#475569";
    ctx.beginPath(); ctx.roundRect(npc.x - 26, npc.y - 35, 52, 120, 12); ctx.fill();

    // AI Cognitive Scan Circle
    const p = 1 + 0.12 * Math.sin(t * 6 + idx);
    ctx.strokeStyle = npc.color; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(npc.x, npc.y - 30, 85 * p, 0, TAU); ctx.stroke();

    // Behavioral Status Tag
    drawAutoTechCard(npc.label, npc.x, npc.y + 125, npc.color, 18);
  });

  drawAutoTechCard("DYNAMIC PERCEPTION & MEMORY ENGINE", cx, 860, "#10B981", 24);

  ctx.restore();
  filmAtmosphere(t);
}

// ── G6. 5-STAR POLICE WANTED SWAT & HELICOPTER ────────────────────────────────────
export function drawGta6PoliceWantedHelicopter(lt, d, t) {
  ctx.fillStyle = "#04020A"; ctx.fillRect(0, 0, W, H);
  hudHeader("WANTED LEVEL // 5-STAR TACTICAL RESPONSE", "SWAT टीम और सर्चलाइट हेलीकॉप्टर!", "#EF4444");

  ctx.save();
  const cx = 540, cy = 600;

  // 5 Gold Stars
  ctx.font = F(48, "900"); ctx.fillStyle = "#FFD700"; ctx.textAlign = "center";
  ctx.fillText("★ ★ ★ ★ ★", cx, 340);

  // Police Emergency Lights Flash (Red & Blue alternating)
  const redOn = Math.sin(t * 16) > 0;
  const flareG = ctx.createLinearGradient(0, cy - 100, W, cy - 100);
  flareG.addColorStop(0, redOn ? "rgba(239, 68, 68, 0.4)" : "rgba(37, 99, 235, 0.4)");
  flareG.addColorStop(1, redOn ? "rgba(37, 99, 235, 0.4)" : "rgba(239, 68, 68, 0.4)");
  ctx.fillStyle = flareG; ctx.fillRect(100, cy - 160, W - 200, 120);

  // Police Helicopter Searchlight Cone
  const cone = ctx.createLinearGradient(cx, 380, cx - 120, 780);
  cone.addColorStop(0, "rgba(255, 255, 255, 0.85)");
  cone.addColorStop(1, "rgba(255, 255, 255, 0.05)");
  ctx.fillStyle = cone;
  ctx.beginPath();
  ctx.moveTo(cx, 380); ctx.lineTo(cx - 240, 780); ctx.lineTo(cx + 80, 780); ctx.closePath();
  ctx.fill();

  // Hovering Helicopter Silhouette
  circle(cx, 380, 24, "#020617");
  // Rotor Blade
  const rotor = Math.sin(t * 30) * 120;
  line([[cx - rotor, 360], [cx + rotor, 360]], "#94A3B8", 4);

  drawAutoTechCard("K-9 UNITS & HIGH-SPEED TACTICAL PURSUIT", cx, 860, "#EF4444", 24);

  ctx.restore();
  filmAtmosphere(t);
}

// ── G7. IN-GAME VIRAL SOCIAL MEDIA FEED ───────────────────────────────────────────
export function drawGta6SocialMediaFeed(lt, d, t) {
  ctx.fillStyle = "#08010E"; ctx.fillRect(0, 0, W, H);
  hudHeader("VICE CITY NET // SOCIAL MEDIA SATIRE", "इन-गेम वायरल रील्स और लाइव स्ट्रीमिंग!", "#EC4899");

  ctx.save();
  const cx = 540, cy = 600;

  // Smartphone Mockup Frame
  ctx.fillStyle = "#18181B"; ctx.strokeStyle = "#EC4899"; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.roundRect(cx - 180, cy - 240, 360, 480, 32); ctx.fill(); ctx.stroke();

  // Screen Video Area
  ctx.fillStyle = "#27272A";
  ctx.beginPath(); ctx.roundRect(cx - 165, cy - 225, 330, 450, 24); ctx.fill();

  // Live Red Badge
  ctx.fillStyle = "#EF4444";
  ctx.beginPath(); ctx.roundRect(cx - 145, cy - 205, 75, 32, 8); ctx.fill();
  ctx.font = F(16, "900"); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center";
  ctx.fillText("LIVE", cx - 108, cy - 188);

  ctx.font = F(18, "800"); ctx.fillStyle = "#A1A1AA";
  ctx.fillText("👁️ 1.4M VIEWS", cx + 70, cy - 188);

  // Floating Reaction Hearts (Animated rising up right side)
  for (let k = 0; k < 6; k++) {
    const hy = cy + 160 - ((k * 45 + t * 90) % 300);
    const hx = cx + 110 + Math.sin(t * 4 + k) * 15;
    ctx.font = F(24, "900"); ctx.fillStyle = "#EC4899";
    ctx.fillText("❤️", hx, hy);
  }

  drawAutoTechCard("DYNAMIC VIRAL REPUTATION SYSTEM", cx, 860, "#EC4899", 24);

  ctx.restore();
  filmAtmosphere(t, 600, "rgba(236, 72, 153, 0.2)");
}

// ── G8. SUPERCARS & FLORIDA EVERGLADES ALLIGATOR ──────────────────────────────────
export function drawGta6SupercarAndAlligator(lt, d, t) {
  ctx.fillStyle = "#0A0502"; ctx.fillRect(0, 0, W, H);
  hudHeader("WILDLIFE & VELOCITY // LEONIDA SWAMPS", "सुपरकारों की रफ्तार और दलदल में मगरमच्छ!", "#F59E0B");

  ctx.save();
  const cx = 540, cy = 600;

  // Drifting Sports Car Silhouette
  ctx.fillStyle = "#F59E0B"; ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(cx - 240, cy - 40); ctx.lineTo(cx - 140, cy - 90); ctx.lineTo(cx + 80, cy - 90);
  ctx.lineTo(cx + 200, cy - 40); ctx.lineTo(cx + 220, cy + 20); ctx.lineTo(cx - 240, cy + 20);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // Wheels
  circle(cx - 140, cy + 20, 32, "#0F172A"); circle(cx + 120, cy + 20, 32, "#0F172A");

  // Everglades Swamp Water Layer
  ctx.fillStyle = "#14532D"; ctx.fillRect(100, cy + 70, W - 200, 110);

  // Alligator Head & Glowing Yellow Eyes in Water
  ctx.fillStyle = "#052E16";
  ctx.beginPath();
  ctx.moveTo(cx - 120, cy + 130); ctx.lineTo(cx + 40, cy + 120); ctx.lineTo(cx + 140, cy + 140);
  ctx.lineTo(cx - 60, cy + 155); ctx.closePath(); ctx.fill();
  circle(cx + 20, cy + 125, 8, "#FBBF24"); // Glowing Eye

  drawAutoTechCard("DYNAMIC DANGEROUS WILDLIFE ENCOUNTERS", cx, 860, "#F59E0B", 24);

  ctx.restore();
  filmAtmosphere(t);
}

// ── G9. 70% ACCESSIBLE INTERIORS & BANK HEISTS ────────────────────────────────────
export function drawGta6RobberyInteriorBank(lt, d, t) {
  ctx.fillStyle = "#07040B"; ctx.fillRect(0, 0, W, H);
  hudHeader("OPEN WORLD HEISTS // ACCESSIBLE BUILDINGS", "70% इमारतों के अंदर घुसकर लूट की आजादी!", "#A855F7");

  ctx.save();
  const cx = 540, cy = 600;

  // Bank Vault Massive Round Steel Door (Cracked Open)
  circle(cx, cy - 20, 220, "#1E293B");
  ctx.strokeStyle = "#A855F7"; ctx.lineWidth = 12;
  ctx.beginPath(); ctx.arc(cx, cy - 20, 220, 0, TAU); ctx.stroke();

  // Locking Vault Bolts
  for (let a = 0; a < TAU; a += TAU / 8) {
    const bx = cx + Math.cos(a) * 190, by = cy - 20 + Math.sin(a) * 190;
    circle(bx, by, 16, "#F1F5F9");
  }

  // Security Laser Tripwires
  ctx.strokeStyle = "#EF4444"; ctx.lineWidth = 3;
  line([[160, cy - 100], [cx + 120, cy + 80]], "#EF4444", 3);
  line([[cx - 120, cy + 80], [W - 160, cy - 100]], "#EF4444", 3);

  // Cash Stacks in Duffle Bag
  ctx.fillStyle = "#10B981";
  ctx.beginPath(); ctx.roundRect(cx - 80, cy + 70, 160, 65, 8); ctx.fill();
  ctx.font = F(28, "900"); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center";
  ctx.fillText("$$$ CASH", cx, cy + 112);

  drawAutoTechCard("UNPRECEDENTED INTERIOR FREEDOM", cx, 860, "#A855F7", 24);

  ctx.restore();
  filmAtmosphere(t, 580, "rgba(168, 85, 247, 0.25)");
}

// ── G10. GTA 6 OUTRO CTA (VICE CITY VIBES) ────────────────────────────────────────
export function drawGta6OutroCTA(lt, d, t) {
  ctx.fillStyle = "#0A0112"; ctx.fillRect(0, 0, W, H);
  hudHeader("ANCHOR AADHYA OFFICIAL // GTA 6", "कमेंट में बताएं और सब्सक्राइब करें!", "#FF007F");

  ctx.save();
  const ox = 540, oy = 640, s = 1.35;
  ctx.translate(ox, oy); ctx.scale(s, s);

  // Red YouTube Button
  ctx.fillStyle = "#FF0000"; ctx.beginPath(); ctx.roundRect(-160, -55, 320, 110, 26); ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath(); ctx.moveTo(-20, -32); ctx.lineTo(35, 0); ctx.lineTo(-20, 32); ctx.fill();

  ctx.font = "900 34px Inter, sans-serif"; ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center";
  ctx.fillText("SUBSCRIBE", 0, 105);

  // Bell
  const ring = Math.sin(t * 12) * 0.25;
  ctx.save(); ctx.translate(130, -55); ctx.rotate(ring);
  ctx.fillStyle = "#FFE600";
  ctx.beginPath(); ctx.arc(0, 0, 24, Math.PI, TAU); ctx.lineTo(26, 20); ctx.lineTo(-26, 20); ctx.fill();
  circle(0, 26, 8, "#FFE600");
  ctx.restore();

  // Dynamic Auto-fit Question Bubble: Text NEVER hangs outside!
  drawOutroQuestionBubble("क्या आप GTA 6 खेलेंगे? 🎮✍️");

  ctx.restore();
  filmAtmosphere(t, 640, "rgba(255, 0, 127, 0.25)");
}

// ── H. BERMUDA TRIANGLE FULL-CANVAS MOTION GRAPHICS SUITE (1080x1920 9:16) ────────

// ── H1. BERMUDA TRIANGLE HOLOGRAPHIC MAP ─────────────────────────────────────────
export function drawBermudaTriangleMap(lt, d, t) {
  drawFullCanvasBackground(t, 'bermuda');
  hudHeader("NORTH ATLANTIC ANOMALY // 700,000 SQ KM", "बरमूडा ट्रायंगल का वो सच जो छुपाया गया!", "#00F0FF");

  ctx.save();
  const cx = 540, cy = 680;
  const pop = spring(clamp(lt / 0.42));
  ctx.translate(cx, cy);
  ctx.scale(pop * 1.25, pop * 1.25);

  // Atlantic Ocean Depth Radar Rings
  ctx.strokeStyle = "rgba(0, 240, 255, 0.22)"; ctx.lineWidth = 2;
  for (let r = 80; r <= 360; r += 70) {
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke();
  }

  // The 3 Triangle Vertices: Miami (west), Bermuda (north), Puerto Rico (south)
  const pBermuda = [80, -260];
  const pMiami = [-330, -30];
  const pPuerto = [120, 250];

  // Pulsing Triangle Glowing Border Lines
  ctx.strokeStyle = "#FFE600"; ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(pMiami[0], pMiami[1]);
  ctx.lineTo(pBermuda[0], pBermuda[1]);
  ctx.lineTo(pPuerto[0], pPuerto[1]);
  ctx.closePath();
  ctx.stroke();

  // Translucent glowing yellow fill inside the Bermuda Triangle
  ctx.fillStyle = "rgba(255, 230, 0, 0.16)";
  ctx.fill();

  // Dynamic Animated Ocean Current Flow Vectors inside triangle
  for (let f = 0; f < 8; f++) {
    const fx = -120 + ((f * 65 + t * 90) % 240);
    const fy = -100 + ((f * 55 + t * 50) % 200);
    line([[fx, fy], [fx + 40, fy + 20]], "rgba(0, 240, 255, 0.5)", 3);
  }

  // Vertex Markers with Ping Radars
  const ping = 1 + 0.22 * Math.sin(t * 8);
  for (const pt of [pMiami, pBermuda, pPuerto]) {
    circle(pt[0], pt[1], 16, "#FF1744");
    ctx.strokeStyle = "#FF1744"; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(pt[0], pt[1], 28 * ping, 0, TAU); ctx.stroke();
  }

  // Vertex Labels
  ctx.font = F(26, "900"); ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center";
  ctx.fillText("BERMUDA", pBermuda[0], pBermuda[1] - 40);
  ctx.fillText("MIAMI", pMiami[0] - 80, pMiami[1]);
  ctx.fillText("PUERTO RICO", pPuerto[0], pPuerto[1] + 50);

  ctx.restore();

  drawAutoTechCard("BERMUDA TRIANGLE // HIGH-RISK TRANSIT // 25°N 71°W", cx, 1180, "#FFE600", 26);
  filmAtmosphere(t, 680, "rgba(0, 240, 255, 0.25)");
}

// ── H2. BERMUDA 700,000 SQ KM DANGER PERIMETER RADAR ─────────────────────────────
export function drawBermudaPerimeterRadar(lt, d, t) {
  drawFullCanvasBackground(t, 'bermuda');
  hudHeader("700,000 SQ KM DANGER ZONE", "दुनिया का सबसे खतरनाक समुद्री चक्रव्यूह!", "#FF0055");

  ctx.save();
  const cx = 540, cy = 680;
  const pop = spring(clamp(lt / 0.42));
  ctx.translate(cx, cy);
  ctx.scale(pop * 1.25, pop * 1.25);

  // Concentric Radar Distance Rings
  for (let r = 80; r <= 360; r += 60) {
    ctx.strokeStyle = "rgba(255, 0, 85, 0.25)"; ctx.lineWidth = 2.2;
    ctx.beginPath(); ctx.arc(0, 0, r, 0, TAU); ctx.stroke();
  }
  // Crosshairs
  line([[-360, 0], [360, 0]], "rgba(255, 0, 85, 0.3)", 2);
  line([[0, -360], [0, 360]], "rgba(255, 0, 85, 0.3)", 2);

  // Rotating 360° Military Radar Sweep Beam
  const sweepAngle = (t * 5.0) % TAU;
  const sweepGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 360);
  sweepGrad.addColorStop(0, "rgba(255, 0, 85, 0.45)");
  sweepGrad.addColorStop(1, "rgba(255, 0, 85, 0.0)");
  ctx.fillStyle = sweepGrad;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, 360, sweepAngle - 0.55, sweepAngle);
  ctx.closePath();
  ctx.fill();
  line([[0, 0], [Math.cos(sweepAngle) * 360, Math.sin(sweepAngle) * 360]], "#FF0055", 4);

  // Vanishing Radar Blips of Lost Vessels
  const blipPositions = [[-140, -100], [160, -150], [-70, 180], [130, 110], [-200, 50], [80, -220]];
  blipPositions.forEach((pt, bi) => {
    const blipPhase = Math.sin(t * 5.5 + bi * 1.6);
    if (blipPhase > 0.15) {
      circle(pt[0], pt[1], 10, "#FF0055");
      ctx.strokeStyle = "#FFE600"; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(pt[0], pt[1], 24 * (1 - blipPhase * 0.4), 0, TAU); ctx.stroke();
    }
  });

  // Dynamic Animated Area Counter
  const countP = clamp(lt / Math.max(0.1, d * 0.8));
  const areaVal = countUp(100000, 700000, countP);
  ctx.font = F(48, "900"); ctx.fillStyle = "#FFE600"; ctx.textAlign = "center";
  ctx.fillText(`${areaVal} KM²`, 0, -25);
  ctx.font = F(22, "800"); ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.fillText("ACTIVE PERIMETER AREA", 0, 30);

  ctx.restore();

  drawAutoTechCard("ACOUSTIC SONAR // 50+ VESSELS & AIRCRAFT LOST", cx, 1180, "#FF0055", 26);
  filmAtmosphere(t, 680, "rgba(255, 0, 85, 0.25)");
}

// ── H3. METHANE HYDRATE GAS ERUPTION ──────────────────────────────────────────────
export function drawMethaneBubblesEruption(lt, d, t) {
  drawFullCanvasBackground(t, 'bermuda');
  hudHeader("OCEAN FLOOR GEOPHYSICS // METHANE ERUPTION", "समुद्र के पेट से मीथेन गैस का भयानक विस्फोट!", "#22C55E");

  ctx.save();
  const cx = 540, cy = 680;
  const pop = spring(clamp(lt / 0.42));
  ctx.translate(cx, cy);
  ctx.scale(pop * 1.25, pop * 1.25);

  // Sea Floor Bedrock with Fractured Volcanic Vents
  ctx.fillStyle = "#0F172A";
  ctx.beginPath();
  ctx.moveTo(-380, 260); ctx.lineTo(380, 260); ctx.lineTo(380, 420); ctx.lineTo(-380, 420); ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#22C55E"; ctx.lineWidth = 4;
  line([[-380, 260], [380, 260]], "#22C55E", 4);

  // Erupting Hydrothermal Gas Chimneys
  for (let vent of [-200, 0, 200]) {
    ctx.fillStyle = "#1E293B";
    ctx.beginPath();
    ctx.moveTo(vent - 35, 260); ctx.lineTo(vent + 35, 260); ctx.lineTo(vent + 20, 180); ctx.lineTo(vent - 20, 180);
    ctx.closePath(); ctx.fill();
  }

  // Giant Expanding Glowing Methane Gas Bubbles Rising
  for (let k = 0; k < 24; k++) {
    const bx = -260 + ((k * 57 + t * 65) % 520);
    const by = 260 - ((k * 73 + t * 240) % 620);
    const br = 20 + (k % 4) * 14 + Math.sin(t * 7 + k) * 6;

    const bGrad = ctx.createRadialGradient(bx - br * 0.3, by - br * 0.3, 4, bx, by, br);
    bGrad.addColorStop(0, "rgba(74, 222, 128, 0.95)");
    bGrad.addColorStop(0.6, "rgba(34, 197, 94, 0.65)");
    bGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
    circle(bx, by, br, bGrad);
    ctx.strokeStyle = "#86EFAC"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(bx, by, br, 0, TAU); ctx.stroke();
  }

  ctx.restore();

  drawAutoTechCard("WATER DENSITY COLLAPSE: 1.0 -> 0.3 g/cm³", cx, 1180, "#22C55E", 26);
  filmAtmosphere(t, 680, "rgba(34, 197, 94, 0.25)");
}

// ── H4. SHIP SINKING IN ABYSS (LOSS OF BUOYANCY) ──────────────────────────────────
export function drawShipSinkingAbyss(lt, d, t) {
  drawFullCanvasBackground(t, 'bermuda');
  hudHeader("NAUTICAL CATASTROPHE // ZERO BUOYANCY", "पानी की डेंसिटी खत्म: सेकंडों में जहाज डूबा!", "#EF4444");

  ctx.save();
  const cx = 540, cy = 680;
  const pop = spring(clamp(lt / 0.42));
  ctx.translate(cx, cy);
  ctx.scale(pop * 1.25, pop * 1.25);

  // Giant Oceanic Vortex / Sinking Funnel
  ctx.fillStyle = "rgba(3, 105, 161, 0.35)";
  ctx.beginPath();
  ctx.ellipse(0, 100, 360, 180, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = "rgba(56, 189, 248, 0.5)"; ctx.lineWidth = 4; ctx.stroke();

  // Sinking Cargo Ship Hull Plunging Bow-First into Abyss
  ctx.save();
  ctx.translate(0, 40);
  ctx.rotate(0.42 + Math.sin(t * 3) * 0.08);

  ctx.fillStyle = "#1E293B"; ctx.strokeStyle = "#E2E8F0"; ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-220, -35); ctx.lineTo(150, -35); ctx.lineTo(220, 50); ctx.lineTo(-170, 50);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // Bridge Cabin & Smokestack
  ctx.fillStyle = "#DC2626"; ctx.fillRect(-75, -100, 110, 65);
  ctx.fillStyle = "#0F172A"; ctx.fillRect(-25, -140, 30, 40);
  ctx.restore();

  // Violent Hydrodynamic Suction Downward Vectors
  for (let s of [-200, -70, 70, 200]) {
    const arrY = 140 + Math.sin(t * 8 + s) * 20;
    line([[s, arrY], [s, arrY + 90]], "#EF4444", 6);
    ctx.fillStyle = "#EF4444";
    ctx.beginPath(); ctx.moveTo(s, arrY + 110); ctx.lineTo(s - 14, arrY + 85); ctx.lineTo(s + 14, arrY + 85); ctx.fill();
  }

  ctx.restore();

  drawAutoTechCard("HYDRODYNAMIC SUCTION: INSTANT ABYSSAL PLUNGE", cx, 1180, "#EF4444", 26);
  filmAtmosphere(t, 680, "rgba(239, 68, 68, 0.25)");
}

// ── H5. HEXAGONAL CLOUDS & 270 KM/H AIR BOMBS ────────────────────────────────────
export function drawHexagonalCloudAirBombs(lt, d, t) {
  drawFullCanvasBackground(t, 'bermuda');
  hudHeader("METEOROLOGY // HEXAGONAL MICROBURSTS", "270 KM/H के तूफानी एयर-बॉम्ब्स!", "#38BDF8");

  ctx.save();
  const cx = 540, cy = 680;
  const pop = spring(clamp(lt / 0.42));
  ctx.translate(cx, cy);
  ctx.scale(pop * 1.25, pop * 1.25);

  // Giant Geometric Hexagonal Storm Cloud Formation
  ctx.strokeStyle = "#38BDF8"; ctx.lineWidth = 8;
  ctx.fillStyle = "rgba(14, 165, 233, 0.35)";
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i * TAU) / 6 - Math.PI / 6;
    const hx = Math.cos(a) * 260, hy = -80 + Math.sin(a) * 260;
    if (i === 0) ctx.moveTo(hx, hy); else ctx.lineTo(hx, hy);
  }
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // Vertical Air-Bomb Shockwave Jetstreams Dropping Downward
  for (let i = -2; i <= 2; i++) {
    const ax = i * 90;
    const dy = 20 + ((t * 260 + (i + 2) * 70) % 280);
    line([[ax, -40], [ax, dy]], "#FACC15", 7);
    ctx.fillStyle = "#FACC15";
    ctx.beginPath(); ctx.moveTo(ax, dy); ctx.lineTo(ax - 18, dy - 26); ctx.lineTo(ax + 18, dy - 26); ctx.fill();
  }

  // Live Wind Velocity Gauge
  const speedVal = countUp(80, 270, clamp(lt / Math.max(0.1, d * 0.75)));
  ctx.font = F(42, "900"); ctx.fillStyle = "#38BDF8"; ctx.textAlign = "center";
  ctx.fillText(`${speedVal} KM/H`, 0, -80);
  ctx.font = F(18, "800"); ctx.fillStyle = "#FFFFFF";
  ctx.fillText("MICROBURST DOWNDRAFT", 0, -40);

  ctx.restore();

  drawAutoTechCard("270 KM/H DOWNDRAFT VELOCITY // AIR-BOMB", cx, 1180, "#38BDF8", 26);
  filmAtmosphere(t, 680, "rgba(56, 189, 248, 0.25)");
}

// ── H6. AIRPLANE SEVERE STORM DISASTER ───────────────────────────────────────────
export function drawAirplaneStormDisaster(lt, d, t) {
  drawFullCanvasBackground(t, 'bermuda');
  hudHeader("AERODYNAMICS // AIR-BOMB DOWNBURST", "उड़ते विमान सीधे समुद्र में क्रैश!", "#EF4444");

  ctx.save();
  const cx = 540, cy = 680;
  const pop = spring(clamp(lt / 0.42));
  ctx.translate(cx, cy);
  ctx.scale(pop * 1.25, pop * 1.25);

  // Lightning Flashes
  if (Math.sin(t * 14) > 0.85) {
    ctx.fillStyle = "rgba(255, 255, 255, 0.28)"; ctx.fillRect(-380, -320, 760, 640);
  }

  // Commercial Flight 19 Airplane Silhouette Pitching Down
  ctx.save();
  ctx.rotate(0.55 + Math.sin(t * 4) * 0.08);

  ctx.fillStyle = "#E2E8F0"; ctx.strokeStyle = "#64748B"; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.ellipse(0, 0, 190, 34, 0, 0, TAU); ctx.fill(); ctx.stroke();
  // Wings
  line([[0, -170], [25, 170]], "#CBD5E1", 24);
  // Tail fin
  line([[-160, 0], [-200, -80]], "#CBD5E1", 18);
  ctx.restore();

  // Violent Wind Turbulence Vectors
  for (let k = 0; k < 12; k++) {
    const wx = -280 + ((k * 63 + t * 280) % 560);
    const wy = -180 + ((k * 47) % 360);
    line([[wx, wy], [wx + 70, wy + 30]], "rgba(255, 255, 255, 0.65)", 3.5);
  }

  ctx.restore();

  drawAutoTechCard("CRITICAL AERODYNAMIC LOSS OF LIFT // DIVE", cx, 1180, "#EF4444", 26);
  filmAtmosphere(t, 680, "rgba(239, 68, 68, 0.25)");
}

// ── H7. MAGNETIC COMPASS ANOMALY (SPINNING NEEDLE) ───────────────────────────────
export function drawMagneticCompassChaos(lt, d, t) {
  drawFullCanvasBackground(t, 'bermuda');
  hudHeader("GEOMAGNETIC DISTORTION // COMPASS ERROR", "कंपास की सुई पूरी तरह पागल हो जाती है!", "#F59E0B");

  ctx.save();
  const cx = 540, cy = 680;
  const pop = spring(clamp(lt / 0.42));
  ctx.translate(cx, cy);
  ctx.scale(pop * 1.25, pop * 1.25);

  // Giant Brass Compass Housing
  circle(0, 0, 260, "#291804");
  ctx.strokeStyle = "#F59E0B"; ctx.lineWidth = 16;
  ctx.beginPath(); ctx.arc(0, 0, 260, 0, TAU); ctx.stroke();

  // Inner Degree Marks
  ctx.strokeStyle = "rgba(255, 255, 255, 0.4)"; ctx.lineWidth = 3.5;
  for (let a = 0; a < TAU; a += TAU / 12) {
    line([[Math.cos(a) * 210, Math.sin(a) * 210], [Math.cos(a) * 240, Math.sin(a) * 240]], "#FFFFFF", 3.5);
  }

  // Compass Cardinal Labels (N, E, S, W)
  ctx.font = F(36, "900"); ctx.fillStyle = "#FF1744"; ctx.textAlign = "center";
  ctx.fillText("N", 0, -170);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillText("S", 0, 190);
  ctx.fillText("E", 190, 12);
  ctx.fillText("W", -190, 12);

  // Erratically Spinning Needle
  const spin = t * 14 + Math.sin(t * 8) * 4;
  ctx.save(); ctx.rotate(spin);
  // Red North Needle
  ctx.fillStyle = "#EF4444";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-22, 0); ctx.lineTo(0, -180); ctx.lineTo(22, 0); ctx.closePath(); ctx.fill();
  // Silver South Needle
  ctx.fillStyle = "#94A3B8";
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-22, 0); ctx.lineTo(0, 180); ctx.lineTo(22, 0); ctx.closePath(); ctx.fill();
  circle(0, 0, 18, "#F59E0B");
  ctx.restore();

  ctx.restore();

  drawAutoTechCard("TRUE NORTH VS MAGNETIC NORTH SYSTEMIC FAILURE", cx, 1180, "#F59E0B", 26);
  filmAtmosphere(t, 680, "rgba(245, 158, 11, 0.25)");
}

// ── H8. BERMUDA OUTRO CTA ─────────────────────────────────────────────────────────
export function drawBermudaOutroCTA(lt, d, t) {
  drawFullCanvasBackground(t, 'bermuda');
  hudHeader("ANCHOR AADHYA OFFICIAL // BERMUDA", "कमेंट में बताएं और सब्सक्राइब करें!", "#00F0FF");

  ctx.save();
  const ox = 540, oy = 700, s = 1.45;
  ctx.translate(ox, oy); ctx.scale(s, s);

  // Red YouTube Button
  ctx.fillStyle = "#FF0000"; ctx.beginPath(); ctx.roundRect(-160, -55, 320, 110, 26); ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath(); ctx.moveTo(-20, -32); ctx.lineTo(35, 0); ctx.lineTo(-20, 32); ctx.fill();

  ctx.font = "900 34px Inter, sans-serif"; ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center";
  ctx.fillText("SUBSCRIBE", 0, 105);

  // Bell
  const ring = Math.sin(t * 12) * 0.25;
  ctx.save(); ctx.translate(130, -55); ctx.rotate(ring);
  ctx.fillStyle = "#FFE600";
  ctx.beginPath(); ctx.arc(0, 0, 24, Math.PI, TAU); ctx.lineTo(26, 20); ctx.lineTo(-26, 20); ctx.fill();
  circle(0, 26, 8, "#FFE600");
  ctx.restore();

  // Dynamic Auto-fit Question Bubble: Text NEVER hangs outside!
  drawOutroQuestionBubble("क्या आप बरमूडा ट्रायंगल जाएंगे? 🚢✍️");

  ctx.restore();

  drawAutoTechCard("SUBSCRIBE FOR DAILY VIRAL SCIENCE FACTS", 540, 1180, "#00F0FF", 26);
  filmAtmosphere(t, 700, "rgba(0, 240, 255, 0.25)");
}

// ── I. KOLA SUPERDEEP BOREHOLE FULL-CANVAS MOTION GRAPHICS SUITE (1080x1920 9:16) ─

// ── I1. KOLA BOREHOLE DRILL DEPTH GAUGE (12,262 METERS) ───────────────────────────
export function drawKolaBoreholeDrillDepth(lt, d, t) {
  drawFullCanvasBackground(t, 'kola');
  hudHeader("DEEPEST MAN-MADE HOLE // 12,262M", "पृथ्वी के पेट में 12,262 मीटर गहरा गड्ढा!", "#F59E0B");

  ctx.save();
  const cx = 540, cy = 680;
  const pop = spring(clamp(lt / 0.42));
  ctx.translate(cx, cy);
  ctx.scale(pop * 1.25, pop * 1.25);

  // Background Depth Ruler & Ticks
  ctx.strokeStyle = "rgba(245, 158, 11, 0.3)"; ctx.lineWidth = 2.5;
  line([[-280, -280], [-280, 260]], "rgba(245, 158, 11, 0.45)", 2.5);
  for (let dy = -280; dy <= 260; dy += 45) {
    const tickLen = dy % 90 === 0 ? 36 : 20;
    line([[-280, dy], [-280 + tickLen, dy]], "rgba(245, 158, 11, 0.7)", 2.5);
  }

  // Heavy Industrial Drill Derrick Tower
  ctx.fillStyle = "#1E293B";
  ctx.beginPath();
  ctx.moveTo(-80, -280); ctx.lineTo(80, -280); ctx.lineTo(140, -140); ctx.lineTo(-140, -140);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#F59E0B"; ctx.lineWidth = 4.5; ctx.stroke();

  // Spinning Drill Pipe Shaft plunging downward
  const spinOffset = (t * 90) % 35;
  ctx.fillStyle = "#94A3B8";
  ctx.fillRect(-20, -140, 40, 400);
  ctx.strokeStyle = "#475569"; ctx.lineWidth = 3.5;
  for (let sy = -130 + spinOffset; sy < 250; sy += 35) {
    line([[-20, sy], [20, sy + 18]], "#F59E0B", 3.5);
  }

  // Spinning Drill Teeth Head
  ctx.fillStyle = "#EF4444";
  ctx.beginPath();
  ctx.moveTo(-38, 250); ctx.lineTo(38, 250); ctx.lineTo(0, 310);
  ctx.closePath(); ctx.fill();

  // Dynamic Animated Depth Counter
  const countP = clamp(lt / Math.max(0.1, d * 0.85));
  const depthVal = countUp(0, 12262, countP);
  ctx.font = F(52, "900"); ctx.fillStyle = "#F59E0B"; ctx.textAlign = "center";
  ctx.fillText(`${depthVal} M`, 150, 20);
  ctx.font = F(22, "800"); ctx.fillStyle = "#FFFFFF";
  ctx.fillText("DRILL DEPTH (SG-3)", 150, 70);

  ctx.restore();

  drawAutoTechCard("KOLA BOREHOLE SG-3 // ARCTIC RUSSIA (1970-1994)", cx, 1180, "#F59E0B", 26);
  filmAtmosphere(t, 680, "rgba(245, 158, 11, 0.25)");
}

// ── I2. EARTH CRUST PENETRATION CROSS-SECTION ──────────────────────────────────────
export function drawKolaCrustCrossSection(lt, d, t) {
  drawFullCanvasBackground(t, 'kola');
  hudHeader("EARTH CRUST PENETRATION // 20 YEARS", "20 साल तक लगातार धरती की परत को चीरा!", "#38BDF8");

  ctx.save();
  const cx = 540, cy = 680;
  const pop = spring(clamp(lt / 0.42));
  ctx.translate(cx, cy);
  ctx.scale(pop * 1.25, pop * 1.25);

  // Geological Strata Bands
  const layers = [
    { y: -260, h: 120, fill: "#334155", label: "SEDIMENTARY CRUST // 0-4 KM" },
    { y: -140, h: 160, fill: "#1E293B", label: "GRANITIC BASEMENT // 4-9 KM" },
    { y: 20,   h: 180, fill: "#0F172A", label: "FRACTURED BASALT // 9-12 KM" },
    { y: 200,  h: 90,  fill: "#7F1D1D", label: "MANTLE TRANSITION (MOHO)" },
  ];
  layers.forEach((l) => {
    ctx.fillStyle = l.fill;
    ctx.fillRect(-340, l.y, 680, l.h);
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)"; ctx.lineWidth = 2.5;
    ctx.strokeRect(-340, l.y, 680, l.h);

    ctx.font = F(18, "800"); ctx.fillStyle = "rgba(255, 255, 255, 0.75)"; ctx.textAlign = "left";
    ctx.fillText(l.label, -320, l.y + 30);
  });

  // Glowing Drill Shaft Penetrating Downward
  const shaftProg = clamp(lt / Math.max(0.1, d * 0.75));
  const shaftEnd = lerp(-260, 180, shaftProg);
  line([[0, -260], [0, shaftEnd]], "#38BDF8", 7);
  circle(0, shaftEnd, 12, "#FFE600");

  // Year Timeline Counter: 1970 to 1990
  const yearVal = countUp(1970, 1990, shaftProg);
  ctx.font = F(40, "900"); ctx.fillStyle = "#38BDF8"; ctx.textAlign = "right";
  ctx.fillText(`YEAR: ${yearVal}`, 320, -200);

  ctx.restore();

  drawAutoTechCard("CONTINENTAL CRUST PIERCED: BALTIC SHIELD", cx, 1180, "#38BDF8", 26);
  filmAtmosphere(t, 680, "rgba(56, 189, 248, 0.25)");
}

// ── I3. THERMAL INFERNO 180°C (GEOTHERMAL GRADIENT) ───────────────────────────────
export function drawKolaThermalInferno180C(lt, d, t) {
  drawFullCanvasBackground(t, 'kola');
  hudHeader("GEOTHERMAL GRADIENT // 180°C INFERNO", "12 KM नीचे 180°C का खौलता तापमान!", "#EF4444");

  ctx.save();
  const cx = 540, cy = 680;
  const pop = spring(clamp(lt / 0.42));
  ctx.translate(cx, cy);
  ctx.scale(pop * 1.25, pop * 1.25);

  // Massive Cylindrical Thermometer Housing
  ctx.fillStyle = "#1E293B"; ctx.strokeStyle = "#EF4444"; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.roundRect(-80, -260, 160, 520, 45); ctx.fill(); ctx.stroke();

  // Glass Tube Inside
  ctx.fillStyle = "#0F172A";
  ctx.beginPath(); ctx.roundRect(-30, -230, 60, 420, 24); ctx.fill();

  // Rising Glowing Molten Red Mercury
  const heatProg = clamp(lt / Math.max(0.1, d * 0.8));
  const mercuryH = lerp(50, 400, heatProg);
  const mercGrad = ctx.createLinearGradient(0, 190, 0, 190 - mercuryH);
  mercGrad.addColorStop(0, "#EF4444");
  mercGrad.addColorStop(1, "#FBBF24");
  ctx.fillStyle = mercGrad;
  ctx.beginPath(); ctx.roundRect(-25, 190 - mercuryH, 50, mercuryH, 16); ctx.fill();

  // Mercury Bulb at Bottom
  circle(0, 200, 52, "#EF4444");

  // Dynamic Animated Temperature Counter
  const tempVal = countUp(20, 180, heatProg);
  ctx.font = F(64, "900"); ctx.fillStyle = "#F59E0B"; ctx.textAlign = "center";
  ctx.fillText(`${tempVal}°C`, 210, -20);
  ctx.font = F(24, "800"); ctx.fillStyle = "#FFFFFF";
  ctx.fillText("CORE HEAT", 210, 35);

  // Heat Waves radiating outward
  for (let k = 0; k < 6; k++) {
    const wy = -220 + k * 70;
    const waveOff = Math.sin(t * 8 + k) * 18;
    ctx.strokeStyle = "rgba(239, 68, 68, 0.45)"; ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-180 + waveOff, wy);
    ctx.quadraticCurveTo(-120, wy - 18, -90 + waveOff, wy);
    ctx.stroke();
  }

  ctx.restore();

  drawAutoTechCard("PREDICTED: 100°C // ACTUAL: 180°C HEAT SHOCK", cx, 1180, "#EF4444", 26);
  filmAtmosphere(t, 680, "rgba(239, 68, 68, 0.28)");
}

// ── I4. METALLURGICAL MELTING DRILL BIT ───────────────────────────────────────────
export function drawKolaMeltingSteelDrill(lt, d, t) {
  drawFullCanvasBackground(t, 'kola');
  hudHeader("METALLURGICAL FAILURE // MELTING BITS", "स्टील के ड्रिल मोम की तरह पिघलने लगे!", "#F97316");

  ctx.save();
  const cx = 540, cy = 680;
  const pop = spring(clamp(lt / 0.42));
  ctx.translate(cx, cy);
  ctx.scale(pop * 1.25, pop * 1.25);

  // Tungsten Steel Drill Head
  ctx.save();
  ctx.translate(0, -40);

  // Drill Cone Body
  ctx.fillStyle = "#334155"; ctx.strokeStyle = "#94A3B8"; ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-120, -200); ctx.lineTo(120, -200); ctx.lineTo(75, 50); ctx.lineTo(-75, 50);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // Glowing Molten Orange Teeth (Softening Point Exceeded)
  const glow = 0.8 + 0.2 * Math.sin(t * 10);
  ctx.fillStyle = `rgba(249, 115, 22, ${glow})`;
  ctx.beginPath();
  ctx.moveTo(-85, 50); ctx.lineTo(-50, 190); ctx.lineTo(0, 90); ctx.lineTo(50, 190); ctx.lineTo(85, 50);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle = "#FEF08A"; ctx.lineWidth = 3.5; ctx.stroke();

  // Dripping Molten Droplets
  for (let i = -1; i <= 1; i++) {
    const dropY = 190 + ((t * 180 + (i + 1) * 90) % 160);
    circle(i * 42, dropY, 9, "#F97316");
  }

  ctx.restore();

  // Extreme Friction Sparks
  for (let s = 0; s < 16; s++) {
    const sa = (s * 31 + t * 45) % TAU;
    const sr = 140 + ((s * 47 + t * 200) % 160);
    const sx = Math.cos(sa) * sr, sy = 120 + Math.sin(sa) * 45;
    circle(sx, sy, 4.5, "#FEF08A");
  }

  ctx.restore();

  drawAutoTechCard("TUNGSTEN CARBIDE FAILURE: PLASTIC DEFORMATION", cx, 1180, "#F97316", 26);
  filmAtmosphere(t, 680, "rgba(249, 115, 22, 0.28)");
}

// ── I5. HYDROTHERMAL TRAPPED BOILING WATER ─────────────────────────────────────────
export function drawKolaBoilingWaterTrapped(lt, d, t) {
  drawFullCanvasBackground(t, 'kola');
  hudHeader("HYDROTHERMAL ANOMALY // TRAPPED WATER", "चट्टानों में कैद मिला खौलता हुआ पानी!", "#06B6D4");

  ctx.save();
  const cx = 540, cy = 680;
  const pop = spring(clamp(lt / 0.42));
  ctx.translate(cx, cy);
  ctx.scale(pop * 1.25, pop * 1.25);

  // Dense Porous Rock Matrix
  ctx.fillStyle = "#0F172A"; ctx.strokeStyle = "#334155"; ctx.lineWidth = 5;
  ctx.beginPath(); ctx.roundRect(-340, -250, 680, 500, 28); ctx.fill(); ctx.stroke();

  // Jagged Micro-Fractures in Rock with Glowing Boiling Water
  ctx.strokeStyle = "#06B6D4"; ctx.lineWidth = 9;
  const fracturePaths = [
    [[-240, -160], [-120, -90], [-50, -150], [90, -100], [220, -170]],
    [[-220, 50], [-100, 0], [50, 70], [140, 15], [260, 60]],
    [[-170, 160], [-40, 130], [70, 180], [220, 140]],
  ];
  fracturePaths.forEach((pts) => {
    ctx.beginPath();
    pts.forEach(([px, py], pi) => {
      if (pi === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    });
    ctx.stroke();
  });

  // Boiling Steam & Gas Micro-Bubbles escaping from fractures
  for (let k = 0; k < 26; k++) {
    const bx = -260 + ((k * 43 + t * 55) % 520);
    const by = 210 - ((k * 39 + t * 160) % 420);
    const br = 7 + (k % 4) * 5;
    circle(bx, by, br, "rgba(6, 182, 212, 0.7)");
    ctx.strokeStyle = "#A5F3FC"; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(bx, by, br, 0, TAU); ctx.stroke();
  }

  ctx.restore();

  drawAutoTechCard("HYDROGEN & OXYGEN TRAPPED AT 3,000 ATM PRESSURE", cx, 1180, "#06B6D4", 26);
  filmAtmosphere(t, 680, "rgba(6, 182, 212, 0.25)");
}

// ── I6. 2 BILLION YEAR OLD MICROFOSSILS IN ABYSS ──────────────────────────────────
export function drawKolaAncientMicrofossils(lt, d, t) {
  drawFullCanvasBackground(t, 'kola');
  hudHeader("DEEP BIOSPHERE // 2 BILLION YEARS OLD", "पाताल में मिले 2 अरब साल पुराने जीवाश्म!", "#A855F7");

  ctx.save();
  const cx = 540, cy = 680;
  const pop = spring(clamp(lt / 0.42));
  ctx.translate(cx, cy);
  ctx.scale(pop * 1.25, pop * 1.25);

  // Microscope HUD Reticle Circle
  circle(0, 0, 260, "#1E112A");
  ctx.strokeStyle = "#A855F7"; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.arc(0, 0, 260, 0, TAU); ctx.stroke();

  // Circular Measurement Grids
  ctx.strokeStyle = "rgba(168, 85, 247, 0.3)"; ctx.lineWidth = 2.5;
  circle(0, 0, 170, "rgba(0,0,0,0)"); ctx.stroke();
  circle(0, 0, 85, "rgba(0,0,0,0)"); ctx.stroke();
  line([[-260, 0], [260, 0]], "rgba(168, 85, 247, 0.35)", 2.5);
  line([[0, -260], [0, 260]], "rgba(168, 85, 247, 0.35)", 2.5);

  // Microscopic Planktonic Fossil Cells (Acritarchs) with organic pulse
  const pulse = 1 + 0.10 * Math.sin(t * 6);
  const fossilCenters = [
    [-50, -40, 60],
    [95, 60, 44],
    [-110, 95, 35],
    [75, -110, 38],
  ];
  fossilCenters.forEach(([fx, fy, fr]) => {
    ctx.save();
    ctx.translate(fx, fy); ctx.scale(pulse, pulse);
    circle(0, 0, fr, "rgba(168, 85, 247, 0.45)");
    ctx.strokeStyle = "#E879F9"; ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.arc(0, 0, fr, 0, TAU); ctx.stroke();

    for (let sp = 0; sp < 8; sp++) {
      const sa = (sp * TAU) / 8;
      line([[Math.cos(sa) * fr, Math.sin(sa) * fr], [Math.cos(sa) * (fr + 18), Math.sin(sa) * (fr + 18)]], "#E879F9", 3.5);
    }
    ctx.restore();
  });

  ctx.restore();

  drawAutoTechCard("24 EXTINCT SPECIES OF PLANKTONIC MICROFOSSILS", cx, 1180, "#A855F7", 26);
  filmAtmosphere(t, 680, "rgba(168, 85, 247, 0.25)");
}

// ── I7. SEALED STEEL DOOR CAP (12 HEAVY BOLTS) ────────────────────────────────────
export function drawKolaSealedSteelDoorCap(lt, d, t) {
  drawFullCanvasBackground(t, 'kola');
  hudHeader("ABANDONED BOREHOLE // 12 STEEL BOLTS", "पाताल का दरवाजा 12 भारी बोल्ट्स से सील!", "#94A3B8");

  ctx.save();
  const cx = 540, cy = 680;
  const pop = spring(clamp(lt / 0.42));
  ctx.translate(cx, cy);
  ctx.scale(pop * 1.25, pop * 1.25);

  // Heavy Industrial Steel Welded Cover Cap
  circle(0, 0, 250, "#1E293B");
  ctx.strokeStyle = "#64748B"; ctx.lineWidth = 14;
  ctx.beginPath(); ctx.arc(0, 0, 250, 0, TAU); ctx.stroke();

  // Rust & Weathering Texture Rings
  ctx.strokeStyle = "#475569"; ctx.lineWidth = 6;
  circle(0, 0, 190, "rgba(0,0,0,0)"); ctx.stroke();

  // 12 Heavy Industrial Hexagonal Steel Bolts
  for (let b = 0; b < 12; b++) {
    const ba = (b * TAU) / 12;
    const bx = Math.cos(ba) * 215, by = Math.sin(ba) * 215;
    circle(bx, by, 18, "#F1F5F9");
    ctx.strokeStyle = "#0F172A"; ctx.lineWidth = 3.5;
    ctx.beginPath(); ctx.arc(bx, by, 18, 0, TAU); ctx.stroke();
    circle(bx, by, 7, "#64748B");
  }

  // Welded Stencil Text on Cap
  ctx.font = F(38, "900"); ctx.fillStyle = "#EF4444"; ctx.textAlign = "center";
  ctx.fillText("SG-3 // 12,262M", 0, -30);
  ctx.font = F(28, "900"); ctx.fillStyle = "#FFE600";
  ctx.fillText("WELDED & SEALED", 0, 30);

  ctx.restore();

  drawAutoTechCard("PERMANENTLY SEALED HOLE TO THE DEEP ABYSS", cx, 1180, "#E2E8F0", 26);
  filmAtmosphere(t, 680, "rgba(148, 163, 184, 0.25)");
}

// ── I8. KOLA OUTRO CTA ────────────────────────────────────────────────────────────
export function drawKolaOutroCTA(lt, d, t) {
  drawFullCanvasBackground(t, 'kola');
  hudHeader("ANCHOR AADHYA OFFICIAL // EARTH CORE", "कमेंट में बताएं और सब्सक्राइब करें!", "#F59E0B");

  ctx.save();
  const ox = 540, oy = 700, s = 1.45;
  ctx.translate(ox, oy); ctx.scale(s, s);

  // Red YouTube Button
  ctx.fillStyle = "#FF0000"; ctx.beginPath(); ctx.roundRect(-160, -55, 320, 110, 26); ctx.fill();
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath(); ctx.moveTo(-20, -32); ctx.lineTo(35, 0); ctx.lineTo(-20, 32); ctx.fill();

  ctx.font = "900 34px Inter, sans-serif"; ctx.fillStyle = "#FFFFFF"; ctx.textAlign = "center";
  ctx.fillText("SUBSCRIBE", 0, 105);

  // Bell
  const ring = Math.sin(t * 12) * 0.25;
  ctx.save(); ctx.translate(130, -55); ctx.rotate(ring);
  ctx.fillStyle = "#FFE600";
  ctx.beginPath(); ctx.arc(0, 0, 24, Math.PI, TAU); ctx.lineTo(26, 20); ctx.lineTo(-26, 20); ctx.fill();
  circle(0, 26, 8, "#FFE600");
  ctx.restore();

  // Dynamic Auto-fit Question Bubble: Text NEVER hangs outside!
  drawOutroQuestionBubble("क्या इंसान कभी धरती आर-पार करेगा? ⛏️✍️");

  ctx.restore();

  drawAutoTechCard("SUBSCRIBE FOR DAILY VIRAL SCIENCE FACTS", 540, 1180, "#F59E0B", 26);
  filmAtmosphere(t, 700, "rgba(245, 158, 11, 0.25)");
}
