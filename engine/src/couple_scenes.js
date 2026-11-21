// FIRST COUPLE REEL: both stick characters in one kitchen, with joke beats per line.
// No invented on-screen text: the spoken line is shown by the engine's Devanagari captions.
import { ctx, C, W, clamp, circle, ell, line, rr, fillAll, TAU } from './core/lib.js';
import { stickGirl, stickMan } from './characters.js';

// Who speaks each line.
export const COUPLE_SPEAKERS = ['girl', 'man', 'girl', 'man', 'girl', 'both'];

const lerp = (a, b, p) => a + (b - a) * p;
const smooth = (p) => p * p * (3 - 2 * p);

// Camera keyframes: close-up on whoever is speaking; pull back to a wide
// two-shot from a distance in lines 2 and 4, and hold wide for the outro.
export function coupleCam(i, p) {
  const wide = [540, 930, 0.78];
  const speaker = COUPLE_SPEAKERS[i] || 'both';
  const close = speaker === 'girl' ? [330, 925, 1.8]
              : speaker === 'man' ? [750, 925, 1.8]
              : [540, 925, 1.25];
  let pull = 0;
  if (i === 1 || i === 3) pull = smooth(clamp((p - 0.5) / 0.4, 0, 1));
  if (i === 5) pull = 1;
  return [lerp(close[0], wide[0], pull), lerp(close[1], wide[1], pull), lerp(close[2], wide[2], pull)];
}

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

  // window
  rr(700, 260, 280, 250, 14); ctx.fillStyle = '#BFE3F2'; ctx.fill();
  ctx.strokeStyle = C.navy; ctx.lineWidth = 12; ctx.stroke();
  line([[840, 260], [840, 510]], C.navy, 10); line([[700, 385], [980, 385]], C.navy, 10);
  circle(910, 320, 32, C.yellow);

  // hanging lamp
  line([[310, 180], [310, 300]], C.ink, 10);
  ctx.beginPath(); ctx.moveTo(230, 300); ctx.lineTo(390, 300); ctx.lineTo(350, 360); ctx.lineTo(270, 360); ctx.closePath();
  ctx.fillStyle = C.yellow; ctx.fill();

  // floor
  ctx.fillStyle = '#E4DCCB'; ctx.fillRect(0, 1500, W, 420);
}

function counter() {
  ctx.fillStyle = '#C8A06A'; ctx.fillRect(80, 1210, 920, 46);
  ctx.fillStyle = '#A98255'; ctx.fillRect(100, 1256, 880, 120);
  ctx.strokeStyle = '#8C6A43'; ctx.lineWidth = 8; ctx.strokeRect(100, 1256, 880, 120);
  rr(650, 1170, 270, 50, 16); ctx.fillStyle = '#9AA7B4'; ctx.fill();
  circle(785, 1190, 12, C.white);
}

function speakerFocus(i, t, lt, d) {
  const who = COUPLE_SPEAKERS[i];
  if (who !== 'girl' && who !== 'man') return;
  const p = clamp(lt / Math.max(d, 0.001), 0, 1);
  if ((i === 1 || i === 3) && p > 0.7) return; // ring off once camera has pulled back
  const x = who === 'girl' ? 330 : 750;
  ctx.save();
  ctx.globalAlpha = 0.7 + 0.25 * Math.sin(t * 6);
  ctx.strokeStyle = C.yellow; ctx.lineWidth = 9;
  ctx.beginPath(); ctx.arc(x, 925, 86, 0, TAU); ctx.stroke();
  rr(x + 72, 838, 20, 48, 10); ctx.fillStyle = C.yellow; ctx.fill();
  line([[x + 82, 886], [x + 82, 918], [x + 54, 918]], C.yellow, 9);
  ctx.restore();
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

export function drawCoupleScene(i, lineText, t, lt, d) {
  kitchen();

  if (i === 0) {
    stickGirl({ x: 330, y: 1080, s: 1.05, pose: 'ask', expr: 'smile' });
    stickMan({ x: 750, y: 1080, s: 1.05, pose: 'think', expr: 'shock', shirt: C.shirt });
    heart(540, 820, 1.5 + 0.08 * Math.sin(t * 4));
  } else if (i === 1) {
    stickGirl({ x: 330, y: 1080, s: 1.05, pose: 'point', expr: 'shock' });
    stickMan({ x: 750, y: 1080, s: 1.05, pose: 'hold', expr: 'smile', shirt: C.shirt });
    utensils(750, 1090, 1.0);
  } else if (i === 2) {
    stickGirl({ x: 330, y: 1080, s: 1.05, pose: 'point', expr: 'angry' });
    stickMan({ x: 750, y: 1080, s: 1.05, pose: 'think', expr: 'smile', shirt: C.shirt });
    sparkle(540, 830, 1.2, t);
  } else if (i === 3) {
    stickGirl({ x: 330, y: 1080, s: 1.05, pose: 'laugh', expr: 'laugh' });
    stickMan({ x: 750, y: 1080, s: 1.05, pose: 'show', expr: 'shock', shirt: C.shirt });
    phoneZero(750, 1010, 1.05);
  } else if (i === 4) {
    stickGirl({ x: 330, y: 1080, s: 1.05, pose: 'laugh', expr: 'laugh' });
    stickMan({ x: 750, y: 1080, s: 1.05, pose: 'laugh', expr: 'laugh', shirt: C.shirt });
    utensils(540, 1130, 0.9);
    heart(540, 760, 1.7 + 0.1 * Math.sin(t * 5));
  } else {
    stickGirl({ x: 330, y: 1080, s: 1.05, pose: 'wave', expr: 'smile' });
    stickMan({ x: 750, y: 1080, s: 1.05, pose: 'wave', expr: 'smile', shirt: C.shirt });
    heart(540, 790, 1.5);
  }

  speakerFocus(i, t, lt, d);
  counter();
}
