// FIRST COUPLE REEL: both stick characters in one kitchen, with joke beats per line.
import { ctx, C, W, H, circle, ell, line, rr, bigText, fillAll, TAU } from './core/lib.js';
import { stickGirl, stickMan } from './characters.js';

const F = (s) => `900 ${s}px Inter, "Noto Sans Devanagari", "Mangal", sans-serif`;

function bubble(text, x, y, size = 42, bg = C.white, fg = C.ink) {
  ctx.save(); ctx.font = F(size); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(text).width + size * 1.1, h = size * 1.9;
  rr(x - w / 2, y - h / 2, w, h, h / 2); ctx.fillStyle = bg; ctx.fill();
  ctx.strokeStyle = C.ink; ctx.lineWidth = 6; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 26, y + h / 2 - 4); ctx.lineTo(x, y + h / 2 + 34); ctx.lineTo(x + 26, y + h / 2 - 4); ctx.fill();
  ctx.fillStyle = fg; ctx.fillText(text, x, y);
  ctx.restore();
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

function kitchen(t) {
  fillAll('#F7E9D7');
  ctx.strokeStyle = 'rgba(14,26,43,0.07)'; ctx.lineWidth = 3;
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
  // sink on right
  rr(650, 1170, 270, 50, 16); ctx.fillStyle = '#9AA7B4'; ctx.fill();
  circle(785, 1190, 12, C.white);
}

function nameTags() {
  bubble('आध्या', 330, 690, 34, C.pinkDark, C.white);
  bubble('रवि', 750, 690, 34, C.shirt, C.white);
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
  ctx.font = F(92); ctx.fillStyle = C.red; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('0', 0, -8);
  ctx.font = F(24); ctx.fillStyle = C.navy; ctx.fillText('बैलेंस', 0, 70);
  ctx.restore();
}

function subscribeButton(x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-200, -55, 400, 110, 55); ctx.fillStyle = C.red; ctx.fill();
  ctx.font = F(52); ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('SUBSCRIBE', 0, 0);
  ctx.restore();
}

export function drawCoupleScene(i, lineText, t, lt, d) {
  kitchen(t);
  nameTags();

  if (i === 0) {
    stickGirl({ x: 330, y: 1080, s: 1.05, pose: 'ask', expr: 'smile' });
    stickMan({ x: 750, y: 1080, s: 1.05, pose: 'think', expr: 'shock', shirt: C.shirt });
    bubble('प्यार कितना? ❤️', 540, 560, 46, C.white, C.pinkDark);
    heart(540, 820, 1.5 + 0.08 * Math.sin(t * 4));
  } else if (i === 1) {
    stickGirl({ x: 330, y: 1080, s: 1.05, pose: 'point', expr: 'shock' });
    stickMan({ x: 750, y: 1080, s: 1.05, pose: 'hold', expr: 'smile', shirt: C.shirt });
    utensils(750, 1090, 1.0);
    bubble('बर्तन धो दिए! 😄', 540, 560, 44, C.white, C.shirt);
  } else if (i === 2) {
    stickGirl({ x: 330, y: 1080, s: 1.05, pose: 'point', expr: 'angry' });
    stickMan({ x: 750, y: 1080, s: 1.05, pose: 'think', expr: 'smile', shirt: C.shirt });
    bubble('रोज़ होना चाहिए!', 540, 560, 44, C.white, C.red);
    sparkle(540, 830, 1.2, t);
  } else if (i === 3) {
    stickGirl({ x: 330, y: 1080, s: 1.05, pose: 'laugh', expr: 'laugh' });
    stickMan({ x: 750, y: 1080, s: 1.05, pose: 'show', expr: 'shock', shirt: C.shirt });
    phoneZero(750, 1010, 1.05);
    bubble('बैलेंस ज़ीरो!', 540, 560, 46, C.white, C.red);
  } else if (i === 4) {
    stickGirl({ x: 330, y: 1080, s: 1.05, pose: 'laugh', expr: 'laugh' });
    stickMan({ x: 750, y: 1080, s: 1.05, pose: 'laugh', expr: 'laugh', shirt: C.shirt });
    utensils(540, 1130, 0.9);
    heart(540, 760, 1.7 + 0.1 * Math.sin(t * 5));
    bubble('प्यार = बर्तन! 😂', 540, 560, 46, C.white, C.pinkDark);
  } else {
    stickGirl({ x: 330, y: 1080, s: 1.05, pose: 'wave', expr: 'smile' });
    stickMan({ x: 750, y: 1080, s: 1.05, pose: 'wave', expr: 'smile', shirt: C.shirt });
    heart(540, 790, 1.5);
    subscribeButton(540, 560, 1.0);
  }

  counter();
}
