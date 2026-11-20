// Vice Platinum — GTA VI trophy guide & tracker.
// All state lives in this browser (localStorage). The trophy data, including every
// guide and its cited sources, is loaded from data/trophies.json beside this file.

const STORAGE_KEY = 'vice-platinum-progress-v1';

const STAGES = [
  {
    n: 1, title: 'Chapter 1 — and the one missable',
    when: 'Start of the story · ~2 hours in',
    text: 'Play the opening: Gone Fishing, Breakfast Run and the rest of Chapter 1. Before the chapter ends, take Lucia up on her meditation invitation at Jason\u2019s house (after Down to Earth) — it feeds Positive Mental Attitude, the only trophy on this list that can be lost. Everything else can wait for free-roam.',
  },
  {
    n: 2, title: 'Finish the story & the stranger strands',
    when: 'Chapters 2–5 · 60–80 hours',
    text: 'Complete Chapters 2, 3 and 4, the named set-piece missions (The Cartel Heist, Child\u2019s Play, Headliners, VCIA Takedown, Operation Savage Glory) and the final mission. Along the way, finish the five named stranger strands — Andy, Kenton, Billy, Randy, Tyrone — and Bret\u2019s hunt. Quest givers sometimes pause during story beats; if an icon vanishes, advance the story and return.',
  },
  {
    n: 3, title: 'The 100% completion push',
    when: 'After the finale · ~100 hours',
    text: 'The 100% checklist (Progress > Stats) only becomes viewable once the story is done, and it is the road to A Long Road. Work its categories with the activity trophies riding along: 250 stunts, gold in all 42 Shooting Range challenges, drone races at every Top Fun location, 20 different race wins, Cal\u2019s fishing challenge, an arcade game, and 50 of the game\u2019s challenges.',
  },
  {
    n: 4, title: 'Collectibles & the full map',
    when: 'Free-roam cleanup',
    text: 'Tour Leonida region by region: finish 3 collectible card sets, WAiNK at 100 locations, discover 100 vehicles, uncover the whole map for The Goodtime State, meditate at the remaining spots, and buy every garage property. These four sweeps share the same roads — do them in the same trips.',
  },
  {
    n: 5, title: 'Feats, scores & the platinum',
    when: 'Final cleanup',
    text: 'Close out the one-off feats and the money trophies: the robbery route (jewelry store undetected, 5 bank vaults, an armored truck, one illegal operation per gang) feeds the $250,000 of Marked Bills to launder; $100,000 spent in shops and 10 Scooter Bros registrations accumulate on their own. When the 54th trophy lands, Vice Got a Price! — the platinum — follows automatically.',
  },
];

const KIND_LABELS = { story: 'Story', missable: 'Missable', collectibles: 'Collectibles', activities: 'Activities', online: 'Online' };
const GRADE_LABELS = { platinum: 'Platinum', gold: 'Gold', silver: 'Silver', bronze: 'Bronze' };

let trophies = [];
let progress = loadProgress();
let selectedId = 1;
let activeKind = 'all';
let activeView = 'tracker';

function loadProgress() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
    if (raw && typeof raw === 'object') {
      return {
        earned: raw.earned ?? {},
        counts: raw.counts ?? {},
        notes: raw.notes ?? {},
        spoiler: !!raw.spoiler,
        hideEarned: !!raw.hideEarned,
      };
    }
  } catch { /* a corrupt save falls through to a fresh one */ }
  return { earned: {}, counts: {}, notes: {}, spoiler: false, hideEarned: false };
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function trophyById(id) {
  return trophies.find((t) => t.id === id);
}

function isEarned(t) {
  return !!progress.earned[t.id];
}

function currentCount(t) {
  return Math.min(progress.counts[t.id] ?? 0, t.count ?? 0);
}

// Spoiler protection: an unearned story or hidden trophy is masked until earned.
function isMasked(t) {
  return progress.spoiler && !isEarned(t) && (t.hidden || t.kind === 'story');
}

function displayName(t) {
  return isMasked(t) ? 'Hidden Trophy' : t.name;
}

function cupSvg(grade) {
  return `<svg class="cup ${grade}" viewBox="0 0 48 48" aria-hidden="true"><path d="M14 6h20v6h6a2 2 0 0 1 2 2c0 6.5-4.6 11-10.4 11.6A12 12 0 0 1 27 30.9V36h5v6H16v-6h5v-5.1A12 12 0 0 1 16.4 25.6C10.6 25 6 20.5 6 14a2 2 0 0 1 2-2h6V6zm-4 10c.5 3.4 2.3 5.7 4.6 6.4A17 17 0 0 1 14 16h-4zm28 0h-4a17 17 0 0 1-.6 6.4c2.3-.7 4.1-3 4.6-6.4z" fill="currentColor"/></svg>`;
}

function tagRow(t) {
  const tags = [`<span class="tag grade-${t.grade}">${GRADE_LABELS[t.grade]}</span>`,
    `<span class="tag kind">${KIND_LABELS[t.kind]}</span>`];
  if (t.missable) tags.push('<span class="tag missable">Missable</span>');
  if (t.hidden) tags.push('<span class="tag hidden-tag">Hidden on PSN</span>');
  if (t.count) tags.push(`<span class="tag count">${currentCount(t)} / ${t.count} ${t.countUnit}</span>`);
  return tags.join('');
}

function renderHeader() {
  const earned = trophies.filter(isEarned).length;
  document.getElementById('progress-count').textContent = `${earned} / ${trophies.length}`;
  const pct = Math.round((earned / trophies.length) * 100);
  document.getElementById('progress-pct').textContent = `${pct}% to platinum`;
  document.getElementById('progress-fill').style.width = `${pct}%`;
  document.getElementById('grade-tallies').innerHTML = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => {
      const all = trophies.filter((t) => t.grade === g);
      const got = all.filter(isEarned).length;
      return `<span>${GRADE_LABELS[g]} <b>${got}/${all.length}</b></span>`;
    }).join('');
}

function renderKindChips() {
  const kinds = ['all', 'story', 'missable', 'collectibles', 'activities', 'online'];
  document.getElementById('kind-chips').innerHTML = kinds
    .map((k) => {
      const n = k === 'all' ? trophies.length : trophies.filter((t) => t.kind === k).length;
      const label = k === 'all' ? 'All' : KIND_LABELS[k];
      return `<button class="chip ${activeKind === k ? 'active' : ''}" data-kind="${k}">${label} <span class="n">${n}</span></button>`;
    }).join('');
  document.querySelectorAll('#kind-chips .chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      activeKind = chip.dataset.kind;
      renderKindChips();
      renderTrophyList();
    });
  });
}

function visibleTrophies() {
  const query = document.getElementById('search').value.trim().toLowerCase();
  const grade = document.getElementById('grade-filter').value;
  return trophies.filter((t) => {
    if (activeKind !== 'all' && t.kind !== activeKind) return false;
    if (grade !== 'all' && t.grade !== grade) return false;
    if (progress.hideEarned && isEarned(t)) return false;
    if (query) {
      if (isMasked(t)) return false;
      const hay = `${t.name} ${t.description} ${t.guide}`.toLowerCase();
      if (!hay.includes(query)) return false;
    }
    return true;
  });
}

function renderTrophyList() {
  const list = document.getElementById('trophy-list');
  const visible = visibleTrophies();
  document.getElementById('list-count').textContent =
    `Showing ${visible.length} of ${trophies.length} trophies — click one for its guide.`;
  list.innerHTML = visible.map((t) => `
    <li>
      <button class="trophy-row ${isEarned(t) ? 'earned' : ''} ${t.id === selectedId ? 'selected' : ''}" data-id="${t.id}">
        <span class="check" data-check="${t.id}" title="Mark earned">${isEarned(t) ? '✓' : ''}</span>
        ${cupSvg(t.grade)}
        <span class="row-main">
          <span class="row-name">${escapeHtml(displayName(t))}</span>
          <span class="row-desc">${isMasked(t) ? 'Masked by spoiler protection until earned.' : escapeHtml(t.description)}</span>
          <span class="row-meta">${tagRow(t)}</span>
        </span>
      </button>
    </li>`).join('');
  list.querySelectorAll('.trophy-row').forEach((row) => {
    row.addEventListener('click', (ev) => {
      const id = Number(row.dataset.id);
      if (ev.target.closest('[data-check]')) {
        toggleEarned(id);
      } else {
        selectTrophy(id);
      }
    });
  });
}

function renderDetail() {
  const pane = document.getElementById('detail-pane');
  const t = trophyById(selectedId) ?? trophies[0];
  if (!t) { pane.innerHTML = ''; return; }
  const masked = isMasked(t);
  const earned = isEarned(t);
  const counter = t.count ? `
    <h3>Your count</h3>
    <div class="counter-box">
      <span class="big">${currentCount(t).toLocaleString('en-US')}</span>
      <span class="unit">of ${t.count.toLocaleString('en-US')} ${escapeHtml(t.countUnit)}</span>
      <span class="stepper">
        <button data-step="-1" aria-label="Decrease">−</button>
        <input id="count-input" type="number" min="0" max="${t.count}" value="${currentCount(t)}">
        <button data-step="1" aria-label="Increase">+</button>
      </span>
      <span class="mini-bar"><div style="width:${Math.round((currentCount(t) / t.count) * 100)}%"></div></span>
    </div>` : '';
  const steps = !masked && t.steps.length ? `
    <h3>Steps</h3>
    <ol class="steps">${t.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>` : '';
  const warning = t.missable && !earned ? `
    <p class="missable-warning"><strong>⚠ The one missable.</strong> The Chapter 1 meditation invitation passes for good when the chapter ends — accept it before moving on (full walkthrough in the Missables tab).</p>` : '';
  pane.innerHTML = `
    <h2>${cupSvg(t.grade)}<span class="${masked ? 'masked-name' : ''}">${escapeHtml(displayName(t))}</span></h2>
    ${masked
      ? '<div class="masked-block">Spoiler protection is on. This trophy\u2019s name, official description and guide stay hidden until you earn it — that is the point of a hidden trophy.</div>'
      : `<p class="official">${escapeHtml(t.description)}</p>`}
    <div class="detail-tags">${tagRow(t)}<span class="tag">Roadmap stage ${t.stage}</span></div>
    ${warning}
    ${masked ? '' : `<h3>The guide</h3><p class="guide-text">${escapeHtml(t.guide)}</p>${steps}${counter}`}
    <h3>Your notes</h3>
    <textarea class="notes" id="note-input" placeholder="Your own notes for this trophy — saved in this browser.">${escapeHtml(progress.notes[t.id] ?? '')}</textarea>
    <h3>Sources for this guide</h3>
    <ul class="sources">${t.sources.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${escapeHtml(s.name)}</a></li>`).join('')}</ul>
    <button class="earn-btn ${earned ? 'is-earned' : ''}" id="earn-btn">${earned ? '✓ Earned — tap to undo' : 'Mark as earned'}</button>`;
  pane.querySelector('#earn-btn').addEventListener('click', () => toggleEarned(t.id));
  pane.querySelector('#note-input').addEventListener('input', (ev) => {
    progress.notes[t.id] = ev.target.value;
    saveProgress();
  });
  pane.querySelectorAll('[data-step]').forEach((btn) => {
    btn.addEventListener('click', () => setTrophyCount(t.id, currentCount(t) + Number(btn.dataset.step)));
  });
  const input = pane.querySelector('#count-input');
  if (input) {
    input.addEventListener('change', () => setTrophyCount(t.id, Number(input.value) || 0));
  }
}

function renderRoadmap() {
  document.getElementById('roadmap-body').innerHTML = STAGES.map((stage) => {
    const members = trophies.filter((t) => t.stage === stage.n);
    const done = members.filter(isEarned).length;
    return `
    <section class="stage">
      <div class="stage-head">
        <span class="stage-num">Stage ${stage.n}</span>
        <h3>${escapeHtml(stage.title)}</h3>
        <span class="stage-when">${escapeHtml(stage.when)}</span>
      </div>
      <p>${escapeHtml(stage.text)}</p>
      <div class="stage-progress">
        <span><strong>${done} / ${members.length}</strong> earned</span>
        <span class="mini-bar"><div style="width:${members.length ? Math.round((done / members.length) * 100) : 0}%"></div></span>
      </div>
      <div class="stage-trophies">${members.map((t) => `
        <button class="stage-trophy ${isEarned(t) ? 'done' : ''}" data-id="${t.id}">
          <span class="dot ${t.grade}"></span>${escapeHtml(displayName(t))}${t.missable ? ' ⚠' : ''}
        </button>`).join('')}
      </div>
    </section>`;
  }).join('');
  document.querySelectorAll('#roadmap-body .stage-trophy').forEach((btn) => {
    btn.addEventListener('click', () => {
      selectTrophy(Number(btn.dataset.id));
      switchView('tracker');
    });
  });
}

function renderMissables() {
  const t = trophies.find((x) => x.missable);
  const body = document.getElementById('missables-body');
  if (!t) { body.innerHTML = ''; return; }
  body.innerHTML = `
    <div class="missable-hero">
      <h3>${cupSvg(t.grade)} ${escapeHtml(t.name)} <span class="tag missable">Potentially missable</span></h3>
      <p class="official">${escapeHtml(t.description)}</p>
      <p class="guide-text">${escapeHtml(t.guide)}</p>
      <ol class="steps">${t.steps.map((s) => `<li>${escapeHtml(s)}</li>`).join('')}</ol>
      <h3>Sources</h3>
      <ul class="sources">${t.sources.map((s) => `<li><a href="${s.url}" target="_blank" rel="noopener">${escapeHtml(s.name)}</a></li>`).join('')}</ul>
      <button class="earn-btn ${isEarned(t) ? 'is-earned' : ''}" id="missable-earn">${isEarned(t) ? '✓ Earned — the platinum is safe' : 'Mark as earned'}</button>
    </div>
    <section class="stage">
      <div class="stage-head"><span class="stage-num">Good news</span><h3>Everything else waits for you</h3></div>
      <p>Every other trophy on the list — all 54 of them — can be earned in free-roam after the final mission. There is no mission replay, but none is needed: the 100% checklist, the collectibles, the stranger strands and the feats all stay available. Two softer warnings from the roadmap guides: some stranger quest givers (Kenton is the named example) become <em>temporarily</em> unavailable during story beats, and optional non-trophy missions can expire — neither locks a trophy. Also note: guides report that cheat codes disable trophies, so keep them off for a trophy run.</p>
    </section>`;
  body.querySelector('#missable-earn').addEventListener('click', () => toggleEarned(t.id));
}

function renderNextUp() {
  const picks = [];
  const missable = trophies.find((t) => t.missable && !isEarned(t));
  if (missable) {
    picks.push({ t: missable, why: 'The only missable trophy — its Chapter 1 moment passes for good. Do this before anything else.' });
  }
  trophies
    .filter((t) => t.count && !isEarned(t) && t !== missable)
    .sort((a, b) => (currentCount(b) / b.count) - (currentCount(a) / a.count))
    .slice(0, 3)
    .forEach((t) => picks.push({
      t,
      why: `Counter at ${currentCount(t).toLocaleString('en-US')} of ${t.count.toLocaleString('en-US')} ${t.countUnit} — among your closest to popping.`,
    }));
  trophies
    .filter((t) => t.kind === 'story' && !isEarned(t) && !picks.some((p) => p.t === t))
    .slice(0, 2)
    .forEach((t) => picks.push({ t, why: `Next story beat on the roadmap (Stage ${t.stage}) — the campaign carries the platinum.` }));
  trophies
    .filter((t) => !isEarned(t) && !t.hidden && !picks.some((p) => p.t === t))
    .slice(0, Math.max(0, 6 - picks.length))
    .forEach((t) => picks.push({ t, why: `Roadmap Stage ${t.stage} — visible on PSN, so no surprises: read its guide and plan it into your route.` }));
  const body = document.getElementById('next-body');
  if (!picks.length) {
    body.innerHTML = '<p class="empty-note">Everything is earned — Leonida Legend status achieved. 🏆</p>';
    return;
  }
  body.innerHTML = picks.slice(0, 6).map((p, i) => `
    <button class="next-card" data-id="${p.t.id}">
      <span class="next-rank">${i + 1}</span>
      ${cupSvg(p.t.grade)}
      <span>
        <span class="row-name">${escapeHtml(displayName(p.t))}</span>
        <span class="next-why">${escapeHtml(p.why)}</span>
      </span>
    </button>`).join('');
  body.querySelectorAll('.next-card').forEach((card) => {
    card.addEventListener('click', () => {
      selectTrophy(Number(card.dataset.id));
      switchView('tracker');
    });
  });
}

function renderAll() {
  renderHeader();
  renderKindChips();
  renderTrophyList();
  renderDetail();
  renderRoadmap();
  renderMissables();
  renderNextUp();
  document.getElementById('spoiler-note').hidden = !progress.spoiler;
}

function selectTrophy(id) {
  selectedId = id;
  renderTrophyList();
  renderDetail();
}

function toggleEarned(id) {
  const t = trophyById(id);
  if (!t) return;
  if (progress.earned[id]) {
    delete progress.earned[id];
  } else {
    progress.earned[id] = true;
    if (t.count) progress.counts[id] = t.count;
  }
  saveProgress();
  renderAll();
}

function setTrophyCount(id, value) {
  const t = trophyById(id);
  if (!t || !t.count) return;
  const clamped = Math.max(0, Math.min(t.count, Math.floor(value)));
  progress.counts[id] = clamped;
  if (clamped >= t.count) progress.earned[id] = true;
  saveProgress();
  renderAll();
}

function exportProgress() {
  const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'vice-platinum-progress.json';
  a.click();
  URL.revokeObjectURL(url);
}

function importProgress(file) {
  file.text().then((text) => {
    try {
      const data = JSON.parse(text);
      if (!data || typeof data !== 'object' || typeof data.earned !== 'object') throw new Error('shape');
      progress = {
        earned: data.earned ?? {},
        counts: data.counts ?? {},
        notes: data.notes ?? {},
        spoiler: !!data.spoiler,
        hideEarned: !!data.hideEarned,
      };
      saveProgress();
      syncControls();
      renderAll();
    } catch {
      alert('That file does not look like a Vice Platinum progress export.');
    }
  });
}

function resetProgress() {
  if (!confirm('Reset all progress, counts and notes? This cannot be undone.')) return;
  progress = { earned: {}, counts: {}, notes: {}, spoiler: progress.spoiler, hideEarned: false };
  saveProgress();
  syncControls();
  renderAll();
}

function switchView(name) {
  activeView = name;
  document.querySelectorAll('.tab').forEach((tab) => tab.classList.toggle('active', tab.dataset.view === name));
  document.querySelectorAll('.view').forEach((view) => view.classList.toggle('active', view.id === `view-${name}`));
}

function syncControls() {
  document.getElementById('spoiler-toggle').checked = progress.spoiler;
  document.getElementById('hide-earned').checked = progress.hideEarned;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

async function initApp() {
  const response = await fetch('data/trophies.json');
  const data = await response.json();
  trophies = data.trophies ?? data;
  syncControls();
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => switchView(tab.dataset.view));
  });
  document.getElementById('search').addEventListener('input', renderTrophyList);
  document.getElementById('grade-filter').addEventListener('change', renderTrophyList);
  document.getElementById('spoiler-toggle').addEventListener('change', (ev) => {
    progress.spoiler = ev.target.checked;
    saveProgress();
    renderAll();
  });
  document.getElementById('hide-earned').addEventListener('change', (ev) => {
    progress.hideEarned = ev.target.checked;
    saveProgress();
    renderTrophyList();
  });
  document.getElementById('export-btn').addEventListener('click', exportProgress);
  document.getElementById('import-file').addEventListener('change', (ev) => {
    if (ev.target.files[0]) importProgress(ev.target.files[0]);
    ev.target.value = '';
  });
  document.getElementById('reset-btn').addEventListener('click', resetProgress);
  renderAll();
}

initApp();
