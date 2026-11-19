// Progress and settings saved in the browser (localStorage), with export/import.
// Nothing is sent anywhere: the save lives only in this browser until the reader exports it.
export const SAVE_KEY = 'leonida-platinum-save-v1';

export function blankSave() {
  return { earned: [], spoilerSafe: true, hideEarned: false, version: 1 };
}

export function loadSave() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return blankSave();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return blankSave();
    return {
      earned: [...new Set(parsed.earned.filter((id) => Number.isInteger(id)))].sort((a, b) => a - b),
      spoilerSafe: parsed.spoilerSafe !== false,
      hideEarned: parsed.hideEarned === true,
      version: 1,
    };
  } catch (error) {
    return blankSave();
  }
}

export function persistSave(save) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch (error) {
    // Storage full or unavailable (private mode): the checklist still works in memory.
  }
}

export function isEarned(save, trophyId) {
  return save.earned.includes(trophyId);
}

export function toggleEarned(save, trophyId) {
  const at = save.earned.indexOf(trophyId);
  if (at === -1) save.earned.push(trophyId);
  else save.earned.splice(at, 1);
  save.earned.sort((a, b) => a - b);
  persistSave(save);
  return save;
}

export function exportSaveFile(save) {
  const blob = new Blob([JSON.stringify(save, null, 2) + '\n'], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'leonida-platinum-progress.json';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function parseImportedSave(text) {
  const parsed = JSON.parse(text);
  if (!parsed || typeof parsed !== 'object') throw new Error('Not a progress file.');
  if (!Array.isArray(parsed.earned)) throw new Error('Progress file has no earned list.');
  return {
    earned: parsed.earned.filter((id) => Number.isInteger(id)),
    spoilerSafe: parsed.spoilerSafe !== false,
    hideEarned: parsed.hideEarned === true,
    version: 1,
  };
}
