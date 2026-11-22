// AVIATION & LIGHTNING SKILL - MAGNATES MEDIA 7-LAYER EDITION (100% Free Offline)
// 100% Canvas Coverage (1080x1920) - 35,000 FT Storm, Giant Airliner, Lightning Strike, Faraday Skin & Static Wicks.

import { ctx, W, H, TAU, lerp, clamp, countUp, startCutout, endCutout, circle, line } from '../core/lib.js';
import { PixelFX } from '../core/pixelfx.js';

/** Full 1080x1920 Atmospheric High-Altitude Thunderstorm Environment */
export function drawStormEnvironment(t) {
  ctx.save();
  // 1. Deep 35,000 FT Stratosphere & Cumulonimbus Storm Canvas
  const stormGrad = ctx.createLinearGradient(0, 0, 0, H);
  stormGrad.addColorStop(0, '#020617');
  stormGrad.addColorStop(0.35, '#0B132B');
  stormGrad.addColorStop(0.75, '#1C2541');
  stormGrad.addColorStop(1, '#0B0D17');
  ctx.fillStyle = stormGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Rolling Volumetric Dark Thundercloud Puffs
  for (let c = 0; c < 8; c++) {
    const seed = c * 31.7;
    const cx = (W / 2 + Math.sin(t * 0.4 + seed) * 160 + c * 180) % (W + 300) - 150;
    const cy = 200 + c * 220;
    const crad = 180 + (c % 3) * 60;

    const cloudGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, crad);
    cloudGrad.addColorStop(0, 'rgba(30, 41, 59, 0.45)');
    cloudGrad.addColorStop(0.6, 'rgba(15, 23, 42, 0.25)');
    cloudGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = cloudGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, crad, 0, TAU);
    ctx.fill();
  }

  // 3. Fast High-Altitude Wind Streamlines (850 KM/H cruise speed)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.lineWidth = 2;
  const windOffset = (t * 1800) % W;
  for (let y = 150; y < H - 150; y += 95) {
    ctx.beginPath();
    ctx.moveTo(-W + windOffset, y);
    ctx.lineTo(W * 2 + windOffset, y);
    ctx.stroke();
  }

  // 4. Distant Ambient Lightning Cloud Illumination
  const flash = Math.sin(t * 14) > 0.85;
  if (flash) {
    ctx.fillStyle = 'rgba(186, 230, 253, 0.22)';
    ctx.fillRect(0, 0, W, H);
  }

  ctx.restore();
}

export const AviationSkill = {
  drawStormEnvironment,

  /** Line 1 & 2: Giant 880px Commercial Jetliner cruising in storm + Lightning Strike */
  drawAirlinerLightningStrike(t, cx, cy, lt, subIdx = 0) {
    drawStormEnvironment(t);

    ctx.save();
    // Sub-shot 1: Tight zoom on fuselage nose
    // Sub-shot 0/2: Wide establishing airplane view
    const isCloseUp = (subIdx === 1);
    const planeScale = isCloseUp ? 1.45 : 1.15;
    const planeY = isCloseUp ? cy - 80 : cy;

    ctx.translate(cx, planeY);
    ctx.scale(planeScale, planeScale);

    // Aerodynamic flight pitch and gentle turbulence
    const pitch = 0.08 + Math.sin(t * 3.5) * 0.03;
    ctx.rotate(pitch);

    startCutout(50, 0.9, 20, 30);

    // 1. Wings (Swept-back aerodynamic wings with flap tracks)
    const wingGrad = ctx.createLinearGradient(0, -220, 0, 220);
    wingGrad.addColorStop(0, '#94A3B8');
    wingGrad.addColorStop(0.5, '#CBD5E1');
    wingGrad.addColorStop(1, '#64748B');
    ctx.fillStyle = wingGrad;

    ctx.beginPath();
    ctx.moveTo(40, -250);
    ctx.lineTo(80, -240);
    ctx.lineTo(-20, 240);
    ctx.lineTo(-60, 230);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Jet Turbofan Engines under wings
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(10, -140, 75, 42, 10);
    ctx.roundRect(-30, 110, 75, 42, 10);
    ctx.fill();
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 2. Main Fuselage (Commercial Jetliner Body)
    const fuseGrad = ctx.createLinearGradient(0, -65, 0, 65);
    fuseGrad.addColorStop(0, '#FFFFFF');
    fuseGrad.addColorStop(0.35, '#E2E8F0');
    fuseGrad.addColorStop(0.7, '#94A3B8');
    fuseGrad.addColorStop(1, '#475569');

    ctx.fillStyle = fuseGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 360, 62, 0, 0, TAU);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Cockpit Tinted Reflective Windshield Visor
    ctx.fillStyle = '#0284C7';
    ctx.beginPath();
    ctx.moveTo(250, -22);
    ctx.lineTo(310, -10);
    ctx.lineTo(290, 12);
    ctx.lineTo(240, 6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Passenger Cabin Windows Strip
    ctx.fillStyle = '#0F172A';
    for (let wx = -180; wx <= 200; wx += 28) {
      ctx.beginPath();
      ctx.roundRect(wx, -14, 15, 20, 4);
      ctx.fill();
    }

    endCutout();

    // 3. High-Voltage Direct Lightning Strike on Airplane Nose & Wingtip!
    const isStriking = (Math.sin(t * 11) > 0.45);
    if (isStriking) {
      // Main bolt striking nose
      PixelFX.drawLightningArc(280, -450, 310, -10, 4, '#38BDF8');
      // Secondary fork hitting wingtip
      PixelFX.drawLightningArc(40, -420, 60, -240, 3, '#FFE600');
      // Sparks at contact points
      PixelFX.drawSparks(t, 310, -10, 24, '#38BDF8');
      PixelFX.drawSparks(t, 60, -240, 20, '#FFE600');
    }

    // 4. Live Flight HUD Telemetry Card
    const hudW = 860, hudH = 125;
    ctx.save();
    ctx.translate(-cx, -planeY); // reset to canvas root coordinates
    const hudX = cx - hudW / 2, hudY = cy + 460;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.92)';
    ctx.beginPath();
    ctx.roundRect(hudX, hudY, hudW, hudH, 16);
    ctx.fill();
    ctx.strokeStyle = isStriking ? '#FFE600' : '#38BDF8';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = '900 22px Inter, sans-serif';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'left';
    ctx.fillText('CRUISE TELEMETRY // 35,000 FT ALTITUDE', hudX + 30, hudY + 40);

    ctx.font = '900 34px Inter, sans-serif';
    ctx.fillStyle = isStriking ? '#FFE600' : '#22C55E';
    ctx.textAlign = 'right';
    ctx.fillText(isStriking ? '⚡ LIGHTNING STRIKE DETECTED' : 'SPEED: 850 KM/H // NOMINAL', hudX + hudW - 30, hudY + 45);

    ctx.font = '800 18px Inter, sans-serif';
    ctx.fillStyle = '#CBD5E1';
    ctx.textAlign = 'center';
    ctx.fillText('PASSENGERS 100% PROTECTED BY FARADAY CAGE ALUMINUM SHELL', cx, hudY + 95);
    ctx.restore();

    ctx.restore();
  },

  /** Line 2 & 3: High-Tech Glass Cockpit Avionics & Weather Radar operating safely during storm */
  drawCockpitRadarView(t, cx, cy) {
    drawStormEnvironment(t);

    ctx.save();
    const chW = 920, chH = 820;
    const chX = cx - chW / 2, chY = cy - 380;

    startCutout(50, 0.9, 18, 28);

    // 1. Cockpit Glare-shield & Windshield Frame Structure
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(chX, chY, chW, chH, 24);
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // Windshield Windows (Upper half overlooking violent storm outside)
    const winW = 390, winH = 240, winY = chY + 35;
    // Left Captain Window
    ctx.fillStyle = 'rgba(2, 6, 23, 0.75)';
    ctx.beginPath();
    ctx.roundRect(cx - winW - 20, winY, winW, winH, 12);
    ctx.fill();
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Right First Officer Window
    ctx.beginPath();
    ctx.roundRect(cx + 20, winY, winW, winH, 12);
    ctx.fill();
    ctx.strokeStyle = '#64748B';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Rain / Wind Streaks across cockpit windshields
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 2;
    for (let r = 0; r < 6; r++) {
      const rx = cx - winW - 10 + (r * 68 + t * 450) % winW;
      const ry = winY + 20 + (r * 42) % (winH - 40);
      line([[rx, ry], [rx + 35, ry + 15]], 'rgba(255, 255, 255, 0.22)', 2);

      const rx2 = cx + 30 + (r * 68 + t * 450) % winW;
      const ry2 = winY + 25 + (r * 38) % (winH - 40);
      line([[rx2, ry2], [rx2 + 35, ry2 + 15]], 'rgba(255, 255, 255, 0.22)', 2);
    }

    // Heavy Center Windshield Pillar
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(cx - 18, winY - 10, 36, winH + 20);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - 18, winY - 10, 36, winH + 20);

    // Glareshield Bar Divider
    const barY = winY + winH + 18;
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(chX + 15, barY, chW - 30, 24);

    // Master Caution / Lightning Arrester Annunciator Badge
    const annW = 380, annH = 34;
    ctx.fillStyle = 'rgba(34, 197, 94, 0.18)';
    ctx.beginPath();
    ctx.roundRect(cx - annW / 2, barY - 5, annW, annH, 6);
    ctx.fill();
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '900 18px Inter, sans-serif';
    ctx.fillStyle = '#4ADE80';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ LIGHTNING ARRESTER: 100% NOMINAL', cx, barY + 18);

    // 2. Dual Glass Cockpit Multi-Function Displays (Lower Deck)
    const mfdW = 390, mfdH = 380;
    const mfdY = barY + 45;
    const pfdX = cx - mfdW - 20;
    const ndX = cx + 20;

    // LEFT SCREEN: Primary Flight Display (PFD)
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect(pfdX, mfdY, mfdW, mfdH, 14);
    ctx.fill();
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // PFD Horizon Pitch Ball (Blue Sky / Brown Ground)
    const ballX = pfdX + mfdW / 2, ballY = mfdY + 175, ballRad = 100;
    ctx.save();
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRad, 0, TAU);
    ctx.clip();

    const pitchRoll = Math.sin(t * 2) * 0.05;
    ctx.translate(ballX, ballY);
    ctx.rotate(pitchRoll);

    // Sky
    ctx.fillStyle = '#0284C7';
    ctx.fillRect(-ballRad, -ballRad, ballRad * 2, ballRad);
    // Ground
    ctx.fillStyle = '#78350F';
    ctx.fillRect(-ballRad, 0, ballRad * 2, ballRad);
    // Horizon White Dividing Line
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-ballRad, 0);
    ctx.lineTo(ballRad, 0);
    ctx.stroke();

    // Pitch ladder lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
    ctx.lineWidth = 2;
    line([[-30, -35], [30, -35]], 'rgba(255, 255, 255, 0.65)', 2);
    line([[-30, 35], [30, 35]], 'rgba(255, 255, 255, 0.65)', 2);

    ctx.restore();

    // Yellow Miniature Airplane Reference Symbol (Fixed center)
    ctx.strokeStyle = '#FACC15';
    ctx.lineWidth = 4;
    line([[ballX - 40, ballY], [ballX - 15, ballY]], '#FACC15', 4);
    line([[ballX + 15, ballY], [ballX + 40, ballY]], '#FACC15', 4);
    circle(ballX, ballY, 4, '#FACC15');

    // Airspeed Tape (Left of PFD)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(pfdX + 10, mfdY + 60, 65, 230);
    ctx.font = '900 18px Inter, sans-serif';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'center';
    ctx.fillText('460', pfdX + 42, ballY);
    ctx.font = '800 13px Inter, sans-serif';
    ctx.fillText('KTS', pfdX + 42, ballY + 22);

    // Altitude Tape (Right of PFD)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(pfdX + mfdW - 85, mfdY + 60, 75, 230);
    ctx.font = '900 17px Inter, sans-serif';
    ctx.fillStyle = '#22C55E';
    ctx.fillText('35,000', pfdX + mfdW - 48, ballY);
    ctx.font = '800 13px Inter, sans-serif';
    ctx.fillText('FT', pfdX + mfdW - 48, ballY + 22);

    // PFD Header
    ctx.font = '900 15px Inter, sans-serif';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'center';
    ctx.fillText('PFD // AUTOPILOT 1 ACTIVE', pfdX + mfdW / 2, mfdY + 35);

    // RIGHT SCREEN: Weather Radar & Navigation Display (ND)
    ctx.fillStyle = '#020617';
    ctx.beginPath();
    ctx.roundRect(ndX, mfdY, mfdW, mfdH, 14);
    ctx.fill();
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    const ndCX = ndX + mfdW / 2, ndCY = mfdY + 270;

    // Range rings
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
    ctx.lineWidth = 1.5;
    [60, 120, 180].forEach((r) => {
      ctx.beginPath();
      ctx.arc(ndCX, ndCY, r, Math.PI * 1.15, Math.PI * 1.85);
      ctx.stroke();
    });

    // Radar Convective Storm Echo Blobs (Yellow, Red, Magenta storm cells)
    const blob1X = ndCX - 35 + Math.sin(t * 0.8) * 8;
    const blob1Y = ndCY - 130;
    circle(blob1X, blob1Y, 40, 'rgba(234, 179, 8, 0.35)');
    circle(blob1X + 10, blob1Y - 10, 24, 'rgba(239, 68, 68, 0.55)');
    circle(blob1X + 15, blob1Y - 15, 12, 'rgba(217, 70, 239, 0.65)');

    // Sweeping Radar Beam
    const sweepAngle = Math.PI * 1.15 + ((t * 1.2) % 1) * (Math.PI * 0.70);
    const swX = ndCX + Math.cos(sweepAngle) * 200;
    const swY = ndCY + Math.sin(sweepAngle) * 200;
    line([[ndCX, ndCY], [swX, swY]], 'rgba(0, 240, 255, 0.65)', 2.5);

    // Airplane Icon at center bottom
    circle(ndCX, ndCY - 8, 6, '#38BDF8');

    // ND Header & Status
    ctx.font = '900 15px Inter, sans-serif';
    ctx.fillStyle = '#F59E0B';
    ctx.textAlign = 'center';
    ctx.fillText('WXR // DOPPLER RADAR 40 NM', ndCX, mfdY + 35);

    ctx.font = '800 13px Inter, sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('RANGE: 40 NM  //  TILT: -1.5°', ndCX, mfdY + mfdH - 18);

    endCutout();

    // 3. Telemetry HUD Card
    const hudW = 860, hudH = 130;
    const hudX = cx - hudW / 2, hudY = cy + 470;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
    ctx.beginPath();
    ctx.roundRect(hudX, hudY, hudW, hudH, 16);
    ctx.fill();
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = '900 22px Inter, sans-serif';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'left';
    ctx.fillText('AVIONICS INTEGRITY // 100% SHIELDED', hudX + 30, hudY + 40);

    ctx.font = '900 32px Inter, sans-serif';
    ctx.fillStyle = '#22C55E';
    ctx.textAlign = 'right';
    ctx.fillText('NO CRASH // ZERO GLITCH', hudX + hudW - 30, hudY + 45);

    ctx.font = '800 19px Inter, sans-serif';
    ctx.fillStyle = '#E2E8F0';
    ctx.textAlign = 'center';
    ctx.fillText('SURGE ARRESTERS & COAXIAL CAGES PREVENT HIGH-VOLTAGE CURRENT IN COMPUTERS', cx, hudY + 95);

    ctx.restore();
  },

  /** Line 3, 4 & 5: Faraday Cage Aluminum Skin Current Conduction Mesh */
  drawFaradayCageSkin(t, cx, cy) {
    drawStormEnvironment(t);

    ctx.save();
    const shW = 900, shH = 820;
    const shX = cx - shW / 2, shY = cy - 380;

    startCutout(50, 0.9, 18, 28);

    // 1. Aircraft Cross-Section Cutaway Chassis
    ctx.fillStyle = '#0F172A';
    ctx.beginPath();
    ctx.roundRect(shX, shY, shW, shH, 24);
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    // 2. Safe Passenger Cabin Interior (Inside the cage - ZERO current!)
    const cabW = shW - 140, cabH = shH - 140;
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(cx - cabW / 2, cy - cabH / 2, cabW, cabH, 16);
    ctx.fill();
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Passenger Silhouette inside safe cabin
    ctx.fillStyle = '#64748B';
    circle(cx, cy - 40, 48, '#64748B');
    ctx.beginPath();
    ctx.roundRect(cx - 70, cy + 20, 140, 110, 18);
    ctx.fill();

    // Shield Badge inside cabin
    ctx.font = '900 24px Inter, sans-serif';
    ctx.fillStyle = '#34D399';
    ctx.textAlign = 'center';
    ctx.fillText('🛡️ 0 VOLTS INSIDE CABIN // SAFE', cx, cy + 90);

    // 3. Outer Aluminum Skin (Electrified Faraday Mesh flowing with millions of volts!)
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 6;
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 18;

    // Glowing electrical current mesh running along outer perimeter
    ctx.beginPath();
    ctx.roundRect(shX + 15, shY + 15, shW - 30, shH - 30, 20);
    ctx.stroke();

    // High-frequency current pulses traveling along skin
    const pulseP = (t * 4) % 1;
    for (let a = 0; a < TAU; a += TAU / 12) {
      const px = cx + Math.cos(a + pulseP * TAU) * (shW * 0.46);
      const py = cy + Math.sin(a + pulseP * TAU) * (shH * 0.44);
      circle(px, py, 12, '#FFFFFF');
      circle(px, py, 20, 'rgba(0, 240, 255, 0.45)');
    }
    ctx.restore();

    // Lightning discharge sparks branching on outer boundary
    PixelFX.drawSparks(t, shX + 40, cy, 16, '#00F0FF');
    PixelFX.drawSparks(t, shX + shW - 40, cy, 16, '#38BDF8');

    endCutout();

    // 4. Faraday Physics Law Telemetry Card
    const hudW = 860, hudH = 130;
    const hudX = cx - hudW / 2, hudY = cy + 470;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
    ctx.beginPath();
    ctx.roundRect(hudX, hudY, hudW, hudH, 16);
    ctx.fill();
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = '900 22px Inter, sans-serif';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'left';
    ctx.fillText('PHYSICS LAW // FARADAY CAGE CONDUCTIVE SHIELD', hudX + 30, hudY + 40);

    ctx.font = '900 32px Inter, sans-serif';
    ctx.fillStyle = '#FFE600';
    ctx.textAlign = 'right';
    ctx.fillText('1,000,000 VOLTS SKIMS EXTERIOR', hudX + hudW - 30, hudY + 45);

    ctx.font = '800 19px Inter, sans-serif';
    ctx.fillStyle = '#E2E8F0';
    ctx.textAlign = 'center';
    ctx.fillText('CURRENT FLOWS AROUND METALLIC CONTOUR WITHOUT ENTERING INTERIOR', cx, hudY + 95);

    ctx.restore();
  },

  /** Line 6: Wingtip Static Discharge Wicks safely dissipating charge into clouds */
  drawStaticDischargeWicks(t, cx, cy) {
    drawStormEnvironment(t);

    ctx.save();
    const chW = 900, chH = 820;
    const chX = cx - chW / 2, chY = cy - 380;

    startCutout(50, 0.9, 18, 28);

    // Wingtip Aerodynamic Fairing & Navigation Strobe Light
    ctx.fillStyle = '#1E293B';
    ctx.beginPath();
    ctx.roundRect(chX, chY, chW, chH, 24);
    ctx.fill();
    ctx.strokeStyle = '#38BDF8';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Giant Tapered Wing Trailing Edge (Brushed Aluminum)
    const wingEdgeGrad = ctx.createLinearGradient(chX, cy - 150, chX + chW, cy + 150);
    wingEdgeGrad.addColorStop(0, '#E2E8F0');
    wingEdgeGrad.addColorStop(0.5, '#94A3B8');
    wingEdgeGrad.addColorStop(1, '#475569');
    ctx.fillStyle = wingEdgeGrad;

    ctx.beginPath();
    ctx.moveTo(chX + 60, cy - 180);
    ctx.lineTo(cx + 140, cy - 100);
    ctx.lineTo(chX + 60, cy + 180);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Needle-like Static Discharge Wicks projecting backwards
    const wickYPositions = [cy - 90, cy, cy + 90];
    wickYPositions.forEach((wy) => {
      // Metal Wick Base
      ctx.fillStyle = '#F59E0B';
      ctx.fillRect(cx + 130, wy - 6, 40, 12);

      // Fine Carbon-fiber Wick Needle
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 4;
      line([[cx + 170, wy], [cx + 340, wy]], '#FFFFFF', 4);

      // Corona Discharge Streamers releasing energy into air!
      PixelFX.drawSparks(t, cx + 340, wy, 24, '#00F0FF');
      PixelFX.drawSparks(t, cx + 340, wy, 16, '#FFE600');
    });

    // Strobe Beacon Light
    const strobe = (Math.sin(t * 16) > 0.8);
    circle(cx + 80, cy - 120, 16, strobe ? '#FF0055' : '#880022');

    endCutout();

    // Status Telemetry Card
    const hudW = 860, hudH = 130;
    const hudX = cx - hudW / 2, hudY = cy + 470;

    ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
    ctx.beginPath();
    ctx.roundRect(hudX, hudY, hudW, hudH, 16);
    ctx.fill();
    ctx.strokeStyle = '#22C55E';
    ctx.lineWidth = 3.5;
    ctx.stroke();

    ctx.font = '900 24px Inter, sans-serif';
    ctx.fillStyle = '#22C55E';
    ctx.textAlign = 'center';
    ctx.fillText('✅ STATIC DISCHARGE WICKS // CHARGE DISSIPATED', cx, hudY + 50);

    ctx.font = '800 19px Inter, sans-serif';
    ctx.fillStyle = '#DCFCE7';
    ctx.fillText('RESIDUAL CURRENT DISCHARGED SAFELY INTO ATMOSPHERE WITHIN SECONDS', cx, hudY + 95);

    ctx.restore();
  }
};
