// Vice Platinum — hand-in program for the gta6-trophy-guide-01 entry (Node 22, standard library only).
//
// The guide itself is the static web app in app/ (open app/index.html in a browser; it runs fully
// offline). This program's whole job is to hand that app in: copy app/ and screenshots/ into the
// output directory and write the dossier the judge reads, using the kit's vendored library.
// vendor/makefun-frontend.ts is left exactly as the kit ships it — the scorer rebuilds the dossier
// with its own copy and compares byte for byte.
//
// Run it locally the same way the grader does, with MAKEFUN_OUTPUT_DIR standing in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoDir = dirname(fileURLToPath(import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The scorer's caps for this bounty, passed to the dossier builder so an entry the
// scorer would refuse fails here first, in the open, instead of at grading time.
const DOSSIER_LIMITS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
} as const;

function handIn(): void {
  mkdirSync(outputDir, { recursive: true });

  // The app: plain static files, copied as they are.
  cpSync(join(repoDir, 'app'), join(outputDir, 'app'), { recursive: true });

  // The screenshots the judge sees the app through (3 or 4, first by name is the cover).
  const shotsDir = join(outputDir, 'screenshots');
  mkdirSync(shotsDir, { recursive: true });
  if (existsSync(join(repoDir, 'screenshots'))) {
    cpSync(join(repoDir, 'screenshots'), shotsDir, { recursive: true });
  }

  // buildDossier returns the dossier's bytes; writing them is this program's job.
  const dossierBytes = buildDossier(outputDir, DOSSIER_LIMITS);
  writeFileSync(join(outputDir, 'dossier.json'), dossierBytes);
}

handIn();
