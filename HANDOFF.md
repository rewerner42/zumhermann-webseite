# Website-Handoff – zumHermann

Stand: 17. August 2026  
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
- Sicherheitsheader für Cloudflare Pages;
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
- Keine Übertragung von Standort oder Heading an Werner Francis Reineke oder ein eigenes Backend im geprüften App-Code.
- Kein Konto, keine Werbung, keine Betreiber-Analytics, kein Tracking, keine Remote-API und kein Drittanbieter-Crash-SDK im geprüften Stand.
- Dauerhaft gespeichert wird nur der lokale Onboardingstatus.
- Share-Grafik enthält gerundete Distanz und Richtungsgenauigkeit, aber keine exakte Position, Koordinaten, Ortsangabe oder Zeit.
- Die systemeigene Teilen-Funktion überlässt Empfänger und Ziel-App dem Nutzer.
- Apple-/Google-Plattformdienste und Standortkomponenten werden ausdrücklich getrennt von der fehlenden Betreiberübertragung beschrieben.

Offen bleibt vor dem App-Release der Audit des finalen Produktionsbinarys, einschließlich Netzwerkverhalten, Manifeste, Backup, `expo-dev-client`, Subscription-Lebenszyklus und temporärer Share-Datei.

## Testergebnisse

Erfolgreich:

- Astro-/TypeScript-Prüfung: 22 Dateien, 0 Fehler, 0 Warnungen, 0 Hinweise;
- Inhaltsprüfung: Pflichtseiten, interne Links, Sprungziele und Bild-Alternativtexte;
- statischer Astro-Build: 5 HTML-Seiten plus robots.txt und Sitemap;
- Post-Build-Prüfung: interne Links, Assets, Alternativtexte und Pflichtdateien;
- Browserprüfung ohne Warnungen oder Fehler;
- responsive Sichtprüfung bei 390 × 844, 768 × 1024 und 1440 × 1000 Pixeln;
- FAQ-Interaktion und sichtbarer Tastaturfokus;
- keine horizontale Überbreite auf den geprüften Mobilseiten;
- kein extern geladenes Bild, Stylesheet oder Skript in der Browserprüfung;
- freundliche 404-Ausgabe;
- exakte Asset-Hashes und Bilddimensionen geprüft.

Erwartet fehlgeschlagen:

- `npm run legal:check`, weil echte Pflichtangaben und Freigaben fehlen. Dies ist die beabsichtigte Veröffentlichungssperre.

## Offene Pflichtangaben

Exakt offen sind:

- Straße und Hausnummer;
- Postleitzahl und Ort;
- Support-/Kontakt-E-Mail;
- weitere schnelle und unmittelbare Kontaktmöglichkeit;
- echte Domain;
- tatsächlicher Hostinganbieter;
- Hosting-Logumfang und Löschkriterien;
- Hostingempfänger und Unterauftragnehmer;
- Hosting-Verarbeitungsorte und mögliche Drittlandtransfers;
- gegebenenfalls Umsatzsteuer-Identifikationsnummer oder Wirtschafts-Identifikationsnummer, sofern vorhanden und rechtlich zu veröffentlichen;
- VSBG-Entscheidung anhand Unternehmerstatus, Beschäftigtenzahl, Bindung und Bereitschaft;
- Apple-App-Store-URL;
- Google-Play-URL;
- finale Produktionsbinary-/Netzwerkprüfung der App;
- individuelle rechtliche Freigabe;
- ausdrückliche öffentliche Veröffentlichungsfreigabe.

Eine persönliche Steuernummer darf nicht veröffentlicht oder angefordert werden.

## Schritte zur Veröffentlichung

1. Alle Tatsachen und Entscheidungen aus `LEGAL_TODO.md` klären.
2. Zentrale Werte in `src/config/site.ts` eintragen; keine Inhalte in einzelnen Seiten duplizieren.
3. Finales App-Binary und Plattformmanifeste prüfen, Store-Datenschutzangaben abgleichen.
4. Impressum und Datenschutzerklärung individuell rechtlich prüfen lassen.
5. Freigabe-Flags erst nach tatsächlicher Prüfung und ausdrücklicher Veröffentlichungserlaubnis setzen.
6. `npm ci`, `npm run legal:check` und `npm run release:build` erfolgreich ausführen.
7. Erst dann die Cloudflare-Pages-Anleitung aus `DEPLOYMENT.md` ausführen.
8. Öffentliches Ergebnis erneut technisch, visuell und datenschutzseitig abnehmen.

## Git und privates GitHub-Repository

Das Websiteverzeichnis ist als eigenes Git-Repository auf Branch `main` initialisiert und in getrennten Commits für Architektur, Website sowie Qualität/Dokumentation versioniert. Es wurde kein Remote gesetzt.

`gh auth status` meldet für den aktiven Account `rewerner42` ein ungültiges Anmeldetoken. Deshalb wurde weder ein möglicherweise vorhandenes Repository geprüft noch ein neues Repository erstellt oder überschrieben. Es wurden keine Passwörter oder Tokens angefordert.

Einziger verbleibender Cloud-Schritt nach Wiederanmeldung:

```sh
gh auth login -h github.com
gh auth status
gh repo view rewerner42/zumhermann-web
```

Falls der letzte Befehl bestätigt, dass kein gleichnamiges Repository existiert:

```sh
gh repo create zumhermann-web --private --source=. --remote=origin --push
```

Die Sichtbarkeit muss privat bleiben. Das GitHub-Repository darf erstellt und befüllt werden; ein Hostingprojekt darf trotz privatem Repository erst nach bestandenem Veröffentlichungsgate verbunden werden.

## Spätere Pflege

- Store-Links ausschließlich zentral in `src/config/site.ts` pflegen.
- Bei Änderung von Hoster, Tarif, Sicherheitsdiensten, Store-SDKs oder App-Datenflüssen die Datenschutzerklärung vorab aktualisieren.
- Bei journalistisch-redaktionellen Inhalten § 18 Abs. 2 MStV neu prüfen.
- Bei veränderter Beschäftigtenzahl, AGB oder Schlichtungsbindung VSBG-Angabe neu prüfen.
- EU-Streitbeilegungsrecht spätestens vor einem Release ab 2028 erneut prüfen.
- Abhängigkeiten und GitHub Actions regelmäßig aktualisieren und `npm run check` sowie `npm run build` wiederholen.

## Rechtlicher Hinweis

Die Texte wurden sorgfältig anhand des tatsächlichen App-Codes und aktueller amtlicher Primärquellen technisch vorbereitet. Sie ersetzen keine individuelle Rechtsberatung.
