# Deployment als Cloudflare Worker

Stand: 19. August 2026
Ziel: `https://zumhermann.de` über Cloudflare Workers Static Assets; `www.zumhermann.de` leitet dauerhaft auf den kanonischen Apex weiter.

Die Website nutzt genau einen Worker. Sein minimaler Einstiegspunkt leitet `www` auf den kanonischen
HTTPS-Apex und reicht alle übrigen Anfragen an die statische `ASSETS`-Bindung aus `dist/` weiter;
Cloudflares Zoneneinstellung „Always Use HTTPS“ erzwingt HTTPS. Der Worker besitzt
kein Backend, keine Datenbank, keine Secrets, keine eigene Datenspeicherung und keine externen
Netzwerkaufrufe. Die verbindliche Konfiguration liegt in `wrangler.jsonc`. **Eine öffentliche
Bereitstellung bleibt gesperrt, solange `npm run legal:check` fehlschlägt.**

## Sicherheitsmodell

- `workers_dev: false` deaktiviert die öffentliche `*.workers.dev`-Adresse.
- `preview_urls: false` deaktiviert öffentliche Versions- und Alias-Previews.
- `observability.enabled: false` und `logpush: false` verhindern Workers Logs/Logpush aus dieser
  Projektkonfiguration.
- Der einzige `main`-Entrypoint ist `src/worker.mjs`; außer der statischen `ASSETS`-Bindung existieren keine Bindings.
- `not_found_handling: "404-page"` liefert die eigene Fehlerseite mit HTTP 404.
- `html_handling: "drop-trailing-slash"` entspricht den slashlosen Astro-URLs.
- Die einzige Worker-Custom-Domain ist `zumhermann.de`; derselbe Worker bedient zusätzlich die Route `www.zumhermann.de/*` und leitet Pfad und Query-String auf den Apex um.
- `_headers` setzt CSP, Frame-, Referrer-, MIME- und Permissions-Schutz sowie kontrolliertes Caching.
- Cloudflare Web Analytics, Zaraz, Rocket Loader, Apps, Turnstile/Access und cookie-setzende Bot- oder
  Challengefunktionen werden nicht über dieses Repository gesteuert und müssen im Dashboard geprüft
  und deaktiviert bleiben, solange sie nicht gesondert freigegeben sind.

## Zwingende Vorbedingungen

Vor jedem echten `wrangler deploy` müssen alle Punkte erfüllt sein:

1. vollständige Betreiberanschrift, Kontakt-E-Mail und weitere schnelle Kontaktmöglichkeit;
2. geprüfte Angaben zu Umsatzsteuer-/Wirtschafts-Identifikationsnummer, falls vorhanden;
3. abgeschlossene VSBG-Entscheidung;
4. tatsächlicher Cloudflare-Vertragspartner und Cloudflare-Zonenplan dokumentiert;
5. reale Security-/Zugriffslogfelder und deren planabhängige Aufbewahrung geprüft;
6. DPA/AVV, Empfänger, Unterauftragnehmer, Verarbeitungsorte und Drittlandgarantien dokumentiert;
7. Dashboard-Audit der Analytics-, Zaraz-, WAF-, Bot-, Challenge-, Rate-Limit-, Logpush- und
   Data-Localization-Einstellungen;
8. rechtliche Freigabe von Impressum und Datenschutzerklärung;
9. ausdrückliche Freigabe der externen Website-Bereitstellung über
   `release.externalReviewApproved: true`;
10. `npm run legal:check` und `npm run release:build` erfolgreich.

Die Website darf damit zunächst wahrheitsgemäß, nicht indexiert und mit nicht klickbaren Store-Hinweisen bereitgestellt werden. Der finale App-Produktionsbinary-/Netzwerkaudit (`release.appProductionAuditComplete`) und die öffentliche Marketing-/Indexierungsfreigabe (`release.publicReleaseApproved`) folgen getrennt vor dem App-Launch.

Der Befehl `npm run deploy` führt das vollständige Release-Gate automatisch aus und kann es nicht
überspringen. Ein direktes `wrangler deploy` ist kein freigegebener Produktionsweg.

## Aktueller Cloudflare- und DNS-Status

Am 19. August 2026 wurde Wrangler 4.123.0 per OAuth geprüft. Werner hat die Nutzung des aktiven
Cloudflare-Accounts für dieses persönliche Projekt ausdrücklich freigegeben. Die nicht geheime
Account-ID `0db45adad30041a8fb85829450807027` ist in `wrangler.jsonc` fest gepinnt; die
Accountbezeichnung begründet keine Projektbeteiligung der GmbH.

Die DNS-Zone ist zu Cloudflare delegiert und der Cutover ist abgeschlossen:

- autoritative Nameserver: `bart.ns.cloudflare.com` und `brianna.ns.cloudflare.com`;
- genau ein Worker `zumhermann-webseite` bedient die Apex-Custom-Domain und die `www`-Route;
- Worker-Version: `ac6f004e-0f58-4348-bce1-b97e4a9ee651`;
- der Apex wird über Cloudflares verwalteten Custom-Domain-DNS ausgeliefert;
- der proxied `www`-CNAME zu `ext-sq.squarespace.com` bleibt als Rollbackziel bestehen, wird aber von
  der Worker-Route abgefangen und kanonisch umgeleitet;
- „Always Use HTTPS“ ist aktiv;
- Proton-MX, SPF, drei DKIM-CNAMEs, DMARC und Verifizierungs-TXT sind autoritativ korrekt;
- es ist weiterhin kein DS-Record veröffentlicht.

Aktive Proton-Mail-Konfiguration (alle übrigen Records und insbesondere das vorhandene
Proton-Verifizierungs-TXT blieben unverändert):

| Typ | Name | Ziel/Wert | Priorität / Proxy |
| --- | --- | --- | --- |
| MX | `@` | `mail.protonmail.ch` | 10 |
| MX | `@` | `mailsec.protonmail.ch` | 20 |
| TXT | `@` | `v=spf1 include:_spf.protonmail.ch ~all` | aktiv |
| CNAME | `protonmail._domainkey` | `protonmail.domainkey.dhky6dppghqaaufvh4ldegfq3rn7valvnmvr7dphh5fpzrhypzlda.domains.proton.ch` | DNS-only |
| CNAME | `protonmail2._domainkey` | `protonmail2.domainkey.dhky6dppghqaaufvh4ldegfq3rn7valvnmvr7dphh5fpzrhypzlda.domains.proton.ch` | DNS-only |
| CNAME | `protonmail3._domainkey` | `protonmail3.domainkey.dhky6dppghqaaufvh4ldegfq3rn7valvnmvr7dphh5fpzrhypzlda.domains.proton.ch` | DNS-only |
| TXT | `_dmarc` | `v=DMARC1; p=quarantine` | aktiv |

Beim Cutover am 19. August 2026 abgeschlossen:

1. freigegebenen Cloudflare-Account und fest gepinnte Account-ID nochmals prüfen;
2. vollständigen aktuellen DNS- und Dashboardzustand exportieren beziehungsweise dokumentieren;
3. Proton-MX-, SPF-, DKIM- und DMARC-Einträge anhand der bestätigten Mailkonfiguration reparieren;
4. den vorhandenen Squarespace-Zustand für Apex und `www` als ersten Rollback dokumentieren;
5. den vorhandenen proxied `www`-Record als Rollbackziel beibehalten und die Route
   `www.zumhermann.de/*` im einzigen Worker mit Status 301, Pfadübernahme und erhaltenem Query-String
   auf den Apex leiten;
6. „Always Use HTTPS“ für die Zone aktivieren. Die CSP-Direktive `upgrade-insecure-requests` ersetzt
   keine Weiterleitung der obersten HTTP-Anfrage;
7. `npm run deploy` für die Apex-Custom-Domain ausführen und die Live-Matrix prüfen.

Offen bleibt lediglich ein praktischer Empfangs- und Versandtest von `tach@zumhermann.de` aus einem
unabhängigen Postfach; die autoritativen DNS-Einträge sind vollständig.

## Lokale technische Prüfung

```sh
npm ci
npm run check
npm run build
npm run worker:audit
npm run worker:smoke
npm run worker:dry-run
```

Die Prüfungen decken ab:

- Astro/TypeScript, interne Links und Alternativtexte;
- Worker-Konfiguration, Domain, deaktivierte öffentliche Previews und Loggingoptionen;
- Buildlinks, JSON-LD, fehlende ausführbare Skripte und CSP;
- Assetzahl, 25-MiB-Dateigrenze, unerwünschte Entwicklungsdateien und externe Ressourcen;
- sortiertes SHA-256-Manifest unter `.wrangler/audit/`;
- lokale Worker-Routen, Slash-Weiterleitung, eigene 404, Sicherheits-/Cacheheader und `Set-Cookie`;
- Wrangler-Bundle im Dry-Run unter `.wrangler/dry-run/`.

Der Dry-Run lädt keine Assets hoch und ersetzt weder Inventur noch Smoke-Test.

## Freigegebener Produktionsablauf

Nach Abschluss aller Vorbedingungen:

```sh
npx wrangler whoami
npm run deploy
```

Wrangler baut und prüft zuerst das Release-Artefakt und veröffentlicht danach mit `--strict`. Die
Custom Domain erzeugt den erforderlichen DNS-Eintrag und das Zertifikat über Cloudflare. Das
Repository enthält keine Zugangsdaten. Lokale Tokens liegen ausschließlich in der ignorierten Datei
`../.api-keys`; CI würde zusätzlich einen eng begrenzten
`CLOUDFLARE_API_TOKEN` und die `CLOUDFLARE_ACCOUNT_ID` als GitHub-Secrets benötigen.

## Abnahme nach Deployment

Am 19. August 2026 bestanden:

- `http://zumhermann.de` muss einmalig auf `https://zumhermann.de` weiterleiten;
- `https://zumhermann.de/`, `/impressum`, `/datenschutz` und `/support` müssen HTTP 200 liefern;
- `/impressum/` muss auf `/impressum` weiterleiten;
- eine unbekannte URL muss die eigene Seite mit HTTP 404 liefern;
- `/_headers` muss HTTP 404 liefern;
- `www.zumhermann.de` muss einmalig auf den passenden Apex-Pfad weiterleiten;
- Zertifikat, Canonicals, Open Graph und Sitemap nutzen exakt `zumhermann.de`; Cloudflare ergänzt die
  ausgelieferte `robots.txt` um seine verwalteten Content-Signals/AI-Crawler-Regeln;
- Bei externer Vorab-Bereitstellung dürfen Pflichtseiten keine Platzhalter oder Entwurfsbanner enthalten; `noindex` muss bis zum finalen App-Audit und zur öffentlichen Freigabe bestehen bleiben.
- Beim öffentlichen App-Launch darf `noindex` nur auf der 404-Seite verbleiben;
- Sicherheitsheader, MIME-Typen, ETags und 304-Antworten kontrollieren;
- keine `Set-Cookie`-Header, externen Ressourcen oder Browser-Speicherzugriffe;
- Cloudflare-Dashboardzustand gegen die freigegebenen Datenschutzangaben dokumentieren;
- Desktop, Tablet und Smartphone visuell prüfen. Der ausgelieferte Inhalt ist identisch mit dem zuvor
  lokal visuell geprüften Artefakt; eine frische Browserprüfung folgt nach Ablauf lokaler DNS-Caches.

## Rollback

Bei Fehlern den letzten geprüften Worker-Stand mit Wrangler/Cloudflare zurückrollen oder die Custom
Domain und `www`-Route entfernen. Für einen vollständigen Web-Rollback zu Squarespace die vier
proxied Apex-A-Records `198.185.159.144`, `198.49.23.144`, `198.185.159.145` und `198.49.23.145`
wiederherstellen; der proxied `www`-CNAME `ext-sq.squarespace.com` blieb erhalten. Proton-MX, SPF,
DKIM, DMARC und Verifizierungs-TXT gehören zum Mailbetrieb und werden bei einem reinen Website-
Rollback nicht zurückgesetzt. Pflichtangaben dürfen nicht durch ein Rollback auf einen
Platzhalterstand ersetzt werden.
