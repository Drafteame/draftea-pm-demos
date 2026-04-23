// Draftea Missions — Demo v2 (interactive, Spanish)
// Entry: Home with two experience buttons (Onboarding / Ongoing).
// Both routes land on the Loyalty/Rewards page with a fixed level header
// and a two-tab body: Misiones (default) / Recompensas.
//
// Aligned with PRD-MISSIONS.md (Apr 17, 2026):
//  - Onboarding = unlock-based groups (A Retiros / B Domina la Apuesta /
//    C Casino / D Quédate al día). XP per mission, no expiry.
//  - Ongoing    = weekly set, 0 XP, 4/5 -> Prize Chest.
//
// Interactivity:
//  - Tap the mission body → marks complete → +XP toast → level-bar
//    animates → group flips to DESBLOQUEADO when full.
//  - Tap the chevron (›) → opens the mission info layover with a
//    "Ver más" button that deep-links into the Onboardinho chatbot page.
//  - Tap ongoing mission → progress increments → chest flips to ready at
//    4/5 → tap chest → reward picker → claimed.
//  - Completing all onboarding missions → persistent success screen
//    with a "Salir" button (returns to demo home).
//
// Uses the BottomNav component from ./components/BottomNav.jsx.

const { useState, useMemo, useEffect } = React;

// ─── Design tokens ───────────────────────────────────────────────
const T = {
  bg: '#0A0712',
  surface: '#15101E',
  surface2: '#1E1630',
  border: 'rgba(255,255,255,0.08)',
  text: '#F4F3F7',
  muted: '#9A98A6',
  purple: '#6D3BFF',
  purpleSoft: 'rgba(109,59,255,0.16)',
  gold: '#F7C948',
  green: '#4AE291',
  red: '#FF6A5C',
  blue: '#58C7FF',
  chestGlow: 'linear-gradient(135deg, #F7C948 0%, #FFA94D 100%)',
};

// ─── Datos de misiones (español) ─────────────────────────────────
const ONBOARDING_GROUPS = [
  {
    id: 'A',
    name: 'Desbloquea Retiros Instantáneos',
    subtitle: 'Verifica tu identidad y agrega tu CLABE una vez — retira tus ganancias al instante, cuando quieras.',
    accent: T.gold,
    missions: [
      { id: 'A1', name: 'Verifica tu identidad (KYC)', xp: 100, icon: 'id',
        desc: 'Sube tu INE y una selfie para confirmar tu cuenta.',
        rules: ['La verificación toma ~2 minutos', 'Queda lista al instante en la mayoría de los casos'] },
      { id: 'A2', name: 'Agrega tu cuenta CLABE', xp: 50, icon: 'bank',
        desc: 'Registra tu CLABE de 18 dígitos para habilitar retiros instantáneos.',
        rules: ['Debe ser una cuenta a tu nombre', 'Los retiros con SPEI llegan en segundos una vez vinculada'] },
    ],
  },
  {
    id: 'B',
    name: 'Domina la Apuesta',
    subtitle: 'Aprende las partes del sportsbook que hacen diferente a Draftea.',
    accent: T.purple,
    missions: [
      { id: 'B1', name: 'Haz tu primera apuesta', xp: 25, icon: 'target',
        desc: 'Cualquier deporte, cualquier mercado. Apuesta mínima $20 MXN.',
        rules: ['Mínimo $20 MXN en dinero real', 'No cuenta si usas saldo promocional'] },
      { id: 'B2', name: 'Arma una parlay de 3+ picks', xp: 50, icon: 'link',
        desc: 'Combina 3 o más picks con momios ≥ 1.30x cada uno.',
        rules: ['Mínimo 3 selecciones', 'Cada pick con momio ≥ 1.30x'] },
      { id: 'B3', name: 'Apuesta en vivo', xp: 50, icon: 'bolt',
        desc: 'Apuesta mientras el partido está en juego. El ticket debe cerrarse (sin Cerrar Apuesta) con 1.5x o más.',
        rules: ['Momio final ≥ 1.5x', 'El ticket debe liquidarse, no cerrarse antes'] },
      { id: 'B4', name: 'Usa Cerrar Apuesta', xp: 50, icon: 'coin',
        desc: 'Asegura tu ganancia en un ticket en vivo con 1.5x o más.',
        rules: ['Multiplicador mínimo de 1.5x', 'Debes cerrar en ganancia'] },
    ],
  },
  {
    id: 'C',
    name: 'Prueba Casino',
    subtitle: 'Tu puerta de entrada al iGaming.',
    accent: T.green,
    missions: [
      { id: 'C1', name: 'Juega un juego de casino', xp: 75, icon: 'slots',
        desc: 'Apuesta al menos $20 MXN reales en cualquier juego de casino.',
        rules: ['Mínimo $20 MXN en dinero real', 'Slots, crash, mesas — todas cuentan'] },
    ],
  },
  {
    id: 'D',
    name: 'Quédate al día',
    subtitle: 'Victorias rápidas que te preparan para las misiones semanales.',
    accent: T.blue,
    missions: [
      { id: 'D1', name: 'Activa las notificaciones', xp: 15, icon: 'bell',
        desc: 'Activa el push para no perderte recordatorios de misiones.',
        rules: ['Se marca automáticamente al activarlas'] },
      { id: 'D2', name: 'Aprende cómo pedir ayuda', xp: 10, icon: 'help',
        desc: 'Tutorial de 60 segundos del flujo de ayuda del CX.',
        rules: ['Mini-onboarding de 2 pantallas'] },
      { id: 'D3', name: 'Aprende dónde están las reglas', xp: 10, icon: 'rules',
        desc: 'Las reglas siempre están a un toque — aquí te mostramos dónde.',
        rules: ['Mini-onboarding de 2 pantallas'] },
    ],
  },
];

const ONGOING_INITIAL = [
  { id: 'R1', name: 'Apuesta en 3 días distintos', icon: 'calendar', target: 3, progress: 2,
    desc: 'Coloca al menos una apuesta real en tres días diferentes esta semana.',
    rules: ['Mínimo $20 MXN por día', 'Solo dinero real'] },
  { id: 'R2', name: 'Arma una parlay de 4+ picks', icon: 'link', target: 1, progress: 1,
    desc: 'Combina 4 o más picks en un solo ticket.',
    rules: ['Mínimo 4 selecciones', 'Cada pick con momio ≥ 1.30x'] },
  { id: 'R3', name: 'Apuesta en un deporte que no juegas hace 30 días', icon: 'compass', target: 1, progress: 0,
    desc: 'Explora un deporte nuevo para ti este mes.',
    rules: ['Detectado por el historial de apuestas de los últimos 30 días'] },
  { id: 'R4', name: 'Juega cualquier juego de casino esta semana', icon: 'slots', target: 1, progress: 1,
    desc: 'Una sesión de casino con dinero real cuenta.',
    rules: ['Mínimo $20 MXN en dinero real'] },
  { id: 'R5', name: 'Comparte un ticket con un amigo', icon: 'share', target: 1, progress: 0,
    desc: 'Usa el botón "Compartir" en cualquier ticket.',
    rules: ['Cualquier canal de compartir cuenta (WhatsApp, copiar enlace, etc.)'] },
];

const CHEST_THRESHOLD = 4;
const BASE_XP = 240;
const XP_TO_NEXT_LEVEL = 1000;

// ─── Iconos de misiones ──────────────────────────────────────────
const MissionIcon = ({ name, tone = '#FFFFFF', size = 22 }) => {
  const s = 1.6;
  const p = { stroke: tone, strokeWidth: s, strokeLinecap: 'round', strokeLinejoin: 'round', fill: 'none' };
  const common = { width: size, height: size, viewBox: '0 0 24 24' };
  switch (name) {
    case 'id': return (<svg {...common}><rect x="3" y="5" width="18" height="14" rx="2.5" {...p}/><circle cx="9" cy="11" r="2" {...p}/><path d="M5.5 17c.8-1.8 2-2.7 3.5-2.7s2.7.9 3.5 2.7M14 9h5M14 12h4M14 15h3" {...p}/></svg>);
    case 'bank': return (<svg {...common}><path d="M3 10l9-5 9 5" {...p}/><path d="M5 10v8M9 10v8M15 10v8M19 10v8M3 20h18" {...p}/></svg>);
    case 'target': return (<svg {...common}><circle cx="12" cy="12" r="8" {...p}/><circle cx="12" cy="12" r="4" {...p}/><circle cx="12" cy="12" r="1.4" fill={tone}/></svg>);
    case 'link': return (<svg {...common}><path d="M9.5 14.5L14.5 9.5" {...p}/><path d="M11 6.5l1-1a3.5 3.5 0 115 5l-1 1M8 12.5l-1 1a3.5 3.5 0 105 5l1-1" {...p}/></svg>);
    case 'bolt': return (<svg {...common}><path d="M13 3L5 14h6l-1 7 8-11h-6l1-7z" {...p} fill={tone} fillOpacity="0.15"/></svg>);
    case 'coin': return (<svg {...common}><ellipse cx="12" cy="7.5" rx="7" ry="2.5" {...p}/><path d="M5 7.5v9c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-9" {...p}/><path d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" {...p}/></svg>);
    case 'slots': return (<svg {...common}><rect x="3.5" y="5.5" width="17" height="13" rx="2.5" {...p}/><path d="M8 10v4M12 10v4M16 10v4" {...p}/></svg>);
    case 'bell': return (<svg {...common}><path d="M6 16V11a6 6 0 1112 0v5l1.5 2h-15L6 16z" {...p}/><path d="M10 20.5a2 2 0 004 0" {...p}/></svg>);
    case 'help': return (<svg {...common}><circle cx="12" cy="12" r="8.5" {...p}/><path d="M9.5 9.5a2.5 2.5 0 015 0c0 1.5-2.5 1.8-2.5 3.5" {...p}/><circle cx="12" cy="16.5" r="0.9" fill={tone}/></svg>);
    case 'rules': return (<svg {...common}><path d="M5 4h10l4 4v12H5V4z" {...p}/><path d="M14 4v5h5M8 12h8M8 16h6" {...p}/></svg>);
    case 'calendar': return (<svg {...common}><rect x="3.5" y="5.5" width="17" height="14" rx="2" {...p}/><path d="M3.5 10h17M8 3.5v4M16 3.5v4" {...p}/></svg>);
    case 'compass': return (<svg {...common}><circle cx="12" cy="12" r="8.5" {...p}/><path d="M15.5 8.5L13 13l-4.5 2.5L11 11l4.5-2.5z" {...p} fill={tone} fillOpacity="0.15"/></svg>);
    case 'share': return (<svg {...common}><circle cx="18" cy="6" r="2.5" {...p}/><circle cx="6" cy="12" r="2.5" {...p}/><circle cx="18" cy="18" r="2.5" {...p}/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6" {...p}/></svg>);
    default: return null;
  }
};

// ─── Hex Level Badge ─────────────────────────────────────────────
const HexBadge = ({ size = 96 }) => (
  <div style={{ position: 'relative', width: size, height: size, filter: 'drop-shadow(0 12px 24px rgba(109,59,255,0.35))' }}>
    <svg width={size} height={size} viewBox="0 0 100 100">
      <defs>
        <linearGradient id="hexFill" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#D9D1E5"/>
          <stop offset="100%" stopColor="#7C6C9A"/>
        </linearGradient>
        <linearGradient id="hexStroke" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF"/>
          <stop offset="100%" stopColor="#7C6C9A"/>
        </linearGradient>
      </defs>
      <polygon points="50,5 88,27 88,73 50,95 12,73 12,27" fill="url(#hexFill)" stroke="url(#hexStroke)" strokeWidth="2"/>
      <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" fill="#1A1426"/>
      <text x="50" y="62" textAnchor="middle" fontSize="38" fontWeight="900" fill="#E8E3F2" fontFamily="system-ui">D</text>
    </svg>
  </div>
);

// ─── Header fijo de nivel ────────────────────────────────────────
const LevelHeader = ({ level = 1, xp, xpNext }) => {
  const pct = Math.min(100, (xp / xpNext) * 100);
  return (
    <div style={{ padding: '12px 20px 18px', background: T.bg, borderBottom: `1px solid ${T.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <button style={{ width: 32, height: 32, borderRadius: '50%', background: T.surface2, border: `1px solid ${T.border}`, color: T.text, cursor: 'pointer' }}>i</button>
        <span style={{ fontSize: 11, color: T.muted, letterSpacing: 1, textTransform: 'uppercase' }}>Tu nivel</span>
        <div style={{ width: 32 }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <HexBadge size={88} />
        <div style={{ fontSize: 22, fontWeight: 700, color: T.text, marginTop: 4 }}>Nivel {level}</div>
        <div style={{ fontSize: 12, color: T.muted }}>{Math.max(0, xpNext - xp).toLocaleString()} XP para subir de nivel</div>
        <div style={{ width: '100%', marginTop: 6 }}>
          <div style={{ height: 6, background: T.surface2, borderRadius: 999, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #6D3BFF, #A978FF)', borderRadius: 999, transition: 'width 450ms ease-out' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: T.muted }}>
            <span>{xp.toLocaleString()} XP</span>
            <span>{Math.max(0, xpNext - xp).toLocaleString()} restantes</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Tab switcher ────────────────────────────────────────────────
const TabSwitcher = ({ value, onChange }) => {
  const tabs = [{ id: 'missions', label: 'Misiones' }, { id: 'rewards', label: 'Recompensas' }];
  return (
    <div style={{ padding: '14px 20px 0', background: T.bg }}>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 999, padding: 4, display: 'flex' }}>
        {tabs.map((t) => {
          const active = value === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              style={{
                flex: 1, padding: '10px 16px', borderRadius: 999, border: 'none',
                background: active ? T.purple : 'transparent',
                color: active ? '#FFFFFF' : T.muted,
                fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 180ms ease',
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Fila de misión ──────────────────────────────────────────────
// Tap en el cuerpo => marca completa.
// Tap en el chevron (›) => abre layover con detalles.
const MissionRow = ({ mission, accent, mode = 'onboarding', completed = false, onToggle, onInfo }) => {
  const progress = mission.progress != null ? mission.progress : 0;
  const target = mission.target || 1;
  const pct = Math.min(100, (progress / target) * 100);
  const isComplete = completed || (mode === 'ongoing' && progress >= target);
  const clickable = !isComplete && !!onToggle;

  return (
    <div
      role="button"
      tabIndex={clickable ? 0 : -1}
      onClick={clickable ? onToggle : undefined}
      onKeyDown={(e) => {
        if (clickable && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onToggle(); }
      }}
      style={{
        width: '100%',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px',
        background: isComplete ? 'rgba(74,226,145,0.08)' : T.surface2,
        border: `1px solid ${isComplete ? 'rgba(74,226,145,0.25)' : T.border}`,
        borderRadius: 14,
        cursor: clickable ? 'pointer' : 'default',
        transition: 'transform 120ms ease, background 220ms ease, border-color 220ms ease',
      }}
      onMouseDown={(e) => { if (clickable) e.currentTarget.style.transform = 'scale(0.98)'; }}
      onMouseUp={(e) => { if (clickable) e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => { if (clickable) e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <div
        style={{
          width: 40, height: 40, borderRadius: 12, flexShrink: 0,
          background: isComplete ? 'rgba(74,226,145,0.15)' : `${accent}22`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {isComplete ? (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5L19 7.5" stroke={T.green} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <MissionIcon name={mission.icon} tone={accent} />
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 2, textDecoration: isComplete ? 'line-through' : 'none', opacity: isComplete ? 0.8 : 1 }}>
          {mission.name}
        </div>
        {mode === 'onboarding' && (
          <div style={{ fontSize: 11, color: T.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {isComplete ? 'Completada — ¡buen trabajo!' : mission.desc}
          </div>
        )}
        {mode === 'ongoing' && (
          <div style={{ marginTop: 6 }}>
            <div style={{ height: 4, background: T.bg, borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ width: `${pct}%`, height: '100%', background: isComplete ? T.green : accent, borderRadius: 999, transition: 'width 400ms ease-out, background 300ms ease' }} />
            </div>
            <div style={{ fontSize: 11, color: T.muted, marginTop: 4 }}>{progress}/{target}{isComplete ? ' · lista' : ''}</div>
          </div>
        )}
      </div>

      {mode === 'onboarding' && !isComplete && (
        <div style={{ padding: '4px 10px', background: `${accent}22`, borderRadius: 999, fontSize: 11, fontWeight: 700, color: accent, whiteSpace: 'nowrap' }}>
          +{mission.xp} XP
        </div>
      )}

      {/* Chevron — abre info layover */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onInfo && onInfo(); }}
        aria-label="Ver detalles de la misión"
        style={{
          width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
          background: 'transparent', border: `1px solid ${T.border}`,
          color: T.muted, fontSize: 18, lineHeight: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}
      >
        ›
      </button>
    </div>
  );
};

// ─── Quest group ─────────────────────────────────────────────────
const QuestGroup = ({ group, completedIds, onMissionToggle, onMissionInfo }) => {
  const groupTotal = group.missions.length;
  const groupDone = group.missions.filter((m) => completedIds.includes(m.id)).length;
  const unlocked = groupDone === groupTotal;

  return (
    <div
      style={{
        background: T.surface,
        border: `1px solid ${unlocked ? 'rgba(74,226,145,0.35)' : T.border}`,
        borderRadius: 18, padding: 14, marginBottom: 14,
        boxShadow: unlocked ? '0 0 0 3px rgba(74,226,145,0.08)' : 'none',
        transition: 'border-color 300ms ease, box-shadow 300ms ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div
          style={{
            width: 28, height: 28, borderRadius: 8,
            background: `${group.accent}22`, color: group.accent,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 13,
          }}
        >
          {group.id}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, display: 'flex', alignItems: 'center', gap: 6 }}>
            {group.name}
            {unlocked && (
              <span style={{ fontSize: 10, padding: '2px 6px', borderRadius: 6, background: 'rgba(74,226,145,0.18)', color: T.green, fontWeight: 700 }}>DESBLOQUEADO</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{group.subtitle}</div>
        </div>
        <div style={{ fontSize: 12, color: T.muted, fontWeight: 600 }}>{groupDone}/{groupTotal}</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {group.missions.map((m) => (
          <MissionRow
            key={m.id}
            mission={m}
            accent={group.accent}
            mode="onboarding"
            completed={completedIds.includes(m.id)}
            onToggle={() => onMissionToggle(m)}
            onInfo={() => onMissionInfo(m, group.accent, 'onboarding')}
          />
        ))}
      </div>
    </div>
  );
};

// ─── Cofre (clickable cuando está listo) ─────────────────────────
const PrizeChest = ({ completed, threshold, claimed, onOpen }) => {
  const ready = completed >= threshold && !claimed;
  return (
    <button
      type="button"
      onClick={ready ? onOpen : undefined}
      disabled={!ready}
      style={{
        width: '100%', marginTop: 18, padding: 18, borderRadius: 18,
        background: claimed ? 'rgba(74,226,145,0.10)' : (ready ? T.chestGlow : T.surface),
        border: `1px solid ${claimed ? 'rgba(74,226,145,0.35)' : (ready ? 'rgba(247,201,72,0.6)' : T.border)}`,
        display: 'flex', alignItems: 'center', gap: 14, cursor: ready ? 'pointer' : 'default',
        textAlign: 'left',
        transition: 'transform 120ms ease, background 300ms ease, border-color 300ms ease',
        animation: ready ? 'chestPulse 1.6s ease-in-out infinite' : 'none',
      }}
      onMouseDown={(e) => { if (ready) e.currentTarget.style.transform = 'scale(0.98)'; }}
      onMouseUp={(e) => { if (ready) e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => { if (ready) e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <div
        style={{
          width: 56, height: 56, borderRadius: 14, flexShrink: 0,
          background: claimed ? 'rgba(74,226,145,0.18)' : (ready ? 'rgba(0,0,0,0.18)' : T.surface2),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="9" width="18" height="11" rx="2" stroke={claimed ? T.green : (ready ? '#1A1426' : T.gold)} strokeWidth="1.8"/>
          <path d="M3 14h18" stroke={claimed ? T.green : (ready ? '#1A1426' : T.gold)} strokeWidth="1.8"/>
          <path d="M6 9V7a6 6 0 0112 0v2" stroke={claimed ? T.green : (ready ? '#1A1426' : T.gold)} strokeWidth="1.8"/>
          <circle cx="12" cy="14" r="1.4" fill={claimed ? T.green : (ready ? '#1A1426' : T.gold)}/>
        </svg>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: ready ? '#1A1426' : T.text }}>
          {claimed ? 'Premio reclamado' : (ready ? '¡Cofre listo!' : 'Cofre del Tesoro')}
        </div>
        <div style={{ fontSize: 12, color: ready ? 'rgba(26,20,38,0.75)' : T.muted, marginTop: 3 }}>
          {claimed
            ? 'Tu premio está en Beneficios. Vuelve el lunes por un nuevo set.'
            : ready
              ? 'Toca para elegir tu recompensa — free bet o free spins.'
              : `Completa ${threshold - completed} misión${threshold - completed === 1 ? '' : 'es'} más para desbloquear.`}
        </div>
      </div>
      {ready && (
        <div
          style={{
            padding: '10px 14px', borderRadius: 999, background: '#1A1426',
            color: '#FFFFFF', fontSize: 13, fontWeight: 700,
          }}
        >
          Abrir →
        </div>
      )}
    </button>
  );
};

// ─── Layover de detalles de misión ───────────────────────────────
const MissionDetailModal = ({ open, mission, accent, mode, completed, onClose, onComplete, onViewMore }) => {
  if (!open || !mission) return null;
  const canComplete = !completed && onComplete;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(5,3,10,0.72)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 60,
        backdropFilter: 'blur(4px)', animation: 'fadeIn 180ms ease-out',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 420, background: T.surface,
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          padding: '20px 20px 28px', border: `1px solid ${T.border}`,
          animation: 'slideUp 260ms ease-out',
        }}
      >
        <div style={{ width: 40, height: 4, background: T.surface2, borderRadius: 999, margin: '0 auto 16px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 14, background: `${accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <MissionIcon name={mission.icon} tone={accent} size={26} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: T.text }}>{mission.name}</div>
            {mode === 'onboarding' && (
              <div style={{ fontSize: 12, marginTop: 3, color: accent, fontWeight: 700 }}>+{mission.xp} XP al completar</div>
            )}
            {mode === 'ongoing' && (
              <div style={{ fontSize: 12, marginTop: 3, color: T.muted }}>
                Progreso: {mission.progress ?? 0}/{mission.target ?? 1} · sin XP
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            style={{
              width: 32, height: 32, borderRadius: '50%',
              background: T.surface2, border: `1px solid ${T.border}`, color: T.text,
              cursor: 'pointer', fontSize: 16, lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ fontSize: 13, color: T.text, lineHeight: 1.5, marginBottom: 12 }}>
          {mission.desc}
        </div>

        {mission.rules && mission.rules.length > 0 && (
          <div style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 12, padding: 12, marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: T.muted, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 700, marginBottom: 6 }}>
              Reglas
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {mission.rules.map((r, i) => (
                <li key={i} style={{ fontSize: 12.5, color: T.text, display: 'flex', gap: 8 }}>
                  <span style={{ color: accent, fontWeight: 700 }}>•</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={() => { onViewMore && onViewMore(mission); }}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 14,
              background: accent, color: '#0A0712', border: 'none',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            Ver más
            <span style={{ fontSize: 16 }}>→</span>
          </button>

          {canComplete && (
            <button
              onClick={() => { onComplete(); onClose(); }}
              style={{
                width: '100%', padding: '12px 16px', borderRadius: 14,
                background: 'transparent', color: T.text,
                border: `1px solid ${T.border}`,
                fontSize: 14, fontWeight: 600, cursor: 'pointer',
              }}
            >
              Marcar como {mode === 'onboarding' ? 'completada' : 'avanzada'}
            </button>
          )}

          {completed && (
            <div style={{
              padding: '12px 16px', borderRadius: 14,
              background: 'rgba(74,226,145,0.10)', color: T.green,
              border: `1px solid rgba(74,226,145,0.25)`,
              fontSize: 13, fontWeight: 600, textAlign: 'center',
            }}>
              ✓ Misión completada
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Página de Onboardinho (chatbot) ─────────────────────────────
const OnboardinhoPage = ({ mission, accent, onBack }) => {
  const initialBubbles = [
    { from: 'bot', text: '¡Hola! Soy Onboardinho 🤖' },
    { from: 'bot', text: mission ? `Vamos a ver cómo funciona: "${mission.name}".` : 'Vamos a explorar esta funcionalidad.' },
    { from: 'bot', text: 'Aquí tendríamos información detallada sobre esta funcionalidad — paso a paso, con imágenes y tips.' },
    { from: 'bot', text: '¿En qué más te puedo ayudar?' },
  ];

  const [bubbles, setBubbles] = useState(initialBubbles);
  const [typing, setTyping] = useState(false);

  const quickReplies = [
    '¿Cómo la uso?',
    '¿Dónde la encuentro?',
    '¿Cuáles son las reglas?',
  ];

  const handleQuickReply = (text) => {
    setBubbles((prev) => [...prev, { from: 'user', text }]);
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setBubbles((prev) => [
        ...prev,
        { from: 'bot', text: 'Aquí iría la respuesta detallada con pasos, screenshots y ejemplos (placeholder).' },
      ]);
    }, 900);
  };

  return (
    <div style={{ width: '100%', maxWidth: 420, margin: '0 auto', minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ padding: '44px 16px 12px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: `1px solid ${T.border}`, background: T.bg, position: 'sticky', top: 0, zIndex: 10 }}>
        <button
          onClick={onBack}
          aria-label="Volver"
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: T.surface, border: `1px solid ${T.border}`,
            color: T.text, cursor: 'pointer', fontSize: 18, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          ←
        </button>
        <div
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6D3BFF, #A978FF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: 20,
          }}
        >
          🤖
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: T.text }}>Onboardinho</div>
          <div style={{ fontSize: 11, color: T.green, display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: T.green, display: 'inline-block' }} />
            En línea
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div style={{ flex: 1, padding: '18px 16px 0', display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
        {bubbles.map((b, i) => (
          <div
            key={i}
            style={{
              alignSelf: b.from === 'bot' ? 'flex-start' : 'flex-end',
              maxWidth: '82%',
              padding: '10px 14px',
              borderRadius: b.from === 'bot' ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
              background: b.from === 'bot' ? T.surface : T.purple,
              color: b.from === 'bot' ? T.text : '#FFFFFF',
              border: b.from === 'bot' ? `1px solid ${T.border}` : 'none',
              fontSize: 13.5, lineHeight: 1.45,
              animation: 'bubbleIn 240ms ease-out',
            }}
          >
            {b.text}
          </div>
        ))}
        {typing && (
          <div style={{
            alignSelf: 'flex-start', padding: '10px 14px',
            borderRadius: '18px 18px 18px 4px',
            background: T.surface, border: `1px solid ${T.border}`,
            fontSize: 13.5, color: T.muted,
          }}>
            <span style={{ display: 'inline-flex', gap: 4 }}>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </span>
          </div>
        )}
      </div>

      {/* Quick replies */}
      <div style={{ padding: '12px 16px 8px', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {quickReplies.map((q) => (
          <button
            key={q}
            onClick={() => handleQuickReply(q)}
            style={{
              padding: '8px 14px', borderRadius: 999,
              background: T.surface, border: `1px solid ${T.border}`,
              color: T.text, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Fake input bar */}
      <div style={{ padding: '8px 16px 20px', borderTop: `1px solid ${T.border}`, background: T.bg }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 14px', borderRadius: 999,
            background: T.surface, border: `1px solid ${T.border}`,
          }}
        >
          <span style={{ flex: 1, color: T.muted, fontSize: 13 }}>Escribe tu pregunta…</span>
          <div
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: T.purple, color: '#FFF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16,
            }}
          >
            ↑
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Ruleta del Cofre (basada en probabilidades) ─────────────────
// Pesos definidos: 20% Nada · 30% +50 XP · 30% Booster +20% ·
// 0% Free Bet $50 · 20% 10 Giros gratis.
// El premio "Free Bet $50" aparece en la rueda pero nunca sale (0%).
const ROULETTE_PRIZES = [
  { id: 'nothing',   label: 'Nada',              short: 'Nada',       icon: '✖',  color: '#3A3450', weight: 20 },
  { id: 'xp50',      label: '+50 XP',            short: '+50 XP',     icon: '⚡', color: '#6D3BFF', weight: 30, xp: 50 },
  { id: 'booster20', label: 'Booster +20%',      short: '+20%',       icon: '🚀', color: '#58C7FF', weight: 30, booster: 20 },
  { id: 'freebet50', label: 'Free Bet $50 MXN',  short: '$50',        icon: '💵', color: '#F7C948', weight: 0,  freebet: 50 },
  { id: 'spins10',   label: '10 Giros gratis',   short: '10 Spins',   icon: '🎰', color: '#4AE291', weight: 20, spins: 10 },
];

const TOTAL_WEIGHT = ROULETTE_PRIZES.reduce((s, p) => s + p.weight, 0);

const pickWeighted = () => {
  let r = Math.random() * TOTAL_WEIGHT;
  for (const p of ROULETTE_PRIZES) {
    r -= p.weight;
    if (r <= 0) return p;
  }
  return ROULETTE_PRIZES[ROULETTE_PRIZES.length - 1];
};

const RouletteWheel = ({ rotation, size = 260 }) => {
  const n = ROULETTE_PRIZES.length;
  const slice = 360 / n;
  const r = size / 2;
  const cx = r;
  const cy = r;

  const polar = (angleDeg, radius) => {
    const a = (angleDeg - 90) * (Math.PI / 180);
    return [cx + radius * Math.cos(a), cy + radius * Math.sin(a)];
  };

  return (
    <div
      style={{
        width: size, height: size, position: 'relative',
        transform: `rotate(${rotation}deg)`,
        transition: 'transform 3.8s cubic-bezier(0.22, 1, 0.36, 1)',
        filter: 'drop-shadow(0 14px 30px rgba(0,0,0,0.55))',
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <radialGradient id="wheelGloss" cx="0.5" cy="0.3" r="0.7">
            <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>
        {ROULETTE_PRIZES.map((p, i) => {
          const start = i * slice;
          const end = (i + 1) * slice;
          const [x1, y1] = polar(start, r);
          const [x2, y2] = polar(end, r);
          const large = slice > 180 ? 1 : 0;
          const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
          const labelAngle = start + slice / 2;
          const [lx, ly] = polar(labelAngle, r * 0.62);
          return (
            <g key={p.id}>
              <path d={d} fill={p.color} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
              <g transform={`translate(${lx} ${ly}) rotate(${labelAngle})`}>
                <text y="-4" textAnchor="middle" fontSize="20" fill="#FFFFFF">{p.icon}</text>
                <text y="14" textAnchor="middle" fontSize="11" fontWeight="700" fill="#FFFFFF" fontFamily="system-ui">
                  {p.short}
                </text>
              </g>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={r} fill="url(#wheelGloss)" pointerEvents="none" />
        <circle cx={cx} cy={cy} r={r - 1} fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" />
        <circle cx={cx} cy={cy} r={22} fill="#15101E" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
        <text x={cx} y={cy + 5} textAnchor="middle" fontSize="14" fontWeight="900" fill="#F4F3F7" fontFamily="system-ui">D</text>
      </svg>
    </div>
  );
};

const RouletteModal = ({ open, onClose, onClaim }) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (open) {
      // Reset al abrir (solo si no hubo giro aún)
      setRotation(0);
      setSpinning(false);
      setResult(null);
    }
  }, [open]);

  if (!open) return null;

  const startSpin = () => {
    if (spinning || result) return;
    const prize = pickWeighted();
    const idx = ROULETTE_PRIZES.findIndex((p) => p.id === prize.id);
    const n = ROULETTE_PRIZES.length;
    const slice = 360 / n;
    const sliceCenter = idx * slice + slice / 2;
    // Jitter pequeño dentro del gajo para que se sienta realista
    const jitter = (Math.random() - 0.5) * (slice * 0.6);
    // Múltiples vueltas + alineación del gajo bajo el indicador (arriba = 0°)
    const finalRotation = 360 * 6 + (360 - sliceCenter) + jitter;
    setSpinning(true);
    setRotation(finalRotation);
    setTimeout(() => {
      setSpinning(false);
      setResult(prize);
    }, 3900);
  };

  const pct = (p) => `${Math.round((p.weight / TOTAL_WEIGHT) * 100)}%`;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(5,3,10,0.8)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 60,
        backdropFilter: 'blur(4px)', animation: 'fadeIn 180ms ease-out',
      }}
      onClick={spinning ? undefined : onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 420, background: T.surface,
          borderTopLeftRadius: 24, borderTopRightRadius: 24,
          padding: '20px 20px 28px', border: `1px solid ${T.border}`,
          animation: 'slideUp 260ms ease-out',
          maxHeight: '92vh', overflowY: 'auto',
        }}
      >
        <div style={{ width: 40, height: 4, background: T.surface2, borderRadius: 999, margin: '0 auto 14px' }} />
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: T.text }}>🎁 ¡Cofre del Tesoro!</div>
          <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>
            {result ? 'Este es tu premio de la semana' : 'Gira la ruleta para ver qué te llevas'}
          </div>
        </div>

        {/* Rueda */}
        <div style={{ position: 'relative', width: 260, height: 288, margin: '0 auto 14px' }}>
          {/* Indicador (triangle top) */}
          <div
            style={{
              position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '14px solid transparent',
              borderRight: '14px solid transparent',
              borderTop: `22px solid ${T.gold}`,
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.6))',
              zIndex: 3,
            }}
          />
          <div style={{ position: 'absolute', top: 22, left: 0, right: 0 }}>
            <RouletteWheel rotation={rotation} size={260} />
          </div>
        </div>

        {/* Estado/resultado */}
        {result ? (
          <div
            style={{
              padding: 14, borderRadius: 16, marginBottom: 14,
              background: result.id === 'nothing'
                ? T.surface2
                : `linear-gradient(135deg, ${result.color}33, ${result.color}11)`,
              border: `1px solid ${result.id === 'nothing' ? T.border : result.color + '55'}`,
              display: 'flex', alignItems: 'center', gap: 12,
              animation: 'popIn 420ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            }}
          >
            <div
              style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: result.id === 'nothing' ? T.bg : result.color + '33',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 26,
              }}
            >
              {result.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: T.muted, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 700 }}>
                {result.id === 'nothing' ? 'Sin suerte esta vez' : 'Ganaste'}
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: T.text, marginTop: 2 }}>{result.label}</div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>
                {result.id === 'nothing' && 'Vuelve la próxima semana por otra oportunidad.'}
                {result.id === 'xp50'      && 'Los 50 XP se suman a tu nivel al reclamar.'}
                {result.id === 'booster20' && 'Boost de +20% en tu próxima parlay. Sin rollover.'}
                {result.id === 'freebet50' && 'Free bet disponible en Beneficios por 7 días.'}
                {result.id === 'spins10'   && 'Spins para Spaceman y slots destacados.'}
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={startSpin}
            disabled={spinning}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 14,
              background: spinning ? T.surface2 : T.gold, color: '#0A0712', border: 'none',
              fontSize: 16, fontWeight: 800, cursor: spinning ? 'default' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              marginBottom: 14,
            }}
          >
            {spinning ? 'Girando…' : 'Girar la ruleta 🎲'}
          </button>
        )}

        {result && (
          <button
            onClick={() => onClaim(result)}
            style={{
              width: '100%', padding: '14px 16px', borderRadius: 14,
              background: T.purple, color: '#FFFFFF', border: 'none',
              fontSize: 15, fontWeight: 700, cursor: 'pointer',
              marginBottom: 14,
            }}
          >
            {result.id === 'nothing' ? 'Cerrar' : 'Reclamar'}
          </button>
        )}

        {/* Tabla de probabilidades (transparencia Sin Letra Chica) */}
        <div style={{ background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 12, padding: 12 }}>
          <div style={{ fontSize: 11, color: T.muted, letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: 700, marginBottom: 8 }}>
            Tabla de premios
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {ROULETTE_PRIZES.map((p) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
                <span style={{ width: 10, height: 10, borderRadius: 3, background: p.color, display: 'inline-block', flexShrink: 0 }} />
                <span style={{ flex: 1, color: T.text }}>{p.label}</span>
                <span style={{ color: T.muted, fontWeight: 600 }}>{pct(p)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Toast ───────────────────────────────────────────────────────
const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <div
      style={{
        position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
        background: T.surface, color: T.text,
        border: `1px solid ${T.border}`, padding: '10px 16px', borderRadius: 999,
        fontSize: 13, fontWeight: 600, zIndex: 80,
        boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', gap: 8,
        animation: 'toastIn 220ms ease-out',
        maxWidth: 380,
      }}
    >
      <span style={{ fontSize: 16 }}>{toast.icon || '✨'}</span>
      <span>{toast.text}</span>
    </div>
  );
};

// ─── Pantalla de graduación (persistente con botón Salir) ────────
const GraduationScreen = ({ visible, onExit }) => {
  if (!visible) return null;
  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(5,3,10,0.92)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 90,
        padding: 20, backdropFilter: 'blur(8px)',
        animation: 'fadeIn 260ms ease-out',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: 340, width: '100%' }}>
        <div style={{ fontSize: 72, marginBottom: 16, animation: 'popIn 500ms cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>🎓</div>
        <div style={{ fontSize: 26, fontWeight: 800, color: T.text, lineHeight: 1.2 }}>¡Dominaste lo básico!</div>
        <div style={{ fontSize: 14, color: T.muted, marginTop: 10, lineHeight: 1.5 }}>
          Se desbloquean las misiones semanales — compite por el Cofre cada semana.
        </div>

        <div style={{
          marginTop: 20, padding: 14, borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(109,59,255,0.2), rgba(109,59,255,0.06))',
          border: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 42, height: 42, borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <span style={{ fontSize: 20 }}>⭐</span>
          </div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Graduado · Onboarding completo</div>
            <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>+{ONBOARDING_GROUPS.reduce((s, g) => s + g.missions.reduce((x, m) => x + m.xp, 0), 0)} XP ganados</div>
          </div>
        </div>

        <button
          onClick={onExit}
          style={{
            marginTop: 28, width: '100%',
            padding: '14px 20px', borderRadius: 14,
            background: T.purple, color: '#FFFFFF', border: 'none',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}
        >
          Salir
        </button>
      </div>
    </div>
  );
};

// ─── Tab Recompensas ─────────────────────────────────────────────
const RewardsTab = ({ claimedReward }) => {
  const base = [
    { name: 'Promociones generales', sub: 'En parlays de 3+ selecciones', expires: '22d : 23h : 23m', locked: false },
    { name: 'Juega Spaceman', sub: '3 free spins de cortesía', expires: '22d : 23h : 23m', locked: false },
    { name: '1% de Cashback', sub: 'Llega a Nivel Pro para desbloquear', expires: '', locked: true },
  ];
  const prizeSub = (p) => {
    switch (p?.id) {
      case 'booster20': return 'Boost +20% en tu próxima parlay · Sin rollover';
      case 'freebet50': return 'Úsala en cualquier parlay · Sin rollover';
      case 'spins10':   return 'Spaceman + slots destacados';
      default:          return p?.label || '';
    }
  };
  const benefits = claimedReward
    ? [{
        name: claimedReward.label,
        sub: `${prizeSub(claimedReward)} · Recién reclamado`,
        expires: '7d : 0h : 0m',
        locked: false,
        fresh: true,
        emoji: claimedReward.icon,
        color: claimedReward.color,
      }, ...base]
    : base;
  return (
    <div style={{ padding: '14px 20px 0' }}>
      <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 18, padding: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.text }}>Beneficios que desbloqueas al subir de nivel</div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 2, marginBottom: 12 }}>Los beneficios se renuevan mensualmente.</div>
        {benefits.map((b, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 0',
              borderTop: i === 0 ? 'none' : `1px solid ${T.border}`,
              opacity: b.locked ? 0.55 : 1,
            }}
          >
            <div
              style={{
                width: 40, height: 40, borderRadius: 12,
                background: b.fresh && b.color ? `${b.color}33` : (b.fresh ? `${T.gold}22` : T.surface2),
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                fontSize: b.emoji ? 20 : undefined,
              }}
            >
              {b.emoji ? (
                <span>{b.emoji}</span>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <polygon points="12,3 20,7.5 20,16.5 12,21 4,16.5 4,7.5" stroke={b.fresh ? T.gold : T.muted} strokeWidth="1.6"/>
                </svg>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text, display: 'flex', alignItems: 'center', gap: 6 }}>
                {b.name}
                {b.fresh && <span style={{ fontSize: 9, padding: '2px 6px', borderRadius: 6, background: `${T.gold}33`, color: T.gold, fontWeight: 700 }}>NUEVO</span>}
              </div>
              <div style={{ fontSize: 12, color: T.muted, marginTop: 2 }}>{b.sub}</div>
              {b.expires && (
                <div style={{ fontSize: 11, color: T.muted, marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ opacity: 0.7 }}>⏱</span>
                  <span>Vence en {b.expires}</span>
                </div>
              )}
            </div>
            {b.locked ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="9" rx="2" stroke={T.muted} strokeWidth="1.6"/>
                <path d="M8 11V8a4 4 0 018 0v3" stroke={T.muted} strokeWidth="1.6"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke={T.text} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Vista Onboarding ────────────────────────────────────────────
const OnboardingMissions = ({ completedIds, onMissionToggle, onMissionInfo }) => {
  const totalMissions = ONBOARDING_GROUPS.reduce((s, g) => s + g.missions.length, 0);
  const totalXP = ONBOARDING_GROUPS.reduce((s, g) => s + g.missions.reduce((x, m) => x + m.xp, 0), 0);
  const earnedXP = ONBOARDING_GROUPS
    .flatMap((g) => g.missions)
    .filter((m) => completedIds.includes(m.id))
    .reduce((s, m) => s + m.xp, 0);

  return (
    <div style={{ padding: '16px 20px 0' }}>
      <div style={{ marginBottom: 14, padding: 14, borderRadius: 16, background: 'linear-gradient(135deg, rgba(109,59,255,0.18), rgba(109,59,255,0.04))', border: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 12, color: T.muted, letterSpacing: 0.5, textTransform: 'uppercase' }}>Tus primeros pasos</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginTop: 4 }}>
          Completa todas las misiones para graduarte
        </div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>
          {completedIds.length}/{totalMissions} misiones · {earnedXP}/{totalXP} XP ganados
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, marginTop: 10, overflow: 'hidden' }}>
          <div style={{ width: `${(completedIds.length / totalMissions) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #6D3BFF, #A978FF)', borderRadius: 999, transition: 'width 450ms ease-out' }} />
        </div>
      </div>

      {ONBOARDING_GROUPS.map((g) => (
        <QuestGroup
          key={g.id}
          group={g}
          completedIds={completedIds}
          onMissionToggle={onMissionToggle}
          onMissionInfo={onMissionInfo}
        />
      ))}
    </div>
  );
};

// ─── Vista Ongoing ───────────────────────────────────────────────
const OngoingMissions = ({ ongoing, onMissionToggle, onMissionInfo, chestClaimed, onChestOpen }) => {
  const completedCount = ongoing.filter((m) => m.progress >= m.target).length;
  return (
    <div style={{ padding: '16px 20px 0' }}>
      <div style={{ marginBottom: 14, padding: 14, borderRadius: 16, background: 'linear-gradient(135deg, rgba(247,201,72,0.18), rgba(247,201,72,0.04))', border: `1px solid ${T.border}` }}>
        <div style={{ fontSize: 12, color: T.muted, letterSpacing: 0.5, textTransform: 'uppercase' }}>Esta semana</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: T.text, marginTop: 4 }}>
          Completa {CHEST_THRESHOLD} de 5 para abrir tu Cofre del Tesoro
        </div>
        <div style={{ fontSize: 12, color: T.muted, marginTop: 4 }}>
          Reinicia el lunes · las misiones en curso no otorgan XP
        </div>
        <div style={{ height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 999, marginTop: 10, overflow: 'hidden' }}>
          <div style={{ width: `${(completedCount / 5) * 100}%`, height: '100%', background: 'linear-gradient(90deg, #F7C948, #FFA94D)', borderRadius: 999, transition: 'width 450ms ease-out' }} />
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {ongoing.map((m) => (
          <MissionRow
            key={m.id}
            mission={m}
            accent={T.gold}
            mode="ongoing"
            onToggle={() => onMissionToggle(m.id)}
            onInfo={() => onMissionInfo(m, T.gold, 'ongoing')}
          />
        ))}
      </div>

      <PrizeChest completed={completedCount} threshold={CHEST_THRESHOLD} claimed={chestClaimed} onOpen={onChestOpen} />
    </div>
  );
};

// ─── Página Loyalty/Rewards ──────────────────────────────────────
const LoyaltyPage = ({ mode, onBack }) => {
  const [tab, setTab] = useState('missions');
  const [navActive, setNavActive] = useState('rewards');

  // Onboarding
  const [completedIds, setCompletedIds] = useState([]);
  const [graduationShown, setGraduationShown] = useState(false);
  const [showGraduation, setShowGraduation] = useState(false);

  // Ongoing
  const [ongoing, setOngoing] = useState(ONGOING_INITIAL.map((m) => ({ ...m })));
  const [chestOpen, setChestOpen] = useState(false);
  const [chestClaimed, setChestClaimed] = useState(false);
  const [claimedReward, setClaimedReward] = useState(null);
  const [bonusXP, setBonusXP] = useState(0);

  // Compartido
  const [toast, setToast] = useState(null);

  // Layover de detalle
  const [detail, setDetail] = useState(null); // { mission, accent, mode }

  // Página Onboardinho
  const [onboardinho, setOnboardinho] = useState(null); // { mission, accent }

  const earnedXP = useMemo(() => {
    return ONBOARDING_GROUPS
      .flatMap((g) => g.missions)
      .filter((m) => completedIds.includes(m.id))
      .reduce((s, m) => s + m.xp, 0);
  }, [completedIds]);

  const currentXP = BASE_XP + earnedXP + bonusXP;

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1800);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const total = ONBOARDING_GROUPS.reduce((s, g) => s + g.missions.length, 0);
    if (mode === 'onboarding' && !graduationShown && completedIds.length === total && total > 0) {
      // Pequeño retraso para que se vea la última marca verde
      const t = setTimeout(() => {
        setShowGraduation(true);
        setGraduationShown(true);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [completedIds, mode, graduationShown]);

  const completeOnboardingMission = (mission) => {
    if (completedIds.includes(mission.id)) return;
    setCompletedIds((prev) => [...prev, mission.id]);
    setToast({ icon: '✨', text: `${mission.name} · +${mission.xp} XP` });

    const group = ONBOARDING_GROUPS.find((g) => g.missions.some((m) => m.id === mission.id));
    if (group) {
      const groupMissionIds = group.missions.map((m) => m.id);
      const othersComplete = groupMissionIds
        .filter((id) => id !== mission.id)
        .every((id) => completedIds.includes(id));
      if (othersComplete && groupMissionIds.length > 1) {
        setTimeout(() => setToast({ icon: '🔓', text: `${group.name} · ¡desbloqueado!` }), 900);
      }
    }
  };

  const advanceOngoingMission = (missionId) => {
    setOngoing((prev) => {
      const next = prev.map((m) => {
        if (m.id !== missionId) return m;
        if (m.progress >= m.target) return m;
        const progress = Math.min(m.target, m.progress + 1);
        return { ...m, progress };
      });
      const before = prev.find((m) => m.id === missionId);
      const after = next.find((m) => m.id === missionId);
      if (after.progress > (before?.progress ?? 0)) {
        if (after.progress >= after.target) {
          setToast({ icon: '✅', text: `${after.name} · lista` });
        } else {
          setToast({ icon: '✨', text: `${after.name} · ${after.progress}/${after.target}` });
        }
      }
      return next;
    });
  };

  const handleChestClaim = (prize) => {
    setChestClaimed(true);
    setChestOpen(false);

    if (prize.id === 'nothing') {
      setToast({ icon: '🕊️', text: 'Sin suerte esta vez · vuelve el próximo lunes' });
      return;
    }
    if (prize.id === 'xp50') {
      setBonusXP((x) => x + 50);
      setToast({ icon: '⚡', text: '+50 XP acreditados' });
      return;
    }
    // Premio tangible → va a Beneficios
    setClaimedReward(prize);
    setToast({ icon: '🎁', text: `Premio reclamado: ${prize.label}` });
  };

  // Si Onboardinho está abierto, renderiza solo esa página
  if (onboardinho) {
    return (
      <OnboardinhoPage
        mission={onboardinho.mission}
        accent={onboardinho.accent}
        onBack={() => setOnboardinho(null)}
      />
    );
  }

  return (
    <div style={{ width: '100%', maxWidth: 420, margin: '0 auto', minHeight: '100vh', background: T.bg, position: 'relative' }}>
      {/* Top pegajoso */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: T.bg }}>
        <div style={{ height: 34, display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between', fontSize: 12, color: T.text }}>
          <span style={{ fontWeight: 600 }}>9:41</span>
          <button onClick={onBack} style={{ background: 'transparent', border: 'none', color: T.muted, cursor: 'pointer', fontSize: 12 }}>
            ← salir del demo
          </button>
        </div>
        <LevelHeader level={1} xp={currentXP} xpNext={XP_TO_NEXT_LEVEL} />
        <TabSwitcher value={tab} onChange={setTab} />
      </div>

      {/* Cuerpo */}
      <div style={{ paddingBottom: 140 }}>
        {tab === 'missions' && mode === 'onboarding' && (
          <OnboardingMissions
            completedIds={completedIds}
            onMissionToggle={completeOnboardingMission}
            onMissionInfo={(m, accent) => setDetail({ mission: m, accent, mode: 'onboarding' })}
          />
        )}
        {tab === 'missions' && mode === 'ongoing' && (
          <OngoingMissions
            ongoing={ongoing}
            onMissionToggle={advanceOngoingMission}
            onMissionInfo={(m, accent) => setDetail({ mission: m, accent, mode: 'ongoing' })}
            chestClaimed={chestClaimed}
            onChestOpen={() => setChestOpen(true)}
          />
        )}
        {tab === 'rewards' && <RewardsTab claimedReward={claimedReward} />}
      </div>

      <BottomNav active={navActive} onChange={setNavActive} />

      <MissionDetailModal
        open={!!detail}
        mission={detail?.mission}
        accent={detail?.accent}
        mode={detail?.mode}
        completed={detail ? (
          detail.mode === 'onboarding'
            ? completedIds.includes(detail.mission.id)
            : (detail.mission.progress ?? 0) >= (detail.mission.target ?? 1)
        ) : false}
        onClose={() => setDetail(null)}
        onComplete={() => {
          if (!detail) return;
          if (detail.mode === 'onboarding') completeOnboardingMission(detail.mission);
          else advanceOngoingMission(detail.mission.id);
        }}
        onViewMore={(mission) => {
          setOnboardinho({ mission, accent: detail?.accent });
          setDetail(null);
        }}
      />

      <RouletteModal open={chestOpen} onClaim={handleChestClaim} onClose={() => setChestOpen(false)} />

      <GraduationScreen visible={showGraduation} onExit={onBack} />

      <Toast toast={toast} />
    </div>
  );
};

// ─── Home (entry) ────────────────────────────────────────────────
const Home = ({ onPick }) => {
  const Card = ({ flow, title, subtitle, accent, iconName }) => (
    <button
      onClick={() => onPick(flow)}
      style={{
        width: '100%', background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 20, padding: 20,
        display: 'flex', gap: 16, alignItems: 'center',
        cursor: 'pointer', textAlign: 'left',
        transition: 'transform 120ms ease',
      }}
      onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
      onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
    >
      <div style={{ width: 56, height: 56, borderRadius: 16, background: `${accent}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <MissionIcon name={iconName} tone={accent} size={28} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: T.text }}>{title}</div>
        <div style={{ fontSize: 13, color: T.muted, marginTop: 4 }}>{subtitle}</div>
      </div>
      <div style={{ fontSize: 22, color: T.muted }}>›</div>
    </button>
  );

  return (
    <div style={{ width: '100%', maxWidth: 420, margin: '0 auto', minHeight: '100vh', background: T.bg, padding: '60px 20px 40px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 12, letterSpacing: 1.5, color: T.purple, textTransform: 'uppercase', fontWeight: 700 }}>Draftea · Demo</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: T.text, marginTop: 8, lineHeight: 1.2 }}>Vista previa de Misiones V1</div>
        <div style={{ fontSize: 14, color: T.muted, marginTop: 8 }}>Elige una experiencia para abrir la página de Lealtad / Recompensas.</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <Card
          flow="onboarding"
          title="Onboarding"
          subtitle="Usuarios nuevos: ruta tipo quest board con misiones basadas en desbloqueos. Ganas XP en cada paso."
          accent={T.purple}
          iconName="target"
        />
        <Card
          flow="ongoing"
          title="En curso"
          subtitle="Usuarios graduados: set semanal sin XP — completar 4/5 desbloquea el Cofre del Tesoro."
          accent={T.gold}
          iconName="coin"
        />
      </div>

      <div style={{ marginTop: 'auto', paddingTop: 32, fontSize: 11, color: T.muted, textAlign: 'center' }}>
        Alineado con PRD-MISSIONS.md (17 abr 2026)
      </div>
    </div>
  );
};

// ─── App root ────────────────────────────────────────────────────
const App = () => {
  const [flow, setFlow] = useState(null);
  if (!flow) return <Home onPick={setFlow} />;
  return <LoyaltyPage mode={flow} onBack={() => setFlow(null)} />;
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
