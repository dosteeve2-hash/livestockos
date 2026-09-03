/**
 * Régénère les captures du README depuis l'application réelle.
 *
 *   npm run build && npx next start -p 3210    # terminal 1
 *   node scripts/captures.mjs                   # terminal 2
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
