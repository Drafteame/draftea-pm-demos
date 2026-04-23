// BottomNav — Draftea bottom navigation bar
// Reference: /Users/marcos/Downloads/navbarFooter.png
// Pattern: rounded-pill container with 4 tabs (Bets, Mis entradas, Gaming, Rewards)
//          + separate circular search button to the right.
// Active tab = filled purple circle under the icon.
// This is a standalone, reusable component for any demo.

const BottomNav = ({ active = 'rewards', onChange = () => {} }) => {
  const T = {
    pill: '#121017',
    border: 'rgba(255,255,255,0.06)',
    text: '#EDEDED',
    muted: '#9A98A6',
    active: '#6D3BFF',
  };

  const Icon = ({ name, filled }) => {
    const stroke = filled ? '#FFFFFF' : T.text;
    const fill = filled ? '#FFFFFF' : 'none';
    const sw = 1.6;
    switch (name) {
      case 'bets':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 2.5l8.5 4.8v9.4L12 21.5 3.5 16.7V7.3L12 2.5z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" fill={fill === 'none' ? 'none' : fill} fillOpacity={fill === 'none' ? 0 : 0.18}/>
            <path d="M9.5 11.5l1.8 1.8L15 9.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'entries':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="3.5" width="16" height="17" rx="2.5" stroke={stroke} strokeWidth={sw} fill={fill === 'none' ? 'none' : fill} fillOpacity={fill === 'none' ? 0 : 0.18}/>
            <path d="M8 8h8M8 12h8M8 16h5" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
          </svg>
        );
      case 'gaming':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 9.5h12a3 3 0 013 3v2a2.5 2.5 0 01-4.6 1.4L15 14H9l-1.4 1.9A2.5 2.5 0 013 14.5v-2a3 3 0 013-3z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" fill={fill === 'none' ? 'none' : fill} fillOpacity={fill === 'none' ? 0 : 0.18}/>
            <circle cx="16.5" cy="12" r="0.9" fill={stroke}/>
            <circle cx="8" cy="12" r="0.9" fill={stroke}/>
          </svg>
        );
      case 'rewards':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M12 3l8.7 5v8L12 21 3.3 16V8L12 3z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" fill={fill === 'none' ? 'none' : fill} fillOpacity={fill === 'none' ? 0 : 0.22}/>
            <path d="M12 8.2l1.5 3 3.3.5-2.4 2.3.6 3.3L12 15.8l-3 1.5.6-3.3-2.4-2.3 3.3-.5L12 8.2z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" fill={filled ? '#FFFFFF' : 'none'}/>
          </svg>
        );
      case 'search':
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="6.5" stroke={stroke} strokeWidth={sw}/>
            <path d="M15.8 15.8L20 20" stroke={stroke} strokeWidth={sw} strokeLinecap="round"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const Tab = ({ id, label }) => {
    const isActive = id === active;
    return (
      <button
        onClick={() => onChange(id)}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
          padding: '8px 4px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <div
          style={{
            width: 40,
            height: 32,
            borderRadius: 16,
            background: isActive ? T.active : 'transparent',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 180ms ease',
          }}
        >
          <Icon name={id} filled={isActive} />
        </div>
        <span style={{ fontSize: 11, color: isActive ? '#FFFFFF' : T.muted, fontWeight: isActive ? 600 : 500 }}>
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
        display: 'flex',
        gap: 10,
        alignItems: 'center',
        zIndex: 50,
      }}
    >
      <div
        style={{
          flex: 1,
          background: T.pill,
          border: `1px solid ${T.border}`,
          borderRadius: 999,
          padding: '6px 8px',
          display: 'flex',
          alignItems: 'center',
          boxShadow: '0 12px 30px rgba(0,0,0,0.45)',
        }}
      >
        <Tab id="bets" label="Bets" />
        <Tab id="entries" label="Mis entradas" />
        <Tab id="gaming" label="Gaming" />
        <Tab id="rewards" label="Rewards" />
      </div>
      <button
        onClick={() => onChange('search')}
        style={{
          width: 54,
          height: 54,
          borderRadius: '50%',
          background: T.pill,
          border: `1px solid ${T.border}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 12px 30px rgba(0,0,0,0.45)',
        }}
        aria-label="Search"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="6.5" stroke="#EDEDED" strokeWidth="1.6"/>
          <path d="M15.8 15.8L20 20" stroke="#EDEDED" strokeWidth="1.6" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
};
