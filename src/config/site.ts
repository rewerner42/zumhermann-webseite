export const site = {
  name: 'zumHermann',
  tagline: 'Der sagenhafte Richtungskompass aus Ostwestfalen.',
  description:
    'zumHermann zeigt Richtung und Entfernung zum Hermannsdenkmal – lokal auf deinem Smartphone, ohne Konto, Tracking oder Werbung.',
  language: 'de',
  locale: 'de_DE',
  owner: {
    name: 'Werner Francis Reineke',
    street: '[[STRASSE_HAUSNUMMER]]',
    postalCity: '[[PLZ_ORT]]',
    email: '[[E_MAIL]]',
    additionalContact: '[[WEITERE_KONTAKTMÖGLICHKEIT]]',
  },
  domain: '[[DOMAIN]]',
  hosting: {
    provider: '[[HOSTINGANBIETER]]',
    accessLogDeletionCriteria: '[[HOSTING_LOESCHKRITERIEN]]',
    recipientsAndProcessors: '[[HOSTING_EMPFÄNGER_UND_UNTERAUFTRAGNEHMER]]',
    processingLocationsAndTransfers: '[[HOSTING_VERARBEITUNGSORTE_UND_DRITTLANDTRANSFERS]]',
    privacyDetailsComplete: false,
  },
  stores: {
    apple: '[[APPLE_APP_STORE_URL]]',
    google: '[[GOOGLE_PLAY_URL]]',
  },
  legal: {
    consumerDisputeInformation: '[[VSBG_ANGABE_NACH_PRÜFUNG]]',
    textsApproved: false,
  },
  release: {
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
