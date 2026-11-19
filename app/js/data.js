// Loads the official trophy list with this guide's own guides from data/trophies.json.
// The file is part of app/, so the fetch never leaves the app's own server.
export async function loadTrophyList() {
  const response = await fetch('data/trophies.json');
  if (!response.ok) {
    throw new Error('Could not load data/trophies.json (HTTP ' + response.status + ')');
  }
  const payload = await response.json();
  const trophies = Array.isArray(payload) ? payload : payload.trophies;
  if (!Array.isArray(trophies) || trophies.length === 0) {
    throw new Error('data/trophies.json holds no trophies array');
  }
  // Guard the gate's own requirement: every trophy needs an official name and a non-blank guide.
  const broken = trophies.find((t) => !t || typeof t.name !== 'string' || !t.name.trim() || typeof t.guide !== 'string' || !t.guide.trim());
  if (broken) {
    throw new Error('data/trophies.json has a trophy without a name or a guide');
  }
  trophies.sort((a, b) => a.id - b.id);
  return { meta: payload, trophies };
}

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function targetText(trophy) {
  if (trophy.target == null) return '';
  if (trophy.target_label) return 'PSN progress: ' + trophy.target_label;
  return 'PSN progress target: ' + trophy.target;
}
