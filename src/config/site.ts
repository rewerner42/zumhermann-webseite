import { evaluateReleaseReadiness } from './release-readiness.js';

export const site = {
  name: 'zumHermann',
  tagline: 'Der sagenhafte Richtungskompass aus Ostwestfalen.',
  description:
    'zumHermann zeigt Richtung und Entfernung zum Hermannsdenkmal – lokal auf deinem Smartphone, ohne Konto, Tracking oder Werbung.',
  language: 'de',
  locale: 'de_DE',
  owner: {
    name: 'Werner Francis Reineke-Ryskiewicz',
    identityApproved: true,
    street: 'Geseker Str. 26',
    postalCity: '33154 Salzkotten',
    email: 'tach@zumhermann.de',
    additionalContact: 'Telefon: 05258 987282',
  },
  domain: 'https://zumhermann.de',
  hosting: {
    provider:
      'Cloudflare, Inc., 101 Townsend Street, San Francisco, CA 94107, USA (Cloudflare Workers / Static Assets)',
    accessLogDeletionCriteria:
      'Der Betreiber hat Workers Observability und Logpush deaktiviert und führt keine eigenen personenbezogenen Website-Zugriffsprotokolle. Cloudflare verarbeitet dennoch technisch erforderliche Netzwerk- und Sicherheitsdaten. Nach dem Cloudflare-DPA werden personenbezogene Daten bis zum Ende des Vertrags oder bis zum Wegfall der Erforderlichkeit für die Vertragserfüllung gespeichert – je nachdem, was früher eintritt; zwingende gesetzliche Pflichten bleiben unberührt.',
    recipientsAndProcessors:
      'Cloudflare, Inc. als Auftragsverarbeiter; außerdem Cloudflare-Konzerngesellschaften sowie von Cloudflare eingesetzte Rechenzentrums-, Engineering- und Supportanbieter. Für die Cloudflare Developer Platform nennt die aktuelle Unterauftragnehmerliste insbesondere Google LLC und Oracle America, Inc.',
    processingLocationsAndTransfers:
      'Bereitstellung über Cloudflares globales Netzwerk. Dabei kann eine Verarbeitung im EWR, in den USA und in weiteren in der aktuellen Unterauftragnehmerliste genannten Ländern stattfinden. Für Übermittlungen in die USA nennt Cloudflare das EU-US Data Privacy Framework; soweit erforderlich gelten die EU-Standardvertragsklauseln einschließlich ergänzender Schutzmaßnahmen.',
    privacyDetailsComplete: false,
  },
  privacy: {
    supervisoryAuthority:
      'Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen (LDI NRW), Postfach 20 04 44, 40102 Düsseldorf, www.ldi.nrw.de',
  },
  stores: {
    apple: '',
    google: '',
  },
  legal: {
    consumerDisputeInformation: '[[VSBG_ANGABE_NACH_PRÜFUNG]]',
    textsApproved: true,
  },
  release: {
    externalReviewApproved: true,
    appProductionAuditComplete: false,
    publicReleaseApproved: false,
  },
} as const;

export function hasPlaceholder(value: string): boolean {
  const normalized = value.trim();
  const opening = '[' + '[';
  const closing = ']' + ']';
  return normalized.startsWith(opening) && normalized.endsWith(closing);
}

export function isConfiguredUrl(value: string): boolean {
  if (hasPlaceholder(value)) {
    return false;
  }

  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function siteOrigin(): string | undefined {
  return isConfiguredUrl(site.domain) ? site.domain.replace(/\/$/, '') : undefined;
}

export function isExternalSiteReady(): boolean {
  return releaseReadiness().externalReady;
}

export function isPublicReleaseReady(): boolean {
  return releaseReadiness().publicReady;
}

function releaseReadiness() {
  return evaluateReleaseReadiness({
    domainConfigured: Boolean(siteOrigin()),
    identityApproved: site.owner.identityApproved,
    privacyDetailsComplete: site.hosting.privacyDetailsComplete,
    textsApproved: site.legal.textsApproved,
    externalReviewApproved: site.release.externalReviewApproved,
    appProductionAuditComplete: site.release.appProductionAuditComplete,
    publicReleaseApproved: site.release.publicReleaseApproved,
  });
}
