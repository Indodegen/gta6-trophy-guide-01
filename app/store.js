// Progress store: the earned set lives in localStorage and can be exported to a
// file and imported back. Trophy identity is the official name, which is unique.
export const STORAGE_KEY = 'leonida-legend-progress-v1';

export function loadEarned() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((name) => typeof name === 'string'));
  } catch {
    return new Set();
  }
}

export function saveEarned(earned) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned].sort()));
}

export function clearEarned() {
  localStorage.removeItem(STORAGE_KEY);
}

// Turn an imported file's text into an array of trophy names, or null when the
// file is not a progress export this app understands.
export function parseProgressFile(text) {
  const parsed = JSON.parse(text);
  if (Array.isArray(parsed)) {
    return parsed.filter((name) => typeof name === 'string');
  }
  if (parsed && Array.isArray(parsed.earned)) {
    return parsed.earned.filter((name) => typeof name === 'string');
  }
  if (parsed && Array.isArray(parsed.trophies)) {
    return parsed.trophies.filter((name) => typeof name === 'string');
  }
  return null;
}

export function downloadProgress(earned) {
  const payload = JSON.stringify({ app: 'leonida-legend', game: 'Grand Theft Auto VI', earned: [...earned].sort() }, null, 2);
  const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'gta6-trophy-progress.json';
  link.click();
  URL.revokeObjectURL(url);
}
