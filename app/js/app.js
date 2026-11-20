// app.js — boot and wiring: loads the data, restores saved progress,
// connects the controls, and switches between the three views.

const App = {
  view: "tracker",

  refresh() {
    const state = ProgressStore.state;
    Views.renderProgress(state);
    Views.renderKindChips(state);
    Views.renderList(state);
    Views.renderDetail(state);
    Views.renderRoadmap(state);
    Views.renderMissables(state);
    const badge = document.getElementById("missable-badge");
    const left = Views.trophies.filter((t) => t.missable && !state.earned[t.id]).length;
    badge.textContent = String(left);
    badge.style.display = left ? "" : "none";
    document.getElementById("spoiler-toggle").checked = !!state.settings.spoilers;
  },

  show(view) {
    this.view = view;
    for (const tab of document.querySelectorAll(".tab")) {
      tab.classList.toggle("active", tab.dataset.view === view);
    }
    document.getElementById("view-tracker").hidden = view !== "tracker";
    document.getElementById("view-roadmap").hidden = view !== "roadmap";
    document.getElementById("view-missables").hidden = view !== "missables";
  },

  download(name, text) {
    const blob = new Blob([text], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  },

  async boot() {
    ProgressStore.load();
    try {
      Views.trophies = await loadTrophies();
    } catch (err) {
      document.getElementById("trophy-list").append(
        Views.el("li", "placeholder", "The trophy data could not be loaded. Serve this folder with any static file server and reload.")
      );
      return;
    }
    if (!Views.selectedId && Views.trophies.length) {
      const risky = Views.trophies.find((t) => t.missable);
      Views.selectedId = risky ? risky.id : Views.trophies[0].id;
    }

    for (const tab of document.querySelectorAll(".tab")) {
      tab.addEventListener("click", () => this.show(tab.dataset.view));
    }
    document.getElementById("search").addEventListener("input", (ev) => {
      TrophyFilters.set({ query: ev.target.value.trim() });
      this.refresh();
    });
    document.getElementById("grade-filter").addEventListener("change", (ev) => {
      TrophyFilters.set({ grade: ev.target.value });
      this.refresh();
    });
    document.getElementById("hide-earned").addEventListener("change", (ev) => {
      TrophyFilters.set({ hideEarned: ev.target.checked });
      this.refresh();
    });
    document.getElementById("spoiler-toggle").addEventListener("change", (ev) => {
      ProgressStore.state.settings.spoilers = ev.target.checked;
      ProgressStore.save();
      this.refresh();
    });
    document.getElementById("export-btn").addEventListener("click", () => {
      this.download("vice-platinum-progress.json", ProgressStore.exportJSON());
    });
    document.getElementById("import-file").addEventListener("change", async (ev) => {
      const file = ev.target.files && ev.target.files[0];
      if (!file) return;
      try {
        ProgressStore.importJSON(await file.text());
        this.refresh();
      } catch (err) {
        alert("Import failed: " + err.message);
      }
      ev.target.value = "";
    });
    document.getElementById("reset-btn").addEventListener("click", () => {
      if (confirm("Reset all progress, counters and notes on this device?")) {
        ProgressStore.reset();
        this.refresh();
      }
    });

    this.refresh();
  },
};

document.addEventListener("DOMContentLoaded", () => App.boot());
