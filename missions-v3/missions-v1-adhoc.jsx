// Missions V1 ad-hoc — new experience layered on top of Loyalty.
// Hardened pass: hero card pattern, cashback as the visual anchor, themed gradients
// per vertical, humanized countdown, undo-toast activation, won-feeling completed state,
// accordion eligibility, empty-state bridge to Recompensas.
(function () {
  const { useState, useEffect, useMemo, useRef } = React;
  const { theme: T, spacing: S, radius: R, type: TY, gradients: G, a: alpha, font: FONT } = window.DF;
  const ILLU = window.ILLU;
  const ProgressBar = window.ProgressBar;
  const V1 = window.MISSIONS_V1_DATA;

  // ── Constants ────────────────────────────────────────────────
  const STATE_COLOR = {
    available: T.fillAccentStart,                        // lemon
    in_progress: T.actionPrimaryDefaultGradStart,        // violet
    completed: T.fillSuccess,                            // emerald
    expired: T.fillTertiary,                             // gray (muted)
  };

  // Theme map per vertical — gradient colors for hero + decorative glyphs.
  const THEMES = {
    soccer:  { tone: '#0F2A1F',  glow: '#34D399', glyph: '⚽',  pattern: 'soccer'  },
    slots:   { tone: '#2A2010',  glow: '#FFB020', glyph: '🎰', pattern: 'slots'   },
    casino:  { tone: '#2A0F22',  glow: '#FF6B9F', glyph: '🃏', pattern: 'cards'   },
    mixed:   { tone: '#0F1A2A',  glow: '#5BB7FF', glyph: '⚡', pattern: 'sparks'  },
  };

  // ── Helpers ──────────────────────────────────────────────────
  // MX-only — currency unit is implicit. Don't render "MXN".
  const fmtCurrency = (amount) => `$${(amount || 0).toLocaleString('es-MX')}`;
  const fmtAmountOnly = (amount) => `$${(amount || 0).toLocaleString('es-MX')}`;

  // Humanized countdown — natural language, not technical.
  const fmtCountdownHuman = (secondsLeft) => {
    if (secondsLeft <= 0) return 'Finalizada';
    if (secondsLeft < 60 * 60) {
      const mins = Math.max(1, Math.round(secondsLeft / 60));
      return `${mins} min`;
    }
    if (secondsLeft < 24 * 3600) {
      const hours = Math.round(secondsLeft / 3600);
      return hours <= 1 ? 'Cierra en 1 hora' : `Cierra en ${hours} horas`;
    }
    if (secondsLeft < 48 * 3600) return 'Cierra mañana';
    const days = Math.floor(secondsLeft / 86400);
    return `${days} días`;
  };

  // ── Themed decoration overlay (SVG pattern + faded glyph) ─────
  const ThemedBackdrop = ({ theme, intensity = 1 }) => {
    const t = THEMES[theme] || THEMES.soccer;
    return (
      <>
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(135deg, ${alpha(t.tone, 0.95 * intensity)} 0%, ${alpha(T.backgroundApp, 0.9)} 75%)`,
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 100% 0%, ${alpha(t.glow, 0.18 * intensity)}, transparent 55%)`,
        }}/>
        {/* Faded decorative glyph bottom-right */}
        <div style={{
          position: 'absolute', right: -20, bottom: -32,
          fontSize: 180, opacity: 0.06,
          transform: 'rotate(-8deg)',
          pointerEvents: 'none',
        }}>{t.glyph}</div>
        {/* Subtle pattern lines */}
        {t.pattern === 'soccer' && (
          <svg style={{ position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none' }}
            viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="pitch" width="60" height="60" patternUnits="userSpaceOnUse">
                <line x1="0" y1="30" x2="60" y2="30" stroke={t.glow} strokeWidth="0.6"/>
                <line x1="30" y1="0" x2="30" y2="60" stroke={t.glow} strokeWidth="0.6"/>
                <circle cx="30" cy="30" r="8" stroke={t.glow} strokeWidth="0.6" fill="none"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#pitch)"/>
          </svg>
        )}
        {t.pattern === 'slots' && (
          <svg style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}
            viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="slots" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="2.5" fill={t.glow}/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#slots)"/>
          </svg>
        )}
        {t.pattern === 'cards' && (
          <svg style={{ position: 'absolute', inset: 0, opacity: 0.09, pointerEvents: 'none' }}
            viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="cards" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M20 14 C 20 8, 12 8, 12 14 C 12 8, 4 8, 4 14 C 4 24, 12 30, 12 30 C 12 30, 20 24, 20 14 Z"
                  fill={t.glow}/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cards)"/>
          </svg>
        )}
        {t.pattern === 'sparks' && (
          <svg style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}
            viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="sparks" width="80" height="80" patternUnits="userSpaceOnUse">
                <path d="M40 20 L44 36 L60 40 L44 44 L40 60 L36 44 L20 40 L36 36 Z" fill={t.glow}/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#sparks)"/>
          </svg>
        )}
      </>
    );
  };

  // ── Live countdown chip ──────────────────────────────────────
  const CountdownChip = ({ endsAt, compact = false }) => {
    const [now, setNow] = useState(Date.now());
    useEffect(() => {
      const id = setInterval(() => setNow(Date.now()), 30 * 1000);
      return () => clearInterval(id);
    }, []);
    const seconds = Math.max(0, Math.floor((endsAt - now) / 1000));
    const isCritical = seconds < 1 * 3600;       // last hour: red
    const isWarning = seconds < 24 * 3600;       // last day: tonal warning
    const color = isCritical ? (T.fillError || '#FF6B6B') : isWarning ? T.fillAccentStart : T.fillSecondary;
    const bg = isCritical ? alpha(T.fillError || '#FF4D4F', 0.18)
             : isWarning ? alpha(T.fillAccentStart, 0.14)
             : alpha('#FBFBFB', 0.08);
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: compact ? '2px 7px' : '4px 9px', borderRadius: 999,
        background: bg, ...TY.xSmallBold, color,
      }}>
        ⏱ {fmtCountdownHuman(seconds)}
      </span>
    );
  };

  // ── Premio display (the visual anchor of every card) ────────
  // Big amount, success/lemon accent, no redundant "Premio" label cluttering it.
  const PremioDisplay = ({ amount, size = 'md', muted = false, strikethrough = false, won = false }) => {
    const sizes = {
      sm: { num: TY.smallBold,   icon: 16, sub: 10 },
      md: { num: TY.largeBold,   icon: 22, sub: 11 },
      lg: { num: TY.headlineBase,icon: 28, sub: 12 },
      xl: { num: TY.headlineLarge,icon: 36, sub: 13 },
    }[size];
    const accentColor = won ? T.fillSuccess : muted ? T.fillTertiary : T.fillAccentStart;
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <img src={ILLU('illustration_draftea_coin.png')} alt=""
          style={{
            width: sizes.icon, height: sizes.icon, objectFit: 'contain',
            filter: muted ? 'grayscale(0.6) opacity(0.55)' : 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
          }}/>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{
            ...sizes.num, color: accentColor,
            textDecoration: strikethrough ? 'line-through' : 'none',
            lineHeight: 1.1,
          }}>
            +{fmtAmountOnly(amount)}
          </span>
          <span style={{
            fontSize: sizes.sub, fontWeight: 700, letterSpacing: 0.6,
            color: muted ? T.fillTertiary : alpha(accentColor, 0.85),
            textTransform: 'uppercase', lineHeight: 1.1,
          }}>
            Premio
          </span>
        </div>
      </div>
    );
  };

  // ── Hero mission card (top, prominent) ────────────────────────
  const HeroMissionCard = ({ mission, onTap, onActivate }) => {
    const isAvailable = mission.state === 'available';
    const isInProgress = mission.state === 'in_progress';
    const isCompleted = mission.state === 'completed';
    const isExpired = mission.state === 'expired';
    const accent = STATE_COLOR[mission.state];

    return (
      <div onClick={() => onTap(mission)} role="button" tabIndex={0}
        style={{
          width: '100%', cursor: 'pointer', fontFamily: FONT, position: 'relative',
          borderRadius: R.xLarge, overflow: 'hidden',
          border: `1px solid ${alpha(accent, 0.35)}`,
          minHeight: 280, marginBottom: S.x4,
          boxShadow: `0 14px 32px ${alpha('#000', 0.45)}`,
          transition: 'transform 160ms ease',
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.995)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
        <ThemedBackdrop theme={mission.theme}/>

        {/* Won banner overlay */}
        {isCompleted && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 4,
            background: T.fillSuccess, zIndex: 2,
          }}/>
        )}

        {/* Countdown / won pill — absolute top-right so the title can start at the top */}
        <div style={{ position: 'absolute', top: 16, right: 16, zIndex: 2 }}>
          {!isCompleted ? (
            <CountdownChip endsAt={mission.endsAt}/>
          ) : (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 10px', borderRadius: 999,
              background: alpha(T.fillSuccess, 0.22),
              ...TY.xSmallBold, color: T.fillSuccess,
            }}>
              ✓ Ya en tu cuenta
            </span>
          )}
        </div>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1, padding: `${S.x6}px ${S.x6}px ${S.x6}px` }}>
          {/* Title — reserves right padding so the absolute countdown chip never overlaps */}
          <div style={{
            ...TY.headlineBase, color: T.fillPrimary, marginBottom: 6,
            lineHeight: 1.2, paddingRight: 92,
          }}>
            {mission.title}
          </div>

          {/* Subtitle */}
          <div style={{ ...TY.smallMedium, color: T.fillSecondary, lineHeight: 1.45, marginBottom: S.x6 }}>
            {mission.subtitle}
          </div>

          {/* Floating illustration */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: `${S.x4}px 0`,
          }}>
            <img src={ILLU(mission.image)} alt=""
              style={{
                width: 110, height: 110, objectFit: 'contain',
                filter: `drop-shadow(0 14px 30px ${alpha(THEMES[mission.theme].glow, 0.45)})`,
              }}/>
          </div>

          {/* Progress (only In progress) */}
          {isInProgress && (
            <div style={{ marginBottom: S.x4 }}>
              <ProgressBar
                value={mission.progress}
                max={mission.qualifying_target}
                height={6}
                fill={G.actionPrimary}/>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ ...TY.xSmallMedium, color: T.fillTertiary }}>
                  Te faltan {fmtCurrency(Math.max(0, mission.qualifying_target - mission.progress))}
                </span>
                <span style={{ ...TY.xSmallBold, color: T.fillPrimary }}>
                  {fmtCurrency(mission.progress)} / {fmtCurrency(mission.qualifying_target)}
                </span>
              </div>
            </div>
          )}

          {/* Stat ladder — stake & premio side by side, both prominent */}
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 14,
            alignItems: 'center',
            paddingTop: S.x4,
            borderTop: `1px solid ${alpha('#FBFBFB', 0.08)}`,
            marginBottom: S.x4,
          }}>
            <div>
              <div style={{ ...TY.xxSmallBold, color: T.fillTertiary, letterSpacing: 0.8, marginBottom: 4 }}>
                APOSTÁ
              </div>
              <div style={{
                fontSize: 30, fontWeight: 900, lineHeight: 1, fontFamily: FONT,
                color: isCompleted || isExpired ? T.fillTertiary : T.fillPrimary,
                textDecoration: isExpired ? 'line-through' : 'none',
              }}>
                {fmtCurrency(mission.qualifying_target)}
              </div>
            </div>
            <div style={{
              color: T.fillTertiary, fontSize: 22, fontWeight: 700,
              paddingTop: 18,
            }}>→</div>
            <div>
              <div style={{
                ...TY.xxSmallBold, letterSpacing: 0.8, marginBottom: 4,
                color: isCompleted ? T.fillSuccess : isExpired ? T.fillTertiary : T.fillAccentStart,
              }}>
                GANÁ DE PREMIO
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <img src={ILLU('illustration_draftea_coin.png')} alt=""
                  style={{
                    width: 26, height: 26, objectFit: 'contain',
                    filter: isExpired
                      ? 'grayscale(0.6) opacity(0.55)'
                      : 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
                  }}/>
                <span style={{
                  fontSize: 30, fontWeight: 900, lineHeight: 1, fontFamily: FONT,
                  color: isCompleted ? T.fillSuccess : isExpired ? T.fillTertiary : T.fillAccentStart,
                  textDecoration: isExpired ? 'line-through' : 'none',
                }}>
                  +{fmtCurrency(mission.reward_amount)}
                </span>
              </div>
            </div>
          </div>

          {/* CTA row */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            {isAvailable && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onActivate(mission); }}
                style={{
                  cursor: 'pointer',
                  background: T.fillAccentStart,
                  border: 'none',
                  borderRadius: 999, padding: '12px 24px',
                  fontFamily: FONT,
                  ...TY.smallBold, color: '#0A0816',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  boxShadow: `0 8px 22px ${alpha(T.fillAccentStart, 0.35)}`,
                }}>
                Activar
                <span style={{ fontSize: 16 }}>›</span>
              </button>
            )}
            {isInProgress && (
              <span style={{ ...TY.smallBold, color: T.fillPrimary,
                display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                Ver detalles <span style={{ fontSize: 16 }}>›</span>
              </span>
            )}
            {isCompleted && (
              <span style={{ ...TY.smallBold, color: T.fillSuccess,
                display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                Ver detalles <span style={{ fontSize: 16 }}>›</span>
              </span>
            )}
            {isExpired && (
              <span style={{ ...TY.smallBold, color: T.fillTertiary,
                display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                Ver detalle <span style={{ fontSize: 16 }}>›</span>
              </span>
            )}
          </div>

        </div>
      </div>
    );
  };

  // ── Compact mission card (secondary list) ─────────────────────
  const CompactMissionCard = ({ mission, onTap, onActivate }) => {
    const isAvailable = mission.state === 'available';
    const isInProgress = mission.state === 'in_progress';
    const isCompleted = mission.state === 'completed';
    const isExpired = mission.state === 'expired';
    const stateColor = STATE_COLOR[mission.state];

    const cardBg = isCompleted ? alpha(T.fillSuccess, 0.06)
                 : isExpired   ? alpha('#FBFBFB', 0.02)
                 :               alpha('#FBFBFB', 0.04);
    const cardBorder = isCompleted ? alpha(T.fillSuccess, 0.28)
                     : isExpired   ? alpha('#FBFBFB', 0.06)
                     :               alpha('#FBFBFB', 0.08);

    return (
      <div onClick={() => onTap(mission)} role="button" tabIndex={0}
        style={{
          width: '100%', cursor: 'pointer', fontFamily: FONT, position: 'relative',
          background: cardBg,
          border: `1px solid ${cardBorder}`,
          borderRadius: R.large, padding: `${S.x4}px ${S.x4}px ${S.x4}px ${S.x6}px`,
          display: 'flex', flexDirection: 'column', gap: S.x3,
          transition: 'transform 140ms ease',
          overflow: 'hidden',
          opacity: isExpired ? 0.7 : 1,
        }}
        onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.995)')}
        onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}>
        {/* Left edge state stripe */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
          background: stateColor,
        }}/>

        <div style={{ display: 'flex', alignItems: 'center', gap: S.x4 }}>
          {/* Floating illustration — no container */}
          <div style={{
            width: 56, height: 56, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <img src={ILLU(mission.image)} alt=""
              style={{
                width: 56, height: 56, objectFit: 'contain',
                filter: `drop-shadow(0 6px 14px ${alpha(THEMES[mission.theme].glow, 0.4)})`,
                opacity: isExpired ? 0.55 : 1,
              }}/>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              {isCompleted && (
                <span style={{
                  ...TY.xxSmallBold, color: T.fillSuccess, letterSpacing: 0.6,
                  padding: '2px 7px', borderRadius: 999,
                  background: alpha(T.fillSuccess, 0.18),
                }}>✓ Ya en tu cuenta</span>
              )}
              {isExpired && (
                <span style={{
                  ...TY.xxSmallBold, color: T.fillTertiary, letterSpacing: 0.6,
                  padding: '2px 7px', borderRadius: 999,
                  background: alpha('#FBFBFB', 0.08),
                }}>✕ {mission.expired_label || 'Vencida'}</span>
              )}
              {!isCompleted && !isExpired && (
                <CountdownChip endsAt={mission.endsAt} compact/>
              )}
            </div>
            <div style={{ ...TY.baseBold, color: T.fillPrimary, marginBottom: 2,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              lineHeight: 1.25,
            }}>
              {mission.title}
            </div>
            <div style={{ ...TY.xSmallMedium, color: T.fillTertiary, lineHeight: 1.4,
              display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {mission.subtitle}
            </div>
          </div>
        </div>

        {/* Progress (in progress only) */}
        {isInProgress && (
          <div>
            <ProgressBar value={mission.progress} max={mission.qualifying_target} height={5} fill={G.actionPrimary}/>
            <div style={{ ...TY.xxSmallBold, color: T.fillTertiary, marginTop: 4, letterSpacing: 0.4 }}>
              Te faltan {fmtCurrency(Math.max(0, mission.qualifying_target - mission.progress))}
            </div>
          </div>
        )}

        {/* Bottom: Premio + CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <PremioDisplay
            amount={mission.reward_amount}
            size="md"
            won={isCompleted}
            muted={isExpired}
            strikethrough={isExpired}/>
          {isAvailable && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onActivate(mission); }}
              style={{
                cursor: 'pointer',
                background: T.fillAccentStart,
                border: 'none',
                borderRadius: 999, padding: '8px 16px',
                fontFamily: FONT,
                ...TY.xSmallBold, color: '#0A0816',
                display: 'inline-flex', alignItems: 'center', gap: 4,
                boxShadow: `0 6px 16px ${alpha(T.fillAccentStart, 0.3)}`,
              }}>
              Activar
              <span style={{ fontSize: 14 }}>›</span>
            </button>
          )}
          {!isAvailable && (
            <span style={{
              ...TY.xSmallBold,
              color: isCompleted ? T.fillSuccess : isExpired ? T.fillTertiary : T.fillPrimary,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              {isCompleted ? 'Ver' : isExpired ? 'Detalle' : 'Continuar'}
              <span style={{ fontSize: 14 }}>›</span>
            </span>
          )}
        </div>
      </div>
    );
  };

  // ── Empty state with bridge to Recompensas ───────────────────
  const EmptyStateBridge = () => (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      padding: `${S.x10}px ${S.x8}px ${S.x6}px`,
    }}>
      <div style={{
        width: 88, height: 88, borderRadius: '50%',
        background: alpha(T.fillAccentStart, 0.1),
        border: `1px solid ${alpha(T.fillAccentStart, 0.25)}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 40, marginBottom: S.x4,
      }}>🎯</div>
      <div style={{ ...TY.largeBold, color: T.fillPrimary, marginBottom: 6 }}>
        Por ahora no hay misiones nuevas
      </div>
      <div style={{ ...TY.smallMedium, color: T.fillTertiary, maxWidth: 300, lineHeight: 1.5, marginBottom: S.x4 }}>
        Mientras tanto, dale un vistazo a los beneficios que ya tenés activos por tu Lealtad.
      </div>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
        ...TY.xSmallBold, color: T.fillAccentStart }}>
        Mirá tus beneficios <span style={{ fontSize: 18 }}>↓</span>
      </div>
    </div>
  );


  // ── Accordion (eligibility) ──────────────────────────────────
  const Accordion = ({ title, children, defaultOpen = false }) => {
    const [open, setOpen] = useState(defaultOpen);
    return (
      <div style={{
        marginBottom: S.x6,
        background: alpha('#FBFBFB', 0.03),
        border: `1px solid ${alpha('#FBFBFB', 0.06)}`,
        borderRadius: R.medium, overflow: 'hidden',
      }}>
        <button onClick={() => setOpen(o => !o)} style={{
          width: '100%', textAlign: 'left', cursor: 'pointer', fontFamily: FONT,
          background: 'transparent', border: 'none',
          padding: '14px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          ...TY.smallBold, color: T.fillPrimary,
        }}>
          <span>{title}</span>
          <span style={{
            transition: 'transform 200ms',
            transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
            fontSize: 16, color: T.fillTertiary,
          }}>›</span>
        </button>
        {open && (
          <div style={{ padding: '0 16px 16px' }}>
            {children}
          </div>
        )}
      </div>
    );
  };

  // ── Mission detail (full-screen overlay) ─────────────────────
  const MissionDetailOverlay = ({ mission, onClose, onActivate, onSimulateCompletion }) => {
    const isAvailable = mission.state === 'available';
    const isInProgress = mission.state === 'in_progress';
    const isCompleted = mission.state === 'completed';
    const isExpired = mission.state === 'expired';

    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: T.backgroundApp, fontFamily: FONT,
        display: 'flex', flexDirection: 'column',
        animation: 'dfFadeIn 200ms ease-out',
      }}>
        {/* Header */}
        <div style={{
          padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${alpha('#FBFBFB', 0.06)}`,
        }}>
          <button onClick={onClose} style={{
            background: 'transparent', border: 'none', color: T.fillPrimary, cursor: 'pointer',
            fontSize: 22, width: 36, height: 36,
          }}>‹</button>
          <span style={{ ...TY.smallBold, color: T.fillPrimary }}>Misión</span>
          <div style={{ width: 36 }}/>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {/* Themed hero */}
          <div style={{ position: 'relative', minHeight: 220, overflow: 'hidden' }}>
            <ThemedBackdrop theme={mission.theme}/>
            <div style={{ position: 'relative', zIndex: 1, padding: `${S.x6}px ${S.x8}px` }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: S.x4 }}>
                {!isCompleted && <CountdownChip endsAt={mission.endsAt}/>}
              </div>

              <div style={{ display: 'flex', gap: S.x4, alignItems: 'center' }}>
                <img src={ILLU(mission.image)} alt=""
                  style={{
                    width: 96, height: 96, objectFit: 'contain', flexShrink: 0,
                    filter: `drop-shadow(0 12px 28px ${alpha(THEMES[mission.theme].glow, 0.5)})`,
                  }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...TY.headlineBase, color: T.fillPrimary, lineHeight: 1.2, marginBottom: 4 }}>
                    {mission.title}
                  </div>
                  <div style={{ ...TY.smallMedium, color: T.fillSecondary, lineHeight: 1.4 }}>
                    {mission.subtitle}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={{ padding: `${S.x6}px ${S.x8}px ${S.x12}px` }}>
            {/* Win banner */}
            {isCompleted && (
              <div style={{
                padding: '12px 16px', borderRadius: R.medium, marginBottom: S.x6,
                background: alpha(T.fillSuccess, 0.16),
                border: `1px solid ${alpha(T.fillSuccess, 0.4)}`,
                color: T.fillSuccess, ...TY.smallBold,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 20 }}>🎉</span>
                <div>
                  <div>¡Misión completada!</div>
                  <div style={{ ...TY.xSmallMedium, color: T.fillSecondary, marginTop: 2 }}>
                    {fmtCurrency(mission.reward_amount)} de Premio en tu cuenta
                  </div>
                </div>
              </div>
            )}

            {/* Expired banner */}
            {isExpired && (
              <div style={{
                padding: '12px 16px', borderRadius: R.medium, marginBottom: S.x6,
                background: alpha('#FBFBFB', 0.06),
                border: `1px solid ${alpha('#FBFBFB', 0.12)}`,
                color: T.fillTertiary, ...TY.smallBold,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 20 }}>✕</span>
                <div>
                  <div>Misión vencida</div>
                  <div style={{ ...TY.xSmallMedium, color: T.fillSecondary, marginTop: 2 }}>
                    {mission.expired_label || 'Cerró antes de alcanzar el objetivo'}
                  </div>
                </div>
              </div>
            )}

            {/* Premio hero */}
            <div style={{
              padding: S.x4, borderRadius: R.large, marginBottom: S.x6,
              background: G.actionPrimaryOpacity16,
              border: `1px solid ${alpha(T.actionPrimaryDefaultGradStart, 0.3)}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <PremioDisplay amount={mission.reward_amount} size="xl"
                won={isCompleted}
                muted={isExpired}
                strikethrough={isExpired}/>
              <div style={{ ...TY.xxSmallMedium, color: T.fillTertiary, textAlign: 'right',
                maxWidth: 140, lineHeight: 1.35 }}>
                {isCompleted ? 'Ya acreditado en tu cuenta'
                  : isExpired ? 'No se acreditó'
                  : 'Se acredita automático en tu cuenta'}
              </div>
            </div>

            {/* Progress bar (in progress) */}
            {isInProgress && (
              <div style={{
                padding: S.x4, borderRadius: R.medium, marginBottom: S.x6,
                background: alpha('#FBFBFB', 0.04),
              }}>
                <div style={{ ...TY.xSmallBold, color: T.fillPrimary, marginBottom: 8 }}>
                  Te faltan {fmtCurrency(Math.max(0, mission.qualifying_target - mission.progress))} para tu Premio
                </div>
                <ProgressBar value={mission.progress} max={mission.qualifying_target} height={8}
                  fill={G.actionPrimary}/>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                  <span style={{ ...TY.xSmallMedium, color: T.fillTertiary }}>Progreso</span>
                  <span style={{ ...TY.xSmallBold, color: T.fillPrimary }}>
                    {fmtCurrency(mission.progress)} / {fmtCurrency(mission.qualifying_target)}
                  </span>
                </div>
              </div>
            )}

            {/* How it works — single inline line, not a numbered list */}
            <div style={{
              padding: '14px 16px', borderRadius: R.medium, marginBottom: S.x6,
              background: alpha('#FBFBFB', 0.04),
              border: `1px solid ${alpha('#FBFBFB', 0.06)}`,
            }}>
              <div style={{ ...TY.xSmallBlack, color: T.fillTertiary, letterSpacing: 0.6, marginBottom: 8 }}>
                CÓMO FUNCIONA
              </div>
              <div style={{ ...TY.smallMedium, color: T.fillSecondary, lineHeight: 1.5 }}>
                {mission.subtitle}. El Premio se acredita automáticamente en tu cuenta cuando alcanzás el objetivo.
              </div>
            </div>

            {/* Eligibility — collapsed by default; key exclusions surface as inline pills above */}
            {mission.key_exclusions && mission.key_exclusions.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: S.x4 }}>
                {mission.key_exclusions.map((ex, i) => (
                  <span key={i} style={{
                    ...TY.xSmallMedium, color: T.fillSecondary,
                    padding: '5px 10px', borderRadius: 999,
                    background: alpha('#FBFBFB', 0.06),
                    border: `1px solid ${alpha('#FBFBFB', 0.1)}`,
                  }}>
                    ⚠ {ex}
                  </span>
                ))}
              </div>
            )}

            <Accordion title="Reglas y exclusiones completas">
              <ul style={{ listStyle: 'none', padding: 0, margin: 0,
                display: 'flex', flexDirection: 'column', gap: 8 }}>
                {mission.eligibility.map((item, i) => (
                  <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ color: T.fillTertiary, marginTop: 2 }}>•</span>
                    <span style={{ ...TY.smallMedium, color: T.fillSecondary, lineHeight: 1.5 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </Accordion>
          </div>
        </div>

        {/* Sticky footer */}
        <div style={{
          padding: '12px 16px 22px', borderTop: `1px solid ${alpha('#FBFBFB', 0.06)}`,
          background: T.backgroundApp,
        }}>
          {isAvailable && (
            <button onClick={() => onActivate(mission)} style={{
              width: '100%', padding: '14px', borderRadius: R.medium,
              background: T.fillAccentStart, border: 'none',
              ...TY.baseBold, color: '#0A0816', cursor: 'pointer',
              boxShadow: `0 8px 22px ${alpha(T.fillAccentStart, 0.4)}`,
              fontFamily: FONT,
            }}>
              Activar misión · +{fmtAmountOnly(mission.reward_amount)} de Premio
            </button>
          )}
          {isInProgress && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button onClick={() => onSimulateCompletion(mission)} style={{
                width: '100%', padding: '14px', borderRadius: R.medium,
                background: G.actionPrimary, border: 'none',
                ...TY.baseBold, color: T.fillPrimary, cursor: 'pointer',
                fontFamily: FONT,
              }}>
                Simular finalización (demo)
              </button>
              <div style={{ ...TY.xSmallMedium, color: T.fillTertiary, textAlign: 'center' }}>
                En producción la misión se completa al alcanzar el objetivo.
              </div>
            </div>
          )}
          {(isCompleted || isExpired) && (
            <button onClick={onClose} style={{
              width: '100%', padding: '14px', borderRadius: R.medium,
              background: alpha('#FBFBFB', 0.08),
              border: `1px solid ${alpha('#FBFBFB', 0.12)}`,
              ...TY.baseBold, color: T.fillPrimary, cursor: 'pointer',
              fontFamily: FONT,
            }}>
              Volver a misiones
            </button>
          )}
        </div>
      </div>
    );
  };

  // ── Undo toast (kept for legacy reference; not rendered) ────────
  const UndoToast = ({ visible, message, onUndo, onDismiss }) => {
    const [secondsLeft, setSecondsLeft] = useState(5);
    const dismissedRef = useRef(false);
    useEffect(() => {
      if (!visible) return;
      dismissedRef.current = false;
      setSecondsLeft(5);
      const tick = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(tick);
            if (!dismissedRef.current) {
              dismissedRef.current = true;
              onDismiss?.();
            }
            return 0;
          }
          return s - 1;
        });
      }, 1000);
      return () => clearInterval(tick);
    }, [visible]);

    if (!visible) return null;
    return (
      <div style={{
        position: 'fixed', left: '50%', bottom: 110,
        transform: 'translateX(-50%)',
        width: 'min(380px, calc(100vw - 24px))',
        zIndex: 220, fontFamily: FONT,
        animation: 'dfToastIn 220ms ease-out',
      }}>
        <div style={{
          background: '#0A0816',
          border: `1px solid ${alpha('#FBFBFB', 0.18)}`,
          borderRadius: R.large, padding: '12px 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          boxShadow: '0 16px 36px rgba(0,0,0,0.55)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <span style={{ fontSize: 18 }}>✨</span>
            <div style={{ minWidth: 0 }}>
              <div style={{ ...TY.smallBold, color: T.fillPrimary,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {message}
              </div>
              <div style={{ ...TY.xxSmallMedium, color: T.fillTertiary, marginTop: 2 }}>
                Se confirma en {secondsLeft}s · activación irreversible
              </div>
            </div>
          </div>
          <button onClick={onUndo} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: FONT, ...TY.smallBold, color: T.fillAccentStart,
            padding: '6px 4px', flexShrink: 0,
          }}>
            Deshacer
          </button>
        </div>
      </div>
    );
  };

  // ── Completion toast (bottom, above bottom navbar) ────────────
  const CompletionToast = ({ mission, onDismiss }) => {
    useEffect(() => {
      if (!mission) return;
      const t = setTimeout(() => onDismiss?.(), 4500);
      return () => clearTimeout(t);
    }, [mission]);
    if (!mission) return null;
    return (
      <div style={{
        position: 'fixed', left: '50%', bottom: 100,
        transform: 'translateX(-50%)',
        width: 'min(380px, calc(100vw - 24px))',
        zIndex: 230, fontFamily: FONT,
        animation: 'dfToastIn 220ms ease-out',
      }}>
        <div style={{
          background: '#0A0816',
          border: `1px solid ${alpha(T.fillSuccess, 0.4)}`,
          borderRadius: R.large, padding: '14px 16px',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: `0 18px 38px ${alpha('#000', 0.6)}, 0 0 0 1px ${alpha(T.fillSuccess, 0.2)} inset`,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: alpha(T.fillSuccess, 0.18),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>🎉</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ ...TY.smallBold, color: T.fillPrimary,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              ¡Misión completada!
            </div>
            <div style={{ ...TY.xSmallMedium, color: T.fillSuccess, marginTop: 2 }}>
              +{fmtAmountOnly(mission.reward_amount)} de Premio en tu cuenta
            </div>
          </div>
          <button onClick={onDismiss} style={{
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontFamily: FONT, ...TY.xSmallBold, color: T.fillAccentStart,
            padding: '6px 4px', flexShrink: 0,
          }}>
            Ver
          </button>
        </div>
      </div>
    );
  };

  // ── Top-level: AdHocV1Misiones ────────────────────────────────
  const AdHocV1Misiones = ({ persona, setToast }) => {
    // endsAt computed once on mount so countdowns tick from a stable origin.
    const initialMissions = useMemo(() => V1.active.map(m => ({
      ...m,
      endsAt: Date.now() + m.ends_in_seconds * 1000,
    })), []);
    const [missions, setMissions] = useState(initialMissions);

    const [overlay, setOverlay] = useState(null);
    const [completionToast, setCompletionToast] = useState(null);

    // Order: active missions sorted by reward desc, then completed missions sorted by reward desc.
    // Hero = first of the sorted list (the highest-reward active mission, or the highest completed
    // if everything is done). User-facing rule per Apr 28 review: "highest price to lowest".
    // Order: active (in_progress + available) first by price desc, then completed by price desc,
    // then expired (still visible for 7 days post-expiry per the simplified spec) by price desc.
    const sortedMissions = useMemo(() => {
      const isActive = m => m.state === 'available' || m.state === 'in_progress';
      const active = missions.filter(isActive)
        .sort((a, b) => b.reward_amount - a.reward_amount);
      const completed = missions.filter(m => m.state === 'completed')
        .sort((a, b) => b.reward_amount - a.reward_amount);
      const expired = missions.filter(m => m.state === 'expired')
        .sort((a, b) => b.reward_amount - a.reward_amount);
      return [...active, ...completed, ...expired];
    }, [missions]);

    const heroMission = sortedMissions[0];
    const secondaryMissions = sortedMissions.slice(1);
    const isAllEmpty = sortedMissions.length === 0;

    const handleActivate = (mission) => {
      // Instantaneous activation — no undo. Mission flips state and toast confirms.
      setMissions(prev => prev.map(m =>
        m.id === mission.id ? { ...m, state: 'in_progress', progress: 0 } : m
      ));
      setOverlay(null);
      setToast?.({ icon: '✨', text: `${mission.title.replace(/[🔥🎰⚡✨]/g, '').trim()} · en curso` });
    };

    const handleSimulateCompletion = (mission) => {
      setMissions(prev => prev.map(m =>
        m.id === mission.id ? { ...m, state: 'completed', progress: m.qualifying_target } : m
      ));
      setOverlay(null);
      setCompletionToast({ mission });
    };

    return (
      <div style={{ padding: `${S.x4}px ${S.x8}px 0`, fontFamily: FONT }}>
        {isAllEmpty ? (
          <EmptyStateBridge/>
        ) : (
          <>
            {/* Hero card */}
            {heroMission && (
              <HeroMissionCard
                mission={heroMission}
                onTap={(mx) => setOverlay({ type: 'detail', mission: mx })}
                onActivate={handleActivate}/>
            )}

            {/* Secondary missions — flat list, no section headers */}
            {secondaryMissions.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {secondaryMissions.map(m => (
                  <CompactMissionCard key={m.id} mission={m}
                    onTap={(mx) => setOverlay({ type: 'detail', mission: mx })}
                    onActivate={handleActivate}/>
                ))}
              </div>
            )}

          </>
        )}

        {/* Overlays */}
        {overlay?.type === 'detail' && (
          <MissionDetailOverlay
            mission={missions.find(m => m.id === overlay.mission.id) || overlay.mission}
            onClose={() => setOverlay(null)}
            onActivate={handleActivate}
            onSimulateCompletion={handleSimulateCompletion}/>
        )}

        <CompletionToast
          mission={completionToast?.mission}
          onDismiss={() => setCompletionToast(null)}/>
      </div>
    );
  };

  Object.assign(window, { AdHocV1Misiones });
})();
