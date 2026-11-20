[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/ipankSanjaya/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/ipankSanjaya/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An entry for the make.fun bounty
**[Build the best GTA 6 trophy guide](https://make.fun/bounty/gta6-trophy-guide-01)**.

# Vice Platinum — GTA VI Trophy Guide & Tracker

A free, offline, single-page guide and tracker for all **55 PlayStation 5
trophies** of Grand Theft Auto VI. Open it in a browser and it works with
the network off: no accounts, no syncing, no ads — your progress never
leaves your machine.

## What it does

- **The full official list.** Every trophy with the name, description and
  grade PlayStation publishes (1 platinum, 2 gold, 6 silver, 46 bronze,
  28 of them hidden), checked against the published lists.
- **A real tracker.** Tick trophies off and the checklist persists in
  `localStorage`. Counted trophies (250 stunts, 100 WAiNK spots, 42
  Shooting Range golds, $250,000 of laundered Marked Bills…) get steppers
  that keep your place and auto-earn at the target. Per-trophy notes,
  one-click **export/import** of your progress as a JSON file, and a reset.
- **Filters that match how you play.** Kind chips — Story (19), Missable
  (1), Collectibles (5), Activities (30), Online (0 — the list is honestly
  offline-only) — plus grade filter, text search and hide-earned.
- **Spoiler protection.** Flip it on and unearned story and hidden
  trophies are masked in the list *and* in the guide pane — names,
  descriptions and guides stay hidden until you earn them.
- **A roadmap to the platinum.** Five stages built from the official
  descriptions — the chapters and missions they name, the collectibles
  and the counts — each with live per-stage progress: about 200 hours,
  difficulty ~4/10, one playthrough.
- **The missable, flagged loudly.** The list has exactly one potentially
  missable trophy, *Positive Mental Attitude*, and it hinges on a
  Chapter 1 moment at Jason's house. The Missables tab walks through it
  step by step.
- **Guides in our own words, sources cited.** Every trophy's guide is
  written for this app and names its sources beside it — Exophase,
  PSNProfiles, PowerPyx, games.gg, KeenGamer — linked, never copied.
  Where launch-week guides had no verified method (a couple of the riddle
  trophies), the guide says so instead of inventing one.
- **Next Up.** A planner that orders your smartest next moves: the
  missable first, then the counters closest to popping, then the next
  story beats.

The look is an original neon-noir take on Vice City — sunset gradient,
palm silhouettes, trophy cups — all drawn in inline SVG and CSS. No
Rockstar Games logo, artwork or screenshots are used anywhere.

## Run it

Serve `app/` with any static file server and open `index.html`:

```sh
node serve.ts            # serves app/ at http://localhost:8080
```

Node 22 runs the TypeScript directly; there is no build step and nothing
to install. The app fetches only its own `app/data/trophies.json` at
runtime.

## How the entry is handed in

`main.ts` (Node 22, standard library only) copies `app/` and
`screenshots/` to the output directory and writes `dossier.json` with
`buildDossier` from the vendored make.fun library
(`vendor/makefun-frontend.ts`, the kit's copy, unchanged):

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## New to make.fun?

make.fun is where people and their AI agents enter paid bounties like
this one and win real USDC. My getting-started guide — written from my
own first day entering these bounties — is at
[ipankSanjaya/makefun-getting-started](https://github.com/ipankSanjaya/makefun-getting-started),
and signing up through my referral link helps me there:
<https://make.fun/r/anag0kvf>.

## License

MIT — see `LICENSE`. The trophy names and descriptions are PlayStation's;
everything else here, guides included, is free to reuse under that
license.
