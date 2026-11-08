// Anchor Aadhya 3D Science Explainer Engine (Deep Dive 3D)
// Supports 10+ Diverse Characters (Dr. Aadhya, Zara Fit, Maya, Dr. Kabir, etc.)
// and 20+ Dynamic Environments (High-Tech Lab, Hospital ICU, Neural Matrix, etc.)
// with Zack D. Films Signature Macro Camera Moves (Punch-in, 360 Orbit, Dutch Tilt).

import * as THREE from 'three';
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import { camera } from './core/engine.js';
import { Human } from './core/human.js';
import { pickCharacterForTopic } from './core/characters.js';
import * as SETS from './core/sets.js';
import { label, pill, warning, blackout } from './core/look2d.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);
const lerpV = (a, b, k) => a.clone().lerp(b, k);
function screen(p, cam) { const v = p.clone().project(cam); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * H]; }

export function buildShots(E, script = {}) {
  const S = [], CUES = [], add = (o) => (S.push(o), o), cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const cut = (i) => (i === 0 ? 0 : L(i) - 0.08);
  const cam = camera(30);
  const KLOOK = { aperture: 0.003, maxblur: 0.01, bloom: 0.25 };
  const XLOOK = { aperture: 0.0015, bloom: 0.55, bloomThreshold: 0.4, vignette: 0.45 };
  const VLOOK = { aperture: 0.005, maxblur: 0.012, bloom: 0.6, bloomThreshold: 0.5, focus: 3.2 };

  // 1. Pick Character dynamically based on topic
  const charPreset = pickCharacterForTopic(script);
  const hero = new Human(charPreset);

  // 2. Pick Primary Environment dynamically
  const env = SETS.pickSetForTopic(E, script);
  hero.group.position.set(0.1, 0, -0.6);
  env.scene.add(hero.group);

  // 3. X-Ray & Internal Anatomy Stages
  const X = SETS.xrayStage(E);
  const xh = new Human({ ...charPreset, face: true });
  const xmat = SETS.xrayMaterial();
  xh.setBodyMaterial(xmat);
  const I = SETS.insides();
  xh.spine.add(I.group);
  X.scene.add(xh.group);

  // 4. Secondary Microscopic World
  const Micro = SETS.microscopicCellularWorld(E);
  const VS = SETS.vessel(E);

  const CYAN = new THREE.Color('#4FD1E8'), RED = new THREE.Color('#FF3B3B'), GOLD = new THREE.Color('#FFD43B');
  const chest = (h, k) => h.parts[0].scale.set(1 + 0.03 * k, 1 + 0.012 * k, 1 + 0.08 * k);
  const lungs = (k) => I.lungs.forEach((l) => l.scale.set(1 + 0.12 * k, 1 + 0.1 * k, 1 + 0.12 * k));
  const reset = () => {
    hero.pose({}); chest(hero, 0);
    xh.pose({}); chest(xh, 0); lungs(0);
    I.heart.scale.setScalar(1);
    xmat.uniforms.uCol.value.copy(CYAN);
  };

  const FACE = V3(0.1, charPreset.gender === 'female' ? 1.62 : 1.68, -0.6);
  const totalLines = Math.max(1, T.lines?.length || 8);

  for (let i = 0; i < totalLines; i++) {
    const st = cut(i);
    const mode = i % 4; // 0 = Cinematic Real World, 1 = Macro X-Ray / Organ, 2 = Microscopic Cellular, 3 = Dramatic Close-Up

    add({
      id: `S${String(i + 1).padStart(2, '0')}`,
      at: st,
      note: `Shot ${i + 1}: ${mode === 0 ? 'Cinematic ' + charPreset.name : mode === 1 ? 'X-Ray Anatomy 3D' : mode === 2 ? 'Microscopic World' : 'Macro Close-Up Focus'}`,
      draw(lt, d, t, blit) {
        reset();

        // ── MODE 0: Character in Topic Environment (Dynamic Orbit / Push-In) ──
        if (mode === 0) {
          env.update?.(t);
          const push = eio(lt / d);
          // Female graceful breathing pose or focused gesture
          hero.pose({
            head: [-2, 5 * Math.sin(lt * 1.5), 0],
            spine: [-1, 0, 0],
            lid: -0.15,
            shL: [15, 0, 10],
            shR: [20 * Math.sin(lt * 2), 0, 10],
            elR: [30, 0, 0]
          });
          // Zack D. Films dynamic curved dolly
          cam.position.set(0.35 - push * 0.15, 1.70 - push * 0.05, 0.65 - push * 0.35);
          cam.lookAt(FACE);
          E.render(env.scene, cam, { ...KLOOK, focus: cam.position.distanceTo(FACE) });
          blit();
        }

        // ── MODE 1: X-Ray 3D Stage with Organ Laser Scan ──
        else if (mode === 1) {
          X.update?.(t);
          const pulse = Math.abs(Math.sin(lt * 6));
          xh.pose({ spine: [2, 0, 0], head: [-4, 0, 0], lid: 0.4 });
          xmat.uniforms.uCol.value.copy(pulse > 0.5 ? GOLD : CYAN);
          // 360 degree slow orbit around the organ
          const angle = lt * 0.5;
          cam.position.set(Math.sin(angle) * 1.1, 1.35, Math.cos(angle) * 1.1);
          cam.lookAt(0, 1.25, 0);
          E.render(X.scene, cam, { ...XLOOK, bloom: 0.7 + 0.3 * pulse, focus: 1.1 });
          blit();
        }

        // ── MODE 2: Microscopic Cellular World ──
        else if (mode === 2) {
          Micro.update?.(t);
          // Traveling through floating blood cells and pathogens
          cam.position.set(Math.sin(lt * 0.4) * 0.3, 1.5 + Math.cos(lt * 0.5) * 0.2, 2.5 - lt * 0.35);
          cam.lookAt(0, 1.5, -5);
          E.render(Micro.scene, cam, { ...VLOOK, bloom: 0.65 });
          blit();
        }

        // ── MODE 3: Extreme Macro Close-Up (Zack D. Punch-In) ──
        else {
          env.update?.(t);
          const shock = Math.sin(lt * 20) * (lt < 0.3 ? 0.015 : 0.002);
          hero.pose({
            head: [4 + shock * 10, -6, 2],
            lid: -0.25,
            look: [0, -4]
          });
          // Extreme close-up macro eye/face zoom
          cam.position.set(FACE.x + 0.08, FACE.y - 0.02, FACE.z + 0.32 - lt * 0.03);
          cam.lookAt(FACE);
          E.render(env.scene, cam, { ...KLOOK, focus: 0.32 });
          blit();
        }
      }
    });

    cue(st, 'whoosh');
    if (mode === 1) cue(st + 0.2, 'zap', { gain: 0.4 });
    else if (mode === 2) cue(st + 0.2, 'bubbles', { gain: 0.5 });
  }

  return { shots: S, cues: CUES };
}
