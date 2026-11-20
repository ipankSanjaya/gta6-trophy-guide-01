// main.ts — entrypoint for the make.fun environment.
//
// Behaviour: copies the static app (app/) and the screenshots
// (screenshots/) into the output directory, then writes dossier.json
// through the kit's buildDossier so the judging harness sees exactly
// the bytes the app ships. buildDossier itself refuses to run when the
// app, the screenshots or the dossier would break the bounty limits,
// so a clean exit here means the entry is inside every cap.

import { cpSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = dirname(fileURLToPath(import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The dossier builder walks the app directory in place; the plain file
// copies below are what the harness serves and inspects.
for (const name of ["app", "screenshots"]) {
  const target = join(out, name);
  rmSync(target, { recursive: true, force: true });
  cpSync(join(here, name), target, { recursive: true });
}

// buildDossier returns the dossier bytes; writing them ourselves is
// what puts dossier.json in the output for the scorer to compare.
const dossier = buildDossier(out, {
  text_max_bytes: 163_840,
  screenshots: { max: 4, max_bytes: 262_144 },
  app_max_files: 993,
  app_max_bytes: 50_331_648,
});
writeFileSync(join(out, "dossier.json"), dossier);

console.log(`vice-platinum: app, screenshots and dossier.json written to ${out}`);
