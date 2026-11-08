// Anchor Aadhya 3D Science Explainer Engine (Deep Dive 3D)
// Renders Zack D. Films style 3D medical / curiosity animations in Three.js
import * as THREE from 'three';
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import { camera } from './core/engine.js';
import { Human } from './core/human.js';
import * as SETS from './core/sets.js';
import { label, pill, warning, blackout } from './core/look2d.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const lerpV = (a, b, k) => a.clone().lerp(b, k);
function screen(p, cam) { const v = p.clone().project(cam); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H]; }

export function buildShots(E, script = {}) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const cam = camera(30);
  const KLOOK = { aperture: 0.003, maxblur: 0.01, bloom: 0.2 };
  const XLOOK = { aperture: 0.0015, bloom: 0.55, bloomThreshold: 0.4, vignette: 0.45 };
  const VLOOK = { aperture: 0.005, maxblur: 0.012, bloom: 0.6, bloomThreshold: 0.5, focus: 3.2 };

  // ── 3D Worlds ─────────────────────────────────────────────────────────────
  const K = SETS.kitchen(E), hero = new Human({}); hero.group.position.set(0.1, 0, -0.6); K.scene.add(hero.group);
  const X = SETS.xrayStage(E), xh = new Human({}), xmat = SETS.xrayMaterial(); xh.setBodyMaterial(xmat);
  const I = SETS.insides(); xh.spine.add(I.group); X.scene.add(xh.group);
  const VS = SETS.vessel(E);
  const CYAN = new THREE.Color('#4FD1E8'), RED = new THREE.Color('#FF3B3B'), GOLD = new THREE.Color('#FFD43B');
  const chest = (h, k) => h.parts[0].scale.set(1 + 0.03 * k, 1 + 0.012 * k, 1 + 0.08 * k);
  const lungs = (k) => I.lungs.forEach((l) => l.scale.set(1 + 0.12 * k, 1 + 0.1 * k, 1 + 0.12 * k));
  const reset = () => { hero.pose({}); chest(hero, 0); xh.pose({}); chest(xh, 0); lungs(0); I.heart.scale.setScalar(1); xmat.uniforms.uCol.value.copy(CYAN); };
  const kitchenRender = (focus, extra = {}) => E.render(K.scene, cam, { ...KLOOK, focus, ...extra });
  const FACE = V3(0.1, 1.68, -0.6);

  const topicId = script?.id || 'water_7days';

  // =========================================================================
  // 💧 TOPIC: WATER 7 DAYS (7 दिन तक पानी न पिएं तो क्या होगा?)
  // =========================================================================
  if (topicId === 'water_7days') {
    // 1 · HOOK: 7 Days Without Water? (Kitchen hero holding glass of water, camera pushing in)
    { const st = cut(0);
      add({ id: 'W01', at: st, note: 'Kitchen hero: stares at glass, camera push-in', draw(lt, d, t, blit) {
        reset(); const k = eo(seg(lt, 0.1, 1.2));
        hero.pose({ head: [-4, 6 * k, 0], spine: [-2 * k, 0, 0], lid: -0.1, look: [4, 0], shR: [45 * k, -20 * k, 25 * k], elR: [35 * k, 0, 0] });
        cam.position.copy(lerpV(V3(0.45, 1.74, 0.65), V3(0.28, 1.70, 0.22), eio(lt / d))); cam.lookAt(FACE);
        kitchenRender(cam.position.distanceTo(FACE)); blit();
        pill('7 DAYS NO WATER? 💧', 540, 1180, eob(seg(lt, 0.2, 0.5)), '#4FD1E8');
      } });
      cue(st + 0.1, 'whoosh'); cue(st + 0.3, 'pop', { gain: 0.6 }); }

    // 2 · DAY 1: Dry mouth & pounding headache (Hero holds head / throat)
    { const st = cut(1);
      add({ id: 'W02', at: st, note: 'Day 1: Throat dry, touching head, headache pulse', draw(lt, d, t, blit) {
        reset(); const shake = Math.sin(lt * 15) * 0.005;
        hero.pose({ head: [8 + shake * 20, -10, 5], lid: 0.35, look: [0, -6], shL: [60, 20, 40], elL: [70, 0, 0], shR: [15, 0, 10] });
        cam.position.copy(lerpV(V3(0.15, 1.68, 0.45), V3(0.12, 1.66, 0.18), eio(lt / d))); cam.lookAt(FACE);
        kitchenRender(cam.position.distanceTo(FACE)); blit();
        pill('DAY 1: DEHYDRATION', 540, 320, eob(seg(lt, 0.1, 0.35)), '#FFD43B');
        pill('SEEKING WATER', 540, 1180, eob(seg(lt, 0.3, 0.6)), '#FFFFFF');
      } });
      cue(st, 'whoosh'); cue(st + 0.2, 'boing', { gain: 0.4 }); }

    // 3 · DAY 2-3: Kidneys shutdown (X-ray body, camera orbits kidneys)
    { const st = cut(2);
      add({ id: 'W03', at: st, note: 'X-ray: Kidneys shutdown, toxic amber glow', draw(lt, d, t, blit) {
        reset(); const pulse = Math.sin(lt * 6) * 0.05;
        xh.pose({ spine: [4, 0, 0], head: [-4, 0, 0], lid: 0.2 });
        xmat.uniforms.uCol.value.copy(CYAN);
        cam.position.copy(lerpV(V3(0.35, 1.35, 1.3), V3(0.1, 1.28, 0.95), eio(lt / d))); cam.lookAt(0, 1.25, 0);
        E.render(X.scene, cam, { ...XLOOK, focus: cam.position.distanceTo(V3(0, 1.25, 0)) }); blit();
        pill('DAY 2-3: KIDNEYS', 540, 320, eob(seg(lt, 0.1, 0.35)), '#FFA500');
        label('FILTRATION: STOPPING', 740, 540, ...screen(V3(0.15, 1.28, 0.05), cam), eob(seg(lt, 0.3, 0.6)));
      } });
      cue(st, 'whoosh'); cue(st + 0.3, 'zap', { gain: 0.5 }); }

    // 4 · TOXINS ACCUMULATING: Inside blood stream with toxic particles
    { const st = cut(3);
      add({ id: 'W04', at: st, note: 'Blood vessel: toxins accumulate in bloodstream', draw(lt, d, t, blit) {
        reset(); VS.update(lt, 2.5 + lt * 0.3, 0.7, 0.5);
        cam.position.set(0, 0, 3.2 - lt * 0.2); cam.lookAt(0, 0, -10);
        E.render(VS.scene, cam, VLOOK); blit();
        pill('TOXINS ACCUMULATE', 540, 330, eob(seg(lt, 0.15, 0.4)), '#FF5A5A');
      } });
      cue(st, 'whoosh'); cue(st + 0.2, 'rumble', { gain: 0.5 }); }

    // 5 · DAY 4: Blood thickening & Heart strain (Slow sluggish blood, straining heart)
    { const st = cut(4);
      add({ id: 'W05', at: st, note: 'Day 4: Sluggish blood, heart pulsing red under strain', draw(lt, d, t, blit) {
        reset(); const beat = 0.5 - 0.5 * Math.cos(lt * 4); I.heart.scale.setScalar(1 + 0.22 * beat);
        xh.pose({ spine: [6, 0, 0], head: [10, 0, 0], lid: 0.4 }); xmat.uniforms.uCol.value.copy(RED);
        cam.position.copy(lerpV(V3(0, 1.48, 1.3), V3(0.05, 1.42, 0.95), eio(lt / d))); cam.lookAt(0, 1.4, 0);
        E.render(X.scene, cam, { ...XLOOK, focus: cam.position.distanceTo(V3(0, 1.4, 0)) }); blit();
        pill('DAY 4: BLOOD THICKENS', 540, 320, eob(seg(lt, 0.1, 0.35)), '#FF4D4D');
        pill('HEART STRAIN ↑', 540, 1180, eob(seg(lt, 0.3, 0.6)), '#FF8A8A');
      } });
      cue(st, 'whoosh'); cue(st + 0.2, 'heartbeat', { gain: 0.8 }); }

    // 6 · DAY 5-6: Brain Shrinkage & Delirium (X-ray head, camera disorientation)
    { const st = cut(5);
      add({ id: 'W06', at: st, note: 'Day 5-6: Brain shrinkage & disorientation drift', draw(lt, d, t, blit) {
        reset(); const wobble = Math.sin(lt * 12) * 0.02;
        xh.pose({ head: [6 + wobble * 10, -4, wobble * 8], lid: 0.6, look: [0, 4] });
        cam.position.copy(lerpV(V3(0.1 + wobble, 1.72, 0.8), V3(0.08, 1.70, 0.45), eio(lt / d))); cam.lookAt(FACE);
        E.render(X.scene, cam, { ...XLOOK, focus: cam.position.distanceTo(FACE) }); blit();
        pill('BRAIN CELLS SHRINK', 540, 320, eob(seg(lt, 0.1, 0.35)), '#FFA500');
        pill('DELIRIUM & CONFUSION', 540, 1180, eob(seg(lt, 0.3, 0.6)), '#FFFFFF');
      } });
      cue(st, 'whoosh'); cue(st + 0.2, 'spark', { gain: 0.6 }); }

    // 7 · DAY 7: Multiple Organ Failure Warning
    { const st = cut(6);
      add({ id: 'W07', at: st, note: 'Day 7: Warning sign, emergency organ shutdown alert', draw(lt, d, t, blit) {
        reset(); hero.pose({ head: [14, 0, -5], spine: [8, 0, 0], lid: 0.8, look: [0, -8] });
        cam.position.copy(lerpV(V3(0.05, 1.62, 0.9), V3(0.08, 1.64, 0.52), eio(lt / d))); cam.lookAt(0.1, 1.58, -0.6);
        kitchenRender(cam.position.distanceTo(FACE)); blit();
        warning(540, 950, eob(seg(lt, 0.2, 0.5)) * 0.95);
        pill('DAY 7: CRITICAL ALARM', 540, 320, eob(seg(lt, 0.1, 0.35)), '#FF2E2E');
      } });
      cue(st, 'whoosh'); cue(st + 0.2, 'slam', { gain: 0.8 }); }

    // 8 · OUTRO & ADVICE: Drink plenty of water! (Hero cheerfully drinking glass of fresh water)
    { const st = cut(7);
      add({ id: 'W08', at: st, note: 'Outro: Hero happily drinks crystal clear water in bright room', draw(lt, d, t, blit) {
        reset(); const drink = eo(seg(lt, 0.2, 1.5));
        hero.pose({ head: [-8 * drink, 0, 0], lid: -0.15, look: [0, 0], shR: [55 * drink, -15 * drink, 30 * drink], elR: [45 * drink, 0, 0] });
        cam.position.copy(lerpV(V3(0.35, 1.68, 0.6), V3(0.25, 1.66, 0.3), eio(lt / d))); cam.lookAt(FACE);
        kitchenRender(cam.position.distanceTo(FACE), { bloom: 0.45 }); blit();
        pill('STAY HYDRATED! 💧', 540, 1180, eob(seg(lt, 0.25, 0.55)), '#4FD1E8');
      } });
      cue(st, 'whoosh'); cue(st + 0.3, 'chime', { gain: 0.7 }); }
  }

  // =========================================================================
  // ⚡ FALLBACK / ADAPTIVE DIRECTOR FOR OTHER TOPICS
  // =========================================================================
  else {
    const totalLines = Math.max(1, T.lines?.length || 8);
    for (let i = 0; i < totalLines; i++) {
      const st = cut(i);
      const isXray = i % 3 === 1;
      const isVessel = i % 3 === 2;

      add({ id: `S${String(i+1).padStart(2, '0')}`, at: st, note: `Shot ${i+1}: ${isXray ? 'X-Ray Body' : isVessel ? 'Blood / Cellular' : 'Real World'}`, draw(lt, d, t, blit) {
        reset();
        if (isVessel) {
          VS.update(lt, 2.0 + lt * 0.4, 0.3, 0.3);
          cam.position.set(0, 0, 3.2 - lt * 0.2); cam.lookAt(0, 0, -10);
          E.render(VS.scene, cam, VLOOK);
        } else if (isXray) {
          xh.pose({ spine: [2, 0, 0], head: [-2, 0, 0] });
          cam.position.copy(lerpV(V3(0.3, 1.4, 1.3), V3(0.1, 1.35, 0.95), eio(lt / d))); cam.lookAt(0, 1.3, 0);
          E.render(X.scene, cam, { ...XLOOK, focus: cam.position.distanceTo(V3(0, 1.3, 0)) });
        } else {
          hero.pose({ head: [-2, 4 * Math.sin(lt * 2), 0] });
          cam.position.copy(lerpV(V3(0.38, 1.7, 0.6), V3(0.22, 1.68, 0.28), eio(lt / d))); cam.lookAt(FACE);
          kitchenRender(cam.position.distanceTo(FACE));
        }
        blit();
      } });
      cue(st, 'whoosh');
    }
  }

  return { shots: S, cues: CUES };
}
