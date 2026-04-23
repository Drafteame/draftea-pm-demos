# Missions v3 — Testing plan

Last updated: 2026-04-22 (after Liquid Glass nav / roulette redesign / chest-dedup pass).

This is the open QA punch list for tomorrow's review session. Items are grouped by priority. Anything marked 🚨 must be fixed before sharing with stakeholders; ⚠️ before shipping live to production.

---

## 1. Start here — 5-minute sanity check

Run locally first so we catch obvious regressions before demoing:

```bash
cd demos/missions-v3
python3 -m http.server 8866
# → http://localhost:8866
```

DevTools → toggle mobile emulator → **iPhone 14 Pro (390 × 844)**.

Happy path:
1. Home loads with all three persona cards, tier badges visible and glowing.
2. Pick **Usuario nuevo** → Nivel 1 / PLATA + 2/12 progress + groups A/B/C/D render.
3. Tap **Agrega tu cuenta CLABE** → detail sheet slides up → Seguir los pasos → walk all 4 steps → returns to hub, mission shows "Completada — ¡buen trabajo!" + toast.
4. Back to Home → **Jugador frecuente** → ¡Cofre listo! is the top hero (single CTA) → tap Abrir → roulette modal → Girar → prize lands → Reclamar → new benefit appears at top of Recompensas tab.
5. Back to Home → **Recién graduado** → Recompensas → Nivel 4 Esmeralda, VIP + Cashback locked with upgrade copy.

If any of those fail, stop and file a bug before continuing.

---

## 2. Things that are NOT yet tested (do tomorrow)

### 🚨 Must-test before demo

- [ ] **Real iOS Safari** (not just Chrome DevTools emulator). The Liquid Glass `backdrop-filter` renders differently on real Safari — we need to confirm the nav doesn't fall back to solid black. Also confirm the roulette dimmer blur is applied.
- [ ] **Real Android Chrome**. `backdrop-filter: blur()` is supported since Chrome 76, but we should verify on an actual device — sometimes Android composites differently and the inner highlight stroke can disappear.
- [ ] **Small-screen iPhone (SE, 375 × 667)** — the horizontal level track should still auto-scroll to the current level; the onboarding progress card shouldn't break.
- [ ] **Landscape mode** — we haven't designed for it. Expected behavior: it stays portrait-ish (max-width 420) with a lot of side margin. Verify nothing overlaps.
- [ ] **Tap the chest mid-spin** — does the modal correctly block interaction during the 4.6s animation? (Current code sets `onClick={phase === 'spinning' ? undefined : onClose}` on the backdrop, but the Girar button also has a disabled state — verify both.)
- [ ] **Back-button / browser history** — currently we don't push routes. Browser back on the follow-along page kicks you to the Home router, losing in-progress state. Decide: is that acceptable for a demo, or do we add history entries?
- [ ] **Keyboard navigation / focus ring**. Tab through Home → is the focus visible? Does Enter pick a persona? Does Escape close the modal? (Currently none of these are wired — screen-reader users would struggle.)

### ⚠️ Must-test before a real user sees it (MX alpha)

- [ ] **Spanish proofread by a native speaker**. We mix MX ("verificá") and AR ("tocá", "tenés", "armá") voseo/tuteo. A MX reviewer needs to normalize all copy. The Sheet has the canonical `title` / `description` / `rules_copy` — but the walk-through step copy, toast copy, and modal copy are ad-hoc in `missions-data.js` and `app-overlays.jsx`. File: `missions-data.js` (all `steps[].title` and `steps[].body`) + `App.jsx` toast strings.
- [ ] **Roulette win-state asset is in Portuguese** ("Não foi dessa vez"). The PNG `assets/roulette-seg-perdiste.png` was reused from `missions-prototype/` which was authored in PT. Needs an MX-Spanish replacement (e.g. "Intenta la próxima semana"). Same goes for any other `roulette-seg-*.png` with baked text.
- [ ] **Graduation flow visual** — the confetti burst is 22 particles; on slow devices the animation can feel choppy. Verify on the slowest device in the lab.
- [ ] **Reduced motion** preference — `prefers-reduced-motion: reduce` should disable `dfPulse`, `dfWiggle`, `dfConfetti`, and the roulette transition. Currently nothing respects this.
- [ ] **Long titles** — what happens if a future mission has a 60-character title? The MissionRow currently truncates with `text-overflow: ellipsis`. Confirm it reads OK in detail sheet too.

### 🔄 Copy / content review owned by cross-functional

- [ ] **XP values**: Toto, Yisus, Paco are tuning in the Sheet. `missions-data.js` is a snapshot as of 2026-04-22 — before tomorrow's demo, run `gemini -y -p "Read the Misiones tab of the Missions Sheet and diff with demos/missions-v3/missions-data.js. Only show changed XP values or new/removed rows."` to check for drift.
- [ ] **Onboardinho step copy** — the step-by-step text in `missions-data.js` is placeholder. CX team owns final copy for each `steps[]` array. Flag which ones are "production-ready" vs "needs-CX-write".
- [ ] **Rewards card copy** — "Llegá a Nivel 7 para desbloquear" is placeholder. Real copy should come from the loyalty tier spec.
- [ ] **"Cambiar persona" top-bar** — this is a demo affordance, not a real user feature. Decide if it should be hidden for the stakeholder reel or kept for the interactive demo.

### 🧪 Edge states we haven't exercised

- [ ] **Persona "Usuario nuevo" completes all 12 missions** in one session → graduation screen fires → tap "Ver mis semanales" → returns to hub → persona flow is still "onboarding" (not auto-switched to "ongoing"). For a real user this would transition the user to the ongoing cadence. For the demo, decide if we auto-switch the flow after graduation.
- [ ] **VIP persona re-opens roulette after claim** — currently `chestClaimed` is true, so the PrizeChestButton falls below the mission list showing "Premio reclamado". Tapping it should do nothing. Confirm.
- [ ] **Recién graduado** picks an uncompleted weekly mission → currently detail sheet uses "ongoing" mode → rules visible → "Seguir los pasos" triggers the walk-through BUT most ongoing missions don't have `steps[]` defined. Verify — this might render a blank walkthrough.
- [ ] **Reopen roulette modal mid-spin** — close + reopen during the 4.6s animation. Does state reset correctly?
- [ ] **Swipe the level track** across all 10 levels → the "SIGUIENTE" + "COMPLETADO" + "TU NIVEL" labels should update per slide. Animation should feel native (iOS scroll-snap).
- [ ] **Tap a COMPLETED mission** — should be disabled (cursor default, no detail sheet opens). Confirmed working via Puppeteer test but worth a manual check.

### 🔐 Things that will break in prod

- [ ] **Babel Standalone** parses JSX in the browser — ~30KB download + 100-300ms parse on low-end Android. For stakeholder demo: fine. For real users: must precompile to plain JS. Not a blocker for the demo.
- [ ] **No analytics events** — real app will fire `mission_viewed`, `mission_completed`, `chest_opened`, `prize_claimed` etc. (per PRD § 8.3). The demo has no events. Stakeholders may ask: "Will we track X?" — have the event list ready.
- [ ] **No A/B test wrapper** — real app will gate the whole feature behind Statsig. Decide if the demo needs a visible "Statsig ON / OFF" toggle, or if we describe it verbally.
- [ ] **No error states** — the demo happy-paths everything. What does a network failure, an expired session, or a backend 500 on `complete_mission` look like? Not drawn.
- [ ] **No offline state** — chest roulette shouldn't be tappable when offline (can't reach backend to resolve prize). Not modeled.

---

## 3. Recently fixed — verify didn't regress

These were fixed in this session (2026-04-22 pm):

- [x] **Bottom nav is Liquid Glass** (was solid black). Verify: on any persona, the nav is translucent and content scrolls visibly behind it. Check specular highlight is visible on dark backgrounds.
- [x] **Roulette is a proper centered modal** with solid dimmer (was bleeding through). Verify: tap outside the panel closes the modal; mission list is NOT visible behind.
- [x] **No probability table** inside the roulette. Verify: the CTAs fit without scrolling inside the modal on a 844-tall viewport.
- [x] **"¡Cofre desbloqueado!" is not duplicated** for VIP. Verify: on Jugador frecuente, there's exactly ONE chest card at the top of Misiones (when ready) OR at the bottom (when claimed). Not both.
- [x] **Level track auto-scrolls** to the current level. Verify: for Nivel 4 and Nivel 7, the middle slide is the correct level (not Nivel 1 or an earlier past level).
- [x] **Header is more compact** — badge 86px (was 108px), tighter padding. Verify above-the-fold: progress card + first group must be visible without scrolling on iPhone 14 Pro.

---

## 4. Known issues — intentional or accepted for now

| Issue | Decision | Owner |
|---|---|---|
| Roulette "Não foi dessa vez" PNG is in Portuguese | Accepted for demo — swap before user beta | Design |
| Onboardinho step copy is placeholder | Accepted for demo — CX writes final | CX team |
| Top bar "← Cambiar persona" always visible | Keep for interactive demo; hide for video reel | PM |
| Babel Standalone CDN parse in-browser | Fine for demo, compile for prod | Eng |
| Auto-transition from onboarding to ongoing after graduation | Not wired — demo shows graduation screen, user returns to same persona | PM |
| Free bet / booster split missions (B5) | Sheet has both as active — both shown | PRD-synced |
| No icon for player-prop "new sport" detection | Using football ball as placeholder | Design |

---

## 5. How to report bugs tomorrow

For each bug:

1. **Persona** (Usuario nuevo / Recién graduado / Jugador frecuente)
2. **Screen** (Home / Hub / Detail sheet / Follow-along / Roulette / Graduation / Rewards)
3. **Device** (iPhone model + OS, or browser + OS)
4. **Repro** (1 sentence)
5. **Expected vs. actual**
6. **Screenshot or screen recording**

Drop them in `#games-checkout` Slack with `[missions-v3]` tag, or file a Linear ticket in the Loyalty project.

---

## 6. Deploy checklist (when ready)

- [ ] All 🚨 items in §2 resolved
- [ ] Full smoke test green (§1)
- [ ] `python3 -m http.server` locally first, then
- [ ] `cd demos/missions-v3 && npx vercel@latest deploy --prod --yes`
- [ ] Share the `.vercel.app` alias (NOT the deploy-hash URL — SSO-gated)
- [ ] Note in `demos/README.md` is already updated to point to v3 as Active

---

## 7. References

- PRD: `products/loyalty/planning/PRD-MISSIONS.md`
- Mission Sheet (canonical catalog): https://docs.google.com/spreadsheets/d/1Mhn5McTttDJoywbYYwelSLCWB71Ya28o63lsb5r0h88/edit?gid=0
- Predecessors: `demos/missions-prototype/`, `demos/missions-v2/`
- Related memory: `memory/project_missions_status.md`, `memory/skill_vercel_demo_hosting.md`
