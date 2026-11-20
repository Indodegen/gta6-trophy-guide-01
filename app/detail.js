// Detail pane: the selected trophy's full guide, its missable warning, its
// roadmap stage, and the sources each fact comes from. When the spoiler setting
// hides a story trophy, the pane says so instead of showing the guide.
import { buildTrophyMeta, trophyIsSpoilerHidden } from './checklist.js';

function heading(pane, text) {
  const h = document.createElement('h3');
  h.textContent = text;
  pane.append(h);
}

export function renderDetail(pane, trophy, state, callbacks) {
  pane.replaceChildren();
  if (!trophy) {
    const placeholder = document.createElement('p');
    placeholder.className = 'placeholder';
    placeholder.textContent = 'Select a trophy from the checklist to read its full guide, its sources, and when it can be missed.';
    pane.append(placeholder);
    return;
  }

  const spoilerHidden = trophyIsSpoilerHidden(trophy, state.earned, state.spoilersOn);
  const title = document.createElement('h2');
  title.textContent = spoilerHidden ? 'Hidden story trophy' : trophy.name;
  pane.append(title);
  pane.append(buildTrophyMeta(trophy));

  if (!spoilerHidden) {
    const cite = document.createElement('p');
    cite.className = 'sources sources-top';
    cite.textContent = `Sources: ${trophy.sources.join(', ')}`;
    pane.append(cite);
  }

  const desc = document.createElement('p');
  desc.className = 'trophy-desc';
  desc.textContent = spoilerHidden
    ? 'This is a story trophy. Its name, description and guide stay hidden until you earn it — turn off “Hide story spoilers” to reveal it early.'
    : `Official description: “${trophy.description}”`;
  pane.append(desc);

  if (!spoilerHidden) {
    if (trophy.missable && trophy.missableReason) {
      const warn = document.createElement('p');
      warn.className = 'missable-callout';
      warn.textContent = `Missable — ${trophy.missableReason}`;
      pane.append(warn);
    }
    heading(pane, 'Guide');
    const guide = document.createElement('p');
    guide.className = 'guide-text';
    guide.textContent = trophy.guide;
    pane.append(guide);

    heading(pane, 'Sources');
    const sources = document.createElement('p');
    sources.className = 'sources';
    sources.textContent = `Facts above come from: ${trophy.sources.join(', ')}. Guide text is written for this entry in its own words.`;
    pane.append(sources);

    heading(pane, 'Roadmap stage');
    const stage = document.createElement('p');
    stage.textContent = `Stage ${trophy.stage} of the road to the platinum.`;
    pane.append(stage);
  }

  const toggle = document.createElement('button');
  toggle.type = 'button';
  const isEarned = state.earned.has(trophy.name);
  toggle.textContent = isEarned ? 'Mark as not earned' : 'Mark as earned';
  toggle.addEventListener('click', () => callbacks.onToggle(trophy, !isEarned));
  pane.append(toggle);
}
