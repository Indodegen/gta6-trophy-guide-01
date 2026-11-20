# Leonida Legend — GTA VI Trophy Guide & Tracker

[![gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/Indodegen/gta6-trophy-guide-01/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/Indodegen/gta6-trophy-guide-01/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

An offline guide and tracker for all **55 Grand Theft Auto VI trophies** on PlayStation 5 — built for the [make.fun bounty “Build the best GTA 6 trophy guide”](https://make.fun/c/gta6-trophy-guide-01).

## What it is

- **Every trophy** with its official PlayStation name, description and grade: 1 platinum, 2 gold, 6 silver, 46 bronze — 28 of them hidden until earned.
- **A guide in its own words for every trophy**, each naming its sources (Exophase, PSNProfiles, PowerPyx, Push Square, GTA BOOM). Nothing copied from another guide.
- **A 5-stage road to the platinum**, from the story (which cannot be replayed) through strangers, exploration and activities to 100% completion.
- **25 missable trophies flagged with reasons** — every one tied to a moment that cannot be replayed. The game gives 15 manual save slots; this guide tells you when to use them.
- **A tracker**: tick trophies off, progress saved in localStorage, export to a file and import it back. Filters by kind (story, missable, collectibles, activities, online), grade filter, search, hide-earned, and a spoiler setting that hides story trophies' names and descriptions until they are earned.
- **Fully offline**: static files under `app/`, no build step, no network request at runtime. No Rockstar logo, artwork or game imagery.

## Run it

```sh
node serve.ts
# open http://localhost:8080
```

Try a sample playthrough in the browser with `http://localhost:8080/?demo=1` (14 trophies pre-earned, saved progress untouched), or open a single trophy's guide with `?open=17`. Views: `?view=roadmap`, `?view=missables`; filters: `?kind=story|missable|collectibles|activities|online`.

## Screenshots

Four real renders of the app in desktop Chrome, in `screenshots/`: the checklist with a guide open, the roadmap, the missable list, and a filtered collectibles view.

## Hand it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library.

## Notes

- **No online trophies**: all 55 are earned in single-player, so the Online filter is honestly empty.
- **Platinum needs 100% completion** (gold trophy *A Long Road*), so the guide is built around the game's own completion checklist: story, strangers, collectibles, races, stunts, challenges and discoveries.
- Unofficial fan guide. Not affiliated with, endorsed by, or connected to Rockstar Games, Take-Two Interactive, Sony or PlayStation.
