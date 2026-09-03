/**
 * Régénère les captures du README depuis l'application réelle.
 *
 *   npm i --no-save playwright sharp && npx playwright install chromium
 *   npm run build && npx next start -p 3210    # terminal 1
 *   node scripts/captures.mjs                   # terminal 2
 *
 * playwright et sharp ne sont volontairement pas dans devDependencies : ils
 * pèsent plus de 100 Mo pour un usage ponctuel, et `npm ci` tourne à chaque
 * exécution de CI. On les installe le temps de régénérer les images.
 *
 * BASE, OUT et PAGES sont surchargeables par variable d'environnement.
 */
import { chromium } from 'playwright';

// Playwright résout Chromium tout seul après `npx playwright install chromium`.
// CHROMIUM_PATH ne sert qu'aux environnements où le binaire est déjà présent
// ailleurs (conteneurs CI avec une image préchargée).
const EXE = process.env.CHROMIUM_PATH;
const BASE = process.env.BASE || 'http://localhost:3210';
const OUT = process.env.OUT || 'docs/captures';
const PAGES = JSON.parse(process.env.PAGES || JSON.stringify({'/dashboard':'dashboard','/animaux':'animaux','/production':'production','/rapports':'rapports','/vaccination':'vaccination','/alimentation':'alimentation'}));

const browser = await chromium.launch(EXE ? { executablePath: EXE } : {});
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  colorScheme: 'dark',
});
const page = await ctx.newPage();

for (const [route, name] of Object.entries(PAGES)) {
  const url = BASE + route;
  const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  // Laisse les animations d'entrée (framer-motion) se terminer.
  await page.waitForTimeout(2500);
  await page.screenshot({ path: `${OUT}/${name}.png` });
  console.log(`${name}.png  ←  ${route}  (HTTP ${res ? res.status() : '?'})`);
}

await browser.close();

// Les PNG bruts en x2 sont lourds ; ramenés à 1440 px de large et
// recompressés, ils tombent bien plus bas sans perte visible dans un README.
const sharp = (await import('sharp')).default;
const { readdir, rename } = await import('node:fs/promises');
const { join } = await import('node:path');
for (const file of (await readdir(OUT)).filter((f) => f.endsWith('.png'))) {
  const p = join(OUT, file);
  await sharp(p)
    .resize({ width: 1440, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true, quality: 90 })
    .toFile(p + '.tmp');
  await rename(p + '.tmp', p);
}
console.log('captures optimisées');
