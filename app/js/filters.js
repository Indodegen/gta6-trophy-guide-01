// Kind filters, text search and the spoiler rule.
// Spoiler rule: a story trophy the reader has not earned yet hides its name and
// official description while spoiler-safe mode is on. Earned trophies always show.
export const KIND_LABELS = {
  all: 'All',
  story: 'Story',
  missable: 'Missable',
  collectibles: 'Collectibles',
  activities: 'Activities',
  online: 'Online',
};

export function matchesKind(trophy, kind) {
  if (kind === 'all') return true;
  if (kind === 'missable') return trophy.missable === true;
  if (kind === 'online') return trophy.kind === 'online';
  return trophy.kind === kind;
}

export function matchesSearch(trophy, query) {
  const needle = (query || '').trim().toLowerCase();
  if (!needle) return true;
  const haystack = [trophy.name, trophy.description, trophy.kind, trophy.grade, trophy.guide || '']
    .join(' ')
    .toLowerCase();
  return haystack.includes(needle);
}

export function applyTrophyFilters(trophies, save, options) {
  return trophies.filter((trophy) => {
    if (!matchesKind(trophy, options.kind)) return false;
    if (!matchesSearch(trophy, options.query)) return false;
    if (options.grade !== 'all' && trophy.grade !== options.grade) return false;
    if (options.hideEarned && save.earned.includes(trophy.id)) return false;
    return true;
  });
}

export function isSpoilerHidden(trophy, save) {
  return save.spoilerSafe && trophy.kind === 'story' && !save.earned.includes(trophy.id);
}

export function displayName(trophy, save) {
  return isSpoilerHidden(trophy, save) ? 'Hidden story trophy' : trophy.name;
}

export function displayDescription(trophy, save) {
  return isSpoilerHidden(trophy, save)
    ? 'Hidden until earned — turn spoiler-safe mode off in Settings to reveal it.'
    : trophy.description;
}
