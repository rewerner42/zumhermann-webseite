# Deployment – vorbereitet, derzeit gesperrt

Diese Anleitung beschreibt ein späteres statisches Hosting bei Cloudflare Pages. Sie enthält keine Zugangsdaten. **Die Website darf aktuell nicht öffentlich bereitgestellt werden.**

## Zwingende Vorbedingungen

Vor jeder Verbindung zu einem öffentlichen Hostingdienst müssen alle Punkte erfüllt sein:

- echte HTTPS-Domain in `src/config/site.ts`;
- vollständige Anschrift, E-Mail und weitere schnelle Kontaktmöglichkeit;
- tatsächlicher Hostinganbieter, Logdaten, Löschkriterien, Empfänger, Verarbeitungsorte und mögliche Drittlandübermittlungen;
- abgeschlossene VSBG-Prüfung;
- finaler App-/Produktionsbinary-Datenschutzaudit;
- rechtliche Freigabe der Texte;
- ausdrückliche Veröffentlichungsfreigabe von Werner Francis Reineke;
- `npm run legal:check` und `npm run release:build` erfolgreich.

Cloudflare-Pages-Preview-URLs sind ebenfalls öffentlich erreichbar. Das private GitHub-Repository daher erst nach Erfüllung des Gates mit Pages verbinden.

## Lokale Releaseprüfung

```sh
npm ci
npm run release:build
```

Das Ergebnis liegt in `dist/`. `release:build` führt vor dem eigentlichen `npm run build` die Pflichtangaben- und Qualitätschecks aus. Ein direkter `npm run build` ist für lokale Entwicklung erlaubt, aber kein Veröffentlichungsnachweis.

## Vorgesehene Cloudflare-Pages-Einstellungen

| Einstellung | Wert |
| --- | --- |
| Repository | privates Repository `zumhermann-web` |
| Produktionsbranch | `main` |
| Framework-Preset | Astro oder None |
| Produktions-Buildbefehl | `npm run release:build` |
| eigentlicher statischer Build | `npm run build` |
| Ausgabeordner | `dist` |
| Root-Verzeichnis | `/` |
| Node.js | 24 LTS; mindestens 22.12.0 |

Falls die Oberfläche nur einen einfachen Buildbefehl zulässt, niemals das Gate weglassen. In diesem Fall `npm run legal:check && npm run check && npm run build` verwenden.

## Einrichtung nach Freigabe

1. Im Cloudflare-Dashboard ein neues Pages-Projekt aus dem privaten GitHub-Repository anlegen.
2. Den Zugriff auf genau dieses Repository beschränken.
3. Einstellungen aus der Tabelle übernehmen.
4. Keine geheimen Werte als Buildvariablen anlegen; die Website benötigt aktuell keine Laufzeit- oder Build-Secrets.
5. Automatische Preview-Deployments nur bewusst aktivieren. Jede Preview muss denselben Rechtscheck bestehen.
6. Nach erfolgreichem Gate einen ersten Deployment-Build auslösen.
7. Die echte Domain als Custom Domain verbinden und HTTPS erzwingen.
8. DNS erst dann final umstellen, wenn alle Abnahmepunkte bestanden sind.

## Sicherheitsheader

`public/_headers` wird in `dist/_headers` kopiert und bereitet insbesondere vor:

- strikte Content Security Policy ohne externe Skripte oder Verbindungen;
- Schutz vor Einbettung in Frames;
- restriktive Permissions Policy;
- `no-referrer`;
- MIME-Sniffing-Schutz;
- langfristiges Caching der versionierten Build-Assets und kontrolliertes Caching der Markenbilder.

Nach dem ersten echten Deployment mit den Browser-Entwicklerwerkzeugen oder einem Header-Check bestätigen, dass Cloudflare diese Header ausliefert. Zusätzliche Cloudflare-Funktionen wie Web Analytics, Zaraz, Bot-Schutz, Turnstile oder Drittanbieter-Performance-Skripte bleiben deaktiviert, solange ihre Datenschutzfolgen nicht geprüft und dokumentiert wurden.

## Abnahme nach Deployment

- `/`, `/impressum`, `/datenschutz`, `/support` und eine unbekannte URL aufrufen;
- HTTPS, Weiterleitung auf eine einzige Hostvariante und Zertifikat prüfen;
- Canonical URLs, Open-Graph-Bild und strukturierte Daten mit echter Domain prüfen;
- `robots.txt` muss Crawling erlauben und die echte Sitemap nennen;
- `sitemap.xml` darf keine Platzhalter enthalten;
- alle Store-Elemente müssen entweder echte Ziele oder nicht klickbare „Demnächst erhältlich“-Hinweise sein;
- Sicherheitsheader kontrollieren;
- Desktop, Tablet und Smartphone erneut visuell prüfen;
- bestätigen, dass keine Cookies, externen Ressourcen oder Browser-Speicherzugriffe hinzugekommen sind;
- Datenschutzerklärung gegen die reale Cloudflare-Konfiguration nachprüfen.

## Rollback

Bei einer fehlerhaften Veröffentlichung im Cloudflare-Dashboard auf das letzte geprüfte Deployment zurückrollen oder die Domainverbindung entfernen. Pflichtangaben niemals durch ein Rollback auf einen Stand mit Platzhaltern ersetzen. Änderungen zuerst lokal und in der Release-Pipeline prüfen.
