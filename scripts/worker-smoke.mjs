import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { spawn } from 'node:child_process';
import process from 'node:process';

const root = process.cwd();
const auditDirectory = path.join(root, '.wrangler', 'audit');
const port = Number.parseInt(process.env.WORKER_SMOKE_PORT ?? '8799', 10);
const baseUrl = `http://127.0.0.1:${port}`;
const wrangler = path.join(root, 'node_modules', '.bin', 'wrangler');
const output = [];
let server;
const expectedSecurityHeaders = {
  'content-security-policy':
    "default-src 'self'; base-uri 'self'; connect-src 'none'; font-src 'self'; form-action 'none'; frame-ancestors 'none'; frame-src 'none'; img-src 'self' data:; object-src 'none'; script-src 'none'; style-src 'self'; upgrade-insecure-requests",
  'cross-origin-opener-policy': 'same-origin',
  'cross-origin-resource-policy': 'same-origin',
  'permissions-policy':
    'accelerometer=(), autoplay=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
  'referrer-policy': 'no-referrer',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
};

function fail(message) {
  throw new Error(message);
}

function waitForServer(child) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error('Wrangler-Devserver wurde nicht rechtzeitig bereit.')),
      20_000,
    );

    const inspect = (chunk) => {
      const text = chunk.toString();
      output.push(text);
      if (/Ready on\b/.test(text)) {
        clearTimeout(timeout);
        resolve();
      }
    };

    child.stdout.on('data', inspect);
    child.stderr.on('data', inspect);
    child.once('error', (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    child.once('exit', (code) => {
      clearTimeout(timeout);
      reject(new Error(`Wrangler-Devserver wurde vorzeitig mit Status ${code} beendet.`));
    });
  });
}

async function fetchWithRetry(url) {
  let lastError;
  for (let attempt = 0; attempt < 20; attempt += 1) {
    try {
      return await fetch(url, { redirect: 'manual' });
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }
  throw lastError;
}

function assertSecurityHeaders(response, pathname) {
  for (const [name, expectedValue] of Object.entries(expectedSecurityHeaders)) {
    const actualValue = response.headers.get(name);
    if (actualValue !== expectedValue) {
      fail(`${pathname}: Sicherheitsheader ${name} weicht ab.`);
    }
  }
}

async function request(pathname, expectedStatus, { securityHeaders = true } = {}) {
  const response = await fetchWithRetry(`${baseUrl}${pathname}`);
  if (response.status !== expectedStatus) {
    fail(`${pathname}: erwartet HTTP ${expectedStatus}, erhalten ${response.status}.`);
  }
  if (response.headers.has('set-cookie')) {
    fail(`${pathname}: unerwarteter Set-Cookie-Header.`);
  }
  if (securityHeaders) {
    assertSecurityHeaders(response, pathname);
  }
  return response;
}

try {
  server = spawn(
    wrangler,
    [
      'dev',
      '--local',
      '--ip',
      '127.0.0.1',
      '--port',
      String(port),
      '--show-interactive-dev-session=false',
      '--log-level=log',
    ],
    {
      cwd: root,
      env: { ...process.env, WRANGLER_WRITE_LOGS: 'false', NO_COLOR: '1' },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );

  await waitForServer(server);

  const rootResponse = await request('/', 200);
  if (rootResponse.headers.get('cache-control') !== 'public, max-age=0, must-revalidate') {
    fail('Startseite: unerwartete Cache-Control-Richtlinie.');
  }

  const legalResponse = await request('/impressum', 200);
  const legalHtml = await legalResponse.text();
  if (!legalHtml.includes('<link rel="canonical" href="https://zumhermann.de/impressum">')) {
    fail('Impressum: erwartete kanonische URL fehlt.');
  }

  const slashResponse = await request('/impressum/', 307, { securityHeaders: false });
  if (!slashResponse.headers.get('location')?.endsWith('/impressum')) {
    fail('Trailing-Slash-Weiterleitung zeigt nicht auf /impressum.');
  }

  const missingResponse = await request('/worker-audit-fehlt', 404);
  if (!(await missingResponse.text()).includes('Hier liegt Hermann jedenfalls nicht.')) {
    fail('Unbekannter Pfad liefert nicht die vorgesehene 404-Seite.');
  }

  await request('/_headers', 404);

  const imageResponse = await request('/assets/brand-lockup.png', 200);
  if (imageResponse.headers.get('cache-control') !== 'public, max-age=0, must-revalidate') {
    fail('Markenasset: unerwartete Cache-Control-Richtlinie.');
  }
  const missingImageResponse = await request('/assets/nicht-vorhanden.png', 404);
  if (missingImageResponse.headers.get('cache-control') !== 'public, max-age=0, must-revalidate') {
    fail('Fehlendes Markenasset würde zu lange im Browser zwischengespeichert.');
  }

  const cssFile = (await readdir(path.join(root, 'dist', '_astro'))).find((file) => file.endsWith('.css'));
  if (!cssFile) {
    fail('Kein gebautes CSS-Asset gefunden.');
  }
  const cssResponse = await request(`/_astro/${cssFile}`, 200);
  if (cssResponse.headers.get('cache-control') !== 'public, max-age=31536000, immutable') {
    fail('Versioniertes CSS: unerwartete Cache-Control-Richtlinie.');
  }

  const headers = await readFile(path.join(root, 'dist', '_headers'), 'utf8');
  const expectedRules = [...headers.matchAll(/^\/\S*/gm)].length;
  const log = output.join('');
  if (/invalid(?:e|en)? (?:header|_headers)|invalid.*_headers/i.test(log)) {
    fail('Wrangler meldete mindestens eine ungültige _headers-Regel.');
  }
  if (!log.includes(`Parsed ${expectedRules} valid header rules`)) {
    fail(`Wrangler bestätigte nicht alle ${expectedRules} _headers-Regeln.`);
  }

  await mkdir(auditDirectory, { recursive: true });
  await writeFile(
    path.join(auditDirectory, 'smoke.json'),
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        runner: 'wrangler dev --local',
        headerRulesParsed: expectedRules,
        securityHeaders: Object.keys(expectedSecurityHeaders),
        checks: [
          { path: '/', status: 200, cache: 'revalidate' },
          { path: '/impressum', status: 200, canonical: 'https://zumhermann.de/impressum' },
          { path: '/impressum/', status: 307, location: '/impressum' },
          { path: '/worker-audit-fehlt', status: 404, customPage: true },
          { path: '/_headers', status: 404 },
          { path: '/assets/brand-lockup.png', status: 200, cache: 'revalidate' },
          { path: '/assets/nicht-vorhanden.png', status: 404, cache: 'revalidate' },
          { path: `/_astro/${cssFile}`, status: 200, cache: 'immutable' },
        ],
        setCookieObserved: false,
        invalidHeaderRulesObserved: false,
      },
      null,
      2,
    )}\n`,
    'utf8',
  );

  console.log('Lokaler Worker-Smoke-Test bestanden: Routing, 404, Header, Cache und Cookies geprüft.');
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  const log = output.join('').trim();
  if (log) {
    console.error(log);
  }
  process.exitCode = 1;
} finally {
  if (server && server.exitCode === null) {
    server.kill('SIGTERM');
  }
}
