// LEMO-OPUSCAR FILM STYLES & POSTPROCESSING SHADER ENGINE (100% Free Offline)
// Implements 5 distinct cinematic archetypes so EVERY reel looks unique:
// 1. SCIENTIFIC_BLUEPRINT (Tech, ATM, Engineering, Kola Drill)
// 2. DEEP_ABYSS_SONAR (Oceans, Mariana Trench, Dead Sea, Sinking Car)
// 3. CYBER_COSMIC_VOID (Space, Black Holes, Bermuda Triangle)
// 4. BIOLUMINESCENCE_CELL (Brain, Heart, Cold Water Dive Reflex, Anatomy)
// 5. RETRO_CRT_DOCU (Disasters, Chernobyl, History)

import { ctx, W, H, TAU, rnd } from './lib.js';
import { PixelFX } from './pixelfx.js';

export const STYLES = {
  SCIENTIFIC_BLUEPRINT: 'SCIENTIFIC_BLUEPRINT',
  DEEP_ABYSS_SONAR: 'DEEP_ABYSS_SONAR',
  CYBER_COSMIC_VOID: 'CYBER_COSMIC_VOID',
  BIOLUMINESCENCE_CELL: 'BIOLUMINESCENCE_CELL',
  RETRO_CRT_DOCU: 'RETRO_CRT_DOCU'
};

/** Detects the ideal Lemo-Opuscar film aesthetic based on script content */
export function detectFilmStyle(script = {}) {
  const text = (script.title || '') + ' ' + (script.lines || []).map(l => l.text).join(' ');
  const id = script.id || '';

  if (/ब्लैक होल|अंतरिक्ष|तारा|ग्रेविटी|ब्रह्मांड|gargantua|space/i.test(text + id)) {
    return STYLES.CYBER_COSMIC_VOID;
  }
  if (/समुद्र|पानी|महासागर|गहराई|मारियाना|डेड सी|नाव|जहाज|abyss/i.test(text + id)) {
    return STYLES.DEEP_ABYSS_SONAR;
  }
  if (/दिल|दिमाग|खून|धड़कन|कोशिका|रिफ्लेक्स|ब्रेन|शरीर|anatomy|reflex/i.test(text + id)) {
    return STYLES.BIOLUMINESCENCE_CELL;
  }
  if (/चेरनोबिल|रेडिएशन|परमाणु|हादसा|आपदा|history|plague/i.test(text + id)) {
    return STYLES.RETRO_CRT_DOCU;
  }
  // Default engineering/scientific blueprint
  return STYLES.SCIENTIFIC_BLUEPRINT;
}

/** Renders a rich, dynamic background canvas matching the selected film style */
export function drawStyleBackground(style, t) {
  ctx.save();
  switch (style) {
    case STYLES.CYBER_COSMIC_VOID: {
      // Cosmic Deep Void with Starfield & Nebula Gradient
      const grad = ctx.createRadialGradient(W / 2, H / 2, 80, W / 2, H / 2, W * 0.9);
      grad.addColorStop(0, '#0d0221');
      grad.addColorStop(0.5, '#05010f');
      grad.addColorStop(1, '#000002');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
      PixelFX.drawCosmicDust(t, 45);
      break;
    }

    case STYLES.DEEP_ABYSS_SONAR: {
      // Underwater Abyss with Sonar Depth Contours
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#001a2e');
      grad.addColorStop(0.5, '#000f1c');
      grad.addColorStop(1, '#00040a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Sweeping Sonar Beam
      const cx = W / 2, cy = H / 2 - 100;
      const beamAngle = t * 1.5;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, 520, beamAngle, beamAngle + 0.45);
      ctx.closePath();
      const beamGrad = ctx.createRadialGradient(cx, cy, 50, cx, cy, 520);
      beamGrad.addColorStop(0, 'rgba(0, 242, 254, 0.25)');
      beamGrad.addColorStop(1, 'rgba(0, 242, 254, 0)');
      ctx.fillStyle = beamGrad;
      ctx.fill();
      ctx.restore();

      // Sonar Radar Rings
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.12)';
      ctx.lineWidth = 1.5;
      for (let r = 120; r <= 480; r += 120) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, TAU);
        ctx.stroke();
      }
      PixelFX.drawBubbles(t, cx, cy + 200, 500, 800, 25);
      break;
    }

    case STYLES.BIOLUMINESCENCE_CELL: {
      // Microscopic Deep Crimson & Luminescent Fluid Field
      const grad = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W * 0.85);
      grad.addColorStop(0, '#24000b');
      grad.addColorStop(0.5, '#120005');
      grad.addColorStop(1, '#050002');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Floating Bio-cells
      for (let b = 0; b < 12; b++) {
        const seed = b * 37.1;
        const bx = (rnd(seed) * W + Math.sin(t * 0.8 + seed) * 40) % W;
        const by = (rnd(seed + 1) * H + Math.cos(t * 0.7 + seed) * 40) % H;
        const brad = 18 + rnd(seed + 2) * 28;
        const bGrad = ctx.createRadialGradient(bx, by, 3, bx, by, brad);
        bGrad.addColorStop(0, 'rgba(239, 68, 68, 0.35)');
        bGrad.addColorStop(0.7, 'rgba(239, 68, 68, 0.1)');
        bGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.arc(bx, by, brad, 0, TAU);
        ctx.fill();
      }
      break;
    }

    case STYLES.RETRO_CRT_DOCU: {
      // Vintage Dark Documentary Monochrome / Amber
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#101412');
      grad.addColorStop(1, '#070908');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      // Analog CRT Scanlines
      ctx.fillStyle = 'rgba(0, 255, 120, 0.03)';
      for (let y = 0; y < H; y += 8) {
        ctx.fillRect(0, y, W, 3);
      }
      break;
    }

    case STYLES.SCIENTIFIC_BLUEPRINT:
    default: {
      // Precision Technical CAD Blueprint with Full-Screen Brushed Steel & Ambient Light
      const bgGrad = ctx.createRadialGradient(W / 2, 400, 80, W / 2, H / 2, H * 0.85);
      bgGrad.addColorStop(0, '#1E293B');
      bgGrad.addColorStop(0.45, '#0F172A');
      bgGrad.addColorStop(0.85, '#060B14');
      bgGrad.addColorStop(1, '#020408');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, W, H);

      // Fine Isometric / Orthogonal Grid with Technical Coordinates
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.09)';
      ctx.lineWidth = 1;
      const step = 60;
      ctx.beginPath();
      for (let x = 0; x <= W; x += step) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
      for (let y = 0; y <= H; y += step) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
      ctx.stroke();

      // Technical Axis Origin Markers & Crosshairs
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.35)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(W / 2, 80); ctx.lineTo(W / 2, H - 80);
      ctx.moveTo(80, H / 2); ctx.lineTo(W - 80, H / 2);
      ctx.stroke();

      // Top Volumetric Ambient Light Beam
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const beamGrad = ctx.createLinearGradient(0, 0, 0, 800);
      beamGrad.addColorStop(0, 'rgba(56, 189, 248, 0.16)');
      beamGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, 0, W, 800);
      ctx.restore();
      break;
    }
  }
  ctx.restore();
}

/** Multi-pass Post-Processing Shaders: Bloom, Chromatic Aberration, Vignette & Grain */
export function applyPostProcessing(t, style, cutProgress = 1) {
  ctx.save();

  // 1. Chromatic Aberration (Prism Split on rapid cuts)
  if (cutProgress < 0.25) {
    const shift = (1 - cutProgress / 0.25) * 6;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    // Red Channel Drift
    ctx.fillStyle = 'rgba(255, 0, 50, 0.12)';
    ctx.fillRect(-shift, 0, W, H);
    // Cyan Channel Drift
    ctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
    ctx.fillRect(shift, 0, W, H);
    ctx.restore();
  }

  // 2. Optical Bloom / Specular Highlight Glow
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const bloomGrad = ctx.createRadialGradient(W / 2, H / 2, W * 0.2, W / 2, H / 2, W * 0.7);
  bloomGrad.addColorStop(0, 'rgba(0, 240, 255, 0.08)');
  bloomGrad.addColorStop(0.5, 'rgba(255, 230, 0, 0.04)');
  bloomGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = bloomGrad;
  ctx.fillRect(0, 0, W, H);
  ctx.restore();

  // 3. Cinema Anamorphic Lens Flare Streak (Horizontal Light Spill)
  const flareIntensity = Math.max(0, Math.sin(t * 3.5));
  if (flareIntensity > 0.6) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const fy = 920 + Math.sin(t * 2) * 150;
    const fGrad = ctx.createLinearGradient(0, fy, W, fy);
    fGrad.addColorStop(0, 'rgba(0, 240, 255, 0)');
    fGrad.addColorStop(0.5, `rgba(0, 240, 255, ${flareIntensity * 0.22})`);
    fGrad.addColorStop(1, 'rgba(0, 240, 255, 0)');
    ctx.fillStyle = fGrad;
    ctx.fillRect(0, fy - 6, W, 12);
    ctx.restore();
  }

  // 4. Cinema Vignette (Darkened Edge Border for Visual Focus)
  const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.32, W / 2, H / 2, H * 0.62);
  vig.addColorStop(0, 'rgba(0, 0, 0, 0)');
  vig.addColorStop(0.7, 'rgba(0, 0, 0, 0.38)');
  vig.addColorStop(1, 'rgba(0, 0, 0, 0.78)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, W, H);

  // 5. Procedural 35mm Film Grain
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.025)';
  const grainSeed = Math.floor(t * 30);
  for (let g = 0; g < 40; g++) {
    const gx = (rnd(grainSeed + g * 11) * W);
    const gy = (rnd(grainSeed + g * 19) * H);
    ctx.fillRect(gx, gy, 2, 2);
  }
  ctx.restore();

  ctx.restore();
}
