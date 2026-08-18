import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const configPath = path.join(root, 'src', 'config', 'site.ts');
const errors = [];

async function walkTextFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  const textExtensions = new Set(['.astro', '.ts', '.css', '.txt', '.xml', '.html']);

  for (const entry of entries) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkTextFiles(target)));
    } else if (textExtensions.has(path.extname(entry.name))) {
      files.push(target);
    }
  }
  return files;
}

async function exists(file) {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
}

const config = await readFile(configPath, 'utf8');

function stringValue(key) {
  const match = config.match(new RegExp(`\\b${key}:\\s*['\\\"]([^'\\\"]*)['\\\"]`));
  if (!match) {
    errors.push(`Konfigurationsfeld fehlt oder ist nicht statisch lesbar: ${key}`);
    return '';
  }
  return match[1].trim();
}

function booleanValue(key) {
  const match = config.match(new RegExp(`\\b${key}:\\s*(true|false)`));
  if (!match) {
    errors.push(`Boolesches Konfigurationsfeld fehlt: ${key}`);
    return false;
  }
  return match[1] === 'true';
}

const textFiles = [
  ...(await walkTextFiles(path.join(root, 'src'))),
  ...(await walkTextFiles(path.join(root, 'public'))),
];

for (const file of textFiles) {
  const source = await readFile(file, 'utf8');
  const placeholders = [...source.matchAll(/\[\[[^\]]+\]\]/g)].map((match) => match[0]);
  if (placeholders.length > 0) {
    errors.push(
      `${path.relative(root, file)} enthält offene Platzhalter: ${[...new Set(placeholders)].join(', ')}`,
    );
  }
}

const street = stringValue('street');
const postalCity = stringValue('postalCity');
const email = stringValue('email');
const additionalContact = stringValue('additionalContact');
const domain = stringValue('domain');
const hostingProvider = stringValue('provider');
const accessLogDeletionCriteria = stringValue('accessLogDeletionCriteria');
const recipientsAndProcessors = stringValue('recipientsAndProcessors');
const processingLocationsAndTransfers = stringValue('processingLocationsAndTransfers');
const supervisoryAuthority = stringValue('supervisoryAuthority');

if (!street) errors.push('Straße und Hausnummer fehlen.');
if (!postalCity) errors.push('Postleitzahl und Ort fehlen.');
if (!/^\S+@\S+\.\S+$/.test(email)) errors.push('Eine gültige Support-/Kontakt-E-Mail fehlt.');
if (!additionalContact) errors.push('Eine weitere schnelle und unmittelbare Kontaktmöglichkeit fehlt.');

try {
  const parsedDomain = new URL(domain);
  if (parsedDomain.protocol !== 'https:' || !parsedDomain.hostname.includes('.')) {
    errors.push('Die Domain muss eine vollständige öffentliche HTTPS-URL sein.');
  }
} catch {
  errors.push('Eine gültige öffentliche Domain fehlt.');
}

if (!hostingProvider) errors.push('Der Hostinganbieter fehlt.');
if (!accessLogDeletionCriteria) errors.push('Speicherdauer oder Löschkriterien der Hostingprotokolle fehlen.');
if (!recipientsAndProcessors) errors.push('Hostingempfänger und Unterauftragnehmer sind nicht dokumentiert.');
if (!processingLocationsAndTransfers) {
  errors.push('Hosting-Verarbeitungsorte und mögliche Drittlandtransfers sind nicht dokumentiert.');
}
if (!supervisoryAuthority) {
  errors.push('Die zuständige Datenschutzaufsichtsbehörde ist nicht dokumentiert.');
}
if (!booleanValue('privacyDetailsComplete')) {
  errors.push('Der Hosting-Datenschutzabschnitt ist nicht als vollständig geprüft markiert.');
}
if (!booleanValue('textsApproved')) {
  errors.push('Impressum und Datenschutzerklärung sind nicht als rechtlich freigegeben markiert.');
}
if (!booleanValue('appProductionAuditComplete')) {
  errors.push('Der Produktionsbinary-/Netzwerkaudit der App ist nicht als abgeschlossen markiert.');
}
if (!booleanValue('publicReleaseApproved')) {
  errors.push('Die ausdrückliche Freigabe für eine öffentliche Veröffentlichung fehlt.');
}

for (const page of ['impressum.astro', 'datenschutz.astro', 'support.astro']) {
  if (!(await exists(path.join(root, 'src', 'pages', page)))) {
    errors.push(`Pflichtseite fehlt: src/pages/${page}`);
  }
}

if (errors.length > 0) {
  console.error('Veröffentlichung gesperrt. Der Rechts- und Pflichtangabencheck meldet:');
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log('Rechts- und Pflichtangabencheck bestanden. Eine Veröffentlichung ist technisch freigegeben.');
