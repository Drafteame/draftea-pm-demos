// DF Components — web port of draftea_foundation components
// Loads after tokens.js, before app.jsx
const { theme: T, spacing: S, radius: R, type: TY, gradients: G, a: alpha, font: FONT } = window.DF;

// ── Icon glyphs (monotone SVG) ────────────────────────────────
const DFIcon = ({ name, size = 20, color = 'currentColor', style = {} }) => {
  const paths = {
    chevronRight: <path d="M9 6l6 6-6 6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    chevronLeft: <path d="M15 6l-6 6 6 6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    chevronDown: <path d="M6 9l6 6 6-6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    chevronUp: <path d="M6 15l6-6 6 6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    check: <path d="M4 12l5 5L20 6" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    checkCircle: <g><circle cx="12" cy="12" r="10" fill={color}/><path d="M7 12l4 4 6-7" stroke="#000" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/></g>,
    lock: <g><rect x="5" y="11" width="14" height="9" rx="2" stroke={color} strokeWidth="1.8" fill="none"/><path d="M8 11V7a4 4 0 018 0v4" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round"/></g>,
    bolt: <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" stroke={color} strokeWidth="1.6" fill="none" strokeLinejoin="round"/>,
    boltFilled: <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill={color}/>,
    gift: <g><rect x="3" y="8" width="18" height="4" stroke={color} strokeWidth="1.6" fill="none"/><rect x="5" y="12" width="14" height="9" stroke={color} strokeWidth="1.6" fill="none"/><path d="M12 8v13M8 8s-2-1-2-3a2 2 0 014 0c0 2 2 3 2 3s2-1 2-3a2 2 0 014 0c0 2-2 3-2 3" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round"/></g>,
    close: <path d="M6 6l12 12M6 18L18 6" stroke={color} strokeWidth="2" strokeLinecap="round"/>,
    info: <g><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.6" fill="none"/><path d="M12 8v.01M12 11v5" stroke={color} strokeWidth="2" strokeLinecap="round"/></g>,
    trophy: <g fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M8 4h8v5a4 4 0 01-8 0V4z"/><path d="M8 6H5a1 1 0 00-1 1v1a3 3 0 003 3h1M16 6h3a1 1 0 011 1v1a3 3 0 01-3 3h-1M12 13v4M9 20h6M8 20h8"/></g>,
    sparkle: <path d="M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2 2-6z" fill={color}/>,
    star: <path d="M12 2l3 7h7l-5.5 4.5L18 21l-6-4-6 4 1.5-7.5L2 9h7l3-7z" fill={color}/>,
    arrowRight: <path d="M5 12h14M13 6l6 6-6 6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    play: <path d="M6 4l14 8-14 8V4z" fill={color}/>,
    bell: <g><path d="M6 16V11a6 6 0 0112 0v5l2 2H4l2-2z" stroke={color} strokeWidth="1.6" fill="none" strokeLinejoin="round"/><path d="M10 20a2 2 0 004 0" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round"/></g>,
    shield: <path d="M12 2l8 3v7c0 5-4 9-8 10-4-1-8-5-8-10V5l8-3z" stroke={color} strokeWidth="1.6" fill="none" strokeLinejoin="round"/>,
    card: <g><rect x="3" y="5" width="18" height="14" rx="2" stroke={color} strokeWidth="1.6" fill="none"/><path d="M3 10h18" stroke={color} strokeWidth="1.6"/></g>,
    cards: <g><rect x="4" y="7" width="10" height="14" rx="1.5" stroke={color} strokeWidth="1.6" fill="none"/><rect x="10" y="3" width="10" height="14" rx="1.5" stroke={color} strokeWidth="1.6" fill="none"/></g>,
    book: <path d="M4 4h7a3 3 0 013 3v13a3 3 0 00-3-3H4V4zm16 0h-7a3 3 0 00-3 3v13a3 3 0 013-3h7V4z" stroke={color} strokeWidth="1.6" fill="none" strokeLinejoin="round"/>,
    help: <g><circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.6" fill="none"/><path d="M9.5 9.5a2.5 2.5 0 015 0c0 1.5-2.5 2-2.5 3.5M12 17.5v.01" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round"/></g>,
    cashout: <g><path d="M3 17l6-6 4 4 8-8" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/><path d="M14 7h7v7" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/></g>,
    live: <g><circle cx="12" cy="12" r="3" fill={color}/><circle cx="12" cy="12" r="7" stroke={color} strokeWidth="1.6" fill="none"/></g>,
    parlay: <path d="M4 8h6a2 2 0 012 2v4a2 2 0 002 2h6M4 16h2" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    home: <path d="M4 10l8-6 8 6v10h-5v-6H9v6H4V10z" stroke={color} strokeWidth="1.6" fill="none" strokeLinejoin="round"/>,
    profile: <g><circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.6" fill="none"/><path d="M4 20c1-4 4-6 8-6s7 2 8 6" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round"/></g>,
    wallet: <g><rect x="3" y="6" width="18" height="13" rx="2" stroke={color} strokeWidth="1.6" fill="none"/><path d="M17 12h3" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></g>,
    search: <g><circle cx="11" cy="11" r="7" stroke={color} strokeWidth="1.8" fill="none"/><path d="M16 16l5 5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/></g>,
    dots: <g><circle cx="5" cy="12" r="1.8" fill={color}/><circle cx="12" cy="12" r="1.8" fill={color}/><circle cx="19" cy="12" r="1.8" fill={color}/></g>,
    flame: <path d="M12 3c1 3 4 5 4 9a4 4 0 11-8 0c0-2 1-3 1-5-2 1-3 3-3 6a6 6 0 1012 0c0-5-3-7-6-10z" fill={color}/>,
    chest: <g><path d="M4 10a4 4 0 018 0v1H4v-1zm8 0a4 4 0 018 0v1h-8v-1z" stroke={color} strokeWidth="1.6" fill="none"/><rect x="3" y="11" width="18" height="9" rx="1.5" stroke={color} strokeWidth="1.6" fill="none"/><rect x="10" y="13" width="4" height="5" rx="0.5" fill={color}/></g>,
    target: <g><circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6" fill="none"/><circle cx="12" cy="12" r="5" stroke={color} strokeWidth="1.6" fill="none"/><circle cx="12" cy="12" r="2" fill={color}/></g>,
    calendar: <g><rect x="3" y="5" width="18" height="16" rx="2" stroke={color} strokeWidth="1.6" fill="none"/><path d="M3 10h18M8 3v4M16 3v4" stroke={color} strokeWidth="1.6" strokeLinecap="round"/></g>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={style}>{paths[name]}</svg>
  );
};

// ── DFButton ──────────────────────────────────────────────────
const DFButton = ({ children, onClick, variant = 'primary', size = 'large', fullWidth = true, icon, trailing, style = {}, disabled }) => {
  const heights = { small: 32, medium: 40, large: 48, xLarge: 56 };
  const height = heights[size];
  const radii = { small: 8, medium: 10, large: 12, xLarge: 14 };
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    height, padding: `0 ${S.x8}px`, border: 'none', borderRadius: radii[size],
    width: fullWidth ? '100%' : 'auto', cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.32 : 1, transition: 'transform 0.08s ease, filter 0.15s',
    ...TY.baseBold, color: T.fillPrimary, userSelect: 'none',
  };
  const styles = {
    primary: { ...base, background: G.actionPrimary, color: T.fillPrimary, boxShadow: `0 6px 16px ${alpha(T.actionPrimaryDefaultGradStart, 0.35)}` },
    secondary: { ...base, background: T.actionSecondary, color: T.fillPrimary },
    tertiary: { ...base, background: T.fillPrimary, color: T.fillDark },
    ghost: { ...base, background: 'transparent', color: T.fillPrimary },
    accent: { ...base, background: G.fillAccent, color: T.fillDark },
    transparent: { ...base, background: alpha('#FBFBFB', 0.08), color: T.fillPrimary },
  };
  return (
    <button style={{ ...styles[variant], ...style }} onClick={disabled ? undefined : onClick}
      onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
      onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
      {icon && <DFIcon name={icon} size={18}/>}
      {children}
      {trailing && <DFIcon name={trailing} size={18}/>}
    </button>
  );
};

// ── DFPill / Badge ────────────────────────────────────────────
const DFPill = ({ children, variant = 'neutral', icon, style = {} }) => {
  const variants = {
    neutral:  { background: alpha('#FBFBFB', 0.08), color: T.fillPrimary },
    success:  { background: T.backgroundSuccess, color: T.fillSuccess },
    warning:  { background: T.backgroundWarning, color: T.fillWarning },
    error:    { background: T.backgroundError, color: T.fillError },
    info:     { background: alpha(T.fillInfo, 0.16), color: T.fillInfo },
    accent:   { background: G.fillAccentOpacity, color: T.fillAccentStart },
    live:     { background: alpha(T.live, 0.16), color: T.live },
    booster:  { background: G.boosterOpacity, color: T.boosterGradEnd },
    free:     { background: G.freeBetOpacity, color: T.freeBetGradStart },
    money:    { background: alpha(T.money, 0.16), color: T.money },
  };
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4, padding: `3px ${S.x4}px`,
      borderRadius: 999, ...TY.xSmallBold, ...variants[variant], ...style,
    }}>
      {icon && <DFIcon name={icon} size={12}/>}
      {children}
    </div>
  );
};

// ── DFGradientPill (for premium cases) ────────────────────────
const DFGradientPill = ({ children, gradient, icon, style = {} }) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px',
    borderRadius: 999, background: gradient, color: T.fillDark, ...TY.xSmallBlack,
    letterSpacing: 0.2, textTransform: 'uppercase', ...style,
  }}>
    {icon && <DFIcon name={icon} size={12}/>}
    {children}
  </div>
);

// ── Progress bar (gradient fill) ──────────────────────────────
const DFProgressBar = ({ value = 0, max = 100, height = 6, fill = G.actionPrimary, track = alpha('#FBFBFB', 0.12), style = {} }) => {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div style={{ width: '100%', height, background: track, borderRadius: 999, overflow: 'hidden', ...style }}>
      <div style={{ width: `${pct}%`, height: '100%', background: fill, borderRadius: 999, transition: 'width 0.6s cubic-bezier(.2,.8,.2,1)' }}/>
    </div>
  );
};

// iOS safe area (status bar + dynamic island)
const IOS_SAFE_TOP = 54;

// ── Scaffold / Background ─────────────────────────────────────
const DFScaffold = ({ children, style = {} }) => (
  <div style={{
    height: '100%', width: '100%', position: 'relative',
    background: G.backgroundPrimary,
    color: T.fillPrimary, fontFamily: FONT,
    paddingTop: IOS_SAFE_TOP,
    ...style,
  }}>
    {children}
  </div>
);

// ── Tab bar (bottom nav — liquid glass floating pill) ─────────
const DFBottomNav = ({ active = 'rewards' }) => {
  const items = [
    { id: 'bets',    label: 'Bets',        icon: 'star' },
    { id: 'tickets', label: 'Mis entradas',icon: 'card' },
    { id: 'gaming',  label: 'Gaming',      icon: 'gamepad' },
    { id: 'rewards', label: 'Rewards',     badge: true },
  ];

  const gamepad = (size, color) => (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path d="M7 9h2v2h2V9h2M15 10h.01M17 12h.01" stroke={color} strokeWidth="1.8" fill="none" strokeLinecap="round"/>
      <path d="M8 6h8a5 5 0 015 5v2a4 4 0 01-4 4c-1.5 0-2.5-1-3-2h-4c-.5 1-1.5 2-3 2a4 4 0 01-4-4v-2a5 5 0 015-5z" stroke={color} strokeWidth="1.6" fill="none" strokeLinejoin="round"/>
    </svg>
  );

  return (
    <div style={{
      position: 'absolute', bottom: 20, left: 12, right: 12,
      display: 'flex', gap: 10, zIndex: 10,
    }}>
      {/* main pill */}
      <div style={{
        flex: 1, height: 64, borderRadius: 999,
        background: alpha('#1A1A1C', 0.82),
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: `1px solid ${alpha('#FBFBFB', 0.08)}`,
        boxShadow: `inset 0 1px 0 ${alpha('#FBFBFB', 0.08)}, 0 8px 24px ${alpha('#000', 0.4)}`,
        display: 'flex', alignItems: 'center', padding: '0 6px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* shine */}
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 999,
          boxShadow: `inset 1px 1px 0 ${alpha('#FBFBFB', 0.08)}`,
          pointerEvents: 'none',
        }}/>
        {items.map(it => {
          const isActive = it.id === active;
          const color = isActive ? T.fillPrimary : alpha('#FBFBFB', 0.5);
          return (
            <button key={it.id} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              padding: '10px 0', background: 'transparent', border: 'none',
              color, cursor: 'pointer', position: 'relative',
            }}>
              <div style={{ height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {it.badge ? (
                  <div style={{
                    width: 30, height: 30, position: 'relative',
                    filter: isActive ? `drop-shadow(0 0 6px ${alpha(T.actionPrimaryDefaultGradStart, 0.6)})` : 'grayscale(1) opacity(0.6)',
                  }}>
                    <img src="assets/level-badge-silver.png" style={{ width: '100%', height: '100%', objectFit: 'contain' }}/>
                  </div>
                ) : it.icon === 'gamepad' ? gamepad(22, color) : (
                  <DFIcon name={it.icon} size={22} color={color}/>
                )}
              </div>
              <div style={{ ...TY.xxSmallBold, color: 'inherit', fontSize: 10, fontWeight: 700, letterSpacing: 0.1 }}>
                {it.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* search circle */}
      <button style={{
        width: 64, height: 64, borderRadius: '50%',
        background: alpha('#1A1A1C', 0.82),
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        border: `1px solid ${alpha('#FBFBFB', 0.08)}`,
        boxShadow: `inset 0 1px 0 ${alpha('#FBFBFB', 0.08)}, 0 8px 24px ${alpha('#000', 0.4)}`,
        color: alpha('#FBFBFB', 0.7), cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <DFIcon name="search" size={22}/>
      </button>
    </div>
  );
};

// ── App bar (title + back + trailing) ─────────────────────────
const DFAppBar = ({ title, onBack, trailing, transparent = false, subtitle }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: S.x4,
    padding: `${S.x4}px ${S.x8}px`, minHeight: 52,
    background: transparent ? 'transparent' : alpha('#000000', 0.6), backdropFilter: 'blur(12px)',
    position: 'sticky', top: 0, zIndex: 5,
  }}>
    {onBack && (
      <button onClick={onBack} style={{
        width: 36, height: 36, borderRadius: 999, background: alpha('#FBFBFB', 0.08),
        border: 'none', color: T.fillPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}>
        <DFIcon name="chevronLeft" size={20}/>
      </button>
    )}
    <div style={{ flex: 1 }}>
      <div style={{ ...TY.baseBold, color: T.fillPrimary }}>{title}</div>
      {subtitle && <div style={{ ...TY.smallMedium, color: T.fillTertiary }}>{subtitle}</div>}
    </div>
    {trailing}
  </div>
);

// ── Modal (bottom sheet style) ────────────────────────────────
const DFBottomSheet = ({ open, onClose, children, maxHeight = '85%' }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: T.overlay, display: 'flex', alignItems: 'flex-end',
      animation: 'dfFadeIn 0.2s ease',
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxHeight, background: T.backgroundApp,
        borderRadius: `${R.x2Large}px ${R.x2Large}px 0 0`,
        padding: `${S.x4}px 0 0`, animation: 'dfSlideUp 0.28s cubic-bezier(.2,.8,.2,1)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          width: 36, height: 4, background: alpha('#FBFBFB', 0.24),
          borderRadius: 999, margin: '0 auto 12px',
        }}/>
        {children}
      </div>
    </div>
  );
};

Object.assign(window, { DFIcon, DFButton, DFPill, DFGradientPill, DFProgressBar, DFScaffold, DFBottomNav, DFAppBar, DFBottomSheet });
