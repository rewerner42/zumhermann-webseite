# zumHermann Website

Statische Produkt- und Supportwebsite für die App **zumHermann**. Betreiber ist persönlich **Werner Francis Reineke-Ryskiewicz**. Das Projekt verwendet keine Unternehmensbezeichnung.

> **Veröffentlichung gesperrt:** Betreiber, Kontakt, rechtliche Texte und die allgemeinen Cloudflare-Datenschutzangaben sind vorbereitet. Offen sind die persönliche Cloudflare-Kundenidentität, Mail-DNS, Dashboardprüfung und VSBG-Entscheidung; `npm run legal:check` muss bis zu deren Klärung fehlschlagen.

## Stack

- Astro 7 mit TypeScript im strikten Modus
- statisches HTML und wartbares CSS mit Custom Properties
- kein clientseitiges Framework und kein eigenes Anwendungs-JavaScript
- kein Backend, keine Datenbank und kein Benutzerkonto
- keine extern geladenen Schriften, Medien oder Einbettungen
- keine Cookies, kein Tracking, keine Werbung und kein Browserspeicher

Die gebaute Website liegt in `dist/` und ist als Cloudflare Worker mit Static Assets vorbereitet. Es gibt keinen Worker-Laufzeitcode; Cloudflare liefert ausschließlich die statischen Dateien aus.

## Voraussetzungen

- Node.js 24 LTS (mindestens 22.12.0)
- npm 10 oder neuer
- Wrangler 4.123.0 als fest gepinnte Entwicklungsabhängigkeit

Die vorgesehene Node-Version steht in `.nvmrc`.

## Lokal starten

```sh
npm ci
npm run dev
```

Astro zeigt anschließend die lokale Adresse an. Platzhalter sind lokal erlaubt und werden auf den Rechtsseiten deutlich als Entwurf gekennzeichnet.

## Prüfungen und Build

```sh
npm run check
npm run build
npm run worker:audit
npm run worker:smoke
npm run worker:dry-run
```

`npm run check` prüft Astro, TypeScript, Pflichtseiten, interne Links, Bild-Alternativtexte und die Cloudflare-Konfiguration. `npm run build` erzeugt `dist/`; danach kontrolliert der Post-Build-Check Links, JSON-LD, ausführbare Skripte, Sprungziele, Bilder und Pflichtdateien. Die Worker-Prüfungen inventarisieren und hashen das Artefakt, testen die lokale Cloudflare-Auslieferung und validieren Wranglers Paketierung ohne Upload.

Die Veröffentlichungssperre wird separat geprüft:

```sh
npm run legal:check
```

Dieser Befehl ist momentan **absichtlich rot**. Für einen späteren Release führt `npm run release:build` zuerst das Rechts-/Pflichtangabengate und danach sämtliche Qualitäts-, Build-, Artefakt-, Smoke- und Dry-Run-Prüfungen aus. Nur `npm run deploy` ist als Produktionsweg vorgesehen.

## Seiten

- `/` – Produktstartseite, Funktionsweise, Funktionen, Datenschutzvertrauen, regionale Erzählung, Disclaimer und FAQ
- `/impressum` – rechtlicher Entwurf der Anbieterkennzeichnung
- `/datenschutz` – getrennte Datenschutzhinweise für Website und mobile App
- `/support` – Kontakt, Standort-, Kompass-, Teilen- und Löschhilfe
- `/404.html` – benutzerfreundliche Fehlerseite
- `/robots.txt` – erlaubt das Lesen der `noindex`-Hinweise; erst nach öffentlicher Freigabe verweist es auf die Sitemap
- `/sitemap.xml` – bleibt bis zur öffentlichen Freigabe leer; danach nutzt sie die zentrale Basis-URL

## Inhalte ändern

Globale Betreiber-, Kontakt-, Domain-, Hosting-, Store- und Freigabeangaben liegen ausschließlich in:

```text
src/config/site.ts
```

Vor einer Veröffentlichung:

1. Alle tatsächlichen Angaben in dieser Datei eintragen. Nichts schätzen oder erfinden.
2. Nicht verfügbare Store-Links nach dokumentierter Entscheidung als leere Zeichenfolge führen; die Oberfläche zeigt dann weiterhin „Demnächst erhältlich“.
3. Verbraucherstreitbeilegung anhand der tatsächlichen Verhältnisse entscheiden. Ist kein Hinweis erforderlich, bleibt der konfigurierte Text leer und der Abschnitt wird nicht ausgegeben.
4. Persönliche Cloudflare-Kundenidentität und Dashboardzustand bestätigen; erst dann `privacyDetailsComplete` auf `true` setzen.
5. `identityApproved`, `textsApproved` und `externalReviewApproved` sind bestätigt. `appProductionAuditComplete` bleibt eine getrennte App-Prüfung; `publicReleaseApproved` steuert die spätere Indexierung und öffentliche Marketingfreigabe.
6. `npm run legal:check` und `npm run release:build` erfolgreich ausführen.

Die offenen Entscheidungen und amtlichen Rechtsquellen sind in [LEGAL_TODO.md](LEGAL_TODO.md) dokumentiert.

## Markenassets

Verbindliche Quelle der Wahrheit ist die unveränderte Datei:

```text
../design-reference/ueberm-teuto.png
```

Eine byte-identische Archivkopie liegt als `public/assets/brand-source.png` im Websiteprojekt. Hero, Szene, Social Preview und Icons sind ausschließlich unveränderte Kopien oder direkte Zuschneide-/Skalierableitungen aus dieser freigegebenen Quelle. Es gibt kein neu gezeichnetes oder generiertes Ersatzlogo.

## Metadaten und SEO

- `lang="de"`, semantische Überschriften und sichtbare Fokuszustände
- Open-Graph- und Twitter-Metadaten
- strukturierte Daten als `SoftwareApplication`, ohne Bewertung oder Preisbehauptung
- Canonical URL und absolute Social-Preview-URL erst bei gültiger HTTPS-Domain
- Sitemap, robots.txt, Favicons und App-Icon-Ableitung
- Sicherheitsheader über `public/_headers`

## Git-Hinweis

Dieses Verzeichnis ist ein eigenes Repository innerhalb des App-Repository-Arbeitsverzeichnisses. Der Elternordner ignoriert `/zumhermann-web/`; Website-Commits werden trotzdem ausschließlich in diesem Repository erstellt.

## Veröffentlichung

Die vollständige, derzeit bewusst blockierte Anleitung für Cloudflare Workers Static Assets und den Cutover von der noch ausgelieferten Squarespace-Seite steht in [DEPLOYMENT.md](DEPLOYMENT.md). Eine technisch erfolgreiche lokale Website ist noch keine rechtliche Veröffentlichungsfreigabe. Die vorbereiteten Texte ersetzen keine individuelle Rechtsberatung.
