// Mission catalog — synced with the live Google Sheet as of 2026-04-22.
// Source: https://docs.google.com/spreadsheets/d/1Mhn5McTttDJoywbYYwelSLCWB71Ya28o63lsb5r0h88
// Deltas vs. the Apr 21 snapshot: A3 removed, D4 removed, B5 split into booster + free-bet,
// C1 now requires 2+ Gaming categories. All 12 onboarding rows active=TRUE.
window.MISSIONS_DATA = (function () {
  const ACCENTS = {
    A: { key: 'A', label: 'GRUPO A · RETIROS', tone: 'booster' },
    B: { key: 'B', label: 'GRUPO B · SPORTSBOOK', tone: 'primary' },
    C: { key: 'C', label: 'GRUPO C · CASINO', tone: 'free' },
    D: { key: 'D', label: 'GRUPO D · EXPERIENCIA', tone: 'success' },
  };

  // 12 onboarding missions, authored in display_order (matches the Sheet).
  const onboarding = [
    { id: 'onb-b1-first-bet', group: 'B', order: 10, title: 'Haz tu primera apuesta',
      desc: 'Haz tu primera apuesta con dinero real en cualquier deporte.',
      illustration: 'illustration_bets.png', xp: 25,
      cta: 'Ir al sportsbook', deeplink: '/osb/home',
      rules: ['Apuesta mínima $20 MXN', 'Momio mínimo 1.30 por selección', 'El ticket debe cerrarse para contar'],
      steps: [
        { title: 'Abrí el sportsbook', body: 'Desde el home, tocá la pestaña Bets.' },
        { title: 'Elegí un partido', body: 'Tocá cualquier evento deportivo en vivo o próximo.' },
        { title: 'Tocá un momio', body: 'Elegí una selección. Se agrega a tu cupón.' },
        { title: 'Confirmá tu apuesta', body: 'Ingresá el monto (≥ $20 MXN) y tocá Confirmar.' },
      ],
      vertical: 'osb' },

    { id: 'onb-b2-parlay', group: 'B', order: 20, title: 'Arma una parlay de 3+ selecciones',
      desc: 'Combina 3 o más selecciones en un mismo ticket.',
      illustration: 'illustration_coupon.png', xp: 50,
      cta: 'Armar parlay', deeplink: '/osb/home',
      rules: ['Mínimo 3 selecciones en el mismo ticket', 'Momio mínimo 1.30 por selección', 'Apuesta mínima $20 MXN'],
      steps: [
        { title: 'Abrí el sportsbook', body: 'Navegá a la pestaña Bets.' },
        { title: 'Sumá 3+ selecciones', body: 'Tocá momios de distintos partidos — cada uno se apila en el cupón.' },
        { title: 'Revisá el cupón', body: 'Verificá que cada pick tenga momio ≥ 1.30.' },
        { title: 'Confirmá la parlay', body: 'Ingresá tu monto y tocá Apostar.' },
      ],
      vertical: 'osb' },

    { id: 'onb-b3-live', group: 'B', order: 30, title: 'Haz una apuesta en vivo',
      desc: 'Apuesta en un partido en curso y mira cómo se mueve tu línea.',
      illustration: 'illustration_bolt.png', xp: 50,
      cta: 'Ver partidos en vivo', deeplink: '/osb/home',
      rules: ['El ticket en vivo debe cerrarse con multiplicador ≥ 1.5x', 'Cerrar Apuesta anticipado no cuenta', 'Apuesta mínima $20 MXN'],
      steps: [
        { title: 'Abrí la pestaña En vivo', body: 'Filtrá eventos con la etiqueta EN VIVO.' },
        { title: 'Tocá un momio dinámico', body: 'Los momios se actualizan en tiempo real.' },
        { title: 'Confirmá la apuesta', body: 'Ingresá tu monto. Hazlo rápido: los momios se mueven.' },
        { title: 'Esperá el final', body: 'El ticket cuenta si se cierra con multiplicador ≥ 1.5x.' },
      ],
      vertical: 'osb' },

    { id: 'onb-b4-cashout', group: 'B', order: 40, title: 'Usa Cerrar Apuesta',
      desc: 'Asegura tu ganancia antes de que termine el partido.',
      illustration: 'illustration_booster.png', xp: 50,
      cta: 'Ver mis tickets', deeplink: '/osb/my-tickets',
      rules: ['Multiplicador actual ≥ 1.5x', 'Ganancia proyectada positiva', 'Disponible solo en tickets activos'],
      steps: [
        { title: 'Abrí Mis tickets', body: 'Navegá al detalle de un ticket activo en vivo.' },
        { title: 'Revisá el multiplicador', body: 'Si está ≥ 1.5x con ganancia, verás el botón Cerrar Apuesta.' },
        { title: 'Cerrá el ticket', body: 'Tocá Cerrar Apuesta — la ganancia se acredita al instante.' },
      ],
      vertical: 'osb' },

    { id: 'onb-b5-booster', group: 'B', order: 45, title: 'Usa tu primer booster',
      desc: 'Haz tu primera apuesta con dinero real utilizando un booster.',
      illustration: 'illustration_booster_black.png', xp: 50,
      cta: 'Ver mis boosters', deeplink: '/osb/home',
      rules: ['Mínimo $20 MXN en dinero real', 'Momio mínimo 1.30 por selección', 'El booster se aplica al cerrarse el ticket'],
      steps: [
        { title: 'Abrí Beneficios', body: 'Encontrá tus boosters disponibles.' },
        { title: 'Elegí un booster', body: 'Tocá uno para prepararlo para tu próximo ticket.' },
        { title: 'Armá tu apuesta', body: 'El booster se aplicará al momio al confirmar.' },
        { title: 'Confirmá y ¡listo!', body: 'Apostá con tu booster activo.' },
      ],
      vertical: 'osb' },

    { id: 'onb-b5-free-bet', group: 'B', order: 46, title: 'Usa tu primer free bet',
      desc: 'Haz tu primera apuesta utilizando un free bet.',
      illustration: 'illustration_free_bet.png', xp: 50,
      cta: 'Ver mis free bets', deeplink: '/osb/home',
      rules: ['La free bet debe estar disponible en tu cartera', 'Momio mínimo 1.30 por selección'],
      steps: [
        { title: 'Abrí Beneficios', body: 'Revisá tus free bets activos.' },
        { title: 'Seleccioná una free bet', body: 'Tocá "Usar" en la free bet que querés aplicar.' },
        { title: 'Armá tu ticket', body: 'Elegí tus selecciones como de costumbre.' },
        { title: 'Confirmá con free bet', body: 'En el cupón, activá "Pagar con free bet" y confirmá.' },
      ],
      vertical: 'osb' },

    { id: 'onb-c1-casino', group: 'C', order: 50, title: 'Juega un juego de casino',
      desc: 'Prueba juegos en por lo menos 2 categorías en Gaming.',
      illustration: 'illustration_cards.png', xp: 75,
      cta: 'Ir al casino', deeplink: '/igaming/lobby',
      rules: ['Mínimo $20 MXN en dinero real', 'Debés jugar en al menos 2 categorías (slots, crash, mesas, etc.)'],
      steps: [
        { title: 'Abrí Gaming', body: 'Tocá la pestaña Gaming en la navegación.' },
        { title: 'Explorá las categorías', body: 'Slots, Crash, Mesas en vivo, Instant games — todas cuentan.' },
        { title: 'Jugá en 2+ categorías', body: 'Probá al menos 2 tipos de juegos en la misma sesión.' },
        { title: '¡Listo!', body: 'Los 75 XP se acreditan al cierre de la sesión.' },
      ],
      vertical: 'igaming' },

    { id: 'onb-a1-kyc', group: 'A', order: 60, title: 'Verifica tu identidad',
      desc: 'Completa tu verificación KYC para desbloquear retiros instantáneos.',
      illustration: 'illustration_personal_information.png', xp: 100,
      cta: 'Verificar identidad', deeplink: '/account/verify',
      rules: ['Una sola vez — toma ~2 minutos', 'Necesitás tu INE y una selfie en un lugar iluminado', 'Revisión en minutos en horario laboral'],
      steps: [
        { title: 'Abrí Mi perfil', body: 'Navegá a Validar identidad.' },
        { title: 'Subí tu INE', body: 'Foto clara del frente y reverso.' },
        { title: 'Tomá una selfie', body: 'En un lugar con buena luz, mirando de frente.' },
        { title: 'Esperá la revisión', body: 'En minutos recibirás la confirmación. Si hay observaciones te avisamos por push.' },
      ],
      vertical: 'account' },

    { id: 'onb-a2-clabe', group: 'A', order: 70, title: 'Agrega tu cuenta CLABE',
      desc: 'Guarda tu cuenta CLABE una vez — retira tus ganancias al instante cuando quieras.',
      illustration: 'illustration_bank.png', xp: 50,
      cta: 'Agregar CLABE', deeplink: '/account/payment-methods',
      rules: ['CLABE de 18 dígitos a tu nombre', 'Podés guardar hasta 3 cuentas', 'Retiros SPEI llegan en segundos'],
      steps: [
        { title: 'Abrí Métodos de retiro', body: 'En Mi perfil → Métodos de pago.' },
        { title: 'Tocá Agregar CLABE', body: 'Elegí tu banco (opcional) y escribí los 18 dígitos.' },
        { title: 'Confirmá', body: 'Verificamos que la cuenta esté a tu nombre.' },
        { title: '¡Retiros instantáneos listos!', body: 'Ya podés retirar en segundos cuando quieras.' },
      ],
      vertical: 'account' },

    { id: 'onb-d1-notifications', group: 'D', order: 80, title: 'Activa las notificaciones',
      desc: 'Recibe avisos cuando tengas un cofre listo o una misión esté por vencer.',
      illustration: 'illustration_notification_bell.png', xp: 15,
      cta: 'Activar notificaciones', deeplink: '/account/notifications',
      rules: ['Máximo 2 pushes por semana sobre misiones', 'Podés desactivarlo cuando quieras'],
      steps: [
        { title: 'Abrí Configuración', body: 'Mi perfil → Notificaciones.' },
        { title: 'Aceptá el permiso', body: 'iOS/Android te pedirá confirmar.' },
        { title: '¡Listo!', body: 'Te avisamos solo de misiones, cofres y partidos relevantes.' },
      ],
      vertical: 'account' },

    { id: 'onb-d2-help', group: 'D', order: 90, title: 'Aprende cómo pedir ayuda',
      desc: 'Tour de 60 segundos: cómo contactar soporte y resolver dudas frecuentes.',
      illustration: 'illustration_idea_information.png', xp: 10,
      cta: 'Ver mini-guía', deeplink: '/account/help',
      rules: ['Lectura de 30–60 segundos', 'Se marca completa al llegar al final del tour'],
      steps: [
        { title: 'Abrí el centro de ayuda', body: 'Mi perfil → Ayuda.' },
        { title: 'Revisá los temas frecuentes', body: 'Retiros, apuestas, bonos, casino.' },
        { title: 'Chat con soporte', body: 'Tocá "Hablar con un agente" si necesitás atención.' },
      ],
      vertical: 'account' },

    { id: 'onb-d3-rules', group: 'D', order: 100, title: 'Aprende dónde ver las reglas',
      desc: 'Tour rápido de las páginas de reglas para mercados deportivos y juegos de casino.',
      illustration: 'illustration_idea_information.png', xp: 10,
      cta: 'Ver mini-guía', deeplink: '/account/rules',
      rules: ['Lectura de 30–60 segundos', 'Incluye reglas de bonos, casino y sportsbook'],
      steps: [
        { title: 'Abrí Reglas', body: 'Mi perfil → Reglas del juego.' },
        { title: 'Revisá las secciones', body: 'Sportsbook, casino, bonos y responsable.' },
        { title: 'Guardá el link', body: 'Siempre están a un toque desde tu perfil.' },
      ],
      vertical: 'account' },
  ];

  // Weekly ongoing missions (Marketing-curated set — 5 per week, completing 4/5 unlocks chest).
  const ongoing = [
    { id: 'wk-3days', title: 'Apuesta 3 días diferentes esta semana',
      desc: 'Mantén el ritmo. Un ticket al día cuenta — mínimo $20 MXN.',
      illustration: 'illustration_calendar.png', progress: 2, target: 3,
      rules: ['Mínimo $20 MXN por día', 'Solo dinero real', 'Se reinicia el lunes'] },
    { id: 'wk-parlay4', title: 'Arma una parlay de 4+ selecciones',
      desc: 'Súmale una pierna más a tu combinada habitual.',
      illustration: 'illustration_coupon.png', progress: 1, target: 1, done: true,
      rules: ['Mínimo 4 selecciones', 'Momio mínimo 1.30 por selección'] },
    { id: 'wk-newsport', title: 'Apuesta a un deporte nuevo',
      desc: 'Uno que no hayas tocado en los últimos 30 días.',
      illustration: 'illustration_football_ball.png', progress: 0, target: 1,
      rules: ['Detectado por tu historial de últimos 30 días'] },
    { id: 'wk-casino', title: 'Juega cualquier juego de casino',
      desc: 'Un giro, una mano de blackjack — lo que prefieras.',
      illustration: 'illustration_cards.png', progress: 1, target: 1, done: true,
      rules: ['Mínimo $20 MXN en dinero real'] },
    { id: 'wk-share', title: 'Comparte un ticket con un amigo',
      desc: 'WhatsApp, link, screenshot — cualquier canal cuenta.',
      illustration: 'illustration_profile.png', progress: 0, target: 1,
      rules: ['Usá el botón Compartir de cualquier ticket'] },
  ];

  const CHEST_THRESHOLD = 4;

  return { onboarding, ongoing, ACCENTS, CHEST_THRESHOLD };
})();
