// MULTI-SKILL FUSION DIRECTOR (100% Free Offline Engine)
// Orchestrates 3 to 5 simultaneous skills per line:
// 1. Hero Subject Skill (Bio / Mech / Fluid)
// 2. Live Telemetry & Data-Viz (ECG Monitor, BPM drop 80->42, Oxygen Gauge)
// 3. Environmental & Thermal FX (Ice Frost, Blueprints, Heatmaps)
// 4. PixelFX Particles (Bubbles, Sparks, Steam, Currency, Lightning)
// ZERO CROSS-CONTAMINATION GUARANTEE: Never mixes space/black holes into biology!

import { TelemetrySkill } from './telemetry_dataviz.js';
import { ThermalSkill } from './thermal_environmental.js';
import { BioSkill } from './bio_anatomical.js';
import { TechSkill } from './tech_mechanical.js';
import { AviationSkill } from './aviation_lightning.js';
import { PixelFX } from '../core/pixelfx.js';
import * as Cinema from '../cinematic_scenes.js';
import { ctx, W, H, lerp, clamp } from '../core/lib.js';

export function composeMultiSkillScene(script, lineIdx, lineText, isLastLine) {
  // Outro is strictly reserved for the final line by shots.js getOutroScene
  if (isLastLine) {
    return null;
  }

  const text = String(lineText || '').toLowerCase();
  const id = String(script.id || '').toLowerCase();

  // 1. BIOLOGY / MEDICAL / COLD WATER DIVE REFLEX TOPIC
  if (/mammalian_dive|dive_reflex|diving_reflex|ice_water_dive/i.test(id) || (/गोता|डाइव/i.test(text) && /रिफ्लेक्स|चेहरा/i.test(text))) {
    return (lt, d, t, subIdx) => {
      // Skill A: Environmental Frost Shading
      ThermalSkill.drawFrostVignette(t, 0.75);

      // Line-specific multi-skill layering
      if (/चेहरा|बर्फीले|डूबता|ठंडा|ice|face|water/i.test(text)) {
        // Skill B: Thermal Head & Cold Water Face Submersion
        ThermalSkill.drawThermalFaceProfile(t, 540, 680, 0.85);
        // Skill C: Aquatic Air Bubbles
        PixelFX.drawBubbles(t, 540, 720, 480, 500, 20);
        // Skill D: Telemetry Temperature Meter
        TelemetrySkill.drawOxygenGauge(t, 540, 1140, 480, 75, 92);
      } else if (/दिल|धड़कन|धीमी|bradycardia|ecg|pulse|heart/i.test(text)) {
        // Dynamic BPM drop: 80 down to 42 BPM
        const progress = clamp(lt / Math.max(d, 0.01));
        const bpm = lerp(78, 42, progress);

        // Skill B: Anatomical Beating Human Heart
        BioSkill.drawAnatomicalHeart(t, 540, 620, bpm);
        // Skill C: Live Real-Time ECG Medical Monitor
        TelemetrySkill.drawECGMonitor(t, 540, 1020, 500, 180, bpm, 'BRADYCARDIA // HEART RATE HALVED');
        // Skill D: Oxygen Battery
        TelemetrySkill.drawOxygenGauge(t, 540, 1150, 500, 70, 88);
      } else if (/नसें|सिकुड़|वेसोकॉन्स|रक्त|प्रवाह|vessels|constriction/i.test(text)) {
        // Skill B: Microvascular Artery Constriction
        BioSkill.drawVascularConstriction(t, 540, 660, 0.70);
        // Skill C: Live ECG Monitor (steady low 42 BPM)
        TelemetrySkill.drawECGMonitor(t, 540, 1060, 500, 170, 42, 'PERIPHERAL VASOCONSTRICTION');
      } else if (/दिमाग|न्यूरो|सिग्नल|नर्व|brain|nerve/i.test(text)) {
        // Skill B: Bio-electric Brain Synapse firing
        Cinema.drawHumanBrainSynapse(lt, d, t);
        // Skill C: Telemetry
        TelemetrySkill.drawOxygenGauge(t, 540, 1140, 480, 75, 84);
      } else {
        // Balanced Default Body Layering
        BioSkill.drawAnatomicalHeart(t, 540, 640, 48);
        TelemetrySkill.drawECGMonitor(t, 540, 1040, 500, 175, 48, 'MAMMALIAN DIVE REFLEX ACTIVE');
        PixelFX.drawBubbles(t, 540, 700, 450, 400, 15);
      }
    };
  }

  // 2. ATM CASH & BANKING TECHNOLOGY TOPIC
  if (/atm_cash|atm_dispenser|atm_reject|cash_dispense/i.test(id) || (/एटीएम|atm/i.test(text) && /कैश|नोट|रुपये|पैसे|करेंसी/i.test(text))) {
    return (lt, d, t, subIdx) => {
      TechSkill.drawFullVaultEnvironment(t);
      if (lineIdx === 0 || /कार्ड|शुरू|काउंटडाउन|card|insert/i.test(text)) {
        TechSkill.drawAtmCardSlotCountdown(t, 540, 650, lt, d);
      } else if (/चिपके|रिजेक्ट|नकली|रोक|reject|stuck|vault/i.test(text)) {
        TechSkill.drawAtmRejectDiverterGate(t, 540, 650);
      } else if (/गेट|हाथ में आते|कड़क नोट|डिस्पेंस|dispense|shutter/i.test(text)) {
        TechSkill.drawAtmDispenserGate(t, 540, 650);
      } else {
        TechSkill.drawAtmOpticalThicknessScanner(t, 540, 650);
      }
    };
  }

  // 3. AIRPLANE & LIGHTNING DISASTER / AVIATION SCIENCE TOPIC
  if (/airplane_lightning|aircraft_lightning|aviation_storm/i.test(id) || (/विमान|हवाई\s*जहाज|फ्लाइट/i.test(text) && /बिजली|lightning/i.test(text))) {
    return (lt, d, t, subIdx) => {
      if (/क्रैश|crash|बचते|नहीं होती|cockpit|पायलट/i.test(text)) {
        AviationSkill.drawCockpitRadarView(t, 540, 680);
      } else if (/फैराडे|केज|faraday|cage|एल्युमिनियम|aluminum|स्किन|skin|करेंट|करंट|volts|volt|conductive|बॉडी/i.test(text)) {
        AviationSkill.drawFaradayCageSkin(t, 540, 680);
      } else if (/विस्क|डिस्चार्ज|wicks|static|विंग्स|हवा में/i.test(text)) {
        AviationSkill.drawStaticDischargeWicks(t, 540, 680);
      } else {
        // Giant airliner in storm with lightning strike & sub-shot zoom
        AviationSkill.drawAirlinerLightningStrike(t, 540, 680, lt, subIdx);
      }
    };
  }

  // 4. KOLA BOREHOLE & DRILL TOPIC
  if (/kola|बोरहोल|12,262/i.test(id)) {
    return (lt, d, t, subIdx) => {
      Cinema.drawKolaBoreholeDrillDepth(lt, d, t);
    };
  }

  // If none of the specialized multi-skills match, return null so shots.js uses direct object mapping & thematic pools
  return null;
}
