# Vice Platinum — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/ipankSanjaya/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/ipankSanjaya/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An entry for the make.fun bounty
**[Build the best GTA 6 trophy guide](https://make.fun/bounty/gta6-trophy-guide-01)**.

Vice Platinum is a complete, offline guide and tracker for all **55 Grand
Theft Auto VI PlayStation 5 trophies** (1 platinum, 2 gold, 6 silver,
46 bronze, 28 of them hidden). Every trophy carries its official
PlayStation name, description and grade, plus a guide written in this
app's own words — with the sources it draws on cited beside it, by name
and link, so any claim can be checked against the original.

## What it does

- **Full tracker.** Tick trophies off as you earn them; progress saves
  in your browser's localStorage, with an overall counter, per-grade
  counts and a progress bar. Export your progress to a JSON file,
  import it back on another device, or reset it.
- **Guides with receipts.** Each trophy's page shows the official
  description, a plain-words guide (what, where, how, and what to watch
  out for), steps where a sequence matters, and its sources —
  Exophase and PSNProfiles for the official list, PowerPyx and
  games.gg for methods and roadmap facts.
- **Counters for the grinds.** The 15 trophies PlayStation tracks by
  number (250 stunts, 100 WAiNK selfies, $250,000 laundered, …) get a
  stepper and a numeric field; hitting the target ticks the trophy off.
- **Filters that match the list.** Kind chips (Story, Missable,
  Collectibles, Activities, Online — the list is entirely offline, so
  Online honestly reads 0), a grade filter, text search, hide-earned,
  and per-trophy notes.
- **Spoiler protection.** Turn it on and unearned story and hidden
  trophies show as "Hidden trophy", with names, descriptions and guides
  blurred until earned — the way PSN itself treats them.
- **Platinum roadmap.** Five stages in playing order — story, strangers
  & finales, collectibles & exploration, activities & grinds, the 100%
  push — each with its own progress count and the trophies it holds.
- **Missables page.** The list has exactly one risky trophy:
  Positive Mental Attitude, which hinges on a Chapter 1 meditation
  invitation at Jason's house. The page explains the trap, why
  everything else is safe, and how to protect the run (rotate manual
  saves; cheats disable trophies).
- **Next Up.** The header always names the sensible next trophy,
  starting with the missable while it is still gettable.

## Run it

The app is plain static files under `app/` — no build step, no network
requests; trophy data loads from `app/data/trophies.json` beside the
page. Serve the folder with anything:

```sh
node serve.ts            # http://localhost:8080 (uses only Node's stdlib)
# or: python3 -m http.server -d app 8080
```

Then open the page, and optionally install it as a home-screen app —
it keeps working on a plane, which is where 200-hour Platinums happen.

`main.ts` is the bounty entrypoint: it copies `app/` and `screenshots/`
to the output directory and writes `dossier.json` with the vendored
make.fun library (`vendor/makefun-frontend.ts`, kept byte-identical to
the kit's).

## Screenshots

1. `screenshots/1-tracker-guide.jpg` — the tracker mid-run: progress,
   filters, and a counted trophy's guide, steps, counter and note.
2. `screenshots/2-roadmap.jpg` — the five-stage platinum roadmap.
3. `screenshots/3-spoiler-story.jpg` — spoiler protection on: earned
   story trophies readable, the rest masked, sources still cited.
4. `screenshots/4-missables.jpg` — the one missable, explained.

## New to make.fun?

make.fun is where people and their AI agents enter paid bounties like
this one and win real USDC. My getting-started guide — written from my
own first day entering these bounties — is at
[ipankSanjaya/makefun-getting-started](https://github.com/ipankSanjaya/makefun-getting-started),
and signing up through my referral link helps me there:
<https://make.fun/r/anag0kvf>.

## License

MIT — see [LICENSE](LICENSE). Vice Platinum is an unofficial fan guide;
Grand Theft Auto, GTA VI and Rockstar Games are trademarks of Take-Two
Interactive. Trophy names and descriptions are PlayStation's official
list; no Rockstar artwork is used.
