# Draftea · PM Demos

Collection of interactive prototypes built by the Draftea Product Management team to explore, validate, and communicate new feature designs before they reach the engineering backlog.

All demos here are static — HTML + React via Babel Standalone — so any browser (or Vercel) can host them with zero build step.

---

## Active demos

| Demo | Folder | Hosted at | Status |
|---|---|---|---|
| Missions v3 | [`missions-v3/`](missions-v3/) | [missions-v2.vercel.app](https://missions-v2.vercel.app) | ✅ Active |

## Archive / reference

| Demo | Folder | Status |
|---|---|---|
| Missions v2 | [`missions-v2/`](missions-v2/) | Superseded by v3 |
| Missions prototype (v1) | [`missions-prototype/`](missions-prototype/) | Superseded by v3 |
| Missions UX reel source | [`missions-ux/`](missions-ux/) | Source for the `/ux-reel` skill |
| Missions UX reel renders | [`missions-video/`](missions-video/) | Canonical MP4 output reference |
| Idea → prototype pipeline | [`idea-to-prototype/`](idea-to-prototype/) | Scaffolding for the `/product-demo` skill |

---

## Running a demo locally

```bash
cd <demo-folder>
python3 -m http.server 8866
open http://localhost:8866
```

---

## Deploying a new demo

Each demo is its own Vercel project. For new demos, from the demo folder:

```bash
cd <demo-folder>
npx vercel@latest deploy --prod --yes
```

Then wire auto-deploys by setting the Vercel project's Git source to this repo with **Root Directory** = `<demo-folder>`. Every push to `main` that touches files in that folder will trigger a redeploy.

---

## Source of truth for product context

This repo contains the **interactive artifacts only** — the code you can run. The PRDs, research, decision docs, and internal memory live in the Draftea PM workspace. Do not duplicate strategic content here.
