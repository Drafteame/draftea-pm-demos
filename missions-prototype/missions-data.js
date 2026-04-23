// Missions data — aligned with PRD
window.MISSIONS_DATA = (function () {
  const onboarding = {
    A: {
      id: 'A',
      title: 'Desbloquea Retiros Instantáneos',
      subtitle: 'Verifica tu identidad y agrega tu CLABE una vez — retira tus ganancias al instante, cuando quieras.',
      accent: 'booster',
      unlock: 'Retiros instantáneos',
      missions: [
        { id: 'A1', title: 'Verifica tu identidad', desc: 'Completa tu KYC en menos de 2 minutos. Necesitamos una foto de tu INE y una selfie.', xp: 100, icon: 'personal_information', illustration: 'illustration_personal_information.png', cta: 'Verificar identidad', rules: ['Foto clara de tu INE por ambos lados', 'Selfie en un lugar iluminado', 'La revisión tarda menos de 5 minutos en horario laboral'] },
        { id: 'A2', title: 'Agrega tu cuenta CLABE', desc: 'Liga tu cuenta bancaria en México para retirar al instante.', xp: 50, icon: 'bank', illustration: 'illustration_bank.png', cta: 'Agregar CLABE', rules: ['Solo cuentas bancarias en México', 'La CLABE debe estar a tu nombre', 'Puedes agregar hasta 3 cuentas'] },
      ],
    },
    B: {
      id: 'B',
      title: 'Domina la Apuesta',
      subtitle: 'Aprende el sportsbook: parlay, live y cashout. Construye confianza con tu primera ganancia.',
      accent: 'primary',
      unlock: 'Herramientas del sportsbook',
      missions: [
        { id: 'B1', title: 'Haz tu primera apuesta', desc: 'La forma más rápida de ganar XP. Mínimo $20 MXN — busca un mercado y ¡a la carga!', xp: 25, icon: 'bets', illustration: 'illustration_bets.png', cta: 'Ir al sportsbook', rules: ['Apuesta mínima: $20 MXN', 'Solo saldo real (no promos)', 'El ticket debe liquidarse'] },
        { id: 'B2', title: 'Arma un parlay de 3+ piernas', desc: 'Combina 3 o más selecciones en un solo ticket. Los parlays son el corazón de Draftea.', xp: 50, icon: 'parlay', illustration: 'illustration_coupon.png', cta: 'Armar parlay', rules: ['Mínimo 3 piernas', 'Momio mínimo por pierna: 1.30', 'Apuesta mínima: $20 MXN'] },
        { id: 'B3', title: 'Apuesta en vivo (in-play)', desc: 'Vive la acción minuto a minuto. Apuesta mientras el partido se juega.', xp: 50, icon: 'live', illustration: 'illustration_bolt.png', cta: 'Ver eventos en vivo', rules: ['Momio final ≥ 1.5x', 'El ticket debe liquidarse (sin cashout)', 'Apuesta mínima: $20 MXN'] },
        { id: 'B4', title: 'Usa Early Cashout', desc: 'Asegura tu ganancia antes del pitazo final. Tú decides cuándo cobrar.', xp: 50, icon: 'cashout', illustration: 'illustration_protected_play.png', cta: 'Ver tickets activos', rules: ['Multiplicador ≥ 1.5x', 'Ganancia > 0', 'Disponible en tickets activos'] },
      ],
    },
    C: {
      id: 'C',
      title: 'Prueba el Casino',
      subtitle: 'Hay mucho más que deportes. Descubre el lobby de iGaming.',
      accent: 'free',
      unlock: 'Casino desbloqueado',
      missions: [
        { id: 'C1', title: 'Juega en el casino', desc: 'Cualquier juego cuenta. Apuesta mínima $20 MXN en saldo real.', xp: 75, icon: 'cards', illustration: 'illustration_cards.png', cta: 'Ir al casino', rules: ['Apuesta mínima: $20 MXN', 'Saldo real (excluye demos)', 'Cualquier juego del lobby'] },
        ],
    },
    D: {
      id: 'D',
      title: 'Quédate Conectado',
      subtitle: 'Pequeños pasos que mejoran tu experiencia y desbloquean Misiones Semanales.',
      accent: 'success',
      unlock: 'Recordatorios y soporte',
      missions: [
        { id: 'D1', title: 'Activa las notificaciones', desc: 'Te avisamos cuando tengas un cofre listo o una misión por terminar. Nunca spam.', xp: 15, icon: 'bell', illustration: 'illustration_notification_bell.png', cta: 'Activar notificaciones', rules: ['Máximo 2 pushes por semana', 'Puedes desactivar cuando quieras'] },
        { id: 'D2', title: 'Aprende a pedir ayuda', desc: 'Una mini-guía de 1 minuto para encontrar soporte cuando lo necesites.', xp: 10, icon: 'help', illustration: 'illustration_idea_information.png', cta: 'Ver mini-guía', rules: ['Lectura de 30–60 segundos'] },
        { id: 'D3', title: 'Encuentra las reglas del juego', desc: 'Mini-guía sobre dónde consultar condiciones, reglas de bono y más.', xp: 10, icon: 'book', illustration: 'illustration_idea_information.png', cta: 'Ver mini-guía', rules: ['Lectura de 30–60 segundos'] },
      ],
    },
  };

  // Onboarding walkthrough order per PRD 4.3
  const recommendedOrder = ['B1','B2','B3','B4','C1','A1','A2','D1','D2','D3'];

  const ongoing = [
    { id: 'W1', title: 'Apuesta 3 días diferentes esta semana', desc: 'Mantén el ritmo. Un ticket al día cuenta.', progress: 2, target: 3, icon: 'calendar', illustration: 'illustration_ticket.png' },
    { id: 'W2', title: 'Arma un parlay de 4+ piernas', desc: 'Súmale una pierna más a tu combinada habitual.', progress: 1, target: 1, done: true, icon: 'parlay', illustration: 'illustration_coupon.png' },
    { id: 'W3', title: 'Apuesta a un deporte nuevo', desc: 'Uno que no hayas tocado en los últimos 30 días.', progress: 0, target: 1, icon: 'target', illustration: 'illustration_star.png' },
    { id: 'W4', title: 'Juega cualquier juego de casino', desc: 'Un giro, una mano de blackjack — lo que tú prefieras.', progress: 1, target: 1, done: true, icon: 'cards', illustration: 'illustration_cards.png' },
    { id: 'W5', title: 'Comparte un ticket con un amigo', desc: 'WhatsApp, link, screenshot — cualquier canal cuenta.', progress: 0, target: 1, icon: 'profile', illustration: 'illustration_profile.png' },
  ];

  return { onboarding, recommendedOrder, ongoing };
})();
