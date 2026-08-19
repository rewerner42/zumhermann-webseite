# Deployment als Cloudflare Worker – vorbereitet, derzeit gesperrt

Stand: 19. August 2026
Ziel: `https://zumhermann.de` über Cloudflare Workers Static Assets; `www.zumhermann.de` leitet dauerhaft auf den kanonischen Apex weiter.

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
- Die einzige Worker-Custom-Domain ist `zumhermann.de`; `www` wird per Cloudflare Single Redirect mit Pfad und Query-String auf den Apex geleitet.
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

Am 19. August 2026 wurde Wrangler 4.123.0 per OAuth geprüft. Der aktive Account darf Workers
verwalten, ist aber noch als **Reineke Technik GmbH** bezeichnet und verwendet
`wf.reineke@reineke-technik.de`. Da zumHermann Werner persönlich gehört, darf erst nach bestätigter
Umstellung auf den persönlichen Cloudflare-Kunden oder nach Auswahl eines persönlichen Accounts
deployt werden. Anschließend wird dessen nicht geheime Account-ID in `wrangler.jsonc` fest gepinnt.

Die DNS-Zone ist bereits zu Cloudflare delegiert:

- autoritative Nameserver: `bart.ns.cloudflare.com` und `brianna.ns.cloudflare.com`;
- Apex und `www` laufen durch Cloudflares Proxy, liefern aktuell aber noch die Squarespace-Seite samt
  `crumb`-Cookie;
- HTTP wird aktuell noch nicht auf HTTPS umgeleitet;
- TXT vorhanden: Proton-Verifizierung und `v=spf1 -all`;
- autoritativ waren keine MX- und keine DS-Records vorhanden.

Vor dem Custom-Domain-Deployment:

1. Cloudflare-Account/Kundenidentität auf Werner persönlich klären und dessen Account-ID fest pinnen;
2. vollständigen aktuellen DNS- und Dashboardzustand exportieren beziehungsweise dokumentieren;
3. Proton-MX-, SPF- und DKIM-Einträge anhand der tatsächlichen Mailkonfiguration reparieren und
   `tach@zumhermann.de` aus einem unabhängigen externen Postfach testen;
4. den vorhandenen Squarespace-Zustand für Apex und `www` als ersten Rollback dokumentieren;
5. für `www` einen proxied Platzhalter-A-Record auf `192.0.2.0` und eine Cloudflare Single Redirect
   Rule von `https://www.zumhermann.de/*` nach `https://zumhermann.de/${1}` mit Status 301,
   Pfadübernahme und erhaltenem Query-String vorbereiten;
6. „Always Use HTTPS“ für die Zone aktivieren. Die CSP-Direktive `upgrade-insecure-requests` ersetzt
   keine Weiterleitung der obersten HTTP-Anfrage;
7. erst danach `npm run deploy` für die Apex-Custom-Domain ausführen.

Der Deploy darf nicht gestartet werden, solange Kundenidentität, Mail-DNS, Pflichtangaben oder
Dashboardzustand offen sind.

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
- Bei externer Vorab-Bereitstellung dürfen Pflichtseiten keine Platzhalter oder Entwurfsbanner enthalten; `noindex` muss bis zum finalen App-Audit und zur öffentlichen Freigabe bestehen bleiben.
- Beim öffentlichen App-Launch darf `noindex` nur auf der 404-Seite verbleiben;
- Sicherheitsheader, MIME-Typen, ETags und 304-Antworten kontrollieren;
- keine `Set-Cookie`-Header, externen Ressourcen oder Browser-Speicherzugriffe;
- Cloudflare-Dashboardzustand gegen die freigegebenen Datenschutzangaben dokumentieren;
- Desktop, Tablet und Smartphone visuell prüfen.

## Rollback

Bei Fehlern den letzten geprüften Worker-Stand mit Wrangler/Cloudflare zurückrollen oder die Custom
Domain entfernen. DNS- und Zertifikatsänderungen werden getrennt dokumentiert. Pflichtangaben dürfen
nicht durch ein Rollback auf einen Platzhalterstand ersetzt werden.
