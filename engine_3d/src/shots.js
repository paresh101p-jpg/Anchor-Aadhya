// Anchor Aadhya Dynamic Multi-Environment Explainer Engine
// Dynamic multi-stage transitions (Topic World, 3D X-Ray, Cellular, Neural Matrix, High-Tech Lab, Macro)
// Zack D. Films Signature Macro Moves + 2D HUD Holographic Infographics (Pills, Labels, Badges)

import * as THREE from 'three';
import { ctx, W, H, clamp, lerp, seg, eo, eio, eob } from './core/lib.js';
import { L, Wd, T } from './core/timing.js';
import { camera } from './core/engine.js';
import { Human } from './core/human.js';
import { pickCharacterForTopic } from './core/characters.js';
import * as SETS from './core/sets.js';
import { label, pill, warning, blackout } from './core/look2d.js';

const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

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

  // 2. Primary Topic Environment
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

  // 5. Brain Neural Matrix Stage
  const Brain = SETS.brainNeuralMatrix(E);

  // 6. High-Tech Bio Lab Stage
  const Lab = SETS.highTechLab(E);

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
  const hookTopic = script.title ? script.title.split('|')[0].trim() : 'SCIENTIFIC CURIOSITY';

  for (let i = 0; i < totalLines; i++) {
    const st = cut(i);
    // Cycle across 6 distinctly different environments & visual engines
    const mode = i % 6;

    add({
      id: `S${String(i + 1).padStart(2, '0')}`,
      at: st,
      note: `Shot ${i + 1} (Mode ${mode})`,
      draw(lt, d, t, blit) {
        reset();

        // ── MODE 0: Hook & Real World Environment (Dynamic Push-in + Alert Badge) ──
        if (mode === 0) {
          env.update?.(t);
          const push = eio(lt / d);
          hero.pose({
            head: [-2, 5 * Math.sin(lt * 1.5), 0],
            spine: [-1, 0, 0],
            lid: -0.15,
            shL: [15, 0, 10],
            shR: [20 * Math.sin(lt * 2), 0, 10],
            elR: [30, 0, 0]
          });
          cam.position.set(0.35 - push * 0.15, 1.70 - push * 0.05, 0.65 - push * 0.35);
          cam.lookAt(FACE);
          E.render(env.scene, cam, { ...KLOOK, focus: cam.position.distanceTo(FACE) });
          blit();

          // 2D HUD: Top Hook Pill
          const sc = Math.min(1, lt * 4);
          pill(hookTopic.length > 30 ? hookTopic.slice(0, 30) + '...' : hookTopic, W / 2, 220, sc, '#FFD43B', 'rgba(10,14,22,0.85)', 52);
        }

        // ── MODE 1: 3D X-Ray Organ Laser Scan (with Anatomical Labels) ──
        else if (mode === 1) {
          X.update?.(t);
          const pulse = Math.abs(Math.sin(lt * 6));
          xh.pose({ spine: [2, 0, 0], head: [-4, 0, 0], lid: 0.4 });
          xmat.uniforms.uCol.value.copy(pulse > 0.5 ? GOLD : CYAN);
          const angle = lt * 0.6;
          cam.position.set(Math.sin(angle) * 1.1, 1.35, Math.cos(angle) * 1.1);
          cam.lookAt(0, 1.25, 0);
          E.render(X.scene, cam, { ...XLOOK, bloom: 0.7 + 0.3 * pulse, focus: 1.1 });
          blit();

          // 2D HUD: Floating Anatomical Label
          const sc = Math.min(1, lt * 3);
          label('INTERNAL ANATOMY SCAN', W / 2, 380, W / 2, 520, sc);
          pill('⚡ SENSORY NERVE PATHWAY', W / 2, 220, sc, '#4FD1E8', 'rgba(10,20,30,0.88)', 48);
        }

        // ── MODE 2: Microscopic Cellular World (Traveling Camera + Data Ring) ──
        else if (mode === 2) {
          Micro.update?.(t);
          cam.position.set(Math.sin(lt * 0.4) * 0.3, 1.5 + Math.cos(lt * 0.5) * 0.2, 2.5 - lt * 0.35);
          cam.lookAt(0, 1.5, -5);
          E.render(Micro.scene, cam, { ...VLOOK, bloom: 0.65 });
          blit();

          // 2D HUD: Microscopic Scale Pill
          const sc = Math.min(1, lt * 3);
          pill('🔬 CELLULAR MICRO-WORLD (1000x)', W / 2, 220, sc, '#FF3B3B', 'rgba(25,10,12,0.88)', 48);
        }

        // ── MODE 3: Brain Neural Matrix (Synapse Firing + Matrix Grid) ──
        else if (mode === 3) {
          Brain.update?.(t);
          const rot = lt * 0.4;
          cam.position.set(Math.cos(rot) * 1.2, 1.45, Math.sin(rot) * 1.2);
          cam.lookAt(0, 1.4, 0);
          E.render(Brain.scene, cam, { ...XLOOK, bloom: 0.8, focus: 1.2 });
          blit();

          // 2D HUD: Neural Signal Badge
          const sc = Math.min(1, lt * 3);
          pill('🧠 NEURAL SYNAPSE FIRING', W / 2, 220, sc, '#FFD43B', 'rgba(15,15,5,0.88)', 48);
          label('CEREBRAL CORTEX', W / 2, 420, W / 2, 560, sc);
        }

        // ── MODE 4: High-Tech Bio Laboratory Stage ──
        else if (mode === 4) {
          Lab.update?.(t);
          const push = eio(lt / d);
          cam.position.set(-0.3 + push * 0.2, 1.6, 1.1 - push * 0.2);
          cam.lookAt(0, 1.5, 0);
          E.render(Lab.scene, cam, { ...KLOOK, focus: 1.0 });
          blit();

          // 2D HUD: Scientific Truth Badge
          const sc = Math.min(1, lt * 3);
          pill('📊 SCIENTIFIC VERIFICATION', W / 2, 220, sc, '#4FD1E8', 'rgba(10,15,25,0.88)', 48);
        }

        // ── MODE 5: Dramatic Dutch-Angle Zack D. Punch-In ──
        else {
          env.update?.(t);
          const shock = Math.sin(lt * 20) * (lt < 0.3 ? 0.015 : 0.002);
          hero.pose({
            head: [4 + shock * 10, -6, 2],
            lid: -0.25,
            look: [0, -4]
          });
          cam.position.set(FACE.x + 0.08, FACE.y - 0.02, FACE.z + 0.32 - lt * 0.03);
          cam.lookAt(FACE);
          E.render(env.scene, cam, { ...KLOOK, focus: 0.32 });
          blit();

          // 2D HUD: Crucial Fact Callout
          const sc = Math.min(1, lt * 4);
          pill('⚠️ CRITICAL REALITY', W / 2, 220, sc, '#FF3B3B', 'rgba(30,10,10,0.92)', 50);
        }
      }
    });

    cue(st, 'whoosh');
    if (mode === 1) cue(st + 0.15, 'zap', { gain: 0.4 });
    else if (mode === 2) cue(st + 0.15, 'bubbles', { gain: 0.5 });
    else if (mode === 3) cue(st + 0.15, 'sub_bass', { gain: 0.5 });
    else if (mode === 4) cue(st + 0.15, 'beep', { gain: 0.3 });
  }

  return { shots: S, cues: CUES };
}