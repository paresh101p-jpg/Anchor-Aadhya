// TOPIC-DRIVEN 2D SHOTS: every narration line renders a real scene of its own subject.
// Visuals come from scenes.js (actual drawings), never from hardcoded gum art or abstract circles.
import { ctx, C, W, H, clamp, seg, eo, eio } from './core/lib.js';
import { L, T, lineWords } from './core/timing.js';
import { drawTopicScene } from './scenes.js';

export function buildShots(script = {}) {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const id = script.id || 'gum_swallow';
  const n = (script.lines || []).length || 1;

  for (let i = 0; i < n; i++) {
    const st = cut(i);
    const dur = (i + 1 < n ? L(i + 1) - 0.08 : T.dur) - st;
    add({
      id: `S${String(i + 1).padStart(2, '0')}`,
      at: st,
      cam: [540, 900],
      zoom: 0.02,
      note: `${id} | line ${i + 1} topic scene`,
      draw(lt, d, t) {
        if (!drawTopicScene(id, i, script, t, lt, d)) {
          ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
        }
      },
    });
    cue(st, 'whoosh', { gain: 0.4 });
    if (/[?！!]/.test(String((script.lines || [])[i]?.text || ''))) cue(st + 0.15, 'pop', { gain: 0.35 });
    lineWords(i).slice(0, 3).forEach((w) => cue(w.s, 'pop', { gain: 0.22 }));
  }
  return { shots: S, cues: CUES };
}
