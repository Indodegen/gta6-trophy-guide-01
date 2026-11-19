// Boots Leonida Platinum: loads the trophy list, wires the tabs, filters,
// spoiler setting, checklist and the export/import save flow.
import { loadTrophyList } from './data.js';
import { loadSave, persistSave, toggleEarned, exportSaveFile, parseImportedSave, blankSave } from './store.js';
import { applyTrophyFilters } from './filters.js';
import { renderChecklist, renderDetail, renderRoadmap, renderMissables, renderProgress } from './views.js';

const state = {
  trophies: [],
  save: loadSave(),
  kind: 'all',
  grade: 'all',
  query: '',
  selectedId: null,
};

function refreshAll() {
  const filtered = applyTrophyFilters(state.trophies, state.save, {
    kind: state.kind,
    grade: state.grade,
    query: state.query,
    hideEarned: state.save.hideEarned,
  });
  renderChecklist(
    document.getElementById('trophyList'),
    document.getElementById('listStatus'),
    filtered,
    state.save,
    state.selectedId,
    (id) => {
      state.selectedId = id;
      refreshAll();
    },
    (id) => {
      state.save = toggleEarned(state.save, id);
      refreshAll();
    },
  );
  const selected = state.trophies.find((t) => t.id === state.selectedId) || null;
  renderDetail(document.getElementById('detailPane'), selected, state.save);
  renderRoadmap(document.getElementById('roadmapStages'), state.trophies, state.save);
  renderMissables(document.getElementById('missableList'), state.trophies, state.save);
  renderProgress(state.save.earned.length, state.trophies.length);
  document.title =
    state.save.earned.length > 0
      ? `Leonida Platinum — ${state.save.earned.length}/55 earned`
      : 'Leonida Platinum — GTA VI Trophy Guide & Tracker';
  syncSettingsControls();
}

function syncSettingsControls() {
  const spoilerMain = document.getElementById('spoilerToggle');
  const spoilerSettings = document.getElementById('spoilerToggleSettings');
  const hideEarned = document.getElementById('hideEarned');
  if (spoilerMain) spoilerMain.checked = state.save.spoilerSafe;
  if (spoilerSettings) spoilerSettings.checked = state.save.spoilerSafe;
  if (hideEarned) hideEarned.checked = state.save.hideEarned;
}

function setSpoilerSafe(value) {
  state.save.spoilerSafe = value;
  persistSave(state.save);
  refreshAll();
}

function switchView(name) {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.view === name);
  });
  document.querySelectorAll('.view').forEach((view) => {
    view.classList.toggle('active', view.id === 'view-' + name);
  });
}

function wireToolbar() {
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => switchView(tab.dataset.view));
  });
  document.querySelectorAll('.filter[data-kind]').forEach((button) => {
    button.addEventListener('click', () => {
      state.kind = button.dataset.kind;
      document.querySelectorAll('.filter[data-kind]').forEach((b) => b.classList.toggle('active', b === button));
      refreshAll();
    });
  });
  document.querySelectorAll('.filter[data-grade]').forEach((button) => {
    button.addEventListener('click', () => {
      state.grade = button.dataset.grade;
      document.querySelectorAll('.filter[data-grade]').forEach((b) => b.classList.toggle('active', b === button));
      refreshAll();
    });
  });
  document.getElementById('searchInput').addEventListener('input', (event) => {
    state.query = event.target.value.trim();
    refreshAll();
  });
  document.getElementById('hideEarned').addEventListener('change', (event) => {
    state.save.hideEarned = event.target.checked;
    persistSave(state.save);
    refreshAll();
  });
  document.getElementById('spoilerToggle').addEventListener('change', (event) => setSpoilerSafe(event.target.checked));
  document.getElementById('spoilerToggleSettings').addEventListener('change', (event) => setSpoilerSafe(event.target.checked));
}

function wireSaveFlow() {
  document.getElementById('exportButton').addEventListener('click', () => exportSaveFile(state.save));
  document.getElementById('importFile').addEventListener('change', (event) => {
    const file = event.target.files && event.target.files[0];
    const status = document.getElementById('importStatus');
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = parseImportedSave(String(reader.result));
        // Keep only trophy ids that exist in this list.
        const known = new Set(state.trophies.map((t) => t.id));
        imported.earned = imported.earned.filter((id) => known.has(id));
        state.save = imported;
        persistSave(state.save);
        refreshAll();
        status.textContent = 'Imported ' + imported.earned.length + ' earned trophies.';
      } catch (error) {
        status.textContent = 'Import failed: ' + error.message;
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  });
  document.getElementById('resetButton').addEventListener('click', () => {
    if (window.confirm('Clear all earned trophies and settings in this browser?')) {
      state.save = blankSave();
      persistSave(state.save);
      state.selectedId = null;
      refreshAll();
    }
  });
}

async function bootGuide() {
  try {
    const { trophies } = await loadTrophyList();
    state.trophies = trophies;
  } catch (error) {
    document.getElementById('listStatus').textContent = 'Could not load the trophy list: ' + error.message;
    return;
  }
  wireToolbar();
  wireSaveFlow();
  refreshAll();
}

bootGuide();
