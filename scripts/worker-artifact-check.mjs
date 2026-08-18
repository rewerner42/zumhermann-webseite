import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const dist = path.join(root, 'dist');
const auditDirectory = path.join(root, '.wrangler', 'audit');
const maximumAssetCount = 20_000;
const maximumAssetSize = 25 * 1024 * 1024;
const metadataFiles = new Set(['_headers']);
const allowedAssetExtensions = new Set(['.css', '.html', '.png', '.txt', '.xml']);
const errors = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      errors.push(`${path.relative(dist, target)} ist ein nicht erlaubter symbolischer Link.`);
    } else if (entry.isDirectory()) {
      files.push(...(await walk(target)));
    } else {
      files.push(target);
    }
  }

  return files;
}

const files = (await walk(dist)).sort();
const assets = files.filter((file) => !metadataFiles.has(path.relative(dist, file)));
const deployedPaths = new Set(
  files.map((file) => path.relative(dist, file).split(path.sep).join('/')),
);

function validateResource(reference, sourceRelative, label) {
  const value = reference.trim();
  if (!value || value.startsWith('#') || value.startsWith('data:')) {
    return;
  }

  if (/^(?:https?:)?\/\//i.test(value) || /^[a-z][a-z\d+.-]*:/i.test(value)) {
    errors.push(`${sourceRelative} lädt eine externe ${label}-Ressource: ${value}`);
    return;
  }

  const withoutQuery = value.split(/[?#]/, 1)[0];
  let target = withoutQuery.startsWith('/')
    ? withoutQuery.slice(1)
    : path.posix.normalize(path.posix.join(path.posix.dirname(sourceRelative), withoutQuery));

  try {
    target = decodeURIComponent(target);
  } catch {
    errors.push(`${sourceRelative} enthält eine ungültig kodierte ${label}-Ressource: ${value}`);
    return;
  }

  if (!deployedPaths.has(target)) {
    errors.push(`${sourceRelative} verweist auf eine fehlende ${label}-Ressource: ${value}`);
  }
}

if (assets.length > maximumAssetCount) {
  errors.push(`Zu viele Assets für den konservativen Free-Plan-Grenzwert: ${assets.length}.`);
}

let totalAssetBytes = 0;
let maximumObservedAssetBytes = 0;
const manifest = [];

for (const file of files) {
  const relative = path.relative(dist, file).split(path.sep).join('/');
  const details = await stat(file);
  const data = await readFile(file);
  const isMetadata = metadataFiles.has(relative);

  if (relative.split('/').some((segment) => segment.startsWith('.'))) {
    errors.push(`${relative} ist eine versteckte Datei und gehört nicht in das Deployment.`);
  }

  if (relative === '_redirects') {
    errors.push('_redirects ist unerwartet; Domainweiterleitungen werden kontrolliert in Cloudflare verwaltet.');
  }

  if (!isMetadata && !allowedAssetExtensions.has(path.extname(relative).toLowerCase())) {
    errors.push(`${relative} hat keinen freigegebenen Assettyp.`);
  }

  if (!isMetadata) {
    totalAssetBytes += details.size;
    maximumObservedAssetBytes = Math.max(maximumObservedAssetBytes, details.size);
    if (details.size > maximumAssetSize) {
      errors.push(`${relative} überschreitet die maximale Assetgröße von 25 MiB.`);
    }
  }

  if (/\.(?:cjs|js|mjs|wasm|map|astro|ts|tsx|md)$/i.test(relative)) {
    errors.push(`${relative} ist ein Entwicklungsartefakt und gehört nicht in das Deployment.`);
  }

  manifest.push(
    `${createHash('sha256').update(data).digest('hex')}  ${relative}${isMetadata ? '  [metadata]' : ''}`,
  );
}

for (const file of files.filter((candidate) => candidate.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  const relative = path.relative(dist, file);

  if (/<(?:iframe|object|embed)\b/i.test(html)) {
    errors.push(`${relative} enthält eine nicht erlaubte Einbettung.`);
  }

  if (/<form\b/i.test(html)) {
    errors.push(`${relative} enthält ein nicht freigegebenes Formular.`);
  }

  if (/<style\b|\sstyle=["']/i.test(html)) {
    errors.push(`${relative} enthält Inline-CSS, das die strikte CSP verletzen würde.`);
  }

  if (/<meta\b[^>]*http-equiv=["']refresh["']/i.test(html)) {
    errors.push(`${relative} enthält eine nicht freigegebene Meta-Weiterleitung.`);
  }

  for (const match of html.matchAll(/\b(?:src|poster|data)=["']([^"']+)["']/gi)) {
    validateResource(match[1], relative, 'HTML');
  }

  for (const match of html.matchAll(/\bsrcset=["']([^"']+)["']/gi)) {
    for (const candidate of match[1].split(',')) {
      const resource = candidate.trim().split(/\s+/)[0];
      validateResource(resource, relative, 'srcset');
    }
  }

  for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
    if (!/\brel=["'][^"']*(?:stylesheet|preload|modulepreload|icon)[^"']*["']/i.test(match[0])) {
      continue;
    }
    const href = match[0].match(/\bhref=["']([^"']+)["']/i)?.[1];
    if (href) {
      validateResource(href, relative, 'Link');
    }
  }
}

for (const file of files.filter((candidate) => candidate.endsWith('.css'))) {
  const css = await readFile(file, 'utf8');
  const relative = path.relative(dist, file);

  if (/@import\b/i.test(css)) {
    errors.push(`${relative} enthält eine nicht freigegebene CSS-Importanweisung.`);
  }

  for (const match of css.matchAll(/url\(\s*["']?([^"')\s]+)["']?\s*\)/gi)) {
    validateResource(match[1], relative, 'CSS');
  }
}

if (!files.some((file) => path.relative(dist, file) === '_headers')) {
  errors.push('Cloudflare-_headers-Metadatei fehlt.');
}

if (errors.length > 0) {
  console.error('Audit des Worker-Artefakts fehlgeschlagen:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

await mkdir(auditDirectory, { recursive: true });
await writeFile(path.join(auditDirectory, 'assets.sha256'), `${manifest.join('\n')}\n`, 'utf8');
await writeFile(
  path.join(auditDirectory, 'summary.json'),
  `${JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      assetCount: assets.length,
      metadataCount: files.length - assets.length,
      totalAssetBytes,
      maximumObservedAssetBytes,
      maximumAllowedAssetBytes: maximumAssetSize,
    },
    null,
    2,
  )}\n`,
  'utf8',
);

console.log(
  `Worker-Artefakt geprüft: ${assets.length} Assets, ${files.length - assets.length} Metadatei(en), ${totalAssetBytes} Byte.`,
);
