// Missions v3 — main app.
// Flow: Home (3-persona demo router) → MissionsHub → MissionDetailSheet → FollowAlong
//       → (onboarding end → Graduation) / (ongoing 4/5 → PrizeRoulette)
const { useState, useEffect, useMemo } = React;
const T = window.DF.theme;
const S = window.DF.spacing;
const R = window.DF.radius;
const TY = window.DF.type;
const G = window.DF.gradients;
const alpha = window.DF.a;
const FONT = window.DF.font;
const MD = window.MISSIONS_DATA;
const ILLU = window.ILLU;
const { LEVELS, TIER_COLORS, personas: PERSONAS_LIST } = window.PERSONAS;

// ── Home (demo router) ────────────────────────────────────────
const HomeRouter = ({ onPick }) => {
  return (
    <div style={{
      width: '100%', maxWidth: 420, margin: '0 auto', minHeight: '100vh',
      background: T.backgroundApp, padding: '56px 20px 32px',
      display: 'flex', flexDirection: 'column', fontFamily: FONT,
      backgroundImage: `radial-gradient(ellipse at top, ${alpha(T.actionPrimaryDefaultGradStart, 0.22)} 0%, ${T.backgroundApp} 55%)`,
    }}>
      <div style={{ marginBottom: S.x8 }}>
        <img src="assets/draftea-logo.png" alt="Draftea" style={{ height: 24, objectFit: 'contain' }}/>
      </div>

      <div style={{ marginBottom: S.x8 }}>
        <div style={{ ...TY.xSmallBlack, color: T.fillAccentStart, letterSpacing: 1.5 }}>DRAFTEA · MISIONES V3</div>
        <div style={{ ...TY.headlineLarge, color: T.fillPrimary, marginTop: 8, lineHeight: 1.15 }}>
          Elegí la experiencia que querés ver
        </div>
        <div style={{ ...TY.mediumRegular, color: T.fillSecondary, marginTop: 10 }}>
          Cada usuario entra al mismo hub de Lealtad pero con visuales y flow distintos según su nivel.
          Tocá una persona para entrar.
        </div>
      </div>

      {(() => {
        const PersonaCard = ({ p }) => {
          const def = LEVELS.find(l => l.n === p.level);
          const tier = TIER_COLORS[def.tier];
          const showTier = p.flow !== 'adhoc-v1';
          return (
            <button key={p.id} onClick={() => onPick(p)} style={{
              width: '100%',
              background: `linear-gradient(135deg, ${alpha(tier.accent, 0.12)} 0%, ${alpha('#FBFBFB', 0.02)} 100%)`,
              border: `1px solid ${alpha(tier.accent, 0.28)}`,
              borderRadius: R.xLarge, padding: '18px 18px',
              display: 'flex', gap: 14, alignItems: 'center',
              cursor: 'pointer', textAlign: 'left',
              transition: 'transform 140ms ease',
              fontFamily: FONT,
              boxShadow: `0 10px 28px ${alpha(tier.accent, 0.14)}`,
            }}
            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.985)')}
            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
              <div style={{ width: 76, height: 76, flexShrink: 0, position: 'relative' }}>
                <div style={{
                  position: 'absolute', inset: -10,
                  background: `radial-gradient(circle, ${alpha(tier.glow, 0.32)}, transparent 62%)`,
                }}/>
                <img src={def.badge} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative', zIndex: 1 }}/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ ...TY.xSmallBlack, color: tier.accent, letterSpacing: 0.6 }}>
                  {showTier ? `${tier.label} · NIVEL ${p.level}` : `NIVEL ${p.level}`}
                </div>
                <div style={{ ...TY.largeBold, color: T.fillPrimary, marginTop: 2 }}>{p.name}</div>
                <div style={{ ...TY.smallMedium, color: T.fillSecondary, marginTop: 4, lineHeight: 1.4 }}>{p.blurb}</div>
                <div style={{
                  marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '3px 10px', borderRadius: 999,
                  background: alpha('#FBFBFB', 0.06),
                  ...TY.xSmallBold, color: T.fillPrimary,
                }}>
                  {p.tagline}
                </div>
              </div>
              <div style={{ ...TY.headlineBase, color: T.fillTertiary, marginRight: 4 }}>›</div>
            </button>
          );
        };

        const current = PERSONAS_LIST.filter(p => p.flow === 'adhoc-v1');
        const legacy = PERSONAS_LIST.filter(p => p.flow !== 'adhoc-v1');

        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {current.map(p => <PersonaCard key={p.id} p={p}/>)}

            {legacy.length > 0 && (
              <>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  marginTop: S.x6, marginBottom: 2,
                }}>
                  <div style={{ flex: 1, height: 1, background: alpha('#FBFBFB', 0.08) }}/>
                  <span style={{ ...TY.xSmallBlack, color: T.fillTertiary, letterSpacing: 0.8 }}>
                    VERSIONES ANTERIORES
                  </span>
                  <div style={{ flex: 1, height: 1, background: alpha('#FBFBFB', 0.08) }}/>
                </div>
                <div style={{ ...TY.xSmallMedium, color: T.fillTertiary, textAlign: 'center', marginBottom: 6 }}>
                  Demos previas (v3 onboarding / weekly chest) — referencia histórica.
                </div>
                {legacy.map(p => <PersonaCard key={p.id} p={p}/>)}
              </>
            )}
          </div>
        );
      })()}

      <div style={{ marginTop: 'auto', paddingTop: 28, textAlign: 'center' }}>
        <div style={{ ...TY.xSmallMedium, color: T.fillTertiary }}>
          Alineado con PRD-MISSIONS.md · catálogo sincronizado con el Sheet (abr 22, 2026)
        </div>
      </div>
    </div>
  );
};

// ── Rewards tab (tier-aware benefits list) ────────────────────
const RewardsTab = ({ persona, claimedReward }) => {
  const def = LEVELS.find(l => l.n === persona.level);
  const tier = TIER_COLORS[def.tier];
  // Base benefits — filtered / expanded based on tier
  const base = [
    { name: 'Promociones generales', sub: 'Boosters en parlays de 3+ selecciones', expires: '22d : 23h : 23m', illu: 'illustration_booster.png', locked: false },
    { name: 'Giros gratis en casino', sub: '3 free spins cada semana', expires: '22d : 23h : 23m', illu: 'illustration_cards.png', locked: false },
    { name: 'Free bets semanales', sub: '$50 MXN en apuestas gratis', expires: '22d : 23h : 23m', illu: 'illustration_free_bet.png', locked: persona.level < 4 },
    { name: '1% de Cashback', sub: persona.level < 6 ? 'Llegá a Nivel 6 (Oro) para desbloquear' : 'Cashback semanal activo', expires: persona.level < 6 ? '' : '7d : 0h : 0m', illu: 'illustration_draftea_coin.png', locked: persona.level < 6 },
    { name: 'Experiencia VIP', sub: persona.level < 7 ? 'Llegá a Nivel 7 para desbloquear' : 'Premios especiales + atención prioritaria', expires: '', illu: 'illustration_gift_yellow.png', locked: persona.level < 7 },
  ];

  const prizeSub = (p) => {
    if (!p) return '';
    if (p.id === 'booster20') return 'Boost +20% en tu próxima parlay · Sin rollover';
    if (p.id === 'spins10') return 'Giros gratis en slots destacados';
    if (p.id === 'creditos50') return '$50 MXN en créditos · Sin rollover';
    return p.label;
  };

  const rewards = claimedReward
    ? [{
        name: claimedReward.label,
        sub: `${prizeSub(claimedReward)} · Recién reclamado`,
        expires: '7d : 0h : 0m',
        illu: 'illustration_gift.png',
        locked: false, fresh: true,
      }, ...base]
    : base;

  return (
    <div style={{ padding: `${S.x6}px ${S.x8}px ${S.x16}px` }}>
      <div style={{ ...TY.baseBold, color: T.fillPrimary, marginBottom: 4 }}>
        Beneficios que desbloqueás al subir de nivel
      </div>
      <div style={{ ...TY.smallMedium, color: T.fillTertiary, marginBottom: S.x6 }}>
        Los beneficios se renuevan mensualmente · Nivel actual: {tier.label}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {rewards.map((r, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: S.x4,
            padding: S.x4, borderRadius: R.large,
            background: r.fresh ? `linear-gradient(135deg, ${alpha(T.fillAccentStart, 0.14)}, ${alpha('#FBFBFB', 0.02)})` : alpha('#FBFBFB', 0.04),
            border: `1px solid ${r.fresh ? alpha(T.fillAccentStart, 0.3) : alpha('#FBFBFB', 0.06)}`,
            opacity: r.locked ? 0.55 : 1,
          }}>
            <div style={{
              width: 56, height: 56, flexShrink: 0, position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <img src={def.badge} alt="" style={{ width: 56, height: 56, objectFit: 'contain',
                filter: r.locked ? 'grayscale(1) brightness(0.45)' : 'none' }}/>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={ILLU(r.illu)} alt="" style={{ width: 26, height: 26, objectFit: 'contain',
                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))' }}/>
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...TY.baseBold, color: T.fillPrimary, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
                {r.name}
                {r.fresh && (
                  <span style={{ ...TY.xxSmallBold, padding: '2px 7px', borderRadius: 6,
                    background: alpha(T.fillAccentStart, 0.22), color: T.fillAccentStart, letterSpacing: 0.4 }}>NUEVO</span>
                )}
              </div>
              <div style={{ ...TY.smallMedium, color: T.fillTertiary, marginBottom: r.expires ? 4 : 0 }}>{r.sub}</div>
              {r.expires && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '3px 8px', borderRadius: 999, background: alpha('#FBFBFB', 0.06),
                  ...TY.xSmallBold, color: T.fillSecondary }}>
                  Vence {r.expires}
                </div>
              )}
            </div>
            {r.locked ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="11" width="14" height="9" rx="2" stroke={T.fillTertiary} strokeWidth="1.6"/>
                <path d="M8 11V8a4 4 0 018 0v3" stroke={T.fillTertiary} strokeWidth="1.6"/>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 6l6 6-6 6" stroke={T.fillPrimary} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Progress card (onboarding hero) ───────────────────────────
const OnboardingProgressCard = ({ completedIds, totalMissions, earnedXP, totalXP }) => {
  const remaining = totalMissions - completedIds.length;
  return (
    <div style={{
      borderRadius: R.xLarge, padding: S.x6, marginBottom: S.x6,
      background: G.actionPrimaryOpacity16,
      border: `1px solid ${alpha(T.actionPrimaryDefaultGradStart, 0.3)}`,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120,
        background: `radial-gradient(circle, ${alpha(T.actionPrimaryDefaultGradEnd, 0.35)}, transparent 70%)` }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: S.x4, position: 'relative' }}>
        <div style={{
          width: 52, height: 52, borderRadius: R.medium,
          background: G.actionPrimary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 8px 20px ${alpha(T.actionPrimaryDefaultGradStart, 0.4)}`, fontSize: 26,
        }}>
          🏆
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...TY.xSmallBlack, color: T.fillTertiary, letterSpacing: 0.4 }}>MISIONES DE BIENVENIDA</div>
          <div style={{ ...TY.largeBold, color: T.fillPrimary }}>{completedIds.length} de {totalMissions} completadas</div>
        </div>
      </div>
      <div style={{ marginTop: S.x4 }}>
        <window.ProgressBar value={completedIds.length} max={totalMissions} height={8}
          fill={G.actionPrimary}/>
      </div>
      <div style={{ marginTop: S.x4, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ ...TY.smallMedium, color: T.fillSecondary }}>
          {remaining > 0 ? `${remaining} restantes para graduarte` : '¡Listo para graduarte!'}
        </span>
        <span style={{ ...TY.smallBold, color: T.fillAccentStart }}>
          {earnedXP.toLocaleString('es-MX')} / {totalXP.toLocaleString('es-MX')} XP
        </span>
      </div>
    </div>
  );
};

// ── Progress card (ongoing hero) ──────────────────────────────
const OngoingProgressCard = ({ doneCount, threshold = 4 }) => {
  const chestReady = doneCount >= threshold;
  return (
    <div style={{
      borderRadius: R.xLarge, padding: S.x6, marginBottom: S.x6,
      background: chestReady ? G.boosterOpacity : alpha('#FBFBFB', 0.04),
      border: `1px solid ${chestReady ? alpha(T.boosterGradEnd, 0.4) : alpha('#FBFBFB', 0.08)}`,
      position: 'relative', overflow: 'hidden',
    }}>
      {chestReady && (
        <div style={{ position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 80% 20%, ${alpha(T.boosterGradEnd, 0.22)}, transparent 50%)` }}/>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: S.x4, position: 'relative' }}>
        <div style={{
          width: 52, height: 52, borderRadius: R.medium,
          background: chestReady ? G.booster : alpha('#FBFBFB', 0.08),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: chestReady ? `0 8px 20px ${alpha(T.boosterGradEnd, 0.5)}` : 'none',
          animation: chestReady ? 'dfWiggle 2s ease-in-out infinite' : 'none',
        }}>
          <img src={ILLU('illustration_gift.png')} alt="" style={{ width: 40, height: 40, objectFit: 'contain' }}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...TY.xSmallBlack, color: T.fillTertiary, letterSpacing: 0.4 }}>MISIONES DE LA SEMANA</div>
          <div style={{ ...TY.largeBold, color: T.fillPrimary }}>
            {chestReady ? '¡Cofre desbloqueado!' : `${doneCount} / 5 esta semana`}
          </div>
        </div>
      </div>
      <div style={{ marginTop: S.x4 }}>
        <window.ProgressBar value={doneCount} max={5} height={8}
          fill={chestReady ? G.booster : G.actionPrimary}/>
      </div>
      <div style={{ marginTop: S.x4, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ ...TY.smallMedium, color: T.fillSecondary }}>
          {chestReady ? 'Tocá el cofre para abrirlo' : `Completá ${threshold - doneCount} más para el cofre`}
        </span>
        <span style={{ ...TY.smallBold, color: T.fillTertiary }}>Reinicia el lunes</span>
      </div>
    </div>
  );
};

// ── Missions Hub (main screen) ────────────────────────────────
const MissionsHub = ({ persona, onBack }) => {
  const [tab, setTab] = useState('missions');
  const [navActive, setNavActive] = useState('rewards');

  const [completedIds, setCompletedIds] = useState(() => {
    if (persona.completedIds === 'ALL') return MD.onboarding.map(m => m.id);
    return [...(persona.completedIds || [])];
  });

  const [ongoing, setOngoing] = useState(() => {
    return MD.ongoing.map(m => {
      const override = persona.weeklyOverrides?.[m.id];
      return override ? { ...m, ...override } : { ...m };
    });
  });

  const [detail, setDetail] = useState(null);
  const [followAlong, setFollowAlong] = useState(null);
  const [chestOpen, setChestOpen] = useState(false);
  const [chestClaimed, setChestClaimed] = useState(false);
  const [claimedReward, setClaimedReward] = useState(null);
  const [graduationShown, setGraduationShown] = useState(persona.completedIds === 'ALL');
  const [showGraduation, setShowGraduation] = useState(false);
  const [toast, setToast] = useState(null);

  const def = LEVELS.find(l => l.n === persona.level);
  const tier = TIER_COLORS[def.tier];

  const totalMissions = MD.onboarding.length;
  const totalXP = MD.onboarding.reduce((s, m) => s + m.xp, 0);
  const earnedXP = MD.onboarding.filter(m => completedIds.includes(m.id)).reduce((s, m) => s + m.xp, 0);

  const onboardingGrouped = useMemo(() => {
    const byGroup = { A: [], B: [], C: [], D: [] };
    const sorted = [...MD.onboarding].sort((a, b) => a.order - b.order);
    sorted.forEach(m => { if (byGroup[m.group]) byGroup[m.group].push(m); });
    return byGroup;
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(t);
  }, [toast]);

  // Auto-fire graduation when onboarding completes
  useEffect(() => {
    if (persona.flow !== 'onboarding') return;
    if (graduationShown) return;
    if (completedIds.length === totalMissions && totalMissions > 0) {
      const t = setTimeout(() => { setShowGraduation(true); setGraduationShown(true); }, 450);
      return () => clearTimeout(t);
    }
  }, [completedIds, persona.flow, graduationShown, totalMissions]);

  const completeOnboarding = (mission) => {
    if (completedIds.includes(mission.id)) return;
    setCompletedIds(prev => [...prev, mission.id]);
    setToast({ icon: '✨', text: `${mission.title} · +${mission.xp} XP` });
  };

  const advanceOngoing = (missionId) => {
    setOngoing(prev => prev.map(m => {
      if (m.id !== missionId) return m;
      if ((m.progress || 0) >= m.target) return m;
      const nextProgress = Math.min(m.target, (m.progress || 0) + 1);
      const isDone = nextProgress >= m.target;
      if (isDone) setToast({ icon: '✅', text: `${m.title} · lista` });
      else setToast({ icon: '✨', text: `${m.title} · ${nextProgress}/${m.target}` });
      return { ...m, progress: nextProgress, done: isDone };
    }));
  };

  const handleChestClaim = (prize) => {
    setChestClaimed(true);
    setChestOpen(false);
    if (prize.id === 'nothing') {
      setToast({ icon: '🕊️', text: 'Sin suerte · vuelve el próximo lunes' });
      return;
    }
    setClaimedReward(prize);
    setToast({ icon: '🎁', text: `Premio reclamado: ${prize.label}` });
  };

  const doneWeekly = ongoing.filter(m => (m.progress || 0) >= m.target).length;

  // FollowAlong takes over the whole screen when active
  if (followAlong) {
    return (
      <window.FollowAlong
        mission={followAlong.mission}
        groupId={followAlong.groupId}
        onBack={() => setFollowAlong(null)}
        onComplete={() => {
          if (followAlong.mode === 'onboarding') completeOnboarding(followAlong.mission);
          else advanceOngoing(followAlong.mission.id);
          setFollowAlong(null);
        }}
      />
    );
  }

  return (
    <div style={{
      width: '100%', maxWidth: 420, margin: '0 auto', minHeight: '100vh',
      background: T.backgroundApp, position: 'relative', fontFamily: FONT,
    }}>
      {/* Top bar with persona switcher + info */}
      <div style={{ position: 'sticky', top: 0, zIndex: 20, background: T.backgroundApp }}>
        <div style={{
          height: 36, display: 'flex', alignItems: 'center',
          padding: '12px 20px 4px', justifyContent: 'space-between',
          ...TY.xSmallBold, color: T.fillTertiary,
        }}>
          <button onClick={onBack} style={{
            background: 'transparent', border: 'none', color: T.fillSecondary,
            cursor: 'pointer', ...TY.xSmallBold, padding: 0,
          }}>
            ← Cambiar persona
          </button>
          <span>{persona.name} · Nivel {persona.level}</span>
        </div>

        {/* Level hero with horizontal track */}
        <div style={{ padding: `${S.x2}px 0 0`, position: 'relative' }}>
          <window.LevelTrack level={persona.level} xp={persona.xp} xpNext={persona.xpNext}
            showTier={persona.flow !== 'adhoc-v1'}/>
        </div>

        {/* Tabs — hidden for V1 ad-hoc, where Misiones + Recompensas render stacked */}
        {persona.flow !== 'adhoc-v1' && (
          <div style={{ padding: `${S.x4}px 0 ${S.x4}px` }}>
            <window.SegmentedTabs
              tabs={[{ id: 'missions', label: 'Misiones' }, { id: 'rewards', label: 'Recompensas' }]}
              active={tab} onChange={setTab}/>
          </div>
        )}
        {persona.flow === 'adhoc-v1' && (
          <div style={{ height: S.x4 }}/>
        )}
      </div>

      {/* Body */}
      <div style={{ paddingBottom: 140 }}>
        {/* V1 ad-hoc — single stacked view: Misiones followed by Recompensas. */}
        {persona.flow === 'adhoc-v1' && (
          <>
            <window.AdHocV1Misiones persona={persona} setToast={setToast}/>

            <RewardsTab persona={persona} claimedReward={claimedReward}/>
          </>
        )}

        {tab === 'missions' && persona.flow === 'onboarding' && persona.view === 'trail' && (
          <window.OnboardingTrail
            missions={MD.onboarding}
            completedIds={completedIds}
            onOpen={(m) => setDetail({ mission: m, groupId: m.group, mode: 'onboarding' })}/>
        )}

        {tab === 'missions' && persona.flow === 'onboarding' && persona.view !== 'trail' && (
          <div style={{ padding: `${S.x4}px ${S.x8}px 0` }}>
            <OnboardingProgressCard
              completedIds={completedIds}
              totalMissions={totalMissions}
              earnedXP={earnedXP}
              totalXP={totalXP}/>

            {Object.keys(onboardingGrouped).map(groupId => (
              <window.QuestGroup
                key={groupId}
                groupId={groupId}
                missions={onboardingGrouped[groupId]}
                completedIds={completedIds}
                onOpen={(m) => setDetail({ mission: m, groupId, mode: 'onboarding' })}/>
            ))}
          </div>
        )}

        {tab === 'missions' && persona.flow === 'ongoing' && (
          <div style={{ padding: `${S.x4}px ${S.x8}px 0` }}>
            {/* When chest is ready (and unclaimed) the PrizeChestButton replaces the
                OngoingProgressCard — one clear CTA, no duplicate "desbloqueado" headers. */}
            {doneWeekly >= MD.CHEST_THRESHOLD && !chestClaimed ? (
              <window.PrizeChestButton
                variant="hero"
                completed={doneWeekly}
                threshold={MD.CHEST_THRESHOLD}
                claimed={chestClaimed}
                onOpen={() => setChestOpen(true)}/>
            ) : (
              <OngoingProgressCard doneCount={doneWeekly}/>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {ongoing.map(m => (
                <window.MissionRow
                  key={m.id}
                  mission={m}
                  group="B"
                  completed={(m.progress || 0) >= m.target}
                  onOpen={(mx) => setDetail({ mission: mx, groupId: 'B', mode: 'ongoing' })}
                  mode="ongoing"/>
              ))}
            </div>

            {/* Claimed state — show "Premio reclamado" card below the list */}
            {chestClaimed && (
              <window.PrizeChestButton
                completed={doneWeekly}
                threshold={MD.CHEST_THRESHOLD}
                claimed={chestClaimed}
                onOpen={() => setChestOpen(true)}/>
            )}
          </div>
        )}

        {tab === 'rewards' && (
          <RewardsTab persona={persona} claimedReward={claimedReward}/>
        )}
      </div>

      <BottomNav active={navActive} onChange={setNavActive}/>

      <window.MissionDetailSheet
        open={!!detail}
        mission={detail?.mission}
        groupId={detail?.groupId}
        mode={detail?.mode}
        completed={detail ? (
          detail.mode === 'onboarding'
            ? completedIds.includes(detail.mission.id)
            : (detail.mission.progress || 0) >= (detail.mission.target || 1)
        ) : false}
        onClose={() => setDetail(null)}
        onComplete={() => {
          if (!detail) return;
          if (detail.mode === 'onboarding') completeOnboarding(detail.mission);
          else advanceOngoing(detail.mission.id);
        }}
        onFollowAlong={(mission, groupId) => {
          setFollowAlong({ mission, groupId, mode: detail.mode });
          setDetail(null);
        }}/>

      <window.PrizeRoulette
        open={chestOpen} tier={def.tier}
        onClose={() => setChestOpen(false)}
        onClaim={handleChestClaim}/>

      <window.GraduationScreen
        visible={showGraduation} tier={def.tier}
        onContinue={() => setShowGraduation(false)}/>

      <window.Toast toast={toast}/>
    </div>
  );
};

// ── App root ──────────────────────────────────────────────────
const App = () => {
  const [persona, setPersona] = useState(null);
  if (!persona) return <HomeRouter onPick={setPersona}/>;
  return <MissionsHub persona={persona} onBack={() => setPersona(null)}/>;
};

// Wait for modules before rendering
const waitForGlobals = () => new Promise(resolve => {
  const check = () => {
    if (window.DF && window.MISSIONS_DATA && window.MISSIONS_V1_DATA && window.PERSONAS && window.LevelBadge
        && window.MissionDetailSheet && window.FollowAlong
        && window.PrizeRoulette && window.GraduationScreen && window.Toast
        && window.QuestGroup && window.OnboardingTrail && window.MissionRow && window.LevelTrack
        && window.SegmentedTabs && window.ProgressBar && window.PrizeChestButton
        && window.AdHocV1Misiones
        && typeof BottomNav !== 'undefined') {
      resolve();
    } else {
      setTimeout(check, 50);
    }
  };
  check();
});

waitForGlobals().then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
});
