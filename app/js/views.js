// Renders the checklist, the trophy detail pane, the roadmap and the missables page.
import { gradeLabel, targetText } from './data.js';
import { isEarned } from './store.js';
import { displayName, displayDescription, isSpoilerHidden } from './filters.js';

export const ROADMAP_STAGES = [
  {
    stage: 1,
    title: 'Stage 1 — Play the story',
    text: 'Play Chapters 1 to 4 and the final mission in order. The 12 chapter and named-mission trophies land here, plus the gold for the final mission. Do the missable cleanup in stage 5 before the finale, and keep a manual save from before it.',
  },
  {
    stage: 2,
    title: 'Stage 2 — Strangers & finales',
    text: 'Finish the stranger strands and the five character finales (Andy, Kenton, Billy, Randy, Tyrone) plus Bret’s unique hunt. Strands can close when the story moves on, so finish them before the final mission.',
  },
  {
    stage: 3,
    title: 'Stage 3 — Activities & skills',
    text: 'The long skill grinds: 250 stunts, all 42 Shooting Range challenges at gold, 20 different race wins, drone races at all 14 locations, 50 challenges, 18 meditation spots, bowling, the arcade and the melee drive-by.',
  },
  {
    stage: 4,
    title: 'Stage 4 — Collectibles & Leonida',
    text: 'Sweep the map: all 52 areas, 100 WAiNK spots, 3 card sets, 100 vehicles, all 8 garages, 10 Scooter Bros registrations — and spend and launder your way through the two money trophies.',
  },
  {
    stage: 5,
    title: 'Stage 5 — Chaos, combat & cleanup',
    text: 'Partner trophies, vaults, armored trucks, gang operations, the one-off moments and the 500 choices. Then 100% completion, and the platinum pops on its own.',
  },
];

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text != null) node.textContent = text;
  return node;
}

export function renderChecklist(listNode, statusNode, trophies, save, selectedId, onSelect, onToggle) {
  listNode.innerHTML = '';
  if (trophies.length === 0) {
    const note = el('li', 'empty-note', 'No trophies match these filters. Try clearing the search or choosing another kind.');
    listNode.appendChild(note);
  }
  for (const trophy of trophies) {
    const row = el('li', 'trophy-row');
    if (isEarned(save, trophy.id)) row.classList.add('earned');
    if (trophy.id === selectedId) row.classList.add('selected');
    row.dataset.trophyId = String(trophy.id);

    const check = document.createElement('input');
    check.type = 'checkbox';
    check.className = 'trophy-check';
    check.checked = isEarned(save, trophy.id);
    check.setAttribute('aria-label', 'Mark ' + displayName(trophy, save) + ' as earned');
    check.addEventListener('click', (event) => {
      event.stopPropagation();
      onToggle(trophy.id);
    });
    row.appendChild(check);

    const body = el('div', 'trophy-body');
    body.appendChild(el('div', 'trophy-name', displayName(trophy, save)));
    body.appendChild(el('p', 'trophy-desc', displayDescription(trophy, save)));

    const meta = el('div', 'trophy-meta');
    meta.appendChild(el('span', 'grade-badge ' + trophy.grade, gradeLabel(trophy.grade)));
    meta.appendChild(el('span', 'tag', trophy.kind));
    if (trophy.hidden) meta.appendChild(el('span', 'tag hidden-tag', 'Hidden'));
    if (trophy.missable) meta.appendChild(el('span', 'tag missable', 'Missable'));
    body.appendChild(meta);

    const target = targetText(trophy);
    if (target) body.appendChild(el('p', 'target-line', target));

    row.appendChild(body);
    row.addEventListener('click', () => onSelect(trophy.id));
    listNode.appendChild(row);
  }
  statusNode.textContent =
    trophies.length + ' shown · ' + trophies.filter((t) => isEarned(save, t.id)).length + ' earned in this view';
}

export function renderDetail(pane, trophy, save) {
  pane.innerHTML = '';
  if (!trophy) {
    pane.appendChild(el('p', 'detail-empty', 'Select a trophy to read its guide and sources.'));
    return;
  }
  const hidden = isSpoilerHidden(trophy, save);
  pane.appendChild(el('span', 'grade-badge ' + trophy.grade, gradeLabel(trophy.grade)));
  pane.appendChild(el('h3', null, displayName(trophy, save)));
  pane.appendChild(el('p', 'official-desc', 'Official description: “' + displayDescription(trophy, save) + '”'));
  pane.appendChild(
    el('p', 'target-line', isEarned(save, trophy.id) ? '✓ Earned — ticked off in your checklist.' : 'Not earned yet — tick its box when you earn it.'),
  );

  if (trophy.missable && trophy.missable_reason) {
    pane.appendChild(el('p', 'missable-warning', 'Missable — ' + trophy.missable_reason));
  }

  pane.appendChild(el('h4', null, 'Guide'));
  pane.appendChild(el('p', 'guide-text', hidden ? 'Guide hidden until this story trophy is earned.' : trophy.guide));

  const target = targetText(trophy);
  if (target) pane.appendChild(el('p', 'target-line', target));

  pane.appendChild(el('h4', null, 'Sources'));
  const list = el('ul', 'source-list');
  for (const source of trophy.sources || []) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = source.url;
    link.textContent = source.name;
    link.target = '_blank';
    link.rel = 'noopener';
    item.appendChild(link);
    list.appendChild(item);
  }
  pane.appendChild(list);
  pane.appendChild(
    el(
      'p',
      'source-note',
      'The guide above is written for this entry, in the author’s own words, from the official description. In-game spots and steps are not yet verified in play.',
    ),
  );
}

export function renderRoadmap(container, trophies, save) {
  container.innerHTML = '';
  for (const stage of ROADMAP_STAGES) {
    const members = trophies.filter((t) => t.stage === stage.stage);
    const earned = members.filter((t) => isEarned(save, t.id)).length;
    const card = el('div', 'roadmap-stage');
    const heading = el('h3', null, stage.title);
    const count = el('span', 'stage-count', earned + ' / ' + members.length + ' earned');
    heading.appendChild(count);
    card.appendChild(heading);
    card.appendChild(el('p', null, stage.text));
    const list = document.createElement('ul');
    for (const trophy of members) {
      const item = el('li', isEarned(save, trophy.id) ? 'earned' : '', displayName(trophy, save) + ' — ' + gradeLabel(trophy.grade) + (trophy.missable ? ' · Missable' : ''));
      list.appendChild(item);
    }
    card.appendChild(list);
    container.appendChild(card);
  }
}

export function renderMissables(container, trophies, save) {
  container.innerHTML = '';
  const missable = trophies.filter((t) => t.missable);
  for (const trophy of missable) {
    const card = el('div', 'missable-item');
    card.appendChild(el('h3', null, displayName(trophy, save) + ' — ' + gradeLabel(trophy.grade)));
    card.appendChild(el('p', 'why', trophy.missable_reason || ''));
    card.appendChild(el('p', null, displayDescription(trophy, save)));
    container.appendChild(card);
  }
}

export function renderProgress(earnedCount, total) {
  const countNode = document.getElementById('earnedCount');
  const fillNode = document.getElementById('progressFill');
  const barNode = document.getElementById('progressBar');
  const noteNode = document.getElementById('progressNote');
  countNode.textContent = String(earnedCount);
  fillNode.style.width = (total === 0 ? 0 : (earnedCount / total) * 100) + '%';
  barNode.setAttribute('aria-valuenow', String(earnedCount));
  const remaining = total - 1 - earnedCount;
  noteNode.textContent =
    earnedCount >= total
      ? 'Platinum earned — Leonida Legend.'
      : 'Platinum is ' + Math.max(remaining, 0) + ' trophies away.';
}
