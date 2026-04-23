// Mission Detail (Onboardinho popup) + Graduation celebration + Prize Roulette
const { useState: uS, useEffect: uE, useRef: uR } = React;

// ── Mission Detail Sheet ──────────────────────────────────────
const MissionDetailSheet = ({ mission, groupId, open, onClose, onStart, state }) => {
  if (!mission) return null;
  const accent = window.GROUP_ACCENTS[groupId];
  const isDone = state === 'done';
  return (
    <DFBottomSheet open={open} onClose={onClose}>
      <div style={{ padding: `0 ${window.DF.spacing.x8}px ${window.DF.spacing.x10}px` }}>
        {/* hero */}
        <div style={{
          height: 160, borderRadius: window.DF.radius.large,
          background: accent.grad,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden', marginBottom: window.DF.spacing.x8,
        }}>
          <div style={{ position: 'absolute', inset: 0,
            background: `radial-gradient(circle at 50% 50%, ${window.DF.a('#FFFFFF', 0.2)}, transparent 70%)` }}/>
          <img src={window.ILLU(mission.illustration)} style={{ width: 120, height: 120, objectFit: 'contain', position: 'relative' }}/>
          {isDone && (
            <div style={{
              position: 'absolute', top: 12, right: 12,
              background: window.DF.theme.fillSuccess, color: '#000',
              padding: '4px 10px', borderRadius: 999, ...window.DF.type.xSmallBlack,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <DFIcon name="check" size={12} color="#000"/>COMPLETADA
            </div>
          )}
        </div>

        <div style={{ ...window.DF.type.xSmallBlack, color: window.DF.theme.fillTertiary, letterSpacing: 0.6 }}>
          {accent.label} · MISIÓN {mission.id}
        </div>
        <div style={{ ...window.DF.type.headlineBase, color: window.DF.theme.fillPrimary, marginTop: 4 }}>
          {mission.title}
        </div>
        <div style={{ ...window.DF.type.mediumRegular, color: window.DF.theme.fillSecondary, marginTop: window.DF.spacing.x4 }}>
          {mission.desc}
        </div>

        {/* XP pill */}
        <div style={{ display: 'flex', gap: 8, marginTop: window.DF.spacing.x6 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 999,
            background: window.DF.gradients.fillAccentOpacity,
            border: `1px solid ${window.DF.a(window.DF.theme.fillAccentStart, 0.3)}`,
          }}>
            <DFIcon name="boltFilled" size={14} color={window.DF.theme.fillAccentStart}/>
            <span style={{ ...window.DF.type.smallBlack, color: window.DF.theme.fillAccentStart }}>
              +{mission.xp} XP
            </span>
          </div>
          {isDone && (
            <DFPill variant="success" icon="check">Ganada</DFPill>
          )}
        </div>

        {/* Rules */}
        <div style={{ marginTop: window.DF.spacing.x8, padding: window.DF.spacing.x6,
          background: window.DF.a('#FBFBFB', 0.04), borderRadius: window.DF.radius.base,
          border: `1px solid ${window.DF.a('#FBFBFB', 0.06)}` }}>
          <div style={{ ...window.DF.type.smallBlack, color: window.DF.theme.fillPrimary, marginBottom: 8, letterSpacing: 0.3 }}>
            CÓMO CUENTA
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {mission.rules.map((r, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 6, height: 6, borderRadius: 999, background: accent.solid, marginTop: 7, flexShrink: 0 }}/>
                <div style={{ ...window.DF.type.smallMedium, color: window.DF.theme.fillSecondary }}>{r}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: window.DF.spacing.x8, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {isDone ? (
            <DFButton variant="secondary" onClick={onClose}>Ver otras misiones</DFButton>
          ) : (
            <>
              <DFButton onClick={onStart} trailing="arrowRight">{mission.cta}</DFButton>
              <DFButton variant="ghost" onClick={onClose}>Más tarde</DFButton>
            </>
          )}
        </div>
      </div>
    </DFBottomSheet>
  );
};

// ── Graduation Celebration ────────────────────────────────────
const GraduationScreen = ({ onContinue }) => {
  const [phase, setPhase] = uS(0);
  uE(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1400);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: `radial-gradient(circle at 50% 30%, ${window.DF.a(window.DF.theme.actionPrimaryDefaultGradEnd, 0.4)}, ${window.DF.theme.backgroundApp} 70%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: window.DF.spacing.x12, textAlign: 'center',
      overflow: 'hidden',
    }}>
      {/* confetti bursts */}
      {phase >= 1 && [...Array(20)].map((_, i) => {
        const colors = [window.DF.theme.fillAccentStart, window.DF.theme.boosterGradEnd, window.DF.theme.freeBetGradStart, window.DF.theme.fillSuccess];
        const angle = (i / 20) * 360;
        const dist = 120 + (i % 3) * 40;
        return (
          <div key={i} style={{
            position: 'absolute', top: '35%', left: '50%',
            width: 8, height: 12, background: colors[i % colors.length],
            borderRadius: 2, transform: `translate(-50%, -50%) rotate(${angle}deg)`,
            animation: `dfConfetti 1.5s ease-out ${i * 0.02}s forwards`,
            '--dist': `${dist}px`, '--angle': `${angle}deg`,
          }}/>
        );
      })}

      <div style={{
        width: 140, height: 140, borderRadius: '50%',
        background: window.DF.gradients.actionPrimary,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 20px 60px ${window.DF.a(window.DF.theme.actionPrimaryDefaultGradStart, 0.5)}`,
        transform: phase >= 1 ? 'scale(1)' : 'scale(0.3)',
        transition: 'transform 0.6s cubic-bezier(.2,1.3,.4,1.2)',
      }}>
        <DFIcon name="trophy" size={72} color="#fff"/>
      </div>

      <div style={{
        ...window.DF.type.xSmallBlack, color: window.DF.theme.fillAccentStart,
        letterSpacing: 1, marginTop: window.DF.spacing.x10,
        opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? 'translateY(0)' : 'translateY(8px)',
        transition: 'all 0.5s',
      }}>
        ¡GRADUADO!
      </div>
      <div style={{
        ...window.DF.type.headlineLarge, color: window.DF.theme.fillPrimary,
        marginTop: 8, maxWidth: 320,
        opacity: phase >= 2 ? 1 : 0, transform: phase >= 2 ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.5s 0.1s',
      }}>
        Dominaste lo básico
      </div>
      <div style={{
        ...window.DF.type.baseRegular, color: window.DF.theme.fillSecondary,
        marginTop: window.DF.spacing.x4, maxWidth: 320,
        opacity: phase >= 2 ? 1 : 0,
        transition: 'all 0.5s 0.2s',
      }}>
        A partir de ahora desbloqueas las <b style={{ color: window.DF.theme.fillPrimary }}>Misiones Semanales</b> con cofres de premios cada semana.
      </div>

      <div style={{
        marginTop: window.DF.spacing.x10, width: '100%', maxWidth: 320,
        opacity: phase >= 2 ? 1 : 0, transition: 'opacity 0.4s 0.4s',
      }}>
        <DFButton onClick={onContinue} trailing="arrowRight">Ver mis misiones semanales</DFButton>
      </div>
    </div>
  );
};

// ── Prize Roulette (horizontal carousel) ──────────────────────
// Horizontal strip of bucket-shaped cards; cards slide past a centered highlight frame.
// When it stops, the centered card has the neon yellow/cyan border and a white triangle pointer below.
const PRIZES = [
  { id: 'giros',    label: 'Giros Grátis', amount: '5',     img: 'assets/roulette-seg-giros.png',     type: 'free-spins' },
  { id: 'coroas',   label: 'Coroas',        amount: '100',   img: 'assets/roulette-seg-coroas100.png', type: 'coins' },
  { id: 'odds',     label: 'Odds',          amount: '1.33',  img: 'assets/roulette-seg-odds133.png',   type: 'odds-boost' },
  { id: 'creditos', label: 'Créditos',      amount: '50',    img: 'assets/roulette-seg-creditos50.png',type: 'credits' },
  { id: 'perdiste', label: 'Não foi dessa vez', amount: '',   img: 'assets/roulette-seg-perdiste.png',  type: 'miss' },
  { id: 'xp',       label: 'XP',            amount: '0',     img: 'assets/roulette-seg-xp0.png',       type: 'xp' },
];
// Probability weights (higher = more likely)
const PRIZE_WEIGHTS = [0.20, 0.22, 0.10, 0.20, 0.18, 0.10];

// We build a long list that repeats the prizes for the scroll illusion
const buildStrip = (reps = 8) => {
  const out = [];
  for (let r = 0; r < reps; r++) {
    for (let i = 0; i < PRIZES.length; i++) out.push({ ...PRIZES[i], key: `${r}-${i}`, srcIdx: i });
  }
  return out;
};

const PrizeRoulette = ({ open, onClose }) => {
  const [phase, setPhase] = uS('idle'); // idle, spinning, landed
  const [prize, setPrize] = uS(null);
  const [stripItems] = uS(() => buildStrip(10));
  const trackRef = uR(null);

  const CARD_W = 128;     // per-card width
  const CARD_GAP = 12;
  const PITCH = CARD_W + CARD_GAP;

  // Idle state: center on card at index IDLE_IDX (prize 0, "5 Giros Grátis")
  const IDLE_IDX = 2 * PRIZES.length; // sits in middle of strip, rep 2, prize 0
  const idleOffset = -IDLE_IDX * PITCH;
  const [offsetPx, setOffsetPx] = uS(idleOffset);

  uE(() => { if (!open) { setPhase('idle'); setOffsetPx(idleOffset); setPrize(null); } }, [open]);

  const spin = () => {
    if (phase === 'spinning') return;
    setPhase('spinning');
    // Pick winning prize by weight
    const r = Math.random();
    let acc = 0, idx = 0;
    for (let i = 0; i < PRIZES.length; i++) {
      acc += PRIZE_WEIGHTS[i];
      if (r <= acc) { idx = i; break; }
    }
    // Land on a later repetition so it scrolls a long distance
    const repIdx = 7;
    const targetSrcIndex = repIdx * PRIZES.length + idx;
    const target = -targetSrcIndex * PITCH;
    setOffsetPx(target);
    setTimeout(() => { setPrize(PRIZES[idx]); setPhase('landed'); }, 4600);
  };

  if (!open) return null;

  const T_ = window.DF.theme;
  const SP_ = window.DF.spacing;
  const TY_ = window.DF.type;
  const a_ = window.DF.a;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: `radial-gradient(ellipse at 50% 45%, ${a_(T_.actionPrimaryDefaultGradStart, 0.35)} 0%, #05000D 75%)`,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Rays backdrop */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `repeating-conic-gradient(from 0deg at 50% 55%,
          ${a_('#FBFBFB', 0.04)} 0deg 6deg, transparent 6deg 14deg)`,
        maskImage: 'radial-gradient(circle at 50% 55%, black 20%, transparent 65%)',
        WebkitMaskImage: 'radial-gradient(circle at 50% 55%, black 20%, transparent 65%)',
        pointerEvents: 'none',
      }}/>

      {/* Top chrome */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: `${SP_.x10}px ${SP_.x8}px ${SP_.x4}px`, position: 'relative' }}>
        <div style={{ width: 36 }}/>
        <div style={{ ...TY_.xSmallBlack, color: T_.fillTertiary, letterSpacing: 0.6 }}>
          COFRE DE LA SEMANA
        </div>
        <button onClick={onClose} style={{
          width: 36, height: 36, borderRadius: 999, background: 'transparent',
          border: 'none', color: T_.fillPrimary, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <DFIcon name="close" size={20}/>
        </button>
      </div>

      {phase !== 'landed' ? (
        <>
          <div style={{ textAlign: 'center', marginTop: SP_.x6, position: 'relative' }}>
            <div style={{ ...TY_.xSmallBlack, color: T_.fillAccentStart, letterSpacing: 0.6 }}>
              ¡COMPLETASTE 4/5!
            </div>
            <div style={{ ...TY_.headlineBase, color: T_.fillPrimary, marginTop: 4 }}>
              Gira la ruleta
            </div>
            <div style={{ ...TY_.smallMedium, color: T_.fillSecondary, marginTop: 6, padding: `0 ${SP_.x10}px` }}>
              Tu recompensa se define por azar
            </div>
          </div>

          {/* Carousel */}
          <div style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', marginTop: SP_.x8,
          }}>
            {/* Selector frame — border only, so centered card stays visible underneath */}
            <svg
              width={CARD_W + 20} height={176}
              viewBox={`0 0 ${CARD_W + 20} 176`}
              style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none', zIndex: 3,
                filter: `drop-shadow(0 0 18px ${a_(T_.fillAccentStart, 0.55)}) drop-shadow(0 0 36px ${a_(T_.fillAccentEnd, 0.35)})`,
                overflow: 'visible',
              }}>
              <defs>
                <linearGradient id="rouletteFrameGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={T_.fillAccentEnd}/>
                  <stop offset="100%" stopColor={T_.fillAccentStart}/>
                </linearGradient>
              </defs>
              <rect
                x="2" y="2"
                width={CARD_W + 16} height={172}
                rx="22" ry="22"
                fill="none"
                stroke="url(#rouletteFrameGrad)"
                strokeWidth="3"
              />
            </svg>
            {/* White triangle pointer below the frame */}
            <div style={{
              position: 'absolute', left: '50%', top: 'calc(50% + 92px)',
              transform: 'translateX(-50%)',
              width: 0, height: 0,
              borderLeft: '12px solid transparent',
              borderRight: '12px solid transparent',
              borderTop: `16px solid ${T_.fillPrimary}`,
              filter: `drop-shadow(0 4px 8px ${a_('#000', 0.5)})`,
              zIndex: 4,
            }}/>

            {/* Scrolling track — first card's CENTER is anchored at x=0, then we translate by offsetPx */}
            <div
              ref={trackRef}
              style={{
                position: 'absolute', left: '50%', top: '50%',
                transform: `translate(calc(-${CARD_W/2}px + ${offsetPx}px), -50%)`,
                transition: phase === 'spinning'
                  ? 'transform 4.6s cubic-bezier(.12,.82,.25,1)'
                  : 'none',
                display: 'flex', gap: CARD_GAP, alignItems: 'center',
                willChange: 'transform',
              }}>
              {stripItems.map((p) => (
                <div key={p.key} style={{
                  width: CARD_W, height: 160, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <img src={p.img} alt={p.label}
                    style={{ width: '100%', height: '100%', objectFit: 'contain',
                      filter: `drop-shadow(0 6px 12px ${a_('#000', 0.4)})` }}/>
                </div>
              ))}
            </div>

            {/* Edge fades */}
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: 60, zIndex: 2,
              background: 'linear-gradient(90deg, #05000D 0%, transparent 100%)',
              pointerEvents: 'none',
            }}/>
            <div style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: 60, zIndex: 2,
              background: 'linear-gradient(270deg, #05000D 0%, transparent 100%)',
              pointerEvents: 'none',
            }}/>
          </div>

          {/* Spin CTA */}
          <div style={{ padding: `0 ${SP_.x8}px ${SP_.x10}px`, position: 'relative', zIndex: 5 }}>
            <DFButton onClick={spin} disabled={phase === 'spinning'}
              trailing={phase === 'spinning' ? null : 'sparkle'}>
              {phase === 'spinning' ? 'Girando...' : '¡Gira!'}
            </DFButton>
            <div style={{ ...TY_.xSmallMedium, color: T_.fillTertiary, textAlign: 'center', marginTop: 10 }}>
              Tienes 7 días para reclamar tu recompensa
            </div>
          </div>
        </>
      ) : (
        /* Landed / Won */
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', padding: SP_.x8, position: 'relative' }}>
          {/* Big winning card */}
          <div style={{
            width: 200, height: 250, position: 'relative',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            animation: 'dfPulse 2s ease-in-out infinite',
          }}>
            <div style={{
              position: 'absolute', inset: -40,
              background: `radial-gradient(circle, ${a_(T_.fillAccentStart, 0.4)}, transparent 65%)`,
              filter: 'blur(8px)',
            }}/>
            <img src={prize.img} style={{ width: '100%', height: '100%', objectFit: 'contain', position: 'relative',
              filter: `drop-shadow(0 10px 24px ${a_(T_.fillAccentStart, 0.5)})` }}/>
          </div>

          <div style={{ ...TY_.xSmallBlack, color: T_.fillAccentStart, letterSpacing: 0.6, marginTop: SP_.x8 }}>
            ¡GANASTE!
          </div>
          <div style={{ ...TY_.headlineLarge, color: T_.fillPrimary, marginTop: 4, textAlign: 'center', lineHeight: 1.15 }}>
            {prize.amount} {prize.label}
          </div>
          <div style={{ ...TY_.mediumMedium, color: T_.fillSecondary, marginTop: 16, textAlign: 'center', maxWidth: 280 }}>
            Tu premio ya está en tu cartera. Tienes 7 días para usarlo.
          </div>

          <div style={{ marginTop: SP_.x10, width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <DFButton onClick={onClose}>Reclamar premio</DFButton>
            <DFButton variant="ghost" onClick={onClose}>Ver en mi cartera</DFButton>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, { MissionDetailSheet, GraduationScreen, PrizeRoulette });
