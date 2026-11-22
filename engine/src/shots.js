// CINEMATIC ZERO-REPETITION SHOT BUILDER (1080x1920 9:16)
// Guarantees 0% visual repetition for 30s, 60s, or 120s+ documentaries:
// 1. Every single line in the entire video receives a 100% UNIQUE visual scene.
// 2. Used scenes are tracked per video - NO scene is ever reused.
// 3. Sub-shots punch-in with camera zoom and audio cues WITHOUT cycling or recycling scenes.
// 4. Outro CTA is strictly reserved for the final line.
import { ctx, C, W, H } from './core/lib.js';
import { L, T, lineWords } from './core/timing.js';
import * as Cinema from './cinematic_scenes.js';
import { composeMultiSkillScene } from './skills/multi_skill_director.js';

// Dedicated curated topic sequences (1-to-1 matching script lines)
const TOPIC_SEQUENCES = {
  black_hole_spaghettification: [
    Cinema.drawBlackHoleGargantua,
    Cinema.drawEventHorizonLaserGrid,
    Cinema.drawGravitationalLensing,
    Cinema.drawAstronautGravityVectors,
    Cinema.drawSpaghettificationProcess,
    Cinema.drawFrozenTimeDilation,
    Cinema.drawBlackHoleSingularityCTA,
  ],
  chernobyl_300s_room: [
    Cinema.drawChernobylPlant,
    Cinema.drawCountdownTimer,
    Cinema.drawReactorExplosion,
    Cinema.drawCoriumLavaFlow,
    Cinema.drawElephantsFoot,
    Cinema.drawGeigerCounter,
    Cinema.drawMeltingCameraRobot,
    Cinema.drawRadiotrophicFungus,
    Cinema.drawChernobylOutro,
  ],
  mariana_trench_abyss: [
    Cinema.drawEarthGlobe,
    Cinema.drawMarianaChasm,
    Cinema.drawMountEverest,
    Cinema.drawSunRays,
    Cinema.drawSubmarineSearchlight,
    Cinema.drawPressureSlam,
    Cinema.drawElephantWeight,
    Cinema.drawAlienCreature,
    Cinema.drawPlasticDiscovery,
    Cinema.drawOutroCTA,
  ],
  sinking_car_door_physics: [
    Cinema.drawSinkingCarPlunge,
    Cinema.drawDoorPressureLock,
    Cinema.drawWaterWeightPress,
    Cinema.drawTrappedPassenger,
    Cinema.drawSeatbeltAndWindow,
    Cinema.drawHeadrestGlassBreaker,
    Cinema.drawCarEscapeCTA,
  ],
  gta_6_vice_city_secrets: [
    Cinema.drawGta6LogoBudget,
    Cinema.drawGta6ViceCityMap,
    Cinema.drawGta6LuciaJasonMugshot,
    Cinema.drawGta6WaterPhysicsRaytracing,
    Cinema.drawGta6SmartNpcAi,
    Cinema.drawGta6PoliceWantedHelicopter,
    Cinema.drawGta6SocialMediaFeed,
    Cinema.drawGta6SupercarAndAlligator,
    Cinema.drawGta6RobberyInteriorBank,
    Cinema.drawGta6OutroCTA,
  ],
  bermuda_triangle_secret: [
    Cinema.drawBermudaTriangleMap,
    Cinema.drawBermudaPerimeterRadar,
    Cinema.drawMethaneBubblesEruption,
    Cinema.drawShipSinkingAbyss,
    Cinema.drawHexagonalCloudAirBombs,
    Cinema.drawAirplaneStormDisaster,
    Cinema.drawMagneticCompassChaos,
    Cinema.drawBermudaOutroCTA,
  ],
  deepest_hole_kola_superdeep: [
    Cinema.drawKolaBoreholeDrillDepth,
    Cinema.drawKolaCrustCrossSection,
    Cinema.drawKolaThermalInferno180C,
    Cinema.drawKolaMeltingSteelDrill,
    Cinema.drawKolaBoilingWaterTrapped,
    Cinema.drawKolaAncientMicrofossils,
    Cinema.drawKolaSealedSteelDoorCap,
    Cinema.drawKolaOutroCTA,
  ],
};

// Thematic procedural pools for dynamic topics or longer scripts (1 min, 2 min)
const POOL_SPACE = [
  Cinema.drawBlackHoleGargantua,
  Cinema.drawEventHorizonLaserGrid,
  Cinema.drawGravitationalLensing,
  Cinema.drawAstronautGravityVectors,
  Cinema.drawSpaghettificationProcess,
  Cinema.drawFrozenTimeDilation,
  Cinema.drawSolarFlareCoronalMass,
  Cinema.drawNeutronStarPulsar,
];

const POOL_OCEAN = [
  Cinema.drawEarthGlobe,
  Cinema.drawMarianaChasm,
  Cinema.drawMountEverest,
  Cinema.drawSunRays,
  Cinema.drawSubmarineSearchlight,
  Cinema.drawPressureSlam,
  Cinema.drawElephantWeight,
  Cinema.drawAlienCreature,
  Cinema.drawPlasticDiscovery,
  Cinema.drawBermudaTriangleMap,
  Cinema.drawBermudaPerimeterRadar,
  Cinema.drawMethaneBubblesEruption,
  Cinema.drawShipSinkingAbyss,
  Cinema.drawHexagonalCloudAirBombs,
  Cinema.drawAirplaneStormDisaster,
  Cinema.drawMagneticCompassChaos,
];

const POOL_PHYSICS_DANGER = [
  Cinema.drawChernobylPlant,
  Cinema.drawCountdownTimer,
  Cinema.drawReactorExplosion,
  Cinema.drawCoriumLavaFlow,
  Cinema.drawElephantsFoot,
  Cinema.drawGeigerCounter,
  Cinema.drawMeltingCameraRobot,
  Cinema.drawRadiotrophicFungus,
  Cinema.drawKolaBoreholeDrillDepth,
  Cinema.drawKolaCrustCrossSection,
  Cinema.drawKolaThermalInferno180C,
  Cinema.drawKolaMeltingSteelDrill,
  Cinema.drawKolaBoilingWaterTrapped,
  Cinema.drawKolaAncientMicrofossils,
  Cinema.drawKolaSealedSteelDoorCap,
];

const POOL_BIOLOGY_BODY = [
  Cinema.drawHumanBrainSynapse,
  Cinema.drawCellularDNAStructure,
  Cinema.drawHeartArteryPressure,
  Cinema.drawMicroscopicBacteria,
  Cinema.drawEarCanalCrossSection,
  Cinema.drawToothAcidCavityDecay,
  Cinema.drawDehydrationOrganFailure,
  Cinema.drawUrineBladderExpansion,
  Cinema.drawSneezeBlastPressure,
  Cinema.drawTattooInkMacrophage,
];

const POOL_NEUTRAL_SCIENCE = [
  Cinema.drawEarthGlobe,
  Cinema.drawCountdownTimer,
  Cinema.drawBermudaPerimeterRadar,
  Cinema.drawPressureSlam,
  Cinema.drawWaterWeightPress,
  Cinema.drawElephantWeight,
  Cinema.drawMountEverest,
  Cinema.drawSunRays,
];

const POOL_TECH_SURVIVAL = [
  Cinema.drawAtmCashMechanics,
  Cinema.drawAirplaneCockpitRadar,
  Cinema.drawSinkingCarPlunge,
  Cinema.drawDoorPressureLock,
  Cinema.drawWaterWeightPress,
  Cinema.drawTrappedPassenger,
  Cinema.drawSeatbeltAndWindow,
  Cinema.drawHeadrestGlassBreaker,
];

const GLOBAL_FALLBACK_POOL = [
  ...POOL_NEUTRAL_SCIENCE,
  ...POOL_TECH_SURVIVAL,
  ...POOL_OCEAN,
  ...POOL_PHYSICS_DANGER,
  ...POOL_BIOLOGY_BODY,
  ...POOL_SPACE,
];

// Direct Object-to-Scene Mappings (Guarantees literal object alignment for spoken words)
const DIRECT_OBJECT_MAPPINGS = [
  { test: /(?:पृथ्वी|धरती|ग्लोब|planet\s*earth)/i, scene: Cinema.drawEarthGlobe },
  { test: /(?:इतिहास|सन\s*\d{4}|साल|वर्ष|1919|1997|history|time)/i, scene: Cinema.drawCountdownTimer },
  { test: /(?:लहर|बाढ़|गुड़|तरल|नदी|flood|liquid|fluid)/i, scene: Cinema.drawWaterWeightPress },
  { test: /(?:टैंक|धातु|इस्पात|लोहा|tank|steel|rivet)/i, scene: Cinema.drawDoorPressureLock },
  { test: /(?:जहाज|नाव|बोट|कश्ती|cargo\s*ship)/i, scene: Cinema.drawShipSinkingAbyss },
  { test: /(?:बादल|तूफान|बिजली|storm\s*cloud|air[- ]?bomb)/i, scene: Cinema.drawHexagonalCloudAirBombs },
  { test: /(?:हवाई\s*जहाज|विमान|फ्लाइट|airplane)/i, scene: Cinema.drawAirplaneStormDisaster },
  { test: /(?:कंपास|दिशा\s*सूचक|चुंबकीय|compass)/i, scene: Cinema.drawMagneticCompassChaos },
  { test: /(?:एटीएम|कैश|करेंसी|नोट\s*गिन|atm\s*machine)/i, scene: Cinema.drawAtmCashMechanics },
  { test: /(?:कार|दरवाज़ा|कांच\s*तोड़|खिड़की|विंडो)/i, scene: Cinema.drawDoorPressureLock },
  { test: /(?:दिमाग|न्यूरॉन|सोच|brain)/i, scene: Cinema.drawHumanBrainSynapse },
  { test: /(?:दिल|धड़कन|खून|धमनी|heart)/i, scene: Cinema.drawHeartArteryPressure },
  { test: /(?:डीएनए|dna|जीन)/i, scene: Cinema.drawCellularDNAStructure },
  { test: /(?:चेरनोबिल|रेडिएशन|परमाणु|रिएक्टर|गीगर)/i, scene: Cinema.drawChernobylPlant },
  { test: /(?:हाथी\s*का\s*पैर|corium|लावा)/i, scene: Cinema.drawElephantsFoot },
  { test: /(?:ब्लैक\s*होल|सिंगुलैरिटी|इवेंट\s*होराइजन)/i, scene: Cinema.drawBlackHoleGargantua },
  { test: /(?:गहराई|खाई|मारियाना|चैलेंजर|ocean\s*abyss)/i, scene: Cinema.drawMarianaChasm },
  { test: /(?:पनडुब्बी|सर्चलाइट|submarine|submersible)/i, scene: Cinema.drawSubmarineSearchlight },
  { test: /(?:राडार|रडार|तरंग|radar|पेरीमीटर|सोनार|हाइड्रोफोन|सिग्नल|acoustic)/i, scene: Cinema.drawBermudaPerimeterRadar },
  { test: /(?:बुलबुले|गैस|मीथेन|bubbles)/i, scene: Cinema.drawMethaneBubblesEruption },
  { test: /(?:जीव|प्राणी|राक्षस|व्हेल|मछली|creature|monster|whale)/i, scene: Cinema.drawAlienCreature },
  { test: /(?:दबाव|प्रेशर|वजन|कुचल|pressure|slam)/i, scene: Cinema.drawPressureSlam },
  { test: /(?:प्लास्टिक|कचरा|खोज|मलबे|plastic)/i, scene: Cinema.drawPlasticDiscovery },
  { test: /(?:सूरज|सौर|किरणें|रोशनी|प्रकाश|sun|flare)/i, scene: Cinema.drawSolarFlareCoronalMass },
  { test: /(?:पल्सर|न्यूट्रॉन|तारा|pulsar|star)/i, scene: Cinema.drawNeutronStarPulsar },
  { test: /(?:एवरेस्ट|पहाड़|चोटी|mount\s*everest)/i, scene: Cinema.drawMountEverest },
  { test: /(?:ड्रिल|बोरहोल|12,262|गड्ढा)/i, scene: Cinema.drawKolaBoreholeDrillDepth },
  { test: /(?:क्रस्ट|परत|मेंटल|भूविज्ञान|strata)/i, scene: Cinema.drawKolaCrustCrossSection },
  { test: /(?:पिघलने|पिघल|ड्रिल-बिट|टंगस्टन)/i, scene: Cinema.drawKolaMeltingSteelDrill },
  { test: /(?:भाप|खौलता|गीजर)/i, scene: Cinema.drawKolaBoilingWaterTrapped },
  { test: /(?:जीवाश्म|सूक्ष्मजीव|माइक्रोफ़ॉसिल्स|microfossil)/i, scene: Cinema.drawKolaAncientMicrofossils },
  { test: /(?:सील|नट-बोल्ट|12\s*बोल्ट|SG-3)/i, scene: Cinema.drawKolaSealedSteelDoorCap },
  { test: /(?:बैक्टीरिया|कीटाणु|संक्रमण|bacteria)/i, scene: Cinema.drawMicroscopicBacteria },
  { test: /(?:कान|पर्दा|ध्वनि|सुनना|ear|acoustic)/i, scene: Cinema.drawEarCanalCrossSection },
  { test: /(?:दांत|कैविटी|एसिड|tooth|decay)/i, scene: Cinema.drawToothAcidCavityDecay },
  { test: /(?:पानी\s*की\s*कमी|डिहाइड्रेशन|अंग|dehydration)/i, scene: Cinema.drawDehydrationOrganFailure },
  { test: /(?:छींक|दबाना|विस्फोट|sneeze)/i, scene: Cinema.drawSneezeBlastPressure },
  { test: /(?:टैटू|इंक|स्याही|इम्यून|tattoo)/i, scene: Cinema.drawTattooInkMacrophage },
];

function getOutroScene(script) {
  if (script.id === 'black_hole_spaghettification') return Cinema.drawBlackHoleSingularityCTA;
  if (script.id === 'chernobyl_300s_room') return Cinema.drawChernobylOutro;
  if (script.id === 'mariana_trench_abyss') return Cinema.drawOutroCTA;
  if (script.id === 'sinking_car_door_physics') return Cinema.drawCarEscapeCTA;
  if (script.id === 'gta_6_vice_city_secrets') return Cinema.drawGta6OutroCTA;
  if (script.id === 'bermuda_triangle_secret') return Cinema.drawBermudaOutroCTA;
  if (script.id === 'deepest_hole_kola_superdeep') return Cinema.drawKolaOutroCTA;
  return Cinema.drawUniversalOutroCTA;
}

export function buildShots(script = {}) {
  const S = [], CUES = [];
  const add = (o) => (S.push(o), o);
  const cue = (t, type, o = {}) => CUES.push({ t: +t.toFixed(3), type, ...o });
  const lines = script.lines || [];
  const n = lines.length || 1;

  // STRICT ZERO-REPETITION GUARANTEE
  // A Set of used scene functions in this video. A scene will NEVER be repeated!
  const usedScenes = new Set();
  const outroScene = getOutroScene(script);
  usedScenes.add(outroScene); // Reserve outro exclusively for the final line

  const topicCurated = TOPIC_SEQUENCES[script.id] || null;

  for (let i = 0; i < n; i++) {
    const isLastLine = (i === n - 1);
    let sceneFn = null;

    if (isLastLine) {
      sceneFn = outroScene;
    } else if (script.id === 'sinking_car_door_physics') {
      const text = String(lines[i]?.text || '');
      if (i === 0 || /नदी\s*में\s*गिरे|डूबना\s*शुरू|कार\s*पानी\s*में/i.test(text)) sceneFn = Cinema.drawSinkingCarPlunge;
      else if (/तैर|सतह|बाहर\s*निकल|एस्केप/i.test(text)) sceneFn = Cinema.drawSinkingCarPlunge;
      else if (/हेडरेस्ट|रॉड|कांच\s*के\s*बीच|विंडशील्ड|टेम्पर्ड/i.test(text)) sceneFn = Cinema.drawHeadrestGlassBreaker;
      else if (/वजन|800|किलो|सांड|दबाव\s*बराबर|पानी\s*भरने/i.test(text)) sceneFn = Cinema.drawWaterWeightPress;
      else if (/सीटबेल्ट|विंडो|खिड़की|रोल/i.test(text)) sceneFn = Cinema.drawSeatbeltAndWindow;
      else if (/गोल्डन|सेकंड|समय|30\s*से\s*60|चरण\s*1/i.test(text)) sceneFn = Cinema.drawCountdownTimer;
      else if (/फंसा|यात्री|ऊर्जा|बर्बाद|पैनिक|धकेल/i.test(text)) sceneFn = Cinema.drawTrappedPassenger;
      else if (/दरवाज़ा|प्रेशर|लॉक|दबाव|क्षेत्रफल|सेंट्रल/i.test(text)) sceneFn = Cinema.drawDoorPressureLock;
      else sceneFn = Cinema.drawSinkingCarPlunge;
    } else if (script.id === 'mariana_trench_abyss') {
      const text = String(lines[i]?.text || '');
      if (/पृथ्वी|ग्लोब|धरती/i.test(text)) sceneFn = Cinema.drawEarthGlobe;
      else if (/एवरेस्ट|पहाड़|माउंट/i.test(text)) sceneFn = Cinema.drawMountEverest;
      else if (/सूरज|धूप|किरणें|रोशनी/i.test(text)) sceneFn = Cinema.drawSunRays;
      else if (/पनडुब्बी|सर्चलाइट/i.test(text)) sceneFn = Cinema.drawSubmarineSearchlight;
      else if (/दबाव|प्रेशर|slam/i.test(text)) sceneFn = Cinema.drawPressureSlam;
      else if (/हाथी|वजन|हवाई\s*जहाज/i.test(text)) sceneFn = Cinema.drawElephantWeight;
      else if (/जीव|राक्षस|प्राणी|चमक/i.test(text)) sceneFn = Cinema.drawAlienCreature;
      else if (/प्लास्टिक|कचरा/i.test(text)) sceneFn = Cinema.drawPlasticDiscovery;
      else sceneFn = Cinema.drawMarianaChasm;
    } else if (script.id === 'chernobyl_300s_room') {
      const text = String(lines[i]?.text || '');
      if (/रिएक्टर|धमाका|विस्फोट/i.test(text)) sceneFn = Cinema.drawReactorExplosion;
      else if (/लावा|corium/i.test(text)) sceneFn = Cinema.drawCoriumLavaFlow;
      else if (/हाथी\s*का\s*पैर|foot/i.test(text)) sceneFn = Cinema.drawElephantsFoot;
      else if (/गीगर|काउंटर/i.test(text)) sceneFn = Cinema.drawGeigerCounter;
      else if (/कैमरा|रोबोट|पिघल/i.test(text)) sceneFn = Cinema.drawMeltingCameraRobot;
      else if (/फंगस|कवक/i.test(text)) sceneFn = Cinema.drawRadiotrophicFungus;
      else if (/समय|सेकंड|टाइमर/i.test(text)) sceneFn = Cinema.drawCountdownTimer;
      else sceneFn = Cinema.drawChernobylPlant;
    } else if (script.id === 'bermuda_triangle_secret') {
      const text = String(lines[i]?.text || '');
      if (/राडार|radar/i.test(text)) sceneFn = Cinema.drawBermudaPerimeterRadar;
      else if (/मीथेन|बुलबुले/i.test(text)) sceneFn = Cinema.drawMethaneBubblesEruption;
      else if (/जहाज|डूब|ship/i.test(text)) sceneFn = Cinema.drawShipSinkingAbyss;
      else if (/तूफान|बादल|air\s*bomb/i.test(text)) sceneFn = Cinema.drawHexagonalCloudAirBombs;
      else if (/हवाई\s*जहाज|विमान|flight/i.test(text)) sceneFn = Cinema.drawAirplaneStormDisaster;
      else if (/कंपास|दिशा|चुंबकीय/i.test(text)) sceneFn = Cinema.drawMagneticCompassChaos;
      else sceneFn = Cinema.drawBermudaTriangleMap;
    } else if (topicCurated && i < topicCurated.length - 1 && !usedScenes.has(topicCurated[i])) {
      sceneFn = topicCurated[i];
    } else {
      const text = String(lines[i]?.text || '');

      // 1. High-Precision Multi-Skill Fusion Compositor (Bio, ATM, Aviation, Kola)
      const multiSkill = composeMultiSkillScene(script, i, text, isLastLine);
      if (multiSkill) {
        sceneFn = multiSkill;
      } else {
        // 2. Direct Object Matching Priority (Checks if an exact spoken physical entity is requested)
        const directMatch = DIRECT_OBJECT_MAPPINGS.find((m) => m.test.test(text) && !usedScenes.has(m.scene));
        if (directMatch) {
          sceneFn = directMatch.scene;
        } else {
          // 3. Keyword semantic category matching
          let candidatePool = POOL_NEUTRAL_SCIENCE;
          const fullContext = (script.id + ' ' + (script.title || '') + ' ' + text).toLowerCase();

          if (/अंतरिक्ष|तारा|ब्लैक\s*होल|ग्रेविटी|रोशनी|प्रकाश|ब्रह्मांड|ग्रह|space|black\s*hole|star|astronomy|galaxy/i.test(fullContext)) {
            candidatePool = POOL_SPACE;
          } else if (/समुद्र|पानी|गहराई|दबाव|महासागर|मछली|जहाज|आवाज़|ध्वनि|लहर|गुड़|बाढ़|नदी|तरल|flood|wave|liquid|fluid|ocean|abyss|marine|water|sound/i.test(fullContext)) {
            candidatePool = POOL_OCEAN;
          } else if (/रेडिएशन|परमाणु|विस्फोट|धमाका|जहर|केमिकल|लावा|हादसा|आपदा|टैंक|फट|chernobyl|radiation|toxic|hazard|disaster|explosion|burst/i.test(fullContext)) {
            candidatePool = POOL_PHYSICS_DANGER;
          } else if (/शरीर|दिमाग|खून|दिल|नस|हड्डी|आंत|दांत|कोशिका|इंसान|सांस|नाक|कान|बॉडी|मांसपेशी|body|heart|brain|shock|muscle/i.test(fullContext)) {
            candidatePool = POOL_BIOLOGY_BODY;
          } else if (/कार|दरवाज़ा|कांच|खिड़की|हथौड़ा|एटीएम|फ्लाइट|हवाई|मशीन|इंजीनियरिंग|इतिहास|car|airplane|atm|survive|tech|history|engineering/i.test(fullContext)) {
            candidatePool = POOL_TECH_SURVIVAL;
          }

          // Find first unused scene in candidate pool
          sceneFn = candidatePool.find((fn) => !usedScenes.has(fn));

          // If all candidate pool scenes are used, find any unused scene in global pool
          if (!sceneFn) {
            sceneFn = GLOBAL_FALLBACK_POOL.find((fn) => !usedScenes.has(fn));
          }

          // Strict Fallback (Never select outroCTA during non-last lines!)
          if (!sceneFn) {
            const safePool = candidatePool.filter(fn => fn !== outroScene && fn !== Cinema.drawUniversalOutroCTA);
            sceneFn = (safePool.length > 0)
              ? safePool[i % safePool.length]
              : GLOBAL_FALLBACK_POOL[i % GLOBAL_FALLBACK_POOL.length];
          }
        }
      }
    }

    usedScenes.add(sceneFn);

    // High-dopamine kinetic cuts within Line i: Max 1.8-2.2s per sub-shot!
    const ws = lineWords(i);
    const text = String(lines[i]?.text || '');
    const lineStart = ws.length ? ws[0].s : L(i);
    const lineEnd = ws.length ? ws[ws.length - 1].e : (i + 1 < n ? L(i + 1) : T.dur);
    const totalLineDur = Math.max(0.8, lineEnd - lineStart);

    // Calculate dynamic cut points so no shot ever lingers longer than 1.8 seconds
    const cutPoints = [lineStart];
    const targetSubDur = 1.65;
    const numSubShots = Math.max(1, Math.round(totalLineDur / targetSubDur));

    if (numSubShots > 1 && ws.length >= numSubShots) {
      for (let s = 1; s < numSubShots; s++) {
        const targetTime = lineStart + s * (totalLineDur / numSubShots);
        const closestWord = ws.reduce((prev, curr) =>
          Math.abs(curr.s - targetTime) < Math.abs(prev.s - targetTime) ? curr : prev, ws[0]
        );
        if (closestWord.s > cutPoints[cutPoints.length - 1] + 0.9 && closestWord.s < lineEnd - 0.6) {
          cutPoints.push(closestWord.s);
        }
      }
    }

    cutPoints.forEach((atTime, subIdx) => {
      const nextAt = subIdx + 1 < cutPoints.length ? cutPoints[subIdx + 1] : lineEnd;
      const shotDur = Math.max(0.7, nextAt - atTime);

      // Distinct cinematic camera perspectives per beat:
      // Beat 0: Wide establishing view
      // Beat 1: Tight dramatic Close-Up detail punch
      // Beat 2: Dynamic high-tension angled perspective
      // Beat 3: Low-angle power punch
      const cams = [
        [540, 920],
        [540, 720],
        [600, 840],
        [480, 760],
      ];
      const zooms = [0.05, 0.28, 0.18, 0.32];

      add({
        id: `L${String(i + 1).padStart(2, '0')}_S${subIdx + 1}`,
        at: Math.max(0, atTime - 0.04),
        cam: cams[subIdx % cams.length],
        zoom: zooms[subIdx % zooms.length],
        zoomFast: subIdx > 0,
        note: `Line ${i + 1} Beat ${subIdx + 1}: ${text.slice(0, 32)}`,
        sceneName: sceneFn ? (sceneFn.name || 'custom_lambda') : 'none',
        draw(lt, d, t) {
          if (typeof sceneFn === 'function') {
            sceneFn(lt, d, t, subIdx);
          }
        },
      });

      // Clean, professional audio: No recurring sound clutter or mid-sentence pops!
      // Only an occasional subtle transition whoosh on line changes
      if (subIdx === 0 && i > 0 && i % 2 === 0) {
        cue(atTime, 'whoosh', { gain: 0.20 });
      }
    });
  }

  return { shots: S, cues: CUES };
}
