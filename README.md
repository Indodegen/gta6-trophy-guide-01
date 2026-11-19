# Leonida Platinum — GTA VI Trophy Guide & Tracker

[![make.fun](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![Rank](https://make.fun/badge/gta6-trophy-guide-01/Indodegen/gta6-trophy-guide-01/rank.svg)](https://make.fun/c/gta6-trophy-guide-01)
[![Reward](https://make.fun/badge/gta6-trophy-guide-01/Indodegen/gta6-trophy-guide-01/reward.svg)](https://make.fun/c/gta6-trophy-guide-01)

An offline, open-source guide and tracker for all **55 PlayStation 5 trophies of Grand Theft Auto VI** — built for the [make.fun bounty "Build the best GTA 6 trophy guide"](https://make.fun/c/gta6-trophy-guide-01) (`gta6-trophy-guide-01`).

## What it is

- **Checklist tracker** — every trophy with its official name, description and grade; tick it off and progress is saved in the browser (localStorage), with **export and import** of progress as JSON, plus per-trophy notes.
- **Filters** — by grade, by kind (story, missable, collectibles, activities, stranger strands, combat, exploration), by earned/remaining, and full-text search.
- **Spoiler-safe mode** — hides the names and descriptions of story trophies until you earn them.
- **Roadmap to the platinum** — five stages in the order that wastes the least replaying, with per-stage progress.
- **Missables flagged** — 11 trophies tied to a single moment, choice or situation, each with a note on when it can be missed. The game released 19 November 2026, so each flag is honestly labelled as inferred from the official description, not verified in-game.
- **A cited guide for every trophy** — written in our own words, each naming its sources (the official list on Exophase for name/description/grade, PSNProfiles for PSN counts, and our own advice from the official description where a place or step is not pinned down).
- **Next-up planner** — the header always shows the next unearned trophy in roadmap order, plus a points total (bronze 15 / silver 30 / gold 90 / platinum 180).

## Offline

Static files under `app/` — no build step, no network request at run time. Open `app/index.html` in desktop Chrome with the network off and it works.

## Run it locally

```sh
node serve.ts
# open http://localhost:8080
```

Deep links open the guide in a useful state: `?view=roadmap`, `?grade=silver`, `?open=17`, `?seed=13`, `?spoilers=on`.

## Sources & honesty

Trophy names, descriptions and grades are the official PlayStation 5 list as Exophase and PSNProfiles published it before the bounty opened (the two agree on every name, description and grade). Guides are original writing for this entry; no other guide's text was copied. Where the official description does not pin down a place or step, the guide says so instead of asserting it.

Unofficial fan guide. Not affiliated with Rockstar Games or PlayStation. No Rockstar logo or official artwork is used.

## License

MIT — see [LICENSE](LICENSE).
