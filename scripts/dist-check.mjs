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
const siteConfig = await readFile(path.join(root, 'src', 'config', 'site.ts'), 'utf8');
const publicReleaseApproved = /\bpublicReleaseApproved:\s*true\b/.test(siteConfig);

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  htmlByFile.set(file, html);

  for (const match of html.matchAll(/<img\b[^>]*>/gi)) {
    if (!/\balt=/.test(match[0])) {
      errors.push(`${path.relative(dist, file)}: ausgeliefertes Bild ohne alt-Attribut`);
    }
  }

  if (/\son[a-z]+\s*=/i.test(html)) {
    errors.push(`${path.relative(dist, file)}: ausgeliefertes HTML enthält einen Inline-Eventhandler`);
  }

  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attributes = match[1];
    const body = match[2];

    if (/\bsrc\s*=/.test(attributes) || !/\btype=["']application\/ld\+json["']/.test(attributes)) {
      errors.push(`${path.relative(dist, file)}: ausführbares oder externes Skript gefunden`);
      continue;
    }

    try {
      JSON.parse(body);
    } catch {
      errors.push(`${path.relative(dist, file)}: ungültiger JSON-LD-Datenblock`);
    }
  }

  if (publicReleaseApproved) {
    const releaseIncompatiblePatterns = [
      /\[\[[^\]]+\]\]/,
      /Rechtlicher Entwurf/i,
      /Interner rechtlicher Entwurf/i,
      /nicht veröffentlicht/i,
      /vor Veröffentlichung/i,
      /vor dem öffentlichen Betrieb/i,
      /später(?:e|en|er)? Hostinganbieter/i,
      /Hostingangaben vor Veröffentlichung/i,
    ];
    for (const pattern of releaseIncompatiblePatterns) {
      if (pattern.test(html)) {
        errors.push(
          `${path.relative(dist, file)}: veröffentlichungsunverträglicher Entwurfsinhalt (${pattern.source})`,
        );
      }
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

const robotsFile = path.join(dist, 'robots.txt');
const sitemapFile = path.join(dist, 'sitemap.xml');
if ((await isFile(robotsFile)) && (await isFile(sitemapFile))) {
  const robots = await readFile(robotsFile, 'utf8');
  const sitemap = await readFile(sitemapFile, 'utf8');
  const advertisesSitemap = /\bSitemap:\s*https:\/\//i.test(robots);

  if (!/User-agent:\s*\*\s*\nAllow:\s*\//i.test(robots) || /\bDisallow:\s*\//i.test(robots)) {
    errors.push('robots.txt muss das Lesen der noindex-Hinweise erlauben');
  }

  if (advertisesSitemap) {
    if (!/<url>\s*<loc>https:\/\//i.test(sitemap)) {
      errors.push('Öffentliche robots.txt verweist auf eine Sitemap ohne öffentliche URLs');
    }
  } else {
    if (/<url>\s*<loc>/i.test(sitemap)) {
      errors.push('Vor öffentlicher Freigabe darf die Sitemap keine URLs enthalten');
    }

    for (const output of [
      'index.html',
      'impressum/index.html',
      'datenschutz/index.html',
      'support/index.html',
    ]) {
      const html = await readFile(path.join(dist, output), 'utf8');
      if (!/<meta\s+name="robots"\s+content="noindex, nofollow"/i.test(html)) {
        errors.push(`${output}: noindex fehlt im Vorveröffentlichungszustand`);
      }
    }
  }
}

if (await isFile(path.join(dist, '_headers'))) {
  const headers = await readFile(path.join(dist, '_headers'), 'utf8');
  const csp = headers.match(/^\s*Content-Security-Policy:\s*(.+)$/m)?.[1] ?? '';
  const scriptDirective = csp
    .split(';')
    .map((directive) => directive.trim())
    .find((directive) => directive.startsWith('script-src'));
  if (scriptDirective !== "script-src 'none'") {
    errors.push('Build-Ausgabe: Content Security Policy sperrt ausführbare Skripte nicht vollständig');
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
