// WORD → VISUAL: every spoken line is decomposed into the things it actually talks about.
// Each matched Hindi keyword draws that exact object on screen, with a Devanagari label.
// Nothing abstract, nothing from a previous topic. Also shows the Anchor Aadhya presenter badge.
import { ctx, C, W, H, clamp, lerp, seg, eo, eob, circle, ell, line, rr, bigText, fillAll, TAU } from './core/lib.js';
import * as K from './core/kit.js';

const F = (s) => `900 ${s}px Inter, "Noto Sans Devanagari", "Mangal", sans-serif`;

function tag(text, x, y, size = 40, fg = C.white, bg = C.ink) {
  ctx.save(); ctx.font = F(size); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  const w = ctx.measureText(text).width + size * 0.8;
  ctx.fillStyle = bg; ctx.beginPath(); ctx.roundRect(x - w / 2, y - size * 0.68, w, size * 1.36, size * 0.34); ctx.fill();
  ctx.fillStyle = fg; ctx.fillText(text, x, y); ctx.restore();
}

// ── visual elements ──────────────────────────────────────────────────────────
const E = {
  bat(x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = '#5B3B6E';
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(-200, -55, -240, 55);
    ctx.quadraticCurveTo(-140, 105, -65, 52); ctx.quadraticCurveTo(0, 85, 65, 52);
    ctx.quadraticCurveTo(140, 105, 240, 55); ctx.quadraticCurveTo(200, -55, 0, 0); ctx.fill();
    ell(0, 38, 58, 86, '#6B4780');
    circle(-21, -4, 12, C.yellow); circle(21, -4, 12, C.yellow);
    ctx.fillStyle = '#6B4780';
    ctx.beginPath(); ctx.moveTo(-38, -56); ctx.lineTo(-28, -112); ctx.lineTo(-6, -62); ctx.fill();
    ctx.beginPath(); ctx.moveTo(38, -56); ctx.lineTo(28, -112); ctx.lineTo(6, -62); ctx.fill();
    ctx.restore();
    tag('चमगादड़', x, y + 150 * s, 38, C.white, '#5B3B6E');
  },
  room(x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = '#EDE6D8'; ctx.fillRect(-260, -230, 520, 460);
    ctx.fillStyle = C.navy; ctx.fillRect(-260, -230, 520, 70);
    ctx.fillStyle = '#C9E4F2'; ctx.fillRect(110, -110, 110, 150);
    ctx.strokeStyle = C.navy; ctx.lineWidth = 8; ctx.strokeRect(110, -110, 110, 150);
    ctx.fillStyle = C.floor; ctx.fillRect(-260, 190, 520, 40);
    ctx.restore();
    tag('कमरा', x, y + 255 * s, 38);
  },
  flip(x, y, s, t, p) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI * clamp(p)); ctx.scale(s, s);
    K.man({ x: 0, y: 0, s: 0.8, arm: K.ARM.up, eyes: 'wide', mouth: 'o', brow: 1 });
    ctx.restore();
    tag('उल्टा', x, y + 210 * s, 44, C.white, C.red);
  },
  organs(x, y, s, t) {
    ell(x - 85 * s, y, 110 * s, 140 * s, '#D9667C'); ell(x + 85 * s, y, 110 * s, 140 * s, '#D9667C');
    line([[x, y - 120 * s], [x, y + 130 * s]], C.pinkDark, 14 * s);
    for (let k = 0; k < 5; k++) ell(x - 120 * s + k * 60 * s, y + 175 * s, 50 * s, 34 * s, '#E28B9B');
    ell(x + 130 * s, y + 160 * s, 70 * s, 45 * s, '#A8455C');
    tag('पेट • आंत • लीवर', x, y + 265 * s, 34, C.white, C.pinkDark);
  },
  lungs(x, y, s, t) {
    ell(x - 80 * s, y, 100 * s, 130 * s, C.pink); ell(x + 80 * s, y, 100 * s, 130 * s, C.pink);
    line([[x, y - 110 * s], [x, y + 120 * s]], C.pinkDark, 13 * s);
    tag('फेफड़े', x, y + 175 * s, 40, C.white, C.pinkDark);
  },
  pressure(x, y, s, t) {
    K.warning(x, y, 1.2 * s * (1 + 0.05 * Math.sin(t * 8)));
    for (let k = -1; k <= 1; k += 2) {
      arrowLocal(x + k * 140 * s, y + 150 * s, x + k * 30 * s, y + 40 * s, C.red, 14 * s);
    }
    tag('दबाव', x, y + 240 * s, 40, C.white, C.red);
  },
  sneeze(x, y, s, t) {
    ell(x, y, 170 * s, 210 * s, C.skin);
    circle(x - 60 * s, y - 40 * s, 26 * s, C.white); circle(x + 60 * s, y - 40 * s, 26 * s, C.white);
    circle(x - 60 * s, y - 40 * s, 11 * s, C.ink); circle(x + 60 * s, y - 40 * s, 11 * s, C.ink);
    ell(x, y + 70 * s, 70 * s, 45 * s, C.skinShade);
    ell(x, y + 160 * s, 88 * s, 40 * s, C.mouth);
    tag('छींक', x, y + 255 * s, 42, C.white, C.cyan);
  },
  wind(x, y, s, t) {
    for (let k = 0; k < 8; k++) {
      const yy = y - 130 * s + k * 38 * s, off = Math.sin(t * 5 + k) * 28 * s;
      line([[x - 190 * s + off, yy], [x + 170 * s + off, yy - 18 * s]], C.cyan, 9 * s);
    }
    tag('160 km/h हवा', x, y + 210 * s, 38, C.white, '#2F8FA8');
  },
  hand(x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(-0.4);
    ell(0, 0, 150 * s, 80 * s, C.skin);
    for (let k = -2; k <= 2; k++) line([[k * 52 * s, -55 * s], [k * 54 * s, 55 * s]], C.skinShade, 10 * s);
    ctx.restore(); K.redX(x, y, 1.4 * s, 0.9);
    tag('दबाना गलत', x, y + 170 * s, 38, C.white, C.red);
  },
  gum(x, y, s, t) {
    K.gum(x, y, 1.5 * s, 0.25);
    tag('चुइंगम', x, y + 130 * s, 38, C.white, C.pinkDark);
  },
  stomach(x, y, s, t) {
    K.stomach(x, y, 1.25 * s, 0.25 + 0.15 * Math.sin(t * 4));
    for (let k = 0; k < 7; k++) circle(x - 90 * s + k * 30 * s + Math.sin(t * 2 + k) * 8, y - 120 * s - (k % 3) * 36 * s, 12 * s, C.yellow);
    tag('पेट • एसिड', x, y + 190 * s, 38, C.white, C.stomachBg);
  },
  intestine(x, y, s, t) {
    K.gutTube(y, t, 190 * s);
    for (let k = 0; k < 4; k++) circle(x - 150 * s + k * 100 * s + Math.sin(t * 2 + k) * 20, y, 20 * s, C.gum);
    tag('आंतें', x, y + 150 * s, 38, C.white, C.pinkDark);
  },
  water(x, y, s, t) {
    for (let k = 0; k < 5; k++) {
      const dx = (k - 2) * 70 * s;
      ctx.beginPath(); ctx.moveTo(x + dx, y - 110 * s + Math.sin(t * 2 + k) * 12);
      ctx.quadraticCurveTo(x + dx + 40 * s, y - 10 * s, x + dx, y + 90 * s);
      ctx.quadraticCurveTo(x + dx - 40 * s, y - 10 * s, x + dx, y - 110 * s);
      ctx.fillStyle = C.cyan; ctx.fill();
    }
    tag('पानी', x, y + 165 * s, 40, C.white, '#2F8FA8');
  },
  kidney(x, y, s, t) {
    for (const dx of [-90, 90]) {
      ctx.save(); ctx.translate(x + dx * s, y); ctx.scale(s, s);
      ctx.beginPath(); ctx.moveTo(0, -80); ctx.bezierCurveTo(100, -100, 130, 30, 55, 95);
      ctx.bezierCurveTo(0, 140, -85, 85, -75, 0); ctx.bezierCurveTo(-70, -55, -35, -78, 0, -80);
      ctx.fillStyle = '#A8455C'; ctx.fill(); ctx.restore();
    }
    tag('किडनी', x, y + 175 * s, 38, C.white, '#A8455C');
  },
  brain(x, y, s, t) {
    ell(x, y, 160 * s, 130 * s, '#E88DA0');
    for (let k = 0; k < 9; k++) {
      const a = k / 9 * TAU;
      line([[x, y], [x + Math.cos(a + Math.sin(t + k) * 0.18) * 145 * s, y + Math.sin(a) * 115 * s]], C.pinkDark, 10 * s);
    }
    tag('दिमाग', x, y + 180 * s, 40, C.white, C.pinkDark);
  },
  fluid(x, y, s, t) {
    for (let k = 0; k < 4; k++) {
      line([[x - 170 * s, y - 80 * s + k * 45 * s], [x - 60 * s, y - 110 * s + k * 45 * s],
            [x + 40 * s, y - 50 * s + k * 45 * s], [x + 170 * s, y - 85 * s + k * 45 * s]], C.cyan, 10 * s);
    }
    tag('CSF तरल', x, y + 170 * s, 38, C.white, '#2F8FA8');
  },
  sleep(x, y, s, t) {
    bigText('Z', x - 60 * s, y - 40 * s + Math.sin(t * 2) * 10, 90 * s, C.white);
    bigText('z', x + 60 * s, y + 40 * s + Math.cos(t * 2) * 10, 65 * s, C.white);
    tag('नींद', x, y + 160 * s, 38);
  },
  phone(x, y, s, t) {
    rr(x - 70 * s, y - 125 * s, 140 * s, 250 * s, 20 * s); ctx.fillStyle = C.navy; ctx.fill();
    rr(x - 58 * s, y - 108 * s, 116 * s, 210 * s, 12 * s); ctx.fillStyle = '#DCEEF5'; ctx.fill();
    for (let k = 0; k < 4; k++) ctx.fillRect(x - 46 * s + k * 26 * s, y + 55 * s - k * 20 * s, 18 * s, (20 + k * 20) * s);
    tag('मोबाइल', x, y + 185 * s, 38, C.white, C.navy);
  },
  plane(x, y, s, t) {
    ctx.save(); ctx.translate(x, y + Math.sin(t * 2) * 10); ctx.scale(s, s);
    ctx.fillStyle = C.white;
    ctx.beginPath(); ctx.moveTo(-190, 0); ctx.lineTo(110, -25); ctx.lineTo(190, 0); ctx.lineTo(110, 25); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-20, -8); ctx.lineTo(-100, -130); ctx.lineTo(-35, -130); ctx.lineTo(60, -18); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-20, 8); ctx.lineTo(-100, 130); ctx.lineTo(-35, 130); ctx.lineTo(60, 18); ctx.fill();
    ctx.strokeStyle = C.ink; ctx.lineWidth = 7; ctx.stroke(); ctx.restore();
    tag('हवाई जहाज़', x, y + 190 * s, 38, C.white, '#3A7BD5');
  },
  tower(x, y, s, t) {
    line([[x, y + 130 * s], [x, y - 90 * s]], C.navy, 16 * s);
    circle(x, y + 130 * s, 16 * s, C.navy);
    for (let r = 1; r <= 3; r++) {
      ctx.strokeStyle = C.cyan; ctx.lineWidth = 9 * s;
      ctx.beginPath(); ctx.arc(x, y + 130 * s, r * 75 * s, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    }
    tag('सिग्नल टावर', x, y + 205 * s, 36, C.white, '#2F8FA8');
  },
  ear(x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.strokeStyle = C.skinShade; ctx.lineWidth = 30; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(0, 30, 145, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 30, 85, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
    circle(0, 20, 38, '#C9847A'); ctx.restore();
    tag('कान', x, y + 185 * s, 40, C.white, C.skinShade);
  },
  bug(x, y, s, t) {
    ctx.save(); ctx.translate(x + Math.sin(t * 3) * 6, y); ctx.scale(s, s);
    ell(0, 0, 27, 42, C.ink); circle(0, -38, 19, C.ink);
    for (const k of [-1, 1]) for (let j = 0; j < 3; j++) line([[k * 20, -8 + j * 20], [k * 62, -30 + j * 27]], C.ink, 6);
    ctx.restore(); tag('कीड़ा', x, y + 150 * s, 38);
  },
  stick(x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(0.35);
    rr(-12 * s, -130 * s, 24 * s, 260 * s, 10 * s); ctx.fillStyle = '#C8A06A'; ctx.fill(); ctx.restore();
    K.redX(x, y, 1.2 * s, 0.9); tag('तीली मत', x, y + 175 * s, 38, C.white, C.red);
  },
  tattoo(x, y, s, t) {
    ctx.fillStyle = C.skin; ctx.fillRect(x - 170 * s, y - 120 * s, 340 * s, 220 * s);
    for (let k = 0; k < 7; k++) circle(x - 120 * s + k * 40 * s, y - 10 * s + Math.sin(k) * 30 * s, 18 * s, C.ink);
    ctx.save(); ctx.translate(x, y - 150 * s + Math.sin(t * 6) * 14 * s);
    rr(-12 * s, 0, 24 * s, 110 * s, 6 * s); ctx.fillStyle = '#A9B4C2'; ctx.fill(); ctx.restore();
    tag('टैटू • सुई', x, y + 165 * s, 38, C.white, C.pinkDark);
  },
  macrophage(x, y, s, t) {
    for (let k = 0; k < 4; k++) {
      const mx = x - 120 * s + k * 80 * s;
      ell(mx, y + Math.cos(t * 2 + k) * 12 * s, 48 * s, 36 * s, '#7CB342');
      circle(mx + 10 * s, y, 15 * s, C.ink);
    }
    tag('मैक्रोफेज', x, y + 130 * s, 36, C.white, '#5D8A2E');
  },
  bladder(x, y, s, t) {
    ell(x, y, 160 * s, 130 * s, '#E7A7B4');
    ctx.save(); ctx.beginPath(); ctx.ellipse(x, y, 160 * s, 130 * s, 0, 0, TAU); ctx.clip();
    ctx.fillStyle = '#F6D96B'; ctx.fillRect(x - 170 * s, y + 30 * s, 340 * s, 120 * s); ctx.restore();
    ctx.strokeStyle = C.pinkDark; ctx.lineWidth = 9 * s;
    ctx.beginPath(); ctx.ellipse(x, y, 160 * s, 130 * s, 0, 0, TAU); ctx.stroke();
    tag('ब्लैडर', x, y + 180 * s, 38, C.white, C.pinkDark);
  },
  tooth(x, y, s, t, holes = 0) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = C.gum;
    ctx.beginPath(); ctx.moveTo(-100, -135); ctx.quadraticCurveTo(-135, -165, -125, -90);
    ctx.lineTo(-110, 80); ctx.quadraticCurveTo(-60, 165, 0, 155); ctx.quadraticCurveTo(60, 165, 110, 80);
    ctx.lineTo(125, -90); ctx.quadraticCurveTo(135, -165, 100, -135);
    ctx.quadraticCurveTo(0, -185, -100, -135); ctx.fill();
    ctx.strokeStyle = C.gumEdge; ctx.lineWidth = 9; ctx.stroke();
    for (let k = 0; k < holes; k++) circle(-50 + k * 50, -10 + (k % 2) * 38, 18, '#7A3A2A');
    ctx.restore(); tag('दांत', x, y + 195 * s, 40, C.white, C.gumEdge);
  },
  bacteria(x, y, s, t) {
    for (let k = 0; k < 6; k++) {
      const bx = x + Math.sin(t * 1.8 + k * 2) * 110 * s + (k % 3 - 1) * 55 * s;
      const by = y + Math.cos(t * 1.4 + k * 3) * 70 * s;
      ctx.save(); ctx.translate(bx, by); ctx.rotate(t + k);
      ell(0, 0, 28 * s, 14 * s, '#7CB342');
      line([[-25 * s, 0], [-50 * s, -15 * s]], '#5D8A2E', 4 * s);
      line([[25 * s, 0], [50 * s, 15 * s]], '#5D8A2E', 4 * s);
      ctx.restore();
    }
    tag('बैक्टीरिया', x, y + 155 * s, 36, C.white, '#5D8A2E');
  },
  sugar(x, y, s, t) {
    ctx.fillStyle = C.white;
    for (let k = 0; k < 5; k++) { rr(x - 140 * s + k * 60 * s, y - 45 * s, 45 * s, 90 * s, 6 * s); ctx.fill(); }
    tag('मीठा • शुगर', x, y + 130 * s, 36);
  },
  myth(x, y, s, t) {
    bigText('7 साल?', x, y, 92 * s, C.white); K.redX(x, y, 1.5 * s, 0.9);
    tag('झूठ', x, y + 160 * s, 44, C.white, C.red);
  },
  noBug(x, y, s, t) {
    E.bug(x, y, s, t); K.redX(x, y, 1.6 * s, 0.95);
    tag('कीड़ा नहीं!', x, y + 170 * s, 40, C.white, C.red);
  },
  acidDrop(x, y, s, t) {
    for (let k = 0; k < 6; k++) {
      const dx = x - 120 * s + k * 48 * s + Math.sin(t * 3 + k) * 8;
      circle(dx, y - 90 * s + (k % 2) * 30 * s, 20 * s, C.yellow);
    }
    E.tooth(x, y + 30 * s, 0.9 * s, t, 3);
    tag('एसिड • छेद', x, y + 235 * s, 38, C.white, C.red);
  },
  blood(x, y, s, t) {
    ell(x, y - 30 * s, 150 * s, 95 * s, C.skin);
    for (let k = 0; k < 8; k++) circle(x - 110 * s + k * 32 * s, y - 70 * s + Math.sin(t * 2 + k) * 10, 22 * s, C.red);
    tag('सिर में खून', x, y + 105 * s, 38, C.white, C.red);
  },
  click(x, y, s, t) {
    arrowLocal(x, y - 130 * s, x, y + 90 * s, C.yellow, 26 * s);
    rr(x - 150 * s, y + 110 * s, 300 * s, 80 * s, 16 * s); ctx.fillStyle = '#3A7BD5'; ctx.fill();
    ctx.font = F(38 * s); ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('लिंक खोलें', x, y + 150 * s);
  },
  danger(x, y, s, t) { K.warning(x, y, 1.3 * s * (1 + 0.05 * Math.sin(t * 8))); tag('खतरा', x, y + 160 * s, 42, C.white, C.red); },
  question(x, y, s, t) { bigText('?', x, y, 150 * s, C.yellow, 0.1); tag('सवाल', x, y + 150 * s, 38, C.white, C.navy); },
  person(x, y, s, t) { K.man({ x, y, s: 0.85 * s, eyes: 'wide', mouth: 'o', brow: 1 }); tag('इंसान', x, y + 260 * s, 36); },

  // ── generic spoken-word card: for ANY new topic, the words being said are shown on screen ──
  word(x, y, s, t, label) {
    const raw = String(label || 'विषय');
    const shown = raw.length > 11 ? raw.slice(0, 10) + '…' : raw;
    const palette = ['#0E1A2B', '#2F67BE', '#C9566E', '#5D8A2E', '#8B5B2C', '#5B3B6E'];
    let sum = 0; for (const ch of raw) sum += ch.codePointAt(0);
    const color = palette[sum % palette.length];
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    rr(-190, -150, 380, 300, 30); ctx.fillStyle = color; ctx.fill();
    ctx.strokeStyle = C.white; ctx.lineWidth = 8; ctx.stroke();
    circle(-105, -62, 40, 'rgba(255,255,255,0.22)');
    for (let k = 0; k < 3; k++) line([[-40, -95 + k * 28], [110 - k * 25, -95 + k * 28]], 'rgba(255,255,255,0.35)', 12);
    ctx.font = F(64); ctx.fillStyle = C.white; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(shown, 0, 62);
    ctx.restore();
    tag(shown, x, y + 195 * s, 40, C.white, color);
  },

  // ── electricity / grip ──
  bolt(x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(-25, -155); ctx.lineTo(65, -20); ctx.lineTo(5, -8);
    ctx.lineTo(55, 155); ctx.lineTo(-72, 8); ctx.lineTo(-8, -2); ctx.closePath();
    ctx.fillStyle = C.yellow; ctx.fill(); ctx.strokeStyle = C.ink; ctx.lineWidth = 8; ctx.stroke();
    ctx.restore(); tag('बिजली', x, y + 205 * s, 40, C.white, '#B8860B');
  },
  wire(x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.strokeStyle = C.ink; ctx.lineWidth = 24; ctx.beginPath();
    ctx.moveTo(-230, -120); ctx.bezierCurveTo(-60, -210, 60, 50, 230, -80); ctx.stroke();
    ctx.strokeStyle = C.cyan; ctx.lineWidth = 8; ctx.stroke();
    circle(-230, -120, 26, C.red); circle(230, -80, 26, C.red);
    ctx.restore(); tag('तार', x, y + 180 * s, 38, C.white, C.ink);
  },
  handGrip(x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ell(0, 30, 125, 95, C.skin);
    for (let k = -2; k <= 2; k++) {
      ctx.strokeStyle = C.skinShade; ctx.lineWidth = 26; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(k * 42, -40); ctx.lineTo(k * 46, 95); ctx.stroke();
    }
    ctx.restore(); K.redX(x, y, 1.5 * s, 0.95); tag('जकड़ी हथेली', x, y + 190 * s, 38, C.white, C.red);
  },
  muscle(x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ell(-70, 0, 78, 120, '#D9667C'); ell(70, 0, 78, 120, '#C9566E');
    for (let k = -2; k <= 2; k++) {
      line([[-120, k * 35], [-25, k * 42]], C.pinkDark, 7);
      line([[25, k * 42], [120, k * 35]], C.pinkDark, 7);
    }
    ctx.restore(); tag('मांसपेशियां', x, y + 175 * s, 36, C.white, C.pinkDark);
  },
  switch(x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    rr(-140, -100, 280, 200, 18); ctx.fillStyle = '#D9DEE6'; ctx.fill();
    ctx.strokeStyle = C.navy; ctx.lineWidth = 10; ctx.stroke();
    circle(0, 0, 46, C.white); line([[0, 0], [65, -70]], C.red, 20);
    ctx.restore(); tag('मेन स्विच', x, y + 175 * s, 38, C.white, C.navy);
  },

  // ── car / water survival ──
  car(x, y, s, t) {
    ctx.save(); ctx.translate(x, y + Math.sin(t * 2) * 8); ctx.scale(s, s);
    rr(-190, -60, 380, 130, 28); ctx.fillStyle = '#3A7BD5'; ctx.fill();
    ctx.beginPath(); ctx.moveTo(-120, -60); ctx.lineTo(-70, -145); ctx.lineTo(95, -145); ctx.lineTo(145, -60); ctx.fill();
    circle(-110, 85, 46, C.ink); circle(110, 85, 46, C.ink);
    circle(-110, 85, 18, '#B9C4CC'); circle(110, 85, 18, '#B9C4CC');
    ctx.restore(); tag('कार', x, y + 190 * s, 40, C.white, '#3A7BD5');
  },
  door(x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    rr(-130, -170, 260, 340, 16); ctx.fillStyle = '#8FA3B8'; ctx.fill();
    ctx.strokeStyle = C.navy; ctx.lineWidth = 12; ctx.stroke();
    rr(70, -20, 38, 90, 12); ctx.fillStyle = C.yellow; ctx.fill();
    ctx.restore(); tag('दरवाज़ा', x, y + 225 * s, 38, C.white, C.navy);
  },
  window(x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    rr(-150, -130, 300, 260, 12); ctx.fillStyle = '#BFE3F2'; ctx.fill();
    ctx.strokeStyle = C.navy; ctx.lineWidth = 16; ctx.stroke();
    for (let k = 0; k < 5; k++) line([[0, 0], [Math.cos(k) * 140, Math.sin(k) * 120]], C.white, 9);
    ctx.restore(); tag('खिड़की', x, y + 190 * s, 38, C.white, '#2F8FA8');
  },
  headrest(x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    rr(-110, -150, 220, 110, 30); ctx.fillStyle = C.ink; ctx.fill();
    line([[-60, -40], [-60, 120]], '#A9B4C2', 22); line([[60, -40], [60, 120]], '#A9B4C2', 22);
    ctx.restore(); tag('हेडरेस्ट', x, y + 195 * s, 38, C.white, C.ink);
  },
  seatbelt(x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    line([[-130, -160], [120, 150]], C.red, 42);
    rr(60, 90, 80, 60, 12); ctx.fillStyle = C.yellow; ctx.fill();
    ctx.restore(); tag('सीटबेल्ट', x, y + 210 * s, 38, C.white, C.red);
  },

  // ── machines / everyday secrets ──
  atm(x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    rr(-130, -180, 260, 360, 20); ctx.fillStyle = '#6B7B8C'; ctx.fill();
    rr(-90, -140, 180, 110, 10); ctx.fillStyle = C.navy; ctx.fill();
    rr(-95, 20, 190, 28, 8); ctx.fillStyle = C.ink; ctx.fill();
    rr(-70, 85, 140, 60, 8); ctx.fillStyle = C.white; ctx.fill();
    ctx.restore(); tag('ATM', x, y + 245 * s, 40, C.white, '#6B7B8C');
  },
  cash(x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    for (let k = -1; k <= 1; k++) {
      ctx.save(); ctx.translate(k * 70, k * 18); ctx.rotate(k * 0.12);
      rr(-95, -55, 190, 110, 10); ctx.fillStyle = '#5BAE6A'; ctx.fill();
      circle(0, 0, 30, '#3E8A4C'); ctx.restore();
    }
    ctx.restore(); tag('नोट', x, y + 160 * s, 38, C.white, '#3E8A4C');
  },
  lock(x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.strokeStyle = C.navy; ctx.lineWidth = 26; ctx.beginPath(); ctx.arc(0, -55, 70, Math.PI, 0); ctx.stroke();
    rr(-110, -40, 220, 190, 20); ctx.fillStyle = C.yellow; ctx.fill();
    circle(0, 45, 22, C.ink); ctx.restore(); tag('ताला', x, y + 205 * s, 38, C.white, '#B8860B');
  },
  airbag(x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    circle(0, 0, 115, C.ink); circle(0, 0, 70, '#4A5568');
    ell(0, -110, 145, 105, C.white); ctx.strokeStyle = C.navy; ctx.lineWidth = 10; ctx.stroke();
    ctx.restore(); tag('एयरबैग', x, y + 190 * s, 38, C.white, '#4A5568');
  },
  toilet(x, y, s, t) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    rr(-135, -170, 270, 230, 24); ctx.fillStyle = C.white; ctx.fill();
    ctx.strokeStyle = C.navy; ctx.lineWidth = 12; ctx.stroke();
    ell(0, 20, 105, 72, '#BFE3F2');
    for (let k = 0; k < 3; k++) {
      ctx.strokeStyle = C.cyan; ctx.lineWidth = 8;
      ctx.beginPath(); ctx.arc(0, 20, 30 + k * 28, t * 2, t * 2 + 4.2); ctx.stroke();
    }
    ctx.restore(); tag('वैक्यूम', x, y + 185 * s, 38, C.white, '#2F8FA8');
  },
};

function arrowLocal(x1, y1, x2, y2, color, w) {
  line([[x1, y1], [x2, y2]], color, w);
  const a = Math.atan2(y2 - y1, x2 - x1), h = w * 2.4;
  ctx.save(); ctx.translate(x2, y2); ctx.rotate(a);
  ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-h, -h * 0.6); ctx.lineTo(-h, h * 0.6); ctx.fillStyle = color; ctx.fill(); ctx.restore();
}

// keyword → element name(s). Matched against the actual spoken text.
const RULES = [
  [/बिजली|करंट|वोल्टेज|झटका/, 'bolt'], [/तार/, 'wire'], [/जकड़|पकड़|ग्रिप|छोड़/, 'handGrip'],
  [/मांसपेश|फ्लेक्सर|एक्सटेंसर|सिकोड़/, 'muscle'], [/स्विच|एमसीबी|मेन स्विच/, 'switch'],
  [/कार|वाहन|गाड़ी/, 'car'], [/दरवाज/, 'door'], [/खिड़की|काँच|कांच/, 'window'],
  [/हेडरेस्ट/, 'headrest'], [/सीटबेल्ट/, 'seatbelt'],
  [/एटीएम|ATM/i, 'atm'], [/नोट|पैस|नकदी/, 'cash'], [/ताला|लॉक|चाबी|कुंजी/, 'lock'],
  [/एयरबैग/, 'airbag'], [/टॉयलेट|शौचालय/, 'toilet'],
  [/लिंक|क्लिक|कमेंट|डिस्क्रिप्शन/, 'click'],
  [/खून|रक्त/, 'blood'],
  [/कीड़ा[^|]{0,12}नहीं|नहीं[^|]{0,12}कीड़ा|कोई कीड़ा/, 'noBug'],
  [/लैक्टिक एसिड|एसिड[^|]{0,15}दांत|दांत[^|]{0,15}एसिड/, 'acidDrop'],
  [/चमगादड़|बैट/, 'bat'], [/उल्ट|सिर के बल|लटक/, 'flip'], [/कमरा|घर|छत|सेलिंग/, 'room'],
  [/फेफड़|सांस/, 'lungs'], [/पेट|आंत|लीवर|गले|निगल/, 'organs'], [/एसिड|अम्ल/, 'stomach'],
  [/आंतें/, 'intestine'], [/प्रेशर|दबाव|दबा|जोर/, 'pressure'], [/जानलेवा|जान जा|जान का|मौत|खतरा|सावधान|हमला|बहरा|डैमेज|फट/, 'danger'],
  [/छींक/, 'sneeze'], [/160|हवा|रफ्तार|तूफान/, 'wind'], [/मुंह|दबाकर|तीली|उंगली|नाक और/, 'hand'],
  [/चुइंगम|गम/, 'gum'], [/7 साल|सात साल|मिथक|झूठ/, 'myth'],
  [/पानी|प्यास|सूख/, 'water'], [/किडनी|पेशाब/, 'kidney'],
  [/दिमाग|ब्रेन/, 'brain'], [/नींद|सोते|सोने/, 'sleep'], [/तरल|CSF|धुलाई/, 'fluid'],
  [/मोबाइल|फोन/, 'phone'], [/प्लेन|हवाई जहाज|फ्लाइट/, 'plane'], [/टावर|सिग्नल टावर|मोबाइल सिग्नल/, 'tower'],
  [/नस|तंत्रिका/, 'muscle'],
  [/कान/, 'ear'], [/कीड़ा|कीट/, 'bug'], [/टैटू|स्याही|सुई/, 'tattoo'],
  [/मैक्रोफेज|रक्षक/, 'macrophage'], [/ब्लैडर/, 'bladder'],
  [/दांत|कैविटी/, 'tooth'], [/बैक्टीरिया|स्ट्रेप्टो/, 'bacteria'], [/मीठा|शुगर|चीनी/, 'sugar'],
];

const SPOKEN_STOP = new Set([
  'की', 'के', 'कि', 'क्या', 'क्यों', 'कैसे', 'सबसे', 'बहुत', 'बिल्कुल', 'लेकिन', 'यह', 'ये', 'वह', 'वो',
  'इस', 'उस', 'इसे', 'उसे', 'अपने', 'अपनी', 'आपका', 'आपके', 'आपको', 'हमारा', 'हमारे', 'हमारी',
  'हैं', 'है', 'था', 'थी', 'थे', 'होता', 'होती', 'होते', 'होगा', 'होगी', 'रहा', 'रही', 'गया', 'गई',
  'नहीं', 'भी', 'ही', 'तो', 'जब', 'तब', 'और', 'एक', 'दो', 'तीन', 'चार', 'पाँच', 'लिए', 'करने', 'करना',
  'जाता', 'जाती', 'सकता', 'सकती', 'चाहे', 'कितना', 'कितनी', 'ज्यादा', 'अंदर', 'बाहर', 'तुरंत', 'अभी',
  'जानने', 'देखने', 'समझ', 'बात', 'सच', 'वैज्ञानिक', 'साइंस', 'शॉर्ट्स', 'एंकर', 'आध्या', 'वीडियो',
]);

function spokenWords(text = '') {
  return [...String(text).matchAll(/[\u0900-\u097F]{3,}/g)]
    .map((m) => m[0])
    .filter((w) => !SPOKEN_STOP.has(w))
    .filter((w, i, a) => a.indexOf(w) === i)
    .slice(0, 3);
}

export function elementKeysFor(text = '') {
  const t = String(text);
  const out = [];
  for (const [re, key] of RULES) if (re.test(t) && !out.includes(key)) out.push(key);

  // context fixes: "no bug" must not also draw a live bug; mouth acid is not stomach acid
  if (out.includes('noBug')) {
    const i = out.indexOf('bug'); if (i >= 0) out.splice(i, 1);
  }
  if (/दांत|इनैमल|छेद/.test(t)) {
    const si = out.indexOf('stomach');
    if (si >= 0) out.splice(si, 1, 'acidDrop');
  }
  if (out.includes('acidDrop')) {
    const si = out.indexOf('stomach'); if (si >= 0) out.splice(si, 1);
  }
  const uniq = [...new Set(out)];

  // Unknown/new topic: show the actual spoken words as on-screen cards, never unrelated art.
  if (!uniq.length) {
    const words = spokenWords(t);
    if (words.length) return words.map((w) => `word:${w}`);
    return [/[?？]/.test(t) || /^(क्या|क्यों|कैसे)/.test(t.trim()) ? 'question' : 'person'];
  }
  return uniq.slice(0, 3);
}

function anchorBadge(t) {
  ctx.save();
  circle(120, 200, 76, C.ink);
  ell(120, 185, 48, 54, C.skin);
  ell(120, 262, 62, 60, '#3A7BD5');
  circle(104, 178, 8, C.ink); circle(136, 178, 8, C.ink);
  ell(120, 210, 18, 22, C.mouth);
  // mic
  rr(178, 190, 20, 52, 10); ctx.fillStyle = C.yellow; ctx.fill();
  line([[188, 240], [188, 275], [160, 275]], C.yellow, 10);
  ctx.restore();
  tag('Anchor Aadhya', 140, 320, 34, C.white, C.ink);
}

export function drawSemanticScene(lineText, script, lineIndex, t, lt, d) {
  const keys = elementKeysFor(lineText);
  const flip = keys.includes('flip');
  const p = flip ? clamp(lt / Math.max(0.7, d * 0.4)) : 0;

  fillAll(C.bg);
  ctx.globalAlpha = 0.1; circle(540, 760, 450, C.yellow); ctx.globalAlpha = 1;
  anchorBadge(t);

  ctx.save();
  if (flip) { ctx.translate(W / 2, H / 2); ctx.rotate(Math.PI * p); ctx.translate(-W / 2, -H / 2); }

  const slots = keys.length === 1 ? [[540, 820, 1.25]]
    : keys.length === 2 ? [[330, 800, 0.95], [790, 800, 0.95]]
    : [[260, 780, 0.78], [540, 790, 0.85], [830, 780, 0.78]];

  keys.forEach((key, k) => {
    const [x, y, s] = slots[k];
    try {
      if (key.startsWith('word:')) E.word(x, y, s, t, key.slice(5));
      else if (key === 'tooth') E.tooth(x, y, s, t, /छेद|दावत|बैक्टीरिया|मीठा/.test(lineText) ? 3 : 0);
      else E[key](x, y, s, t, p);
    } catch (err) {
      console.error('visual error', key, String(err));
    }
  });
  ctx.restore();

  if (typeof location !== 'undefined' && new URLSearchParams(location.search).has('debug')) {
    tag(`Line ${lineIndex + 1}: ${keys.join(' + ')}`, 540, 1330, 30, C.white, C.navy);
  }
  return keys;
}
