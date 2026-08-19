# Website-Handoff – zumHermann

Stand: 18. August 2026
Projektpfad: `/Users/werner/Documents/zumHermann/zumhermann-web`  
Veröffentlichungsstatus: **lokal vollständig gebaut, öffentliche Veröffentlichung gesperrt**

## Was gebaut wurde

- eigenständige statische Astro-/TypeScript-Website, getrennt vom App-Code;
- Startseite mit Hero, exakter Positionierung, nicht klickbaren Store-Hinweisen, drei Schritten, vier Funktionen, Vertrauensabschnitt, regionaler Einordnung, prominentem Gesundheitsdisclaimer, FAQ und Footer;
- HTML-Seiten für Impressum, Datenschutz und Support;
- benutzerfreundliche 404-Seite;
- responsive Gestaltung für kleine und große Smartphones, Tablets und Desktop;
- zentrale Konfiguration in `src/config/site.ts`;
- Sitemap, robots.txt, Favicons, App-Icon, Open Graph, Twitter-Metadaten und `SoftwareApplication`-Strukturdaten;
- asset-only Cloudflare Worker mit Static Assets, Custom 404, slashlosem Routing und Sicherheitsheadern;
- öffentliche `workers.dev`- und Preview-URLs sowie Workers Observability und Logpush deaktiviert;
- kein Backend, kein Tracking, keine Werbung, kein Cookie-Banner und kein eigenes Client-JavaScript;
- Rechts-/Pflichtangabengate, Inhaltsprüfung, Build-Ausgabeprüfung und GitHub-Actions-Workflows.

## Verwendete Markenassets

Kanonische, unveränderte Quelle:

- `../design-reference/ueberm-teuto.png`
- 1536 × 1024 Pixel
- SHA-256 `24551b26a5e605069ac2cbfcf547965e5dbd6e74198411e16ab69904960ff8dd`

Im Websiteprojekt:

- `public/assets/brand-source.png` – byte-identische Archivkopie der Quelle;
- `public/assets/brand-lockup.png` – direkter 1216 × 560-Quellbeschnitt aus der bestehenden App-Assetpipeline;
- `public/assets/brand-lockup-608.png` – proportionale Skalierung für kleinere Bildschirme;
- `public/assets/hermann-scene.png` – direkter Szenenbeschnitt;
- `public/assets/social-preview.png` – byte-identische Kopie des freigegebenen Lockups;
- `public/assets/app-icon.png` und `public/assets/favicon.png` – vorhandene freigegebene App-Ableitungen.

Kein Asset wurde neu gezeichnet oder durch eine Ersatzillustration ersetzt. Das Original enthält C2PA-Provenienzmetadaten; die byte-identische Archivkopie bewahrt sie. Bereits vorhandene App-Crops enthalten diese Zusatzmetadaten nicht.

## App-Code-Audit als Grundlage der Datenschutzerklärung

- Foreground-Standort und Geräteheading werden für Entfernung und Richtung genutzt.
- Berechnung erfolgt lokal gegen die feste Denkmalposition.
- Keine Übertragung von Standort oder Heading an den konfigurierten persönlichen Betreiber oder ein eigenes Backend im geprüften App-Code.
- Kein Konto, keine Werbung, keine Betreiber-Analytics, kein Tracking, keine Remote-API und kein Drittanbieter-Crash-SDK im geprüften Stand.
- Dauerhaft gespeichert wird nur der lokale Onboardingstatus.
- Share-Grafik enthält gerundete Distanz und Richtungsgenauigkeit, aber keine exakte Position, Koordinaten, Ortsangabe oder Zeit.
- Die systemeigene Teilen-Funktion überlässt Empfänger und Ziel-App dem Nutzer.
- Apple-/Google-Plattformdienste und Standortkomponenten werden ausdrücklich getrennt von der fehlenden Betreiberübertragung beschrieben.

Offen bleibt vor dem App-Release der Audit des finalen Produktionsbinarys, einschließlich Netzwerkverhalten, Manifeste, Backup, `expo-dev-client`, Subscription-Lebenszyklus und temporärer Share-Datei.

## Testergebnisse

Erfolgreich:

- Astro-/TypeScript-Prüfung: 25 Dateien, 0 Fehler, 0 Warnungen, 0 Hinweise;
- Inhaltsprüfung: Pflichtseiten, interne Links, Sprungziele und Bild-Alternativtexte;
- statischer Astro-Build: 5 HTML-Seiten plus robots.txt und Sitemap;
- Post-Build-Prüfung: interne Links, Assets, Alternativtexte und Pflichtdateien;
- Browserprüfung ohne Warnungen oder Fehler;
- responsive Sichtprüfung bei 390 × 844 und 1280 × 720 Pixeln;
- FAQ-Interaktion;
- keine horizontale Überbreite auf den geprüften Mobilseiten;
- kein extern geladenes Bild, Stylesheet oder Skript in der Browserprüfung;
- freundliche 404-Ausgabe;
- exakte Asset-Hashes und Bilddimensionen geprüft;
- unabhängiger Vorbuild-Audit durch zwei Prüfer: technisch freigegeben, alle Befunde behoben;
- Worker-Artefaktprüfung: 15 Assets plus eine `_headers`-Metadatei, 4.789.667 Byte, größte Datei
  1.423.624 Byte, vollständiges SHA-256-Manifest;
- lokaler Wrangler-Smoke-Test: acht Headerregeln, slashlose Routen, Weiterleitung, eigene 404,
  Sicherheits-/Cacheheader und fehlende `Set-Cookie`-Header geprüft;
- Wrangler-Dry-Run: erwarteter 313-Byte-No-op-Worker ohne Imports, Bindings oder eigenen Laufzeitcode;
- unabhängiger Post-Build-Audit durch zwei Prüfer: technisch GO, keine zusätzlichen Befunde;
- `npm audit` und `npm audit --omit=dev`: 0 bekannte Schwachstellen.

Die maschinenlesbaren Hash-, Inventar-, Smoke- und Dry-Run-Nachweise liegen lokal unter `.wrangler/`
und werden vom manuellen Release-Workflow zusammen mit `dist/` archiviert.

Erwartet fehlgeschlagen:

- `npm run legal:check`, weil echte Pflichtangaben und Freigaben fehlen. Dies ist die beabsichtigte Veröffentlichungssperre.

## Offene Pflichtangaben

Exakt offen sind:

- persönliche Cloudflare-Kundenidentität statt des aktuell als GmbH bezeichneten Accounts;
- Bestätigung von Self-Serve-Vertrag/DPA und Dashboardaudit optionaler Analyse-, Sicherheits-, Cookie-,
  Logging- und Lokalisierungsfunktionen; danach `privacyDetailsComplete = true`;
- Proton-MX-/SPF-/DKIM-Konfiguration und externer Empfangstest für `tach@zumhermann.de`;
- DNS-/Squarespace-Rollback, `www`-Weiterleitung und HTTPS-Erzwingung;
- gegebenenfalls Umsatzsteuer-Identifikationsnummer oder Wirtschafts-Identifikationsnummer, sofern vorhanden und rechtlich zu veröffentlichen;
- VSBG-Entscheidung anhand Unternehmerstatus, Beschäftigtenzahl, Bindung und Bereitschaft;
- Apple-App-Store-URL, sobald die App dort verfügbar ist;
- Google-Play-URL, sobald die App dort verfügbar ist;
- finale Produktionsbinary-/Netzwerkprüfung der App;
- dokumentierte Bestätigung der finalen App-Prüfung über `release.appProductionAuditComplete`; diese ist von der vorher möglichen Freigabe der rechtlich vollständigen, nicht indexierten Website getrennt;
- ausdrückliche öffentliche Veröffentlichungsfreigabe.

Eine persönliche Steuernummer darf nicht veröffentlicht oder angefordert werden.

## Schritte zur Veröffentlichung

1. Die persönliche Cloudflare-Kundenidentität, Mail-DNS, Dashboardprüfung und VSBG-Angabe klären.
2. `privacyDetailsComplete` erst nach dieser Prüfung setzen.
3. `npm run legal:check` und `npm run release:build` erfolgreich ausführen.
4. DNS nach `DEPLOYMENT.md` sichern und erst nach separater Freigabe die nicht indexierte Website bereitstellen.
5. Live-Support-, Datenschutz- und Impressumsseiten prüfen; Store-Hinweise bleiben nicht klickbar.
6. Danach das finale App-Binary und die Plattformmanifeste prüfen und `appProductionAuditComplete` setzen.
7. Nach Store-Bereitschaft und separater Marketingfreigabe `publicReleaseApproved` setzen und erneut bereitstellen.
8. Das öffentliche Ergebnis technisch, visuell und datenschutzseitig abnehmen.

## Git und GitHub-Repository

Das Websiteverzeichnis ist ein eigenständiges Git-Repository mit `main` als Standardbranch. Der SSH-Remote ist
`git@github.com:rewerner42/zumhermann-webseite.git`; der zuvor vorhandene README-Initialstand wurde
ohne Force-Push in die Websitehistorie aufgenommen. Änderungen am übergeordneten App-Repository sind
nicht Bestandteil der Website-Commits.

Die Repository-Seite ist derzeit ohne GitHub-Anmeldung mit HTTP 200 erreichbar und damit öffentlich.
Eine Änderung der GitHub-Sichtbarkeit wurde für diesen Worker-Auftrag weder angefordert noch vorgenommen.

Wrangler 4.123.0 ist lokal per OAuth angemeldet, aber der aktive Cloudflare-Account trägt noch die
GmbH-Bezeichnung. Diese Kundenidentität muss vor dem persönlichen Release geklärt werden. Im Account
existiert noch kein Worker `zumhermann-webseite`; der erste erfolgreiche Produktionsdeploy wäre daher
eine Neuanlage und ein echter Domain-Cutover. Zugangsdaten, Tokens und private Schlüssel werden weder
im Repository noch in dieser Dokumentation gespeichert.

## Spätere Pflege

- Store-Links ausschließlich zentral in `src/config/site.ts` pflegen.
- Bei Änderung von Hoster, Tarif, Sicherheitsdiensten, Store-SDKs oder App-Datenflüssen die Datenschutzerklärung vorab aktualisieren.
- Bei journalistisch-redaktionellen Inhalten § 18 Abs. 2 MStV neu prüfen.
- Bei veränderter Beschäftigtenzahl, AGB oder Schlichtungsbindung VSBG-Angabe neu prüfen.
- EU-Streitbeilegungsrecht spätestens vor einem Release ab 2028 erneut prüfen.
- Abhängigkeiten und GitHub Actions regelmäßig aktualisieren und `npm run check` sowie `npm run build` wiederholen.

## Rechtlicher Hinweis

Die Texte wurden sorgfältig anhand des tatsächlichen App-Codes und aktueller amtlicher Primärquellen technisch vorbereitet. Sie ersetzen keine individuelle Rechtsberatung.
