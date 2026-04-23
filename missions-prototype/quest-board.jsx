// Missions Prototype — main app
const { useState, useEffect, useRef, useMemo } = React;
const { theme: T, spacing: S, radius: R, type: TY, gradients: G, a: alpha, font: FONT } = window.DF;
const M = window.MISSIONS_DATA;
const ILLU = (name) => `assets/${name}`;

// ── Helpers ───────────────────────────────────────────────────
const GROUP_ACCENTS = {
  A: { grad: G.booster, solid: T.boosterGradEnd, glow: T.boosterGradStart, label: 'GRUPO A · RETIROS' },
  B: { grad: G.actionPrimary, solid: T.actionPrimaryDefaultGradEnd, glow: T.actionPrimaryDefaultGradStart, label: 'GRUPO B · SPORTSBOOK' },
  C: { grad: G.freeBet, solid: T.freeBetGradStart, glow: T.freeBetGradEnd, label: 'GRUPO C · CASINO' },
  D: { grad: `linear-gradient(135deg, ${T.fillSuccess}, ${T.levelContent})`, solid: T.fillSuccess, glow: T.levelContent, label: 'GRUPO D · EXPERIENCIA' },
};

// ── Mission Node (trail/path) ─────────────────────────────────
const MissionNode = ({ mission, groupId, state, onClick, isCurrent, compactLabel = false }) => {
  const accent = GROUP_ACCENTS[groupId];
  const done = state === 'done';
  const locked = state === 'locked';
  const active = state === 'active';
  const inProgress = state === 'in-progress';

  const sz = 76;
  const ring = done ? accent.solid : active ? '#FFFFFF' : alpha('#FBFBFB', 0.12);

  return (
    <button onClick={onClick} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      background: 'transparent', border: 'none', padding: 0, cursor: locked ? 'default' : 'pointer',
      filter: locked ? 'grayscale(1)' : 'none', opacity: locked ? 0.5 : 1,
    }}>
      <div style={{ position: 'relative', width: sz + 16, height: sz + 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* pulse for current */}
        {isCurrent && (
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: `radial-gradient(circle, ${alpha('#FFFFFF', 0.22)} 0%, transparent 70%)`,
            animation: 'dfPulse 2s ease-in-out infinite',
          }}/>
        )}
        {/* ring / backplate */}
        <div style={{
          width: sz, height: sz, borderRadius: '50%',
          background: done ? accent.grad : (active || inProgress) ? alpha('#FBFBFB', 0.06) : alpha('#FBFBFB', 0.03),
          border: `2px solid ${ring}`,
          boxShadow: done ? `0 8px 24px ${alpha(accent.glow, 0.35)}` :
                     isCurrent ? `0 0 0 4px ${alpha('#FFFFFF', 0.06)}` : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <img src={ILLU(mission.illustration)} alt="" style={{
            width: 56, height: 56, objectFit: 'contain',
            filter: locked ? 'brightness(0.5)' : 'none',
          }}/>
          {done && (
            <div style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 28, height: 28, borderRadius: '50%',
              background: T.fillSuccess, border: `3px solid ${T.backgroundApp}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <DFIcon name="check" size={14} color="#000"/>
            </div>
          )}
          {locked && (
            <div style={{
              position: 'absolute', bottom: -2, right: -2,
              width: 28, height: 28, borderRadius: '50%',
              background: alpha('#000000', 0.9), border: `3px solid ${T.backgroundApp}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <DFIcon name="lock" size={12} color={T.fillTertiary}/>
            </div>
          )}
          {inProgress && (
            <div style={{
              position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
              background: T.fillPrimary, color: T.fillDark, ...TY.xxSmallBold,
              padding: '2px 8px', borderRadius: 999, border: `2px solid ${T.backgroundApp}`,
            }}>EN PROGRESO</div>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'center', maxWidth: 110 }}>
        <div style={{ ...TY.xSmallBold, color: done ? T.fillPrimary : active ? T.fillPrimary : T.fillTertiary, lineHeight: 1.3 }}>
          {compactLabel ? mission.title.split(' ').slice(0, 3).join(' ') : mission.title}
        </div>
        {!done && !locked && (
          <div style={{ ...TY.xSmallMedium, color: T.fillAccentStart, marginTop: 2 }}>+{mission.xp} XP</div>
        )}
      </div>
    </button>
  );
};

// ── Group Header (along the trail) ────────────────────────────
const GroupBanner = ({ group, completed, total, unlocked }) => {
  const accent = GROUP_ACCENTS[group.id];
  const fullyDone = completed === total;
  return (
    <div style={{ margin: `${S.x8}px ${S.x8}px ${S.x6}px`, position: 'relative' }}>
      <div style={{
        borderRadius: R.large, padding: `${S.x6}px ${S.x8}px`,
        background: alpha('#FBFBFB', 0.04),
        border: `1px solid ${alpha('#FBFBFB', 0.08)}`,
        display: 'flex', alignItems: 'center', gap: S.x8,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* accent stripe */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
          background: accent.grad,
        }}/>
        <div style={{
          width: 44, height: 44, borderRadius: R.medium,
          background: fullyDone ? accent.grad : alpha('#FBFBFB', 0.06),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: fullyDone ? `0 6px 16px ${alpha(accent.glow, 0.4)}` : 'none',
        }}>
          <DFIcon name={fullyDone ? 'unlock' in {} ? 'unlock' : 'bolt' : 'lock'}
                  size={22} color={fullyDone ? T.fillDark : T.fillTertiary}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...TY.xSmallBlack, color: T.fillTertiary, letterSpacing: 0.4 }}>{accent.label}</div>
          <div style={{ ...TY.baseBold, color: T.fillPrimary }}>{group.title}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
            <DFProgressBar value={completed} max={total} height={4}
              fill={fullyDone ? accent.grad : `linear-gradient(90deg, ${accent.glow}, ${accent.solid})`}/>
            <div style={{ ...TY.xSmallBold, color: T.fillSecondary, whiteSpace: 'nowrap' }}>{completed}/{total}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Path connector (between nodes) ────────────────────────────
const PathConnector = ({ done, accent, curve = 'right' }) => {
  const d = curve === 'right'
    ? 'M 10 0 Q 90 40 10 80'
    : 'M 90 0 Q 10 40 90 80';
  return (
    <div style={{ width: 100, height: 80, position: 'relative', display: 'flex', justifyContent: 'center' }}>
      <svg width="100" height="80" viewBox="0 0 100 80" style={{ position: 'absolute' }}>
        <path d={d} fill="none"
          stroke={done ? accent : alpha('#FBFBFB', 0.15)}
          strokeWidth="3" strokeLinecap="round" strokeDasharray={done ? '0' : '4 6'}/>
      </svg>
    </div>
  );
};

// ── Quest Board (path / trail layout) ─────────────────────────
const QuestBoard = ({ progress, onSelectMission }) => {
  // flatten in recommended order
  const trail = useMemo(() => {
    const all = [];
    M.recommendedOrder.forEach((missionId) => {
      for (const gid of Object.keys(M.onboarding)) {
        const g = M.onboarding[gid];
        const m = g.missions.find(x => x.id === missionId);
        if (m) all.push({ ...m, groupId: gid, group: g });
      }
    });
    return all;
  }, []);

  // resolve state for each
  const resolved = trail.map((m, i) => {
    const done = progress.completed.includes(m.id);
    const inProgress = progress.inProgress === m.id;
    return { ...m, state: done ? 'done' : inProgress ? 'in-progress' : 'active' };
  });

  // Chunk into rows of 3 in zigzag
  const rows = [];
  const chunkSize = 3;
  for (let i = 0; i < resolved.length; i += chunkSize) {
    rows.push(resolved.slice(i, i + chunkSize));
  }

  // figure out which groups still have incomplete missions (for group headers)
  const groupCompletion = {};
  Object.values(M.onboarding).forEach(g => {
    const completed = g.missions.filter(m => progress.completed.includes(m.id)).length;
    groupCompletion[g.id] = { completed, total: g.missions.length, group: g };
  });

  const currentMissionId = resolved.find(m => m.state === 'active' || m.state === 'in-progress')?.id;

  return (
    <div style={{ padding: `${S.x4}px 0 ${S.x16}px` }}>
      {/* Group summary strip at top */}
      <div style={{ padding: `0 ${S.x8}px ${S.x6}px`, display: 'flex', flexDirection: 'column', gap: S.x3 }}>
        {Object.keys(M.onboarding).map(gid => (
          <GroupBanner key={gid} group={M.onboarding[gid]}
            completed={groupCompletion[gid].completed}
            total={groupCompletion[gid].total}
            unlocked={groupCompletion[gid].completed === groupCompletion[gid].total}/>
        ))}
      </div>

      {/* Trail label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: `${S.x6}px ${S.x8}px ${S.x4}px`,
      }}>
        <div style={{ flex: 1, height: 1, background: alpha('#FBFBFB', 0.12) }}/>
        <div style={{ ...TY.xSmallBlack, color: T.fillTertiary, letterSpacing: 0.6 }}>RUTA RECOMENDADA</div>
        <div style={{ flex: 1, height: 1, background: alpha('#FBFBFB', 0.12) }}/>
      </div>

      {/* Zigzag trail */}
      <div style={{ padding: `0 ${S.x6}px`, position: 'relative' }}>
        {rows.map((row, rowIdx) => {
          const reverse = rowIdx % 2 === 1;
          const items = reverse ? [...row].reverse() : row;
          return (
            <React.Fragment key={rowIdx}>
              <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', padding: `${S.x4}px 0` }}>
                {items.map((m) => {
                  const accent = GROUP_ACCENTS[m.groupId];
                  return (
                    <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <MissionNode mission={m} groupId={m.groupId} state={m.state}
                        isCurrent={m.id === currentMissionId} onClick={() => onSelectMission(m)}/>
                    </div>
                  );
                })}
              </div>
              {rowIdx < rows.length - 1 && (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '2px 0' }}>
                  <svg width="100%" height="32" viewBox="0 0 300 32" preserveAspectRatio="none" style={{ maxWidth: 300 }}>
                    <path d={reverse ? 'M 20 4 Q 20 28 280 28' : 'M 280 4 Q 280 28 20 28'}
                      fill="none"
                      stroke={alpha('#FBFBFB', 0.12)} strokeWidth="3"
                      strokeLinecap="round" strokeDasharray="4 6"/>
                  </svg>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// ── Progress Card (hero on Mi Perfil) ─────────────────────────
const ProgressCard = ({ mode = 'onboarding', progress, weeklyProgress }) => {
  if (mode === 'onboarding') {
    const total = progress.total;
    const done = progress.completed.length;
    const remaining = total - done;
    return (
      <div style={{
        borderRadius: R.xLarge, padding: S.x8,
        background: G.actionPrimaryOpacity16, border: `1px solid ${alpha(T.actionPrimaryDefaultGradStart, 0.32)}`,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -20, right: -20, width: 120, height: 120,
          background: `radial-gradient(circle, ${alpha(T.actionPrimaryDefaultGradEnd, 0.35)}, transparent 70%)` }}/>
        <div style={{ display: 'flex', alignItems: 'center', gap: S.x6, position: 'relative' }}>
          <div style={{
            width: 52, height: 52, borderRadius: R.medium,
            background: G.actionPrimary,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 8px 20px ${alpha(T.actionPrimaryDefaultGradStart, 0.4)}`,
          }}>
            <DFIcon name="trophy" size={28} color="#fff"/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ ...TY.xSmallBlack, color: T.fillTertiary, letterSpacing: 0.4 }}>MISIONES DE BIENVENIDA</div>
            <div style={{ ...TY.largeBold, color: T.fillPrimary }}>{done} de {total} completadas</div>
          </div>
        </div>
        <div style={{ marginTop: S.x6 }}>
          <DFProgressBar value={done} max={total} height={8}/>
        </div>
        <div style={{ marginTop: S.x4, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ ...TY.smallMedium, color: T.fillSecondary }}>
            {remaining > 0 ? `${remaining} restantes para graduarte` : '¡Listo para graduarte!'}
          </span>
          <span style={{ ...TY.smallBold, color: T.fillAccentStart }}>
            {progress.xp} XP ganado
          </span>
        </div>
      </div>
    );
  }

  // ongoing mode
  const { completed, total } = weeklyProgress;
  const chestReady = completed >= 4;
  return (
    <div style={{
      borderRadius: R.xLarge, padding: S.x8,
      background: chestReady ? G.boosterOpacity : alpha('#FBFBFB', 0.04),
      border: `1px solid ${chestReady ? alpha(T.boosterGradEnd, 0.4) : alpha('#FBFBFB', 0.08)}`,
      position: 'relative', overflow: 'hidden',
    }}>
      {chestReady && (
        <div style={{ position: 'absolute', inset: 0,
          background: `radial-gradient(circle at 80% 20%, ${alpha(T.boosterGradEnd, 0.2)}, transparent 50%)` }}/>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: S.x6, position: 'relative' }}>
        <div style={{
          width: 52, height: 52, borderRadius: R.medium,
          background: chestReady ? G.booster : alpha('#FBFBFB', 0.08),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: chestReady ? `0 8px 20px ${alpha(T.boosterGradEnd, 0.5)}` : 'none',
          animation: chestReady ? 'dfWiggle 2s ease-in-out infinite' : 'none',
        }}>
          <img src={ILLU('illustration_gift.png')} style={{ width: 40, height: 40, objectFit: 'contain' }}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...TY.xSmallBlack, color: T.fillTertiary, letterSpacing: 0.4 }}>MISIONES DE LA SEMANA</div>
          <div style={{ ...TY.largeBold, color: T.fillPrimary }}>
            {chestReady ? '¡Cofre desbloqueado!' : `${completed}/${total} esta semana`}
          </div>
        </div>
      </div>
      <div style={{ marginTop: S.x6 }}>
        <DFProgressBar value={completed} max={total} height={8}
          fill={chestReady ? G.booster : G.actionPrimary}/>
      </div>
      <div style={{ marginTop: S.x4, display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ ...TY.smallMedium, color: T.fillSecondary }}>
          {chestReady ? 'Toca para abrirlo' : `Completa ${4 - completed} más para el cofre`}
        </span>
        <span style={{ ...TY.smallBold, color: T.fillTertiary }}>
          Se reinicia el lunes
        </span>
      </div>
    </div>
  );
};

Object.assign(window, { QuestBoard, ProgressCard, MissionNode, GroupBanner, GROUP_ACCENTS, ILLU });
