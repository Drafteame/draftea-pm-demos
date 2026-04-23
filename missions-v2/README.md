# Draftea — Demo interactivo de Misiones V1

Prototipo HTML + React (vía Babel Standalone en el navegador, sin build) del flujo de Misiones V1 (Onboarding + Ongoing). Alineado con `PRD-MISSIONS.md` del 17 de abril de 2026.

---

## Cómo abrirlo (para los que no están familiarizados)

El demo necesita un servidor local simple — no se puede abrir con doble click sobre `index.html` porque el navegador bloquea archivos `.jsx` externos desde `file://`. Tienes dos opciones.

### Opción A — Python (viene preinstalado en Mac)

1. Abre **Terminal** (Cmd + Espacio → escribe `Terminal` → Enter).
2. Escribe `cd ` (con el espacio al final) y **arrastra la carpeta `missions-v2` a la Terminal**. Debería quedar algo así:
   ```
   cd /Users/tu-usuario/Downloads/missions-v2
   ```
   Dale Enter.
3. Pega este comando y Enter:
   ```
   python3 -m http.server 8765
   ```
4. Abre el navegador (Chrome/Safari) en: **http://localhost:8765**

Para cerrar: vuelve a la Terminal y presiona `Ctrl + C`.

### Opción B — Node (si ya lo tienes instalado)

```bash
cd missions-v2
npx serve .
```

El comando te muestra la URL (usualmente `http://localhost:3000`).

---

## Qué vas a ver

El demo abre en una pantalla de inicio con dos tarjetas:

1. **Onboarding** — flujo para usuarios nuevos. Ruta tipo *quest board* con 4 grupos:
   - **A — Desbloquea Retiros Instantáneos** (KYC + CLABE)
   - **B — Domina la Apuesta** (primera apuesta, parlay, en vivo, cerrar apuesta)
   - **C — Prueba Casino**
   - **D — Quédate al día** (notificaciones, pedir ayuda, reglas)

   Cada misión da XP. No hay expiración — cuando completas todas te "graduás" y se desbloquean las Ongoing.

2. **En curso** — flujo para usuarios graduados. Set semanal de 5 misiones **sin XP** — completar 4/5 desbloquea la **ruleta del Cofre del Tesoro**.

### Interacciones principales

| Acción | Qué hace |
|---|---|
| Tap sobre el cuerpo de la misión | La marca como completada (onboarding) / avanza el progreso (ongoing) |
| Tap sobre el chevron `›` | Abre el layover con detalles + reglas |
| Botón **"Ver más"** en el layover | Abre la página de **Onboardinho** (chatbot placeholder con texto genérico) |
| Completar todas las misiones de onboarding | Pantalla de graduación con botón **Salir** |
| Completar 4+ misiones ongoing | El Cofre se enciende → tap → se abre la **ruleta** |
| Botón "Girar la ruleta" | Animación de 4s → cae en un premio según probabilidad |
| Botón "Reclamar" | Aplica el premio (XP se suma al nivel, recompensas tangibles aparecen en el tab Recompensas) |

### Probabilidades de la ruleta del Cofre

Configurables por Ops vía Retool en producción (ver PRD §5.4). En este demo están hardcodeadas a:

| Premio | Probabilidad |
|---|:-:|
| Nada | 20% |
| +50 XP | 30% |
| Booster +20% | 30% |
| Free Bet $50 MXN | 0% |
| 10 Giros gratis | 20% |

El Free Bet $50 se muestra en la rueda como premio "legendario" visible pero con 0% de probabilidad de salir — patrón de gamificación intencional. La tabla de probabilidades aparece dentro del mismo modal (por transparencia / *Sin Letra Chica*).

---

## Estructura de archivos

```
missions-v2/
├── index.html              # Entry point (carga React + Babel Standalone desde CDN)
├── App.jsx                 # Todo el flujo principal
├── components/
│   └── BottomNav.jsx       # Navbar inferior reutilizable
└── README.md               # Este archivo
```

---

## Notas importantes

- Es un prototipo: **todos los datos son mock**. Ningún endpoint se llama, nada se persiste entre recargas.
- El texto de Onboardinho es placeholder — el contenido real lo va a producir el equipo de CX junto con los mini-onboardings de cada feature.
- Los premios del Cofre, los pesos de la ruleta y el set semanal son **configurables por Ops** (Retool u otro console admin) en producción. Ver PRD §6.3.
- La pantalla de graduación del flujo Onboarding se queda activa hasta que el usuario toque "Salir" — no desaparece sola.
- El tap sobre el cuerpo de una misión la marca como completada instantáneamente (acción explícita del usuario). En producción, cada misión se valida por evento real (KYC, ticket liquidado, sesión de casino, etc.) — ver PRD §8.3.

---

## Referencia

- PRD: `products/loyalty/planning/PRD-MISSIONS.md`
- Google Doc del PRD: ver `## Google Doc` en la cabecera del PRD
