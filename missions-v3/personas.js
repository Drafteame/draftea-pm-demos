// Three demo personas that land on different Loyalty states.
// Tier logic: Silver 1–3, Emerald 4–5, Gold 6–10 (matches v1's LEVELS table).
window.PERSONAS = (function () {
  const LEVELS = [
    { n: 1,  tier: 'silver',  xpCap: 1000,    badge: 'assets/level-badge-silver.png'  },
    { n: 2,  tier: 'silver',  xpCap: 2500,    badge: 'assets/level-badge-silver.png'  },
    { n: 3,  tier: 'silver',  xpCap: 5000,    badge: 'assets/level-badge-silver.png'  },
    { n: 4,  tier: 'emerald', xpCap: 10000,   badge: 'assets/level-badge-emerald.png' },
    { n: 5,  tier: 'emerald', xpCap: 25000,   badge: 'assets/level-badge-emerald.png' },
    { n: 6,  tier: 'gold',    xpCap: 50000,   badge: 'assets/level-badge-gold.png'    },
    { n: 7,  tier: 'gold',    xpCap: 100000,  badge: 'assets/level-badge-gold.png'    },
    { n: 8,  tier: 'gold',    xpCap: 250000,  badge: 'assets/level-badge-gold.png'    },
    { n: 9,  tier: 'gold',    xpCap: 500000,  badge: 'assets/level-badge-gold.png'    },
    { n: 10, tier: 'gold',    xpCap: 1000000, badge: 'assets/level-badge-gold.png'    },
  ];

  const TIER_COLORS = {
    silver:  { glow: '#C9C9C9', accent: '#D9D1E5', chip: 'rgba(201,201,201,0.18)', label: 'PLATA'    },
    emerald: { glow: '#34D399', accent: '#34D399', chip: 'rgba(52,211,153,0.18)',  label: 'ESMERALDA' },
    gold:    { glow: '#FFB020', accent: '#FFB020', chip: 'rgba(255,176,32,0.18)',  label: 'ORO'      },
  };

  const personas = [
    {
      id: 'adhoc-v1',
      name: 'V1 Ad-hoc · cashback',
      level: 4,
      xp: 7200,
      xpNext: 10000,
      flow: 'adhoc-v1',
      blurb: 'Nueva experiencia de misiones V1 (Apr 27): ad-hoc, cashback automático, opt-in. Layered sobre Lealtad.',
      tagline: 'Ad-hoc · cashback · opt-in',
    },
    {
      id: 'new',
      name: 'Usuario nuevo',
      level: 1,
      xp: 240,
      xpNext: 1000,
      flow: 'onboarding',
      view: 'groups',
      completedIds: ['onb-b1-first-bet', 'onb-d1-notifications'],
      blurb: 'Primera semana en Draftea. Quest board agrupado (A/B/C/D), 2 de 12 misiones hechas.',
      tagline: 'Onboarding · grupos · 2 / 12',
    },
    {
      id: 'new-trail',
      name: 'Usuario nuevo · sendero',
      level: 1,
      xp: 240,
      xpNext: 1000,
      flow: 'onboarding',
      view: 'trail',
      completedIds: ['onb-b1-first-bet', 'onb-d1-notifications'],
      blurb: 'Mismo onboarding pero estilo Duolingo: un camino único de nodos, sin agrupación arriba.',
      tagline: 'Onboarding · sendero · 2 / 12',
    },
    {
      id: 'graduated',
      name: 'Recién graduado',
      level: 4,
      xp: 7200,
      xpNext: 10000,
      flow: 'ongoing',
      completedIds: 'ALL',
      weeklyOverrides: { 'wk-3days': { progress: 2, target: 3 } },
      blurb: 'Terminó el onboarding, arranca su primera semana con misiones recurrentes.',
      tagline: 'Semana 1 · 2 / 5',
    },
    {
      id: 'vip',
      name: 'Jugador frecuente',
      level: 7,
      xp: 68400,
      xpNext: 100000,
      flow: 'ongoing',
      completedIds: 'ALL',
      weeklyOverrides: {
        'wk-3days': { progress: 3, target: 3, done: true },
        'wk-newsport': { progress: 1, target: 1, done: true },
        'wk-share': { progress: 0, target: 1 },
      },
      blurb: 'Level 7 Oro. 4 de 5 semanales listas — el cofre está desbloqueado.',
      tagline: 'Cofre listo · 4 / 5',
    },
  ];

  return { LEVELS, TIER_COLORS, personas };
})();
