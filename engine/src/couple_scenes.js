// FIRST COUPLE REEL: only the speaking character is drawn in close-up shots.
// A wide two-shot appears only in the later part of lines 2 and 4.
// No invented on-screen text: the spoken line is shown by the engine's Devanagari captions.
import { ctx, C, W, clamp, circle, ell, line, rr, fillAll, TAU } from './core/lib.js';
import { stickGirl, stickMan } from './characters.js';

export const COUPLE_SPEAKERS = ['girl', 'man', 'girl', 'man', 'girl', 'both'];

function heart(x, y, s, color = C.red) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  circle(-22, -14, 26, color); circle(22, -14, 26, color);
  ctx.beginPath(); ctx.moveTo(-45, 0); ctx.lineTo(0, 60); ctx.lineTo(45, 0); ctx.fillStyle = color; ctx.fill();
  ctx.restore();
}

function sparkle(x, y, s, t) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(t);
  for (let k = 0; k < 4; k++) {
    ctx.rotate(TAU / 4);
    ctx.beginPath(); ctx.moveTo(0, -34 * s); ctx.lineTo(8 * s, 0); ctx.lineTo(0, 34 * s); ctx.lineTo(-8 * s, 0); ctx.closePath();
    ctx.fillStyle = C.yellow; ctx.fill();
  }
  ctx.restore();
}

function kitchen() {
  fillAll('#F7E9D7');
  for (let x = 0; x <= W; x += 120) line([[x, 180], [x, 1180]], 'rgba(14,26,43,0.07)', 3);
  for (let y = 180; y <= 1180; y += 120) line([[0, y], [W, y]], 'rgba(14,26,43,0.07)', 3);
  rr(700, 260, 280, 250, 14); ctx.fillStyle = '#BFE3F2'; ctx.fill();
  ctx.strokeStyle = C.navy; ctx.lineWidth = 12; ctx.stroke();
  line([[840, 260], [840, 510]], C.navy, 10); line([[700, 385], [980, 385]], C.navy, 10);
  circle(910, 320, 32, C.yellow);
  line([[310, 180], [310, 300]], C.ink, 10);
  ctx.beginPath(); ctx.moveTo(230, 300); ctx.lineTo(390, 300); ctx.lineTo(350, 360); ctx.lineTo(270, 360); ctx.closePath();
  ctx.fillStyle = C.yellow; ctx.fill();
  ctx.fillStyle = '#E4DCCB'; ctx.fillRect(0, 1500, W, 420);
}

function counter() {
  ctx.fillStyle = '#C8A06A'; ctx.fillRect(80, 1210, 920, 46);
  ctx.fillStyle = '#A98255'; ctx.fillRect(100, 1256, 880, 120);
  ctx.strokeStyle = '#8C6A43'; ctx.lineWidth = 8; ctx.strokeRect(100, 1256, 880, 120);
  rr(650, 1170, 270, 50, 16); ctx.fillStyle = '#9AA7B4'; ctx.fill();
  circle(785, 1190, 12, C.white);
}

function utensils(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  for (let k = 0; k < 4; k++) {
    ell(0, 20 - k * 22, 78 - k * 6, 18, k % 2 ? '#D9DEE6' : '#FFFFFF');
    ctx.strokeStyle = '#9AA7B4'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.ellipse(0, 20 - k * 22, 78 - k * 6, 18, 0, 0, TAU); ctx.stroke();
  }
  ctx.restore();
}

function phoneZero(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-70, -125, 140, 250, 20); ctx.fillStyle = C.navy; ctx.fill();
  rr(-56, -106, 112, 212, 12); ctx.fillStyle = '#DCEEF5'; ctx.fill();
  ctx.font = '900 92px Inter, "Noto Sans Devanagari", sans-serif';
  ctx.fillStyle = C.red; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('0', 0, -8);
  ctx.restore();
}

function focusRing(x, y, r, t) {
  ctx.save();
  ctx.globalAlpha = 0.7 + 0.25 * Math.sin(t * 6);
  ctx.strokeStyle = C.yellow; ctx.lineWidth = 9;
  ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
  ctx.restore();
}

// One character, big and centred — the face is unmistakable.
function single(i, who, t) {
  const x = 540, y = 1150, s = 1.65;
  const faceY = y - 152 * s;
  if (who === 'girl') {
    const pose = i === 0 ? 'ask' : i === 2 ? 'point' : 'laugh';
    const expr = i === 0 ? 'smile' : i === 2 ? 'angry' : 'laugh';
    stickGirl({ x, y, s, pose, expr });
    if (i === 0) heart(880, 720, 1.7 + 0.08 * Math.sin(t * 4));
    if (i === 2) sparkle(880, 720, 1.5, t);
    if (i === 4) heart(880, 720, 1.9 + 0.1 * Math.sin(t * 5));
  } else {
    const pose = i === 1 ? 'hold' : 'show';
    const expr = i === 1 ? 'smile' : 'shock';
    stickMan({ x, y, s, pose, expr, shirt: C.shirt });
    if (i === 1) utensils(880, 1120, 1.3);
    if (i === 3) phoneZero(880, 1050, 1.4);
  }
  focusRing(x, faceY, 112, t);
}

// Two characters, small and far apart — used only occasionally.
function both(i, t) {
  stickGirl({ x: 330, y: 1080, s: 1.05, pose: i === 1 ? 'point' : 'laugh', expr: i === 1 ? 'shock' : 'smile' });
  stickMan({ x: 750, y: 1080, s: 1.05, pose: i === 1 ? 'hold' : 'show', expr: i === 1 ? 'smile' : 'shock', shirt: C.shirt });
  if (i === 1) utensils(750, 1090, 1.0);
  if (i === 3) phoneZero(750, 1010, 1.05);
  heart(540, 760, 1.5);
}

export function drawCoupleScene(i, lineText, t, lt, d) {
  kitchen();
  const p = clamp(lt / Math.max(d, 0.001), 0, 1);
  const who = COUPLE_SPEAKERS[i] || 'both';
  const wide = who === 'both' || ((i === 1 || i === 3) && p > 0.55);

  if (wide) both(i, t);
  else single(i, who, t);

  counter();
}
