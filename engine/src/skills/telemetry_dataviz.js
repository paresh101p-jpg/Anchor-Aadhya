// TELEMETRY & LIVE DATA-VIZ SKILL (100% Free Offline)
// Draws real-time medical monitors, live ECG waveforms, digital counters, and telemetry HUDs.

import { ctx, W, H, TAU, clamp, lerp, countUp } from '../core/lib.js';

export const TelemetrySkill = {
  /** Live Medical Heart Rate Monitor with sweeping ECG waveform and digital BPM */
  drawECGMonitor(t, cx, cy, w = 480, h = 180, bpm = 45, status = 'DIVING BRADYCARDIA ACTIVATED') {
    ctx.save();
    // 1. Dark monitor background container with cyan/green medical border
    ctx.fillStyle = 'rgba(2, 14, 18, 0.90)';
    ctx.beginPath();
    ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 14);
    ctx.fill();
    ctx.strokeStyle = '#10B981';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // 2. Grid lines
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.15)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = cx - w / 2 + 20; x < cx + w / 2; x += 30) {
      ctx.moveTo(x, cy - h / 2 + 10); ctx.lineTo(x, cy + h / 2 - 10);
    }
    for (let y = cy - h / 2 + 15; y < cy + h / 2; y += 30) {
      ctx.moveTo(cx - w / 2 + 10, y); ctx.lineTo(cx + w / 2 - 10, y);
    }
    ctx.stroke();

    // 3. Sweeping ECG Cardiac Waveform (P-Q-R-S-T complex)
    ctx.save();
    ctx.beginPath();
    ctx.rect(cx - w / 2 + 15, cy - h / 2 + 10, w - 30, h - 20);
    ctx.clip();

    ctx.strokeStyle = '#34D399';
    ctx.lineWidth = 3.5;
    ctx.shadowColor = '#34D399';
    ctx.shadowBlur = 12;
    ctx.beginPath();

    const startX = cx - w / 2 + 20;
    const endX = cx + w / 2 - 20;
    const baseLine = cy + 15;
    const beatCycle = 60 / Math.max(20, bpm); // cycle duration per beat
    const beatPhase = (t % beatCycle) / beatCycle;

    for (let x = startX; x <= endX; x += 4) {
      const p = (x - startX) / (endX - startX);
      const phase = (p + t * (bpm / 60) * 0.45) % 1;
      let yOffset = 0;

      // Synthesize ECG waveform
      if (phase > 0.20 && phase < 0.26) {
        // P-wave
        yOffset = -Math.sin((phase - 0.20) / 0.06 * Math.PI) * 14;
      } else if (phase >= 0.26 && phase < 0.28) {
        // Q-drop
        yOffset = 12;
      } else if (phase >= 0.28 && phase < 0.33) {
        // R-peak (sharp systolic spike)
        const rp = (phase - 0.28) / 0.05;
        yOffset = rp < 0.5 ? lerp(0, -68, rp * 2) : lerp(-68, 18, (rp - 0.5) * 2);
      } else if (phase >= 0.33 && phase < 0.36) {
        // S-drop
        yOffset = 22;
      } else if (phase > 0.42 && phase < 0.54) {
        // T-wave
        yOffset = -Math.sin((phase - 0.42) / 0.12 * Math.PI) * 24;
      }

      const py = baseLine + yOffset;
      if (x === startX) ctx.moveTo(x, py);
      else ctx.lineTo(x, py);
    }
    ctx.stroke();
    ctx.restore();

    // 4. Digital Header & Live BPM readout
    ctx.font = '900 18px Inter, sans-serif';
    ctx.fillStyle = '#A7F3D0';
    ctx.textAlign = 'left';
    ctx.fillText('CARDIAC MONITOR // ECG', cx - w / 2 + 25, cy - h / 2 + 30);

    // Blinking Green Heart Beat Dot
    const blink = Math.sin(t * (bpm / 60) * TAU) > 0.7;
    ctx.fillStyle = blink ? '#EF4444' : '#059669';
    ctx.beginPath();
    ctx.arc(cx + w / 2 - 130, cy - h / 2 + 25, 7, 0, TAU);
    ctx.fill();

    // Big Digital BPM Number
    ctx.font = '900 38px Inter, sans-serif';
    ctx.fillStyle = bpm < 50 ? '#38BDF8' : '#34D399';
    ctx.textAlign = 'right';
    ctx.fillText(`${Math.round(bpm)} BPM`, cx + w / 2 - 25, cy - h / 2 + 36);

    // Sub-status Banner
    ctx.font = '800 15px Inter, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.textAlign = 'center';
    ctx.fillText(status, cx, cy + h / 2 - 14);

    ctx.restore();
  },

  /** Oxygen Reserve & Survival Battery Gauge */
  drawOxygenGauge(t, cx, cy, w = 440, h = 75, pct = 88) {
    ctx.save();
    ctx.fillStyle = 'rgba(6, 18, 30, 0.88)';
    ctx.beginPath();
    ctx.roundRect(cx - w / 2, cy - h / 2, w, h, 12);
    ctx.fill();
    ctx.strokeStyle = '#0284C7';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Header label
    ctx.font = '900 16px Inter, sans-serif';
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'left';
    ctx.fillText('OXYGEN RESERVE (VITAL CORE)', cx - w / 2 + 20, cy - 12);

    // Digital percentage
    ctx.font = '900 22px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillStyle = pct > 50 ? '#38BDF8' : '#F59E0B';
    ctx.fillText(`${Math.round(pct)}%`, cx + w / 2 - 20, cy - 10);

    // Segmented LED Progress Bar
    const barW = w - 40;
    const barH = 18;
    const startX = cx - w / 2 + 20;
    const startY = cy + 12;

    const segments = 20;
    const activeSegs = Math.floor(segments * (pct / 100));
    const segW = (barW - (segments - 1) * 3) / segments;

    for (let s = 0; s < segments; s++) {
      const sx = startX + s * (segW + 3);
      ctx.fillStyle = s < activeSegs ? (s > 14 ? '#0284C7' : '#06B6D4') : 'rgba(255, 255, 255, 0.12)';
      ctx.fillRect(sx, startY, segW, barH);
    }

    ctx.restore();
  }
};
