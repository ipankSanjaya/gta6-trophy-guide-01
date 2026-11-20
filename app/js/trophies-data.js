// trophies-data.js — loads the trophy list and holds the roadmap text.
// Data comes from data/trophies.json inside this app; nothing is fetched
// from the network. Guides are original to this app and cite their
// sources in each trophy's "sources" list.

const TROPHY_KINDS = [
  { id: "all", label: "All" },
  { id: "story", label: "Story" },
  { id: "missable", label: "Missable" },
  { id: "collectibles", label: "Collectibles" },
  { id: "activities", label: "Activities" },
  { id: "online", label: "Online" },
];

const KIND_LABEL = {
  platinum: "Platinum",
  story: "Story",
  collectibles: "Collectibles",
  activities: "Activities",
  online: "Online",
};

const ROADMAP_INTRO = {
  title: "The road to Vice Platinum",
  hours: "~200 hours · difficulty 4/10 · one playthrough",
  body:
    "Five stages, in the order the game wants them played. Nothing on this list needs a second playthrough: free-roam continues after the credits, every stranger tied to a trophy comes back, and there are no difficulty or online trophies. The only trap is one Chapter 1 invitation — see the Missables tab before you start. Cheats disable trophies and saving, and there is no mission replay, so keep rotating manual saves (15 slots plus one autosave) at chapter starts.",
};

const ROADMAP_STAGES = [
  {
    n: 1,
    title: "Story playthrough",
    body:
      "Play the campaign and let the story trophies land. Grab Positive Mental Attitude's Chapter 1 meditation invitation on the way (Missables tab), and start scanning vehicles and studying animals as you travel — progress toward the 100% checklist counts from the very first hour.",
  },
  {
    n: 2,
    title: "Strangers & finales",
    body:
      "Finish the stranger questlines: the named finales for Andy, Kenton, Billy, Randy and Tyrone, Bret's unique-animal hunt, and eight full strands for Strangers & Freaks. Quest givers return after the story, so anything left over folds into cleanup.",
  },
  {
    n: 3,
    title: "Collectibles & exploration",
    body:
      "The map-wide hunts: 3 trading card sets, 100 WAiNK selfie spots, 100 vehicle scans, every meditation spot, and a visit to every region of Leonida. Work region by region so one trip pays several counters at once.",
  },
  {
    n: 4,
    title: "Activities & grinds",
    body:
      "The skill and sandbox list: stunts, shooting-range golds, drone races, races, challenges, robberies, vaults, gang work and the money trophies. None of it is missable; pace it against the counters in each trophy's guide.",
  },
  {
    n: 5,
    title: "The 100% push & platinum",
    body:
      "Finish the in-game 100% checklist for A Long Road — 70 of 80 challenges, 300 stunts, 200 vehicle scans, 100 animals studied and the full-clear robbery, range and drone lists. The moment the last of the 54 lands, Vice Got a Price! makes it 55.",
  },
];

const MISSABLE_NOTES = [
  {
    title: "Everything else is safe",
    body:
      "The full list was cross-checked against PowerPyx's roadmap and the games.gg and GTA-Zone guides: no other trophy is missable. There is no mission replay, but free-roam continues after the story, post-game quest givers tied to trophies return, and collectibles, activities and grinds all stay available. Play the story at your own pace.",
  },
  {
    title: "Protect the run anyway",
    body:
      "Rotate manual saves at chapter starts and ends (the game keeps 15 manual slots plus one autosave). Never enable cheats — they disable trophies and saving for the session. And if you do miss the Chapter 1 invitation, a Chapter 1 save is the difference between a five-minute detour and a new playthrough.",
  },
  {
    title: "No online trophies",
    body:
      "The Online filter in the tracker reads zero on purpose: every source agrees the GTA VI list is entirely offline. There is nothing to earn in GTA Online for this Platinum, and nothing that can expire with servers or seasons.",
  },
];

async function loadTrophies() {
  const res = await fetch("data/trophies.json");
  if (!res.ok) throw new Error("Could not load data/trophies.json (" + res.status + ")");
  const data = await res.json();
  return data.trophies;
}
