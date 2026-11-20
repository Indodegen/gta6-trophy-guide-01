// Leonida Legend — bootstrap: load the trophy list and the roadmap, read the
// starting view from the URL, and wire the checklist, detail pane, roadmap view,
// missables view, filters, search, spoiler setting and progress file buttons.
import { loadEarned, saveEarned, clearEarned, parseProgressFile, downloadProgress } from './store.js';
import { filterTrophies, renderTrophyList } from './checklist.js';
import { renderDetail } from './detail.js';
import { renderRoadmap } from './roadmap.js';

// A sample playthrough for screenshots and first looks (?demo=1): 14 trophies
// earned, used only when the browser has no saved progress of its own.
const DEMO_EARNED_IDS = [2, 3, 4, 5, 8, 15, 16, 21, 28, 32, 35, 42, 44, 46];
const GRADE_ORDER = ['platinum', 'gold', 'silver', 'bronze'];

const params = new URLSearchParams(location.search);
const trophiesDoc = await (await fetch('data/trophies.json')).json();
const roadmapDoc = await (await fetch('data/roadmap.json')).json();
const trophies = trophiesDoc.trophies;
const byId = new Map(trophies.map((trophy) => [trophy.id, trophy]));
const byName = new Map(trophies.map((trophy) => [trophy.name, trophy]));

const saved = loadEarned();
const state = {
  earned: saved.size > 0
    ? new Set([...saved].filter((name) => byName.has(name)))
    : (params.get('demo') === '1' ? new Set(DEMO_EARNED_IDS.map((id) => byId.get(id).name)) : new Set()),
  kind: params.get('kind') ?? params.get('filter') ?? 'all',
  grade: params.get('grade') ?? 'all',
  query: params.get('q') ?? '',
  hideEarned: params.get('hide') === '1',
  spoilersOn: params.get('spoiler') !== 'off',
  view: params.get('view') ?? 'checklist',
  selectedId: Number(params.get('open') ?? 17),
};

const elements = {
  earnedCount: document.getElementById('earnedCount'),
  progressFill: document.getElementById('progressFill'),
  progressSub: document.getElementById('progressSub'),
  search: document.getElementById('search'),
  grade: document.getElementById('grade'),
  hideEarned: document.getElementById('hideEarned'),
  spoilers: document.getElementById('spoilers'),
  listNote: document.getElementById('listNote'),
  trophyList: document.getElementById('trophyList'),
  missableList: document.getElementById('missableList'),
  detailPane: document.getElementById('detailPane'),
  stageList: document.getElementById('stageList'),
  stageOverview: document.getElementById('stageOverview'),
  roadmapIntro: document.getElementById('roadmapIntro'),
  exportBtn: document.getElementById('exportBtn'),
  importFile: document.getElementById('importFile'),
  resetBtn: document.getElementById('resetBtn'),
};

elements.search.value = state.query;
elements.grade.value = state.grade;
elements.hideEarned.checked = state.hideEarned;
elements.spoilers.checked = state.spoilersOn;
for (const button of document.querySelectorAll('.kind')) {
  button.classList.toggle('active', button.dataset.kind === state.kind);
}

function selectedTrophy() {
  return byId.get(state.selectedId) ?? null;
}

function renderProgress() {
  const earned = state.earned.size;
  elements.earnedCount.textContent = String(earned);
  elements.progressFill.style.width = `${Math.round((earned / trophies.length) * 100)}%`;
  const parts = GRADE_ORDER.map((grade) => {
    const total = trophies.filter((trophy) => trophy.grade === grade).length;
    const done = trophies.filter((trophy) => trophy.grade === grade && state.earned.has(trophy.name)).length;
    const label = grade === 'platinum' ? 'Platinum' : grade[0].toUpperCase() + grade.slice(1);
    return `${label} ${done}/${total}`;
  });
  elements.progressSub.textContent = parts.join(' · ');
}

function renderAll() {
  renderProgress();
  const shown = filterTrophies(trophies, {
    kind: state.kind, grade: state.grade, query: state.query,
    hideEarned: state.hideEarned, earned: state.earned,
  });
  const emptyMessage = state.kind === 'online'
    ? 'No online trophies: all 55 trophies are earned in single-player. Nothing here needs PlayStation Plus or multiplayer.'
    : 'No trophies match these filters. Clear the search or pick another kind.';
  elements.listNote.textContent = state.kind === 'online'
    ? 'Online filter: this game has no online trophies.'
    : `Showing ${shown.length} of ${trophies.length} trophies. Click a row to read its guide.`;
  renderTrophyList(elements.trophyList, shown, state, callbacks, emptyMessage);
  renderTrophyList(
    elements.missableList,
    trophies.filter((trophy) => trophy.missable),
    state, callbacks,
    'No missable trophies.',
  );
  renderDetail(elements.detailPane, selectedTrophy(), state, callbacks);
  renderRoadmap(elements.stageList, elements.roadmapIntro, elements.stageOverview, roadmapDoc, trophies, state.earned, (trophy) => {
    state.selectedId = trophy.id;
    switchView('checklist');
    renderAll();
  });
}

function switchView(view) {
  state.view = view;
  for (const button of document.querySelectorAll('.tab')) {
    button.classList.toggle('active', button.dataset.view === view);
  }
  for (const section of document.querySelectorAll('.view')) {
    section.classList.toggle('hidden', section.id !== `view-${view}`);
  }
}

const callbacks = {
  onToggle(trophy, checked) {
    if (checked) state.earned.add(trophy.name);
    else state.earned.delete(trophy.name);
    saveEarned(state.earned);
    renderAll();
  },
  onSelect(trophy) {
    state.selectedId = trophy.id;
    renderAll();
    elements.detailPane.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  },
};

for (const button of document.querySelectorAll('.tab')) {
  button.addEventListener('click', () => { switchView(button.dataset.view); });
}
for (const button of document.querySelectorAll('.kind')) {
  button.addEventListener('click', () => {
    state.kind = button.dataset.kind;
    for (const other of document.querySelectorAll('.kind')) other.classList.toggle('active', other === button);
    switchView('checklist');
    renderAll();
  });
}
elements.search.addEventListener('input', () => { state.query = elements.search.value; switchView('checklist'); renderAll(); });
elements.grade.addEventListener('change', () => { state.grade = elements.grade.value; switchView('checklist'); renderAll(); });
elements.hideEarned.addEventListener('change', () => { state.hideEarned = elements.hideEarned.checked; renderAll(); });
elements.spoilers.addEventListener('change', () => { state.spoilersOn = elements.spoilers.checked; renderAll(); });
elements.exportBtn.addEventListener('click', () => downloadProgress(state.earned));
elements.importFile.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  try {
    const names = parseProgressFile(await file.text());
    if (!names) throw new Error('not a progress file');
    const known = names.filter((name) => byName.has(name));
    state.earned = new Set(known);
    saveEarned(state.earned);
    elements.listNote.textContent = `Imported ${known.length} earned trophies from ${file.name}.`;
    renderAll();
  } catch {
    elements.listNote.textContent = `Could not import ${file.name}: it is not a progress file exported by this guide.`;
    renderAll();
  }
  event.target.value = '';
});
elements.resetBtn.addEventListener('click', () => {
  if (window.confirm('Reset all earned trophies? This clears the saved progress in this browser.')) {
    state.earned = new Set();
    clearEarned();
    renderAll();
  }
});

switchView(state.view);
renderAll();
