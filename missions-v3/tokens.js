// Draftea Design Tokens — extracted from draftea_foundation (DFMainTheme)
window.DF = (function () {
  const tone = (base, shades) => ({ base, ...shades });

  const dfBrandViolet = tone('#4120D2', { 25:'#EBE5FF',50:'#CBBCFF',100:'#AB95FF',200:'#8B6EFF',300:'#6B47FF',400:'#4B20FF',500:'#3D18D2',600:'#2F12A4',700:'#210C76',800:'#130648',900:'#05001A' });
  const dfBrandPurple = tone('#8840D2', { 25:'#F2E5FF',50:'#DFC0FF',100:'#CD9CFF',200:'#BB78FF',300:'#A954FF',400:'#9730FF',500:'#7D28D2',600:'#611EA4',700:'#451476',800:'#290A48',900:'#0D001A' });
  const dfLight = tone('#CCCFD1', { 25:'#FBFBFB',50:'#E2E2E2',100:'#C9C9C9',200:'#B0B0B0',300:'#979797',400:'#7E7E7E',500:'#646464',600:'#4B4B4B',700:'#323232',800:'#191919',900:'#000000' });
  const dfGray = tone('#536073', { 25:'#C9C9C9',50:'#A1A1A1',100:'#6E6E6E',200:'#505050',300:'#3C3C3C',400:'#323232',500:'#282828',600:'#1E1E1E',700:'#191919',800:'#141414',900:'#0F0F0F' });
  const dfEmerald = tone('#059669', { 25:'#ECFDF5',50:'#D1FAE5',100:'#A7F3D0',200:'#6EE7B7',300:'#34D399',400:'#10B981',500:'#059669' });
  const dfYellow = tone('#CA8A04', { 200:'#FDE047',300:'#FACC15',400:'#EAB308',500:'#CA8A04' });
  const dfRed = tone('#DC2626', { 200:'#FCA5A5',300:'#F87171',400:'#EF4444',500:'#DC2626' });
  const dfFucsia = tone('#C026D3', { 100:'#F5D0FE',200:'#F0ABFC',300:'#E879F9',400:'#D946EF',500:'#C026D3' });
  const dfMint = tone('#47B5BF', { 100:'#A5F3FC',200:'#67E8F9',300:'#22D3EE',400:'#06B6D4',500:'#0891B2' });
  const dfCyan = tone('#E6FBFE', { 300:'#33C4DC',400:'#06B6D4' });
  const dfAmber = tone('#CD9E1D', { 100:'#FEE099',400:'#FBBF24',500:'#CD9E1D' });
  const dfLemon = tone('#ADD25C', { 400:'#D2FF72',500:'#ADD25C' });
  const dfOrange = tone('#EA580C', { 300:'#FB923C',400:'#F97316' });
  const dfTeal = tone('#0D9488', { 300:'#2DD4BF',400:'#14B8A6' });
  const dfSky = tone('#248CD1', { 300:'#38BDF8' });
  const dfRose = tone('#C8314D', { 400:'#F43F5E' });
  const dfPurple = tone('#7049C8', { 400:'#A855F7' });

  // alpha on hex #RRGGBB
  const a = (hex, opacity) => {
    const h = hex.replace('#','');
    const r = parseInt(h.substring(0,2),16), g = parseInt(h.substring(2,4),16), b = parseInt(h.substring(4,6),16);
    return `rgba(${r},${g},${b},${opacity})`;
  };

  const theme = {
    // fills
    fillPrimary: dfLight[25],              // #FBFBFB
    fillSecondary: a(dfLight[25], 0.70),
    fillTertiary: a(dfLight[25], 0.50),
    fillDisable: a(dfLight[25], 0.32),
    fillDark: dfLight[900],
    fillAccentStart: dfLemon[400],         // #D2FF72
    fillAccentEnd: '#56DEEA',
    fillSuccess: dfEmerald[300],
    fillWarning: dfYellow[200],
    fillError: dfRed[300],
    fillInfo: dfLemon[500],
    // backgrounds
    backgroundPrimGradStart: dfLight[800], // #191919
    backgroundPrimGradEnd: dfGray[900],    // #0F0F0F
    backgroundSecondary: dfLight[900],     // #000000
    backgroundApp: dfLight[900],
    backgroundOpacityPrimary: a(dfLight[25], 0.12),
    backgroundOpacitySecondary: a(dfLight[25], 0.10),
    backgroundOpacityTertiary: a(dfLight[25], 0.08),
    backgroundSuccess: a(dfEmerald[300], 0.16),
    backgroundWarning: a(dfYellow[400], 0.12),
    backgroundError: a(dfRed[500], 0.24),
    backgroundSuccessSolid: '#04110C',
    overlay: 'rgba(0,0,0,0.60)',
    // actions
    actionPrimaryDefaultGradStart: dfBrandViolet[400],  // #4B20FF
    actionPrimaryDefaultGradEnd: dfBrandPurple[400],    // #9730FF
    actionSecondary: a(dfLight[25], 0.10),
    // components
    live: dfRose[400],
    money: dfAmber[400],
    selected: dfEmerald[400],
    freeBetGradStart: dfFucsia[200],
    freeBetGradEnd: dfBrandViolet[300],
    promoGradStart: dfMint[100],
    promoGradEnd: dfMint[300],
    trendingGradStart: '#FF52BA',
    trendingGradEnd: '#FFA901',
    boosterGradStart: '#FFA65B',
    boosterGradEnd: '#F0ABFC',
    protectedGradStart: dfCyan[400],
    protectedGradEnd: '#4440FD',
    gradientBetSlipStart: '#14083D',
    gradientBetSlipEnd: '#230C3E',
    levelContent: dfTeal[300],
    picksPlayerBubble: '#7C3CFF',
  };

  const spacing = { x:2,x2:4,x3:6,x4:8,x5:10,x6:12,x8:16,x10:20,x12:24,x14:28,x16:32,x20:40,x24:48,x28:56 };
  const radius = { none:0,xSmall:4,small:8,medium:10,base:12,mBase:14,large:16,xLarge:20,x1Large:22,x2Large:24,x3Large:32,full:56 };

  // Text style presets — font-size/weight/line-height.
  // Weights: regular 400, medium 500, bold 700, xBold 900.
  // Heights: standard 1.5, large 1.2.
  const font = "'Red Hat Display', -apple-system, system-ui, sans-serif";
  const t = (size, weight, lh=1.5, style='normal') => ({ fontFamily: font, fontSize: size, fontWeight: weight, lineHeight: lh, fontStyle: style });
  const type = {
    xxSmallBold:      t(8,  700),
    xSmallMedium:     t(10, 500),
    xSmallBold:       t(10, 700),
    xSmallBlack:      t(10, 900),
    smallMedium:      t(12, 500),
    smallBold:        t(12, 700),
    smallBlack:       t(12, 900),
    smallBlackItalic: t(12, 900, 1.5, 'italic'),
    mediumRegular:    t(14, 400),
    mediumMedium:     t(14, 500),
    mediumBold:       t(14, 700),
    mediumBlack:      t(14, 900),
    baseRegular:      t(16, 400),
    baseMedium:       t(16, 500),
    baseBold:         t(16, 700),
    baseBlackItalic:  t(16, 900, 1.5, 'italic'),
    largeMedium:      t(18, 500),
    largeBold:        t(18, 700),
    largeBlack:       t(18, 900),
    xLargeBold:       t(22, 700),
    xLargeBlack:      t(22, 900, 1.2),
    headlineBase:     t(24, 700),
    headlineBaseBlack: t(24, 900),
    headlineBaseBlackItalic: t(24, 900, 1.5, 'italic'),
    headlineLarge:    t(32, 700, 1.2),
    headlineXLarge:   t(40, 700, 1.2),
    headlineLargeBlack: t(56, 900, 1.2, 'italic'),
  };

  const gradients = {
    actionPrimary: `linear-gradient(105deg, ${theme.actionPrimaryDefaultGradStart} 0%, ${theme.actionPrimaryDefaultGradEnd} 100%)`,
    actionPrimaryOpacity24: `linear-gradient(105deg, ${a(theme.actionPrimaryDefaultGradStart,0.24)}, ${a(theme.actionPrimaryDefaultGradEnd,0.24)})`,
    actionPrimaryOpacity16: `linear-gradient(105deg, ${a(theme.actionPrimaryDefaultGradStart,0.16)}, ${a(theme.actionPrimaryDefaultGradEnd,0.16)})`,
    backgroundPrimary: `linear-gradient(180deg, ${theme.backgroundPrimGradStart} 0%, ${theme.backgroundPrimGradEnd} 100%)`,
    freeBet: `linear-gradient(135deg, ${theme.freeBetGradStart} 0%, ${theme.freeBetGradEnd} 100%)`,
    freeBetOpacity: `linear-gradient(135deg, ${a(theme.freeBetGradStart,0.16)} 0%, ${a(theme.freeBetGradEnd,0.16)} 100%)`,
    trending: `linear-gradient(90deg, ${theme.trendingGradStart}, ${theme.trendingGradEnd})`,
    trendingOpacity: `linear-gradient(90deg, ${a(theme.trendingGradStart,0.16)}, ${a(theme.trendingGradEnd,0.16)})`,
    booster: `linear-gradient(135deg, ${theme.boosterGradStart}, ${theme.boosterGradEnd})`,
    boosterOpacity: `linear-gradient(135deg, ${a(theme.boosterGradStart,0.16)}, ${a(theme.boosterGradEnd,0.16)})`,
    protected: `linear-gradient(180deg, ${theme.protectedGradStart} 0%, ${theme.protectedGradEnd} 100%)`,
    fillAccent: `linear-gradient(180deg, ${theme.fillAccentStart}, ${theme.fillAccentEnd})`,
    fillAccentOpacity: `linear-gradient(180deg, ${a(theme.fillAccentStart,0.20)}, ${a(theme.fillAccentEnd,0.20)})`,
    betSlip: `linear-gradient(105deg, ${theme.gradientBetSlipStart}, ${theme.gradientBetSlipEnd})`,
    promo: `linear-gradient(0deg, ${theme.promoGradStart}, ${theme.promoGradEnd})`,
    promoOpacity: `linear-gradient(0deg, ${a(theme.promoGradStart,0.16)}, ${a(theme.promoGradEnd,0.16)})`,
  };

  return { theme, spacing, radius, type, gradients, font, a,
    colors: { dfBrandViolet, dfBrandPurple, dfLight, dfGray, dfEmerald, dfYellow, dfRed, dfFucsia, dfMint, dfCyan, dfAmber, dfLemon, dfOrange, dfTeal, dfSky, dfRose, dfPurple } };
})();
