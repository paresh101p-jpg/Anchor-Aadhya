// TECH & MECHANICAL CAD SKILL - MAGNATES MEDIA 7-LAYER EDITION (100% Free Offline)
// 100% Canvas Coverage (1080x1920) - Zero empty space, zero flat geometry.
// Realistic 2.5D isolated cutouts, photorealistic ₹500 currency, and foreground lens blur.

import { ctx, W, H, TAU, lerp, clamp, countUp, startCutout, endCutout, circle, line } from '../core/lib.js';
import { PixelFX } from '../core/pixelfx.js';

/** Realistic Indian ₹500 Banknote Renderer with security thread, watermark & guilloche */
export function drawRealisticBanknote(cx, cy, w = 320, h = 145, rot = 0, scale = 1, specular = 0, blur = 0) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(rot);
  ctx.scale(scale, scale);

  if (blur > 0) {
    ctx.filter = `blur(${blur}px)`;
  }

  // 3D Drop Shadow on banknote
  ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
  ctx.shadowBlur = 24 * scale;
  ctx.shadowOffsetY = 14 * scale;

  // 1. Banknote Base: Realistic Stone Grey-Green Gradient
  const noteGrad = ctx.createLinearGradient(-w / 2, -h / 2, w / 2, h / 2);
  noteGrad.addColorStop(0, '#5C7A65');
  noteGrad.addColorStop(0.3, '#74947E');
  noteGrad.addColorStop(0.7, '#64856E');
  noteGrad.addColorStop(1, '#4A6953');
  ctx.fillStyle = noteGrad;
  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, 6);
  ctx.fill();

  // Reset shadow for internal fine details
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // 2. Fine Guilloche Border Intaglio Printing
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 2;
  ctx.strokeRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12);
  ctx.strokeStyle = 'rgba(20, 45, 30, 0.5)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(-w / 2 + 9, -h / 2 + 9, w - 18, h - 18);

  // 3. Mahatma Gandhi Watermark Oval Window
  ctx.fillStyle = 'rgba(240, 245, 240, 0.22)';
  ctx.beginPath();
  ctx.ellipse(-w * 0.28, 0, w * 0.14, h * 0.36, 0, 0, TAU);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 4. Color-Shifting Holographic Security Thread (Green to Blue)
  const threadX = w * 0.05;
  const threadGrad = ctx.createLinearGradient(threadX - 4, -h / 2, threadX + 4, h / 2);
  threadGrad.addColorStop(0, '#00E676');
  threadGrad.addColorStop(0.5, '#00B0FF');
  threadGrad.addColorStop(1, '#00E676');
  ctx.fillStyle = threadGrad;
  ctx.fillRect(threadX - 3.5, -h / 2 + 6, 7, h - 12);

  // Micro RBI text on thread
  ctx.font = `900 ${Math.max(8, Math.round(9 * scale))}px Inter, sans-serif`;
  ctx.fillStyle = '#062612';
  ctx.textAlign = 'center';
  ctx.fillText('RBI', threadX, -h * 0.25);
  ctx.fillText('500', threadX, 0);
  ctx.fillText('भारत', threadX, h * 0.25);

  // 5. Ashoka Pillar Emblem on Right
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillRect(w * 0.36, -h * 0.22, w * 0.09, h * 0.44);

  // 6. Denomination Numeral: "₹500" & "₹५००"
  ctx.font = `900 ${Math.max(16, Math.round(28 * scale))}px Inter, sans-serif`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'left';
  ctx.fillText('₹500', -w / 2 + 18, -h / 2 + 34);

  ctx.font = `900 ${Math.max(12, Math.round(18 * scale))}px Inter, sans-serif`;
  ctx.fillStyle = '#C8E6C9';
  ctx.textAlign = 'right';
  ctx.fillText('RESERVE BANK OF INDIA', w / 2 - 18, -h / 2 + 28);

  ctx.font = `900 ${Math.max(14, Math.round(24 * scale))}px Inter, sans-serif`;
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'right';
  ctx.fillText('₹५००', w / 2 - 18, h / 2 - 16);

  // 7. Specular Sheen Sweep across banknote surface
  if (specular > 0) {
    const sweepX = -w / 2 + specular * w * 1.5;
    const sweepGrad = ctx.createLinearGradient(sweepX - 40, -h / 2, sweepX + 40, h / 2);
    sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
    sweepGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.45)');
    sweepGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = sweepGrad;
    ctx.fillRect(-w / 2 + 6, -h / 2 + 6, w - 12, h - 12);
  }

  ctx.restore();
}

/** Full 1080x1920 High-Tech Bank Vault Environment (100% Canvas Fill) */
export function drawFullVaultEnvironment(t) {
  ctx.save();

  // 1. Full-Bleed Deep Brushed-Steel Walls (1080x1920)
  const wallGrad = ctx.createRadialGradient(W / 2, 400, 100, W / 2, H / 2, H * 0.85);
  wallGrad.addColorStop(0, '#1E293B');
  wallGrad.addColorStop(0.4, '#0F172A');
  wallGrad.addColorStop(0.8, '#060B14');
  wallGrad.addColorStop(1, '#020408');
  ctx.fillStyle = wallGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Heavy Industrial Steel Columns on Left & Right Margins
  ctx.fillStyle = '#0B1322';
  ctx.fillRect(0, 0, 95, H);
  ctx.fillRect(W - 95, 0, 95, H);
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 3;
  ctx.strokeRect(0, 0, 95, H);
  ctx.strokeRect(W - 95, 0, 95, H);

  // Steel Rivets along columns
  ctx.fillStyle = '#475569';
  for (let y = 80; y < H; y += 120) {
    circle(48, y, 6, '#475569');
    circle(48, y, 3, '#94A3B8');
    circle(W - 48, y, 6, '#475569');
    circle(W - 48, y, 3, '#94A3B8');
  }

  // 3. Volumetric Overhead Spotlight Cone (Sweeping illumination)
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const spotGrad = ctx.createRadialGradient(W / 2, -100, 50, W / 2, 850, 750);
  spotGrad.addColorStop(0, 'rgba(56, 189, 248, 0.22)');
  spotGrad.addColorStop(0.5, 'rgba(56, 189, 248, 0.08)');
  spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = spotGrad;
  ctx.beginPath();
  ctx.moveTo(W / 2 - 120, 0);
  ctx.lineTo(W / 2 + 120, 0);
  ctx.lineTo(W - 80, 1500);
  ctx.lineTo(80, 1500);
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 4. Perspective Reflective Vault Floor Grid (Below y = 1450)
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
  ctx.lineWidth = 1.5;
  for (let fy = 1480; fy < H; fy += 75) {
    line([[100, fy], [W - 100, fy]], 'rgba(56, 189, 248, 0.14)', 1.5);
  }
  for (let fx = 120; fx < W - 100; fx += 140) {
    line([[fx, 1480], [W / 2 + (fx - W / 2) * 1.8, H]], 'rgba(56, 189, 248, 0.08)', 1.5);
  }

  // 5. Diagonal Security Laser Scanning Beam
  const laserY = 250 + ((t * 220) % 1100);
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
  ctx.lineWidth = 2.5;
  ctx.shadowColor = '#EF4444';
  ctx.shadowBlur = 14;
  line([[100, laserY - 80], [W - 100, laserY + 80]], 'rgba(239, 68, 68, 0.65)', 2.5);
  ctx.restore();

  ctx.restore();
}

export const TechSkill = {
  drawFullVaultEnvironment,
  /** Line 1: Giant 880px Realistic ATM Fascia & 3-Second Precision Digital Countdown */
  drawAtmCardSlotCountdown(t, cx, cy, lt, d) {
    drawFullVaultEnvironment(t);

    ctx.save();
    // Huge 880px ATM Fascia (Occupies 70% of screen height)
    const atmW = 860, atmH = 820;
    const atmX = cx - atmW / 2, atmY = cy - 380;

    startCutout(50, 0.9, 18, 28);

    // 1. Heavy Metallic ATM Body with Chamfered Bevels
    const bodyGrad = ctx.createLinearGradient(atmX, atmY, atmX + atmW, atmY + atmH);
    bodyGrad.addColorStop(0, '#1E293B');
    bodyGrad.addColorStop(0.3, '#334155');
    bodyGrad.addColorStop(0.7, '#1E293B');
    bodyGrad.addColorStop(1, '#0F172A');
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.roundRect(atmX, atmY, atmW, atmH, 28);
    ctx.fill();

    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Brushed Aluminum Accent Frame
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 2;
    ctx.strokeRect(atmX + 16, atmY + 16, atmW - 32, atmH - 32);

    // 2. High-Contrast OLED Banking Display Screen
    const scrX = atmX + 50, scrY = atmY + 45, scrW = atmW - 100, scrH = 340;
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect(scrX, scrY, scrW, scrH, 16);
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Top Header Status
    ctx.font = '900 22px Inter, sans-serif';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'left';
    ctx.fillText('STATE BANK NETWORK // CASSETTE SCANNER', scrX + 30, scrY + 42);

    // Blinking Live Status Indicator
    const blink = Math.sin(t * 8) > 0;
    circle(scrX + scrW - 35, scrY + 36, 9, blink ? '#22C55E' : '#14532D');

    // Live 3-Second Precision Countdown Timer
    const p = clamp(lt / Math.max(d, 0.01));
    const countdownSecs = Math.max(0, lerp(3.00, 0.00, p));

    ctx.font = '900 82px Inter, sans-serif';
    ctx.fillStyle = '#FFE600';
    ctx.textAlign = 'center';
    ctx.fillText(`00:0${countdownSecs.toFixed(2)}s`, cx, scrY + 165);

    ctx.font = '800 24px Inter, sans-serif';
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText('VERIFYING OPTICAL THICKNESS & CHIP ID', cx, scrY + 225);

    // Segmented Audit Waveform
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    for (let x = scrX + 40; x < scrX + scrW - 40; x += 18) {
      const barH = 15 + Math.sin(t * 12 + x * 0.08) * 18;
      ctx.moveTo(x, scrY + 290);
      ctx.lineTo(x, scrY + 290 - barH);
    }
    ctx.stroke();

    // 3. Illuminated Metallic Card Insertion Slot (Bottom Bezel)
    const slotX = cx - 240, slotY = atmY + 440, slotW = 480, slotH = 42;
    ctx.fillStyle = '#020408';
    ctx.beginPath();
    ctx.roundRect(slotX, slotY, slotW, slotH, 12);
    ctx.fill();

    // Green Neon Guidance Bezel
    ctx.strokeStyle = blink ? '#22C55E' : '#15803D';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Directional Chevrons
    ctx.font = '900 24px Inter, sans-serif';
    ctx.fillStyle = blink ? '#22C55E' : '#15803D';
    ctx.textAlign = 'center';
    ctx.fillText('▼ ▼ INSERT CHIP CARD HERE ▼ ▼', cx, slotY + 28);

    // 4. Realistic 3D Platinum Credit Card Entering Slot
    const cardY = slotY + 95 - p * 65;
    ctx.save();
    ctx.translate(cx, cardY);
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(-160, -90, 320, 180, 14);
    ctx.fill();
    ctx.strokeStyle = '#94A3B8';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Gold Microchip
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.roundRect(-120, -50, 60, 48, 8);
    ctx.fill();
    ctx.strokeStyle = '#D97706';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Embossed Card Numbers
    ctx.font = '900 18px Inter, monospace';
    ctx.fillStyle = '#E2E8F0';
    ctx.textAlign = 'left';
    ctx.fillText('4532 •••• •••• 9812', -120, 30);
    ctx.font = '800 13px Inter, sans-serif';
    ctx.fillText('AADHYA VERIFIED CARD', -120, 60);

    ctx.restore();

    endCutout();

    // 5. Extreme Foreground Parallax: 2 Huge Blurred Currency Notes flying past lens!
    const note1Y = 1250 - p * 300;
    drawRealisticBanknote(190, note1Y, 340, 155, -0.32, 1.35, (t * 0.8) % 1, 5);

    const note2Y = 1450 - p * 350;
    drawRealisticBanknote(W - 200, note2Y, 350, 160, 0.28, 1.45, (t * 0.8 + 0.4) % 1, 6);

    ctx.restore();
  },

  /** Line 2 & 3: High-Speed Motorized Rollers & UV Laser Optical Thickness Sensor */
  drawAtmOpticalThicknessScanner(t, cx, cy) {
    drawFullVaultEnvironment(t);

    ctx.save();
    // Giant 920px Industrial Internal Mechanism Chamber
    const chW = 900, chH = 820;
    const chX = cx - chW / 2, chY = cy - 380;

    startCutout(50, 0.9, 18, 28);

    // Machine Heavy Casting Chassis
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(chX, chY, chW, chH, 24);
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Internal Transparent Transport Guide Rails
    ctx.fillStyle = 'rgba(2, 6, 23, 0.85)';
    ctx.fillRect(chX + 40, chY + 40, chW - 80, chH - 80);

    // 1. Dual High-Speed Rollers (Top & Bottom pairs)
    const rollSpin = (t * 32) % TAU;
    const rollerPairs = [
      { rx: cx - 260, ry1: cy - 120, ry2: cy + 120 },
      { rx: cx + 260, ry1: cy - 120, ry2: cy + 120 }
    ];

    rollerPairs.forEach(({ rx, ry1, ry2 }) => {
      // Top Roller
      ctx.fillStyle = '#1E293B';
      circle(rx, ry1, 65, '#1E293B');
      ctx.strokeStyle = '#64748B'; ctx.lineWidth = 5; ctx.stroke();
      // Tread Spokes
      for (let a = 0; a < TAU; a += TAU / 6) {
        line([[rx, ry1], [rx + Math.cos(rollSpin + a) * 65, ry1 + Math.sin(rollSpin + a) * 65]], '#94A3B8', 4);
      }
      circle(rx, ry1, 18, '#F59E0B');

      // Bottom Roller (Opposite spin)
      circle(rx, ry2, 65, '#1E293B');
      ctx.strokeStyle = '#64748B'; ctx.lineWidth = 5; ctx.stroke();
      for (let a = 0; a < TAU; a += TAU / 6) {
        line([[rx, ry2], [rx + Math.cos(-rollSpin + a) * 65, ry2 + Math.sin(-rollSpin + a) * 65]], '#94A3B8', 4);
      }
      circle(rx, ry2, 18, '#F59E0B');
    });

    // 2. High-Speed Transport Belts linking rollers
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 6;
    line([[cx - 260, cy - 120], [cx + 260, cy - 120]], '#F59E0B', 6);
    line([[cx - 260, cy + 120], [cx + 260, cy + 120]], '#F59E0B', 6);

    // 3. Central Real Banknote Traversing between Rollers
    const noteX = cx + Math.sin(t * 8) * 45;
    drawRealisticBanknote(noteX, cy, 380, 170, 0, 1.15, (t * 1.5) % 1, 0);

    // 4. Optical Laser Thickness Sensor (Intense Purple/Cyan Beam)
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.strokeStyle = '#A855F7';
    ctx.lineWidth = 8;
    ctx.shadowColor = '#C084FC';
    ctx.shadowBlur = 24;
    line([[cx, cy - 240], [cx, cy + 240]], '#C084FC', 8);

    // Laser Emitter Heads
    ctx.fillStyle = '#7E22CE';
    ctx.fillRect(cx - 30, cy - 260, 60, 25);
    ctx.fillRect(cx - 30, cy + 235, 60, 25);
    ctx.restore();

    // Sparks from laser scan
    PixelFX.drawSparks(t, cx, cy - 60, 18, '#C084FC');
    PixelFX.drawSparks(t, cx, cy + 60, 18, '#38BDF8');

    endCutout();

    // 5. Live Oscilloscope Optical Thickness Waveform Card (Vox Style)
    const hudW = 860, hudH = 135;
    const hudX = cx - hudW / 2, hudY = cy + 470;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
    ctx.beginPath();
    ctx.roundRect(hudX, hudY, hudW, hudH, 16);
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = '900 20px Inter, sans-serif';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'left';
    ctx.fillText('OPTICAL THICKNESS SENSOR // MICRON ANALYSIS', hudX + 30, hudY + 36);

    ctx.font = '900 36px Inter, sans-serif';
    ctx.fillStyle = '#22C55E';
    ctx.textAlign = 'right';
    ctx.fillText('105 µm (100–115 µm OK)', hudX + hudW - 30, hudY + 45);

    // Live Oscilloscope Pulse Line
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = hudX + 40; x < hudX + hudW - 40; x += 10) {
      const p = (x - hudX) / hudW;
      const wave = Math.sin(t * 14 + p * 20) * 18;
      const py = hudY + 95 + (p > 0.45 && p < 0.55 ? -40 : wave);
      if (x === hudX + 40) ctx.moveTo(x, py);
      else ctx.lineTo(x, py);
    }
    ctx.stroke();

    // Extreme Foreground Parallax Banknotes flying into viewer
    drawRealisticBanknote(W - 170, 1400, 320, 145, 0.35, 1.35, (t * 0.9) % 1, 5);

    ctx.restore();
  },

  /** Line 4: Mechanical Diverter Flap Gate Deflecting Sticky/Fake Notes into Reject Vault */
  drawAtmRejectDiverterGate(t, cx, cy) {
    drawFullVaultEnvironment(t);

    ctx.save();
    const chW = 900, chH = 820;
    const chX = cx - chW / 2, chY = cy - 380;

    startCutout(50, 0.9, 18, 28);

    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(chX, chY, chW, chH, 24);
    ctx.fill();
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 4;
    ctx.stroke();

    // 1. Chute Pathways
    // Top Normal Pathway (Diverted Away)
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
    ctx.lineWidth = 14;
    line([[chX + 80, cy - 60], [cx - 60, cy - 60], [chX + chW - 80, cy - 180]], 'rgba(56, 189, 248, 0.35)', 14);

    // Bottom Reject Vault Pathway (Directing downward)
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 18;
    line([[cx - 60, cy - 60], [cx + 80, cy + 80], [chX + chW - 80, cy + 240]], '#EF4444', 18);

    // 2. Heavy Solenoid Diverter Gate (Slammed down to block normal exit)
    ctx.strokeStyle = '#FFE600';
    ctx.lineWidth = 16;
    line([[cx - 60, cy - 60], [cx + 35, cy]], '#FFE600', 16);

    // 3. Rejected Double Note Deflected Downward into Vault
    ctx.save();
    ctx.translate(cx + 90, cy + 120);
    ctx.rotate(0.68);
    drawRealisticBanknote(0, 0, 320, 145, 0, 1.1, 0, 0);

    // Red "DOUBLE NOTE" Warning Stamp
    ctx.fillStyle = '#EF4444';
    ctx.beginPath();
    ctx.roundRect(-120, -35, 240, 70, 10);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = '900 24px Inter, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('REJECT: 210 µm', 0, -2);
    ctx.font = '800 16px Inter, sans-serif';
    ctx.fillText('DOUBLE NOTE ANOMALY', 0, 24);
    ctx.restore();

    endCutout();

    // 4. Large Warning Telemetry Card
    const hudW = 860, hudH = 130;
    const hudX = cx - hudW / 2, hudY = cy + 470;

    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.beginPath();
    ctx.roundRect(hudX, hudY, hudW, hudH, 16);
    ctx.fill();
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.font = '900 28px Inter, sans-serif';
    ctx.fillStyle = '#EF4444';
    ctx.textAlign = 'center';
    ctx.fillText('⚠️ SECURITY PURGE // FLAP DIVERTED TO RETENTION CASSETTE', cx, hudY + 50);

    ctx.font = '800 20px Inter, sans-serif';
    ctx.fillStyle = '#FECACA';
    ctx.fillText('CHIPPED / STUCK NOTES AUTOMATICALLY PREVENTED FROM JAMMING DISPENSER', cx, hudY + 95);

    ctx.restore();
  },

  /** Line 5: ATM Dispenser Shutter Opening with Crisp Banknotes Emerging */
  drawAtmDispenserGate(t, cx, cy) {
    drawFullVaultEnvironment(t);

    ctx.save();
    const atmW = 860, atmH = 820;
    const atmX = cx - atmW / 2, atmY = cy - 380;

    startCutout(50, 0.9, 18, 28);

    // Front Dispenser Fascia
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(atmX, atmY, atmW, atmH, 28);
    ctx.fill();
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Shutter Recessed Cavity
    const cavW = 620, cavH = 260;
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect(cx - cavW / 2, cy - 130, cavW, cavH, 16);
    ctx.fill();

    // Dual Stainless Steel Shutter Doors Sliding Open
    const openOffset = 70;
    ctx.fillStyle = '#475569';
    // Top Shutter Sliding Up
    ctx.fillRect(cx - cavW / 2, cy - 130 - openOffset, cavW, 90);
    // Bottom Shutter Sliding Down
    ctx.fillRect(cx - cavW / 2, cy + 130 - 90 + openOffset, cavW, 90);

    // Clean Stack of Emerging ₹500 Banknotes
    drawRealisticBanknote(cx, cy, 440, 200, 0, 1.25, (t * 1.8) % 1, 0);

    // Green Optical Clearance Delivery Beam
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx - cavW / 2, cy + 80);
    ctx.lineTo(cx + cavW / 2, cy + 80);
    ctx.stroke();

    endCutout();

    // Delivery Status Badge
    const hudW = 860, hudH = 130;
    const hudX = cx - hudW / 2, hudY = cy + 470;

    ctx.fillStyle = 'rgba(34, 197, 94, 0.2)';
    ctx.beginPath();
    ctx.roundRect(hudX, hudY, hudW, hudH, 16);
    ctx.fill();
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.font = '900 32px Inter, sans-serif';
    ctx.fillStyle = '#22C55E';
    ctx.textAlign = 'center';
    ctx.fillText('✅ CASH DISPENSED // COUNT & SENSOR AUDIT 100% OK', cx, hudY + 55);

    ctx.font = '800 20px Inter, sans-serif';
    ctx.fillStyle = '#DCFCE7';
    ctx.fillText('CRISP VERIFIED NOTES PRESENTED TO CUSTOMER', cx, hudY + 95);

    // Extreme Foreground Floating Currency Explosion!
    drawRealisticBanknote(190, 1380, 340, 155, -0.28, 1.4, (t * 1.2) % 1, 5);
    drawRealisticBanknote(W - 190, 1350, 350, 160, 0.25, 1.5, (t * 1.2 + 0.5) % 1, 6);

    ctx.restore();
  }
};
