// Reusable 2D stick characters for Anchor Aadhya reels.
// Same faces in every video; only poses/expressions change per scene.
import { ctx, C, circle, ell, line, rr, TAU } from './core/lib.js';

const INK = C.ink;
const SKIN = C.skin;

function mouth(expr, y = -137) {
  ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.lineCap = 'round';
  ctx.beginPath();
  if (expr === 'smile' || expr === 'laugh') ctx.arc(0, y, 16, 0.15 * Math.PI, 0.85 * Math.PI);
  else if (expr === 'shock') ctx.arc(0, y + 4, 13, 0, TAU);
  else if (expr === 'angry') ctx.arc(0, y + 12, 15, 1.1 * Math.PI, 1.9 * Math.PI);
  else ctx.moveTo(-12, y); ctx.lineTo(12, y);
  ctx.stroke();
}

function eyes(expr) {
  if (expr === 'wink') {
    line([[-24, -148], [-11, -148]], INK, 5);
    circle(17, -148, 6, INK);
  } else if (expr === 'shock') {
    circle(-19, -148, 9, '#FFFFFF'); circle(19, -148, 9, '#FFFFFF');
    circle(-19, -148, 5, INK); circle(19, -148, 5, INK);
  } else if (expr === 'angry') {
    line([[-28, -160], [-12, -153]], INK, 5); line([[28, -160], [12, -153]], INK, 5);
    circle(-18, -145, 5, INK); circle(18, -145, 5, INK);
  } else {
    circle(-19, -148, 5, INK); circle(19, -148, 5, INK);
  }
}

function limb(pts, w = 11) { line(pts, INK, w); }

/** Stick girl: ponytail + dress. */
export function stickGirl(o = {}) {
  const { x = 0, y = 0, s = 1, pose = 'stand', expr = 'smile', flip = false, dress = C.pink } = o;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); if (flip) ctx.scale(-1, 1);

  // hair back / ponytail
  ell(48, -172, 30, 20, C.hair, -0.35);
  circle(0, -152, 52, C.hair);
  circle(0, -150, 46, SKIN);
  eyes(expr); mouth(expr);

  // dress
  ctx.beginPath(); ctx.moveTo(-30, -98); ctx.lineTo(30, -98);
  ctx.lineTo(52, 12); ctx.lineTo(-52, 12); ctx.closePath();
  ctx.fillStyle = dress; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.stroke();

  const armY = -78, hip = 5, foot = 108;
  if (pose === 'ask' || pose === 'point') {
    limb([[28, armY], [82, armY - 52], [120, armY - 92]]);
    circle(124, armY - 96, 10, SKIN);
    limb([[-28, armY], [-58, armY + 34]]);
  } else if (pose === 'laugh' || pose === 'wave') {
    limb([[28, armY], [76, armY - 62], [100, armY - 118]]);
    limb([[-28, armY], [-76, armY - 54], [-100, armY - 104]]);
    circle(102, armY - 122, 10, SKIN); circle(-102, armY - 108, 10, SKIN);
  } else if (pose === 'hold' || pose === 'hug') {
    limb([[28, armY], [70, armY + 12], [98, armY - 10]]);
    limb([[-28, armY], [-70, armY + 12], [-98, armY - 10]]);
  } else if (pose === 'think') {
    limb([[28, armY], [62, armY - 30], [44, armY - 78]]);
    limb([[-28, armY], [-58, armY + 32]]);
  } else {
    limb([[28, armY], [52, armY + 60]]);
    limb([[-28, armY], [-52, armY + 60]]);
  }
  limb([[18, hip], [28, foot]]); limb([[-18, hip], [-28, foot]]);
  line([[6, foot], [48, foot]], INK, 9); line([[-6, foot], [-48, foot]], INK, 9);
  ctx.restore();
}

/** Stick man: short hair + shirt. */
export function stickMan(o = {}) {
  const { x = 0, y = 0, s = 1, pose = 'stand', expr = 'smile', flip = false, shirt = C.shirt } = o;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); if (flip) ctx.scale(-1, 1);

  circle(0, -152, 49, C.hair);
  circle(0, -150, 45, SKIN);
  // short hair cap
  ctx.beginPath(); ctx.arc(0, -158, 47, Math.PI, TAU); ctx.fillStyle = C.hair; ctx.fill();
  eyes(expr); mouth(expr);

  rr(-40, -100, 80, 112, 12); ctx.fillStyle = shirt; ctx.fill();
  ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.stroke();

  const armY = -76, hip = 8, foot = 110;
  if (pose === 'show' || pose === 'point') {
    limb([[40, armY], [92, armY - 34], [128, armY - 58]]);
    circle(132, armY - 60, 10, SKIN);
    limb([[-40, armY], [-66, armY + 30]]);
  } else if (pose === 'laugh' || pose === 'wave') {
    limb([[40, armY], [86, armY - 60], [108, armY - 112]]);
    limb([[-40, armY], [-86, armY - 54], [-108, armY - 106]]);
  } else if (pose === 'hold' || pose === 'wash') {
    limb([[40, armY], [78, armY + 16], [104, armY - 6]]);
    limb([[-40, armY], [-78, armY + 16], [-104, armY - 6]]);
  } else if (pose === 'think') {
    limb([[40, armY], [70, armY - 28], [46, armY - 76]]);
    limb([[-40, armY], [-66, armY + 30]]);
  } else {
    limb([[40, armY], [62, armY + 58]]);
    limb([[-40, armY], [-62, armY + 58]]);
  }
  limb([[18, hip], [28, foot]]); limb([[-18, hip], [-28, foot]]);
  line([[6, foot], [46, foot]], INK, 9); line([[-6, foot], [-46, foot]], INK, 9);
  ctx.restore();
}
