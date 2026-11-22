// Boot: fonts → script + timing → captions → shots. Then draw(t) renders film time t (pure function of t).
// window.OP is the API tools/capture.mjs drives: ready, bootError, duration(), draw(t), frame(t, q), cues(), shots().
import { W, H, setCtx, ctx, clamp, eo, eio, cameraShake, drawAudioVisualizer, drawBroadcastFrame } from './core/lib.js';
import { T, loadTiming } from './core/timing.js';
import { buildCaptions, drawCaption, captionList } from './core/captions.js';
import { buildShots } from './shots.js';
import { detectFilmStyle, drawStyleBackground, applyPostProcessing, STYLES } from './core/postprocessing.js';

const cv = document.getElementById('cv');
setCtx(cv.getContext('2d'));
const OP = (window.OP = { ready: false });

function draw(t) {
  t = clamp(t, 0, T.dur - 1e-4);
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1; ctx.letterSpacing = '0px';

  // 1. Dynamic Lemo-Opuscar Topic Background (Unique per topic category)
  const style = OP._style || STYLES.SCIENTIFIC_BLUEPRINT;
  drawStyleBackground(style, t);

  const S = OP._shots; let i = S.length - 1; while (i > 0 && S[i].at > t) i--;
  const sh = S[i], end = i < S.length - 1 ? S[i + 1].at : T.dur, d = end - sh.at, lt = t - sh.at;

  // Cinematic Camera Rig: Handheld breathing + Spring Punch-in on cut
  const punch = 1 + 0.14 * (1 - eo(clamp(lt / 0.30)));
  const driftP = sh.zoomFast ? clamp(lt / 0.4) : clamp(lt / d);
  let scale = punch * (1 + (sh.zoom ?? 0.06) * eio(driftP));
  let [cx, cy] = sh.cam || [540, 900];
  const [shakeX, shakeY] = cameraShake(t, 2.2);
  cx += shakeX; cy += shakeY;
  if (sh.camAt) {
    const [x, y, s] = sh.camAt(clamp(lt / Math.max(d, 0.001)), lt, d);
    cx = x + shakeX; cy = y + shakeY; scale = punch * s;
  }
  if (sh.isMedia) {
    sh.draw(lt, d, t);
  } else if (W > H) {
    // ── 16:9 NATIVE WIDESCREEN BROADCAST ADAPTER ──
    // Center portrait coordinates (540, 640) directly at widescreen center (960, 540)
    // Scale by 1.12x so hero illustration comfortably fills the 1080 height
    ctx.save();
    ctx.translate(W / 2 + shakeX, H / 2 + shakeY);
    ctx.scale(scale * 1.12, scale * 1.12);
    ctx.translate(-540, -640);
    sh.draw(lt, d, t);
    ctx.restore();
  } else {
    // ── 9:16 VERTICAL SHORTS ADAPTER ──
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);
    ctx.translate(-cx, -cy);
    sh.draw(lt, d, t);
    ctx.restore();
  }

  // 2. Multi-Pass Cinematic Post-Processing (Bloom, Chromatic Aberration, Vignette & Grain)
  applyPostProcessing(t, style, lt);

  ctx.globalAlpha = 1; ctx.letterSpacing = '0px';
  if (i > 0 && lt < 0.12) { ctx.fillStyle = '#FFFFFF'; ctx.globalAlpha = 0.55 * (1 - lt / 0.12); ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  // fade from / to black on the first and last 0.25 s
  const fade = Math.min(clamp(t / 0.25), clamp((T.dur - t) / 0.35));
  if (fade < 1) { ctx.fillStyle = '#000'; ctx.globalAlpha = 1 - fade; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  const vizY = H > 1200 ? 1660 : 980;
  drawAudioVisualizer(t, vizY, 95);
  drawBroadcastFrame(t);
  // drawCaption(t); // Spoken speech captions disabled per user request: visual cards take center stage
}

(async () => {
  try {
    await document.fonts.load('900 100px Inter');
    const script = await (await fetch('script.json', { cache: 'no-store' })).json();
    await loadTiming();
    buildCaptions(script);

    // Preload dynamic documentary media if present in engine/media/
    const loadedMedia = {};
    try {
      const mRes = await fetch('media/manifest.json', { cache: 'no-store' });
      if (mRes.ok) {
        const manifest = await mRes.json();
        await Promise.all(Object.entries(manifest).map(([k, info]) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => { loadedMedia[k] = img; resolve(); };
            img.onerror = () => { resolve(); };
            img.src = info.file;
          });
        }));
      }
    } catch (me) {
      console.log('Media manifest load notice:', me);
    }

    const { shots, cues } = buildShots(script, loadedMedia);
    shots.sort((a, b) => a.at - b.at);
    OP._shots = shots; OP.script = script;
    OP._style = detectFilmStyle(script);
    OP.duration = () => T.dur;
    OP.draw = draw;
    OP.frame = (t, q = 0.92) => { draw(t); return cv.toDataURL('image/jpeg', q); };
    OP.shots = () => shots.map((s, i) => ({ id: s.id, at: +s.at.toFixed(3), end: +(i < shots.length - 1 ? shots[i + 1].at : T.dur).toFixed(3), note: s.note || '' }));
    OP.captions = () => captionList().map((c) => ({ s: +c.s.toFixed(3), e: +c.e.toFixed(3), text: c.words.map((w) => (w.hi ? '*' : '') + w.txt).join(' ') }));
    OP.cues = () => cues.slice().sort((a, b) => a.t - b.t);
    OP.ready = true;
    // preview mode (not capture): play in real time, ?t=12.3 to hold a frame
    const q = new URLSearchParams(location.search);
    if (!q.has('capture')) {
      if (q.has('t')) draw(+q.get('t'));
      else {
        const audio = new Audio('data/mix.wav'); let t0 = null;
        const btn = document.getElementById('play'); btn.hidden = false;
        btn.onclick = () => { btn.hidden = true; t0 = performance.now(); audio.currentTime = 0; audio.play().catch(() => {}); };
        const loop = (now) => { const t = t0 == null ? 0 : (now - t0) / 1000; draw(t0 == null ? 0 : t); if (t0 != null && t > T.dur) { t0 = null; btn.hidden = false; } requestAnimationFrame(loop); };
        requestAnimationFrame(loop);
      }
    }
  } catch (e) { OP.bootError = String(e && e.stack || e); console.error(e); }
})();
