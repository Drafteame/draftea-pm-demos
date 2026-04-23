# Draftea — Misiones V3 (interactive demo)

Prototipo HTML + React (Babel Standalone, sin build) que fusiona lo mejor de `missions-prototype` (v1) y `missions-v2`, más:
- **Home router** que deja elegir una de tres personas (Nivel 1 Plata · Nivel 4 Esmeralda · Nivel 7 Oro) y aterrizar en el hub correcto de Lealtad.
- **Logos de nivel diferenciados por tier** (plata / esmeralda / oro) heredados del sistema de v1, con track horizontal de niveles.
- **Misiones totalmente clickeables** — tocar abre el detalle, "Seguir los pasos" dispara un walkthrough paso-a-paso (reemplaza el placeholder de chatbot de v2).
- **Catálogo de misiones sincronizado con el Sheet** (12 onboarding al 22-abr-2026 — incluye el split de B5 en booster + free-bet y la regla de 2+ categorías para C1).
- **Cofre del tesoro** con carousel de v1 + tabla de probabilidades transparente de v2.
- **Graduación con confeti + botón persistente** para volver al home.

## Cómo abrirlo

### Opción A — Python

```bash
cd demos/missions-v3
python3 -m http.server 8866
# Abrí http://localhost:8866
```

### Opción B — Node

```bash
cd demos/missions-v3
npx serve .
```

## Lo que vas a ver

1. **Home** — picker de 3 personas. Cada tarjeta muestra el badge de nivel real (PNG), tier chip (Plata/Esmeralda/Oro), nombre, blurb y progreso inicial.
2. **Hub de Misiones** — header con track horizontal de niveles (deslizá para ver otros tiers), barra de XP, tabs Misiones / Recompensas.
3. **Quest board (onboarding)** — 4 grupos (A · Retiros / B · Sportsbook / C · Casino / D · Experiencia) con progreso por grupo, misiones en su `display_order` del Sheet.
4. **Set semanal (ongoing)** — 5 misiones sin XP; 4/5 completadas desbloquea el cofre.
5. **Mission detail sheet** — hero con la ilustración, reglas ("CÓMO CUENTA"), dos CTAs (Seguir los pasos / Marcar completada).
6. **Follow-along** — walkthrough inline con barra de progreso de pasos, hero por paso, deeplink previsto en producción.
7. **Prize Chest roulette** — carousel con framing dorado/plateado/esmeralda según tier + tabla transparente de probabilidades.
8. **Graduation screen** — confeti + botón "Ver mis semanales".
9. **Rewards tab** — beneficios con logos del tier del usuario; VIP y cashback bloqueados hasta Nivel 6/7.

### Interacciones principales

| Acción | Qué hace |
|---|---|
| Tocar persona en Home | Entra al hub con el nivel y flow correspondientes |
| Tocar una misión | Abre el mission detail sheet |
| Tocar "Seguir los pasos" | Abre el walkthrough paso a paso |
| Completar último paso | Marca la misión y vuelve al hub con toast |
| Tocar "Marcar como completada (demo)" | Shortcut — salta el follow-along |
| Onboarding al 12/12 | Dispara pantalla de graduación |
| Ongoing a 4/5 | Pulsa el cofre — tap → ruleta |
| Girar la ruleta | Animación de 4.6s → premio ponderado |

### Probabilidades de la ruleta (Sin Letra Chica)

En el demo las probabilidades son hardcoded y se muestran directo en la pantalla. En producción las configura Ops por Retool (PRD § 5.4 / 6.3):

| Premio | Probabilidad |
|---|:-:|
| +50 XP | 30% |
| Booster +20% | 30% |
| 10 Giros gratis | 20% |
| Intenta la semana entrante | 20% |
| +50 créditos | 0% (premio visible, no sorteable esta semana) |

## Estructura de archivos

```
missions-v3/
├── index.html              # Entry (carga React + Babel desde CDN)
├── tokens.js               # Tokens DF (theme, spacing, type, gradients)
├── personas.js             # Tiers (silver/emerald/gold) + 3 personas del Home
├── missions-data.js        # Catálogo sincronizado con el Sheet (12 onboarding + 5 weekly)
├── app-core.jsx            # LevelBadge, LevelTrack, MissionRow, QuestGroup, SegmentedTabs
├── app-overlays.jsx        # MissionDetailSheet, FollowAlong, PrizeRoulette, Graduation, Toast
├── App.jsx                 # HomeRouter, MissionsHub, RewardsTab, orquestación
├── components/
│   └── BottomNav.jsx       # Navbar inferior (reutilizado de v2)
├── assets/                 # PNG badges + ilustraciones + roulette segments
├── vercel.json             # Config de hosting
└── README.md               # Este archivo
```

## Qué es mock / qué no

- **Todos los datos son mock.** Ningún endpoint se llama. El catálogo se replica del Sheet; cambiá `missions-data.js` para experimentar.
- Los pasos del follow-along son copy placeholder de demo — en producción los produce CX junto a los mini-onboardings de cada feature.
- Las probabilidades de la ruleta, el set semanal y los beneficios son configurables por Ops (Retool). Ver PRD § 6.3.

## Deploy a Vercel

Desde `demos/missions-v3/`:

```bash
npx vercel@latest deploy --prod --yes
```

`vercel.json` setea `Content-Type: application/javascript` para los archivos `.jsx` (si no, Safari / Firefox rechazan el MIME type de `text/plain`). Compartí el alias `.vercel.app`, no la URL hash (tiene SSO). Ver `memory/skill_vercel_demo_hosting.md` para el flujo completo.

## Referencia

- PRD: `products/loyalty/planning/PRD-MISSIONS.md`
- Catálogo canónico: [Missions Catalog — V1](https://docs.google.com/spreadsheets/d/1Mhn5McTttDJoywbYYwelSLCWB71Ya28o63lsb5r0h88/edit?gid=0#gid=0) (Sheet)
- Prototipos previos: `demos/missions-prototype/` (v1), `demos/missions-v2/` (v2)
