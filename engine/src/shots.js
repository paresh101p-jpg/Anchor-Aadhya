// TOPIC-DRIVEN 2D SHOT BUILDER.
// Every narration line becomes its own scene. Words, highlighted keywords, danger/question flags and
// the topic hash decide the backdrop and motion, so a new topic never reuses the old gum visuals.
import { ctx, C, W, H, clamp, lerp, seg, eo, eio, eob, rnd, fillAll, circle, ell, line, bigText } from './core/lib.js';
import { L, T, lineWords } from './core/timing.js';
import * as K from './core/kit.js';

const DANGER = /(खतर|गलती|मत\s|नहीं|सावधान|फट|ब्लास्ट|दबाव|हमला|चोट|जानलेवा|ध्यान|बहरा|दर्द|तकलीफ|संकट)/;
const QUESTION = /[?？]|^(क्या|क्यों|कैसे|कहाँ|कब)/;

function hash(s = '') {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return Math.abs(h >>> 0);
}

function lineInfo(script, i) {
  const ln = (script.lines && script.lines[i]) || { text: '', caps: '' };
  const words = lineWords(i);
  const starred = [...String(ln.caps || '').matchAll(/\*([^*|]+)/g)].map((m) => m[1].trim()).filter(Boolean);
  const main = (starred[0] || (words[0] && words[0].w) || String(script.title || '?').split(/\s+/)[0] || '?').replace(/[।.!?]+$/, '');
  return {
    ln,
    words,
    starred,
    main,
    danger: DANGER.test(String(ln.text || '')),
    question: QUESTION.test(String(ln.text || '').trim()),
  };
}

function backdrop(style, t, seed) {
  if (style === 0) { K.room(); return; }
  if (style === 1) { K.xray(t); return; }
  if (style === 2) {
    fillAll(C.navy);
    for (let k = 0; k < 7; k++) {
      const x = 120 + rnd(seed + k * 5) * 840 + Math.sin(t * (0.7 + k * 0.1) + k) * 60;
      const y = 300 + rnd(seed + k * 9) * 900 + Math.cos(t * (0.6 + k * 0.08) + k) * 50;
      const r = 60 + rnd(seed + k * 13) * 120;
      ctx.globalAlpha = 0.16; circle(x, y, r, k % 2 ? C.cyan : C.pink); ctx.globalAlpha = 1;
    }
    line([[0, 200 + Math.sin(t * 1.3) * 40], [W, 120 + Math.cos(t) * 40]], C.cyan, 6);
    return;
  }
  fillAll(C.bg);
  ctx.globalAlpha = 0.16; circle(540, 760, 430 + Math.sin(t * 1.6) * 20, C.yellow); ctx.globalAlpha = 1;
  ctx.globalAlpha = 0.1; circle(540, 760, 330, C.pink); ctx.globalAlpha = 1;
  for (let k = 0; k < 12; k++) {
    const a = k / 12 * Math.PI * 2 + t * 0.25;
    const x = 540 + Math.cos(a) * 460, y = 760 + Math.sin(a) * 460;
    ctx.globalAlpha = 0.5; circle(x, y, 10 + rnd(seed + k) * 12, k % 3 ? C.cyan : C.red); ctx.globalAlpha = 1;
  }
}

function drawFocus(info, lt, d, t, seed) {
  const { main, danger, question, words, starred } = info;
  const pop = eob(seg(lt, 0, 0.3));
  const size = clamp(1150 / (main.length + 4), 72, 152);
  const bob = Math.sin(lt * 3.2) * 12;
  const color = danger ? C.red : question ? C.yellow : C.white;
  bigText(main, 540, 520 + bob, size, color, -0.02 + Math.sin(lt * 1.7) * 0.015, pop);

  if (danger) {
    const p = eob(seg(lt, 0.1, 0.45));
    K.warning(540, 940, 1.1 * p * (1 + 0.04 * Math.sin(lt * 7)));
    ctx.globalAlpha = 0.35 + 0.25 * Math.sin(lt * 8);
    line([[120, 1180], [960, 1180]], C.red, 10);
    ctx.globalAlpha = 1;
  } else if (question) {
    bigText('?', 870, 830 + Math.sin(lt * 4) * 18, 190, C.yellow, 0.12, eob(seg(lt, 0.15, 0.5)));
    K.shockLines(540, 620, 230, clamp((lt - 0.2) * 3) * 0.8);
  } else {
    const pulse = 1 + 0.12 * Math.sin(lt * 5);
    ctx.save(); ctx.translate(540, 930); ctx.scale(pulse, pulse);
    ctx.strokeStyle = C.cyan; ctx.lineWidth = 12; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.arc(0, 0, 150, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = 0.35; ctx.beginPath(); ctx.arc(0, 0, 205, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
    K.burst(540, 930, 1.4 + 0.2 * Math.sin(lt * 6), 0.8);
  }

  // Word chips appear exactly when each word is spoken — this is what makes every topic look different.
  const chips = (starred.length ? starred : words.map((w) => w.w)).slice(0, 6);
  chips.forEach((txt, j) => {
    const w = words[j];
    const on = !w || t >= w.s - 0.05;
    if (!on) return;
    const x = 180 + rnd(seed + j * 3) * 720;
    const y = 1010 + rnd(seed + j * 7) * 180;
    const sc = eob(seg(t, (w ? w.s : lt), (w ? w.s : lt) + 0.22));
    K.pill(String(txt).replace(/[।,.!?]+$/, ''), x, y, 44, j % 2 ? C.ink : C.navy, C.white, sc);
  });
}

function drawAnchor(info, lt, d) {
  const shake = info.danger ? Math.sin(lt * 30) * 4 * Math.max(0, 1 - lt) : 0;
  const arm = info.question ? K.armPose(K.ARM.down, K.ARM.point, eio(seg(lt, 0, 0.5))) : K.ARM.down;
  K.man({
    x: 150 + shake, y: 1120, s: 0.5, arm,
    eyes: info.danger || info.question ? 'wide' : 'n',
    mouth: info.danger ? 'o' : info.question ? 'smirk' : 'smile',
    brow: info.danger ? 1 : 0.2,
  });
}

export function buildShots(script = {}) {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const seed = hash(String(script.title || '') + String(script.id || ''));
  const n = (script.lines || []).length || 1;

  for (let i = 0; i < n; i++) {
    const st = cut(i);
    const info = lineInfo(script, i);
    const style = (i + (seed % 4)) % 4;
    const anchor = i % 2 === 0;
    add({
      id: `S${String(i + 1).padStart(2, '0')}`,
      at: st,
      cam: [540, 820],
      zoom: 0.04 + (i % 3) * 0.02,
      note: `${info.main} | ${info.danger ? 'danger' : info.question ? 'question' : 'explain'} | bg${style}`,
      draw(lt, d, t) {
        backdrop(style, t, seed + i);
        drawFocus(info, lt, d, t, seed + i * 17);
        if (anchor) drawAnchor(info, lt, d);
      },
    });
    cue(st, 'whoosh', { gain: 0.45 });
    if (info.danger) cue(st + 0.12, 'alarm', { dur: Math.min(1.2, Math.max(0.4, d - 0.2)), gain: 0.5 });
    else cue(st + 0.18, 'pop', { gain: 0.4 });
    info.words.slice(0, 4).forEach((w, k) => cue(w.s, 'pop', { gain: 0.25 }));
  }

  return { shots: S, cues: CUES };
}
