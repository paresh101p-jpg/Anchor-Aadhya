// CINEMATIC RAPID-CUT SHOT BUILDER (High-Dopamine 1.5s-2s Cuts)
// Word-level dynamic cuts: every line is split into rapid sub-shots
// synced to the actual spoken words, with camera punch-ins and sound cues.
import { ctx, C, W, H } from './core/lib.js';
import { L, T, lineWords } from './core/timing.js';
import { drawSemanticScene, elementKeysFor } from './semantics.js';
import { COUPLE_SPEAKERS } from './couple_scenes.js';
import * as Cinema from './cinematic_scenes.js';

const CINEMA_POOL = [
  Cinema.drawEarthGlobe,
  Cinema.drawMarianaChasm,
  Cinema.drawMountEverest,
  Cinema.drawSunRays,
  Cinema.drawSubmarineSearchlight,
  Cinema.drawPressureSlam,
  Cinema.drawElephantWeight,
  Cinema.drawAlienCreature,
  Cinema.drawPlasticDiscovery,
  Cinema.drawOutroCTA,
];

const CHERNOBYL_POOL = [
  Cinema.drawChernobylPlant,
  Cinema.drawCountdownTimer,
  Cinema.drawReactorExplosion,
  Cinema.drawCoriumLavaFlow,
  Cinema.drawElephantsFoot,
  Cinema.drawGeigerCounter,
  Cinema.drawCountdownTimer,
  Cinema.drawGeigerCounter,
  Cinema.drawMeltingCameraRobot,
  Cinema.drawElephantsFoot,
  Cinema.drawRadiotrophicFungus,
  Cinema.drawRadiotrophicFungus,
  Cinema.drawChernobylPlant,
  Cinema.drawChernobylOutro,
];

const BLACKHOLE_POOL = [
  Cinema.drawBlackHoleGargantua,
  Cinema.drawEventHorizonLaserGrid,
  Cinema.drawGravitationalLensing,
  Cinema.drawAstronautGravityVectors,
  Cinema.drawSpaghettificationProcess,
  Cinema.drawFrozenTimeDilation,
  Cinema.drawBlackHoleSingularityCTA,
];

export function buildShots(script = {}) {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const n = (script.lines || []).length || 1;

  // Use Rapid-Cut Cinematic Engine for 30s Documentary Shorts
  const isCinematic = script.id === 'mariana_trench_abyss' || script.id === 'chernobyl_300s_room' || script.id === 'black_hole_spaghettification' || script.is_30s || script.is_cinematic;

  if (isCinematic) {
    let pool = CINEMA_POOL;
    if (script.id === 'chernobyl_300s_room') {
      pool = CHERNOBYL_POOL;
    } else if (script.id === 'black_hole_spaghettification') {
      pool = BLACKHOLE_POOL;
    }
    let shotIdx = 0;
    for (let i = 0; i < n; i++) {
      const ws = lineWords(i);
      const text = String((script.lines || [])[i]?.text || '');
      const lineStart = ws.length ? ws[0].s : L(i);
      const lineEnd = ws.length ? ws[ws.length - 1].e : (i + 1 < n ? L(i + 1) : T.dur);

      // Split line into 2 rapid sub-shots if there are enough words
      const cutPoints = [lineStart];
      if (ws.length >= 4) {
        const midIdx = Math.floor(ws.length * 0.5);
        cutPoints.push(ws[midIdx].s);
      }

      cutPoints.forEach((atTime, subIdx) => {
        const drawFn = pool[shotIdx % pool.length];
        const nextAt = subIdx + 1 < cutPoints.length ? cutPoints[subIdx + 1] : lineEnd;
        const shotDur = Math.max(0.8, nextAt - atTime);

        add({
          id: `S${String(shotIdx + 1).padStart(2, '0')}`,
          at: Math.max(0, atTime - 0.04),
          cam: [540, 960],
          zoom: 0.04,
          zoomFast: subIdx > 0,
          note: `Beat ${shotIdx + 1} [Rapid Cut]: ${text.slice(0, 32)}`,
          draw(lt, d, t) {
            if (typeof drawFn === 'function') {
              drawFn(lt, d, t);
            }
          },
        });

        // Dynamic audio cues on every single cut
        cue(atTime, 'whoosh', { gain: 0.45 });
        cue(atTime + 0.05, 'pop', { gain: 0.3 });

        shotIdx++;
      });
    }
    return { shots: S, cues: CUES };
  }

  // Fallback for legacy couple reels
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  for (let i = 0; i < n; i++) {
    const st = cut(i);
    const dur = (i + 1 < n ? L(i + 1) - 0.08 : T.dur) - st;
    const text = String((script.lines || [])[i]?.text || '');
    const isCouple = script.id === 'couple_first_reel';
    const speaker = isCouple ? (COUPLE_SPEAKERS[i] || 'both') : null;
    add({
      id: `S${String(i + 1).padStart(2, '0')}`,
      at: st,
      cam: [540, 925],
      zoom: isCouple ? 0.05 : 0.02,
      zoomFast: false,
      note: isCouple
        ? `line ${i + 1} [${speaker} face close-up]: ${text.slice(0, 44)}`
        : `line ${i + 1} [${elementKeysFor(text).join('+')}]: ${text.slice(0, 44)}`,
      draw(lt, d, t) {
        drawSemanticScene(text, script, i, t, lt, d);
      },
    });
    cue(st, 'whoosh', { gain: 0.4 });
    if (/[?！!]/.test(text)) cue(st + 0.15, 'pop', { gain: 0.35 });
    lineWords(i).slice(0, 3).forEach((w) => cue(w.s, 'pop', { gain: 0.22 }));
  }
  return { shots: S, cues: CUES };
}
