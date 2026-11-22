// PIXELFX & PROCEDURAL PARTICLE SYSTEM (100% Free Offline Engine)
// Provides frame-exact deterministic particle simulations:
// 1. Sparks & Embers (Drill friction, explosions, heat)
// 2. Steam & Gas Vents (Boiling rock, methane eruptions)
// 3. Deep Sea Bubbles (Underwater abyss, sinking car)
// 4. Electrical Lightning Arcs (Thunderstorms, plane strikes, ionization)
// 5. Cosmic Dust (Space voids, gravity lensing, black holes)
// 6. Tumbling Currency / Paper (ATM cash dispersion)

import { ctx, W, H, TAU, rnd } from './lib.js';

export const PixelFX = {
  /** High-energy fiery sparks spraying from a contact point */
  drawSparks(t, cx, cy, count = 28, color = '#FFE600') {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < count; i++) {
      const seed = i * 17.3 + 5.1;
      const life = ((t * 2.8 + rnd(seed)) % 1);
      const angle = (rnd(seed + 1) - 0.5) * Math.PI * 1.6 - Math.PI / 2;
      const speed = 250 + rnd(seed + 2) * 550;
      const dist = speed * life;
      const gravity = life * life * 450;
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist + gravity;
      const size = (1 - life) * (4 + rnd(seed + 3) * 6);

      ctx.fillStyle = life < 0.35 ? '#FFFFFF' : (life < 0.7 ? color : '#FF3D00');
      ctx.beginPath();
      ctx.arc(px, py, Math.max(1, size), 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  },

  /** Volumetric expanding steam and pressurized gas puffs */
  drawSteam(t, cx, cy, count = 20, tint = 'rgba(230, 245, 255, ') {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < count; i++) {
      const seed = i * 23.7 + 1.9;
      const life = ((t * 1.2 + rnd(seed)) % 1);
      const driftX = Math.sin(t * 3 + seed) * 45 * life;
      const py = cy - life * 380;
      const px = cx + (rnd(seed + 1) - 0.5) * 160 * life + driftX;
      const rad = 25 + life * 95;
      const alpha = Math.sin(life * Math.PI) * 0.22;

      const grad = ctx.createRadialGradient(px, py, rad * 0.2, px, py, rad);
      grad.addColorStop(0, tint + `${alpha * 1.5})`);
      grad.addColorStop(0.6, tint + `${alpha})`);
      grad.addColorStop(1, tint + '0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, rad, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  },

  /** Floating aquatic bubbles with sinusoidal wobble and highlight */
  drawBubbles(t, cx, cy, w = 450, h = 600, count = 35) {
    ctx.save();
    for (let i = 0; i < count; i++) {
      const seed = i * 31.1 + 7.4;
      const life = ((t * 0.7 + rnd(seed)) % 1);
      const py = (cy + h / 2) - life * (h + 100);
      const wobble = Math.sin(t * 4 + seed * 3) * 22;
      const px = (cx - w / 2) + rnd(seed + 1) * w + wobble;
      const rad = 5 + rnd(seed + 2) * 18;
      const alpha = Math.sin(life * Math.PI) * 0.65;

      // Bubble outline
      ctx.strokeStyle = `rgba(100, 220, 255, ${alpha * 0.8})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(px, py, rad, 0, TAU);
      ctx.stroke();

      // Specular shine dot
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(px - rad * 0.35, py - rad * 0.35, rad * 0.25, 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  },

  /** Jagged branching electrical discharge arc */
  drawLightningArc(x1, y1, x2, y2, branches = 3, color = '#00F0FF') {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;

    const dx = x2 - x1, dy = y2 - y1;
    const dist = Math.hypot(dx, dy);
    const steps = Math.max(6, Math.floor(dist / 40));

    let cx = x1, cy = y1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    for (let i = 1; i <= steps; i++) {
      const p = i / steps;
      const nx = x1 + dx * p + (Math.random() - 0.5) * 36;
      const ny = y1 + dy * p + (Math.random() - 0.5) * 36;
      ctx.lineTo(nx, ny);

      // Minor branch
      if (branches > 0 && Math.random() < 0.35) {
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.lineTo(nx + (Math.random() - 0.5) * 60, ny + (Math.random() - 0.5) * 60);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(nx, ny);
      }
      cx = nx; cy = ny;
    }
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
  },

  /** Deep space cosmic dust motes warping with camera motion */
  drawCosmicDust(t, count = 65) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const cx = W / 2, cy = H / 2;
    for (let i = 0; i < count; i++) {
      const seed = i * 47.9 + 13.1;
      const life = ((t * 0.45 + rnd(seed)) % 1);
      const angle = rnd(seed + 1) * TAU;
      const dist = life * (W * 0.75);
      const px = cx + Math.cos(angle) * dist;
      const py = cy + Math.sin(angle) * dist;
      const size = life * 4.5;
      const alpha = Math.sin(life * Math.PI) * 0.85;

      ctx.fillStyle = i % 3 === 0 ? `rgba(0, 240, 255, ${alpha})` : (i % 3 === 1 ? `rgba(255, 230, 0, ${alpha})` : `rgba(255, 255, 255, ${alpha})`);
      ctx.beginPath();
      ctx.arc(px, py, Math.max(1, size), 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  },

  /** 3D Tumbling Currency / Banknote dispersion for ATM and Financial clips */
  drawFloatingCurrency(t, cx, cy, count = 14) {
    ctx.save();
    for (let i = 0; i < count; i++) {
      const seed = i * 29.3 + 3.7;
      const life = ((t * 0.65 + rnd(seed)) % 1);
      const px = cx + (rnd(seed + 1) - 0.5) * 450 + Math.sin(t * 3 + seed) * 35;
      const py = (cy - 300) + life * 750;
      const rot = t * 2.5 + seed;
      const flip = Math.sin(t * 4 + seed);
      const alpha = Math.sin(life * Math.PI) * 0.95;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(rot);
      ctx.scale(1, flip);

      // Banknote Body
      ctx.fillStyle = `rgba(34, 197, 94, ${alpha})`;
      ctx.fillRect(-45, -24, 90, 48);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(-42, -22, 84, 44);

      // Center currency emblem
      ctx.fillStyle = `rgba(255, 230, 0, ${alpha * 0.8})`;
      ctx.beginPath();
      ctx.arc(0, 0, 12, 0, TAU);
      ctx.fill();

      ctx.restore();
    }
    ctx.restore();
  }
};
