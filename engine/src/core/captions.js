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
  // Spoken voiceover captions disabled per user request:
  // Eliminates subtitle overlap completely and gives 100% clean screen space to topic graphics & scientific cards.
  return;
}
