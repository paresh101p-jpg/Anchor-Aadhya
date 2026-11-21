// CINEMATIC DOCUMENTARY SCENE ENGINE (1080x1920 9:16)
// Broadcast-quality motion graphics: dark mode, volumetric lighting, particle systems,
// tactical HUD telemetry, depth gauges, and high-energy documentary visuals.
// Zero clip-art icons, zero crude stick figures.
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob, rnd, circle, ell, line, rr, TAU } from './core/lib.js';

const F = (s, w = '900') => `${w} ${s}px Inter, "Noto Sans Devanagari", "Mangal", sans-serif`;

// Utility: HUD Tech Box
function hudBox(x, y, w, h, title = '', color = '#00F2FE') {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 4;
  ctx.strokeRect(x, y, w, h);
  // corner brackets
  const b = 18;
  ctx.lineWidth = 8;
  // top-left
  ctx.beginPath(); ctx.moveTo(x, y + b); ctx.lineTo(x, y); ctx.lineTo(x + b, y); ctx.stroke();
  // top-right
  ctx.beginPath(); ctx.moveTo(x + w - b, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + b); ctx.stroke();
  // bottom-left
  ctx.beginPath(); ctx.moveTo(x, y + h - b); ctx.lineTo(x, y + h); ctx.lineTo(x + b, y + h); ctx.stroke();
  // bottom-right
  ctx.beginPath(); ctx.moveTo(x + w - b, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - b); ctx.stroke();

  if (title) {
    ctx.font = F(28, '800'); ctx.fillStyle = color; ctx.textBaseline = 'bottom';
    ctx.fillText(title, x + 10, y - 10);
  }
  ctx.restore();
}

// Utility: Cinematic Film Grain & Scanlines
function filmAtmosphere(t, alpha = 0.08) {
  ctx.save();
  ctx.fillStyle = '#000'; ctx.globalAlpha = 0.35;
  // dark vignette edges
  const g = ctx.createRadialGradient(W / 2, H / 2, 400, W / 2, H / 2, 1000);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, 'rgba(0,0,0,0.85)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

  // scanlines
  ctx.fillStyle = '#FFFFFF'; ctx.globalAlpha = 0.03;
  for (let y = 0; y < H; y += 8) {
    ctx.fillRect(0, y, W, 2);
  }
  ctx.restore();
}

// Marine Snow (floating glowing particulate matter in deep sea)
function marineSnow(t, count = 45, color = 'rgba(120, 220, 255, 0.45)') {
  ctx.save();
  ctx.fillStyle = color;
  for (let i = 0; i < count; i++) {
    const seed = i * 73.1;
    const x = (rnd(seed) * W + Math.sin(t * 0.8 + seed) * 40) % W;
    const y = ((rnd(seed + 1) * H + t * (25 + rnd(seed + 2) * 45)) % (H + 100)) - 50;
    const r = 2 + rnd(seed + 3) * 6;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// ── 1. OCEAN ABYSS DIVE ───────────────────────────────────────────────────────────
export function drawOceanDive(lt, d, t) {
  // background: deep ocean gradient
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#001B3A'); bg.addColorStop(0.4, '#000D20'); bg.addColorStop(1, '#00030A');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // descending depth grid lines
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.15)'; ctx.lineWidth = 2;
  const offset = (t * 220) % 180;
  for (let y = -200; y < H + 200; y += 180) {
    ctx.beginPath(); ctx.moveTo(80, y + offset); ctx.lineTo(W - 80, y + offset); ctx.stroke();
  }

  // ocean depth telemetry
  const depth = Math.round(lerp(0, 3500, eo(clamp(lt / d))));
  ctx.fillStyle = '#00F2FE'; ctx.font = F(72, '900'); ctx.textAlign = 'center';
  ctx.fillText(`-${depth.toLocaleString()} M`, 540, 520);
  ctx.font = F(32, '800'); ctx.fillStyle = '#A0E6FF';
  ctx.fillText('OCEANIC ABYSS DESCENT // SECTOR PACIFIC', 540, 580);

  // Submersible silhouette diving down
  const subY = 820 + Math.sin(t * 2) * 15;
  ctx.fillStyle = '#112233'; ctx.strokeStyle = '#00F2FE'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.ellipse(540, subY, 180, 85, 0, 0, TAU); ctx.fill(); ctx.stroke();
  // conning tower
  ctx.fillRect(510, subY - 120, 60, 45); ctx.strokeRect(510, subY - 120, 60, 45);
  // dive headlights
  const beam = ctx.createRadialGradient(540, subY + 60, 20, 540, subY + 360, 320);
  beam.addColorStop(0, 'rgba(0, 242, 254, 0.6)'); beam.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = beam;
  ctx.beginPath(); ctx.moveTo(540, subY + 40); ctx.lineTo(320, subY + 480); ctx.lineTo(760, subY + 480); ctx.fill();

  ctx.restore();
  marineSnow(t, 50);
  filmAtmosphere(t);
}

// ── 2. MARIANA TRENCH 11,000M CHASM ───────────────────────────────────────────────
export function drawMarianaChasm(lt, d, t) {
  ctx.fillStyle = '#01050D'; ctx.fillRect(0, 0, W, H);

  // Massive canyon rock walls on left & right
  ctx.save();
  ctx.fillStyle = '#0A131F'; ctx.strokeStyle = 'rgba(0, 242, 254, 0.25)'; ctx.lineWidth = 4;
  // Left wall
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(340, 0); ctx.lineTo(260, 600);
  ctx.lineTo(380, 1100); ctx.lineTo(240, 1500); ctx.lineTo(310, H); ctx.lineTo(0, H); ctx.fill(); ctx.stroke();
  // Right wall
  ctx.beginPath(); ctx.moveTo(W, 0); ctx.lineTo(W - 340, 0); ctx.lineTo(W - 260, 600);
  ctx.lineTo(W - 380, 1100); ctx.lineTo(W - 240, 1500); ctx.lineTo(W - 310, H); ctx.lineTo(W, H); ctx.fill(); ctx.stroke();

  // Central Glowing Depth Axis
  ctx.strokeStyle = '#FF3366'; ctx.lineWidth = 6; ctx.setLineDash([20, 15]);
  ctx.beginPath(); ctx.moveTo(540, 200); ctx.lineTo(540, 1350); ctx.stroke();
  ctx.setLineDash([]);

  // Beacon Target at Trench Bottom
  const pulse = 1 + 0.15 * Math.sin(t * 6);
  ctx.strokeStyle = '#FF3366'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.arc(540, 1180, 70 * pulse, 0, TAU); ctx.stroke();
  ctx.fillStyle = '#FF3366';
  ctx.beginPath(); ctx.arc(540, 1180, 24, 0, TAU); ctx.fill();

  // Metric HUD Card
  hudBox(240, 380, 600, 240, 'CHALLENGER DEEP RADAR', '#00F2FE');
  ctx.font = F(86, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText('11,034 M', 540, 490);
  ctx.font = F(34, '800'); ctx.fillStyle = '#FFF';
  ctx.fillText('पृथ्वी की सबसे गहरी खाई', 540, 560);

  ctx.restore();
  marineSnow(t, 40);
  filmAtmosphere(t);
}

// ── 3. EVEREST INVERTED SCALE ─────────────────────────────────────────────────────
export function drawEverestComparison(lt, d, t) {
  ctx.fillStyle = '#000814'; ctx.fillRect(0, 0, W, H);

  // Surface Sea Level
  ctx.fillStyle = 'rgba(0, 242, 254, 0.4)'; ctx.fillRect(60, 320, W - 120, 6);
  ctx.font = F(30, '800'); ctx.fillStyle = '#00F2FE'; ctx.textAlign = 'left';
  ctx.fillText('समुद्र तल (SEA LEVEL: 0 M)', 80, 305);

  // Inverted Everest Mountain Silhouette
  ctx.save();
  ctx.fillStyle = '#1A293D'; ctx.strokeStyle = '#4FD1E8'; ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(180, 326);
  ctx.lineTo(540, 1080); // Everest Peak pointing downwards at 8,848m
  ctx.lineTo(900, 326);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // Snow lines on Everest
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.beginPath();
  ctx.moveTo(480, 950); ctx.lineTo(540, 1080); ctx.lineTo(600, 950); ctx.lineTo(540, 990); ctx.fill();

  // Everest label
  ctx.font = F(38, '900'); ctx.fillStyle = '#FFF'; ctx.textAlign = 'center';
  ctx.fillText('माउंट एवरेस्ट (8,848 M)', 540, 850);

  // Bottom of Trench Floor Marker (11,034 M)
  ctx.strokeStyle = '#FF3366'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(120, 1320); ctx.lineTo(W - 120, 1320); ctx.stroke();
  ctx.font = F(42, '900'); ctx.fillStyle = '#FF3366';
  ctx.fillText('मारियाना ट्रेंच का तल (11,034 M)', 540, 1380);

  // Remaining Gap Indicator
  ctx.strokeStyle = '#FFE600'; ctx.lineWidth = 4; ctx.setLineDash([12, 10]);
  ctx.beginPath(); ctx.moveTo(540, 1090); ctx.lineTo(540, 1310); ctx.stroke(); ctx.setLineDash([]);
  ctx.font = F(34, '900'); ctx.fillStyle = '#FFE600';
  ctx.fillText('2,186 M गहरा पानी अभी भी बाकी!', 540, 1200);

  ctx.restore();
  filmAtmosphere(t);
}

// ── 4. COMPLETE MIDNIGHT EXTINCTION ───────────────────────────────────────────────
export function drawMidnightDarkness(lt, d, t) {
  // Depth transition gradient from blue to absolute void
  const bg = ctx.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, '#002B49'); bg.addColorStop(0.3, '#001326'); bg.addColorStop(0.65, '#000000');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  // Sunlight Rays dying out at 1000m
  ctx.save();
  const rayAlpha = Math.max(0, 0.45 - lt * 0.15);
  ctx.fillStyle = `rgba(255, 235, 160, ${rayAlpha})`;
  for (let i = 0; i < 5; i++) {
    const x = 160 + i * 190;
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 120, 680); ctx.lineTo(x + 40, 680); ctx.fill();
  }

  // 1000m Barrier Line
  ctx.strokeStyle = '#FF3366'; ctx.lineWidth = 4; ctx.setLineDash([16, 12]);
  ctx.beginPath(); ctx.moveTo(80, 720); ctx.lineTo(W - 80, 720); ctx.stroke(); ctx.setLineDash([]);
  ctx.font = F(32, '800'); ctx.fillStyle = '#FF3366'; ctx.textAlign = 'center';
  ctx.fillText('1,000 M // SUNLIGHT EXTINCTION LEVEL', 540, 690);

  // Warning Skull / Danger Alert in Pitch Black
  hudBox(200, 840, 680, 280, 'SUNLIGHT = 0%', '#FF3366');
  ctx.font = F(68, '900'); ctx.fillStyle = '#FFF';
  ctx.fillText('खौफनाक अंधेरा', 540, 950);
  ctx.font = F(36, '800'); ctx.fillStyle = '#A0B2C6';
  ctx.fillText('सूरज की एक भी किरण नहीं पहुँचती', 540, 1020);

  ctx.restore();
  marineSnow(t, 25, 'rgba(80, 150, 200, 0.3)');
  filmAtmosphere(t);
}

// ── 5. SUBMARINE HIGH-POWER SEARCHLIGHT ───────────────────────────────────────────
export function drawSubmarineSearchlight(lt, d, t) {
  ctx.fillStyle = '#000206'; ctx.fillRect(0, 0, W, H);

  ctx.save();
  const subX = 540, subY = 620;

  // Powerful Volumetric Cone Beams sweeping slowly
  const sweep = Math.sin(t * 1.5) * 80;
  const beam = ctx.createRadialGradient(subX, subY, 40, subX + sweep, subY + 700, 600);
  beam.addColorStop(0, 'rgba(180, 240, 255, 0.85)');
  beam.addColorStop(0.3, 'rgba(0, 200, 255, 0.4)');
  beam.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(subX - 40, subY + 20);
  ctx.lineTo(subX - 350 + sweep, subY + 800);
  ctx.lineTo(subX + 350 + sweep, subY + 800);
  ctx.lineTo(subX + 40, subY + 20);
  ctx.fill();

  // Submarine Chassis
  ctx.fillStyle = '#1B263B'; ctx.strokeStyle = '#00F2FE'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.ellipse(subX, subY, 220, 95, 0, 0, TAU); ctx.fill(); ctx.stroke();
  // Cockpit viewing sphere (golden titanium)
  ctx.fillStyle = '#FFE600'; ctx.beginPath(); ctx.arc(subX, subY + 25, 45, 0, TAU); ctx.fill();

  // Illuminated Ocean Floor Sediment revealed below
  ctx.fillStyle = '#0B1726';
  ctx.beginPath(); ctx.ellipse(subX + sweep * 0.5, subY + 780, 420, 120, 0, 0, TAU); ctx.fill();
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)'; ctx.lineWidth = 3; ctx.stroke();

  hudBox(240, 1020, 600, 160, 'SUBMERSIBLE SEARCHLIGHT', '#00F2FE');
  ctx.font = F(48, '900'); ctx.fillStyle = '#FFF'; ctx.textAlign = 'center';
  ctx.fillText('गहरी अंधेरी दुनिया', 540, 1120);

  ctx.restore();
  marineSnow(t, 60);
  filmAtmosphere(t);
}

// ── 6. HYDRAULIC PRESSURE SLAM (1,086 ATM) ─────────────────────────────────────────
export function drawPressureSlam(lt, d, t) {
  ctx.fillStyle = '#060B14'; ctx.fillRect(0, 0, W, H);

  ctx.save();
  // Circular Heavy Industrial Gauge
  const cx = 540, cy = 780, R = 280;
  ctx.fillStyle = '#111927'; ctx.strokeStyle = '#4FD1E8'; ctx.lineWidth = 14;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill(); ctx.stroke();
  // Red Danger Arc from 200° to 340°
  ctx.strokeStyle = '#FF3366'; ctx.lineWidth = 26;
  ctx.beginPath(); ctx.arc(cx, cy, R - 24, Math.PI * 0.9, Math.PI * 1.8); ctx.stroke();

  // Ticks
  for (let a = 0; a < TAU; a += Math.PI / 10) {
    const x1 = cx + Math.cos(a) * (R - 40), y1 = cy + Math.sin(a) * (R - 40);
    const x2 = cx + Math.cos(a) * (R - 65), y2 = cy + Math.sin(a) * (R - 65);
    line([[x1, y1], [x2, y2]], a > Math.PI ? '#FF3366' : '#718296', 6);
  }

  // Needle slamming violently into the Red Zone
  const shake = rnd(t * 10) * 12 - 6;
  const targetAngle = Math.PI * 1.65 + (shake * Math.PI) / 180;
  ctx.strokeStyle = '#FF3366'; ctx.lineWidth = 12;
  const nx = cx + Math.cos(targetAngle) * (R - 45), ny = cy + Math.sin(targetAngle) * (R - 45);
  line([[cx, cy], [nx, ny]], '#FF3366', 12);
  circle(cx, cy, 32, '#FFE600');

  // Center Gauge Readout
  ctx.font = F(76, '900'); ctx.fillStyle = '#FF3366'; ctx.textAlign = 'center';
  ctx.fillText('1,086 BAR', cx, cy + 120);

  // Inward Pressure Force Arrows Squeezing Gauge
  const arrP = (t * 80) % 60;
  for (let k = 0; k < 4; k++) {
    const ang = (k * Math.PI) / 2;
    const ax = cx + Math.cos(ang) * (R + 120 - arrP);
    const ay = cy + Math.sin(ang) * (R + 120 - arrP);
    ctx.fillStyle = '#FF3366';
    ctx.beginPath(); ctx.arc(ax, ay, 18, 0, TAU); ctx.fill();
  }

  hudBox(180, 1180, 720, 190, 'CRUSHING HYDROSTATIC PRESSURE', '#FF3366');
  ctx.font = F(52, '900'); ctx.fillStyle = '#FFF';
  ctx.fillText('1000 गुना भयंकर दबाव!', cx, 1290);

  ctx.restore();
  filmAtmosphere(t);
}

// ── 7. 1000 ELEPHANTS CRUSH FORCE ────────────────────────────────────────────────
export function drawElephantWeight(lt, d, t) {
  ctx.fillStyle = '#080005'; ctx.fillRect(0, 0, W, H);

  ctx.save();
  // Heavy Compression Hydraulic Press Block slamming down
  const slam = eo(clamp(lt / 0.35));
  const pressY = lerp(100, 480, slam);

  ctx.fillStyle = '#2B141E'; ctx.strokeStyle = '#FF3366'; ctx.lineWidth = 8;
  ctx.fillRect(160, pressY, 760, 240);
  ctx.strokeRect(160, pressY, 760, 240);

  // Big Text on Press
  ctx.font = F(78, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText('1,000 HATHI', 540, pressY + 110);
  ctx.font = F(38, '800'); ctx.fillStyle = '#FFF';
  ctx.fillText('सिर पर 1000 हाथियों का वजन!', 540, pressY + 180);

  // Crushed Titanium Sphere with glowing stress cracks below
  const sphereY = 960;
  ctx.fillStyle = '#1F2A38'; ctx.strokeStyle = '#FF3366'; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.ellipse(540, sphereY, 200, 140, 0, 0, TAU); ctx.fill(); ctx.stroke();

  // Dynamic Stress Fractures
  ctx.strokeStyle = '#FFE600'; ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(480, sphereY - 80); ctx.lineTo(520, sphereY - 20); ctx.lineTo(500, sphereY + 40);
  ctx.moveTo(560, sphereY - 90); ctx.lineTo(540, sphereY - 10); ctx.lineTo(580, sphereY + 50);
  ctx.stroke();

  // Crushing Force Arrows
  for (let x = 240; x <= 840; x += 150) {
    line([[x, pressY + 240], [x, sphereY - 140]], '#FF3366', 12);
  }

  hudBox(200, 1220, 680, 160, 'HYDRAULIC FORCE VECTOR', '#FF3366');
  ctx.font = F(46, '900'); ctx.fillStyle = '#FFF';
  ctx.fillText('हड्डियों का चूरा बन जाएगा', 540, 1315);

  ctx.restore();
  filmAtmosphere(t);
}

// ── 8. NAVAL SONAR RADAR SWEEP ────────────────────────────────────────────────────
export function drawSonarRadar(lt, d, t) {
  ctx.fillStyle = '#020C0E'; ctx.fillRect(0, 0, W, H);

  ctx.save();
  const cx = 540, cy = 760, R = 340;

  // Radar Grid Circles
  ctx.strokeStyle = 'rgba(0, 255, 170, 0.35)'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, R * 0.66, 0, TAU); ctx.stroke();
  ctx.beginPath(); ctx.arc(cx, cy, R * 0.33, 0, TAU); ctx.stroke();
  // Crosshairs
  line([[cx - R - 30, cy], [cx + R + 30, cy]], 'rgba(0, 255, 170, 0.35)', 3);
  line([[cx, cy - R - 30], [cx, cy + R + 30]], 'rgba(0, 255, 170, 0.35)', 3);

  // Rotating Radar Beam
  const ang = (t * 3.5) % TAU;
  const sweep = ctx.createRadialGradient(cx, cy, 20, cx, cy, R);
  sweep.addColorStop(0, 'rgba(0, 255, 170, 0.7)'); sweep.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = sweep;
  ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, ang, ang + 0.75); ctx.closePath(); ctx.fill();

  // Target Blip detected at bottom
  const bx = cx + 140, by = cy + 180;
  const p = 1 + 0.25 * Math.sin(t * 8);
  circle(bx, by, 16 * p, '#FF3366');
  ctx.strokeStyle = '#FF3366'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(bx, by, 40 * p, 0, TAU); ctx.stroke();
  ctx.font = F(28, '800'); ctx.fillStyle = '#FF3366';
  ctx.fillText('UNKNOWN CONTACT', bx + 60, by + 10);

  hudBox(200, 1200, 680, 180, 'ACOUSTIC SONAR SCANNER', '#00FFAA');
  ctx.font = F(54, '900'); ctx.fillStyle = '#00FFAA'; ctx.textAlign = 'center';
  ctx.fillText('गहराई में हलचल!', cx, 1310);

  ctx.restore();
  filmAtmosphere(t);
}

// ── 9. BIOLUMINESCENT ALIEN CREATURE ──────────────────────────────────────────────
export function drawAlienCreature(lt, d, t) {
  ctx.fillStyle = '#010206'; ctx.fillRect(0, 0, W, H);

  ctx.save();
  const cx = 540, cy = 720;

  // Bioluminescent Glowing Lure (Pulsing Light Bulb)
  const glowR = 120 + Math.sin(t * 5) * 35;
  const lureG = ctx.createRadialGradient(cx - 180, cy - 220, 10, cx - 180, cy - 220, glowR);
  lureG.addColorStop(0, '#FFFFFF');
  lureG.addColorStop(0.25, '#00F2FE');
  lureG.addColorStop(0.7, 'rgba(0, 242, 254, 0.35)');
  lureG.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = lureG;
  ctx.beginPath(); ctx.arc(cx - 180, cy - 220, glowR, 0, TAU); ctx.fill();

  // Esca Stalk
  ctx.strokeStyle = '#00F2FE'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(cx - 40, cy - 80); ctx.quadraticCurveTo(cx - 140, cy - 180, cx - 180, cy - 220); ctx.stroke();

  // Deep Sea Ghostly Fish Silhouette
  ctx.fillStyle = '#0A1826'; ctx.strokeStyle = 'rgba(0, 242, 254, 0.6)'; ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cx - 120, cy);
  ctx.quadraticCurveTo(cx + 80, cy - 160, cx + 320, cy - 40); // tail top
  ctx.lineTo(cx + 420, cy - 120); // fin top
  ctx.lineTo(cx + 360, cy);
  ctx.lineTo(cx + 420, cy + 120); // fin bottom
  ctx.lineTo(cx + 320, cy + 40);
  ctx.quadraticCurveTo(cx + 60, cy + 180, cx - 120, cy); // jaw bottom
  ctx.fill(); ctx.stroke();

  // Menacing Razor Translucent Teeth
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 5;
  for (let i = 0; i < 7; i++) {
    const tx = cx - 100 + i * 28;
    line([[tx, cy - 30], [tx + 10, cy + 25]], '#FFF', 5);
    line([[tx + 14, cy + 40], [tx + 22, cy - 15]], '#FFF', 5);
  }

  // Glowing Eye
  circle(cx - 20, cy - 50, 18, '#00F2FE');
  circle(cx - 20, cy - 50, 7, '#FFF');

  hudBox(180, 1140, 720, 220, 'BIOLUMINESCENT EXTREMOPHILE', '#00F2FE');
  ctx.font = F(58, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText('जीवित रोशनी (BIOLUMINESCENCE)', cx, 1240);
  ctx.font = F(36, '800'); ctx.fillStyle = '#FFF';
  ctx.fillText('बिना सूरज और ऑक्सीजन के ज़िंदा!', cx, 1310);

  ctx.restore();
  marineSnow(t, 45, 'rgba(0, 242, 254, 0.45)');
  filmAtmosphere(t);
}

// ── 10. PLASTIC DEBRIS EVIDENCE AT 10,928M ─────────────────────────────────────────
export function drawPlasticDiscovery(lt, d, t) {
  ctx.fillStyle = '#000205'; ctx.fillRect(0, 0, W, H);

  ctx.save();
  const cx = 540, cy = 820;

  // Harsh Forensic Spotlight Beam focused on ocean floor
  const spot = ctx.createRadialGradient(cx, cy - 40, 30, cx, cy, 380);
  spot.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
  spot.addColorStop(0.3, 'rgba(200, 230, 255, 0.6)');
  spot.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = spot;
  ctx.beginPath(); ctx.ellipse(cx, cy, 420, 220, 0, 0, TAU); ctx.fill();

  // Virgin Seafloor Mud
  ctx.fillStyle = '#141E28'; ctx.beginPath(); ctx.ellipse(cx, cy + 60, 480, 160, 0, 0, TAU); ctx.fill();

  // Crushed Plastic Bottle / Shopping Bag Evidence
  ctx.fillStyle = '#FFE600'; ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(cx - 120, cy - 30);
  ctx.lineTo(cx - 40, cy - 65);
  ctx.lineTo(cx + 80, cy - 20);
  ctx.lineTo(cx + 140, cy + 10);
  ctx.lineTo(cx + 110, cy + 50);
  ctx.lineTo(cx - 20, cy + 30);
  ctx.lineTo(cx - 90, cy + 45);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // Plastic Bottle Cap
  circle(cx + 140, cy + 10, 16, '#FF3366');

  // Forensic Evidence Marker Frame
  ctx.strokeStyle = '#FF3366'; ctx.lineWidth = 6; ctx.setLineDash([14, 10]);
  ctx.strokeRect(cx - 180, cy - 100, 380, 200); ctx.setLineDash([]);
  ctx.font = F(30, '900'); ctx.fillStyle = '#FF3366'; ctx.textAlign = 'left';
  ctx.fillText('EVIDENCE #01 // DEPTH: 10,928 M', cx - 170, cy - 115);

  // Big Shocking Banner
  hudBox(160, 1150, 760, 240, 'CRITICAL DISCOVERY // POLLUTION', '#FF3366');
  ctx.font = F(64, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText('इंसानी प्लास्टिक कचरा मिला!', cx, 1250);
  ctx.font = F(36, '800'); ctx.fillStyle = '#FFF';
  ctx.fillText('धरती के सबसे गहरे कोने में भी बर्बादी', cx, 1330);

  ctx.restore();
  filmAtmosphere(t);
}

// ── 11. OUTRO CALLOUT & SUBSCRIBE ─────────────────────────────────────────────────
export function drawOutroCTA(lt, d, t) {
  const bg = ctx.createRadialGradient(540, 760, 100, 540, 760, 900);
  bg.addColorStop(0, '#061C38'); bg.addColorStop(1, '#01050D');
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

  ctx.save();
  const cx = 540, cy = 700;

  // Gold Holographic Badge
  const p = 1 + 0.08 * Math.sin(t * 4);
  ctx.strokeStyle = '#FFE600'; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.arc(cx, cy, 140 * p, 0, TAU); ctx.stroke();
  circle(cx, cy, 110, '#0B2238');

  // Play / Logo Symbol
  ctx.fillStyle = '#FFE600';
  ctx.beginPath(); ctx.moveTo(cx - 30, cy - 45); ctx.lineTo(cx + 45, cy); ctx.lineTo(cx - 30, cy + 45); ctx.fill();

  // Channel Name
  ctx.font = F(72, '900'); ctx.fillStyle = '#FFF'; ctx.textAlign = 'center';
  ctx.fillText('ANCHOR AADHYA', cx, cy + 240);

  // Engagement Question Card
  hudBox(160, 1060, 760, 260, 'QUESTION OF THE DAY', '#00F2FE');
  ctx.font = F(48, '900'); ctx.fillStyle = '#FFE600';
  ctx.fillText('क्या इंसान हर जगह तबाही मचाएगा?', cx, 1160);
  ctx.font = F(40, '800'); ctx.fillStyle = '#FFF';
  ctx.fillText('कमेंट्स में बताएं! 👇', cx, 1250);

  ctx.restore();
  marineSnow(t, 50, 'rgba(255, 230, 0, 0.4)');
  filmAtmosphere(t);
}
