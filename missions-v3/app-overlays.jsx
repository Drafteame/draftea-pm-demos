// Overlays: MissionDetailSheet, FollowAlong (step-by-step), PrizeRoulette, GraduationScreen, Toast.
const { useState: uS, useEffect: uE, useRef: uR } = React;
(function registerOverlays () {
  const { theme: T, spacing: S, radius: R, type: TY, gradients: G, a: alpha, font: FONT } = window.DF;
  const ILLU = window.ILLU;
  const GROUP_ACCENTS = window.GROUP_ACCENTS;
  const { TIER_COLORS, LEVELS } = window.PERSONAS;

  // ── Bottom sheet shell ────────────────────────────────────────
  const BottomSheet = ({ open, onClose, children, maxHeight = '92vh' }) => {
    if (!open) return null;
    return (
      <div
        style={{
          position: 'fixed', inset: 0, background: 'rgba(5,3,10,0.78)',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 120,
          backdropFilter: 'blur(4px)', animation: 'dfFadeIn 180ms ease-out',
        }}
        onClick={onClose}>
        <div onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 420, background: T.backgroundApp,
            borderTopLeftRadius: 24, borderTopRightRadius: 24,
            padding: `${S.x6}px ${S.x8}px ${S.x10}px`,
            border: `1px solid ${alpha('#FBFBFB', 0.08)}`,
            animation: 'dfSlideUp 260ms ease-out',
            maxHeight, overflowY: 'auto', fontFamily: FONT,
          }}>
          <div style={{ width: 40, height: 4, background: alpha('#FBFBFB', 0.18), borderRadius: 999, margin: '0 auto 14px' }}/>
          {children}
        </div>
      </div>
    );
  };

  // ── Mission Detail Sheet ──────────────────────────────────────
  const MissionDetailSheet = ({ open, mission, groupId, mode, completed, onClose, onComplete, onFollowAlong }) => {
    if (!open || !mission) return null;
    const accent = GROUP_ACCENTS[groupId] || GROUP_ACCENTS.B;
    const isDone = completed || mission.done;

    return (
      <BottomSheet open={open} onClose={onClose}>
        {/* Hero */}
        <div style={{
          height: 160, borderRadius: R.large, background: accent.grad,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden', marginBottom: S.x6,
        }}>
          <div style={{ position: 'absolute', inset: 0,
            background: `radial-gradient(circle at 50% 50%, ${alpha('#FFFFFF', 0.22)}, transparent 70%)` }}/>
          <img src={ILLU(mission.illustration)} alt=""
            style={{ width: 120, height: 120, objectFit: 'contain', position: 'relative',
              filter: `drop-shadow(0 8px 20px ${alpha('#000', 0.4)})` }}/>
          {isDone && (
            <div style={{
              position: 'absolute', top: 12, right: 12,
              background: T.fillSuccess, color: '#000',
              padding: '4px 10px', borderRadius: 999, ...TY.xSmallBlack,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              ✓ COMPLETADA
            </div>
          )}
          <button onClick={onClose} style={{
            position: 'absolute', top: 12, left: 12,
            width: 32, height: 32, borderRadius: '50%',
            background: alpha('#000', 0.4), border: 'none', color: '#FFF',
            fontSize: 16, lineHeight: 1, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(6px)',
          }}>×</button>
        </div>

        <div style={{ ...TY.xSmallBlack, color: T.fillTertiary, letterSpacing: 0.6 }}>
          {accent.label} · {mode === 'onboarding' ? `+${mission.xp} XP` : 'SEMANAL · SIN XP'}
        </div>
        <div style={{ ...TY.headlineBase, color: T.fillPrimary, marginTop: 4 }}>{mission.title}</div>
        <div style={{ ...TY.mediumRegular, color: T.fillSecondary, marginTop: S.x4 }}>{mission.desc}</div>

        {/* Rules */}
        {mission.rules && mission.rules.length > 0 && (
          <div style={{
            marginTop: S.x6, padding: S.x6,
            background: alpha('#FBFBFB', 0.04), borderRadius: R.base,
            border: `1px solid ${alpha('#FBFBFB', 0.06)}`,
          }}>
            <div style={{ ...TY.smallBlack, color: T.fillPrimary, marginBottom: 8, letterSpacing: 0.3 }}>
              CÓMO CUENTA
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mission.rules.map((r, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 6, height: 6, borderRadius: 999, background: accent.solid, marginTop: 7, flexShrink: 0 }}/>
                  <div style={{ ...TY.smallMedium, color: T.fillSecondary }}>{r}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTAs */}
        <div style={{ marginTop: S.x6, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {isDone ? (
            <button onClick={onClose} style={{
              padding: '14px 18px', borderRadius: R.base,
              background: alpha('#FBFBFB', 0.08), color: T.fillPrimary,
              border: `1px solid ${alpha('#FBFBFB', 0.08)}`,
              ...TY.mediumBold, cursor: 'pointer',
            }}>
              Ver otras misiones
            </button>
          ) : (
            <>
              <button onClick={() => onFollowAlong(mission, groupId)} style={{
                padding: '14px 18px', borderRadius: R.base,
                background: G.actionPrimary, color: '#FFF', border: 'none',
                ...TY.mediumBold, cursor: 'pointer',
                boxShadow: `0 8px 20px ${alpha(T.actionPrimaryDefaultGradStart, 0.35)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                Seguir los pasos <span style={{ fontSize: 18 }}>→</span>
              </button>
              <button onClick={() => { onComplete(); onClose(); }} style={{
                padding: '12px 16px', borderRadius: R.base,
                background: 'transparent', color: T.fillSecondary,
                border: `1px solid ${alpha('#FBFBFB', 0.08)}`,
                ...TY.smallBold, cursor: 'pointer',
              }}>
                {mode === 'onboarding' ? 'Marcar como completada (demo)' : 'Sumar progreso (demo)'}
              </button>
            </>
          )}
        </div>
      </BottomSheet>
    );
  };

  // ── Follow-along step-by-step page ────────────────────────────
  // Replaces v2's chatbot placeholder with a real guided walkthrough.
  const FollowAlong = ({ mission, groupId, onBack, onComplete }) => {
    const [stepIdx, setStepIdx] = uS(0);
    if (!mission) return null;
    const accent = GROUP_ACCENTS[groupId] || GROUP_ACCENTS.B;
    const steps = mission.steps || [];
    const total = steps.length;
    const isLast = stepIdx === total - 1;
    const step = steps[stepIdx] || { title: '—', body: '' };

    return (
      <div style={{
        width: '100%', maxWidth: 420, margin: '0 auto', minHeight: '100vh',
        background: T.backgroundApp, display: 'flex', flexDirection: 'column',
        fontFamily: FONT,
      }}>
        {/* Header */}
        <div style={{
          padding: '52px 16px 14px', display: 'flex', alignItems: 'center', gap: 12,
          borderBottom: `1px solid ${alpha('#FBFBFB', 0.06)}`,
          position: 'sticky', top: 0, zIndex: 10, background: T.backgroundApp,
        }}>
          <button onClick={onBack} aria-label="Volver" style={{
            width: 36, height: 36, borderRadius: '50%',
            background: alpha('#FBFBFB', 0.06), border: 'none', color: T.fillPrimary,
            fontSize: 18, lineHeight: 1, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>←</button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...TY.xSmallBlack, color: T.fillTertiary, letterSpacing: 0.6 }}>
              {accent.label}
            </div>
            <div style={{ ...TY.baseBold, color: T.fillPrimary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {mission.title}
            </div>
          </div>
        </div>

        {/* Step progress */}
        <div style={{ padding: `${S.x6}px ${S.x8}px 0` }}>
          <div style={{ display: 'flex', gap: 6 }}>
            {steps.map((_, i) => (
              <div key={i} style={{
                flex: 1, height: 4, borderRadius: 999,
                background: i <= stepIdx ? accent.solid : alpha('#FBFBFB', 0.1),
                transition: 'background 280ms ease',
              }}/>
            ))}
          </div>
          <div style={{ ...TY.xSmallBlack, color: T.fillTertiary, letterSpacing: 0.4, marginTop: 10 }}>
            PASO {stepIdx + 1} / {total}
          </div>
        </div>

        {/* Hero + step content */}
        <div style={{ flex: 1, padding: `${S.x6}px ${S.x8}px`, display: 'flex', flexDirection: 'column' }}>
          <div style={{
            height: 180, borderRadius: R.xLarge, background: accent.grad,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden', marginBottom: S.x6,
          }}>
            <div style={{ position: 'absolute', inset: 0,
              background: `radial-gradient(circle at 50% 50%, ${alpha('#FFFFFF', 0.22)}, transparent 70%)` }}/>
            <img src={ILLU(mission.illustration)} alt=""
              style={{ width: 130, height: 130, objectFit: 'contain', position: 'relative',
                filter: `drop-shadow(0 8px 20px ${alpha('#000', 0.4)})` }}/>
          </div>

          <div style={{ ...TY.largeBlack, color: T.fillPrimary, marginBottom: 8 }}>{step.title}</div>
          <div style={{ ...TY.mediumRegular, color: T.fillSecondary, lineHeight: 1.55 }}>{step.body}</div>

          {/* Step dots nav */}
          <div style={{ marginTop: 'auto', paddingTop: S.x8, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              onClick={() => {
                if (isLast) { onComplete(); }
                else { setStepIdx(i => Math.min(steps.length - 1, i + 1)); }
              }}
              style={{
                width: '100%', padding: '16px 20px', borderRadius: R.base,
                background: G.actionPrimary, color: '#FFF', border: 'none',
                ...TY.mediumBold, cursor: 'pointer',
                boxShadow: `0 10px 24px ${alpha(T.actionPrimaryDefaultGradStart, 0.35)}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
              {isLast ? '¡Listo! Marcar completada' : 'Siguiente paso'}
              <span style={{ fontSize: 18 }}>{isLast ? '✓' : '→'}</span>
            </button>
            {stepIdx > 0 && (
              <button onClick={() => setStepIdx(i => Math.max(0, i - 1))} style={{
                padding: '12px 16px', borderRadius: R.base,
                background: 'transparent', color: T.fillSecondary,
                border: `1px solid ${alpha('#FBFBFB', 0.08)}`,
                ...TY.smallBold, cursor: 'pointer',
              }}>
                ← Paso anterior
              </button>
            )}
            <div style={{ ...TY.xSmallMedium, color: T.fillTertiary, textAlign: 'center', marginTop: 4 }}>
              En producción, cada paso linkea a la pantalla real (deeplink: <code style={{ color: T.fillSecondary }}>{mission.deeplink}</code>)
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ── Prize Chest button (ongoing) ──────────────────────────────
  const PrizeChestButton = ({ completed, threshold, claimed, onOpen, variant = 'inline' }) => {
    const ready = completed >= threshold && !claimed;
    return (
      <button
        onClick={ready ? onOpen : undefined}
        disabled={!ready}
        style={{
          width: '100%',
          marginTop: variant === 'hero' ? 0 : S.x6,
          marginBottom: variant === 'hero' ? S.x6 : 0,
          padding: 18, borderRadius: R.xLarge,
          background: claimed ? alpha(T.fillSuccess, 0.12)
                     : ready ? G.booster
                     : alpha('#FBFBFB', 0.04),
          border: `1px solid ${claimed ? alpha(T.fillSuccess, 0.35)
                             : ready ? alpha(T.boosterGradEnd, 0.55)
                             : alpha('#FBFBFB', 0.08)}`,
          display: 'flex', alignItems: 'center', gap: 14, cursor: ready ? 'pointer' : 'default',
          textAlign: 'left', fontFamily: FONT,
          transition: 'all 280ms ease',
          animation: ready ? 'dfChestPulse 1.6s ease-in-out infinite' : 'none',
          boxShadow: ready ? `0 12px 30px ${alpha(T.boosterGradEnd, 0.35)}` : 'none',
        }}>
        <div style={{
          width: 56, height: 56, borderRadius: R.medium, flexShrink: 0,
          background: claimed ? alpha(T.fillSuccess, 0.2)
                     : ready ? alpha('#000', 0.15)
                     : alpha('#FBFBFB', 0.06),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <img src={ILLU('illustration_gift.png')} alt="" style={{ width: 42, height: 42, objectFit: 'contain' }}/>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ ...TY.mediumBold, color: ready ? '#0A0712' : T.fillPrimary }}>
            {claimed ? 'Premio reclamado' : ready ? '¡Cofre listo!' : 'Cofre de la semana'}
          </div>
          <div style={{ ...TY.smallMedium, color: ready ? alpha('#0A0712', 0.8) : T.fillSecondary, marginTop: 3 }}>
            {claimed
              ? 'Tu premio está en Recompensas. Vuelve el lunes por un nuevo set.'
              : ready
                ? 'Tocá para girar la ruleta y ver qué te llevaste.'
                : `Completa ${threshold - completed} misión${threshold - completed === 1 ? '' : 'es'} más para desbloquear.`}
          </div>
        </div>
        {ready && (
          <div style={{
            padding: '10px 14px', borderRadius: 999, background: '#0A0712',
            color: '#FFF', ...TY.smallBold,
          }}>
            Abrir →
          </div>
        )}
      </button>
    );
  };

  // ── Prize roulette (horizontal carousel + transparency table) ──
  const PRIZES = [
    { id: 'xp50',      label: '+50 XP',            short: '+50 XP',    color: '#6D3BFF', weight: 30, img: 'assets/roulette-seg-xp0.png' },
    { id: 'booster20', label: 'Booster +20%',      short: '+20%',      color: '#FFB347', weight: 30, img: 'assets/roulette-seg-odds133.png' },
    { id: 'spins10',   label: '10 Giros gratis',   short: '10 Spins',  color: '#4AE291', weight: 20, img: 'assets/roulette-seg-giros.png' },
    { id: 'nothing',   label: 'Intenta la semana entrante', short: 'Nada',  color: '#3A3450', weight: 20, img: 'assets/roulette-seg-perdiste.png' },
    { id: 'creditos50',label: '+50 créditos',      short: '+50',       color: '#58C7FF', weight: 0,  img: 'assets/roulette-seg-creditos50.png' },
  ];
  const TOTAL_WEIGHT = PRIZES.reduce((s, p) => s + p.weight, 0);
  const pickWeighted = () => {
    let r = Math.random() * TOTAL_WEIGHT;
    for (const p of PRIZES) { r -= p.weight; if (r <= 0) return p; }
    return PRIZES[0];
  };

  const PrizeRoulette = ({ open, tier, onClose, onClaim }) => {
    const [phase, setPhase] = uS('idle');
    const [prize, setPrize] = uS(null);
    const trackRef = uR(null);

    const CARD_W = 128;
    const CARD_GAP = 12;
    const PITCH = CARD_W + CARD_GAP;
    const REPS = 10;
    const strip = uR(null);
    if (!strip.current) {
      const out = [];
      for (let r = 0; r < REPS; r++) {
        for (let i = 0; i < PRIZES.length; i++) out.push({ ...PRIZES[i], key: `${r}-${i}`, srcIdx: i });
      }
      strip.current = out;
    }
    const IDLE_IDX = 2 * PRIZES.length;
    const idleOffset = -IDLE_IDX * PITCH;
    const [offsetPx, setOffsetPx] = uS(idleOffset);

    uE(() => { if (!open) { setPhase('idle'); setOffsetPx(idleOffset); setPrize(null); } }, [open]);
    if (!open) return null;

    const spin = () => {
      if (phase === 'spinning') return;
      setPhase('spinning');
      const won = pickWeighted();
      const idx = PRIZES.findIndex(p => p.id === won.id);
      const repIdx = 7;
      const targetSrcIndex = repIdx * PRIZES.length + idx;
      setOffsetPx(-targetSrcIndex * PITCH);
      setTimeout(() => { setPrize(won); setPhase('landed'); }, 4600);
    };

    const tierCfg = TIER_COLORS[tier] || TIER_COLORS.silver;
    const pct = (p) => `${TOTAL_WEIGHT > 0 ? Math.round((p.weight / TOTAL_WEIGHT) * 100) : 0}%`;

    return (
      <div
        onClick={phase === 'spinning' ? undefined : onClose}
        style={{
          // Full-viewport dimmer — SOLID so nothing bleeds through.
          position: 'fixed', inset: 0, zIndex: 140,
          background: 'rgba(5,0,13,0.88)',
          backdropFilter: 'blur(16px) saturate(140%)',
          WebkitBackdropFilter: 'blur(16px) saturate(140%)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 16, overflow: 'auto', fontFamily: FONT,
          animation: 'dfFadeIn 200ms ease-out',
        }}>
        {/* Modal panel — centered, bounded, does NOT share background with dimmer */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 360,
            display: 'flex', flexDirection: 'column',
            position: 'relative', overflow: 'hidden',
            borderRadius: 28,
            padding: `${S.x8}px ${S.x6}px ${S.x8}px`,
            // Panel background — deep violet gradient for theatrical feel.
            background: `radial-gradient(120% 90% at 50% 0%, ${alpha(T.actionPrimaryDefaultGradStart, 0.42)} 0%, #0E0422 55%, #05000D 100%)`,
            border: '0.5px solid rgba(255,255,255,0.12)',
            boxShadow: [
              'inset 0 1px 0 rgba(255,255,255,0.12)',
              '0 24px 60px rgba(0,0,0,0.65)',
              '0 2px 8px rgba(0,0,0,0.4)',
            ].join(', '),
            animation: 'dfSlideUp 320ms cubic-bezier(.2, 1, .3, 1.1)',
          }}>
          {/* Soft rays backdrop — contained inside the panel */}
          <div aria-hidden style={{
            position: 'absolute', inset: 0, borderRadius: 28, overflow: 'hidden',
            backgroundImage: `repeating-conic-gradient(from 0deg at 50% 38%, ${alpha('#FBFBFB', 0.05)} 0deg 6deg, transparent 6deg 14deg)`,
            maskImage: 'radial-gradient(circle at 50% 38%, black 18%, transparent 62%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 38%, black 18%, transparent 62%)',
            pointerEvents: 'none',
          }}/>

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: S.x4, position: 'relative', zIndex: 2 }}>
            <div style={{ ...TY.xSmallBlack, color: T.fillTertiary, letterSpacing: 0.6 }}>
              COFRE · {tierCfg.label}
            </div>
            <button onClick={onClose} aria-label="Cerrar" style={{
              width: 30, height: 30, borderRadius: 999,
              background: alpha('#FBFBFB', 0.08),
              border: '0.5px solid rgba(255,255,255,0.12)',
              color: T.fillPrimary, fontSize: 16, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 0,
            }}>×</button>
          </div>

          {phase !== 'landed' ? (
            <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: S.x6 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ ...TY.xSmallBlack, color: T.fillAccentStart, letterSpacing: 0.6 }}>
                  ¡COMPLETASTE 4 / 5!
                </div>
                <div style={{ ...TY.headlineBase, color: T.fillPrimary, marginTop: 4 }}>
                  Gira la ruleta
                </div>
                <div style={{ ...TY.smallMedium, color: T.fillSecondary, marginTop: 6, padding: `0 ${S.x4}px` }}>
                  Tu recompensa se define por azar. Nivel {tier === 'gold' ? 'Oro' : tier === 'emerald' ? 'Esmeralda' : 'Plata'} tiene acceso a este pool.
                </div>
              </div>

              {/* Carousel */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', height: 200 }}>
                {/* Selector frame */}
                <svg width={CARD_W + 20} height={176} viewBox={`0 0 ${CARD_W + 20} 176`} style={{
                  position: 'absolute', left: '50%', top: '50%',
                  transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 3,
                  filter: `drop-shadow(0 0 18px ${alpha(tierCfg.accent, 0.55)}) drop-shadow(0 0 36px ${alpha(tierCfg.accent, 0.35)})`,
                }}>
                  <rect x="2" y="2" width={CARD_W + 16} height={172} rx="22" ry="22"
                    fill="none" stroke={tierCfg.accent} strokeWidth="3"/>
                </svg>
                {/* Pointer */}
                <div style={{
                  position: 'absolute', left: '50%', top: 'calc(50% + 92px)',
                  transform: 'translateX(-50%)', width: 0, height: 0,
                  borderLeft: '10px solid transparent', borderRight: '10px solid transparent',
                  borderTop: `14px solid ${T.fillPrimary}`,
                  filter: `drop-shadow(0 4px 8px ${alpha('#000', 0.5)})`, zIndex: 4,
                }}/>
                {/* Track */}
                <div ref={trackRef} style={{
                  position: 'absolute', left: '50%', top: '50%',
                  transform: `translate(calc(-${CARD_W/2}px + ${offsetPx}px), -50%)`,
                  transition: phase === 'spinning' ? 'transform 4.6s cubic-bezier(.12,.82,.25,1)' : 'none',
                  display: 'flex', gap: CARD_GAP, alignItems: 'center', willChange: 'transform',
                }}>
                  {strip.current.map((p) => (
                    <div key={p.key} style={{
                      width: CARD_W, height: 160, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <img src={p.img} alt={p.label}
                        style={{ width: '100%', height: '100%', objectFit: 'contain',
                          filter: `drop-shadow(0 6px 12px ${alpha('#000', 0.4)})` }}/>
                    </div>
                  ))}
                </div>
                {/* Edge fades — match panel background */}
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 60, zIndex: 2,
                  background: 'linear-gradient(90deg, #0E0422 0%, transparent 100%)', pointerEvents: 'none' }}/>
                <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 60, zIndex: 2,
                  background: 'linear-gradient(270deg, #0E0422 0%, transparent 100%)', pointerEvents: 'none' }}/>
              </div>

              {/* Spin CTA */}
              <div>
                <button onClick={spin} disabled={phase === 'spinning'} style={{
                  width: '100%', padding: '16px 20px', borderRadius: 999,
                  background: phase === 'spinning' ? alpha('#FBFBFB', 0.08) : G.fillAccent,
                  color: phase === 'spinning' ? T.fillSecondary : '#0A0712',
                  border: 'none', ...TY.largeBlack, cursor: phase === 'spinning' ? 'default' : 'pointer',
                  boxShadow: phase === 'spinning' ? 'none' : `0 10px 24px ${alpha(T.fillAccentStart, 0.35)}`,
                  fontFamily: FONT, letterSpacing: 0.3,
                }}>
                  {phase === 'spinning' ? 'Girando...' : '¡Girar!'}
                </button>
                <div style={{ ...TY.xSmallMedium, color: T.fillTertiary, textAlign: 'center', marginTop: 10 }}>
                  Tenés 7 días para reclamar tu recompensa
                </div>
              </div>
            </div>
          ) : (
            /* Landed */
            <div style={{ position: 'relative', zIndex: 2,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              padding: `${S.x4}px 0 0`, textAlign: 'center' }}>
              <div style={{
                width: 170, height: 210, position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'dfPulse 2s ease-in-out infinite',
                marginBottom: S.x4,
              }}>
                <div style={{ position: 'absolute', inset: -36,
                  background: `radial-gradient(circle, ${alpha(T.fillAccentStart, 0.4)}, transparent 65%)`,
                  filter: 'blur(10px)' }}/>
                <img src={prize.img} alt={prize.label}
                  style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative',
                    filter: `drop-shadow(0 10px 24px ${alpha(T.fillAccentStart, 0.5)})` }}/>
              </div>
              <div style={{ ...TY.xSmallBlack, color: T.fillAccentStart, letterSpacing: 0.6 }}>
                {prize.id === 'nothing' ? 'SIN SUERTE ESTA VEZ' : '¡GANASTE!'}
              </div>
              <div style={{ ...TY.headlineBase, color: T.fillPrimary, marginTop: 4 }}>
                {prize.label}
              </div>
              <div style={{ ...TY.smallMedium, color: T.fillSecondary, marginTop: 10, maxWidth: 280 }}>
                {prize.id === 'nothing'
                  ? 'Vuelve el próximo lunes por otra oportunidad.'
                  : 'Tu premio se acredita al reclamar. Vence en 7 días.'}
              </div>
              <button onClick={() => onClaim(prize)} style={{
                width: '100%', marginTop: S.x8, padding: '16px 20px', borderRadius: 999,
                background: G.actionPrimary, color: '#FFF', border: 'none',
                ...TY.mediumBold, cursor: 'pointer', fontFamily: FONT,
                boxShadow: `0 10px 24px ${alpha(T.actionPrimaryDefaultGradStart, 0.45)}`,
              }}>
                {prize.id === 'nothing' ? 'Cerrar' : 'Reclamar premio'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── Graduation with confetti burst + persistent exit ──────────
  const GraduationScreen = ({ visible, tier, onContinue }) => {
    const [phase, setPhase] = uS(0);
    uE(() => {
      if (!visible) { setPhase(0); return; }
      const t1 = setTimeout(() => setPhase(1), 400);
      const t2 = setTimeout(() => setPhase(2), 1200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [visible]);
    if (!visible) return null;
    const colors = [T.fillAccentStart, T.boosterGradEnd, T.freeBetGradStart, T.fillSuccess];
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 150,
        background: `radial-gradient(circle at 50% 30%, ${alpha(T.actionPrimaryDefaultGradEnd, 0.4)}, ${T.backgroundApp} 70%)`,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: S.x12, textAlign: 'center', overflow: 'hidden', fontFamily: FONT,
      }}>
        {phase >= 1 && [...Array(22)].map((_, i) => {
          const angle = (i / 22) * 360;
          const dist = 120 + (i % 3) * 40;
          return (
            <div key={i} style={{
              position: 'absolute', top: '35%', left: '50%',
              width: 8, height: 12, background: colors[i % colors.length],
              borderRadius: 2, transform: `translate(-50%, -50%) rotate(${angle}deg)`,
              animation: `dfConfetti 1.6s ease-out ${i * 0.02}s forwards`,
              '--dist': `${dist}px`, '--angle': `${angle}deg`,
            }}/>
          );
        })}

        <div style={{
          width: 140, height: 140, borderRadius: '50%',
          background: G.actionPrimary,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 20px 60px ${alpha(T.actionPrimaryDefaultGradStart, 0.5)}`,
          transform: phase >= 1 ? 'scale(1)' : 'scale(0.3)',
          transition: 'transform 0.6s cubic-bezier(.2,1.3,.4,1.2)',
          fontSize: 72,
        }}>
          🎓
        </div>

        <div style={{
          ...TY.xSmallBlack, color: T.fillAccentStart, letterSpacing: 1,
          marginTop: S.x10, opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(8px)', transition: 'all 0.5s',
        }}>
          ¡GRADUADO!
        </div>
        <div style={{
          ...TY.headlineLarge, color: T.fillPrimary, marginTop: 8, maxWidth: 320,
          opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? 'translateY(0)' : 'translateY(12px)',
          transition: 'all 0.5s 0.1s',
        }}>
          Dominaste lo básico
        </div>
        <div style={{
          ...TY.baseRegular, color: T.fillSecondary,
          marginTop: S.x4, maxWidth: 320, opacity: phase >= 2 ? 1 : 0, transition: 'all 0.5s 0.2s',
        }}>
          Desde ahora desbloqueás las <b style={{ color: T.fillPrimary }}>Misiones Semanales</b> con cofres de premios cada lunes.
        </div>

        <div style={{ marginTop: S.x10, width: '100%', maxWidth: 320,
          opacity: phase >= 2 ? 1 : 0, transition: 'opacity 0.4s 0.4s' }}>
          <button onClick={onContinue} style={{
            width: '100%', padding: '16px 20px', borderRadius: R.base,
            background: G.actionPrimary, color: '#FFF', border: 'none',
            ...TY.mediumBold, cursor: 'pointer', fontFamily: FONT,
            boxShadow: `0 12px 30px ${alpha(T.actionPrimaryDefaultGradStart, 0.4)}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            Ver mis semanales <span style={{ fontSize: 18 }}>→</span>
          </button>
        </div>
      </div>
    );
  };

  // ── Toast ─────────────────────────────────────────────────────
  const Toast = ({ toast }) => {
    if (!toast) return null;
    return (
      <div style={{
        position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)',
        background: T.backgroundApp, color: T.fillPrimary,
        border: `1px solid ${alpha('#FBFBFB', 0.08)}`,
        padding: '10px 16px', borderRadius: 999, ...TY.smallBold, zIndex: 160,
        boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', gap: 8,
        animation: 'dfToastIn 220ms ease-out', maxWidth: 380, fontFamily: FONT,
      }}>
        <span style={{ fontSize: 16 }}>{toast.icon || '✨'}</span>
        <span>{toast.text}</span>
      </div>
    );
  };

  Object.assign(window, { MissionDetailSheet, FollowAlong, PrizeChestButton, PrizeRoulette, GraduationScreen, Toast });
})();
