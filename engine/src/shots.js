// SHOT BUILDER: one shot per narration line. Visuals are drawn from the SPOKEN WORDS themselves,
// so every line shows the object/action it talks about (and only that). No hardcoded gum reel.
import { ctx, C, W, H } from './core/lib.js';
import { L, T, lineWords } from './core/timing.js';
import { drawSemanticScene, elementKeysFor } from './semantics.js';
import { COUPLE_CAM, COUPLE_SPEAKERS } from './couple_scenes.js';

export function buildShots(script = {}) {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const n = (script.lines || []).length || 1;

  for (let i = 0; i < n; i++) {
    const st = cut(i);
    const dur = (i + 1 < n ? L(i + 1) - 0.08 : T.dur) - st;
    const text = String((script.lines || [])[i]?.text || '');
    const isCouple = script.id === 'couple_first_reel';
    const speaker = isCouple ? (COUPLE_SPEAKERS[i] || 'both') : null;
    add({
      id: `S${String(i + 1).padStart(2, '0')}`,
      at: st,
      cam: isCouple ? COUPLE_CAM[speaker] : [540, 900],
      zoom: isCouple ? (speaker === 'both' ? 0.12 : 0.8) : 0.02,
      zoomFast: isCouple,
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
