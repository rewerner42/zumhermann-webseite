# zumHermann Website

Statische Produkt- und Supportwebsite für die App **zumHermann**. Betreiber ist persönlich **Werner Francis Reineke**. Das Projekt verwendet keine Unternehmensbezeichnung.

> **Veröffentlichung gesperrt:** Pflichtangaben, echte Domain und Hostingdetails fehlen. Der lokale Entwicklungsstand funktioniert bewusst mit sichtbaren Platzhaltern; `npm run legal:check` muss bis zu deren Klärung fehlschlagen.

## Stack

- Astro 7 mit TypeScript im strikten Modus
- statisches HTML und wartbares CSS mit Custom Properties
- kein clientseitiges Framework und kein eigenes Anwendungs-JavaScript
- kein Backend, keine Datenbank und kein Benutzerkonto
- keine extern geladenen Schriften, Medien oder Einbettungen
- keine Cookies, kein Tracking, keine Werbung und kein Browserspeicher

Die gebaute Website liegt in `dist/` und eignet sich für Cloudflare Pages oder einen vergleichbaren statischen Host.

## Voraussetzungen

- Node.js 24 LTS (mindestens 22.12.0)
- npm 10 oder neuer

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
```

`npm run check` prüft Astro, TypeScript, Pflichtseiten, interne Links und Bild-Alternativtexte. `npm run build` erzeugt `dist/`; danach kontrolliert der automatische Post-Build-Check die ausgelieferten Links, Sprungziele, Bilder und Pflichtdateien.

Die Veröffentlichungssperre wird separat geprüft:

```sh
npm run legal:check
```

Dieser Befehl ist momentan **absichtlich rot**. Für einen späteren Release führt `npm run release:build` zuerst das Rechts-/Pflichtangabengate, dann alle Qualitätsprüfungen und zuletzt den Build aus.

## Seiten

- `/` – Produktstartseite, Funktionsweise, Funktionen, Datenschutzvertrauen, regionale Erzählung, Disclaimer und FAQ
- `/impressum` – rechtlicher Entwurf der Anbieterkennzeichnung
- `/datenschutz` – getrennte Datenschutzhinweise für Website und mobile App
- `/support` – Kontakt, Standort-, Kompass-, Teilen- und Löschhilfe
- `/404.html` – benutzerfreundliche Fehlerseite
- `/robots.txt` – blockiert Crawler, solange die Domain nicht vollständig konfiguriert ist
- `/sitemap.xml` – statische Sitemap; die echte Basis-URL wird aus der zentralen Konfiguration übernommen

## Inhalte ändern

Globale Betreiber-, Kontakt-, Domain-, Hosting-, Store- und Freigabeangaben liegen ausschließlich in:

```text
src/config/site.ts
```

Vor einer Veröffentlichung:

1. Alle tatsächlichen Angaben in dieser Datei eintragen. Nichts schätzen oder erfinden.
2. Nicht verfügbare Store-Links nach dokumentierter Entscheidung als leere Zeichenfolge führen; die Oberfläche zeigt dann weiterhin „Demnächst erhältlich“.
3. Verbraucherstreitbeilegung anhand der tatsächlichen Verhältnisse entscheiden. Ist kein Hinweis erforderlich, bleibt der konfigurierte Text leer und der Abschnitt wird nicht ausgegeben.
4. Hostingdetails anhand des wirklich gebuchten Tarifs und der realen Konfiguration ergänzen.
5. Erst nach fachlicher Prüfung `privacyDetailsComplete`, `textsApproved` und nach ausdrücklicher Freigabe `publicReleaseApproved` auf `true` setzen.
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

Dieses Verzeichnis ist als eigenes Repository innerhalb eines bereits vorhandenen, uncommittiert veränderten App-Repositorys angelegt. Niemals Website-Commits vom übergeordneten Repository aus erstellen. Insbesondere kein pauschales `git add .` im Verzeichnis darüber ausführen; dort könnte das eingebettete Repository versehentlich als Gitlink vorgemerkt werden.

## Veröffentlichung

Die vollständige, derzeit bewusst blockierte Cloudflare-Pages-Anleitung steht in [DEPLOYMENT.md](DEPLOYMENT.md). Eine technisch erfolgreiche lokale Website ist noch keine rechtliche Veröffentlichungsfreigabe. Die vorbereiteten Texte ersetzen keine individuelle Rechtsberatung.
