# Leonida Platinum — GTA VI Trophy Guide & Tracker

[![make.fun](https://make.fun/badge.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![make.fun bounty](https://make.fun/badge-bounty.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![make.fun offline](https://make.fun/badge-offline.svg)](https://make.fun/c/gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies** of Grand Theft Auto VI (1 platinum, 2 gold, 6 silver, 46 bronze; 28 hidden on PlayStation). Built for the [make.fun bounty gta6-trophy-guide-01](https://make.fun/c/gta6-trophy-guide-01).

## What it does

- **Checklist** — every trophy with its official name, description and grade, plus a guide in the author's own words that cites its sources (Exophase and PSNProfiles for the official list and PSN progress targets).
- **Saved progress** — tick trophies off; progress is stored in the browser (localStorage) and can be exported to a JSON file and imported back.
- **Filters** — by kind (story, missable, collectibles, activities, online), by grade, and by text search, plus a hide-earned toggle.
- **Spoiler setting** — hides the names and descriptions of story trophies until they are earned.
- **Roadmap to the Platinum** — five stages built from the official descriptions, in the order to earn them.
- **Missables page** — 25 trophies flagged missable, each with the reason, built from the official descriptions.

## Screenshots

- `screenshots/1-checklist.png` (cover) — the checklist with official names, descriptions and grades, and a gold trophy's guide with its sources open beside it.
- `screenshots/2-roadmap.png` — the five-stage roadmap to the platinum with per-stage progress.
- `screenshots/3-missables.png` — the missable trophies with their reasons, and the spoiler-safe banner.
- `screenshots/4-detail.png` — a collectible trophy's guide with its sources, the kind filter at work, and the export/import and spoiler controls.

## Offline

The app is plain static files under `app/` — no build step, no network requests at run time. Serve `app/` with any static server and open `index.html` in desktop Chrome with the network off.

```sh
node serve.ts   # serves app/ at http://localhost:8080 (serve.ts is a tiny static server)
```

## Handing it in

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored make.fun library (`vendor/makefun-frontend.ts`, unchanged from the kit).

## Sources

- Trophy names, descriptions, grades and PSN progress targets: the official PlayStation 5 list as mirrored by [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/) and [PSNProfiles](https://psnprofiles.com/trophies/43531-grand-theft-auto-vi) (18 November 2026).
- Every guide is written for this entry, in the author's own words, from the official description. In-game spots and steps are not yet verified in play, and the guide says so where it matters.

## License

MIT — see [LICENSE](LICENSE). Unofficial fan-made guide, not affiliated with or endorsed by Rockstar Games. No Rockstar logo, artwork or box art is used anywhere.
