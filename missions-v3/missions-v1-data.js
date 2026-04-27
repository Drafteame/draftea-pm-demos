// Sample data for Missions V1 ad-hoc — anchored to PRD-MISSIONS-V1.md (Apr 27, 2026).
// Ad-hoc Premio missions for OSB + iGaming, paid as Promotional balance ("tu cuenta").
// MX-only — no need to render "MXN" in copy; users assume currency.
//
// Per Apr 28 review: no separate history page. Expired opt-in missions stay visible
// in the central view for 7 days post-expiry (shown via state: 'expired').
//
// `theme` keys: 'soccer' | 'slots' | 'casino' | 'mixed' — drives card gradient + pattern.
window.MISSIONS_V1_DATA = (function () {
  const SECONDS = (d, h, m = 0) => d * 86400 + h * 3600 + m * 60;

  const active = [
    {
      id: 'v1-liga-mx-weekend',
      vertical: 'osb',
      scope_dimension: 'league',
      scope_values: ['liga_mx'],
      title: '¡La Liga MX se prende este finde!',
      subtitle: 'Apostá $2,000 en partidos de Liga MX y llevate $200 de Premio al instante',
      description: 'Acumulá $2,000 en apuestas a partidos de Liga MX para llevarte $200 de Premio en tu cuenta.',
      reward_amount: 200,
      qualifying_target: 2000,
      progress: 0,
      min_odds: 1.50,
      ends_in_seconds: SECONDS(2, 4),
      eligibility: [
        'Solo apuestas a partidos de Liga MX',
        'Momio mínimo 1.50 por selección',
        'No cuentan apuestas con freebets, boosters o saldo promocional',
        'Tickets cancelados o cerrados anticipadamente no cuentan',
      ],
      key_exclusions: ['Freebets no cuentan', 'Mín. 1.50'],
      state: 'available',
      image: 'draftea-trophy.png',
      theme: 'soccer',
    },
    {
      id: 'v1-slots-week',
      vertical: 'igaming',
      scope_dimension: 'game_category',
      scope_values: ['slots'],
      title: 'Tus slots están en racha 🎰',
      subtitle: 'Acumulá $100 en cualquier slot y sumá $25 de Premio',
      description: 'Acumulá $100 de turnover en slots para llevarte $25 de Premio en tu cuenta.',
      reward_amount: 25,
      qualifying_target: 100,
      progress: 60,
      ends_in_seconds: SECONDS(1, 8),
      eligibility: [
        'Aplica solo a juegos de la categoría Slots',
        'Turnover mínimo $100 para acreditar el Premio',
        'Apuestas con saldo promocional o free spins no cuentan',
      ],
      key_exclusions: ['Free spins no cuentan'],
      state: 'in_progress',
      image: 'draftea-slots.png',
      theme: 'slots',
    },
    {
      id: 'v1-live-casino',
      vertical: 'igaming',
      scope_dimension: 'game_category',
      scope_values: ['live_casino'],
      title: 'La mesa te invita',
      subtitle: 'Jugá $200 en casino en vivo y te llevás $50 de Premio',
      description: 'Acumulá $200 de turnover en casino en vivo para llevarte $50 de Premio en tu cuenta.',
      reward_amount: 50,
      qualifying_target: 200,
      progress: 0,
      ends_in_seconds: SECONDS(3, 0),
      eligibility: [
        'Solo juegos categorizados como Casino en vivo',
        'Apuestas con saldo promocional no cuentan',
      ],
      key_exclusions: ['Saldo promo no cuenta'],
      state: 'available',
      image: 'icon-live-casino.svg',
      theme: 'casino',
    },
    {
      id: 'v1-bgaming-duo',
      vertical: 'igaming',
      scope_dimension: 'game',
      scope_values: ['bgmng:FootballPlinko', 'bgmng:PenaltyDuel'],
      title: 'Plinko + Penalty: el dúo letal ⚡',
      subtitle: '$80 entre Football Plinko y Penalty Duel = $20 de Premio',
      description: 'Premio de $20 al acumular $80 de turnover en Football Plinko o Penalty Duel.',
      reward_amount: 20,
      qualifying_target: 80,
      progress: 80,
      ends_in_seconds: SECONDS(0, 12),
      eligibility: [
        'Solo aplica a Football Plinko o Penalty Duel',
        'Apuestas con saldo promocional no cuentan',
      ],
      key_exclusions: ['Saldo promo no cuenta'],
      state: 'completed',
      image: 'icon-plinko.svg',
      theme: 'mixed',
    },
    {
      id: 'v1-real-barca-expired',
      vertical: 'osb',
      scope_dimension: 'match',
      scope_values: ['real_madrid_vs_barcelona'],
      title: 'El Clásico que querías ver',
      subtitle: 'Apostaste $100 al Real Madrid vs Barcelona — venció hace 2 días',
      description: 'Habías opt-in a esta misión. La ventana cerró antes de alcanzar el objetivo.',
      reward_amount: 30,
      qualifying_target: 100,
      progress: 40,
      ends_in_seconds: -2 * 86400,
      eligibility: [
        'Solo aplicaba al partido Real Madrid vs Barcelona',
        'No contaban apuestas con freebets ni saldo promocional',
      ],
      key_exclusions: [],
      state: 'expired',
      expired_label: 'Venció hace 2 días',
      image: 'draftea-soccer.png',
      theme: 'soccer',
    },
  ];

  return { active };
})();
