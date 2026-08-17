import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const sourceRoot = path.join(root, 'src');
const errors = [];

async function walk(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(target, extension)));
    } else if (!extension || target.endsWith(extension)) {
      files.push(target);
    }
  }

  return files;
}

function routeFile(route) {
  if (route === '/') {
    return path.join(sourceRoot, 'pages', 'index.astro');
  }

  const clean = route.replace(/^\//, '').replace(/\/$/, '');
  return path.join(sourceRoot, 'pages', `${clean}.astro`);
}

async function exists(file) {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
}

const astroFiles = await walk(sourceRoot, '.astro');
const sourceByFile = new Map();
const allIds = new Set();

for (const file of astroFiles) {
  const source = await readFile(file, 'utf8');
  sourceByFile.set(file, source);

  for (const match of source.matchAll(/\bid=["']([^"']+)["']/g)) {
    allIds.add(match[1]);
  }

  for (const match of source.matchAll(/<img\b[\s\S]*?>/gi)) {
    if (!/\balt\s*=/.test(match[0])) {
      errors.push(`${path.relative(root, file)}: Bild ohne alt-Attribut`);
    }
  }
}

for (const requiredRoute of ['/', '/impressum', '/datenschutz', '/support']) {
  if (!(await exists(routeFile(requiredRoute)))) {
    errors.push(`Pflichtseite fehlt: ${requiredRoute}`);
  }
}

if (!(await exists(path.join(sourceRoot, 'pages', '404.astro')))) {
  errors.push('Pflichtseite fehlt: 404.astro');
}

for (const [file, source] of sourceByFile) {
  for (const match of source.matchAll(/\bhref=["']([^"']+)["']/g)) {
    const href = match[1];
    if (!href.startsWith('/') && !href.startsWith('#')) {
      continue;
    }

    const [pathname, fragment] = href.split('#');
    const targetRoute = pathname || '/';
    if (path.extname(targetRoute)) {
      continue;
    }
    if (targetRoute !== '/' && !(await exists(routeFile(targetRoute)))) {
      errors.push(`${path.relative(root, file)}: internes Ziel fehlt (${href})`);
    }

    if (fragment && !allIds.has(fragment)) {
      errors.push(`${path.relative(root, file)}: Sprungziel fehlt (#${fragment})`);
    }
  }
}

if (errors.length > 0) {
  console.error('Inhaltsprüfung fehlgeschlagen:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `Inhaltsprüfung bestanden: ${astroFiles.length} Astro-Dateien, Pflichtseiten, interne Links und alt-Attribute geprüft.`,
);
