// 20+ Diverse 3D Environments for Anchor Aadhya Explainer Engine
// Built around the origin; characters stand on y = 0, facing +z.
import * as THREE from 'three';
import { rbox, ellipsoid, capsule, smin, sphere, mesh, rgb, noise3 } from './sdf.js';
import { lightRig } from './engine.js';

const std = (color, rough = 0.7, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, ...extra });
const phys = (color, rough = 0.3, extra = {}) => new THREE.MeshPhysicalMaterial({ color, roughness: rough, clearcoat: 0.8, clearcoatRoughness: 0.2, ...extra });

function canvasTex(w, h, draw, rep = [1, 1]) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(...rep);
  t.anisotropy = 8;
  return t;
}

const shadowed = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };
function sdfMesh(f, b, step, mat) { return shadowed(new THREE.Mesh(mesh(f, b, step), mat)); }

// ═══════════════════════════════════════════════════════════════════════════
// 1. HIGH-TECH BIO LABORATORY
// ═══════════════════════════════════════════════════════════════════════════
export function highTechLab(E) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0A1118');
  scene.fog = new THREE.FogExp2('#0A1118', 0.08);

  // Reflective epoxy floor with subtle grid
  const floorMat = phys('#13202E', 0.15, { metalness: 0.4 });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), floorMat);
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  // Clean lab back wall with cyan illuminated horizontal led strip
  const wallMat = std('#1E2E3E', 0.6);
  const backWall = shadowed(new THREE.Mesh(new THREE.BoxGeometry(16, 5, 0.2), wallMat));
  backWall.position.set(0, 2.5, -2.5); scene.add(backWall);

  const ledStrip = new THREE.Mesh(new THREE.BoxGeometry(14, 0.06, 0.05), new THREE.MeshBasicMaterial({ color: '#22D3EE' }));
  ledStrip.position.set(0, 2.2, -2.38); scene.add(ledStrip);

  // Lab workstation with glass test tubes rack & glowing centrifuge
  const desk = shadowed(new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.9, 0.8), std('#0F172A', 0.4, { metalness: 0.6 })));
  desk.position.set(0, 0.45, -1.8); scene.add(desk);

  // Holographic floating screen above workstation
  const holoScreen = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.9), new THREE.MeshBasicMaterial({ color: '#06B6D4', transparent: true, opacity: 0.45, side: THREE.DoubleSide }));
  holoScreen.position.set(0, 1.8, -1.75); scene.add(holoScreen);

  // Test tube racks with glowing liquids
  for (let i = 0; i < 5; i++) {
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.22, 16), phys('#FFFFFF', 0.1, { transmission: 0.9, transparent: true, opacity: 0.6 }));
    tube.position.set(-0.8 + i * 0.1, 0.98, -1.6); scene.add(tube);
    const liquid = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.15, 12), new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? '#06B6D4' : '#F43F5E' }));
    liquid.position.set(-0.8 + i * 0.1, 0.94, -1.6); scene.add(liquid);
  }

  const L = lightRig(scene, { key: '#E0F2FE', keyI: 3.5, keyPos: [2, 4, 3], rimCol: '#22D3EE', rimI: 2.0, hemiI: 0.6 });
  return { scene, lights: L, update(t) { holoScreen.rotation.y = Math.sin(t * 0.5) * 0.05; } };
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. HOSPITAL ICU / EMERGENCY ROOM
// ═══════════════════════════════════════════════════════════════════════════
export function hospitalICU(E) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0E1726');
  scene.fog = new THREE.Fog('#0E1726', 6, 18);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), phys('#1A2736', 0.3));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  const backWall = shadowed(new THREE.Mesh(new THREE.BoxGeometry(14, 4.5, 0.2), std('#26354A', 0.8)));
  backWall.position.set(0, 2.25, -2.4); scene.add(backWall);

  // Hospital cardiac vital monitor on pole
  const stand = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.8, 12), std('#94A3B8', 0.3, { metalness: 0.8 })));
  stand.position.set(1.4, 0.9, -1.4); scene.add(stand);

  const monitorBox = shadowed(new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.4, 0.15), std('#1E293B', 0.5)));
  monitorBox.position.set(1.4, 1.55, -1.4); scene.add(monitorBox);

  const ecgScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.34), new THREE.MeshBasicMaterial({ color: '#10B981' }));
  ecgScreen.position.set(1.4, 1.55, -1.32); scene.add(ecgScreen);

  // IV saline drip pole & bag
  const ivPole = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 2.0, 12), std('#E2E8F0', 0.2, { metalness: 0.9 })));
  ivPole.position.set(-1.4, 1.0, -1.2); scene.add(ivPole);
  const ivBag = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.28, 0.06), phys('#FFFFFF', 0.1, { transmission: 0.85, transparent: true, opacity: 0.7 }));
  ivBag.position.set(-1.4, 1.8, -1.2); scene.add(ivBag);

  const L = lightRig(scene, { key: '#F1F5F9', keyI: 3.2, keyPos: [1, 3.5, 2.5], rimCol: '#10B981', rimI: 1.5, hemiI: 0.7 });
  return { scene, lights: L, update(t) { ecgScreen.material.color.setHSL(0.38, 0.9, 0.5 + Math.sin(t * 8) * 0.1); } };
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. SURGICAL OPERATION THEATER
// ═══════════════════════════════════════════════════════════════════════════
export function operatingTheater(E) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#061019');
  scene.fog = new THREE.Fog('#061019', 5, 16);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), phys('#0B2533', 0.2, { metalness: 0.3 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  // Overhead massive circular surgical light dome
  const domeMat = std('#E2E8F0', 0.3, { metalness: 0.7 });
  const dome = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 0.25, 32), domeMat));
  dome.position.set(0, 3.2, -0.4); scene.add(dome);

  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), new THREE.MeshBasicMaterial({ color: '#FFFFFF' }));
    bulb.position.set(Math.cos(a) * 0.65, 3.12, -0.4 + Math.sin(a) * 0.65);
    scene.add(bulb);
  }

  const surgLight = new THREE.SpotLight('#FFFFFF', 8.0, 8, Math.PI / 4, 0.3);
  surgLight.position.set(0, 3.1, -0.4); surgLight.target.position.set(0, 1.0, -0.4);
  scene.add(surgLight); scene.add(surgLight.target);

  return { scene, update() {} };
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. NOIR DETECTIVE OFFICE (True Crime / Mystery)
// ═══════════════════════════════════════════════════════════════════════════
export function noirDetectiveOffice(E) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0A0806');
  scene.fog = new THREE.FogExp2('#0A0806', 0.09);

  // Dark mahogany floor
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), std('#1F140E', 0.6));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  // Window blinds with glowing amber light slats
  const wall = shadowed(new THREE.Mesh(new THREE.BoxGeometry(12, 4, 0.2), std('#2A1B14', 0.9)));
  wall.position.set(0, 2, -2.4); scene.add(wall);

  for (let i = 0; i < 16; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.04, 0.02), std('#5C3D28', 0.7));
    slat.position.set(-1.2, 0.8 + i * 0.14, -2.25); slat.rotation.x = 0.4;
    scene.add(slat);
  }

  // Investigation cork board with red mystery pins
  const board = shadowed(new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.1, 0.05), std('#8B5A2B', 0.9)));
  board.position.set(1.4, 2.1, -2.25); scene.add(board);

  const L = lightRig(scene, { key: '#F59E0B', keyI: 4.0, keyPos: [-2, 2.5, -1], rimCol: '#38BDF8', rimI: 1.0, hemiI: 0.3 });
  return { scene, lights: L, update() {} };
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. MICROSCOPIC CELLULAR WORLD
// ═══════════════════════════════════════════════════════════════════════════
export function microscopicCellularWorld(E) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0B132B');
  scene.fog = new THREE.FogExp2('#0B132B', 0.08);

  const rbcGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 24);
  const rbcMat = phys('#E11D48', 0.25, { emissive: '#881337', emissiveIntensity: 0.3, sheen: 0.8 });
  const cells = new THREE.Group();

  for (let i = 0; i < 35; i++) {
    const m = new THREE.Mesh(rbcGeo, rbcMat);
    m.position.set((Math.random() - 0.5) * 6, (Math.random() - 0.5) * 4 + 1.5, (Math.random() - 0.5) * 6);
    m.rotation.set(Math.random() * 3, Math.random() * 3, 0);
    m.scale.setScalar(0.7 + Math.random() * 0.6);
    cells.add(m);
  }
  scene.add(cells);

  // Floating glowing virus / immune spores
  const sporeGeo = new THREE.SphereGeometry(0.12, 16, 12);
  const sporeMat = new THREE.MeshBasicMaterial({ color: '#22D3EE' });
  const spores = new THREE.Group();
  for (let i = 0; i < 18; i++) {
    const s = new THREE.Mesh(sporeGeo, sporeMat);
    s.position.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 3 + 1.5, (Math.random() - 0.5) * 5);
    spores.add(s);
  }
  scene.add(spores);

  const L = lightRig(scene, { key: '#FB7185', keyI: 3.5, keyPos: [1, 3, 2], rimCol: '#22D3EE', rimI: 2.2, hemiI: 0.5 });
  return {
    scene, lights: L,
    update(t) {
      cells.children.forEach((c, idx) => { c.rotation.x += 0.01; c.position.y += Math.sin(t + idx) * 0.002; });
      spores.children.forEach((s, idx) => { s.position.x += Math.sin(t * 0.8 + idx) * 0.003; });
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. BRAIN NEURAL SYNAPSE MATRIX
// ═══════════════════════════════════════════════════════════════════════════
export function brainNeuralMatrix(E) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#030712');
  scene.fog = new THREE.FogExp2('#030712', 0.07);

  const neuronGroup = new THREE.Group();
  const nodeGeo = new THREE.SphereGeometry(0.06, 16, 12);
  const nodeMat = new THREE.MeshBasicMaterial({ color: '#38BDF8' });

  for (let i = 0; i < 40; i++) {
    const n = new THREE.Mesh(nodeGeo, nodeMat);
    n.position.set((Math.random() - 0.5) * 7, Math.random() * 3 + 0.5, (Math.random() - 0.5) * 7);
    neuronGroup.add(n);
  }
  scene.add(neuronGroup);

  const pLight = new THREE.PointLight('#38BDF8', 5, 8);
  pLight.position.set(0, 1.8, 0); scene.add(pLight);

  return {
    scene,
    update(t) {
      const pulse = 0.5 + 0.5 * Math.sin(t * 6);
      pLight.intensity = 4 + 3 * pulse;
      neuronGroup.rotation.y = t * 0.05;
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 7. DNA DOUBLE HELIX CHAMBER
// ═══════════════════════════════════════════════════════════════════════════
export function dnaChamber(E) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#090D16');
  scene.fog = new THREE.FogExp2('#090D16', 0.08);

  const helix = new THREE.Group();
  const sphereGeo = new THREE.SphereGeometry(0.045, 12, 10);
  const matA = new THREE.MeshBasicMaterial({ color: '#EC4899' });
  const matB = new THREE.MeshBasicMaterial({ color: '#06B6D4' });

  for (let i = 0; i < 60; i++) {
    const a = i * 0.35, y = i * 0.06;
    const m1 = new THREE.Mesh(sphereGeo, matA); m1.position.set(Math.cos(a) * 0.5, y, Math.sin(a) * 0.5); helix.add(m1);
    const m2 = new THREE.Mesh(sphereGeo, matB); m2.position.set(-Math.cos(a) * 0.5, y, -Math.sin(a) * 0.5); helix.add(m2);
  }
  helix.position.set(-1.2, 0.3, -1.2); scene.add(helix);

  const L = lightRig(scene, { key: '#F472B6', keyI: 3.0, keyPos: [2, 3, 2], rimCol: '#22D3EE', rimI: 2.5, hemiI: 0.5 });
  return { scene, lights: L, update(t) { helix.rotation.y = t * 0.6; } };
}

// ═══════════════════════════════════════════════════════════════════════════
// 8. CYBERPUNK NEON STREET
// ═══════════════════════════════════════════════════════════════════════════
export function cyberpunkStreet(E) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#090514');
  scene.fog = new THREE.FogExp2('#090514', 0.09);

  // Wet reflective asphalt
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), phys('#120D22', 0.1, { metalness: 0.6 }));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  // Neon signage columns
  const sign1 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 2.5, 0.05), new THREE.MeshBasicMaterial({ color: '#D946EF' }));
  sign1.position.set(-2.2, 2.0, -2.0); scene.add(sign1);
  const sign2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 2.0, 0.05), new THREE.MeshBasicMaterial({ color: '#06B6D4' }));
  sign2.position.set(2.2, 1.8, -2.0); scene.add(sign2);

  const L = lightRig(scene, { key: '#E879F9', keyI: 4.2, keyPos: [-2, 3, 1], rimCol: '#22D3EE', rimI: 3.0, hemiI: 0.4 });
  return { scene, lights: L, update(t) { sign1.material.color.setHSL(0.85, 1.0, 0.5 + Math.sin(t * 10) * 0.1); } };
}

// ═══════════════════════════════════════════════════════════════════════════
// 9. MODERN CONTEMPORARY APARTMENT
// ═══════════════════════════════════════════════════════════════════════════
export function modernApartment(E) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#1E1B18');
  scene.fog = new THREE.Fog('#1E1B18', 6, 16);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), std('#3E2E20', 0.5));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);

  const wall = shadowed(new THREE.Mesh(new THREE.BoxGeometry(14, 4.5, 0.2), std('#E2D7C8', 0.9)));
  wall.position.set(0, 2.25, -2.5); scene.add(wall);

  // Ambient lamp
  const lampPole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 1.8, 12), std('#D97706', 0.3, { metalness: 0.8 }));
  lampPole.position.set(1.8, 0.9, -1.8); scene.add(lampPole);
  const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.25, 16, 1, true), new THREE.MeshBasicMaterial({ color: '#FEF08A' }));
  lampShade.position.set(1.8, 1.75, -1.8); scene.add(lampShade);

  const L = lightRig(scene, { key: '#FEF3C7', keyI: 3.6, keyPos: [1.8, 2.5, 0], rimCol: '#93C5FD', rimI: 1.2, hemiI: 0.6 });
  return { scene, lights: L, update() {} };
}

// ═══════════════════════════════════════════════════════════════════════════
// 10. UNIVERSITY CLASSROOM / LECTURE HALL
// ═══════════════════════════════════════════════════════════════════════════
export function classroomLectureHall(E) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#1F2937');
  scene.fog = new THREE.Fog('#1F2937', 7, 18);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), std('#374151', 0.6));
  floor.rotation.x = -Math.PI / 2; scene.add(floor);

  // Large blackboard with chalk drawings
  const board = shadowed(new THREE.Mesh(new THREE.BoxGeometry(4.0, 1.8, 0.06), std('#1B3322', 0.95)));
  board.position.set(0, 1.9, -2.4); scene.add(board);

  const L = lightRig(scene, { key: '#F9FAFB', keyI: 3.4, keyPos: [1, 4, 3], rimCol: '#FDE047', rimI: 1.2, hemiI: 0.7 });
  return { scene, lights: L, update() {} };
}

// ═══════════════════════════════════════════════════════════════════════════
// 11. SPACE STATION ORBITAL DECK
// ═══════════════════════════════════════════════════════════════════════════
export function spaceStationDeck(E) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#030712');
  scene.fog = new THREE.FogExp2('#030712', 0.06);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), phys('#1F2937', 0.2, { metalness: 0.7 }));
  floor.rotation.x = -Math.PI / 2; scene.add(floor);

  // Large observation circular portal with glowing Earth curve
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.12, 16, 48), std('#64748B', 0.4, { metalness: 0.8 }));
  ring.position.set(0, 2.0, -2.4); scene.add(ring);

  const earth = new THREE.Mesh(new THREE.SphereGeometry(6, 32, 24), new THREE.MeshBasicMaterial({ color: '#0284C7' }));
  earth.position.set(0, -4.5, -6); scene.add(earth);

  const L = lightRig(scene, { key: '#38BDF8', keyI: 4.5, keyPos: [0, 3, -1], rimCol: '#FFFFFF', rimI: 2.0, hemiI: 0.4 });
  return { scene, lights: L, update(t) { earth.rotation.y = t * 0.02; } };
}

// ═══════════════════════════════════════════════════════════════════════════
// 12. COSMIC VOID NEBULA
// ═══════════════════════════════════════════════════════════════════════════
export function cosmicVoidNebula(E) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#02020A');
  scene.fog = new THREE.FogExp2('#02020A', 0.05);

  const stars = new THREE.Group();
  const starGeo = new THREE.SphereGeometry(0.025, 8, 8);
  const mat1 = new THREE.MeshBasicMaterial({ color: '#E879F9' });
  const mat2 = new THREE.MeshBasicMaterial({ color: '#38BDF8' });

  for (let i = 0; i < 70; i++) {
    const s = new THREE.Mesh(starGeo, i % 2 === 0 ? mat1 : mat2);
    s.position.set((Math.random() - 0.5) * 12, Math.random() * 6 - 1, (Math.random() - 0.5) * 12);
    stars.add(s);
  }
  scene.add(stars);

  const L = lightRig(scene, { key: '#C084FC', keyI: 3.8, keyPos: [2, 3, 2], rimCol: '#38BDF8', rimI: 2.5, hemiI: 0.4 });
  return { scene, lights: L, update(t) { stars.rotation.y = t * 0.03; } };
}

// ═══════════════════════════════════════════════════════════════════════════
// 13. FORENSIC MORGUE (Crime & Cold Case)
// ═══════════════════════════════════════════════════════════════════════════
export function forensicMorgue(E) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#060D12');
  scene.fog = new THREE.Fog('#060D12', 6, 16);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), phys('#162633', 0.2, { metalness: 0.5 }));
  floor.rotation.x = -Math.PI / 2; scene.add(floor);

  // Stainless steel autopsy table
  const table = shadowed(new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.85, 0.9), std('#CBD5E1', 0.2, { metalness: 0.9 })));
  table.position.set(0, 0.425, -1.2); scene.add(table);

  const L = lightRig(scene, { key: '#E0F2FE', keyI: 3.8, keyPos: [0, 3.5, -1], rimCol: '#0284C7', rimI: 1.5, hemiI: 0.5 });
  return { scene, lights: L, update() {} };
}

// ═══════════════════════════════════════════════════════════════════════════
// 14. TOXIC CHEMICAL FACTORY
// ═══════════════════════════════════════════════════════════════════════════
export function toxicChemicalFactory(E) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#0B0F07');
  scene.fog = new THREE.FogExp2('#0B0F07', 0.08);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), std('#1C2415', 0.8));
  floor.rotation.x = -Math.PI / 2; scene.add(floor);

  // Toxic glowing green barrels
  const barrelGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.8, 16);
  const barrelMat = std('#EAB308', 0.5);
  for (let i = 0; i < 3; i++) {
    const b = shadowed(new THREE.Mesh(barrelGeo, barrelMat));
    b.position.set(-1.4 + i * 0.45, 0.4, -1.6); scene.add(b);
  }

  const toxicGlow = new THREE.PointLight('#84CC16', 4, 6);
  toxicGlow.position.set(-1.0, 0.9, -1.4); scene.add(toxicGlow);

  const L = lightRig(scene, { key: '#FACC15', keyI: 3.5, keyPos: [2, 3, 1], rimCol: '#84CC16', rimI: 2.5, hemiI: 0.4 });
  return { scene, lights: L, update(t) { toxicGlow.intensity = 3 + Math.sin(t * 5) * 1.5; } };
}

// ═══════════════════════════════════════════════════════════════════════════
// 15. ANCIENT TEMPLE SANCTUM
// ═══════════════════════════════════════════════════════════════════════════
export function ancientTempleSanctum(E) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#140B04');
  scene.fog = new THREE.Fog('#140B04', 5, 16);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(12, 12), std('#2E1C0F', 0.9));
  floor.rotation.x = -Math.PI / 2; scene.add(floor);

  // Stone pillars
  const pillarGeo = new THREE.CylinderGeometry(0.25, 0.28, 4.0, 16);
  const pillarMat = std('#452C1E', 0.85);
  for (const x of [-1.8, 1.8]) {
    const p = shadowed(new THREE.Mesh(pillarGeo, pillarMat));
    p.position.set(x, 2.0, -1.8); scene.add(p);
  }

  // Fire brazier glow
  const fireLight = new THREE.PointLight('#F97316', 6, 8);
  fireLight.position.set(0, 1.2, -1.5); scene.add(fireLight);

  return { scene, update(t) { fireLight.intensity = 5 + Math.sin(t * 12) * 1.5; } };
}

// ═══════════════════════════════════════════════════════════════════════════
// 16. LUXURY MODERN FITNESS GYM
// ═══════════════════════════════════════════════════════════════════════════
export function luxuryFitnessGym(E) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#111827');
  scene.fog = new THREE.Fog('#111827', 6, 18);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), phys('#1F2937', 0.3));
  floor.rotation.x = -Math.PI / 2; scene.add(floor);

  // Large mirror back wall
  const mirror = new THREE.Mesh(new THREE.PlaneGeometry(8, 3.2), phys('#CBD5E1', 0.05, { metalness: 0.9 }));
  mirror.position.set(0, 1.6, -2.4); scene.add(mirror);

  const L = lightRig(scene, { key: '#F3F4F6', keyI: 4.0, keyPos: [1, 3.5, 2], rimCol: '#EF4444', rimI: 1.8, hemiI: 0.6 });
  return { scene, lights: L, update() {} };
}

// ═══════════════════════════════════════════════════════════════════════════
// 17. DEEP OCEAN FLOOR
// ═══════════════════════════════════════════════════════════════════════════
export function underwaterDeepOcean(E) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#031326');
  scene.fog = new THREE.FogExp2('#031326', 0.1);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), std('#08233D', 0.8));
  floor.rotation.x = -Math.PI / 2; scene.add(floor);

  const L = lightRig(scene, { key: '#38BDF8', keyI: 3.2, keyPos: [0, 4, 1], rimCol: '#06B6D4', rimI: 2.2, hemiI: 0.5 });
  return { scene, lights: L, update() {} };
}

// ═══════════════════════════════════════════════════════════════════════════
// 18. DESERT SUNSET DUNES
// ═══════════════════════════════════════════════════════════════════════════
export function desertSandDunes(E) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#2C1205');
  scene.fog = new THREE.Fog('#2C1205', 8, 22);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(16, 16), std('#B45309', 0.9));
  floor.rotation.x = -Math.PI / 2; scene.add(floor);

  const L = lightRig(scene, { key: '#F59E0B', keyI: 5.0, keyPos: [4, 2, -4], rimCol: '#EC4899', rimI: 2.0, hemiI: 0.5 });
  return { scene, lights: L, update() {} };
}

// ═══════════════════════════════════════════════════════════════════════════
// 19. QUANTUM HOLOGRAPHIC VOID
// ═══════════════════════════════════════════════════════════════════════════
export function quantumVoid(E) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#030308');
  scene.fog = new THREE.FogExp2('#030308', 0.08);

  const grid = new THREE.GridHelper(16, 32, '#8B5CF6', '#2E1065');
  grid.position.y = 0; scene.add(grid);

  const cubeGeo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
  const cubeMat = new THREE.MeshBasicMaterial({ color: '#A855F7', wireframe: true });
  const cubes = new THREE.Group();
  for (let i = 0; i < 8; i++) {
    const c = new THREE.Mesh(cubeGeo, cubeMat);
    c.position.set((Math.random() - 0.5) * 5, Math.random() * 2 + 1, (Math.random() - 0.5) * 5);
    cubes.add(c);
  }
  scene.add(cubes);

  return { scene, update(t) { cubes.rotation.y = t * 0.4; } };
}

// ═══════════════════════════════════════════════════════════════════════════
// 20. X-RAY HOLOGRAPHIC SCAN STAGE (Zack D. Films Pro)
// ═══════════════════════════════════════════════════════════════════════════
export function xrayStage(E) {
  const scene = new THREE.Scene();
  scene.background = canvasTex(64, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#0B1A30'); gr.addColorStop(1, '#03070F');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
  scene.add(new THREE.HemisphereLight('#9FD9FF', '#05080F', 0.6));
  const k = new THREE.DirectionalLight('#DDF4FF', 2.5); k.position.set(2, 3, 3); scene.add(k);
  const grid = new THREE.GridHelper(20, 40, '#1F6F88', '#123A4A');
  grid.material.transparent = true; grid.material.opacity = 0.35; scene.add(grid);

  // Rotating holographic scan ring
  const scanRing = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.015, 8, 48), new THREE.MeshBasicMaterial({ color: '#22D3EE', transparent: true, opacity: 0.6 }));
  scanRing.rotation.x = Math.PI / 2; scanRing.position.y = 1.2; scene.add(scanRing);

  return {
    scene,
    update(t) { scanRing.position.y = 0.4 + (1 + Math.sin(t * 3)) * 0.8; }
  };
}

export function xrayMaterial(color = '#4FD1E8', strength = 1) {
  return new THREE.ShaderMaterial({
    uniforms: { uCol: { value: new THREE.Color(color) }, uS: { value: strength } },
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'uniform vec3 uCol; uniform float uS; varying vec3 vN; varying vec3 vV; void main(){ float f = pow(1.0 - abs(dot(normalize(vN), normalize(vV))), 2.2); gl_FragColor = vec4(uCol * (0.06 + f * 1.6) * uS, 1.0); }',
  });
}

export function insides() {
  const g = new THREE.Group();
  const bone = new THREE.MeshStandardMaterial({ color: '#E6F7FF', emissive: '#7FDDF2', emissiveIntensity: 0.28, roughness: 0.4 });
  const spineGeo = new THREE.CylinderGeometry(0.018, 0.02, 0.03, 16);
  for (let i = 0; i < 17; i++) {
    const v = new THREE.Mesh(spineGeo, bone);
    v.position.set(0, -0.05 + i * 0.034, -0.085 + Math.sin(i / 16 * Math.PI) * 0.015);
    g.add(v);
  }
  for (let i = 0; i < 9; i++) {
    const r = 0.12 + Math.sin(Math.min(1, i / 4) * 1.4) * 0.05 - (i > 5 ? (i - 5) * 0.012 : 0);
    const rib = new THREE.Mesh(new THREE.TorusGeometry(r, 0.0085, 8, 48, Math.PI * 1.55), bone);
    rib.rotation.set(Math.PI / 2 + 0.3, 0, Math.PI * 0.725); rib.scale.set(1.2, 0.85, 1);
    rib.position.set(0, 0.47 - i * 0.04, -0.02); g.add(rib);
  }
  const sternum = new THREE.Mesh(new THREE.CapsuleGeometry(0.014, 0.18, 6, 12), bone); sternum.position.set(0, 0.33, 0.1); g.add(sternum);
  for (const s of [-1, 1]) {
    const cl = new THREE.Mesh(new THREE.CapsuleGeometry(0.011, 0.14, 6, 12), bone); cl.rotation.z = Math.PI / 2 + s * 0.15; cl.position.set(s * 0.09, 0.47, 0.06); g.add(cl);
  }
  const organ = (col) => new THREE.MeshPhysicalMaterial({ color: col, roughness: 0.35, clearcoat: 0.8, emissive: col, emissiveIntensity: 0.18 });
  const stomach = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 14), organ('#E87A8C'));
  stomach.position.set(0.03, 0.14, 0.02); g.add(stomach);
  const heart = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 14), organ('#D62839'));
  heart.position.set(0.025, 0.36, 0.03); g.add(heart);
  const lungs = [];
  for (const s of [-1, 1]) {
    const lung = new THREE.Mesh(new THREE.CapsuleGeometry(0.05, 0.14, 8, 12), new THREE.MeshPhysicalMaterial({ color: '#F2A3AE', transparent: true, opacity: 0.5 }));
    lung.position.set(s * 0.085, 0.36, 0); g.add(lung); lungs.push(lung);
  }
  g.position.y = 0.04; return { group: g, stomach, heart, lungs };
}

// ═══════════════════════════════════════════════════════════════════════════
// 21. BLOOD VESSEL (Macro)
// ═══════════════════════════════════════════════════════════════════════════
export function vessel(E) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#2A0508'); scene.fog = new THREE.FogExp2('#3A070C', 0.11);
  const tubeGeo = new THREE.CylinderGeometry(1.6, 1.6, 40, 48, 60, true);
  const wall = new THREE.Mesh(tubeGeo, new THREE.MeshPhysicalMaterial({ color: '#B8283A', roughness: 0.35, side: THREE.BackSide }));
  wall.rotation.x = Math.PI / 2; scene.add(wall);
  const rbc = new THREE.MeshPhysicalMaterial({ color: '#D8243A', roughness: 0.3, side: THREE.DoubleSide });
  const inst = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.2, 0.2, 0.06, 16), rbc, 30);
  scene.add(inst);
  const l1 = new THREE.PointLight('#FFB0A0', 40, 14); scene.add(l1);
  return {
    scene, light: l1,
    update(t, camZ = 0) {
      l1.position.set(0.2, 0.3, camZ - 3.5);
    }
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// 22. CLASSIC KITCHEN
// ═══════════════════════════════════════════════════════════════════════════
export function kitchen(E) {
  const scene = new THREE.Scene(); scene.background = new THREE.Color('#E8DCCB'); scene.fog = new THREE.Fog('#E8DCCB', 8, 20);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14, 14), std('#8C6239', 0.55));
  floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; scene.add(floor);
  const wallM = std('#EFE3D0', 0.9), back = shadowed(new THREE.Mesh(new THREE.BoxGeometry(14, 4, 0.2), wallM));
  back.position.set(0, 2, -2.2); scene.add(back);
  const top = new THREE.MeshPhysicalMaterial({ color: '#F2EEE6', roughness: 0.25 });
  const wt = shadowed(new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.05, 0.72), top));
  wt.position.set(0.2, 0.93, -1.75); scene.add(wt);
  const L = lightRig(scene, { key: '#FFD9AE', keyI: 4.2, keyPos: [2.6, 3.2, -4], rimCol: '#CFE0FF', rimI: 1.2, hemiI: 0.75 });
  return { scene, lights: L, update() {} };
}

/** Registry of all 22 sets */
export const SETS_REGISTRY = {
  highTechLab,
  hospitalICU,
  operatingTheater,
  noirDetectiveOffice,
  microscopicCellularWorld,
  brainNeuralMatrix,
  dnaChamber,
  cyberpunkStreet,
  modernApartment,
  classroomLectureHall,
  spaceStationDeck,
  cosmicVoidNebula,
  forensicMorgue,
  toxicChemicalFactory,
  ancientTempleSanctum,
  luxuryFitnessGym,
  underwaterDeepOcean,
  desertSandDunes,
  quantumVoid,
  xrayStage,
  vessel,
  kitchen
};

/** Selects matching set for a given topic or rotates dynamically */
export function pickSetForTopic(E, topic = {}) {
  const text = `${topic.id || ''} ${topic.title || ''} ${topic.category || ''}`.toLowerCase();
  if (text.includes('eye') || text.includes('immune') || text.includes('cell') || text.includes('bacteria') || text.includes('virus')) {
    return highTechLab(E);
  }
  if (text.includes('heart') || text.includes('hospital') || text.includes('surgery') || text.includes('doctor') || text.includes('icu')) {
    return hospitalICU(E);
  }
  if (text.includes('brain') || text.includes('sleep') || text.includes('memory') || text.includes('neuro') || text.includes('dream')) {
    return brainNeuralMatrix(E);
  }
  if (text.includes('dna') || text.includes('gene') || text.includes('mutation')) {
    return dnaChamber(E);
  }
  if (text.includes('mystery') || text.includes('poison') || text.includes('crime') || text.includes('death')) {
    return noirDetectiveOffice(E);
  }
  if (text.includes('space') || text.includes('gravity') || text.includes('moon') || text.includes('orbit')) {
    return spaceStationDeck(E);
  }
  if (text.includes('water') || text.includes('fitness') || text.includes('workout') || text.includes('muscle')) {
    return luxuryFitnessGym(E);
  }
  if (text.includes('electric') || text.includes('shock') || text.includes('cyber') || text.includes('ai') || text.includes('phone')) {
    return cyberpunkStreet(E);
  }
  // Default to High-Tech Lab
  return highTechLab(E);
}
