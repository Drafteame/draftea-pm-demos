// BottomNav — Draftea bottom navigation bar (solid pill recipe).
// Icons: PNG assets in assets/nav_bar/ for bets / mis_entradas / gaming
// (provided white-on-transparent). Rewards + search stay as inline SVG.
// Layout: 4 evenly-distributed tabs inside a rounded pill; active tab is
// a filled purple circle behind the icon; separate circular search button
// to the right of the pill. Sized per screenshot reference.
const BottomNav = ({ active = 'rewards', onChange = () => {} }) => {
  const T = {
    pill: '#121017',
    border: 'rgba(255,255,255,0.06)',
    text: '#EDEDED',
    muted: '#9A98A6',
    active: '#6D3BFF',
  };

  const PngIcon = ({ src, active }) => (
    <img src={src} alt="" style={{
      width: 22, height: 22, objectFit: 'contain',
      filter: active
        ? 'brightness(0) invert(1)'
        : 'brightness(0) invert(0.92)',
    }}/>
  );

  const RewardsIcon = ({ active }) => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M12 3l8.7 5v8L12 21 3.3 16V8L12 3z"
        stroke={active ? '#FFFFFF' : T.text} strokeWidth="1.6" strokeLinejoin="round"
        fill={active ? 'rgba(255,255,255,0.22)' : 'none'}/>
      <path d="M12 8.2l1.5 3 3.3.5-2.4 2.3.6 3.3L12 15.8l-3 1.5.6-3.3-2.4-2.3 3.3-.5L12 8.2z"
        stroke={active ? '#FFFFFF' : T.text} strokeWidth="1.6" strokeLinejoin="round"
        fill={active ? '#FFFFFF' : 'none'}/>
    </svg>
  );

  const Icon = ({ id, active }) => {
    switch (id) {
      case 'bets':    return <PngIcon src="assets/nav_bar/bets.png" active={active}/>;
      case 'entries': return <PngIcon src="assets/nav_bar/mis_entradas.png" active={active}/>;
      case 'gaming':  return <PngIcon src="assets/nav_bar/gaming.png" active={active}/>;
      case 'rewards': return <RewardsIcon active={active}/>;
      default: return null;
    }
  };

  const TABS = [
    { id: 'bets',    label: 'Bets' },
    { id: 'entries', label: 'Mis entradas' },
    { id: 'gaming',  label: 'Gaming' },
    { id: 'rewards', label: 'Rewards' },
  ];

  const Tab = ({ id, label }) => {
    const isActive = id === active;
    return (
      <button
        onClick={() => onChange(id)}
        style={{
          flex: 1,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', gap: 3,
          padding: '6px 2px',
          background: 'transparent', border: 'none', cursor: 'pointer',
          minWidth: 0,
        }}
      >
        <div
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: isActive ? T.active : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 180ms ease',
            boxShadow: isActive ? '0 6px 14px rgba(109,59,255,0.45)' : 'none',
          }}
        >
          <Icon id={id} active={isActive}/>
        </div>
        <span style={{
          fontSize: 10.5,
          lineHeight: 1.1,
          color: isActive ? '#FFFFFF' : T.muted,
          fontWeight: isActive ? 700 : 500,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
        }}>
          {label}
        </span>
      </button>
    );
  };

  return (
    <div
      style={{
        position: 'fixed',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: 16,
        width: 'min(380px, calc(100vw - 16px))',
        display: 'flex', gap: 10, alignItems: 'center',
        zIndex: 50,
      }}
    >
      <div
        style={{
          flex: 1,
          background: T.pill,
          border: `1px solid ${T.border}`,
          borderRadius: 999,
          padding: '8px 10px',
          display: 'flex', alignItems: 'stretch',
          boxShadow: '0 12px 30px rgba(0,0,0,0.45)',
          height: 70,
        }}
      >
        {TABS.map(t => <Tab key={t.id} id={t.id} label={t.label}/>)}
      </div>
      <button
        onClick={() => onChange('search')}
        aria-label="Buscar"
        style={{
          width: 58, height: 58, borderRadius: '50%',
          background: T.pill,
          border: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 12px 30px rgba(0,0,0,0.45)',
          flexShrink: 0,
          padding: 0,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="6.5" stroke="#EDEDED" strokeWidth="1.7"/>
          <path d="M15.8 15.8L20 20" stroke="#EDEDED" strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
};
