// Captions: 1-3 words, Inter Black / Noto Sans Devanagari, white with crisp dark outline, ONE yellow word, center lower third.
// Each script line has "caps": "WHAT IF *YOU | SWALLOW *GUM?" ("|" = next caption, "*" = the yellow word).
// Without "caps", the line is chunked automatically with Unicode-aware Hindi length detection.
import { ctx, C, clamp, lerp, seg, eob } from './lib.js';
import { T, lineWords } from './timing.js';

export const CAP = { y: 1420, size: 80, maxW: 900 };
let caps = [];

function autoChunks(text) {
  const ws = text.split(/\s+/).filter(Boolean), out = [];
  for (let i = 0; i < ws.length;) {
    const n = ws.length - i === 4 ? 2 : Math.min(3, ws.length - i);
    out.push(ws.slice(i, i + n));
    i += n;
  }
  return out.map((c) => {
    // Unicode-aware word length for Devanagari & Latin
    const k = c.reduce((b, w, j) => {
      const curLen = w.replace(/[^\p{L}\p{N}]/gu, '').length;
      const bestLen = c[b].replace(/[^\p{L}\p{N}]/gu, '').length;
      return curLen > bestLen ? j : b;
    }, 0);
    return c.map((w, j) => (j === k ? '*' + w : w)).join(' ');
  });
}

export function buildCaptions(script) {
  caps = [];
  script.lines.forEach((ln, i) => {
    const chunks = (ln.caps ? ln.caps.split('|') : autoChunks(ln.text)).map((s) => s.trim()).filter(Boolean);
    const ws = lineWords(i); if (!ws.length) return;
    const counts = chunks.map((c) => c.split(/\s+/).length), N = counts.reduce((a, b) => a + b, 0);
    const nm = (w) => String(w).toLowerCase().replace(/[^\p{L}\p{N}']+/gu, '');
    let acc = 0, from = 0;
    chunks.forEach((c, j) => {
      const first = nm(c.split(/\s+/)[0]);
      let idx = j === 0 ? 0 : ws.findIndex((w, k) => k > from && first && (nm(w.w) === first || (first.length > 2 && nm(w.w).startsWith(first))));
      if (idx < 0) idx = Math.max(from + (j ? 1 : 0), Math.min(ws.length - 1, Math.round(acc * ws.length / N)));
      acc += counts[j]; from = idx;

      const wordsInChunk = c.split(/\s+/).map((w, wi) => {
        const wMatch = ws[Math.min(ws.length - 1, idx + wi)];
        return {
          txt: w.replace('*', ''),
          hi: w.startsWith('*'),
          s: wMatch ? wMatch.s : ws[idx].s + wi * 0.25,
          e: wMatch ? wMatch.e : ws[idx].s + (wi + 1) * 0.25,
        };
      });

      caps.push({ line: i, s: ws[idx].s - 0.05, words: wordsInChunk });
    });
  });
  caps.forEach((c, k) => {
    const next = caps[k + 1], lineEnd = T.lines[c.line].end;
    c.e = next ? (next.s - lineEnd > 0.7 && next.line !== c.line ? lineEnd + 0.35 : next.s) : T.dur;
  });
  return caps;
}
export const captionList = () => caps;

export function drawCaption(t) {
  const c = caps.find((c) => t >= c.s && t < c.e); if (!c) return;
  const lt = t - c.s, size = CAP.size;

  // STRICT 0px letterSpacing for Devanagari text so characters and matras NEVER collide!
  ctx.font = `900 ${size}px Inter, "Noto Sans Devanagari", "Mangal", "Nirmala UI", sans-serif`;
  ctx.letterSpacing = '0px';

  // Generous spacing between words so outlines never bleed into adjacent words
  const sp = size * 0.36;
  c.words.forEach((w) => (w.w = ctx.measureText(w.txt).width));
  const width = (ws) => ws.reduce((a, w) => a + w.w, 0) + sp * (ws.length - 1);

  let lines = [c.words];
  if (width(c.words) > CAP.maxW && c.words.length > 1) {
    let best = null;
    for (let i = 1; i < c.words.length; i++) {
      const a = c.words.slice(0, i), b = c.words.slice(i);
      const m = Math.max(width(a), width(b));
      if (!best || m < best.m) best = { m, l: [a, b] };
    }
    lines = best.l;
  }

  const maxLineW = Math.max(...lines.map(width));
  const fit = Math.min(1, CAP.maxW / maxLineW);
  const sc = (lt < 0.18 ? lerp(0.82, 1, eob(seg(lt, 0, 0.18))) : 1) * fit;

  ctx.save();
  ctx.translate(540, CAP.y);
  ctx.scale(sc, sc);
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'left';
  ctx.lineJoin = 'round';

  // Devanagari line height (1.36x) provides full clearance so matras on line 2 never touch line 1
  const lh = size * 1.36;
  const y0 = -(lines.length - 1) * lh / 2;

  lines.forEach((ln, li) => {
    // Measure line text as whole string to guarantee accurate bounding box
    const lineText = ln.map((w) => w.txt).join(' ');
    const stringW = ctx.measureText(lineText).width;
    const lw = Math.max(width(ln), stringW);
    const lineY = y0 + li * lh;

    // Dark pill container with generous 42px padding: text NEVER overflows or touches pill borders!
    const padX = 42;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.90)';
    ctx.beginPath();
    ctx.roundRect(-lw / 2 - padX, lineY - lh * 0.44, lw + padX * 2, lh * 0.88, 22);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    let x = -lw / 2;
    for (const w of ln) {
      // Kinetic Word-Level Animation: Active spoken word springs up dynamically!
      const isActiveWord = (t >= w.s && t <= w.e);
      const wProgress = clamp((t - w.s) / Math.max(0.01, (w.e - w.s)));
      const wScale = isActiveWord ? (1 + 0.14 * Math.sin(wProgress * Math.PI)) : 1.0;

      ctx.save();
      ctx.translate(x + w.w / 2, lineY);
      ctx.scale(wScale, wScale);

      // Micro-glow behind the currently spoken word
      if (isActiveWord) {
        ctx.fillStyle = 'rgba(255, 230, 0, 0.25)';
        ctx.beginPath();
        ctx.roundRect(-w.w / 2 - 6, -lh * 0.40, w.w + 12, lh * 0.80, 10);
        ctx.fill();
      }

      // 8px crisp black outline - strong legibility without character bleed
      ctx.lineWidth = isActiveWord ? 9 : 7;
      ctx.strokeStyle = '#000000';
      ctx.strokeText(w.txt, -w.w / 2, 0);

      // Currently spoken word lights up bright neon yellow, keywords stay gold, others pure white
      ctx.fillStyle = isActiveWord ? '#FFE600' : (w.hi ? '#FFD700' : '#FFFFFF');
      ctx.fillText(w.txt, -w.w / 2, 0);

      ctx.restore();
      x += w.w + sp;
    }
  });

  ctx.restore();
}
