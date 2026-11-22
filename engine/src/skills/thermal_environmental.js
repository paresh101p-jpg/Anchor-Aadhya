// THERMAL & ENVIRONMENTAL FX SKILL (100% Free Offline)
// Simulates temperature heatmaps, ice frost border creeping, and water caustics.

import { ctx, W, H, TAU, rnd } from '../core/lib.js';

export const ThermalSkill = {
  /** Frost Vignette: Crystalline ice edges creeping in when freezing cold is described */
  drawFrostVignette(t, intensity = 0.85) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';

    // Cold Blue Ambient Gradient
    const frostGrad = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.72);
    frostGrad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    frostGrad.addColorStop(0.75, `rgba(56, 189, 248, ${intensity * 0.35})`);
    frostGrad.addColorStop(1, `rgba(186, 230, 253, ${intensity * 0.75})`);
    ctx.fillStyle = frostGrad;
    ctx.fillRect(0, 0, W, H);

    // Crystalline frost spicules on borders
    ctx.strokeStyle = `rgba(224, 242, 254, ${intensity * 0.65})`;
    ctx.lineWidth = 2.5;
    const count = 48;
    for (let i = 0; i < count; i++) {
      const seed = i * 29.3;
      const angle = (i / count) * TAU;
      const rOuter = H * 0.62;
      const rInner = rOuter - (35 + Math.sin(t * 2 + seed) * 20);

      const x1 = W / 2 + Math.cos(angle) * rOuter;
      const y1 = H / 2 + Math.sin(angle) * rOuter;
      const x2 = W / 2 + Math.cos(angle) * rInner;
      const y2 = H / 2 + Math.sin(angle) * rInner;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.restore();
  },

  /** Human Head & Face Thermal Profile (37°C Warmth -> 5°C Frozen Blue Shift) */
  drawThermalFaceProfile(t, cx, cy, cooling = 0.8) {
    ctx.save();
    // Cold Water Level Boundary line
    const waterLevelY = cy - 20;

    // Head Silhouette
    ctx.save();
    ctx.beginPath();
    // Head shape
    ctx.ellipse(cx, cy - 60, 140, 180, 0, 0, TAU);
    // Neck
    ctx.rect(cx - 60, cy + 80, 120, 120);
    ctx.clip();

    // Thermal Temperature Gradient (Top of head warm, submerged face freezing cold)
    const thermGrad = ctx.createLinearGradient(0, cy - 240, 0, cy + 180);
    thermGrad.addColorStop(0, '#EF4444'); // 37°C Normothermic Core Red
    thermGrad.addColorStop(0.35, '#F59E0B'); // Warm Orange
    thermGrad.addColorStop(0.55, '#38BDF8'); // Cold Cyan
    thermGrad.addColorStop(1, '#0284C7'); // 5°C Freezing Blue

    ctx.fillStyle = thermGrad;
    ctx.fillRect(cx - 200, cy - 260, 400, 500);

    // Trigeminal Nerve Pathways (Glowing Green/Yellow bio-electric signal network)
    ctx.strokeStyle = '#FFE600';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#FFE600';
    ctx.shadowBlur = 10;

    // Nerve branches originating from cheek/forehead to brain stem
    ctx.beginPath();
    ctx.moveTo(cx + 40, cy - 20); // Cheek
    ctx.lineTo(cx, cy - 50); // Mid-face
    ctx.lineTo(cx - 20, cy - 100); // Brain stem ganglion

    ctx.moveTo(cx + 60, cy - 90); // Eye/brow branch
    ctx.lineTo(cx + 10, cy - 70);
    ctx.lineTo(cx - 20, cy - 100);

    ctx.moveTo(cx + 50, cy + 30); // Jaw branch
    ctx.lineTo(cx + 15, cy - 20);
    ctx.stroke();

    // Pulse dot traveling along nerve to brain
    const p = (t * 2.2) % 1;
    const pulseX = cx + 40 + (cx - 20 - (cx + 40)) * p;
    const pulseY = cy - 20 + (cy - 100 - (cy - 20)) * p;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(pulseX, pulseY, 6, 0, TAU);
    ctx.fill();

    ctx.restore();

    // Head Outline
    ctx.strokeStyle = '#BAE6FD';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.ellipse(cx, cy - 60, 140, 180, 0, 0, TAU);
    ctx.stroke();

    // Ice Water Surface Waves
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 4;
    ctx.beginPath();
    for (let x = cx - 260; x <= cx + 260; x += 10) {
      const wy = waterLevelY + Math.sin(t * 4 + x * 0.04) * 8;
      if (x === cx - 260) ctx.moveTo(x, wy);
      else ctx.lineTo(x, wy);
    }
    ctx.stroke();

    // Submerged Water Volume Wash
    ctx.fillStyle = 'rgba(2, 132, 199, 0.35)';
    ctx.fillRect(cx - 280, waterLevelY, 560, 260);

    // Temperature Badge
    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.beginPath();
    ctx.roundRect(cx + 90, cy - 160, 130, 48, 10);
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '900 18px Inter, sans-serif';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'center';
    ctx.fillText('TEMP: 4.2°C', cx + 155, cy - 130);

    ctx.restore();
  }
};
