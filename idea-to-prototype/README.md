# Demo: Idea → Validated Prototype

A guided AI pipeline that takes a raw product idea (Slack message or direct prompt) and produces a PRD, Figma wireframes, persona validation, engineering feasibility assessment, and a runnable prototype — all driven by a few guided prompts.

## Goal

Show how Draftea's PM workspace can compress weeks of product work into a single session: idea → definition → design → validation → prototype.

---

## Pipeline

```
INPUT: Raw idea text (Slack DM or direct Claude prompt)
         ↓
Step 1 — PRD Draft          Claude PM persona → problem statement, user stories,
                            success metrics, scope (MVP vs. full)
         ↓
Step 2 — Figma Wireframes   /figma-generate-design skill → DS-compliant screens
                            design-companion validates DS token usage
         ↓
Step 3 — Persona Validation /validate-personas skill → Mateo / Lucas / Alejandro
                            react to PRD + screens; friction map + killer features
         ↓
Step 4 — Eng Feasibility    (@_@) engineering-manager → effort, risks, dependencies
         ↓
Step 5 — Prototype          Codex → generates Flutter/React scaffold → local server
         ↓
OUTPUT: Figma link + localhost URL + exec summary (3 bullets)
```

---

## Skills

| Skill | File | Status |
|-------|------|--------|
| `/validate-personas` | `.claude/skills/validate-personas/SKILL.md` | ✅ Ready |
| `/product-demo` | `.claude/skills/product-demo/SKILL.md` | ✅ Ready |

---

## Status

| Step | Component | Status | Notes |
|------|-----------|--------|-------|
| 1 | PRD Draft | ✅ Works today | Uses Claude + PERSONAS.md + PRODUCT.md |
| 2 | Figma Wireframes | ✅ Works today | `/figma-generate-design` skill |
| 3 | Persona Validation | ✅ Works today | `/validate-personas` skill — new |
| 4 | Eng Feasibility | ✅ Works today | `(@_@)` agent |
| 5 | Prototype Scaffold | 🟡 Partial | Codex generates code; local server TBD |
| — | Orchestration glue | ✅ Works today | `/product-demo` skill chains steps 1–4 |

---

## Example Run

> **Input:** "I want a 'Hot Bets' feed on the home screen — shows what parlays other users are placing right now, anonymized, with one-tap copy to betslip."

Expected output artifacts:
- `demos/idea-to-prototype/examples/hot-bets/PRD.md`
- Figma link (generated screen)
- `demos/idea-to-prototype/examples/hot-bets/persona-validation.md`
- `demos/idea-to-prototype/examples/hot-bets/eng-feasibility.md`

---

## Open Items

- [ ] Prototype step: define Flutter template app for local server spin-up
- [ ] Add a 4th synthetic judge: "Draftea Trading/Risk" perspective (limits, liability)
- [ ] Slack input handler: auto-trigger pipeline when idea lands in a designated channel
- [ ] Add GMV impact estimator step (use HEX + historical Custom Bet data as benchmark)

---

## Key Files

- `company-context/PERSONAS.md` — Mateo, Lucas, Alejandro profiles
- `company-context/PRODUCT.md` — current product state and roadmap
- `.claude/skills/validate-personas/SKILL.md` — persona reaction engine
- `.claude/skills/product-demo/SKILL.md` — full pipeline orchestrator
