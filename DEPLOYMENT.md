# Deployment als Cloudflare Worker – vorbereitet, derzeit gesperrt

Stand: 18. August 2026
Ziel: `https://zumhermann.de` über Cloudflare Workers Static Assets

Die Website ist als asset-only Worker vorbereitet: Cloudflare liefert den statischen Inhalt aus
`dist/` direkt aus, ohne eigenen Worker-Laufzeitcode, Backend, Datenbank oder Secrets. Die verbindliche
Konfiguration liegt in `wrangler.jsonc`. **Eine öffentliche Bereitstellung bleibt gesperrt, solange
`npm run legal:check` fehlschlägt.**

## Sicherheitsmodell

- `workers_dev: false` deaktiviert die öffentliche `*.workers.dev`-Adresse.
- `preview_urls: false` deaktiviert öffentliche Versions- und Alias-Previews.
- `observability.enabled: false` und `logpush: false` verhindern Workers Logs/Logpush aus dieser
  Projektkonfiguration.
- Es gibt keinen `main`-Entrypoint und keine Bindings; statische Treffer rufen keinen Worker-Code auf.
- `not_found_handling: "404-page"` liefert die eigene Fehlerseite mit HTTP 404.
- `html_handling: "drop-trailing-slash"` entspricht den slashlosen Astro-URLs.
- Die einzige konfigurierte Custom Domain ist `zumhermann.de`.
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
8. finaler App-Produktionsbinary-/Netzwerkaudit und erst danach
   `release.appProductionAuditComplete: true`;
9. rechtliche Freigabe von Impressum und Datenschutzerklärung;
10. ausdrückliche Veröffentlichungsfreigabe von Werner Francis Reineke;
11. `npm run legal:check` und `npm run release:build` erfolgreich.

Der Befehl `npm run deploy` führt das vollständige Release-Gate automatisch aus und kann es nicht
überspringen. Ein direktes `wrangler deploy` ist kein freigegebener Produktionsweg.

## Aktueller Cloudflare- und DNS-Status

Am 18. August 2026 wurde Wrangler 4.123.0 erfolgreich per OAuth geprüft. Der aktive Account darf
Workers verwalten; ein Worker `zumhermann-webseite` existiert dort noch nicht.

Die öffentliche DNS-Zone ist jedoch noch nicht zu Cloudflare delegiert:

- Nameserver: `nse1` bis `nse4.squarespacedns.com`;
- Apex: vier Squarespace-A-Records;
- `www`: CNAME `ext-sq.squarespace.com`;
- vorhandener Apex-TXT-Record: `v=spf1 -all`;
- Apex und `www` zeigen derzeit getrennte Squarespace-„Coming Soon“-Seiten.

Vor dem Custom-Domain-Deployment:

1. alle DNS-Einträge im Squarespace-Konto exportieren oder vollständig dokumentieren;
2. unmittelbar vor der Umstellung DNSSEC-/DS-Status beim Registrar erneut prüfen;
3. `zumhermann.de` im richtigen Cloudflare-Account als Zone hinzufügen;
4. mindestens den vorhandenen SPF-TXT-Record unverändert übernehmen und alle weiteren Records gegen
   den Export prüfen;
5. die von Cloudflare genannten autoritativen Nameserver beim Registrar/Squarespace setzen;
6. warten, bis die Cloudflare-Zone aktiv ist;
7. bestehende Squarespace-A-Records am Apex erst entfernen, wenn der Worker-Cutover vorbereitet ist;
8. den Squarespace-CNAME für `www` durch einen proxied A-Record auf die reservierte Adresse
   `192.0.2.0` (alternativ proxied AAAA auf `100::`) ersetzen und in Cloudflare eine Redirect Rule von
   `https://www.zumhermann.de/*` auf `https://zumhermann.de/${1}` mit Status 301 und aktivierter
   Übernahme des Query-Strings einrichten;
9. „Always Use HTTPS“ für die Zone aktivieren. Die CSP-Direktive `upgrade-insecure-requests` ersetzt
   keine Weiterleitung der obersten HTTP-Anfrage.

Cloudflare Custom Domains erfordern eine aktive Cloudflare-Zone. Der Deploy darf nicht gestartet
werden, solange die Nameserverumstellung, der DNS-Abgleich oder die Pflichtangaben offen sind.

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
Repository enthält keine Zugangsdaten; CI würde zusätzlich einen eng begrenzten
`CLOUDFLARE_API_TOKEN` und die `CLOUDFLARE_ACCOUNT_ID` als GitHub-Secrets benötigen.

## Abnahme nach Deployment

- `http://zumhermann.de` muss einmalig auf `https://zumhermann.de` weiterleiten;
- `https://zumhermann.de/`, `/impressum`, `/datenschutz` und `/support` müssen HTTP 200 liefern;
- `/impressum/` muss auf `/impressum` weiterleiten;
- eine unbekannte URL muss die eigene Seite mit HTTP 404 liefern;
- `/_headers` muss HTTP 404 liefern;
- `www.zumhermann.de` muss einmalig auf den passenden Apex-Pfad weiterleiten;
- Zertifikat, Canonicals, Open Graph, Sitemap und `robots.txt` müssen exakt `zumhermann.de` nutzen;
- Pflichtseiten dürfen keine Platzhalter, Entwurfsbanner oder `noindex` enthalten; die 404-Seite schon;
- Sicherheitsheader, MIME-Typen, ETags und 304-Antworten kontrollieren;
- keine `Set-Cookie`-Header, externen Ressourcen oder Browser-Speicherzugriffe;
- Cloudflare-Dashboardzustand gegen die freigegebenen Datenschutzangaben dokumentieren;
- Desktop, Tablet und Smartphone visuell prüfen.

## Rollback

Bei Fehlern den letzten geprüften Worker-Stand mit Wrangler/Cloudflare zurückrollen oder die Custom
Domain entfernen. DNS- und Zertifikatsänderungen werden getrennt dokumentiert. Pflichtangaben dürfen
nicht durch ein Rollback auf einen Platzhalterstand ersetzt werden.
