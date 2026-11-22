// BIO-ANATOMICAL SKILL (100% Free Offline)
// Anatomical beating heart with systolic pump, vascular constriction, and neural circuits.

import { ctx, W, H, TAU, clamp, lerp } from '../core/lib.js';

export const BioSkill = {
  /** Anatomically beating human heart with systolic ventricle contractions */
  drawAnatomicalHeart(t, cx, cy, bpm = 45) {
    ctx.save();
    const cycle = 60 / Math.max(20, bpm);
    const phase = (t % cycle) / cycle;

    // Systolic contraction: sharp squeeze then slow diastolic relaxation
    const beat = phase < 0.22 ? Math.sin(phase / 0.22 * Math.PI) * 0.16 : 0;
    const s = 1 + beat;

    ctx.translate(cx, cy);
    ctx.scale(s, s);

    // 1. Aorta Arches & Vena Cava (Top Arterial Tubes)
    ctx.fillStyle = '#EF4444'; // Oxygenated Aorta
    ctx.beginPath();
    ctx.roundRect(-30, -180, 50, 110, 20);
    ctx.fill();

    // Superior Vena Cava (Deoxygenated Blue)
    ctx.fillStyle = '#0284C7';
    ctx.beginPath();
    ctx.roundRect(35, -170, 42, 95, 18);
    ctx.fill();

    // Branching Carotid Arteries
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(-22, -210, 14, 35);
    ctx.fillRect(-2, -215, 14, 40);
    ctx.fillRect(18, -205, 14, 30);

    // 2. Main Myocardium Muscle Body (Ventricles)
    const heartGrad = ctx.createRadialGradient(-30, -20, 20, 0, 20, 160);
    heartGrad.addColorStop(0, '#DC2626');
    heartGrad.addColorStop(0.5, '#991B1B');
    heartGrad.addColorStop(1, '#450A0A');

    ctx.fillStyle = heartGrad;
    ctx.beginPath();
    ctx.moveTo(0, -90);
    ctx.bezierCurveTo(-140, -120, -180, 20, -20, 150);
    ctx.lineTo(0, 175);
    ctx.lineTo(20, 150);
    ctx.bezierCurveTo(180, 20, 140, -120, 0, -90);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#FCA5A5';
    ctx.lineWidth = 3;
    ctx.stroke();

    // 3. Coronary Arteries Network (Fine branching red vessels on heart surface)
    ctx.strokeStyle = '#F87171';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-10, -50);
    ctx.quadraticCurveTo(-45, 10, -80, 60);
    ctx.moveTo(-45, 10);
    ctx.lineTo(-20, 45);

    ctx.moveTo(15, -40);
    ctx.quadraticCurveTo(55, 20, 75, 80);
    ctx.moveTo(55, 20);
    ctx.lineTo(40, 55);
    ctx.stroke();

    // 4. Systolic Blood Jet Ejection (Pulsing outwards on beat)
    if (phase < 0.22) {
      const p = phase / 0.22;
      ctx.fillStyle = `rgba(239, 68, 68, ${1 - p})`;
      ctx.beginPath();
      ctx.arc(0, -220 - p * 40, 14 + p * 12, 0, TAU);
      ctx.fill();
    }

    ctx.restore();
  },

  /** Vascular Constriction: Cross-section of blood vessel narrowing under cold shock */
  drawVascularConstriction(t, cx, cy, constrictPct = 0.65) {
    ctx.save();
    // Normal lumen radius = 130, constricted down to 45
    const lumenR = lerp(130, 45, constrictPct);
    const wallThickness = 65;

    // 1. Vessel Smooth Muscle Outer Wall
    ctx.fillStyle = '#7F1D1D';
    ctx.beginPath();
    ctx.arc(cx, cy, 130 + wallThickness, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = '#B91C1C';
    ctx.lineWidth = 5;
    ctx.stroke();

    // 2. Contracting Muscle Bands (Radial striations)
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.45)';
    ctx.lineWidth = 3;
    for (let a = 0; a < TAU; a += TAU / 16) {
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * (lumenR + 10), cy + Math.sin(a) * (lumenR + 10));
      ctx.lineTo(cx + Math.cos(a) * (130 + wallThickness - 5), cy + Math.sin(a) * (130 + wallThickness - 5));
      ctx.stroke();
    }

    // 3. Constricted Lumen (Inner Blood Channel)
    ctx.fillStyle = '#991B1B';
    ctx.beginPath();
    ctx.arc(cx, cy, lumenR, 0, TAU);
    ctx.fill();

    // 4. Flowing Red Blood Cells rushing through compressed channel
    const rbcCount = 22;
    for (let i = 0; i < rbcCount; i++) {
      const seed = i * 19.1;
      const angle = rnd(seed) * TAU;
      const dist = rnd(seed + 1) * (lumenR - 14);
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;

      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.ellipse(px, py, 11, 7, (t * 4 + seed) % TAU, 0, TAU);
      ctx.fill();
      ctx.fillStyle = '#7F1D1D';
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, TAU);
      ctx.fill();
    }

    // Inward Pressure Force Arrows
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3.5;
    for (let a = 0; a < TAU; a += TAU / 6) {
      const arrowStart = 130 + wallThickness + 25 + Math.sin(t * 5 + a) * 8;
      const arrowEnd = 130 + wallThickness + 5;
      const ax1 = cx + Math.cos(a) * arrowStart;
      const ay1 = cy + Math.sin(a) * arrowStart;
      const ax2 = cx + Math.cos(a) * arrowEnd;
      const ay2 = cy + Math.sin(a) * arrowEnd;

      ctx.beginPath();
      ctx.moveTo(ax1, ay1);
      ctx.lineTo(ax2, ay2);
      ctx.stroke();
    }

    // Status Badge
    ctx.fillStyle = 'rgba(2, 6, 23, 0.88)';
    ctx.beginPath();
    ctx.roundRect(cx - 190, cy + 180, 380, 52, 12);
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '900 18px Inter, sans-serif';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'center';
    ctx.fillText('PERIPHERAL VASOCONSTRICTION // 65%', cx, cy + 212);

    ctx.restore();
  }
};
