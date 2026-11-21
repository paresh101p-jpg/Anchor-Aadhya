// CINEMATIC DOCUMENTARY SCENE ENGINE (1080x1920 9:16)
// Broadcast-quality literal visuals for every spoken word:
// Earth, Mount Everest, Sun, Submarine, 1000 Elephants, Anglerfish, Plastic Bottle, Outro.
// All visuals placed safely above y=1200 to prevent caption overlap.
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob, rnd, circle, ell, line, rr, TAU } from './core/lib.js';

const F = (s, w = '900') => `${w} ${s}px Inter, "Noto Sans Devanagari", "Mangal", sans-serif`;

// Utility: HUD Title Card (top safe area)
function hudHeader(title, subtitle = '', color = '#00F2FE') {
  ctx.save();
  ctx.strokeStyle = color; ctx.lineWidth = 3;
  ctx.strokeRect(100, 140, W - 200, 110);
  // corner accents
  ctx.lineWidth = 6;
  ctx.beginPath(); ctx.moveTo(100, 165); ctx.lineTo(100, 140); ctx.lineTo(125, 140); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W - 125, 140); ctx.lineTo(W - 100, 140); ctx.lineTo(W - 100, 165); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(100, 225); ctx.lineTo(100, 250); ctx.lineTo(125, 250); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W - 125, 250); ctx.lineTo(W - 100, 250); ctx.lineTo(W - 100, 225); ctx.stroke();

  ctx.font = F(44, '900'); ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(title, 540, 180);
  if (subtitle) {
    ctx.font = F(24, '800'); ctx.fillStyle = '#FFFFFF';
    ctx.fillText(subtitle, 540, 220);
  }
  ctx.restore();
}

// Marine Snow particles (floating deep-sea dust)
function marineSnow(t, count = 35) {
  ctx.save();
  ctx.fillStyle = 'rgba(120, 220, 255, 0.45)';
  for (let i = 0; i < count; i++) {
    const seed = i * 67.3;
    const x = (rnd(seed) * W + Math.sin(t * 0.7 + seed) * 30) % W;
    const y = ((rnd(seed + 1) * H + t * (20 + rnd(seed + 2) * 35)) % (H + 100)) - 50;
    const r = 2 + rnd(seed + 3) * 5;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
  }
  ctx.restore();
}

// ── 1. EARTH GLOBE (वर्ड: पृथ्वी का सबसे गहरा स्थान) ─────────────────────────────────
export function drawEarthGlobe(lt, d, t) {
  // Background space/ocean void
  ctx.fillStyle = '#020712'; ctx.fillRect(0, 0, W, H);

  hudHeader('PLANET EARTH // DEEPEST POINT', 'पृथ्वी का सबसे गहरा स्थान', '#00F2FE');

  ctx.save();
  const cx = 540, cy = 680, r = 260;

  // Blue Atmosphere Halo
  const halo = ctx.createRadialGradient(cx, cy, r * 0.85, cx, cy, r * 1.35);
  halo.addColorStop(0, 'rgba(0, 242, 254, 0.6)'); halo.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath(); ctx.arc(cx, cy, r * 1.35, 0, TAU); ctx.fill();

  // Ocean Globe Base
  const ocean = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, 30, cx, cy, r);
  ocean.addColorStop(0, '#1E88E5'); ocean.addColorStop(0.65, '#0D47A1'); ocean.addColorStop(1, '#051937');
  ctx.fillStyle = ocean;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.fill();

  // Continents (Green rotating landmasses)
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, TAU); ctx.clip();
  ctx.fillStyle = '#4CAF50';
  const shift = (t * 22) % (r * 2.2);
  for (let k = -1; k <= 1; k++) {
    const lx = cx + k * r * 2.0 + shift;
    ctx.beginPath(); ctx.ellipse(lx - 50, cy - 40, 90, 60, 0.3, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(lx + 70, cy + 50, 80, 50, -0.2, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.ellipse(lx - 30, cy + 90, 60, 45, 0.1, 0, TAU); ctx.fill();
  }
  ctx.restore();

  // Mariana Trench Target Marker on Pacific Ocean
  const pulse = 1 + 0.15 * Math.sin(t * 6);
  ctx.strokeStyle = '#FF3366'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(cx + 40, cy + 20, 40 * pulse, 0, TAU); ctx.stroke();
  circle(cx + 40, cy + 20, 14, '#FFE600');

  // Label card
  ctx.font = F(36, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText('मारियाना ट्रेंच (प्रशांत महासागर)', 540, 1030);

  ctx.restore();
  marineSnow(t, 25);
}

// ── 2. MARIANA TRENCH 11,000M CHASM (वर्ड: 11,000 मीटर नीचे) ────────────────────────
export function drawMarianaChasm(lt, d, t) {
  ctx.fillStyle = '#01050D'; ctx.fillRect(0, 0, W, H);

  hudHeader('DEPTH READOUT // 11,000 METERS', '11,000 मीटर गहरी खाई', '#00F2FE');

  ctx.save();
  // Canyon walls on left & right
  ctx.fillStyle = '#0B1726'; ctx.strokeStyle = '#00F2FE'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.moveTo(60, 270); ctx.lineTo(340, 500); ctx.lineTo(260, 850); ctx.lineTo(380, 1150); ctx.lineTo(60, 1150); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(W - 60, 270); ctx.lineTo(W - 340, 500); ctx.lineTo(W - 260, 850); ctx.lineTo(W - 380, 1150); ctx.lineTo(W - 60, 1150); ctx.fill(); ctx.stroke();

  // Dynamic Descending Depth Meter
  const depth = Math.round(lerp(1000, 11034, eo(clamp(lt / d))));
  ctx.font = F(92, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText(`-${depth.toLocaleString()} M`, 540, 680);

  // Red Warning Beacon at Depth
  const pulse = 1 + 0.2 * Math.sin(t * 8);
  ctx.strokeStyle = '#FF3366'; ctx.lineWidth = 8;
  ctx.beginPath(); ctx.arc(540, 880, 60 * pulse, 0, TAU); ctx.stroke();
  circle(540, 880, 22, '#FF3366');

  // Challenger Deep text
  ctx.font = F(38, '900'); ctx.fillStyle = '#FFF';
  ctx.fillText('CHALLENGER DEEP: 11,034 M', 540, 1020);

  ctx.restore();
  marineSnow(t, 35);
}

// ── 3. MOUNT EVEREST SNOW PEAK (वर्ड: पूरा माउंट एवरेस्ट भी डूब जाएगा) ─────────────────
export function drawMountEverest(lt, d, t) {
  ctx.fillStyle = '#000814'; ctx.fillRect(0, 0, W, H);

  hudHeader('EVEREST COMPARISON // 8,848 METERS', 'माउंट एवरेस्ट भी डूब जाएगा', '#FFE600');

  ctx.save();
  const ex = 540, ey = 780;

  // Mountain Base Rock
  ctx.fillStyle = '#1C2833'; ctx.strokeStyle = '#4FD1E8'; ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(ex, ey - 320); // Summit Peak
  ctx.lineTo(ex + 320, ey + 200);
  ctx.lineTo(ex - 320, ey + 200);
  ctx.closePath(); ctx.fill(); ctx.stroke();

  // Pure White Glacier Snow Cap on Summit
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(ex, ey - 320);
  ctx.lineTo(ex + 130, ey - 100);
  ctx.lineTo(ex + 60, ey - 60);
  ctx.lineTo(ex, ey - 100);
  ctx.lineTo(ex - 70, ey - 70);
  ctx.lineTo(ex - 120, ey - 110);
  ctx.closePath(); ctx.fill();

  // Red Summit Flag
  line([[ex, ey - 320], [ex, ey - 390]], '#FFE600', 8);
  ctx.fillStyle = '#FF3366';
  ctx.beginPath(); ctx.moveTo(ex, ey - 390); ctx.lineTo(ex + 65, ey - 360); ctx.lineTo(ex, ey - 330); ctx.fill();

  // Rising Ocean Water Line Swallowing Everest
  const waterY = lerp(ey + 200, ey - 160, eo(clamp(lt / d)));
  ctx.fillStyle = 'rgba(0, 180, 255, 0.45)';
  ctx.fillRect(80, waterY, W - 160, (ey + 200) - waterY);
  line([[80, waterY], [W - 80, waterY]], '#00F2FE', 6);

  // Label card
  ctx.font = F(42, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText('माउंट एवरेस्ट: 8,848 M (डूबा हुआ!)', 540, 1050);

  ctx.restore();
}

// ── 4. BLAZING SUN (वर्ड: सूरज की एक भी किरण नहीं पहुँचती) ───────────────────────────
export function drawSunRays(lt, d, t) {
  ctx.fillStyle = '#02050A'; ctx.fillRect(0, 0, W, H);

  hudHeader('SOLAR LIGHT EXTINCTION', 'सूरज की एक भी किरण नहीं पहुँचती', '#FF9900');

  ctx.save();
  const sx = 540, sy = 560;

  // Radiating Solar Flares
  const numRays = 16;
  const pulse = 1 + 0.1 * Math.sin(t * 5);
  for (let i = 0; i < numRays; i++) {
    const ang = (i * TAU) / numRays + t * 0.3;
    const len = (i % 2 === 0 ? 250 : 180) * pulse;
    ctx.strokeStyle = i % 2 === 0 ? '#FFE600' : '#FF6600'; ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(sx + Math.cos(ang) * 120, sy + Math.sin(ang) * 120);
    ctx.lineTo(sx + Math.cos(ang) * len, sy + Math.sin(ang) * len);
    ctx.stroke();
  }

  // Corona Glow
  const glow = ctx.createRadialGradient(sx, sy, 50, sx, sy, 240);
  glow.addColorStop(0, '#FFF5CC'); glow.addColorStop(0.5, '#FFB300'); glow.addColorStop(1, 'rgba(255,80,0,0)');
  ctx.fillStyle = glow;
  ctx.beginPath(); ctx.arc(sx, sy, 240, 0, TAU); ctx.fill();

  // Solid Core
  circle(sx, sy, 115, '#FFE600'); circle(sx, sy, 90, '#FFF8E7');

  // Red "NO LIGHT" Prohibition Stamp
  const banAlpha = clamp((lt - 0.5) / 0.5);
  if (banAlpha > 0) {
    ctx.save(); ctx.globalAlpha = banAlpha;
    ctx.strokeStyle = '#FF3366'; ctx.lineWidth = 18;
    ctx.beginPath(); ctx.arc(sx, sy, 200, 0, TAU); ctx.stroke();
    line([[sx - 140, sy - 140], [sx + 140, sy + 140]], '#FF3366', 18);
    ctx.restore();
  }

  // Label card
  ctx.font = F(42, '900'); ctx.fillStyle = '#FF3366'; ctx.textAlign = 'center';
  ctx.fillText('1,000 M नीचे = 0% सूरज की रोशनी', 540, 960);

  ctx.restore();
}

// ── 5. SUBMARINE WITH DUAL SEARCHLIGHTS (वर्ड: खौफनाक अंधेरा) ─────────────────────────
export function drawSubmarineSearchlight(lt, d, t) {
  ctx.fillStyle = '#000104'; ctx.fillRect(0, 0, W, H);

  hudHeader('DEEP-SEA SUBMERSIBLE // SEARCHLIGHTS', 'खौफनाक अंधेरे में पनडुब्बी', '#00F2FE');

  ctx.save();
  const subX = 540, subY = 640;

  // Dual High-Power Conical Beams
  const sweep = Math.sin(t * 1.6) * 90;
  const beam = ctx.createRadialGradient(subX, subY, 40, subX + sweep, subY + 500, 500);
  beam.addColorStop(0, 'rgba(180, 245, 255, 0.9)');
  beam.addColorStop(0.4, 'rgba(0, 210, 255, 0.4)');
  beam.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(subX - 50, subY + 30);
  ctx.lineTo(subX - 320 + sweep, subY + 520);
  ctx.lineTo(subX + 320 + sweep, subY + 520);
  ctx.lineTo(subX + 50, subY + 30);
  ctx.fill();

  // Submarine Hull (Steel Titanium)
  ctx.fillStyle = '#1A2A3E'; ctx.strokeStyle = '#00F2FE'; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.ellipse(subX, subY, 230, 105, 0, 0, TAU); ctx.fill(); ctx.stroke();
  // Conning Tower
  ctx.fillRect(subX - 45, subY - 145, 90, 50); ctx.strokeRect(subX - 45, subY - 145, 90, 50);
  // Observation Golden Dome Viewport
  circle(subX, subY + 20, 50, '#FFE600'); circle(subX, subY + 20, 36, '#FFF8E7');

  // Searchlight Pods
  circle(subX - 70, subY + 80, 22, '#FFF'); circle(subX + 70, subY + 80, 22, '#FFF');

  // Label card
  ctx.font = F(40, '900'); ctx.fillStyle = '#FFF'; ctx.textAlign = 'center';
  ctx.fillText('अंधेरे को चीरती शक्तिशाली लाइट', 540, 1020);

  ctx.restore();
  marineSnow(t, 45);
}

// ── 6. INDUSTRIAL PRESSURE GAUGE (वर्ड: पानी का दबाव इतना भयंकर) ─────────────────────
export function drawPressureSlam(lt, d, t) {
  ctx.fillStyle = '#060B14'; ctx.fillRect(0, 0, W, H);

  hudHeader('PRESSURE SENSOR // CRITICAL ALERT', 'पानी का भयंकर दबाव', '#FF3366');

  ctx.save();
  const cx = 540, cy = 680, R = 270;

  // Gauge Outer Ring
  ctx.fillStyle = '#111927'; ctx.strokeStyle = '#4FD1E8'; ctx.lineWidth = 14;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill(); ctx.stroke();

  // Red Danger Zone Arc
  ctx.strokeStyle = '#FF3366'; ctx.lineWidth = 28;
  ctx.beginPath(); ctx.arc(cx, cy, R - 26, Math.PI * 0.9, Math.PI * 1.85); ctx.stroke();

  // Dial Ticks
  for (let a = 0; a < TAU; a += Math.PI / 8) {
    const x1 = cx + Math.cos(a) * (R - 35), y1 = cy + Math.sin(a) * (R - 35);
    const x2 = cx + Math.cos(a) * (R - 60), y2 = cy + Math.sin(a) * (R - 60);
    line([[x1, y1], [x2, y2]], a > Math.PI ? '#FF3366' : '#718296', 6);
  }

  // Needle violently slamming into Red Zone
  const shake = rnd(t * 12) * 10 - 5;
  const targetAngle = Math.PI * 1.68 + (shake * Math.PI) / 180;
  ctx.strokeStyle = '#FF3366'; ctx.lineWidth = 14;
  line([[cx, cy], [cx + Math.cos(targetAngle) * (R - 40), cy + Math.sin(targetAngle) * (R - 40)]], '#FF3366', 14);
  circle(cx, cy, 32, '#FFE600');

  // Digital Bar Display
  ctx.font = F(76, '900'); ctx.fillStyle = '#FF3366'; ctx.textAlign = 'center';
  ctx.fillText('1,086 BAR', cx, cy + 110);
  ctx.font = F(38, '800'); ctx.fillStyle = '#FFF';
  ctx.fillText('सामान्य से 1,000 गुना अधिक दबाव!', cx, 1020);

  ctx.restore();
}

// ── 7. 1000 ELEPHANTS (वर्ड: जैसे आपके सिर पर 1000 हाथी खड़े हों) ────────────────────
export function drawElephantWeight(lt, d, t) {
  ctx.fillStyle = '#080205'; ctx.fillRect(0, 0, W, H);

  hudHeader('WEIGHT COMPARISON // 1000 ELEPHANTS', 'सिर पर 1000 हाथियों का वजन', '#FFE600');

  ctx.save();
  const ex = 540, ey = 660, s = 1.35;
  ctx.translate(ex, ey); ctx.scale(s, s);

  // Realistic Elephant Silhouette
  ctx.fillStyle = '#6B7A8F'; ctx.strokeStyle = '#3C4858'; ctx.lineWidth = 6;
  // Body
  ctx.beginPath(); ctx.ellipse(20, 0, 160, 115, 0, 0, TAU); ctx.fill(); ctx.stroke();
  // Head
  ctx.beginPath(); ctx.ellipse(-120, -35, 90, 85, 0, 0, TAU); ctx.fill(); ctx.stroke();
  // Large Ear
  ctx.fillStyle = '#5A687C';
  ctx.beginPath(); ctx.ellipse(-95, -45, 65, 80, 0.2, 0, TAU); ctx.fill(); ctx.stroke();
  // Trunk curving up
  ctx.strokeStyle = '#6B7A8F'; ctx.lineWidth = 36; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-160, -15);
  ctx.quadraticCurveTo(-240, 50, -210, 120);
  ctx.quadraticCurveTo(-190, 155, -165, 130);
  ctx.stroke();
  // White Curved Tusk
  ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 14;
  ctx.beginPath(); ctx.moveTo(-150, -5); ctx.quadraticCurveTo(-195, 35, -180, 75); ctx.stroke();
  // Eye
  circle(-145, -55, 8, '#FFE600'); circle(-145, -55, 4, '#000');
  // Legs
  ctx.fillStyle = '#5A687C';
  ctx.fillRect(-100, 70, 44, 115); ctx.strokeRect(-100, 70, 44, 115);
  ctx.fillRect(-40, 70, 44, 115); ctx.strokeRect(-40, 70, 44, 115);
  ctx.fillRect(40, 70, 44, 115); ctx.strokeRect(40, 70, 44, 115);
  ctx.fillRect(100, 70, 44, 115); ctx.strokeRect(100, 70, 44, 115);

  ctx.restore();

  // Crushing Downward Force Arrows
  const slamY = 880 + Math.sin(t * 8) * 12;
  ctx.fillStyle = '#FF3366'; ctx.strokeStyle = '#FFE600'; ctx.lineWidth = 5;
  for (let x = 200; x <= 880; x += 170) {
    line([[x, 420], [x, 470]], '#FF3366', 14);
  }

  // Label card
  ctx.font = F(52, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText('1,000 हाथियों का भार!', 540, 1020);
}

// ── 8. BIOLUMINESCENT ANGLERFISH (वर्ड: तैरते हुए चमकते जीव मिले) ─────────────────────
export function drawAlienCreature(lt, d, t) {
  ctx.fillStyle = '#010206'; ctx.fillRect(0, 0, W, H);

  hudHeader('BIOLUMINESCENT ANGLERFISH', 'तैरते हुए चमकते जीव मिले', '#00F2FE');

  ctx.save();
  const cx = 540, cy = 680;

  // Glowing Cyan Lantern Bulb on Antenna
  const glowR = 130 + Math.sin(t * 6) * 35;
  const lureG = ctx.createRadialGradient(cx - 170, cy - 200, 10, cx - 170, cy - 200, glowR);
  lureG.addColorStop(0, '#FFFFFF'); lureG.addColorStop(0.3, '#00F2FE'); lureG.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = lureG;
  ctx.beginPath(); ctx.arc(cx - 170, cy - 200, glowR, 0, TAU); ctx.fill();

  // Curved Antenna Stalk
  ctx.strokeStyle = '#00F2FE'; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.moveTo(cx - 40, cy - 70); ctx.quadraticCurveTo(cx - 130, cy - 160, cx - 170, cy - 200); ctx.stroke();

  // Predatory Fish Body
  ctx.fillStyle = '#0F1E2E'; ctx.strokeStyle = 'rgba(0, 242, 254, 0.7)'; ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cx - 110, cy);
  ctx.quadraticCurveTo(cx + 80, cy - 140, cx + 300, cy - 30);
  ctx.lineTo(cx + 390, cy - 100); ctx.lineTo(cx + 340, cy); ctx.lineTo(cx + 390, cy + 100);
  ctx.lineTo(cx + 300, cy + 30);
  ctx.quadraticCurveTo(cx + 60, cy + 160, cx - 110, cy);
  ctx.fill(); ctx.stroke();

  // Sharp Translucent Teeth
  for (let i = 0; i < 7; i++) {
    const tx = cx - 90 + i * 26;
    line([[tx, cy - 25], [tx + 10, cy + 20]], '#FFF', 6);
    line([[tx + 12, cy + 35], [tx + 20, cy - 10]], '#FFF', 6);
  }

  // Glowing Blue Eye
  circle(cx - 20, cy - 40, 18, '#00F2FE'); circle(cx - 20, cy - 40, 7, '#FFF');

  // Label card
  ctx.font = F(42, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText('बायोल्यूमिनिसेंस (जीवित रोशनी)', 540, 1020);

  ctx.restore();
  marineSnow(t, 40);
}

// ── 9. PLASTIC BOTTLE AT 11,000M (वर्ड: इंसानी प्लास्टिक कचरा मिला) ──────────────────
export function drawPlasticDiscovery(lt, d, t) {
  ctx.fillStyle = '#02050A'; ctx.fillRect(0, 0, W, H);

  hudHeader('SHOCKING POLLUTION // 11,000M', 'इंसानी प्लास्टिक कचरा मिला!', '#FF3366');

  ctx.save();
  const bx = 540, by = 680, s = 1.3;
  ctx.translate(bx, by); ctx.scale(s, s);

  // Seafloor Sediment Bed
  ctx.fillStyle = '#141E28'; ctx.beginPath(); ctx.ellipse(0, 70, 320, 90, 0, 0, TAU); ctx.fill();

  // Realistic Plastic Bottle
  ctx.fillStyle = 'rgba(0, 210, 255, 0.45)'; ctx.strokeStyle = '#00F2FE'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.roundRect(-45, -70, 90, 160, 15); ctx.fill(); ctx.stroke();
  // Bottle Neck & Red Cap
  ctx.fillRect(-22, -100, 44, 30); ctx.strokeRect(-22, -100, 44, 30);
  ctx.fillStyle = '#FF3366'; ctx.fillRect(-26, -118, 52, 20);

  // Label Band on Bottle
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)'; ctx.fillRect(-43, -10, 86, 45);
  ctx.font = '900 16px Inter, sans-serif'; ctx.fillStyle = '#000'; ctx.textAlign = 'center';
  ctx.fillText('PLASTIC', 0, 18);

  // Red Prohibition Warning Circle
  ctx.strokeStyle = '#FF3366'; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.arc(0, 0, 135, 0, TAU); ctx.stroke();
  line([[-95, -95], [95, 95]], '#FF3366', 10);

  ctx.restore();

  // Forensic Evidence Marker
  ctx.font = F(42, '900'); ctx.fillStyle = '#FF3366'; ctx.textAlign = 'center';
  ctx.fillText('11,000 मीटर नीचे भी इंसानी गंदगी!', 540, 1020);
}

// ── 10. YOUTUBE SUBSCRIBE & OUTRO (वर्ड: कमेंट में बताएं और सब्सक्राइब करें) ───────────
export function drawOutroCTA(lt, d, t) {
  ctx.fillStyle = '#030814'; ctx.fillRect(0, 0, W, H);

  hudHeader('ANCHOR AADHYA OFFICIAL', 'कमेंट में बताएं और सब्सक्राइब करें!', '#FFE600');

  ctx.save();
  const ox = 540, oy = 660, s = 1.35;
  ctx.translate(ox, oy); ctx.scale(s, s);

  // Red YouTube Button
  ctx.fillStyle = '#FF0000'; ctx.beginPath(); ctx.roundRect(-160, -55, 320, 110, 26); ctx.fill();
  // White Play Arrow
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath(); ctx.moveTo(-20, -32); ctx.lineTo(35, 0); ctx.lineTo(-20, 32); ctx.fill();

  // "SUBSCRIBE" text
  ctx.font = '900 34px Inter, sans-serif'; ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center';
  ctx.fillText('SUBSCRIBE', 0, 105);

  // Golden Ringing Notification Bell
  const ring = Math.sin(t * 12) * 0.25;
  ctx.save(); ctx.translate(130, -55); ctx.rotate(ring);
  ctx.fillStyle = '#FFE600';
  ctx.beginPath(); ctx.arc(0, 0, 24, Math.PI, TAU); ctx.lineTo(26, 20); ctx.lineTo(-26, 20); ctx.fill();
  circle(0, 26, 8, '#FFE600');
  ctx.restore();

  // Comment Bubble above
  ctx.fillStyle = '#00F2FE'; ctx.beginPath(); ctx.roundRect(-140, -180, 280, 85, 20); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-30, -95); ctx.lineTo(0, -70); ctx.lineTo(10, -95); ctx.fill();
  ctx.font = '900 28px Inter, "Noto Sans Devanagari", sans-serif'; ctx.fillStyle = '#000'; ctx.textAlign = 'center';
  ctx.fillText('कमेंट्स में बताओ! ✍️', 0, -135);

  ctx.restore();

  ctx.font = F(38, '900'); ctx.fillStyle = '#FFF'; ctx.textAlign = 'center';
  ctx.fillText('क्या इंसान हर जगह तबाhi मचाएगा?', 540, 1030);
}

// ===================================================================================
// CHERNOBYL 300-SECOND DEATH ROOM (ELEPHANT'S FOOT) SCENES
// ===================================================================================

// ── C1. CHERNOBYL REACTOR NO. 4 // RADIATION HAZARD ────────────────────────────────
export function drawChernobylPlant(lt, d, t) {
  ctx.fillStyle = '#06070B'; ctx.fillRect(0, 0, W, H);

  hudHeader('CHERNOBYL ZONE // REACTOR NO. 4', 'दुनिया का सबसे खतरनाक कमरा', '#FFCC00');

  ctx.save();
  const cx = 540, cy = 680;

  // Giant Glowing Yellow Radiation Trefoil Symbol (☢)
  const pulse = 1 + 0.1 * Math.sin(t * 6);
  ctx.save(); ctx.translate(cx, cy); ctx.scale(pulse, pulse);

  // Outer warning triangle
  ctx.fillStyle = '#FFCC00';
  ctx.beginPath();
  ctx.moveTo(0, -220); ctx.lineTo(210, 160); ctx.lineTo(-210, 160); ctx.closePath();
  ctx.fill(); ctx.strokeStyle = '#000'; ctx.lineWidth = 14; ctx.stroke();

  // Black 3 Radiation Blades
  ctx.fillStyle = '#000000';
  for (let k = 0; k < 3; k++) {
    const a = (k * TAU) / 3 - Math.PI / 2;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 150, a - 0.52, a + 0.52);
    ctx.closePath(); ctx.fill();
  }
  // Center circle cutout
  circle(0, 0, 48, '#FFCC00'); circle(0, 0, 26, '#000000');
  ctx.restore();

  // Toxic green radiation mist
  const mist = ctx.createRadialGradient(cx, cy + 200, 40, cx, cy + 200, 400);
  mist.addColorStop(0, 'rgba(0, 255, 120, 0.3)'); mist.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = mist; ctx.beginPath(); ctx.ellipse(cx, cy + 200, 420, 160, 0, 0, TAU); ctx.fill();

  ctx.font = F(48, '900'); ctx.fillStyle = '#FF3366'; ctx.textAlign = 'center';
  ctx.fillText('LETHAL RADIATION ZONE', cx, 1020);

  ctx.restore();
  marineSnow(t, 25, 'rgba(255, 200, 0, 0.4)');
}

// ── C2. 300-SECOND DEATH COUNTDOWN TIMER ───────────────────────────────────────────
export function drawCountdownTimer(lt, d, t) {
  ctx.fillStyle = '#080004'; ctx.fillRect(0, 0, W, H);

  hudHeader('TIME TO LETHAL DOSE // COUNTDOWN', 'सिर्फ 300 सेकंड में मौत तय!', '#FF3366');

  ctx.save();
  const cx = 540, cy = 680;

  // Heavy Red Digital Clock Display Box
  ctx.fillStyle = '#180208'; ctx.strokeStyle = '#FF3366'; ctx.lineWidth = 10;
  ctx.beginPath(); ctx.roundRect(140, cy - 180, 800, 260, 32); ctx.fill(); ctx.stroke();

  // Large Red Glowing Digital Text
  const shake = rnd(t * 14) * 8 - 4;
  const secs = Math.max(0, Math.round(300 - (lt / d) * 15));
  ctx.font = F(140, '900'); ctx.fillStyle = '#FF1744'; ctx.textAlign = 'center';
  ctx.fillText(`${secs}s`, cx + shake, cy + 8);

  // Skull death indicator
  ctx.font = F(42, '900'); ctx.fillStyle = '#FFE600';
  ctx.fillText('300 सेकंड = 100% FATAL DOSE', cx, cy + 170);

  // Flashing Emergency Beacon Lights
  const strobe = Math.sin(t * 12) > 0;
  circle(180, cy - 180, 26, strobe ? '#FF1744' : '#550011');
  circle(W - 180, cy - 180, 26, strobe ? '#FF1744' : '#550011');

  ctx.font = F(40, '900'); ctx.fillStyle = '#FFF';
  ctx.fillText('इतने समय में शरीर के अंग फेल!', cx, 1020);

  ctx.restore();
}

// ── C3. NUCLEAR REACTOR FIREBALL EXPLOSION (1986) ──────────────────────────────────
export function drawReactorExplosion(lt, d, t) {
  ctx.fillStyle = '#0F0302'; ctx.fillRect(0, 0, W, H);

  hudHeader('HISTORICAL DISASTER // APRIL 1986', 'चेरनोबिल रिएक्टर में भयानक विस्फोट', '#FF5500');

  ctx.save();
  const cx = 540, cy = 680;

  // Expanding Fireball Core
  const boom = eo(clamp(lt / 0.4));
  const R = lerp(80, 320, boom);
  const fire = ctx.createRadialGradient(cx, cy, 30, cx, cy, R);
  fire.addColorStop(0, '#FFFFFF');
  fire.addColorStop(0.25, '#FFE600');
  fire.addColorStop(0.65, '#FF3300');
  fire.addColorStop(1, 'rgba(50, 0, 0, 0)');
  ctx.fillStyle = fire;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill();

  // Flying Debris particles
  ctx.fillStyle = '#FFCC00';
  for (let i = 0; i < 20; i++) {
    const a = (i * TAU) / 20;
    const dist = (R + 60) * (0.8 + rnd(i) * 0.4);
    circle(cx + Math.cos(a) * dist, cy + Math.sin(a) * dist, 8 + rnd(i) * 12, '#FF5500');
  }

  // Broken Reactor Concrete Silhouette
  ctx.fillStyle = '#1A1A1A'; ctx.strokeStyle = '#FF3300'; ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(160, 950); ctx.lineTo(260, 780); ctx.lineTo(340, 840);
  ctx.lineTo(440, 720); ctx.lineTo(540, 800); ctx.lineTo(660, 700);
  ctx.lineTo(760, 850); ctx.lineTo(920, 950); ctx.lineTo(160, 950);
  ctx.fill(); ctx.stroke();

  ctx.font = F(44, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText('26 अप्रैल 1986 // इतिहास का काला दिन', cx, 1020);

  ctx.restore();
}

// ── C4. CORIUM LAVA FLOWING (पिघला हुआ परमाणु लावा) ─────────────────────────────────
export function drawCoriumLavaFlow(lt, d, t) {
  ctx.fillStyle = '#050204'; ctx.fillRect(0, 0, W, H);

  hudHeader('MOLTEN CORIUM LAVA // BASEMENT', 'पिघला हुआ रेडियोएक्टिव लावा', '#FF6600');

  ctx.save();
  const cx = 540, cy = 660;

  // Broken Concrete & Steel Pipes in Basement
  ctx.fillStyle = '#222'; ctx.strokeStyle = '#555'; ctx.lineWidth = 12;
  // Large vertical pipe dripping lava
  ctx.fillRect(480, 270, 120, 240); ctx.strokeRect(480, 270, 120, 240);

  // Viscous Glowing Corium Magma Dripping Down
  const dripY = lerp(510, 850, (t * 1.5) % 1);
  const lava = ctx.createLinearGradient(cx - 80, 480, cx + 80, 880);
  lava.addColorStop(0, '#FFE600'); lava.addColorStop(0.5, '#FF3300'); lava.addColorStop(1, '#660000');
  ctx.fillStyle = lava;

  // Molten stream
  ctx.beginPath();
  ctx.moveTo(500, 500);
  ctx.quadraticCurveTo(cx - 30, 650, 510, 820);
  ctx.lineTo(570, 820);
  ctx.quadraticCurveTo(cx + 40, 650, 580, 500);
  ctx.fill();

  // Spreading Lava Pool on Basement Floor
  ctx.fillStyle = '#FF3300';
  ctx.beginPath(); ctx.ellipse(cx, 840, 360, 95, 0, 0, TAU); ctx.fill();
  circle(cx, 840, 65, '#FFE600');

  ctx.font = F(42, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText('पिघला हुआ यूरेनियम और ग्रेफाइट', cx, 1020);

  ctx.restore();
}

// ── C5. THE ELEPHANT'S FOOT MONSTER (हाथी का पैर) ──────────────────────────────────
export function drawElephantsFoot(lt, d, t) {
  ctx.fillStyle = '#020306'; ctx.fillRect(0, 0, W, H);

  hudHeader("THE ELEPHANT'S FOOT // DEADLIEST OBJECT", 'हाथी का पैर: 2 मीटर चौड़ा लावा राक्षस', '#FF3366');

  ctx.save();
  const cx = 540, cy = 660;

  // Harsh Forensic Spotlight Beam focused on the monster
  const spot = ctx.createRadialGradient(cx, cy, 40, cx, cy, 380);
  spot.addColorStop(0, 'rgba(255, 230, 180, 0.9)');
  spot.addColorStop(0.4, 'rgba(255, 120, 0, 0.4)');
  spot.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = spot;
  ctx.beginPath(); ctx.ellipse(cx, cy + 40, 420, 240, 0, 0, TAU); ctx.fill();

  // The Wrinkled Massive Lava Mass ("Elephant's Foot")
  ctx.fillStyle = '#2C272B'; ctx.strokeStyle = '#FF3300'; ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(cx - 260, cy + 80);
  ctx.quadraticCurveTo(cx - 240, cy - 120, cx - 120, cy - 180);
  ctx.quadraticCurveTo(cx, cy - 220, cx + 130, cy - 160);
  ctx.quadraticCurveTo(cx + 250, cy - 90, cx + 270, cy + 80);
  ctx.quadraticCurveTo(cx + 180, cy + 180, cx, cy + 190);
  ctx.quadraticCurveTo(cx - 190, cy + 180, cx - 260, cy + 80);
  ctx.fill(); ctx.stroke();

  // Lava wrinkles and glowing ember folds
  ctx.strokeStyle = '#FF5500'; ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(cx - 180, cy - 40); ctx.quadraticCurveTo(cx - 80, cy + 40, cx, cy + 20);
  ctx.moveTo(cx - 100, cy - 110); ctx.quadraticCurveTo(cx, cy - 60, cx + 120, cy - 70);
  ctx.moveTo(cx - 40, cy + 60); ctx.quadraticCurveTo(cx + 80, cy + 120, cx + 180, cy + 60);
  ctx.stroke();

  // Toxic green radiation spores drifting
  circle(cx - 70, cy - 50, 12, '#FFE600');
  circle(cx + 90, cy + 20, 14, '#FF3366');

  ctx.font = F(46, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText("हाथी का पैर (ELEPHANT'S FOOT)", cx, 1020);

  ctx.restore();
}

// ── C6. GEIGER COUNTER MAX RADIATION (10,000 ROENTGENS/HR) ─────────────────────────
export function drawGeigerCounter(lt, d, t) {
  ctx.fillStyle = '#05070C'; ctx.fillRect(0, 0, W, H);

  hudHeader('GEIGER COUNTER // MAXIMUM SCALE', 'रेडिएशन मीटर की सुई टूट गई!', '#FF3366');

  ctx.save();
  const cx = 540, cy = 680, R = 270;

  // Industrial Meter Dial
  ctx.fillStyle = '#121A24'; ctx.strokeStyle = '#FFE600'; ctx.lineWidth = 14;
  ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.fill(); ctx.stroke();

  // Red Danger Arc
  ctx.strokeStyle = '#FF1744'; ctx.lineWidth = 26;
  ctx.beginPath(); ctx.arc(cx, cy, R - 24, Math.PI * 0.9, Math.PI * 1.85); ctx.stroke();

  // Ticks
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

  // Readout
  ctx.font = F(72, '900'); ctx.fillStyle = '#FF1744'; ctx.textAlign = 'center';
  ctx.fillText('10,000 R/HR', cx, cy + 110);
  ctx.font = F(36, '800'); ctx.fillStyle = '#FFF';
  ctx.fillText('जानलेवा खुराक से 10,000 गुना ज्यादा!', cx, 1020);

  ctx.restore();
}

// ── C7. MELTING CAMERAS & ROBOTS ──────────────────────────────────────────────────
export function drawMeltingCameraRobot(lt, d, t) {
  ctx.fillStyle = '#060608'; ctx.fillRect(0, 0, W, H);

  hudHeader('EQUIPMENT FAILURE // RADIATION BURNOUT', 'कैमरे और रोबोट्स पिघल गए!', '#FFCC00');

  ctx.save();
  const cx = 540, cy = 680;

  // Mechanical Camera Box on Tripod
  ctx.fillStyle = '#222B35'; ctx.strokeStyle = '#FFCC00'; ctx.lineWidth = 7;
  ctx.beginPath(); ctx.roundRect(cx - 150, cy - 120, 300, 200, 18); ctx.fill(); ctx.stroke();
  // Lens
  circle(cx, cy - 20, 65, '#0F1720');
  ctx.strokeStyle = '#00F2FE'; ctx.lineWidth = 6;
  ctx.beginPath(); ctx.arc(cx, cy - 20, 65, 0, TAU); ctx.stroke();
  circle(cx, cy - 20, 35, '#FFE600');

  // Melting drips dripping from camera
  ctx.fillStyle = '#FF5500';
  for (let i = -100; i <= 100; i += 40) {
    const dripLen = 50 + rnd(i + t) * 70;
    line([[cx + i, cy + 80], [cx + i, cy + 80 + dripLen]], '#FF5500', 8);
  }

  // Radiation static noise lines cutting across screen (Gamma ray snow)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  for (let k = 0; k < 12; k++) {
    const ry = cy - 200 + rnd(k + t * 5) * 400;
    ctx.fillRect(80, ry, W - 160, 4 + rnd(k) * 6);
  }

  ctx.font = F(42, '900'); ctx.fillStyle = '#FF3366'; ctx.textAlign = 'center';
  ctx.fillText('गामा किरणों ने कैमरों की रील जला दी!', cx, 1020);

  ctx.restore();
}

// ── C8. RADIOTROPHIC BLACK FUNGUS (काला फंगस) ──────────────────────────────────────
export function drawRadiotrophicFungus(lt, d, t) {
  ctx.fillStyle = '#020408'; ctx.fillRect(0, 0, W, H);

  hudHeader('RADIOTROPHIC FUNGUS // NATURE WINS', 'रेडिएशन खाकर उगता काला फंगस!', '#00FF99');

  ctx.save();
  const cx = 540, cy = 680;

  // Petri Dish / Microscopic Glowing Circle
  ctx.fillStyle = '#0A141E'; ctx.strokeStyle = '#00FF99'; ctx.lineWidth = 12;
  circle(cx, cy, 270, '#0A141E');
  ctx.stroke();

  // Spreading Black Fungus Colony
  ctx.fillStyle = '#000000'; ctx.strokeStyle = '#00FF99'; ctx.lineWidth = 5;
  for (let i = 0; i < 9; i++) {
    const fa = (i * TAU) / 9;
    const fx = cx + Math.cos(fa) * 90, fy = cy + Math.sin(fa) * 90;
    const fr = 55 + Math.sin(t * 3 + i) * 15;
    ctx.beginPath(); ctx.arc(fx, fy, fr, 0, TAU); ctx.fill(); ctx.stroke();
  }
  circle(cx, cy, 75, '#000000'); ctx.stroke();

  // Melanin energy absorption rays (green/yellow glowing dots)
  for (let k = 0; k < 20; k++) {
    const a = (k * TAU) / 20;
    const r = 210 + Math.sin(t * 5 + k) * 20;
    circle(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 8, '#00FF99');
  }

  ctx.font = F(44, '900'); ctx.fillStyle = '#FFE600'; ctx.textAlign = 'center';
  ctx.fillText('रेडिएशन को भोजन बनाने वाला फंगस!', cx, 1020);

  ctx.restore();
}

// ── C9. CHERNOBYL OUTRO CTA ───────────────────────────────────────────────────────
export function drawChernobylOutro(lt, d, t) {
  ctx.fillStyle = '#040710'; ctx.fillRect(0, 0, W, H);

  hudHeader('ANCHOR AADHYA OFFICIAL', 'कमेंट में बताएं और सब्सक्राइब करें!', '#FFE600');

  ctx.save();
  const ox = 540, oy = 660, s = 1.35;
  ctx.translate(ox, oy); ctx.scale(s, s);

  // Red YouTube Button
  ctx.fillStyle = '#FF0000'; ctx.beginPath(); ctx.roundRect(-160, -55, 320, 110, 26); ctx.fill();
  // White Play Arrow
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath(); ctx.moveTo(-20, -32); ctx.lineTo(35, 0); ctx.lineTo(-20, 32); ctx.fill();

  ctx.font = '900 34px Inter, sans-serif'; ctx.fillStyle = '#FFFFFF'; ctx.textAlign = 'center';
  ctx.fillText('SUBSCRIBE', 0, 105);

  // Golden Bell Ringing
  const ring = Math.sin(t * 12) * 0.25;
  ctx.save(); ctx.translate(130, -55); ctx.rotate(ring);
  ctx.fillStyle = '#FFE600';
  ctx.beginPath(); ctx.arc(0, 0, 24, Math.PI, TAU); ctx.lineTo(26, 20); ctx.lineTo(-26, 20); ctx.fill();
  circle(0, 26, 8, '#FFE600');
  ctx.restore();

  // Comment Bubble
  ctx.fillStyle = '#00F2FE'; ctx.beginPath(); ctx.roundRect(-150, -180, 300, 85, 20); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-30, -95); ctx.lineTo(0, -70); ctx.lineTo(10, -95); ctx.fill();
  ctx.font = '900 28px Inter, "Noto Sans Devanagari", sans-serif'; ctx.fillStyle = '#000'; ctx.textAlign = 'center';
  ctx.fillText('क्या प्रकृति इंसान से बड़ी है? ✍️', 0, -135);

  ctx.restore();

  ctx.font = F(38, '900'); ctx.fillStyle = '#FFF'; ctx.textAlign = 'center';
  ctx.fillText('Anchor Aadhya को अभी सब्सक्राइब करें!', 540, 1030);
}

