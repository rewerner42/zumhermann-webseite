import { readFile } from 'node:fs/promises';
import process from 'node:process';

const expected = {
  workerName: 'zumhermann-webseite',
  origin: 'https://zumhermann.de',
  host: 'zumhermann.de',
};
const expectedHeaderRules = [
  '/*',
  '/assets/*',
  '/_astro/*',
  '/',
  '/impressum',
  '/datenschutz',
  '/support',
  '/404.html',
];
const expectedSecurityHeaders = {
  'Content-Security-Policy':
    "default-src 'self'; base-uri 'self'; connect-src 'none'; font-src 'self'; form-action 'none'; frame-ancestors 'none'; frame-src 'none'; img-src 'self' data:; object-src 'none'; script-src 'none'; style-src 'self'; upgrade-insecure-requests",
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Permissions-Policy':
    'accelerometer=(), autoplay=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
  'Referrer-Policy': 'no-referrer',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};
const expectedScripts = {
  'worker:audit': 'node scripts/worker-artifact-check.mjs',
  'worker:smoke': 'node scripts/worker-smoke.mjs',
  'worker:dry-run':
    'WRANGLER_WRITE_LOGS=false wrangler deploy --dry-run --strict --outdir .wrangler/dry-run --metafile',
  'release:build':
    'npm run legal:check && npm run check && npm run build && npm run worker:audit && npm run worker:smoke && npm run worker:dry-run',
  deploy: 'npm run release:build && wrangler deploy --strict',
};
const errors = [];

const config = JSON.parse(await readFile(new URL('../wrangler.jsonc', import.meta.url), 'utf8'));
const siteConfig = await readFile(new URL('../src/config/site.ts', import.meta.url), 'utf8');
const headers = await readFile(new URL('../public/_headers', import.meta.url), 'utf8');
const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

if (config.name !== expected.workerName) {
  errors.push(`Worker-Name muss ${expected.workerName} sein.`);
}

if (!/^\d{4}-\d{2}-\d{2}$/.test(config.compatibility_date ?? '')) {
  errors.push('Cloudflare compatibility_date fehlt oder ist ungültig.');
}

if (config.workers_dev !== false) {
  errors.push('workers.dev muss für das Produktionsprojekt ausdrücklich deaktiviert sein.');
}

if (config.preview_urls !== false) {
  errors.push('Öffentliche Worker-Preview-URLs müssen ausdrücklich deaktiviert sein.');
}

if (config.observability?.enabled !== false) {
  errors.push('Workers Observability muss für diese statische Website ausdrücklich deaktiviert sein.');
}

if (config.logpush !== false) {
  errors.push('Workers Logpush muss für diese statische Website ausdrücklich deaktiviert sein.');
}

if (config.send_metrics !== false) {
  errors.push('Wrangler-Telemetrie muss für dieses Projekt ausdrücklich deaktiviert sein.');
}

if (
  !Array.isArray(config.routes) ||
  config.routes.length !== 1 ||
  config.routes[0]?.pattern !== expected.host ||
  config.routes[0]?.custom_domain !== true
) {
  errors.push(`Es muss genau eine Custom Domain für ${expected.host} konfiguriert sein.`);
}

if (config.main) {
  errors.push('Die statische Website darf keinen unnötigen Worker-Laufzeitcode konfigurieren.');
}

if (config.assets?.directory !== './dist') {
  errors.push('Cloudflare muss ausschließlich das Build-Verzeichnis ./dist ausliefern.');
}

if (config.assets?.not_found_handling !== '404-page') {
  errors.push('Unbekannte Pfade müssen die statische 404-Seite mit Status 404 erhalten.');
}

if (config.assets?.html_handling !== 'drop-trailing-slash') {
  errors.push('Cloudflare muss die von Astro verwendeten URLs ohne abschließenden Slash erzwingen.');
}

if (!siteConfig.includes(`domain: '${expected.origin}'`)) {
  errors.push(`Die zentrale Website-Domain muss ${expected.origin} entsprechen.`);
}

for (const [name, value] of Object.entries(expectedSecurityHeaders)) {
  if (!headers.includes(`  ${name}: ${value}`)) {
    errors.push(`Sicherheitsheader fehlt oder weicht ab: ${name}.`);
  }
}

const configuredHeaderRules = [...headers.matchAll(/^\/\S*/gm)].map((match) => match[0]);
if (JSON.stringify(configuredHeaderRules) !== JSON.stringify(expectedHeaderRules)) {
  errors.push('Die _headers-Regeln entsprechen nicht der freigegebenen Pfadliste.');
}

if (headers.includes('ambient-light-sensor')) {
  errors.push('Die veraltete Permissions-Policy-Funktion ambient-light-sensor darf nicht enthalten sein.');
}

for (const [name, command] of Object.entries(expectedScripts)) {
  if (packageJson.scripts?.[name] !== command) {
    errors.push(`npm-Skript ${name} weicht von der freigegebenen Gate-Kette ab.`);
  }
}

if (errors.length > 0) {
  console.error('Cloudflare-Konfigurationsprüfung fehlgeschlagen:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `Cloudflare-Konfiguration geprüft: ${expected.workerName} liefert ./dist ausschließlich über ${expected.origin} aus.`,
);
