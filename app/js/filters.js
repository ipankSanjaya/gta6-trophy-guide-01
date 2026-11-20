// filters.js — which trophies the tracker shows, and the spoiler rule.
// Spoiler rule: with spoiler protection ON, an unearned hidden trophy
// and an unearned story trophy are masked (name and description hidden)
// until they are earned. Earned trophies always show in full.

const TrophyFilters = {
  criteria: { kind: "all", grade: "all", query: "", hideEarned: false },

  set(patch) {
    Object.assign(this.criteria, patch);
  },

  isMasked(trophy, state) {
    if (!state.settings.spoilers) return false;
    if (state.earned[trophy.id]) return false;
    return trophy.hidden || trophy.kind === "story";
  },

  matches(trophy, state) {
    const c = this.criteria;
    if (c.kind === "missable") {
      if (!trophy.missable) return false;
    } else if (c.kind !== "all") {
      if (trophy.kind !== c.kind) return false;
    }
    if (c.grade !== "all" && trophy.grade !== c.grade) return false;
    if (c.hideEarned && state.earned[trophy.id]) return false;
    if (c.query) {
      const q = c.query.toLowerCase();
      const masked = this.isMasked(trophy, state);
      const name = masked ? "" : trophy.name.toLowerCase();
      const desc = masked ? "" : trophy.description.toLowerCase();
      const guide = trophy.guide.toLowerCase();
      if (!name.includes(q) && !desc.includes(q) && !guide.includes(q)) return false;
    }
    return true;
  },

  apply(trophies, state) {
    return trophies.filter((t) => this.matches(t, state));
  },

  kindCount(trophies, kindId) {
    if (kindId === "all") return trophies.length;
    if (kindId === "missable") return trophies.filter((t) => t.missable).length;
    return trophies.filter((t) => t.kind === kindId).length;
  },
};
