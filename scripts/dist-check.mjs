import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const dist = path.join(root, 'dist');
const errors = [];

async function walk(directory, predicate = () => true) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(target, predicate)));
    } else if (predicate(target)) {
      files.push(target);
    }
  }
  return files;
}

async function isFile(file) {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
}

function htmlTarget(pathname) {
  const clean = decodeURIComponent(pathname).replace(/^\//, '').replace(/\/$/, '');
  if (!clean) {
    return path.join(dist, 'index.html');
  }
  if (path.extname(clean)) {
    return path.join(dist, clean);
  }
  return path.join(dist, clean, 'index.html');
}

const htmlFiles = await walk(dist, (file) => file.endsWith('.html'));
const htmlByFile = new Map();

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  htmlByFile.set(file, html);

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt=/.test(match[0])) {
      errors.push(`${path.relative(dist, file)}: ausgeliefertes Bild ohne alt-Attribut`);
    }
  }

  for (const match of html.matchAll(/\b(?:src|href)="(\/[^"#?]+)(?:[?#][^"]*)?"/g)) {
    const target = match[1];
    if (target.startsWith('/_astro/') || path.extname(target)) {
      const staticTarget = path.join(dist, decodeURIComponent(target).replace(/^\//, ''));
      if (!(await isFile(staticTarget))) {
        errors.push(`${path.relative(dist, file)}: statisches Ziel fehlt (${target})`);
      }
    }
  }

  for (const match of html.matchAll(/\bhref="(\/[^"?]*)"/g)) {
    const href = match[1];
    const [pathname, fragment] = href.split('#');
    if (path.extname(pathname)) {
      continue;
    }

    const targetFile = htmlTarget(pathname);
    if (!(await isFile(targetFile))) {
      errors.push(`${path.relative(dist, file)}: internes Seitenziel fehlt (${href})`);
      continue;
    }

    if (fragment) {
      const targetHtml = htmlByFile.get(targetFile) ?? (await readFile(targetFile, 'utf8'));
      const escaped = fragment.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      if (!new RegExp(`\\bid="${escaped}"`).test(targetHtml)) {
        errors.push(`${path.relative(dist, file)}: Sprungziel fehlt (${href})`);
      }
    }
  }
}

const requiredOutputs = [
  'index.html',
  'impressum/index.html',
  'datenschutz/index.html',
  'support/index.html',
  '404.html',
  'robots.txt',
  'sitemap.xml',
  '_headers',
];

for (const output of requiredOutputs) {
  if (!(await isFile(path.join(dist, output)))) {
    errors.push(`Build-Ausgabe fehlt: ${output}`);
  }
}

if (errors.length > 0) {
  console.error('Prüfung der Build-Ausgabe fehlgeschlagen:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(
  `Build-Ausgabe geprüft: ${htmlFiles.length} HTML-Seiten, Links, Sprungziele, Bilder und Pflichtdateien.`,
);
