// 10+ Diverse Character Presets for Anchor Aadhya 3D Explainer Engine
// Supports dynamic mood/topic-based character selection with custom body types and styles.

export const CHARACTERS = {
  // 1. Dr. Aadhya - Attractive, stylish female lead doctor
  dr_aadhya: {
    id: 'dr_aadhya',
    name: 'Dr. Aadhya',
    role: 'Lead Medical Specialist',
    gender: 'female',
    bodyType: 'female_hourglass',
    skin: '#F5C4A8',
    shirt: '#D82B4E',      // Ruby crop top
    pants: '#1E293B',      // Dark slate tailored trousers
    shoes: '#FFFFFF',
    hair: '#1E1510',       // Raven black
    hairStyle: 'long_flow', // Long flowing hair past shoulders
    iris: '#634832',       // Hazel
    scale: 0.96,
    outfit: 'crop_top_leggings',
    desc: 'Stylish, attractive female lead doctor in ruby fitted top and dark trousers'
  },

  // 2. Zara - Ultra-fit, athletic cyber fitness female
  zara_fit: {
    id: 'zara_fit',
    name: 'Zara',
    role: 'Athletic / Fitness Specialist',
    gender: 'female',
    bodyType: 'female_hourglass',
    skin: '#E8AA85',       // Golden tan
    shirt: '#FF5733',      // Vibrant neon coral crop tank
    pants: '#111827',      // Sleek black compression leggings
    shoes: '#FF5733',
    hair: '#2D1B10',       // Dark chocolate
    hairStyle: 'high_pony',// Sleek high ponytail
    iris: '#22D3EE',       // Piercing cyan
    scale: 0.95,
    outfit: 'crop_top_leggings',
    desc: 'Athletic, gorgeous fitness female with high ponytail & neon workout attire'
  },

  // 3. Maya - Chic modern female scientist / researcher
  maya_scientist: {
    id: 'maya_scientist',
    name: 'Maya',
    role: 'Senior Molecular Biologist',
    gender: 'female',
    bodyType: 'female_hourglass',
    skin: '#F7CEB9',
    shirt: '#059669',      // Emerald green turtleneck
    pants: '#1F2937',      // Charcoal high-waist pants
    shoes: '#E5E7EB',
    hair: '#4A2810',       // Warm chestnut auburn
    hairStyle: 'chic_bun', // Elegant chic hair bun
    iris: '#10B981',       // Emerald green
    scale: 0.94,
    outfit: 'casual',
    desc: 'Chic, intelligent female researcher in emerald turtleneck and chic bun'
  },

  // 4. Riya - Modern young stylish college girl
  riya_student: {
    id: 'riya_student',
    name: 'Riya',
    role: 'Curious College Student',
    gender: 'female',
    bodyType: 'female_hourglass',
    skin: '#FAD5C0',
    shirt: '#F472B6',      // Pastel rose-pink top
    pants: '#3B82F6',      // Fitted blue denim
    shoes: '#FFFFFF',
    hair: '#1F1610',
    hairStyle: 'long_flow',
    iris: '#78350F',
    scale: 0.93,
    outfit: 'casual',
    desc: 'Trendy, charming college girl in pastel pink sweater & stylish denim'
  },

  // 5. Dr. Kabir - Senior surgeon in scrub suit
  dr_kabir: {
    id: 'dr_kabir',
    name: 'Dr. Kabir',
    role: 'Chief Trauma Surgeon',
    gender: 'male',
    bodyType: 'regular',
    skin: '#DCA282',
    shirt: '#0D9488',      // Hospital surgical teal
    pants: '#0D9488',      // Matching teal scrub pants
    shoes: '#F8FAFC',
    hair: '#292524',
    hairStyle: 'quiff',
    iris: '#451A03',
    scale: 1.0,
    outfit: 'casual',
    desc: 'Experienced surgeon in hospital surgical teal scrubs'
  },

  // 6. Detective Vikram - Dark noir investigator
  detective_vikram: {
    id: 'detective_vikram',
    name: 'Inspector Vikram',
    role: 'Forensic Criminal Investigator',
    gender: 'male',
    bodyType: 'regular',
    skin: '#CB9072',
    shirt: '#374151',      // Dark charcoal button-up
    pants: '#1F2937',      // Noir black trousers
    shoes: '#111827',
    hair: '#1C1917',
    hairStyle: 'quiff',
    iris: '#292524',
    scale: 1.02,
    outfit: 'casual',
    desc: 'Intense forensic detective for mysteries, crime, and poison cases'
  },

  // 7. Prof. Mehta - Eccentric scientist
  prof_mehta: {
    id: 'prof_mehta',
    name: 'Professor Mehta',
    role: 'Quantum Physics & Neurologist',
    gender: 'male',
    bodyType: 'slender',
    skin: '#ECC4A8',
    shirt: '#F8FAFC',      // Crisp laboratory white coat
    pants: '#4B5563',      // Vintage grey trousers
    shoes: '#374151',
    hair: '#E2E8F0',       // Wild silver-white hair
    hairStyle: 'wild_scientist',
    iris: '#3B82F6',
    scale: 0.98,
    outfit: 'casual',
    desc: 'Eccentric senior genius scientist with wild silver hair & white lab coat'
  },

  // 8. Alex - Classic curious everyday guy
  alex_hero: {
    id: 'alex_hero',
    name: 'Alex',
    role: 'Curious Everyday Youth',
    gender: 'male',
    bodyType: 'regular',
    skin: '#E3A988',
    shirt: '#2563EB',      // Royal blue hoodie
    pants: '#1E293B',      // Denim jeans
    shoes: '#FFFFFF',
    hair: '#3A2618',
    hairStyle: 'quiff',
    iris: '#4A3426',
    scale: 1.0,
    outfit: 'casual',
    desc: 'Classic everyday relatable protagonist in blue hoodie'
  },

  // 9. Leo - Muscular gym athlete
  leo_athlete: {
    id: 'leo_athlete',
    name: 'Leo',
    role: 'Bodybuilding & Fitness Expert',
    gender: 'male',
    bodyType: 'muscular',
    skin: '#D99875',
    shirt: '#18181B',      // Black compression sleeveless tank
    pants: '#52525B',      // Athletic grey gym shorts
    shoes: '#DC2626',      // Red sports kicks
    hair: '#18181B',
    hairStyle: 'quiff',
    iris: '#3F3F46',
    scale: 1.05,
    outfit: 'crop_top_leggings',
    desc: 'Muscular athletic powerhouse for sports, muscle, and body strain topics'
  },

  // 10. Captain Neil - Deep space astronaut
  captain_neil: {
    id: 'captain_neil',
    name: 'Captain Neil',
    role: 'Deep Space Mission Commander',
    gender: 'male',
    bodyType: 'regular',
    skin: '#E5A685',
    shirt: '#F1F5F9',      // White pressurized space suit
    pants: '#F1F5F9',      // White pressurized trousers with cyan tech cuffs
    shoes: '#334155',
    hair: '#292524',
    hairStyle: 'quiff',
    iris: '#38BDF8',
    scale: 1.02,
    outfit: 'casual',
    desc: 'Futuristic astronaut for space, gravity, and cosmic vacuum explainers'
  },

  // 11. Cyber Scout - Futuristic cyber courier
  cyber_scout: {
    id: 'cyber_scout',
    name: 'Kael',
    role: 'Cyberpunk Tech Operative',
    gender: 'male',
    bodyType: 'athletic',
    skin: '#E7AD8A',
    shirt: '#8B5CF6',      // Neon violet cyber jacket
    pants: '#09090B',      // Matte black combat pants
    shoes: '#A855F7',
    hair: '#4C1D95',       // Electric purple hair
    hairStyle: 'quiff',
    iris: '#C084FC',
    scale: 0.99,
    outfit: 'casual',
    desc: 'Cyberpunk specialist with neon purple aesthetic for AI & future tech topics'
  },

  // 12. Zen Yogi - Meditative spiritual sage
  zen_master: {
    id: 'zen_master',
    name: 'Acharya Anand',
    role: 'Mindfulness & Meditation Master',
    gender: 'male',
    bodyType: 'slender',
    skin: '#D49B7A',
    shirt: '#EA580C',      // Saffron meditation robe
    pants: '#EA580C',
    shoes: '#78350F',
    hair: '#1C1917',
    hairStyle: 'chic_bun', // Meditative topknot
    iris: '#451A03',
    scale: 0.97,
    outfit: 'casual',
    desc: 'Serene mindfulness master for sleep, brain peace, and meditation'
  }
};

/** Selects the best character based on topic category / keywords or rotates dynamically */
export function pickCharacterForTopic(topic = {}) {
  const tId = (topic.id || '').toLowerCase();
  const text = `${topic.title || ''} ${topic.category || ''} ${topic.desc || ''}`.toLowerCase();

  // Attractive female leads (Dr. Aadhya / Zara / Maya / Riya) for medical, health, beauty, eyes, fitness
  if (text.includes('eye') || text.includes('आँख') || text.includes('immune') || text.includes('skin') || text.includes('skin') || text.includes('beauty')) {
    return CHARACTERS.dr_aadhya;
  }
  if (text.includes('fit') || text.includes('muscle') || text.includes('workout') || text.includes('water') || text.includes('पानी') || text.includes('fat') || text.includes('diet')) {
    return CHARACTERS.zara_fit;
  }
  if (text.includes('dna') || text.includes('gene') || text.includes('cell') || text.includes('virus') || text.includes('bacteria') || text.includes('lab')) {
    return CHARACTERS.maya_scientist;
  }
  if (text.includes('coffee') || text.includes('कॉफी') || text.includes('phone') || text.includes('sneeze') || text.includes('chewing') || text.includes('gum')) {
    return CHARACTERS.riya_student;
  }
  if (text.includes('surgery') || text.includes('hospital') || text.includes('heart') || text.includes('kidney') || text.includes('blood') || text.includes('खून')) {
    return CHARACTERS.dr_kabir;
  }
  if (text.includes('mystery') || text.includes('poison') || text.includes('crime') || text.includes('death') || text.includes('secret') || text.includes('trunk') || text.includes('escape')) {
    return CHARACTERS.detective_vikram;
  }
  if (text.includes('quantum') || text.includes('radiation') || text.includes('atom') || text.includes('electric') || text.includes('shock') || text.includes('करंट')) {
    return CHARACTERS.prof_mehta;
  }
  if (text.includes('space') || text.includes('planet') || text.includes('gravity') || text.includes('moon') || text.includes('airplane')) {
    return CHARACTERS.captain_neil;
  }
  if (text.includes('sleep') || text.includes('dream') || text.includes('नींद') || text.includes('brain') || text.includes('दिमाग') || text.includes('meditation')) {
    return CHARACTERS.dr_aadhya; // Default to Dr. Aadhya for high retention
  }

  // Fallback round-robin across top diverse archetypes
  const all = Object.values(CHARACTERS);
  const hash = Math.abs((tId || 'default').split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
  return all[hash % all.length];
}
