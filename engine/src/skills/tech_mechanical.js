// TECH & MECHANICAL CAD SKILL (100% Free Offline Engine)
// Provides X-Ray mechanical cross-sections, optical laser scanning, and gear/roller mechanisms.

import { ctx, W, H, TAU, lerp, clamp, countUp, startCutout, endCutout } from '../core/lib.js';
import { PixelFX } from '../core/pixelfx.js';

export const TechSkill = {
  /** Line 1: 3D ATM Exterior Card Slot & 3-Second Processing Countdown */
  drawAtmCardSlotCountdown(t, cx, cy, lt, d) {
    ctx.save();
    // 1. Sleek metallic ATM Fascia Panel
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(cx - 240, cy - 200, 480, 400);
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3;
    ctx.strokeRect(cx - 240, cy - 200, 480, 400);

    // Glowing Card Slot
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect(cx - 160, cy - 80, 320, 28, 8);
    ctx.fill();
    ctx.strokeStyle = Math.sin(t * 8) > 0 ? '#38BDF8' : '#0284C7';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Flashing Green Card Insertion LED Indicator
    ctx.fillStyle = Math.sin(t * 10) > 0 ? '#22C55E' : '#14532D';
    ctx.beginPath();
    ctx.arc(cx, cy - 120, 10, 0, TAU);
    ctx.fill();

    // 3-Second Precision Digital Countdown
    const p = clamp(lt / Math.max(d, 0.01));
    const countdownSecs = lerp(3.00, 0.00, p);

    ctx.fillStyle = 'rgba(2, 6, 23, 0.90)';
    ctx.beginPath();
    ctx.roundRect(cx - 180, cy + 40, 360, 110, 14);
    ctx.fill();
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.font = '900 16px Inter, sans-serif';
    ctx.fillStyle = '#F59E0B';
    ctx.textAlign = 'center';
    ctx.fillText('SECURITY SCAN IN PROGRESS', cx, cy + 72);

    ctx.font = '900 44px Inter, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`00:0${countdownSecs.toFixed(2)}s`, cx, cy + 125);

    // Tumbling background currency
    PixelFX.drawFloatingCurrency(t, cx, cy, 8);

    ctx.restore();
  },

  /** Line 2 & 3: High-Speed Rollers + UV Laser Optical Thickness Sensor */
  drawAtmOpticalThicknessScanner(t, cx, cy) {
    ctx.save();
    // 1. Machine Chassis Chamber
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.fillRect(cx - 260, cy - 220, 520, 440);
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(cx - 260, cy - 220, 520, 440);

    // 2. High-Speed Rotating Rubber Rollers (Spinning mechanism)
    const rollSpin = (t * 24) % TAU;
    for (let r = -1; r <= 1; r += 2) {
      const rx = cx + r * 140;
      // Top Roller
      ctx.fillStyle = '#334155';
      ctx.beginPath(); ctx.arc(rx, cy - 85, 42, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#64748B'; ctx.lineWidth = 4; ctx.stroke();
      // Roller Spokes
      ctx.beginPath();
      ctx.moveTo(rx, cy - 85); ctx.lineTo(rx + Math.cos(rollSpin) * 42, cy - 85 + Math.sin(rollSpin) * 42);
      ctx.stroke();

      // Bottom Roller
      ctx.fillStyle = '#334155';
      ctx.beginPath(); ctx.arc(rx, cy + 85, 42, 0, TAU); ctx.fill();
      ctx.strokeStyle = '#64748B'; ctx.lineWidth = 4; ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(rx, cy + 85); ctx.lineTo(rx + Math.cos(-rollSpin) * 42, cy + 85 + Math.sin(-rollSpin) * 42);
      ctx.stroke();
    }

    // 3. Banknote traversing between rollers
    startCutout(30, 0.8, 10, 15);
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.roundRect(cx - 160, cy - 40, 320, 80, 8);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = '900 36px Inter, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('₹ 500 NOTE', cx, cy + 12);
    endCutout();

    // 4. Optical Thickness Laser Beam (Vertical scanning line)
    ctx.save();
    ctx.strokeStyle = '#A855F7';
    ctx.lineWidth = 6;
    ctx.shadowColor = '#A855F7';
    ctx.shadowBlur = 18;
    ctx.beginPath();
    ctx.moveTo(cx, cy - 140);
    ctx.lineTo(cx, cy + 140);
    ctx.stroke();
    ctx.restore();

    // 5. Live Optical Thickness Gauge Badge
    ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
    ctx.beginPath();
    ctx.roundRect(cx - 200, cy + 145, 400, 55, 10);
    ctx.fill();
    ctx.strokeStyle = '#A855F7';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '900 18px Inter, sans-serif';
    ctx.fillStyle = '#C084FC';
    ctx.textAlign = 'center';
    ctx.fillText('OPTICAL THICKNESS: 105 µm // VALID', cx, cy + 180);

    // Laser Sparks
    PixelFX.drawSparks(t, cx, cy, 14, '#C084FC');

    ctx.restore();
  },

  /** Line 4: Mechanical Diverter Flap Gate sending sticky/fake notes into Reject Bin */
  drawAtmRejectDiverterGate(t, cx, cy) {
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
    ctx.fillRect(cx - 260, cy - 220, 520, 440);
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 3;
    ctx.strokeRect(cx - 260, cy - 220, 520, 440);

    // Diverter Channel Paths
    // Top Path: Normal Dispenser (Green)
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.45)';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(cx - 200, cy - 30); ctx.lineTo(cx - 40, cy - 30); ctx.lineTo(cx + 180, cy - 90);
    ctx.stroke();

    // Bottom Path: Reject Vault (Red)
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(cx - 40, cy - 30); ctx.lineTo(cx + 60, cy + 40); ctx.lineTo(cx + 180, cy + 120);
    ctx.stroke();

    // Mechanical Diverter Flap (Steering downward)
    ctx.strokeStyle = '#FFE600';
    ctx.lineWidth = 10;
    ctx.beginPath();
    ctx.moveTo(cx - 40, cy - 30);
    ctx.lineTo(cx + 25, cy + 15);
    ctx.stroke();

    // Rejected Double Note heading to vault
    ctx.save();
    ctx.translate(cx + 80, cy + 70);
    ctx.rotate(0.55);
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(-70, -25, 140, 50);
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(-70, -25, 140, 50);
    ctx.font = '900 18px Inter, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('REJECT (210 µm)', 0, 6);
    ctx.restore();

    // Red Warning Badge
    ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
    ctx.beginPath();
    ctx.roundRect(cx - 220, cy + 140, 440, 60, 12);
    ctx.fill();
    ctx.strokeStyle = '#EF4444';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.font = '900 20px Inter, sans-serif';
    ctx.fillStyle = '#F87171';
    ctx.textAlign = 'center';
    ctx.fillText('DOUBLE / STUCK NOTE DIVERTED TO VAULT', cx, cy + 176);

    ctx.restore();
  },

  /** Line 5: ATM Dispenser Shutter Gate Opening */
  drawAtmDispenserGate(t, cx, cy) {
    ctx.save();
    // ATM Front Fascia
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(cx - 240, cy - 200, 480, 400);
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 3;
    ctx.strokeRect(cx - 240, cy - 200, 480, 400);

    // Steel Dispenser Shutter Sliding Open
    ctx.fillStyle = '#020617';
    ctx.fillRect(cx - 180, cy - 60, 360, 120);

    // Sliding Shutter Doors (Parting Open)
    const openOffset = 45;
    ctx.fillStyle = '#334155';
    // Top Shutter
    ctx.fillRect(cx - 180, cy - 60 - openOffset, 360, 60);
    // Bottom Shutter
    ctx.fillRect(cx - 180, cy + openOffset, 360, 60);

    // Stack of Clean Banknotes Emerging
    startCutout(35, 0.85, 12, 20);
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.roundRect(cx - 140, cy - 35, 280, 70, 8);
    ctx.fill();
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = '900 32px Inter, sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText('₹ 500 CASH READY', cx, cy + 10);
    endCutout();

    // Green Glow & Particles
    PixelFX.drawFloatingCurrency(t, cx, cy, 12);

    ctx.restore();
  }
};
