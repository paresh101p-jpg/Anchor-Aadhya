// REAL 2D SCENE LIBRARY: every topic gets drawings of the actual subject, never abstract filler.
// All scenes are plain canvas code (zero external image API). Captions are drawn separately by main.js.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, circle, ell, line, rr, bigText, fillAll, rnd, TAU } from './core/lib.js';
import * as K from './core/kit.js';

const F = (s) => `900 ${s}px Inter, "Noto Sans Devanagari", "Mangal", sans-serif`;

function label(text, x, y, size = 52, fg = C.white, bg = C.ink) {
  ctx.save();
  ctx.font = F(size); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(text).width + size * 0.9;
  ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(x - w / 2, y - size * 0.72, w, size * 1.44, size * 0.36); ctx.fill();
  ctx.fillStyle = fg; ctx.fillText(text, x, y);
  ctx.restore();
}

function arrow(x1, y1, x2, y2, color = C.red, w = 16) {
  line([[x1, y1], [x2, y2]], color, w);
  const a = Math.atan2(y2 - y1, x2 - x1), h = w * 2.6;
  ctx.save(); ctx.translate(x2, y2); ctx.rotate(a);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-h, -h * 0.62); ctx.lineTo(-h, h * 0.62); ctx.closePath();
  ctx.fillStyle = color; ctx.fill(); ctx.restore();
}

function room(flip = 0) {
  ctx.save();
  ctx.translate(W / 2, H / 2); ctx.rotate(flip * Math.PI); ctx.translate(-W / 2, -H / 2);
  fillAll('#EDE6D8');
  ctx.fillStyle = C.navy; ctx.fillRect(0, 0, W, 250);          // ceiling
  ctx.fillStyle = '#D8CDBB'; ctx.fillRect(0, 250, W, 80);      // cornice
  ctx.fillStyle = '#C9E4F2'; ctx.fillRect(730, 430, 260, 330); // window
  ctx.strokeStyle = C.navy; ctx.lineWidth = 18; ctx.strokeRect(730, 430, 260, 330);
  line([[860, 430], [860, 760]], C.navy, 12); line([[730, 595], [990, 595]], C.navy, 12);
  ctx.fillStyle = C.floor; ctx.fillRect(0, 1500, W, 420);      // floor
  line([[0, 1500], [W, 1500]], '#C7BCA6', 10);
  ctx.restore();
}

function fan(flip = 0, spin = 0) {
  ctx.save(); ctx.translate(W / 2, 250); ctx.rotate(flip * Math.PI);
  ctx.fillStyle = C.ink; ctx.fillRect(-14, 0, 28, 90);
  ctx.translate(0, 96); ctx.rotate(spin);
  for (let k = 0; k < 3; k++) {
    ctx.save(); ctx.rotate(k * TAU / 3);
    ctx.fillStyle = '#8B95A6'; ctx.beginPath(); ctx.ellipse(0, -110, 34, 110, 0, 0, TAU); ctx.fill();
    ctx.restore();
  }
  circle(0, 0, 26, C.ink); ctx.restore();
}

function bat(x, y, s, flip = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); if (flip) ctx.rotate(Math.PI);
  // wings
  ctx.fillStyle = '#5B3B6E';
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-210, -60, -250, 60); ctx.quadraticCurveTo(-150, 110, -70, 55);
  ctx.quadraticCurveTo(-30, 90, 0, 60); ctx.quadraticCurveTo(30, 90, 70, 55);
  ctx.quadraticCurveTo(150, 110, 250, 60); ctx.quadraticCurveTo(210, -60, 0, 0); ctx.fill();
  ell(0, 40, 62, 92, '#6B4780');              // body
  circle(-22, -8, 13, C.yellow); circle(22, -8, 13, C.yellow); // eyes
  ctx.fillStyle = '#6B4780';
  ctx.beginPath(); ctx.moveTo(-40, -60); ctx.lineTo(-30, -120); ctx.lineTo(-6, -66); ctx.fill();
  ctx.beginPath(); ctx.moveTo(40, -60); ctx.lineTo(30, -120); ctx.lineTo(6, -66); ctx.fill();
  ctx.restore();
}

function person(x, y, s, flip = 0, arm = K.ARM.down) {
  ctx.save(); ctx.translate(x, y); if (flip) ctx.rotate(Math.PI);
  K.man({ x: 0, y: 0, s, arm, eyes: 'wide', mouth: 'o', brow: 1 });
  ctx.restore();
}

function lungs(x, y, s, press = 0) {
  ell(x - 80 * s, y, 105 * s, 135 * s, '#D9667C'); ell(x + 80 * s, y, 105 * s, 135 * s, '#D9667C');
  line([[x, y - 120 * s], [x, y + 130 * s]], C.pinkDark, 16 * s);
  if (press > 0) {
    ctx.globalAlpha = 0.5 + 0.4 * Math.sin(press * 8);
    ell(x - 80 * s, y, 105 * s, 135 * s, C.red); ell(x + 80 * s, y, 105 * s, 135 * s, C.red);
    ctx.globalAlpha = 1;
  }
}

function gutPile(x, y, s, t) {
  for (let k = 0; k < 6; k++) {
    const px = x + (k - 2.5) * 70 * s + Math.sin(t * 2 + k) * 8;
    ell(px, y + Math.sin(k) * 26 * s, 62 * s, 44 * s, k % 2 ? '#E28B9B' : '#D46D84');
  }
}

function tooth(x, y, s, holes = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = C.gum;
  ctx.beginPath(); ctx.moveTo(-115, -150); ctx.quadraticCurveTo(-150, -180, -140, -100);
  ctx.lineTo(-125, 90); ctx.quadraticCurveTo(-70, 190, 0, 180); ctx.quadraticCurveTo(70, 190, 125, 90);
  ctx.lineTo(140, -100); ctx.quadraticCurveTo(150, -180, 115, -150);
  ctx.quadraticCurveTo(0, -205, -115, -150); ctx.fill();
  ctx.strokeStyle = C.gumEdge; ctx.lineWidth = 10; ctx.stroke();
  for (let k = 0; k < holes; k++) circle(-60 + k * 60, -20 + (k % 2) * 45, 20, '#7A3A2A');
  ctx.restore();
}

function bacteria(x, y, s, t, n = 5) {
  for (let k = 0; k < n; k++) {
    const bx = x + Math.sin(t * 1.7 + k * 2) * 110 * s + (k % 3 - 1) * 60 * s;
    const by = y + Math.cos(t * 1.3 + k * 3) * 90 * s + (k % 2) * 70 * s;
    ctx.save(); ctx.translate(bx, by); ctx.rotate(t + k);
    ell(0, 0, 34 * s, 17 * s, '#7CB342');
    line([[-30 * s, 0], [-58 * s, -18 * s]], '#5D8A2E', 5 * s);
    line([[30 * s, 0], [58 * s, 18 * s]], '#5D8A2E', 5 * s);
    ctx.restore();
  }
}

function brain(x, y, s, t) {
  ell(x, y, 190 * s, 150 * s, '#E88DA0');
  for (let k = 0; k < 8; k++) {
    const a = k / 8 * TAU;
    line([[x, y], [x + Math.cos(a + Math.sin(t + k) * 0.2) * 170 * s, y + Math.sin(a) * 135 * s]], C.pinkDark, 12 * s);
  }
  ell(x - 55 * s, y - 40 * s, 60 * s, 40 * s, C.pinkLight);
}

function ear(x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.strokeStyle = C.skinShade; ctx.lineWidth = 34; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.arc(0, 40, 170, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
  ctx.beginPath(); ctx.arc(0, 40, 100, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
  circle(0, 30, 46, '#C9847A');
  ctx.restore();
}

function bug(x, y, s, t) {
  ctx.save(); ctx.translate(x + Math.sin(t * 3) * 6, y); ctx.scale(s, s);
  ell(0, 0, 30, 46, C.ink); circle(0, -42, 22, C.ink);
  for (let k = -1; k <= 1; k += 2) for (let j = 0; j < 3; j++) {
    line([[k * 22, -10 + j * 22], [k * 72, -34 + j * 30]], C.ink, 7);
  }
  ctx.restore();
}

function phone(x, y, s, bars = 3, off = false) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-75, -130, 150, 260, 22); ctx.fillStyle = off ? '#7A8290' : C.navy; ctx.fill();
  rr(-62, -112, 124, 210, 14); ctx.fillStyle = off ? '#3A4250' : '#DCEEF5'; ctx.fill();
  if (!off) for (let k = 0; k < bars; k++) ctx.fillRect(-50 + k * 30, 60 - k * 22, 20, 22 + k * 22);
  ctx.restore();
}

function plane(x, y, s, t) {
  ctx.save(); ctx.translate(x, y + Math.sin(t * 2) * 12); ctx.scale(s, s);
  ctx.fillStyle = C.white;
  ctx.beginPath(); ctx.moveTo(-210, 0); ctx.lineTo(120, -28); ctx.lineTo(210, 0); ctx.lineTo(120, 28); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-20, -10); ctx.lineTo(-110, -150); ctx.lineTo(-40, -150); ctx.lineTo(70, -20); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-20, 10); ctx.lineTo(-110, 150); ctx.lineTo(-40, 150); ctx.lineTo(70, 20); ctx.fill();
  ctx.strokeStyle = C.ink; ctx.lineWidth = 8; ctx.stroke();
  ctx.restore();
}

function bladder(x, y, s, fill = 0.5) {
  ell(x, y, 175 * s, 145 * s, '#E7A7B4');
  ctx.save(); ctx.beginPath(); ctx.ellipse(x, y, 175 * s, 145 * s, 0, 0, TAU); ctx.clip();
  ctx.fillStyle = '#F6D96B'; ctx.fillRect(x - 180 * s, y + 145 * s - 290 * s * fill, 360 * s, 290 * s * fill);
  ctx.restore();
  ell(x, y, 175 * s, 145 * s, 'rgba(0,0,0,0)');
  ctx.strokeStyle = C.pinkDark; ctx.lineWidth = 10 * s;
  ctx.beginPath(); ctx.ellipse(x, y, 175 * s, 145 * s, 0, 0, TAU); ctx.stroke();
}

function kidney(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(0, -90); ctx.bezierCurveTo(110, -110, 140, 30, 60, 100);
  ctx.bezierCurveTo(0, 150, -90, 90, -80, 0); ctx.bezierCurveTo(-75, -60, -40, -85, 0, -90);
  ctx.fillStyle = '#A8455C'; ctx.fill(); ctx.restore();
}

function sceneBase(title, sub, color = C.yellow) {
  fillAll(C.bg);
  ctx.globalAlpha = 0.12; circle(540, 700, 440, color); ctx.globalAlpha = 1;
  label(title, 540, 240, 66, C.white, C.ink);
  if (sub) label(sub, 540, 330, 42, C.navy, C.white);
}

// ─────────────────────────── TOPIC SCENES ───────────────────────────

function upsideDown(i, l, t, lt, d) {
  const flip = clamp(lt / Math.max(0.6, d * 0.35));
  if (i === 0) {
    room(0); fan(0, t * 3);
    bat(540, 520, 0.85, 0);          // bat hanging normally
    label('चमगादड़: आसान', 250, 1180, 48, C.white, '#5B3B6E');
    label('इंसान?', 830, 1180, 48, C.white, C.red);
    person(830, 900, 0.62, 0);
  } else if (i >= 2) {
    room(flip); fan(flip, t * 4);
    person(540, 620 + flip * 40, 0.82, flip);
    if (flip > 0.4) {
      gutPile(540, 700, 1.0, t);
      lungs(540, 880, 1.0, flip);
      arrow(540, 640, 540, 820, C.red, 18);
      label('पेट + लीवर फेफड़ों पर', 540, 1080, 46, C.white, C.red);
    }
    if (i >= 5) K.warning(540, 1250, 1.1 + 0.05 * Math.sin(t * 7));
  } else {
    room(0); bat(540, 520, 0.9, 0); person(540, 1000, 0.7, 0);
    arrow(540, 400, 540, 700, C.cyan, 16);
  }
}

function holdingSneeze(i, l, t, lt, d) {
  sceneBase('छींक', '160 km/h तूफानी हवा', C.cyan);
  const face = () => {
    ctx.save(); ctx.translate(540, 760);
    ell(0, 0, 250, 300, C.skin);
    ell(-95, -50, 38, 46, C.white); ell(95, -50, 38, 46, C.white);
    circle(-95, -50, 16, C.ink); circle(95, -50, 16, C.ink);
    ell(0, 110, 95, 70, C.skinShade);
    circle(-45, 110, 16, '#B4786A'); circle(45, 110, 16, '#B4786A');
    ell(0, 235, 120, 48, C.mouth);
    ctx.restore();
  };
  face();
  if (i === 0) { K.shockLines(540, 760, 340, 0.7); }
  else if (i === 1) {
    for (let k = 0; k < 9; k++) K.speedLines(540 + k * 4, 1020 + k * 26, 0.9);
    label('160 km/h', 540, 1180, 66, C.white, C.red);
  } else if (i >= 2 && i <= 5) {
    ctx.save(); ctx.translate(540, 930); ctx.rotate(-0.35);
    ell(0, 0, 190, 95, C.skin); for (let k = -2; k <= 2; k++) line([[k * 60, -60], [k * 62, 60]], C.skinShade, 12);
    ctx.restore();
    K.redX(540, 930, 1.3, 0.9);
    K.warning(540, 1250, 1.1 + 0.04 * Math.sin(t * 8));
  } else {
    arrow(540, 1180, 540, 1350, C.red, 20);
    label('दबाव शरीर में', 540, 1420, 48, C.white, C.red);
  }
}

function gumSwallow(i, l, t, lt, d) {
  sceneBase('चुइंगम', '7 साल वाला मिथक', C.pink);
  person(540, 820, 0.72, 0);
  const gy = 480 + Math.min(1, lt / Math.max(0.6, d)) * 320;
  K.gum(540, gy, 1.0, 0.2);
  if (i >= 2 && i <= 6) { K.stomach(540, 1320, 1.0, 0.3 + 0.2 * Math.sin(t * 4)); label('पेट का एसिड', 540, 1500, 46, C.white, C.red); }
  if (i >= 7) { K.gutTube(1330, t); K.gum(540 + Math.sin(t * 2) * 160, 1330, 0.6, 0.4); label('2-3 दिन में बाहर', 540, 1130, 46, C.white, '#3A7BD5'); }
  if (i === 6) { label('7 साल? झूठ!', 540, 1150, 62, C.white, C.red); K.redX(540, 1150, 1.1, 0.8); }
}

function water7(i, l, t, lt, d) {
  sceneBase('पानी के बिना 7 दिन', 'शरीर धीरे-धीरे बंद', C.cyan);
  person(540, 790, 0.75, 0);
  kidney(360, 1180, 0.7); kidney(720, 1180, 0.7);
  for (let k = 0; k < 7; k++) {
    const on = k <= Math.min(6, i);
    circle(180 + k * 120, 260, 32, on ? C.cyan : '#B9C4CC');
    ctx.font = F(30); ctx.fillStyle = C.navy; ctx.textAlign = 'center'; ctx.fillText(String(k + 1), 180 + k * 120, 266);
  }
  if (i >= 3) { K.warning(540, 1450, 1.0); label('किडनी बंद', 540, 1520, 42, C.white, C.red); }
  else for (let k = 0; k < 4; k++) ell(830 + k * 30, 460 + k * 70, 20, 28, C.cyan);
}

function brainSleep(i, l, t, lt, d) {
  sceneBase('नींद में दिमाग', 'जागने से भी ज्यादा सक्रिय', C.pink);
  ctx.save(); ctx.translate(540, 780);
  ell(0, 0, 300, 330, C.skin);
  brain(0, 0, 0.95, t);
  ctx.restore();
  for (let k = 0; k < 6; k++) {
    const a = k / 6 * TAU + t * 0.4;
    circle(540 + Math.cos(a) * 330, 780 + Math.sin(a) * 350, 15 + 6 * Math.sin(t * 3 + k), C.cyan);
  }
  if (i >= 3) label('CSF तरल धुलाई', 540, 1300, 48, C.white, '#3A7BD5');
  if (i >= 5) K.burst(540, 1420, 1.4, 0.8);
}

function airplaneMode(i, l, t, lt, d) {
  fillAll(C.sky);
  label('एयरप्लेन मोड', 'सिग्नल क्यों बंद?', C.navy);
  plane(540, 560, 1.05, t);
  phone(830, 1180, 1.0, i < 2 ? 4 : 0, i >= 2);
  for (let k = 0; k < 3; k++) {
    const x = 170 + k * 200;
    line([[x, 1450], [x, 1100]], C.navy, 14);
    line([[x, 1100], [x, 980]], C.navy, 14);
    circle(x, 1450, 18, C.navy);
    if (i < 2) for (let r = 1; r <= 3; r++) ctx.strokeStyle = C.cyan, ctx.lineWidth = 10, ctx.beginPath(), ctx.arc(x, 1450, r * 90, Math.PI * 1.15, Math.PI * 1.85), ctx.stroke();
  }
  if (i >= 2) { K.redX(830, 1180, 1.3, 0.9); label('टावर खोज बंद', 540, 1650, 44, C.white, C.red); }
  else label('फोन टावर ढूंढ रहा', 540, 1650, 44, C.white, C.ink);
}

function bugInEar(i, l, t, lt, d) {
  sceneBase('कान में कीड़ा', 'तीली मत डालो', C.yellow);
  ear(540, 760, 1.35, t);
  bug(540, 780, 1.1, t);
  if (i >= 1 && i <= 4) {
    ctx.save(); ctx.translate(540, 780); ctx.rotate(0.5);
    rr(-14, -520, 28, 520, 12); ctx.fillStyle = '#C8A06A'; ctx.fill();
    ctx.restore();
    K.redX(540, 780, 1.7, 0.9);
  }
  if (i >= 4) { ctx.strokeStyle = C.red; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(430, 780); ctx.lineTo(650, 780); ctx.stroke(); label('कान पर्दा डैमेज', 540, 1300, 46, C.white, C.red); }
  if (i >= 6) { K.shockLines(540, 780, 300, 0.8); label('हमेशा के लिए बहरा', 540, 1450, 50, C.white, C.red); }
}

function tattooLymph(i, l, t, lt, d) {
  sceneBase('टैटू की स्याही', 'शरीर इसे हमला समझता है', C.pink);
  ctx.fillStyle = C.skin; ctx.fillRect(120, 560, 840, 420);
  ctx.fillStyle = C.skinShade; ctx.fillRect(120, 870, 840, 110);
  tooth(820, 720, 0.5, 0);
  // needle
  ctx.save(); ctx.translate(540, 400 + Math.sin(t * 6) * 20);
  rr(-16, 0, 32, 250, 8); ctx.fillStyle = '#A9B4C2'; ctx.fill();
  ctx.fillStyle = C.ink; ctx.beginPath(); ctx.moveTo(-12, 250); ctx.lineTo(12, 250); ctx.lineTo(0, 330); ctx.fill();
  ctx.restore();
  if (i >= 2) {
    for (let k = 0; k < 7; k++) circle(360 + k * 60, 700 + Math.sin(k) * 40, 22, C.ink);
    for (let k = 0; k < 5; k++) {
      const x = 320 + k * 120 + Math.sin(t * 2 + k) * 12;
      ell(x, 1120 + Math.cos(t * 2 + k) * 20, 58, 44, '#7CB342');
      circle(x + 12, 1120, 18, C.ink);
      label('मैक्रोफेज', x, 1230, 32, C.white, '#5D8A2E');
    }
  }
}

function urineRisk(i, l, t, lt, d) {
  sceneBase('पेशाब रोकना', 'ब्लैडर पर दबाव', C.yellow);
  kidney(340, 560, 0.7); kidney(740, 560, 0.7);
  line([[340, 660], [460, 900]], C.pinkDark, 20); line([[740, 660], [620, 900]], C.pinkDark, 20);
  bladder(540, 1100, 1.0, clamp(0.25 + i * 0.1, 0.2, 1));
  if (i >= 3) { K.warning(540, 1450, 1.1 + 0.05 * Math.sin(t * 7)); label('फटने का खतरा', 540, 1540, 44, C.white, C.red); }
}

function cavity(i, l, t, lt, d) {
  sceneBase('दांत में कीड़ा?', 'असली रहस्य: बैक्टीरिया', C.yellow);
  tooth(540, 760, 1.25, i >= 3 ? 3 : 0);
  bacteria(540, 1100, 1.0, t, 6);
  if (i >= 2 && i <= 4) for (let k = 0; k < 8; k++) circle(300 + k * 70, 980 + Math.sin(k) * 40, 20, C.yellow);
  if (i >= 4) { K.warning(540, 1440, 1.05); label('एसिड से छेद', 540, 1530, 44, C.white, C.red); }
  if (i === 1) { K.redX(540, 760, 1.4, 0.85); label('कोई कीड़ा नहीं!', 540, 1320, 50, C.white, C.red); }
}

const SCENES = {
  gum_swallow: gumSwallow, holding_sneeze: holdingSneeze, water_7days: water7,
  brain_sleep: brainSleep, airplane_mode: airplaneMode, bug_in_ear: bugInEar,
  tattoo_ink_lymph: tattooLymph, holding_urine_risk: urineRisk,
  upside_down_hang: upsideDown, tooth_cavity_acid: cavity,
};

export function drawTopicScene(id, lineIndex, script, t, lt, d) {
  const fn = SCENES[id];
  if (fn) { fn(lineIndex, (script.lines || [])[lineIndex] || {}, t, lt, d); return true; }
  return false;
}
