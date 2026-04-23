// App shell — Loyalty landing (Mi Nivel) with Misiones/Recompensas tabs

const { useState: USt, useEffect: UEf, useMemo: UMe, useRef: URef } = React;
const { theme: TH, spacing: SP, radius: RD, type: TP, gradients: GR, a: AA, font: FF } = window.DF;

// ── State presets ─────────────────────────────────────────────
const getProgressForMode = (mode) => {
  const allIds = [];
  Object.values(window.MISSIONS_DATA.onboarding).forEach(g => g.missions.forEach(m => allIds.push(m.id)));
  const total = allIds.length;

  if (mode === 'onboarding') {
    return { completed: ['B1','B2','D1'], inProgress: 'B3', total, xp: 240, level: 1, xpForNext: 1000, badgeVariant: 'normal' };
  }
  if (mode === 'graduating') {
    return { completed: ['B1','B2','B3','B4','C1','A1','A2','D1','D2'], inProgress: 'D3', total, xp: 870, level: 1, xpForNext: 1000, badgeVariant: 'normal' };
  }
  // ongoing modes — higher level
  return { completed: allIds, inProgress: null, total, xp: 4200, level: 4, xpForNext: 6000, badgeVariant: 'gold' };
};

const getWeeklyForMode = (mode) => {
  const base = window.MISSIONS_DATA.ongoing.map(m => ({ ...m }));
  if (mode === 'ongoing') {
    return { missions: base, completed: base.filter(m => m.done).length, total: base.length };
  }
  if (mode === 'ongoing-chest') {
    const m = base.map((x, i) => i < 4 ? { ...x, done: true, progress: x.target } : x);
    return { missions: m, completed: 4, total: 5 };
  }
  return { missions: base, completed: 0, total: base.length };
};

// ── Loyalty Landing (Mi Nivel) ────────────────────────────────
const LoyaltyLanding = ({ mode, progress, weeklyProgress, tab, onTabChange, onSelectMission, onOpenChest, onboardingLayout }) => {
  const showOngoing = mode === 'ongoing' || mode === 'ongoing-chest';

  return (
    <DFScaffold>
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Scrollable content */}
        <div style={{ flex: 1, overflow: 'auto', paddingBottom: 110 }}>
          {/* Hero: level badge + XP */}
          <LevelHero
            level={progress.level}
            xp={progress.xp}
            xpForNext={progress.xpForNext}
            variant={progress.badgeVariant}
          />

          {/* Segmented tabs */}
          <div style={{ marginTop: SP.x4, marginBottom: SP.x6 }}>
            <SegmentedTabs
              tabs={[
                { id: 'misiones',    label: 'Misiones' },
                { id: 'recompensas', label: 'Recompensas' },
              ]}
              active={tab}
              onChange={onTabChange}
            />
          </div>

          {/* Tab content */}
          {tab === 'misiones' ? (
            <MissionsTabContent
              mode={mode} progress={progress} weeklyProgress={weeklyProgress}
              onSelectMission={onSelectMission} onOpenChest={onOpenChest}
              showOngoing={showOngoing}
              onboardingLayout={onboardingLayout}
            />
          ) : (
            <RewardsPanel level={progress.level}/>
          )}
        </div>

        <DFBottomNav active="profile"/>
      </div>
    </DFScaffold>
  );
};

// ── Misiones tab content ──────────────────────────────────────
const MissionsTabContent = ({ mode, progress, weeklyProgress, onSelectMission, onOpenChest, showOngoing, onboardingLayout = 'list' }) => {
  if (showOngoing) {
    return (
      <WeeklyMissions
        weekly={weeklyProgress.missions}
        chestReady={weeklyProgress.completed >= 4}
        onOpenChest={onOpenChest}/>
    );
  }

  // onboarding / graduating — layout variant
  if (onboardingLayout === 'trail') {
    return <QuestBoard progress={progress} onSelectMission={onSelectMission}/>;
  }
  return <OnboardingCollapsedList progress={progress} onSelectMission={onSelectMission}/>;
};

// ── Onboarding list (collapsed groups) ────────────────────────
// Matches user's demo sketch: banner header + simple row per mission within each group
const OnboardingCollapsedList = ({ progress, onSelectMission }) => {
  const M = window.MISSIONS_DATA;
  const done = progress.completed.length;
  const totalXp = 435; // sum of all mission XP

  return (
    <div style={{ padding: `0 ${SP.x8}px ${SP.x16}px` }}>
      {/* Hero intro card */}
      <div style={{
        padding: SP.x6, borderRadius: RD.large,
        background: GR.actionPrimaryOpacity16,
        border: `1px solid ${AA(TH.actionPrimaryDefaultGradStart, 0.3)}`,
        marginBottom: SP.x4,
      }}>
        <div style={{ ...TP.xSmallBlack, color: TH.fillTertiary, letterSpacing: 0.5, marginBottom: 2 }}>
          TUS PRIMEROS PASOS
        </div>
        <div style={{ ...TP.largeBold, color: TH.fillPrimary, marginBottom: 4 }}>
          Completa todas las misiones para graduarte
        </div>
        <div style={{ ...TP.smallMedium, color: TH.fillSecondary }}>
          {done}/{progress.total} misiones · {progress.xp}/{totalXp} XP ganados
        </div>
      </div>

      {/* Group cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: SP.x4 }}>
        {Object.keys(M.onboarding).map(gid => {
          const g = M.onboarding[gid];
          const accent = window.GROUP_ACCENTS[gid];
          const groupDone = g.missions.filter(m => progress.completed.includes(m.id)).length;
          return (
            <div key={gid} style={{
              borderRadius: RD.large, overflow: 'hidden',
              background: AA('#FBFBFB', 0.03),
              border: `1px solid ${AA('#FBFBFB', 0.06)}`,
            }}>
              {/* Group header */}
              <div style={{
                padding: `${SP.x6}px ${SP.x6}px`,
                display: 'flex', alignItems: 'center', gap: SP.x4,
                borderBottom: `1px solid ${AA('#FBFBFB', 0.06)}`,
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: RD.small,
                  background: accent.grad,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  ...TP.baseBold, color: TH.fillDark,
                  boxShadow: `0 4px 12px ${AA(accent.glow, 0.35)}`,
                }}>
                  {gid}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...TP.baseBold, color: TH.fillPrimary }}>{g.title}</div>
                  <div style={{ ...TP.xSmallMedium, color: TH.fillTertiary,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {g.subtitle}
                  </div>
                </div>
                <div style={{ ...TP.smallBold, color: TH.fillSecondary, whiteSpace: 'nowrap' }}>
                  {groupDone}/{g.missions.length}
                </div>
              </div>

              {/* Mission rows */}
              <div style={{ padding: `${SP.x3}px ${SP.x3}px ${SP.x4}px`, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {g.missions.map(m => {
                  const isDone = progress.completed.includes(m.id);
                  const isInProgress = progress.inProgress === m.id;
                  return (
                    <button key={m.id} onClick={() => onSelectMission({ ...m, groupId: gid })} style={{
                      display: 'flex', alignItems: 'center', gap: SP.x4,
                      padding: `${SP.x4}px ${SP.x4}px`, borderRadius: RD.medium,
                      background: isInProgress ? AA(TH.actionPrimaryDefaultGradStart, 0.12) : AA('#FBFBFB', 0.04),
                      border: `1px solid ${isInProgress ? AA(TH.actionPrimaryDefaultGradStart, 0.3) : 'transparent'}`,
                      cursor: 'pointer', textAlign: 'left',
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: RD.small, flexShrink: 0,
                        background: AA('#FBFBFB', 0.06),
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative',
                      }}>
                        <img src={`assets/${m.illustration}`} style={{
                          width: 30, height: 30, objectFit: 'contain',
                          opacity: isDone ? 0.4 : 1,
                        }}/>
                        {isDone && (
                          <div style={{
                            position: 'absolute', inset: 0, borderRadius: RD.small,
                            background: AA(TH.fillSuccess, 0.2),
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <DFIcon name="check" size={18} color={TH.fillSuccess}/>
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ ...TP.smallBold, color: isDone ? TH.fillSecondary : TH.fillPrimary,
                          textDecoration: isDone ? 'line-through' : 'none',
                          textDecorationColor: AA(TH.fillSecondary, 0.4),
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {m.title}
                        </div>
                        <div style={{ ...TP.xSmallMedium, color: TH.fillTertiary,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {isInProgress ? 'En progreso · ' : ''}{m.desc.split('.')[0]}
                        </div>
                      </div>
                      <div style={{
                        padding: '4px 10px', borderRadius: 999,
                        background: isDone ? AA(TH.fillSuccess, 0.12) : AA(TH.actionPrimaryDefaultGradStart, 0.18),
                        ...TP.xSmallBlack, color: isDone ? TH.fillSuccess : '#C3AFFF',
                        letterSpacing: 0.2, whiteSpace: 'nowrap',
                      }}>
                        {isDone ? '✓' : `+${m.xp} XP`}
                      </div>
                      <DFIcon name="chevronRight" size={14} color={TH.fillTertiary}/>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── Main App ──────────────────────────────────────────────────
const MissionsApp = ({ mode: initialMode, onboardingLayout: initialLayout = 'list' }) => {
  const [mode, setMode] = USt(initialMode || 'onboarding');
  const [tab, setTab] = USt('misiones');
  const [screen, setScreen] = USt('landing');
  const [selectedMission, setSelectedMission] = USt(null);
  const [onboardingLayout, setOnboardingLayout] = USt(initialLayout);

  UEf(() => { setMode(initialMode); setScreen('landing'); setTab('misiones'); }, [initialMode]);
  UEf(() => { setOnboardingLayout(initialLayout); }, [initialLayout]);

  const progress = UMe(() => getProgressForMode(mode), [mode]);
  const weeklyProgress = UMe(() => getWeeklyForMode(mode), [mode]);

  const selectMission = (m) => {
    const done = progress.completed.includes(m.id);
    setSelectedMission({ ...m, resolvedState: done ? 'done' : 'active' });
  };

  const startMission = () => {
    if (!selectedMission) return;
    const id = selectedMission.id;
    if (mode === 'graduating' && id === 'D3') {
      setSelectedMission(null);
      setTimeout(() => setScreen('graduation'), 250);
    } else {
      setSelectedMission(null);
    }
  };

  return (
    <>
      {screen === 'landing' && (
        <LoyaltyLanding
          mode={mode}
          progress={progress}
          weeklyProgress={weeklyProgress}
          tab={tab}
          onTabChange={setTab}
          onSelectMission={selectMission}
          onOpenChest={() => setScreen('chest')}
          onboardingLayout={onboardingLayout}
        />
      )}

      <MissionDetailSheet
        mission={selectedMission}
        groupId={selectedMission?.groupId}
        open={!!selectedMission}
        state={selectedMission?.resolvedState}
        onClose={() => setSelectedMission(null)}
        onStart={startMission}/>

      {screen === 'graduation' && (
        <GraduationScreen onContinue={() => { setMode('ongoing-chest'); setScreen('landing'); }}/>
      )}

      {screen === 'chest' && (
        <PrizeRoulette open={true} onClose={() => { setMode('ongoing'); setScreen('landing'); }}/>
      )}
    </>
  );
};

Object.assign(window, { MissionsApp, LoyaltyLanding, OnboardingCollapsedList });
