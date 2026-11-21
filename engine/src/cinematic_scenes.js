// CINEMATIC DOCUMENTARY SCENE ENGINE (1080x1920 9:16)
// Broadcast-quality literal visuals for every spoken word:
// Earth, Mount Everest, Sun, Submarine, 1000 Elephants, Anglerfish, Plastic Bottle,
// Chernobyl Reactor, Elephant's Foot, Geiger Counter, Nixie Countdown, Corium Lava.
// All visuals placed safely above y=1200 to guarantee ZERO caption overlap.
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob, rnd, circle, ell, line, rr, TAU } from './core/lib.js';

const F = (s, w = '900') => `${w} ${s}px Inter, "Noto Sans Devanagari", "Mangal", sans-serif`;

// Utility: HUD Title Card (top safe area)
function hudHeader(title, subtitle = '', color = '#00F2FE') {
  ctx.save();
  // Semi-transparent backdrop for title box
  ctx.fillStyle = 'rgba(2, 8, 18, 0.75)';
  ctx.beginPath(); ctx.roundRect(80, 130, W - 160, 120, 16); ctx.fill();
  ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.stroke();

  // Corner tech brackets
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(80, 155); ctx.lineTo(80, 130); ctx.lineTo(105, 130); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W - 105, 130); ctx.lineTo(W - 80, 130); ctx.lineTo(W - 80, 155); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(80, 225); ctx.lineTo(80, 250); ctx.lineTo(105, 250); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W - 105, 250); ctx.lineTo(W - 80, 250); ctx.lineTo(W - 80, 225); ctx.stroke();

  ctx.font = F(42, '900'); ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(title, 540, 172);
  if (subtitle) {
    ctx.font = F(24, '800'); ctx.fillStyle = '#FFFFFF';
    ctx.fillText(subtitle, 540, 215);
  }
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
  ctx.font = F(38, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText('मारियाना ट्रेंच (प्रशांत महासागर)', 540, 1030);

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

  ctx.font = F(42, '900'); ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center';
  ctx.fillText('अंधेरे को चीरती शक्तिशाली लाइट', 540, 1020);

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

  ctx.font = F(44, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText('बायोल्यूमिनिसेंस (जीवित रोशनी)', 540, 1020);

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

  // Comment Bubble
  ctx.fillStyle = '#00F2FE'; ctx.beginPath(); ctx.roundRect(-140, -180, 280, 85, 20); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-30, -95); ctx.lineTo(0, -70); ctx.lineTo(10, -95); ctx.fill();
  ctx.font = '900 28px Inter, "Noto Sans Devanagari", sans-serif'; ctx.fillStyle = '#000000'; ctx.textAlign = 'center';
  ctx.fillText('कमेंट्स में बताओ! ✍️', 0, -135);

  ctx.restore();

  ctx.font = F(38, '900'); ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center';
  ctx.fillText('Anchor Aadhya को अभी सब्सक्राइब करें!', 540, 1030);
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

  ctx.font = F(48, '900'); ctx.fillStyle = '#FF1744'; ctx.textAlign = 'center';
  ctx.fillText('LETHAL RADIATION ZONE', cx, 1020);

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

  ctx.font = F(42, '900'); ctx.fillStyle = '#FFFFFF';
  ctx.fillText('इतने समय में शरीर के अंग फेल!', cx, 1020);

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

  ctx.font = F(44, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText('26 अप्रैल 1986 // इतिहास का काला दिन', cx, 1020);

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

  ctx.font = F(42, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText('पिघला हुआ यूरेनियम और ग्रेफाइट', cx, 1020);

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

  ctx.font = F(48, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText("हाथी का पैर (ELEPHANT'S FOOT)", cx, 1020);

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

  ctx.font = F(42, '900'); ctx.fillStyle = '#FF1744'; ctx.textAlign = 'center';
  ctx.fillText('गामा किरणों ने कैमरों की रील जला दी!', cx, 1020);

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

  ctx.font = F(44, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText('रेडिएशन को भोजन बनाने वाला फंगस!', cx, 1020);

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

  // Comment Bubble
  ctx.fillStyle = '#00F2FE'; ctx.beginPath(); ctx.roundRect(-150, -180, 300, 85, 20); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-30, -95); ctx.lineTo(0, -70); ctx.lineTo(10, -95); ctx.fill();
  ctx.font = '900 28px Inter, "Noto Sans Devanagari", sans-serif'; ctx.fillStyle = '#000000'; ctx.textAlign = 'center';
  ctx.fillText('क्या प्रकृति इंसान से बड़ी है? ✍️', 0, -135);

  ctx.restore();

  ctx.font = F(38, '900'); ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center';
  ctx.fillText('Anchor Aadhya को अभी सब्सक्राइब करें!', 540, 1030);
}
