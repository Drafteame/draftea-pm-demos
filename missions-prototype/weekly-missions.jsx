// Ongoing weekly missions — list + chest CTA
const { theme: TT, spacing: SS, radius: RR, type: TTY, gradients: GG, a: aA } = window.DF;

const WeeklyMissionCard = ({ mission, onClick }) => {
  const done = mission.done;
  const progressPct = Math.min(100, (mission.progress / mission.target) * 100);
  return (
    <button onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: SS.x6, width: '100%', textAlign: 'left',
      padding: SS.x6, borderRadius: RR.large, background: aA('#FBFBFB', done ? 0.03 : 0.05),
      border: `1px solid ${done ? aA(TT.fillSuccess, 0.25) : aA('#FBFBFB', 0.08)}`,
      cursor: 'pointer', position: 'relative', overflow: 'hidden',
    }}>
      {/* illustration — colorful gradient frame (inverted from onboarding's dark tile) */}
      <div style={{
        width: 56, height: 56, borderRadius: RR.medium, flexShrink: 0,
        background: done
          ? `linear-gradient(135deg, ${aA(TT.fillSuccess, 0.25)}, ${aA(TT.levelContent, 0.15)})`
          : `linear-gradient(135deg, ${aA(TT.freeBetGradStart, 0.35)}, ${aA(TT.actionPrimaryDefaultGradStart, 0.35)})`,
        border: `1px solid ${done ? aA(TT.fillSuccess, 0.4) : aA(TT.freeBetGradStart, 0.4)}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <img src={`assets/${mission.illustration}`} style={{ width: 40, height: 40, objectFit: 'contain', opacity: done ? 0.55 : 1 }}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
          <div style={{ ...TTY.smallBold, color: done ? TT.fillSecondary : TT.fillPrimary,
            textDecoration: done ? 'line-through' : 'none', textDecorationColor: aA(TT.fillSecondary, 0.5) }}>
            {mission.title}
          </div>
          {done && <DFPill variant="success" icon="check" style={{ padding: '2px 6px' }}>Listo</DFPill>}
        </div>
        <div style={{ ...TTY.xSmallMedium, color: TT.fillTertiary, lineHeight: 1.4, marginBottom: 8,
          overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
          {mission.desc}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 5, background: aA('#FBFBFB', 0.1), borderRadius: 999, overflow: 'hidden' }}>
            <div style={{
              width: `${progressPct}%`, height: '100%',
              background: done ? TT.fillSuccess : GG.actionPrimary,
              borderRadius: 999, transition: 'width 0.6s',
            }}/>
          </div>
          <div style={{ ...TTY.xSmallBold, color: done ? TT.fillSuccess : TT.fillSecondary, whiteSpace: 'nowrap' }}>
            {mission.progress}/{mission.target}
          </div>
        </div>
      </div>
      {!done && <DFIcon name="chevronRight" size={16} color={TT.fillTertiary}/>}
    </button>
  );
};

const WeeklyMissions = ({ weekly, chestReady, onOpenChest, resetDay = 'lunes' }) => {
  const completedCount = weekly.filter(m => m.done).length;
  return (
    <div style={{ padding: `0 ${SS.x8}px ${SS.x16}px` }}>
      {/* Chest CTA card — only shown when chest is ready */}
      {chestReady && (
        <div style={{
          marginTop: SS.x4, marginBottom: SS.x6,
          borderRadius: RR.xLarge, padding: SS.x8,
          background: `linear-gradient(135deg, ${aA(TT.boosterGradStart, 0.25)}, ${aA(TT.freeBetGradEnd, 0.15)})`,
          border: `1px solid ${aA(TT.boosterGradEnd, 0.5)}`,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0,
            background: `radial-gradient(circle at 85% 30%, ${aA(TT.boosterGradEnd, 0.3)}, transparent 55%)` }}/>
          <div style={{ display: 'flex', alignItems: 'center', gap: SS.x6, position: 'relative' }}>
            <img src="assets/illustration_gift_yellow.png"
                 style={{ width: 72, height: 72, objectFit: 'contain',
                   animation: 'dfWiggle 2.5s ease-in-out infinite' }}/>
            <div style={{ flex: 1 }}>
              <div style={{ ...TTY.xSmallBlack, color: TT.boosterGradEnd, letterSpacing: 0.5 }}>
                ¡COFRE LISTO!
              </div>
              <div style={{ ...TTY.headlineBase, color: TT.fillPrimary, marginTop: 2 }}>
                Gira la ruleta
              </div>
              <div style={{ ...TTY.smallMedium, color: TT.fillSecondary, marginTop: 4 }}>
                Tu recompensa espera. Ábrelo antes de 7 días.
              </div>
            </div>
          </div>
          <div style={{ marginTop: SS.x6, position: 'relative' }}>
            <DFButton onClick={onOpenChest} trailing="arrowRight">Abrir cofre</DFButton>
          </div>
        </div>
      )}

      {/* Inline status row (replaces the big 'Esta semana' header) */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginTop: chestReady ? 0 : SS.x4, marginBottom: SS.x4,
        padding: `0 ${SS.x2}px`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ ...TTY.xSmallBlack, color: TT.fillTertiary, letterSpacing: 0.6 }}>
            MISIONES · ESTA SEMANA
          </div>
          <div style={{
            padding: '2px 8px', borderRadius: 999, background: aA('#FBFBFB', 0.08),
            ...TTY.xxSmallBold, color: TT.fillPrimary, fontSize: 10,
          }}>
            {completedCount}/4
          </div>
        </div>
        <div style={{ ...TTY.xSmallBold, color: TT.fillTertiary }}>Reinicia el {resetDay}</div>
      </div>

      {/* Missions list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {weekly.map(m => (
          <WeeklyMissionCard key={m.id} mission={m} onClick={() => {}}/>
        ))}
      </div>

      {/* History hint */}
      <button style={{
        marginTop: SS.x8, width: '100%', padding: SS.x6, borderRadius: RR.medium,
        background: aA('#FBFBFB', 0.03), border: `1px dashed ${aA('#FBFBFB', 0.12)}`,
        color: TT.fillSecondary, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      }}>
        <DFIcon name="calendar" size={16} color={TT.fillTertiary}/>
        <span style={{ ...TTY.smallMedium }}>Ver historial de cofres</span>
      </button>
    </div>
  );
};

Object.assign(window, { WeeklyMissions, WeeklyMissionCard });
