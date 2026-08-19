# Website-Umsetzungsplan – zumHermann

Stand: 18. August 2026
Projektstatus: **technisch umgesetzt und geprüft, nicht zur Veröffentlichung freigegeben**

## 1. Festgestellter Zustand des App-Projekts

- Das bestehende App-Projekt liegt unter `../app` und ist eine Expo-/React-Native-App mit TypeScript.
- Das übergeordnete App-Repository enthält bereits nicht von diesem Websiteprojekt stammende, uncommittete Änderungen. Diese werden weder verändert noch in das Website-Repository aufgenommen.
- Die App nutzt `expo-location` für Standort und Geräteausrichtung. Entfernung und Zielpeilung werden im App-Code lokal berechnet.
- Der Einführungsstatus wird mit AsyncStorage lokal unter `zumhermann.onboarding.complete` gespeichert.
- Die Teilen-Funktion erzeugt lokal eine PNG-Datei und öffnet die systemeigene Teilen-Funktion. Der Payload enthält Distanz und Winkelgenauigkeit, aber keine Nutzerkoordinaten; der Code prüft ausdrücklich auf verbotene Koordinaten- und Ortsangaben.
- Im geprüften Paketstand sind keine Analytics-, Werbe-, Crash-Reporting- oder Remote-API-SDKs als App-Abhängigkeiten vorgesehen. `expo-dev-client` ist jedoch eine direkte Entwicklungsabhängigkeit; Produktionsbinary, Plattformmanifeste und Netzwerkverhalten bleiben deshalb vor der rechtlichen Freigabe gesondert zu prüfen.
- Sensor-Subscriptions werden beim Cleanup des Mess-Hooks beendet, aber im aktuellen Navigationsaufbau nicht nachweislich in jedem Zustand sofort beim Verdecken des Kompassscreens. Die Datenschutzerklärung verspricht daher nur lokale Verarbeitung während einer aktiven Messsitzung; der Lebenszyklus bleibt ein Release-Testpunkt.
- Die Website entsteht ausschließlich in diesem getrennten Verzeichnis und als eigenes Git-Repository.

## 2. Freigegebene Markenassets

Visuelle Quelle der Wahrheit:

- `../design-reference/ueberm-teuto.png` – 1536 × 1024 Pixel, PNG; laut bestehendem Design-Handoff die einzige freigegebene visuelle Quelle.

Die Quelle und die neue App-Designumsetzung waren im übergeordneten App-Repository zum Prüfzeitpunkt noch uncommittet. Die Website übernimmt die festgestellte Datei byte-identisch, verändert das App-Projekt aber nicht.

Bereits im App-Projekt technisch daraus abgeleitete Assets:

- `../app/assets/brand/brand-lockup.png` – 1216 × 560 Pixel; vollständige Szene mit Wortmarke.
- `../app/assets/brand/hermann-scene.png` – 480 × 368 Pixel; Szene ohne Wortmarke.
- `../app/assets/app-icon-reference.png` – 1024 × 1024 Pixel; App-Icon-Ableitung.
- `../app/assets/favicon-reference.png` – 196 × 196 Pixel; Favicon-Ableitung.

Vorgehen:

- Die freigegebene PNG bleibt unverändert.
- Für Hero und zentrale Markenreferenz wird die bereits abgeleitete, unveränderte Lockup-PNG kopiert.
- Für Favicons, App-Icon und Social Preview werden ausschließlich bestehende direkte Ableitungen oder reproduzierbare Zuschneide-/Skalierexporte aus der Quelle verwendet; keine Neuzeichnung und keine generierte Ersatzillustration.

## 3. Seitenstruktur

- `/` – Startseite mit Hero, Positionierung, deaktivierten Store-Hinweisen, Funktionsweise, Funktionen, Vertrauen, regionaler Erzählung, Disclaimer, FAQ und Footer.
- `/impressum` – interner rechtlicher Entwurf mit zentral verwalteten Pflichtplatzhaltern.
- `/datenschutz` – getrennte Erläuterungen für Website und App.
- `/support` – Supportweg, typische Hilfethemen und transparente Kontaktplatzhalter.
- `/404.html` – benutzerfreundliche Fehlerseite mit Rückweg zur Startseite.

## 4. Komponentenstruktur

- `BaseLayout` – HTML-Grundgerüst, Navigation, Metadaten, strukturierte Daten und Footer.
- `Header` / `Footer` – wiederverwendbare globale Navigation.
- `StoreButtons` – echte Links erst nach Konfiguration; vorher nicht klickbare „Demnächst erhältlich“-Elemente.
- `SectionHeading` – einheitliche Abschnittseinleitungen.
- `FeatureCard` – Funktionsübersicht.
- `StepCard` – drei Schritte der App-Nutzung.
- semantische, ohne JavaScript bedienbare FAQ mit nativen `details`/`summary`-Elementen.
- `LegalDraftNotice` – sichtbarer Hinweis auf unvollständige Pflichtangaben im lokalen Entwurf.

## 5. Technische Entscheidungen

- Astro mit TypeScript im strikten Modus und statischer Ausgabe nach `dist/`.
- Semantisches HTML und wartbares, globales CSS mit Custom Properties als Design-Tokens.
- Kein clientseitiges Framework und kein eigenes Client-JavaScript; interaktive FAQ über natives HTML.
- Systemnahe lokale Font-Stacks, keine externen Fonts oder sonstigen Drittressourcen.
- Keine Cookies, kein Tracking, keine Werbung, keine Analyse, kein Local Storage, kein Backend und keine Datenbank.
- Zentrale Betreiber-, Domain-, Hosting- und Store-Konfiguration in `src/config/site.ts`.
- Relative interne Links für den lokalen Entwurf; Canonical-, Open-Graph- und Sitemap-URLs werden technisch aus der zentralen Domainkonfiguration erzeugt. Der Releasecheck blockiert eine Platzhalter-Domain.
- Sicherheitsheader als von Cloudflare Workers Static Assets ausgewertete `_headers`-Datei.
- Node.js 24 LTS als dokumentierte Build-Umgebung; Astro benötigt mindestens Node.js 22.12.0.

## 6. Datenschutzkonzept

- Die Website selbst verarbeitet im Browser keine Standort-, Analyse- oder Profildaten und setzt keine nicht notwendigen Speichertechniken ein; daher kein Cookie-Banner.
- Unvermeidbare Hosting-/Zugriffsdaten werden erst nach Festlegung des Hosters konkret beschrieben. Anbieter, Speicherdauer, Empfänger und Drittlandbezug werden nicht erfunden.
- Supportanfragen werden als vom Nutzer initiierte Kommunikation beschrieben; Kontaktadresse bleibt bis zur Konfiguration ein Platzhalter.
- App-Aussagen werden aus dem tatsächlichen Code abgeleitet: lokale Standort-/Kompassverarbeitung, lokaler Onboardingstatus, systemeigene Teilen-Funktion und keine genaue Nutzerposition in der Ergebnisgrafik.
- Rechte betroffener Personen und Beschwerderecht werden verständlich erläutert. Rechtliche Texte bleiben als sorgfältig technisch vorbereiteter Entwurf gekennzeichnet und ersetzen keine individuelle Rechtsberatung.

## 7. GitHub- und Deploymentstrategie

- Eigenes Git-Repository ausschließlich in diesem Verzeichnis.
- Sinnvoll getrennte Commits für Planung/Grundgerüst, Umsetzung/Assets, Qualität/Dokumentation.
- GitHub-Repository `rewerner42/zumhermann-webseite` auf `main`; Veröffentlichung der Quelländerungen ausschließlich aus dem eigenständigen Website-Repository. Das Repository ist derzeit ohne Anmeldung öffentlich erreichbar; eine Sichtbarkeitsänderung ist nicht Bestandteil dieses Deployments.
- Kein öffentliches Deployment ohne echte Domain, vollständige Hosting-Datenschutzangaben, bestandenen `npm run legal:check` und ausdrückliche Freigabe von Werner Francis Reineke-Ryskiewicz.
- Cloudflare Workers Static Assets als Ziel: asset-only, Ausgabe `dist`, kein `main`-Entrypoint, keine Bindings, keine Secrets.
- Produktionsdomain `zumhermann.de` als Custom Domain; `workers.dev`, Preview URLs, Workers Observability und Logpush ausdrücklich deaktiviert.
- `npm run deploy` erzwingt das vollständige Release-Gate und verwendet einen strikten Wrangler-Deploy.
- Die noch bei Squarespace delegierte DNS-Zone muss erst verlustfrei zu Cloudflare migriert werden; `www` wird per Cloudflare Redirect Rule auf den Apex umgeleitet.

## 8. Automatisierte Tests und Abnahmekriterien

- `npm run check`: Astro-/TypeScript-Prüfung sowie eigene Inhaltsprüfungen für interne Links und Bild-Alternativtexte.
- `npm run build`: erfolgreicher statischer Build nach `dist/`.
- `npm run check:cloudflare`: Workername, Domain, Static-Assets-Modus, Routing, deaktivierte öffentliche Endpunkte/Logs und gegateten Deploy prüfen.
- `npm run worker:audit`: Assetgrenzen, unerwünschte Entwicklungsdateien, externe Ressourcen und SHA-256-Manifest prüfen.
- `npm run worker:smoke`: lokale Worker-Auslieferung für Routing, 404, Sicherheits-/Cacheheader und fehlende Cookies prüfen.
- `npm run worker:dry-run`: Worker-Bundle und Wrangler-Konfiguration ohne Upload paketieren.
- `npm run test:content`: interne Links auf vorhandene Routen/Ziele sowie aussagekräftige `alt`-Attribute prüfen.
- `npm run legal:check`: muss aktuell absichtlich fehlschlagen und vor Release alle `[[...]]`-Platzhalter, Pflichtkontaktangaben, Domain, Hostingabschnitt und Pflichtseiten prüfen.
- Responsive visuelle Prüfung auf kleinem Smartphone, großem Smartphone/Tablet und Desktop.
- Tastaturnavigation, sichtbare Fokuszustände, Kontraste, Überschriftenhierarchie, `lang="de"`, reduzierte Bewegung, robots.txt, Sitemap, Favicons, Open Graph und strukturierte Daten prüfen.
- Keine externen Netzwerkressourcen, Cookies oder unnötige Browser-Speicherung im ausgelieferten HTML.

## 9. Offene Pflichtangaben / Veröffentlichungssperre

- Betreiber und Kontakt sind bestätigt: Werner Francis Reineke-Ryskiewicz, Geseker Str. 26,
  33154 Salzkotten, `tach@zumhermann.de`, 05258 987282.
- Cloudflare-Anbieter-, Lösch-, Empfänger-, Transfer- und LDI-NRW-Angaben sind vorbereitet; offen
  bleiben persönliche Kundenidentität, Self-Serve-Vertrag und Dashboardbestätigung vor
  `privacyDetailsComplete = true`.
- Apple- und Google-Store-URLs bleiben bis zur tatsächlichen Verfügbarkeit bewusst leer.
- Prüfung der konkreten Anwendbarkeit der Verbraucherstreitbeilegungsinformation nach § 36 VSBG (insbesondere Beschäftigtenzahl und Bereitschaft/Verpflichtung)
- Prüfung, ob eine Umsatzsteuer-Identifikationsnummer oder Wirtschafts-Identifikationsnummer besteht und nach § 5 DDG tatsächlich zu veröffentlichen ist; niemals eine persönliche Steuernummer
- Individuelle rechtliche Freigabe der Entwürfe
- Abgeschlossener Produktionsbinary-/Netzwerkaudit der App und dokumentierte Bestätigung über `appProductionAuditComplete`
- Ausdrückliche öffentliche Veröffentlichungsfreigabe

## 10. Ausführungsstatus

| Arbeitspaket | Status |
| --- | --- |
| App-, Asset- und Datenschutzprüfung | abgeschlossen |
| Offizielle Rechtsquellen prüfen | abgeschlossen |
| Astro-Grundgerüst und zentrale Konfiguration | abgeschlossen |
| Seiten und responsives Design | abgeschlossen |
| Assets, Metadaten, Sitemap und Sicherheitsheader | abgeschlossen |
| Release-Gate, Inhaltschecks und CI | abgeschlossen |
| Dokumentation | abgeschlossen |
| Technische und visuelle Abnahme | abgeschlossen |
| Git-Historie und GitHub-Repository | abgeschlossen; SSH-Remote `rewerner42/zumhermann-webseite`, Branch `main`; derzeit öffentlich erreichbar |
| Cloudflare-Worker-Konfiguration und technische Gates | umgesetzt; unabhängiger Quell- und Buildaudit abgeschlossen, technisch GO |
| Cloudflare-Zone und DNS-Migration | blockiert; Nameserver und Webrecords liegen noch bei Squarespace |
| Öffentliches Deployment | blockiert bis Pflichtangaben und Freigabe vorliegen |

## 11. Erweiterungsplan Cloudflare Workers

1. Ist-Zustand, Workername, Cloudflare-Anmeldung, vorhandene Deployments und öffentliches DNS prüfen.
2. Minimalen asset-only Worker mit Custom 404 und slashlosem HTML-Routing konfigurieren.
3. Öffentliche Worker- und Preview-URLs sowie Workers Observability und Logpush deaktivieren.
4. Produktionsbefehl so kapseln, dass `legal:check` vor jedem Upload zwingend ausgeführt wird.
5. Sicherheitsheader auf Workers-Verhalten abstimmen und negative Langzeitcaches für fehlende stabile Assets vermeiden.
6. Release-unverträgliche Entwurfstexte an die zentralen Freigabeflags koppeln.
7. Statische Worker-Konfiguration und Quelländerungen unabhängig auditieren und Findings beheben.
8. Artefakt bauen, inventarisieren, hashen, lokal über Wrangler testen und Dry-Run-Bundle prüfen.
9. Gebautes Artefakt und lokale HTTP-Matrix unabhängig auditieren und Findings beheben.
10. Betreiber-/Hostingangaben, Cloudflare-Vertrag/Plan/Dashboard und App-Produktionsaudit abschließen.
11. DNS verlustfrei von Squarespace zu Cloudflare migrieren, HTTPS/`www`-Weiterleitung konfigurieren und erst danach `npm run deploy` ausführen.
12. Live-Abnahme durchführen, geprüfte Änderungen committen und zu GitHub pushen.
