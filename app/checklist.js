// Checklist rendering: one row per trophy, with its official name, description,
// grade badge, kind badge, count badge, missable and hidden flags, and a tick box.
// The spoiler setting hides the name and description of story trophies that are
// not earned yet; the grade and kind stay visible so the row still sorts.
export const KIND_LABELS = {
  story: 'Story',
  collectibles: 'Collectibles',
  activities: 'Activities',
  online: 'Online',
};

export function gradeBadgeClass(grade) {
  return `badge ${grade}`;
}

export function trophyIsSpoilerHidden(trophy, earned, spoilersOn) {
  return spoilersOn && trophy.kind === 'story' && !earned.has(trophy.name);
}

function makeBadge(text, className) {
  const span = document.createElement('span');
  span.className = className;
  span.textContent = text;
  return span;
}

export function buildTrophyMeta(trophy) {
  const meta = document.createElement('div');
  meta.className = 'trophy-meta';
  meta.append(makeBadge(trophy.grade, gradeBadgeClass(trophy.grade)));
  meta.append(makeBadge(KIND_LABELS[trophy.kind] ?? trophy.kind, 'badge kind'));
  if (trophy.count !== undefined) {
    const label = trophy.countLabel ? `${trophy.count} ${trophy.countLabel}` : `Target: ${trophy.count}`;
    meta.append(makeBadge(label, 'badge count'));
  }
  if (trophy.missable) meta.append(makeBadge('Missable', 'badge missable'));
  if (trophy.hidden) meta.append(makeBadge('Hidden', 'badge hidden-flag'));
  return meta;
}

export function filterTrophies(trophies, options) {
  const query = (options.query ?? '').trim().toLowerCase();
  return trophies.filter((trophy) => {
    if (options.kind === 'missable' && !trophy.missable) return false;
    if (options.kind === 'online') return false;
    if (options.kind && options.kind !== 'all' && options.kind !== 'missable' && trophy.kind !== options.kind) return false;
    if (options.grade && options.grade !== 'all' && trophy.grade !== options.grade) return false;
    if (options.hideEarned && options.earned.has(trophy.name)) return false;
    if (query) {
      const haystack = `${trophy.name} ${trophy.description} ${trophy.guide} ${trophy.grade} ${trophy.kind}`.toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function renderTrophyRow(trophy, state, callbacks) {
  const item = document.createElement('li');
  const isEarned = state.earned.has(trophy.name);
  if (isEarned) item.classList.add('earned');
  if (state.selectedId === trophy.id) item.classList.add('selected');

  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = isEarned;
  box.setAttribute('aria-label', `Mark ${trophy.name} as earned`);
  box.addEventListener('change', () => callbacks.onToggle(trophy, box.checked));
  box.addEventListener('click', (event) => event.stopPropagation());
  item.append(box);

  const body = document.createElement('div');
  const name = document.createElement('div');
  name.className = 'trophy-name';
  const spoilerHidden = trophyIsSpoilerHidden(trophy, state.earned, state.spoilersOn);
  if (spoilerHidden) {
    name.textContent = 'Hidden story trophy — earn it to reveal';
    name.classList.add('spoiler-name');
  } else {
    name.textContent = trophy.name;
  }
  body.append(name);

  const desc = document.createElement('div');
  desc.className = 'trophy-desc';
  desc.textContent = spoilerHidden ? 'Its name and description stay hidden until earned.' : trophy.description;
  body.append(desc);
  body.append(buildTrophyMeta(trophy));
  item.append(body);

  const gradeWord = document.createElement('div');
  gradeWord.className = 'trophy-grade-word';
  gradeWord.textContent = trophy.grade;
  item.append(gradeWord);

  item.addEventListener('click', () => callbacks.onSelect(trophy));
  return item;
}

export function renderTrophyList(listElement, trophies, state, callbacks, emptyMessage) {
  listElement.replaceChildren();
  if (trophies.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'empty-state';
    empty.textContent = emptyMessage;
    listElement.append(empty);
    return;
  }
  for (const trophy of trophies) {
    listElement.append(renderTrophyRow(trophy, state, callbacks));
  }
}
