// Leonida Platinum — a GTA VI trophy guide entry for make.fun (Node 22, stdlib only).
//
// This program hands the guide in: it copies the static app (app/) and the
// screenshots (screenshots/) from beside this file into the output directory
// (MAKEFUN_OUTPUT_DIR, or /output in the grader) and writes dossier.json there
// with buildDossier from the vendored make.fun library. Running it twice
// produces byte-identical output.
//
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = dirname(fileURLToPath(import.meta.url));
const destination = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

function copyTree(source, target) {
  if (!existsSync(source)) return;
  mkdirSync(dirname(target), { recursive: true });
  cpSync(source, target, { recursive: true });
}

mkdirSync(destination, { recursive: true });
copyTree(join(repoRoot, 'app'), join(destination, 'app'));
copyTree(join(repoRoot, 'screenshots'), join(destination, 'screenshots'));

// The scorer's own caps for this bounty: the dossier text cap shapes the bytes;
// the other limits refuse an entry the scorer would refuse anyway (more than
// 4 screenshots or one over 256 KiB; app/ over 993 files and directories or
// 48 MiB — app/ shares /output's own 1000-entry cap with screenshots/ and
// dossier.json, so it must leave them room).
const dossierText = buildDossier(destination, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
});
writeFileSync(join(destination, 'dossier.json'), dossierText);
console.log(`Leonida Platinum handed in: ${destination} (dossier.json ${dossierText.length} bytes)`);
