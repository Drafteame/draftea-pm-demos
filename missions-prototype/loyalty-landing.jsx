// Loyalty landing — hexagonal level badge (PNG) + horizontal level track + Misiones/Recompensas
const { useState: uSt, useEffect: uEf, useRef: uRef } = React;
const { theme: LT, spacing: LS, radius: LR, type: LTY, gradients: LG, a: lA } = window.DF;

// ── Level definitions ─────────────────────────────────────────
const LEVELS = [
  { n: 1,  name: 'Nivel 1',  badge: 'assets/level-badge-silver.png',  variant: 'silver',  xpCap: 1000   },
  { n: 2,  name: 'Nivel 2',  badge: 'assets/level-badge-silver.png',  variant: 'silver',  xpCap: 2500   },
  { n: 3,  name: 'Nivel 3',  badge: 'assets/level-badge-silver.png',  variant: 'silver',  xpCap: 5000   },
  { n: 4,  name: 'Nivel 4',  badge: 'assets/level-badge-emerald.png', variant: 'emerald', xpCap: 10000  },
  { n: 5,  name: 'Nivel 5',  badge: 'assets/level-badge-emerald.png', variant: 'emerald', xpCap: 25000  },
  { n: 6,  name: 'Nivel 6',  badge: 'assets/level-badge-gold.png',    variant: 'gold',    xpCap: 50000  },
  { n: 7,  name: 'Nivel 7',  badge: 'assets/level-badge-gold.png',    variant: 'gold',    xpCap: 100000 },
  { n: 8,  name: 'Nivel 8',  badge: 'assets/level-badge-gold.png',    variant: 'gold',    xpCap: 250000 },
  { n: 9,  name: 'Nivel 9',  badge: 'assets/level-badge-gold.png',    variant: 'gold',    xpCap: 500000 },
  { n: 10, name: 'Nivel 10', badge: 'assets/level-badge-gold.png',    variant: 'gold',    xpCap: 1000000},
];

// ── Level Badge (PNG-backed) ──────────────────────────────────
const LevelBadge = ({ level = 1, size = 120, locked = false, glow = true }) => {
  const def = LEVELS.find(l => l.n === level) || LEVELS[0];
  const glowColor = def.variant === 'gold' ? '#FFB020'
                 : def.variant === 'emerald' ? '#34D399'
                 : '#C9C9C9';
  return (
    <div style={{
      position: 'relative', width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      filter: locked ? 'grayscale(1) brightness(0.45)' : 'none',
      transition: 'all 0.3s',
    }}>
      {glow && !locked && (
        <div style={{
          position: 'absolute', inset: -size * 0.2,
          background: `radial-gradient(circle, ${lA(glowColor, 0.35)}, transparent 62%)`,
          pointerEvents: 'none',
        }}/>
      )}
      <img src={def.badge} alt={`Nivel ${level}`} style={{
        width: '100%', height: '100%', objectFit: 'contain',
        position: 'relative', zIndex: 1,
      }}/>
      {locked && (
        <div style={{
          position: 'absolute', bottom: '8%', right: '8%', zIndex: 2,
          width: size * 0.3, height: size * 0.3, borderRadius: '50%',
          background: lA('#0A0A0A', 0.9), border: `2px solid ${lA('#FBFBFB', 0.3)}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <DFIcon name="lock" size={size * 0.16} color={LT.fillSecondary}/>
        </div>
      )}
    </div>
  );
};

// ── Horizontal Level Track ────────────────────────────────────
const LevelTrack = ({ currentLevel = 1, xp = 0, xpForNext = 1000 }) => {
  const scrollerRef = uRef(null);
  const [scrolled, setScrolled] = uSt(false);

  // Auto-center current level on mount
  uEf(() => {
    if (scrollerRef.current && !scrolled) {
      const el = scrollerRef.current;
      // each slide is 100% width; current level is currentLevel - 1 slot
      const slide = el.clientWidth;
      el.scrollLeft = (currentLevel - 1) * slide;
      setScrolled(true);
    }
  }, [currentLevel, scrolled]);

  return (
    <div style={{ position: 'relative' }}>
      <div
        ref={scrollerRef}
        style={{
          display: 'flex', overflowX: 'auto', scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
          paddingBottom: 4,
        }}
        onWheel={() => {}}
      >
        <style>{`
          .lvl-scroller::-webkit-scrollbar { display: none; }
        `}</style>
        {LEVELS.map((lvl) => {
          const isCurrent = lvl.n === currentLevel;
          const isPast = lvl.n < currentLevel;
          const isLocked = lvl.n > currentLevel;
          const displayXp = isCurrent ? xp : isPast ? lvl.xpCap : 0;
          const displayCap = lvl.xpCap;
          const remaining = Math.max(0, displayCap - displayXp);
          const pct = isCurrent ? Math.min(100, (xp / xpForNext) * 100) : isPast ? 100 : 0;

          return (
            <div key={lvl.n} style={{
              flex: '0 0 100%', scrollSnapAlign: 'center',
              padding: `${LS.x4}px ${LS.x8}px`, textAlign: 'center',
            }}>
              <div style={{ ...LTY.xSmallBlack, color: LT.fillTertiary, letterSpacing: 1, marginBottom: LS.x4 }}>
                {isCurrent ? 'TU NIVEL' : isPast ? 'COMPLETADO' : 'SIGUIENTE'}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: LS.x4,
                transform: isCurrent ? 'scale(1)' : 'scale(0.86)',
                transition: 'transform 0.3s',
              }}>
                <LevelBadge level={lvl.n} size={120} locked={isLocked}/>
              </div>

              <div style={{ ...LTY.headlineBase, color: isLocked ? LT.fillTertiary : LT.fillPrimary, marginBottom: 4 }}>
                {lvl.name}
              </div>
              <div style={{ ...LTY.smallMedium, color: LT.fillSecondary, marginBottom: LS.x6 }}>
                {isCurrent   && `${remaining.toLocaleString('es-MX')} XP para subir de nivel`}
                {isPast      && `¡Nivel completado!`}
                {isLocked    && `${displayCap.toLocaleString('es-MX')} XP para desbloquear`}
              </div>

              {/* progress bar */}
              <div style={{ padding: `0 ${LS.x2}px` }}>
                <div style={{
                  height: 6, borderRadius: 999, background: lA('#FBFBFB', 0.1), overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${pct}%`, height: '100%',
                    background: isLocked ? lA('#FBFBFB', 0.2) : LG.actionPrimary,
                    borderRadius: 999,
                    boxShadow: isCurrent ? `0 0 8px ${lA(LT.actionPrimaryDefaultGradStart, 0.6)}` : 'none',
                    transition: 'width 0.6s',
                  }}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                  <span style={{ ...LTY.xSmallBold, color: isLocked ? LT.fillTertiary : LT.fillPrimary }}>
                    {displayXp.toLocaleString('es-MX')} XP
                  </span>
                  <span style={{ ...LTY.xSmallBold, color: LT.fillTertiary }}>
                    {isPast ? '✓' : `${remaining.toLocaleString('es-MX')} restantes`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination dots — hidden per design feedback */}
      {false && (
      <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 4 }}>
        {LEVELS.slice(0, Math.min(6, LEVELS.length)).map(lvl => {
          const isCurrent = lvl.n === currentLevel;
          const isPast = lvl.n < currentLevel;
          return (
            <div key={lvl.n} style={{
              width: isCurrent ? 18 : 5, height: 5, borderRadius: 999,
              background: isCurrent ? LT.fillPrimary : isPast ? lA(LT.fillPrimary, 0.5) : lA(LT.fillPrimary, 0.2),
              transition: 'width 0.3s',
            }}/>
          );
        })}
        {LEVELS.length > 6 && <div style={{ ...LTY.xxSmallBold, color: LT.fillTertiary, marginLeft: 4 }}>+{LEVELS.length - 6}</div>}
      </div>
      )}
    </div>
  );
};

// ── Level hero (top of loyalty page — wraps the track) ────────
const LevelHero = ({ level, xp, xpForNext, onInfo }) => (
  <div style={{ position: 'relative', paddingTop: LS.x4 }}>
    {/* info icon top-left, above track */}
    <button onClick={onInfo} style={{
      position: 'absolute', top: LS.x4, left: LS.x8, zIndex: 2,
      width: 36, height: 36, borderRadius: 999,
      background: lA('#FBFBFB', 0.08), border: 'none', color: LT.fillPrimary,
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <DFIcon name="info" size={18}/>
    </button>

    <LevelTrack currentLevel={level} xp={xp} xpForNext={xpForNext}/>
  </div>
);

// ── Segmented control ────────────────────────────────────────
const SegmentedTabs = ({ tabs, active, onChange }) => (
  <div style={{
    display: 'flex', gap: 4, padding: 4, borderRadius: 999,
    background: lA('#FBFBFB', 0.06), border: `1px solid ${lA('#FBFBFB', 0.06)}`,
    margin: `0 ${LS.x8}px`,
  }}>
    {tabs.map(t => {
      const isActive = t.id === active;
      return (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          flex: 1, height: 40, borderRadius: 999, border: 'none', cursor: 'pointer',
          background: isActive ? LG.actionPrimary : 'transparent',
          color: isActive ? LT.fillPrimary : LT.fillSecondary,
          ...LTY.baseBold,
          boxShadow: isActive ? `0 6px 16px ${lA(LT.actionPrimaryDefaultGradStart, 0.4)}` : 'none',
          transition: 'all 0.2s',
        }}>
          {t.label}
        </button>
      );
    })}
  </div>
);

// ── Recompensas panel ─────────────────────────────────────────
const RewardsPanel = ({ level }) => {
  const rewards = [
    { id: 'vip',     title: 'Experiencia VIP',       desc: 'Premios especiales',           illu: 'illustration_star.png',      expires: null },
    { id: 'booster', title: 'Booster Ganancia +20%', desc: 'En parlays de 3+ selecciones', illu: 'illustration_booster.png',   expires: '22 d : 23 h : 23 m' },
    { id: 'spins',   title: 'Giros gratis en Casino',desc: 'Te damos 3 free spins',        illu: 'illustration_cards.png',     expires: '22 d : 23 h : 23 m' },
    { id: 'freebet', title: 'Apuestas gratis',       desc: '3 entradas gratis de $400',    illu: 'illustration_free_bet.png',  expires: '22 d : 23 h : 23 m' },
    { id: 'gift',    title: 'Cofre sorpresa',         desc: 'Recompensa aleatoria semanal', illu: 'illustration_gift_yellow.png', expires: '22 d : 23 h : 23 m' },
  ];
  return (
    <div style={{ padding: `${LS.x6}px ${LS.x8}px ${LS.x16}px` }}>
      <div style={{ ...LTY.baseBold, color: LT.fillPrimary, marginBottom: 4 }}>
        Beneficios que desbloqueas al subir de nivel
      </div>
      <div style={{ ...LTY.smallMedium, color: LT.fillTertiary, marginBottom: LS.x6 }}>
        Los beneficios se renuevan mensualmente
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rewards.map(r => (
          <div key={r.id} style={{
            display: 'flex', alignItems: 'center', gap: LS.x4,
            padding: LS.x4, borderRadius: LR.large,
            background: lA('#FBFBFB', 0.04),
            border: `1px solid ${lA('#FBFBFB', 0.06)}`,
            cursor: 'pointer',
          }}>
            <div style={{
              width: 56, height: 56, flexShrink: 0, position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <LevelBadge level={6} size={56} glow={false}/>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <img src={`assets/${r.illu}`} alt="" style={{ width: 26, height: 26, objectFit: 'contain', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}/>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...LTY.baseBold, color: LT.fillPrimary, marginBottom: 2 }}>{r.title}</div>
              <div style={{ ...LTY.smallMedium, color: LT.fillTertiary, marginBottom: r.expires ? 4 : 0 }}>{r.desc}</div>
              {r.expires && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '3px 8px', borderRadius: 999,
                  background: lA('#FBFBFB', 0.06),
                  ...LTY.xSmallBold, color: LT.fillSecondary }}>
                  Vence
                  <DFIcon name="info" size={10} color={LT.fillTertiary} style={{ opacity: 0.5 }}/>
                  <span>{r.expires}</span>
                </div>
              )}
            </div>
            <DFIcon name="chevronRight" size={16} color={LT.fillTertiary}/>
          </div>
        ))}
      </div>
    </div>
  );
};

Object.assign(window, { LevelBadge, SegmentedTabs, LevelHero, LevelTrack, RewardsPanel, LEVELS });
