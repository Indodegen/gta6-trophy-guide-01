// Roadmap view: the five stages to the platinum, each with its goal, its advice,
// and the trophies that belong to it, with per-stage progress. The overview strip
// names all five stages at a glance, so the whole road fits in one screen.
export function renderRoadmap(stageList, introElement, overviewElement, roadmap, trophies, earned, onSelect) {
  introElement.textContent = roadmap.intro;
  overviewElement.replaceChildren();
  for (const stage of roadmap.stages) {
    const members = trophies.filter((trophy) => trophy.stage === stage.stage);
    const done = members.filter((trophy) => earned.has(trophy.name)).length;
    const chip = document.createElement('li');
    chip.textContent = `${stage.stage}. ${stage.name} — ${done}/${members.length}`;
    overviewElement.append(chip);
  }
  stageList.replaceChildren();
  for (const stage of roadmap.stages) {
    const members = trophies.filter((trophy) => trophy.stage === stage.stage);
    const done = members.filter((trophy) => earned.has(trophy.name)).length;

    const item = document.createElement('li');
    const title = document.createElement('h3');
    title.textContent = stage.name;
    item.append(title);

    const goal = document.createElement('p');
    goal.className = 'stage-goal';
    goal.textContent = stage.goal;
    item.append(goal);

    const advice = document.createElement('p');
    advice.className = 'stage-advice';
    advice.textContent = stage.advice;
    item.append(advice);

    const progress = document.createElement('p');
    progress.className = 'stage-progress';
    progress.textContent = `${done} of ${members.length} trophies earned in this stage · ${stage.time}`;
    item.append(progress);

    const chips = document.createElement('ul');
    chips.className = 'stage-trophies';
    for (const trophy of members) {
      const chip = document.createElement('li');
      chip.textContent = `${trophy.name} (${trophy.grade})`;
      if (earned.has(trophy.name)) chip.classList.add('earned');
      chip.addEventListener('click', () => onSelect(trophy));
      chips.append(chip);
    }
    item.append(chips);
    stageList.append(item);
  }
}
