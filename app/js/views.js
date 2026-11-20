// views.js — renders the tracker list, the detail pane, the roadmap,
// the missables page and the "Next up" pick. All DOM is built with
// textContent/createElement so trophy text is never parsed as HTML.

const Views = {
  trophies: [],
  selectedId: null,

  el(tag, cls, text) {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined) n.textContent = text;
    return n;
  },

  cupSVG(grade) {
    const wrap = document.createElement("span");
    wrap.className = "cup grade-" + grade;
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML =
      '<svg width="26" height="26" viewBox="0 0 24 24"><path class="cup-body" d="M6 3h12v2h3v3a5 5 0 0 1-5 5h-.42A6 6 0 0 1 13 15.92V18h3v3H8v-3h3v-2.08A6 6 0 0 1 8.42 13H8a5 5 0 0 1-5-5V5h3V3zm-1 4v1a3 3 0 0 0 3 3V7H5zm14 0h-2v4a3 3 0 0 0 2-3V7z"/></svg>';
    return wrap;
  },

  gradeChip(grade) {
    return this.el("span", "grade-chip grade-" + grade, grade);
  },

  // ---------- header progress ----------
  renderProgress(state) {
    const total = this.trophies.length;
    const earned = this.trophies.filter((t) => state.earned[t.id]);
    document.getElementById("earned-count").textContent = String(earned.length);
    const byGrade = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
    for (const t of earned) byGrade[t.grade] += 1;
    document.getElementById("grade-line").textContent =
      byGrade.platinum + " platinum · " + byGrade.gold + " gold · " +
      byGrade.silver + " silver · " + byGrade.bronze + " bronze";
    const pct = total ? Math.round((earned.length / total) * 100) : 0;
    document.getElementById("pct").textContent = pct + "%";
    document.getElementById("bar-fill").style.width = pct + "%";
    document.getElementById("bar").setAttribute("aria-valuenow", String(earned.length));
    this.renderNextUp(state);
  },

  nextUpPick(state) {
    const missable = this.trophies.find((t) => t.missable && !state.earned[t.id]);
    if (missable) return { trophy: missable, why: "the list's one missable — grab it in Chapter 1" };
    for (const stage of [1, 2, 3, 4, 5]) {
      const t = this.trophies.find((x) => x.stage === stage && !state.earned[x.id] && x.kind !== "platinum");
      if (t) return { trophy: t, why: "next on the roadmap, stage " + stage };
    }
    const plat = this.trophies.find((t) => t.kind === "platinum" && !state.earned[t.id]);
    if (plat) return { trophy: plat, why: "it lands with the last of the other 54" };
    return null;
  },

  renderNextUp(state) {
    const box = document.getElementById("next-up");
    box.textContent = "";
    const pick = this.nextUpPick(state);
    if (!pick) {
      box.textContent = "Platinum earned — welcome to the legend club, Vice City style.";
      return;
    }
    box.append(
      document.createTextNode("Next up: "),
      this.el("strong", null, pick.trophy.name),
      document.createTextNode(" — " + pick.why + ".")
    );
  },

  // ---------- tracker list ----------
  renderKindChips(state) {
    const host = document.getElementById("kind-chips");
    host.textContent = "";
    for (const k of TROPHY_KINDS) {
      const b = this.el("button", "chip" + (TrophyFilters.criteria.kind === k.id ? " active" : ""));
      b.type = "button";
      b.append(
        document.createTextNode(k.label + " "),
        this.el("span", "n", String(TrophyFilters.kindCount(this.trophies, k.id)))
      );
      b.addEventListener("click", () => {
        TrophyFilters.set({ kind: k.id });
        App.refresh();
      });
      host.append(b);
    }
  },

  renderList(state) {
    const list = document.getElementById("trophy-list");
    list.textContent = "";
    const shown = TrophyFilters.apply(this.trophies, state);
    document.getElementById("result-line").textContent =
      "Showing " + shown.length + " of " + this.trophies.length + " trophies";
    for (const t of shown) list.append(this.row(t, state));
    if (!shown.length) {
      list.append(this.el("li", "placeholder", "No trophies match those filters."));
    }
  },

  row(t, state) {
    const li = document.createElement("li");
    const btn = this.el("button", "trophy-row" + (state.earned[t.id] ? " earned" : "") + (this.selectedId === t.id ? " selected" : ""));
    btn.type = "button";

    const checkWrap = this.el("span", "check-box");
    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = !!state.earned[t.id];
    check.setAttribute("aria-label", "Mark " + t.name + " as earned");
    check.addEventListener("click", (ev) => ev.stopPropagation());
    check.addEventListener("change", () => {
      ProgressStore.setEarned(t.id, check.checked);
      App.refresh();
    });
    checkWrap.append(check);

    const main = this.el("span", "row-main");
    const masked = TrophyFilters.isMasked(t, state);
    const name = this.el("span", "row-name" + (masked ? " blurred" : ""), masked ? "Hidden trophy" : t.name);
    const desc = this.el("span", "row-desc" + (masked ? " blurred" : ""), masked ? "Earn it to reveal what it asks." : t.description);
    main.append(name, desc);

    const flags = this.el("span", "row-flags");
    flags.append(this.el("span", "flag kind", t.missable ? "Missable" : KIND_LABEL[t.kind] || t.kind));
    if (t.count) {
      const cur = ProgressStore.getCount(t.id);
      flags.append(this.el("span", "flag kind", cur + " / " + t.count));
    }
    if (state.earned[t.id]) flags.append(this.el("span", "flag done", "Earned"));
    main.append(flags);

    if (t.count && !state.earned[t.id]) {
      const cur = ProgressStore.getCount(t.id);
      if (cur > 0) {
        const mp = this.el("span", "mini-progress");
        const fill = document.createElement("i");
        fill.style.width = Math.min(100, Math.round((cur / t.count) * 100)) + "%";
        mp.append(fill);
        main.append(mp);
      }
    }

    btn.append(checkWrap, this.cupSVG(t.grade), main, this.gradeChip(t.grade));
    btn.addEventListener("click", () => {
      this.selectedId = t.id;
      App.refresh();
    });
    li.append(btn);
    return li;
  },

  // ---------- detail pane ----------
  renderDetail(state) {
    const host = document.getElementById("detail");
    host.textContent = "";
    const t = this.trophies.find((x) => x.id === this.selectedId);
    if (!t) {
      host.append(this.el("p", "placeholder", "Pick a trophy from the list to read its guide — what it asks, how to earn it, and the sources behind the advice."));
      return;
    }
    const masked = TrophyFilters.isMasked(t, state);

    const head = this.el("div", "detail-head");
    head.append(this.cupSVG(t.grade));
    const titles = document.createElement("div");
    titles.append(this.el("h2", masked ? "blurred" : null, masked ? "Hidden trophy" : t.name));
    const chipRow = document.createElement("p");
    chipRow.append(this.gradeChip(t.grade));
    chipRow.append(document.createTextNode("  " + (KIND_LABEL[t.kind] || t.kind) + " · roadmap stage " + t.stage));
    if (t.hidden) chipRow.append(document.createTextNode(" · hidden on PSN"));
    titles.append(chipRow);
    head.append(titles);
    host.append(head);

    host.append(this.el("p", "official" + (masked ? " blurred" : ""), masked ? "This trophy's official description stays hidden until you earn it." : "“" + t.description + "”"));

    if (t.missable) {
      const warn = this.el("p", "warn");
      warn.append(
        this.el("strong", null, "Missable — "),
        document.createTextNode("the list's one risky trophy. It hinges on a Chapter 1 invitation at Jason's house; see the Missables tab before you finish Chapter 1.")
      );
      host.append(warn);
    }

    host.append(this.el("h3", null, "Guide"));
    if (masked) {
      host.append(this.el("p", "blurred", t.guide));
      host.append(this.el("p", "placeholder", "Guide hidden by spoiler protection until this trophy is earned — its steps stay covered too. The sources below are safe to open."));
    } else {
      host.append(this.el("p", null, t.guide));
    }

    if (!masked && t.steps && t.steps.length) {
      host.append(this.el("h3", null, "Steps"));
      const ol = document.createElement("ol");
      for (const s of t.steps) ol.append(this.el("li", null, s));
      host.append(ol);
    }

    if (t.count) {
      host.append(this.el("h3", null, "Progress — " + (t.count_label || "progress")));
      const row = this.el("div", "counter-row");
      const minus = this.el("button", "stepper", "−");
      minus.type = "button";
      minus.setAttribute("aria-label", "Decrease count");
      const input = document.createElement("input");
      input.type = "number";
      input.min = "0";
      input.max = String(t.count);
      input.value = String(ProgressStore.getCount(t.id));
      input.setAttribute("aria-label", "Your count for " + t.name);
      const plus = this.el("button", "stepper", "+");
      plus.type = "button";
      plus.setAttribute("aria-label", "Increase count");
      const apply = (v) => {
        ProgressStore.setCount(t.id, v);
        if (v >= t.count && !ProgressStore.isEarned(t.id)) ProgressStore.setEarned(t.id, true);
        App.refresh();
      };
      minus.addEventListener("click", () => apply(ProgressStore.getCount(t.id) - 1));
      plus.addEventListener("click", () => apply(ProgressStore.getCount(t.id) + 1));
      input.addEventListener("change", () => apply(input.value));
      row.append(minus, input, this.el("span", "of-total", "/ " + t.count), plus);
      host.append(row);
    }

    host.append(this.el("h3", null, "Your notes"));
    const notes = document.createElement("textarea");
    notes.placeholder = "Spots found, your own route, reminders…";
    notes.value = ProgressStore.getNote(t.id);
    notes.setAttribute("aria-label", "Your notes for " + t.name);
    notes.addEventListener("change", () => {
      ProgressStore.setNote(t.id, notes.value);
    });
    host.append(notes);

    host.append(this.el("h3", null, "Sources"));
    const ul = this.el("ul", "sources");
    for (const s of t.sources || []) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = s.url;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = s.name;
      li.append(a);
      ul.append(li);
    }
    host.append(ul);
    host.append(this.el("p", "placeholder", "Guides are written in this app's own words from these sources; follow a link to check the original."));

    const earnRow = this.el("div", "earn-row");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.id = "detail-earned";
    cb.checked = !!state.earned[t.id];
    cb.addEventListener("change", () => {
      ProgressStore.setEarned(t.id, cb.checked);
      App.refresh();
    });
    const lab = document.createElement("label");
    lab.htmlFor = "detail-earned";
    lab.textContent = "Mark as earned";
    earnRow.append(cb, lab);
    host.append(earnRow);
  },

  // ---------- roadmap ----------
  renderRoadmap(state) {
    const intro = document.getElementById("roadmap-intro");
    intro.textContent = "";
    intro.append(
      this.el("h2", null, ROADMAP_INTRO.title),
      this.el("p", null, ROADMAP_INTRO.hours),
      this.el("p", null, ROADMAP_INTRO.body)
    );
    const host = document.getElementById("roadmap-stages");
    host.textContent = "";
    for (const stage of ROADMAP_STAGES) {
      const items = this.trophies.filter((t) => t.stage === stage.n);
      const done = items.filter((t) => state.earned[t.id]).length;
      const card = this.el("section", "stage");
      const h = this.el("h3");
      h.append(
        this.el("span", "stage-n", "Stage " + stage.n + " · "),
        document.createTextNode(stage.title + "  "),
        this.el("span", "stage-progress", done + "/" + items.length)
      );
      card.append(h, this.el("p", null, stage.body));
      const ul = document.createElement("ul");
      for (const t of items) {
        const li = this.el("li", state.earned[t.id] ? "done" : null);
        li.append(this.cupSVG(t.grade), document.createTextNode(t.name));
        if (t.missable) li.append(this.el("span", "flag missable", "Missable"));
        ul.append(li);
      }
      card.append(ul);
      host.append(card);
    }
  },

  // ---------- missables ----------
  renderMissables(state) {
    const host = document.getElementById("missables-body");
    host.textContent = "";
    host.append(this.el("h2", null, "Missables — one real risk on the whole list"));
    const risky = this.trophies.filter((t) => t.missable);
    for (const t of risky) {
      const call = this.el("div", "callout");
      call.append(
        this.el("strong", null, t.name + " — "),
        document.createTextNode(
          (state.earned[t.id] ? "already earned, nothing to fear. " : "not yet earned. ") +
            "During Chapter 1, after the mission Down to Earth, Lucia invites Jason to meditate at his house — check the kitchen in the morning, follow her to the balcony and accept. The invitation disappears when Chapter 1 ends, and whether that first session counts toward meditating at every spot is still unconfirmed, so take it and keep a Chapter 1 save. The remaining spots are free-roam locations, and the last of them needs both characters playable (after Coffee Break in Chapter 2)."
        )
      );
      host.append(call);
    }
    for (const note of MISSABLE_NOTES) {
      const card = this.el("div", "note-card");
      card.append(this.el("h3", null, note.title), this.el("p", null, note.body));
      host.append(card);
    }
  },
};
