// Leonida Platinum — offline GTA VI trophy guide & tracker (no build step, no network).
// State lives in localStorage only; export/import round-trips it as JSON.
const STORE_KEY = 'leonida-platinum-v1';
const POINTS = { platinum: 180, gold: 90, silver: 30, bronze: 15 };
const TOTAL_POINTS = 180 + 2 * 90 + 6 * 30 + 46 * 15;

const ROADMAP = [
  { title: 'Play the story, eyes open', body: 'Play through the chapters in order and let the story trophies land as they come. Before each named mission below, check its trophy so a one-time moment does not pass you by.', trophies: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] },
  { title: 'Strangers, then the state', body: 'Between story beats, clear the stranger strands (Andy, Kenton, Billy, Randy, Tyrone, Bret and the rest) and start the long grinds early — stunts, races and exploration all count from the first hour.', trophies: [22, 23, 24, 25, 26, 27, 29, 15, 19, 42] },
  { title: 'Activities & minigames', body: 'Work the repeatable activities in batches: Shooting Range golds, drone races, fishing against Cal, arcade, bowling and meditation spots. These are pure practice — no story gate blocks them once unlocked.', trophies: [16, 17, 18, 20, 21, 28, 46, 32] },
  { title: 'Collectibles & money', body: 'Sweep the collectibles (cards, WAiNK spots, vehicles) and the money goals (marked-bill laundering, shop spending, garages, vehicle registration). Track counts in the checklist — several of these are the longest grinds in the list.', trophies: [30, 31, 35, 52, 53, 54, 55, 43] },
  { title: 'Combat, crime & cleanup', body: 'Finish with the combat and crime trophies, then mop up anything left. Check the Missables tab before the final mission — a few of these only happen in one situation.', trophies: [33, 34, 36, 37, 38, 39, 40, 41, 44, 45, 47, 48, 49, 50, 51, 14, 1] },
];

const $ = (id) => document.getElementById(id);
const listEl = $('trophyList');
const detailEl = $('detailPane');

let trophies = [];
let state = loadState();
let selectedId = null;
let currentView = 'checklist';

function loadState() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORE_KEY) ?? '{}');
    return {
      earned: new Set(Array.isArray(raw.earned) ? raw.earned : []),
      notes: (raw.notes && typeof raw.notes === 'object') ? raw.notes : {},
      spoilers: raw.spoilers === true,
    };
  } catch { return { earned: new Set(), notes: {}, spoilers: false }; }
}

function saveState() {
  localStorage.setItem(STORE_KEY, JSON.stringify({
    earned: [...state.earned], notes: state.notes, spoilers: state.spoilers,
  }));
}

function trophyById(id) { return trophies.find((t) => t.id === id); }
function isStory(t) { return t.kind === 'story'; }
function isSpoiled(t) { return state.spoilers && isStory(t) && !state.earned.has(t.name); }

function gradeLabel(t) { return t.grade; }
function pointsEarned() {
  return trophies.reduce((sum, t) => sum + (state.earned.has(t.name) ? POINTS[t.grade] || 15 : 0), 0);
}

function nextUpTrophy() {
  for (const stage of ROADMAP) {
    for (const id of stage.trophies) {
      const t = trophyById(id);
      if (t && !state.earned.has(t.name)) return t;
    }
  }
  return trophies.find((t) => !state.earned.has(t.name)) ?? null;
}

function matchesFilters(t) {
  const q = $('search').value.trim().toLowerCase();
  if (q && !(t.name + ' ' + t.description + ' ' + (t.guide || '') + ' ' + (t.steps || []).join(' ')).toLowerCase().includes(q)) return false;
  if ($('gradeFilter').value !== 'all' && t.grade !== $('gradeFilter').value) return false;
  const kind = $('kindFilter').value;
  if (kind !== 'all') {
    if (kind === 'missable' && !t.missable) return false;
    else if (kind !== 'missable' && t.kind !== kind) return false;
  }
  const status = $('statusFilter').value;
  if (status === 'earned' && !state.earned.has(t.name)) return false;
  if (status === 'remaining' && state.earned.has(t.name)) return false;
  return true;
}

function tagHtml(t) {
  const tags = [`<span class="grade grade-${t.grade}">${t.grade}</span>`];
  if (t.kind) tags.push(`<span class="tag ${t.kind === 'story' ? 'story' : ''}">${t.kind}</span>`);
  if (t.missable) tags.push('<span class="tag miss">⚠ Missable</span>');
  if (t.target) tags.push(`<span class="tag">${t.target}</span>`);
  return tags.join('');
}

function renderList(items, container) {
  container.replaceChildren();
  for (const t of items) {
    const li = document.createElement('li');
    li.className = 'trophy' + (state.earned.has(t.name) ? ' earned' : '') + (selectedId === t.id ? ' selected' : '');
    li.dataset.id = t.id;
    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = state.earned.has(t.name);
    box.setAttribute('aria-label', `Earned: ${t.name}`);
    box.addEventListener('click', (e) => e.stopPropagation());
    box.addEventListener('change', () => {
      if (box.checked) state.earned.add(t.name); else state.earned.delete(t.name);
      saveState(); renderAll();
    });
    const mid = document.createElement('div');
    if (isSpoiled(t)) {
      mid.innerHTML = `<div class="t-name spoiled">Hidden story trophy — earn it to reveal</div><div class="t-desc">Spoiler-safe mode hides this story trophy's name and description until you earn it.</div><div class="t-meta">${tagHtml(t)}</div>`;
    } else {
      const name = document.createElement('div'); name.className = 't-name'; name.textContent = t.name;
      const desc = document.createElement('div'); desc.className = 't-desc'; desc.textContent = t.description;
      const meta = document.createElement('div'); meta.className = 't-meta'; meta.innerHTML = tagHtml(t);
      mid.append(name, desc, meta);
    }
    const count = document.createElement('div');
    count.className = 't-count';
    count.textContent = state.earned.has(t.name) ? '✓ Earned' : (t.target || '');
    li.append(box, mid, count);
    li.addEventListener('click', () => { selectedId = t.id; renderAll(); });
    container.append(li);
  }
  if (!items.length) {
    const li = document.createElement('li');
    li.className = 'empty';
    li.textContent = 'No trophies match these filters.';
    container.append(li);
  }
}

function renderProgress() {
  const earned = state.earned.size;
  const total = trophies.length || 55;
  $('earnedCount').textContent = `${earned} / ${total}`;
  $('earnedPct').textContent = `${Math.round((earned / total) * 100)}% to platinum`;
  $('pointsLine').textContent = `${pointsEarned()} / ${TOTAL_POINTS} pts`;
  $('progressFill').style.width = `${(earned / total) * 100}%`;
  $('progressBar').setAttribute('aria-valuenow', String(earned));
  const next = nextUpTrophy();
  $('nextUp').innerHTML = next ? `Next up: <b></b>` : 'Next up: —';
  if (next) $('nextUp').querySelector('b').textContent = `${next.name} (${next.grade})`;
  $('missableCount').textContent = trophies.filter((t) => t.missable).length;
}

function renderDetail() {
  const t = selectedId ? trophyById(selectedId) : null;
  if (!t) {
    detailEl.innerHTML = '<h2>Pick a trophy</h2><p class="empty">Click any trophy in the list to see its full guide, steps, missable note and sources here.</p><p class="empty">Tick the box when you earn it — progress is saved in this browser.</p>';
    return;
  }
  const stage = ROADMAP.findIndex((s) => s.trophies.includes(t.id)) + 1;
  detailEl.innerHTML = '';
  const h = document.createElement('h2'); h.textContent = isSpoiled(t) ? 'Hidden story trophy' : t.name;
  const meta = document.createElement('div'); meta.className = 't-meta'; meta.innerHTML = tagHtml(t);
  const desc = document.createElement('p'); desc.className = 't-desc'; desc.textContent = isSpoiled(t) ? 'Spoiler-safe mode hides this story trophy until you earn it.' : t.description;
  detailEl.append(h, meta, desc);
  if (!isSpoiled(t)) {
    const gTitle = document.createElement('h3'); gTitle.textContent = 'Guide';
    const g = document.createElement('p'); g.textContent = t.guide || '';
    detailEl.append(gTitle, g);
    if (t.steps && t.steps.length) {
      const sTitle = document.createElement('h3'); sTitle.textContent = 'Steps';
      const ol = document.createElement('ol');
      for (const s of t.steps) { const li = document.createElement('li'); li.textContent = s; ol.append(li); }
      detailEl.append(sTitle, ol);
    }
    if (t.missable) {
      const mTitle = document.createElement('h3'); mTitle.textContent = '⚠ Missable — when it can be missed';
      const m = document.createElement('p'); m.textContent = t.missableNote || 'Tied to a one-time moment. Check before you play past it.';
      detailEl.append(mTitle, m);
    }
    const rTitle = document.createElement('h3'); rTitle.textContent = 'Roadmap';
    const r = document.createElement('p'); r.textContent = stage ? `Stage ${stage} of 5 — ${ROADMAP[stage - 1].title}.` : 'Cleanup — earn it whenever it fits.';
    detailEl.append(rTitle, r);
    const srcTitle = document.createElement('h3'); srcTitle.textContent = 'Sources';
    const src = document.createElement('p'); src.className = 'sources';
    src.innerHTML = `<b>Sources:</b> ${t.sources || 'Official list on Exophase (name, description, grade); PSNProfiles for PSN counts where listed; our own advice from the official description, not yet checked in the game.'}`;
    detailEl.append(srcTitle, src);
  }
  const nTitle = document.createElement('h3'); nTitle.textContent = 'Your note';
  const note = document.createElement('textarea');
  note.placeholder = 'Where did you find it? What worked? (saved in this browser)';
  note.value = state.notes[t.name] || '';
  note.setAttribute('aria-label', `Note for ${t.name}`);
  note.addEventListener('input', () => {
    if (note.value.trim()) state.notes[t.name] = note.value; else delete state.notes[t.name];
    saveState();
  });
  detailEl.append(nTitle, note);
}

function renderRoadmap() {
  const el = $('roadmapList');
  el.replaceChildren();
  ROADMAP.forEach((stage, i) => {
    const li = document.createElement('li');
    li.className = 'stage';
    const done = stage.trophies.filter((id) => { const t = trophyById(id); return t && state.earned.has(t.name); }).length;
    const h = document.createElement('h2'); h.textContent = stage.title;
    const p = document.createElement('p'); p.textContent = stage.body;
    const c = document.createElement('p'); c.className = 'stage-count'; c.textContent = `${done} / ${stage.trophies.length} earned in this stage`;
    const ul = document.createElement('ul');
    for (const id of stage.trophies) {
      const t = trophyById(id);
      if (!t) continue;
      const item = document.createElement('li');
      item.textContent = `${state.earned.has(t.name) ? '✓ ' : '○ '}${isSpoiled(t) ? 'Hidden story trophy' : t.name} — ${t.grade}${t.missable ? ' — ⚠ missable' : ''}`;
      ul.append(item);
    }
    li.append(h, p, c, ul);
    el.append(li);
  });
}

function renderAll() {
  renderProgress();
  const filtered = trophies.filter(matchesFilters);
  renderList(filtered, listEl);
  $('shownCount').textContent = `Showing ${filtered.length} of ${trophies.length} trophies · ${state.earned.size} earned`;
  if (currentView === 'missables') renderList(trophies.filter((t) => t.missable), $('missableList'));
  if (currentView === 'roadmap') renderRoadmap();
  renderDetail();
}

function switchView(view) {
  currentView = view;
  document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('active', b.dataset.view === view));
  document.querySelectorAll('.view').forEach((v) => v.classList.toggle('active', v.id === `view-${view}`));
  if (view === 'roadmap') renderRoadmap();
  if (view === 'missables') renderList(trophies.filter((t) => t.missable), $('missableList'));
}

function exportProgress() {
  const blob = new Blob([JSON.stringify({ app: 'leonida-platinum', earned: [...state.earned], notes: state.notes, exportedAt: new Date().toISOString() }, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-platinum-progress.json';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

async function importProgress(file) {
  const raw = JSON.parse(await file.text());
  const names = new Set(trophies.map((t) => t.name));
  const earned = Array.isArray(raw.earned) ? raw.earned.filter((n) => names.has(n)) : (Array.isArray(raw) ? raw.filter((n) => names.has(n)) : []);
  state.earned = new Set(earned);
  if (raw.notes && typeof raw.notes === 'object') state.notes = raw.notes;
  saveState(); renderAll();
  alert(`Imported ${earned.length} earned trophies.`);
}

// Deep links (?view=roadmap, ?grade=silver, ?open=17, ?seed=13, ?spoilers=on)
// let screenshots and shared links open the guide in a useful state.
function applyDeepLinks() {
  const params = new URLSearchParams(location.search);
  if (params.get('spoilers') === 'on') { state.spoilers = true; $('spoilerToggle').checked = true; }
  if (params.get('grade')) $('gradeFilter').value = params.get('grade');
  if (params.get('kind')) $('kindFilter').value = params.get('kind');
  if (params.get('q')) $('search').value = params.get('q');
  if (params.get('view')) switchView(params.get('view'));
  const seed = Number.parseInt(params.get('seed') || '', 10);
  if (Number.isFinite(seed) && seed > 0 && state.earned.size === 0) {
    for (const stage of ROADMAP) {
      for (const id of stage.trophies) {
        if (state.earned.size >= seed) break;
        const t = trophyById(id);
        if (t) state.earned.add(t.name);
      }
      if (state.earned.size >= seed) break;
    }
    saveState();
  }
  const open = Number.parseInt(params.get('open') || '', 10);
  if (Number.isFinite(open) && trophyById(open)) selectedId = open;
}

document.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => switchView(b.dataset.view)));
$('search').addEventListener('input', renderAll);
$('gradeFilter').addEventListener('change', renderAll);
$('kindFilter').addEventListener('change', renderAll);
$('statusFilter').addEventListener('change', renderAll);
$('spoilerToggle').addEventListener('change', () => { state.spoilers = $('spoilerToggle').checked; saveState(); renderAll(); });
$('exportBtn').addEventListener('click', exportProgress);
$('importFile').addEventListener('change', async (e) => { const f = e.target.files[0]; if (f) { try { await importProgress(f); } catch { alert('That file could not be imported — it is not a Leonida Platinum progress file.'); } } e.target.value = ''; });
$('resetBtn').addEventListener('click', () => { if (confirm('Clear all earned trophies and notes in this browser?')) { state.earned = new Set(); state.notes = {}; saveState(); renderAll(); } });

const doc = await (await fetch('data/trophies.json')).json();
trophies = doc.trophies;
$('spoilerToggle').checked = state.spoilers;
applyDeepLinks();
renderAll();
