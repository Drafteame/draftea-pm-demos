// Shared UI primitives for Missions v3.
// Tier-aware level badge, level header with horizontal track, mission row, progress pills.
const { useState, useEffect, useMemo, useRef } = React;
const { theme: T, spacing: S, radius: R, type: TY, gradients: G, a: alpha, font: FONT } = window.DF;
const { LEVELS, TIER_COLORS, personas: PERSONAS_LIST } = window.PERSONAS;
const MD = window.MISSIONS_DATA;
const ILLU = (name) => `assets/${name}`;

const GROUP_ACCENTS = {
  A: { grad: G.booster,        solid: T.boosterGradEnd,            glow: T.boosterGradStart,           label: 'GRUPO A · RETIROS'    },
  B: { grad: G.actionPrimary,  solid: T.actionPrimaryDefaultGradEnd, glow: T.actionPrimaryDefaultGradStart, label: 'GRUPO B · SPORTSBOOK' },
  C: { grad: G.freeBet,        solid: T.freeBetGradStart,          glow: T.freeBetGradEnd,             label: 'GRUPO C · CASINO'     },
  D: { grad: `linear-gradient(135deg, ${T.fillSuccess}, ${T.levelContent})`, solid: T.fillSuccess, glow: T.levelContent, label: 'GRUPO D · EXPERIENCIA' },
};

// ── Tier-aware level badge ────────────────────────────────────
const LevelBadge = ({ level = 1, size = 120, glow = true, locked = false }) => {
  const def = LEVELS.find(l => l.n === level) || LEVELS[0];
  const tier = TIER_COLORS[def.tier];
  return (
    <div style={{
      position: 'relative', width: size, height: size,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      filter: locked ? 'grayscale(1) brightness(0.45)' : 'none',
    }}>
      {glow && !locked && (
        <div style={{
          position: 'absolute', inset: -size * 0.22,
          background: `radial-gradient(circle, ${alpha(tier.glow, 0.35)}, transparent 62%)`,
          pointerEvents: 'none',
        }}/>
      )}
      <img src={def.badge} alt={`Nivel ${level}`} style={{
        width: '100%', height: '100%', objectFit: 'contain',
        position: 'relative', zIndex: 1,
        transition: 'all 0.3s',
      }}/>
    </div>
  );
};

// ── Compact tier chip ─────────────────────────────────────────
const TierChip = ({ level }) => {
  const def = LEVELS.find(l => l.n === level) || LEVELS[0];
  const tier = TIER_COLORS[def.tier];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 999,
      background: tier.chip, border: `1px solid ${alpha(tier.accent, 0.32)}`,
      ...TY.xSmallBlack, color: tier.accent, letterSpacing: 0.4,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: tier.accent, boxShadow: `0 0 8px ${tier.accent}` }}/>
      {tier.label}
    </span>
  );
};

// ── Horizontal level track (scroll through levels) ────────────
const LevelTrack = ({ level, xp, xpNext }) => {
  const scrollerRef = useRef(null);
  const slidesRef = useRef({});

  useEffect(() => {
    const apply = () => {
      const scroller = scrollerRef.current;
      const current = slidesRef.current[level];
      if (!scroller || !current) return;
      // offsetLeft of the slide inside the scroller is its start position.
      const target = current.offsetLeft - (scroller.clientWidth - current.clientWidth) / 2;
      scroller.scrollTo({ left: target, behavior: 'auto' });
    };
    // Run twice: first immediately (in case we're already laid out),
    // then after one frame + 60ms to catch late sticky-container sizing.
    apply();
    const raf1 = requestAnimationFrame(apply);
    const t1 = setTimeout(apply, 80);
    return () => { cancelAnimationFrame(raf1); clearTimeout(t1); };
  }, [level]);

  return (
    <div
      ref={scrollerRef}
      className="levelTrack"
      style={{
        display: 'flex', overflowX: 'auto',
        scrollSnapType: 'x mandatory',
        scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch',
        paddingBottom: 4,
      }}>
      <style>{`.levelTrack::-webkit-scrollbar { display: none; }`}</style>
      {LEVELS.map((lvl) => {
        const isCurrent = lvl.n === level;
        const isPast = lvl.n < level;
        const isLocked = lvl.n > level;
        const displayXp = isCurrent ? xp : isPast ? lvl.xpCap : 0;
        const remaining = Math.max(0, lvl.xpCap - displayXp);
        const pct = isCurrent ? Math.min(100, (xp / xpNext) * 100) : isPast ? 100 : 0;
        const tier = TIER_COLORS[lvl.tier];
        return (
          <div key={lvl.n}
            ref={(el) => { slidesRef.current[lvl.n] = el; }}
            style={{
              flex: '0 0 100%', scrollSnapAlign: 'center',
              padding: `${S.x2}px ${S.x8}px`, textAlign: 'center',
            }}>
            <div style={{ ...TY.xxSmallBold, color: T.fillTertiary, letterSpacing: 1, marginBottom: 2 }}>
              {isCurrent ? 'TU NIVEL' : isPast ? 'COMPLETADO' : 'SIGUIENTE'}
            </div>
            <div style={{
              display: 'flex', justifyContent: 'center',
              transform: isCurrent ? 'scale(1)' : 'scale(0.82)',
              transition: 'transform 0.3s',
            }}>
              <LevelBadge level={lvl.n} size={86} locked={isLocked}/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, alignItems: 'baseline', marginTop: 4 }}>
              <div style={{ ...TY.xLargeBold, color: isLocked ? T.fillTertiary : T.fillPrimary }}>
                Nivel {lvl.n}
              </div>
              <TierChip level={lvl.n}/>
            </div>
            <div style={{ ...TY.xSmallMedium, color: T.fillSecondary, marginTop: 4, marginBottom: 6 }}>
              {isCurrent && `${remaining.toLocaleString('es-MX')} XP para subir`}
              {isPast && `¡Nivel completado!`}
              {isLocked && `${lvl.xpCap.toLocaleString('es-MX')} XP para desbloquear`}
            </div>
            <div style={{ padding: `0 ${S.x2}px` }}>
              <div style={{ height: 5, borderRadius: 999, background: alpha('#FBFBFB', 0.1), overflow: 'hidden' }}>
                <div style={{
                  width: `${pct}%`, height: '100%',
                  background: isLocked ? alpha('#FBFBFB', 0.2) :
                    `linear-gradient(90deg, ${tier.accent}, ${alpha(tier.accent, 0.6)})`,
                  borderRadius: 999,
                  boxShadow: isCurrent ? `0 0 10px ${alpha(tier.glow, 0.55)}` : 'none',
                  transition: 'width 0.6s',
                }}/>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                <span style={{ ...TY.xSmallBold, color: isLocked ? T.fillTertiary : T.fillPrimary }}>
                  {displayXp.toLocaleString('es-MX')} XP
                </span>
                <span style={{ ...TY.xSmallBold, color: T.fillTertiary }}>
                  {isPast ? '✓' : `${remaining.toLocaleString('es-MX')} restantes`}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ── Segmented tab control ─────────────────────────────────────
const SegmentedTabs = ({ tabs, active, onChange }) => (
  <div style={{
    display: 'flex', gap: 4, padding: 4, borderRadius: 999,
    background: alpha('#FBFBFB', 0.06), border: `1px solid ${alpha('#FBFBFB', 0.06)}`,
    margin: `0 ${S.x8}px`,
  }}>
    {tabs.map(tab => {
      const isActive = tab.id === active;
      return (
        <button key={tab.id} onClick={() => onChange(tab.id)} style={{
          flex: 1, height: 40, borderRadius: 999, border: 'none', cursor: 'pointer',
          background: isActive ? G.actionPrimary : 'transparent',
          color: isActive ? T.fillPrimary : T.fillSecondary,
          ...TY.baseBold,
          boxShadow: isActive ? `0 6px 16px ${alpha(T.actionPrimaryDefaultGradStart, 0.4)}` : 'none',
          transition: 'all 0.2s',
        }}>
          {tab.label}
        </button>
      );
    })}
  </div>
);

// ── Progress bar ──────────────────────────────────────────────
const ProgressBar = ({ value, max, height = 6, fill = G.actionPrimary }) => {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div style={{ height, borderRadius: 999, background: alpha('#FBFBFB', 0.1), overflow: 'hidden' }}>
      <div style={{
        width: `${pct}%`, height: '100%',
        background: typeof fill === 'string' ? fill : fill,
        borderRadius: 999, transition: 'width 0.45s',
      }}/>
    </div>
  );
};

// ── Mission row (clickable body + chevron for detail) ─────────
const MissionRow = ({ mission, group, completed, onToggle, onOpen, mode = 'onboarding' }) => {
  const accent = GROUP_ACCENTS[group] || GROUP_ACCENTS.B;
  const progress = mission.progress != null ? mission.progress : (completed ? 1 : 0);
  const target = mission.target || 1;
  const isDone = completed || mission.done || progress >= target;
  const clickable = !isDone;

  return (
    <button
      type="button"
      onClick={() => !isDone && onOpen && onOpen(mission)}
      disabled={isDone}
      style={{
        width: '100%',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px',
        background: isDone ? alpha(T.fillSuccess, 0.08) : alpha('#FBFBFB', 0.04),
        border: `1px solid ${isDone ? alpha(T.fillSuccess, 0.25) : alpha('#FBFBFB', 0.06)}`,
        borderRadius: R.large,
        cursor: clickable ? 'pointer' : 'default',
        textAlign: 'left',
        transition: 'transform 120ms ease, background 220ms ease, border-color 220ms ease',
        fontFamily: FONT,
      }}
      onMouseDown={(e) => { if (clickable) e.currentTarget.style.transform = 'scale(0.98)'; }}
      onMouseUp={(e) => { if (clickable) e.currentTarget.style.transform = 'scale(1)'; }}
      onMouseLeave={(e) => { if (clickable) e.currentTarget.style.transform = 'scale(1)'; }}
    >
      <div style={{
        width: 52, height: 52, borderRadius: R.medium, flexShrink: 0,
        background: isDone ? alpha(T.fillSuccess, 0.18) : alpha('#FBFBFB', 0.06),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <img src={ILLU(mission.illustration)} alt="" style={{
          width: 42, height: 42, objectFit: 'contain',
          filter: isDone ? 'grayscale(0.3) brightness(0.85)' : 'none',
        }}/>
        {isDone && (
          <div style={{
            position: 'absolute', bottom: -2, right: -2,
            width: 22, height: 22, borderRadius: '50%',
            background: T.fillSuccess, border: `2px solid ${T.backgroundApp}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#000" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          ...TY.mediumBold, color: T.fillPrimary,
          textDecoration: isDone ? 'line-through' : 'none',
          opacity: isDone ? 0.8 : 1,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {mission.title}
        </div>
        {mode === 'onboarding' && (
          <div style={{ ...TY.smallMedium, color: T.fillTertiary, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {isDone ? 'Completada — ¡buen trabajo!' : mission.desc}
          </div>
        )}
        {mode === 'ongoing' && (
          <div style={{ marginTop: 6 }}>
            <ProgressBar value={progress} max={target} height={4}
              fill={isDone ? T.fillSuccess : `linear-gradient(90deg, ${accent.glow}, ${accent.solid})`}/>
            <div style={{ ...TY.xSmallBold, color: T.fillTertiary, marginTop: 4 }}>
              {progress}/{target}{isDone ? ' · lista' : ''}
            </div>
          </div>
        )}
      </div>

      {mode === 'onboarding' && !isDone && (
        <div style={{
          padding: '4px 10px', borderRadius: 999,
          background: G.fillAccentOpacity,
          border: `1px solid ${alpha(T.fillAccentStart, 0.35)}`,
          ...TY.xSmallBlack, color: T.fillAccentStart, whiteSpace: 'nowrap',
        }}>
          +{mission.xp} XP
        </div>
      )}

      {!isDone && (
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: alpha('#FBFBFB', 0.06), border: `1px solid ${alpha('#FBFBFB', 0.08)}`,
          color: T.fillSecondary, fontSize: 16, lineHeight: 1,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          ›
        </div>
      )}
    </button>
  );
};

// ── Quest group (onboarding list) ─────────────────────────────
const QuestGroup = ({ groupId, missions, completedIds, onOpen }) => {
  const accent = GROUP_ACCENTS[groupId];
  const done = missions.filter(m => completedIds.includes(m.id)).length;
  const total = missions.length;
  const fullyDone = done === total && total > 0;
  const group = missions[0]?.group || groupId;
  const title = groupId === 'A' ? 'Desbloquea Retiros Instantáneos'
              : groupId === 'B' ? 'Domina la Apuesta'
              : groupId === 'C' ? 'Prueba el Casino'
              : 'Quédate Conectado';
  const subtitle = groupId === 'A' ? 'Verifica tu identidad y agrega tu CLABE — retira al instante cuando quieras.'
                 : groupId === 'B' ? 'Aprende el sportsbook: parlay, live, cashout, boosters, free bets.'
                 : groupId === 'C' ? 'Explora el lobby de iGaming — slots, crash, mesas en vivo.'
                 : 'Pequeños pasos que mejoran tu experiencia.';
  return (
    <div style={{
      background: alpha('#FBFBFB', 0.03),
      border: `1px solid ${fullyDone ? alpha(T.fillSuccess, 0.3) : alpha('#FBFBFB', 0.08)}`,
      borderRadius: R.xLarge, padding: S.x6, marginBottom: S.x6,
      boxShadow: fullyDone ? `0 0 0 3px ${alpha(T.fillSuccess, 0.08)}` : 'none',
      transition: 'all 300ms ease',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: accent.grad }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: S.x4, paddingLeft: 6 }}>
        <div style={{
          width: 32, height: 32, borderRadius: R.medium,
          background: fullyDone ? accent.grad : alpha('#FBFBFB', 0.06),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          ...TY.smallBlack, color: fullyDone ? '#000' : T.fillPrimary,
          boxShadow: fullyDone ? `0 6px 16px ${alpha(accent.glow, 0.4)}` : 'none',
        }}>
          {groupId}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ ...TY.xSmallBlack, color: T.fillTertiary, letterSpacing: 0.4 }}>{accent.label}</div>
          <div style={{ ...TY.baseBold, color: T.fillPrimary, display: 'flex', alignItems: 'center', gap: 8 }}>
            {title}
            {fullyDone && (
              <span style={{
                ...TY.xxSmallBold, padding: '2px 7px', borderRadius: 6,
                background: alpha(T.fillSuccess, 0.18), color: T.fillSuccess, letterSpacing: 0.4,
              }}>
                DESBLOQUEADO
              </span>
            )}
          </div>
          <div style={{ ...TY.smallMedium, color: T.fillTertiary, marginTop: 2 }}>{subtitle}</div>
        </div>
        <div style={{ ...TY.smallBold, color: T.fillSecondary, whiteSpace: 'nowrap' }}>{done}/{total}</div>
      </div>

      <div style={{ marginBottom: S.x4 }}>
        <ProgressBar value={done} max={total} height={4}
          fill={fullyDone ? accent.grad : `linear-gradient(90deg, ${accent.glow}, ${accent.solid})`}/>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {missions.map(m => (
          <MissionRow key={m.id} mission={m} group={groupId}
            completed={completedIds.includes(m.id)}
            onOpen={onOpen}
            mode="onboarding"/>
        ))}
      </div>
    </div>
  );
};

// ── Onboarding Trail (Duolingo-style single path) ─────────────
// Replaces the group cards for personas with view: 'trail'. All 12 missions
// are laid out in a single zigzag path, each node tinted by its group accent.
// No group headers, no progress card — the path itself is the hero.
const TrailNode = ({ mission, accent, state, isCurrent, onClick }) => {
  const done = state === 'done';
  const sz = 68;
  const ring = done ? accent.solid : state === 'active' ? '#FFFFFF' : alpha('#FBFBFB', 0.14);
  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
      background: 'transparent', border: 'none', padding: 0, cursor: 'pointer',
      fontFamily: FONT,
    }}>
      <div style={{ position: 'relative', width: sz + 16, height: sz + 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {isCurrent && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha('#FFFFFF', 0.22)} 0%, transparent 70%)`,
            animation: 'dfPulse 2s ease-in-out infinite',
          }}/>
        )}
        <div style={{
          width: sz, height: sz, borderRadius: '50%',
          background: done ? accent.grad : alpha('#FBFBFB', 0.06),
          border: `2px solid ${ring}`,
          boxShadow: done
            ? `0 10px 26px ${alpha(accent.glow, 0.4)}`
            : isCurrent
              ? `0 0 0 4px ${alpha('#FFFFFF', 0.06)}, 0 8px 22px ${alpha(accent.glow, 0.28)}`
              : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'visible',
        }}>
          <img src={ILLU(mission.illustration)} alt="" style={{
            width: 48, height: 48, objectFit: 'contain',
            filter: done ? 'brightness(0.9)' : 'none',
          }}/>
          {done && (
            <div style={{
              position: 'absolute', bottom: -4, right: -4,
              width: 26, height: 26, borderRadius: '50%',
              background: T.fillSuccess, border: `3px solid ${T.backgroundApp}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M5 12.5l4.5 4.5L19 7.5" stroke="#000" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
          {isCurrent && !done && (
            <div style={{
              position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
              background: T.fillPrimary, color: T.fillDark, ...TY.xxSmallBold,
              padding: '2px 10px', borderRadius: 999, whiteSpace: 'nowrap',
              boxShadow: '0 6px 14px rgba(0,0,0,0.45)',
            }}>EMPEZÁ</div>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'center', maxWidth: 124 }}>
        <div style={{ ...TY.xSmallBold, color: done ? T.fillPrimary : T.fillPrimary, lineHeight: 1.25 }}>
          {mission.title}
        </div>
        {!done && (
          <div style={{ ...TY.xxSmallBold, color: accent.solid, marginTop: 2, letterSpacing: 0.3 }}>
            +{mission.xp} XP
          </div>
        )}
      </div>
    </button>
  );
};

const TrailConnector = ({ direction = 'right', done = false, accent }) => {
  // Arc from the previous node's position (top) to the next node's position
  // (bottom). Nodes alternate left (x≈12%) and right (x≈88%) within each row,
  // so an S-curve with mid control points makes the connection feel physical.
  // viewBox is 100×50; preserveAspectRatio="none" stretches to fill trail width.
  const d = direction === 'right'
    ? 'M 12 2 C 12 32, 88 18, 88 48'   // after left node → down to right node
    : 'M 88 2 C 88 32, 12 18, 12 48';  // after right node → down to left node
  const stroke = done ? accent.solid : alpha('#FBFBFB', 0.22);
  return (
    <div style={{ width: '100%', height: 48, margin: '-8px 0' }}>
      <svg width="100%" height="100%" viewBox="0 0 100 50" preserveAspectRatio="none" fill="none">
        <path d={d} stroke={stroke} strokeWidth="2.2"
          vectorEffect="non-scaling-stroke"
          strokeLinecap="round" strokeDasharray={done ? '0' : '4 6'} fill="none"/>
      </svg>
    </div>
  );
};

const OnboardingTrail = ({ missions, completedIds, onOpen }) => {
  // Sort by `order` to match the Sheet's display_order.
  const trail = useMemo(() => [...missions].sort((a, b) => a.order - b.order), [missions]);
  const currentIdx = trail.findIndex(m => !completedIds.includes(m.id));
  const doneCount = completedIds.length;
  const total = trail.length;
  const earnedXP = trail.filter(m => completedIds.includes(m.id)).reduce((s, m) => s + m.xp, 0);
  const totalXP = trail.reduce((s, m) => s + m.xp, 0);

  // Render in zigzag: odd indexes pushed to the opposite side.
  return (
    <div style={{ padding: `${S.x2}px ${S.x4}px ${S.x8}px` }}>
      {/* Minimal hero strip — just counter + XP (no group cards, no stacked progress hero) */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: `${S.x4}px ${S.x4}px ${S.x2}px`,
      }}>
        <div>
          <div style={{ ...TY.xSmallBlack, color: T.fillTertiary, letterSpacing: 0.6 }}>TU SENDERO</div>
          <div style={{ ...TY.largeBold, color: T.fillPrimary, marginTop: 2 }}>
            {doneCount} / {total} misiones
          </div>
        </div>
        <div style={{
          padding: '6px 12px', borderRadius: 999,
          background: G.fillAccentOpacity, border: `1px solid ${alpha(T.fillAccentStart, 0.35)}`,
          ...TY.xSmallBlack, color: T.fillAccentStart,
        }}>
          {earnedXP.toLocaleString('es-MX')} / {totalXP.toLocaleString('es-MX')} XP
        </div>
      </div>

      <div style={{ position: 'relative', marginTop: S.x4 }}>
        {/* Sports-inspired background: 6 stadium tiles behind the zigzag,
            one per pair of missions (12 missions → 6 sports). Masked + dimmed
            so the nodes and connectors stay the focal point. */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden',
          display: 'flex', flexDirection: 'column',
          pointerEvents: 'none',
        }}>
          {['soccer.png','nba.png','tennis.png','nfl.png','nhl.png','f1.png'].map((src, i) => (
            <div key={i} style={{
              flex: '1 1 0',
              backgroundImage: `url(assets/${src})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              opacity: 0.38,
              maskImage: 'radial-gradient(ellipse 90% 60% at center, #000 45%, transparent 92%)',
              WebkitMaskImage: 'radial-gradient(ellipse 90% 60% at center, #000 45%, transparent 92%)',
            }}/>
          ))}
        </div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {trail.map((m, i) => {
            const state = completedIds.includes(m.id)
              ? 'done'
              : i === currentIdx ? 'active' : 'upcoming';
            const accent = GROUP_ACCENTS[m.group] || GROUP_ACCENTS.B;
            const offset = i % 2 === 0 ? 'flex-start' : 'flex-end';
            const isLast = i === trail.length - 1;
            const nextDone = !isLast && completedIds.includes(trail[i + 1].id);
            const thisDone = state === 'done';
            return (
              <React.Fragment key={m.id}>
                <div style={{
                  display: 'flex', justifyContent: offset,
                  padding: `0 ${S.x4}px`,
                }}>
                  <TrailNode mission={m} accent={accent} state={state}
                    isCurrent={i === currentIdx}
                    onClick={() => onOpen(m)}/>
                </div>
                {!isLast && (
                  <TrailConnector
                    direction={i % 2 === 0 ? 'right' : 'left'}
                    done={thisDone && nextDone}
                    accent={accent}/>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* End-of-trail badge */}
      <div style={{
        marginTop: S.x6,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: doneCount >= total
            ? `radial-gradient(circle, ${alpha(T.fillSuccess, 0.5)}, ${alpha(T.fillSuccess, 0.05)})`
            : `radial-gradient(circle, ${alpha('#FBFBFB', 0.08)}, ${alpha('#FBFBFB', 0)})`,
          border: `2px dashed ${doneCount >= total ? T.fillSuccess : alpha('#FBFBFB', 0.2)}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30,
        }}>
          {doneCount >= total ? '🎓' : '🏁'}
        </div>
        <div style={{ ...TY.smallBold, color: T.fillSecondary, textAlign: 'center' }}>
          {doneCount >= total ? '¡Graduado!' : 'Meta: graduarte del onboarding'}
        </div>
      </div>
    </div>
  );
};

Object.assign(window, { LevelBadge, TierChip, LevelTrack, SegmentedTabs, ProgressBar, MissionRow, QuestGroup, OnboardingTrail, GROUP_ACCENTS, ILLU });
