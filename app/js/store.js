// store.js — progress persistence in localStorage, plus export/import.
// Shape: { earned: {id:true}, counts: {id:n}, notes: {id:text},
//          settings: { spoilers: bool } }. Nothing leaves the device
// unless the player exports a file themselves.

const STORE_KEY = "vice-platinum-guide-v1";

const ProgressStore = {
  state: null,

  empty() {
    return { earned: {}, counts: {}, notes: {}, settings: { spoilers: false } };
  },

  load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) {
        this.state = this.empty();
        return this.state;
      }
      const parsed = JSON.parse(raw);
      const base = this.empty();
      this.state = {
        earned: parsed.earned || base.earned,
        counts: parsed.counts || base.counts,
        notes: parsed.notes || base.notes,
        settings: Object.assign(base.settings, parsed.settings || {}),
      };
    } catch (err) {
      this.state = this.empty();
    }
    return this.state;
  },

  save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(this.state));
    } catch (err) {
      /* storage full or blocked: the session still works in memory */
    }
  },

  isEarned(id) {
    return !!this.state.earned[id];
  },

  setEarned(id, on) {
    if (on) this.state.earned[id] = true;
    else delete this.state.earned[id];
    this.save();
  },

  getCount(id) {
    return this.state.counts[id] || 0;
  },

  setCount(id, n) {
    const v = Math.max(0, Math.floor(Number(n) || 0));
    if (v > 0) this.state.counts[id] = v;
    else delete this.state.counts[id];
    this.save();
  },

  getNote(id) {
    return this.state.notes[id] || "";
  },

  setNote(id, text) {
    const v = String(text || "").slice(0, 2000);
    if (v) this.state.notes[id] = v;
    else delete this.state.notes[id];
    this.save();
  },

  reset() {
    this.state = this.empty();
    this.save();
  },

  exportJSON() {
    return JSON.stringify(
      { app: "vice-platinum-guide", version: 1, exported: new Date().toISOString(), progress: this.state },
      null,
      2
    );
  },

  importJSON(text) {
    const parsed = JSON.parse(text);
    const p = parsed.progress || parsed;
    if (!p || typeof p !== "object" || !("earned" in p)) {
      throw new Error("That file does not look like a Vice Platinum export.");
    }
    const base = this.empty();
    this.state = {
      earned: p.earned || base.earned,
      counts: p.counts || base.counts,
      notes: p.notes || base.notes,
      settings: Object.assign(base.settings, p.settings || {}),
    };
    this.save();
    return this.state;
  },
};
