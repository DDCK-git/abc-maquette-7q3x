// Prépare les images avant chaque compilation :
// - une version WebP légère de chaque JPG/PNG de public/img, rangée dans public/img-opt (dossier généré, non versionné)
// - la liste des dimensions (src/data/images.json), pour que chaque image réserve sa place dans la page
// Une photo ajoutée par Sandy depuis l'éditeur du blog est donc allégée toute seule.
import sharp from 'sharp';
import { readdir, mkdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'public/img';
const OUT = 'public/img-opt';
// largeur maximale utile, selon l'endroit où l'image s'affiche
const RULES = [[/^logo\./, 104], [/^sandy-avatar\./, 96], [/^sandy\./, 800], [/^cabinet\./, 880], [/^salle-formation\./, 1200], [/^module-/, 700]];
const maxWidth = (rel) => {
  const base = path.basename(rel);
  for (const [re, w] of RULES) if (re.test(base)) return w;
  return rel.includes('/couvertures/') ? 1000 : 1400;
};

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}
const exists = (p) => stat(p).then((s) => s, () => null);

const map = {};
let made = 0;
for (const file of await walk(SRC)) {
  const ext = path.extname(file).toLowerCase();
  const rel = '/' + path.relative('public', file).split(path.sep).join('/');
  if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) continue;
  const outRel = rel.replace(/^\/img\//, '/img-opt/').slice(0, -ext.length) + '.webp';
  const outFile = path.join('public', outRel);
  const [a, b] = [await exists(file), await exists(outFile)];
  if (!b || b.mtimeMs < a.mtimeMs) {
    await mkdir(path.dirname(outFile), { recursive: true });
    await sharp(file).rotate().resize({ width: maxWidth(rel), withoutEnlargement: true }).webp({ quality: 80 }).toFile(outFile);
    made++;
  }
  const meta = await sharp(outFile).metadata();
  map[rel.normalize('NFC')] = { src: outRel.normalize('NFC'), width: meta.width, height: meta.height };
}
await mkdir('src/data', { recursive: true });
await writeFile('src/data/images.json', JSON.stringify(map, null, 1));
console.log(`images : ${Object.keys(map).length} référencées, ${made} converties`);
