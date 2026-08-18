# Offene Rechts- und Pflichtangaben

Stand: 18. August 2026
Status: **Veröffentlichung gesperrt**

Die Website ist technisch und redaktionell als Entwurf vorbereitet. Dieses Dokument ist keine individuelle Rechtsberatung. Tatsachen, Vertragssituation und endgültige Texte müssen vor dem öffentlichen Betrieb geprüft werden.

## 1. Betreiber- und Kontaktangaben

In `src/config/site.ts` fehlen:

- `[[STRASSE_HAUSNUMMER]]`
- `[[PLZ_ORT]]`
- `[[E_MAIL]]`
- `[[WEITERE_KONTAKTMÖGLICHKEIT]]`

Zu erledigen:

- ladungsfähige Anschrift von Werner Francis Reineke eintragen;
- veröffentlichungsfähige Support-/Kontakt-E-Mail festlegen;
- einen tatsächlich erreichbaren Weg für schnelle, unmittelbare und effiziente Kommunikation festlegen. Eine Telefonnummer ist nicht zwingend, aber eine bloß angekündigte oder technisch nicht vorhandene Kontaktmöglichkeit genügt nicht;
- prüfen, ob eine Umsatzsteuer-Identifikationsnummer oder Wirtschafts-Identifikationsnummer besteht und nach der konkreten Anwendbarkeit von § 5 DDG veröffentlicht werden muss;
- keine persönliche Steuernummer anfordern oder veröffentlichen;
- keine Rechtsform, Registerdaten, Aufsichts- oder Berufsangaben ergänzen, solange sie nicht tatsächlich einschlägig sind;
- ausschließlich Werner Francis Reineke als persönlichen Betreiber nennen und keine Unternehmensbezeichnung verwenden.

Amtliche Grundlagen:

- [§ 5 DDG – Allgemeine Informationspflichten](https://www.gesetze-im-internet.de/ddg/__5.html)
- [§ 18 MStV – Informationspflichten und Verantwortlicher](https://www.gesetze-bayern.de/Content/Document/MStV-18)
- [EuGH, C-298/07 – schneller und unmittelbarer Kommunikationsweg](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A62007CJ0298)

§ 18 Abs. 2 MStV ist im Entwurf bewusst nicht genannt, weil die Website derzeit keine journalistisch-redaktionellen Inhalte vorsieht. Bei einem späteren Blog-, News- oder redaktionellen Regionalbereich neu prüfen.

## 2. Domain, Hosting und Website-Datenschutz

In `src/config/site.ts` fehlen:

- `[[HOSTINGANBIETER]]`
- `[[HOSTING_LOESCHKRITERIEN]]`
- `[[HOSTING_EMPFÄNGER_UND_UNTERAUFTRAGNEHMER]]`
- `[[HOSTING_VERARBEITUNGSORTE_UND_DRITTLANDTRANSFERS]]`
- `[[DATENSCHUTZAUFSICHTSBEHÖRDE]]`

Die Produktionsdomain ist inzwischen als `https://zumhermann.de` bestätigt. Als technisches Produkt
ist Cloudflare Workers Static Assets ausgewählt; die konkrete Vertragspartei, der Zonenplan und die
tatsächlichen Dashboardfunktionen sind damit noch nicht belegt.

Nach Auswahl des tatsächlichen Hosters anhand des gebuchten Tarifs und der realen Konfiguration prüfen:

- welche Zugriffs- und Sicherheitsprotokolle tatsächlich anfallen;
- tatsächliche Speicherdauer oder nachvollziehbare Löschkriterien;
- Rolle des Hosters, Empfänger und Unterauftragnehmer;
- Verarbeitungsorte und mögliche Drittlandübermittlungen samt anwendbaren Garantien;
- Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO;
- ob optionale Sicherheits-, Bot- oder Performancefunktionen Cookies oder andere Endgerätespeicherungen einsetzen;
- ob Sicherheitsheader aus `public/_headers` vollständig übernommen werden;
- zuständige Landesdatenschutzaufsichtsbehörde anhand der echten Betreiberanschrift benennen.

Für die geplante Cloudflare-Konfiguration zusätzlich dokumentieren:

- Self-Serve-Vertrag und einbezogenen Cloudflare-DPA/AVV samt tatsächlich verantwortlicher
  Vertragspartei;
- Zonenplan und planabhängige Aufbewahrung in Security Analytics;
- Trennung zwischen Customer Logs/Verarbeitung im Auftrag und Cloudflares eigener operativer Network
  Data;
- Status von Workers Observability, Logpush, Web Analytics, Zaraz, WAF, Bot Management, Challenges,
  Rate Limiting, Rocket Loader, Apps und Data Localization;
- tatsächlich gesetzte Cookies beziehungsweise das belegte Ausbleiben von `Set-Cookie` auf Apex,
  `www` und allen erreichbaren Worker-Endpunkten;
- aktuelle Cloudflare-Unterauftragnehmer und Transfergarantien. Ohne belegte Enterprise-
  Lokalisierungsprodukte nicht behaupten, die Verarbeitung finde ausschließlich in der EU statt.

Erst danach `hosting.privacyDetailsComplete` auf `true` setzen.

Amtliche Grundlagen:

- [DSGVO, insbesondere Art. 5, 6, 13, 15–21, 28 und 77](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=de)
- [§ 25 TDDDG – Schutz der Privatsphäre bei Endeinrichtungen](https://www.gesetze-im-internet.de/ttdsg/__25.html)
- [§ 40 BDSG – Aufsichtsbehörden der Länder](https://www.gesetze-im-internet.de/bdsg_2018/__40.html)
- [EuGH, C-582/14 – dynamische IP-Adressen](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A62014CJ0582)
- [Cloudflare Customer DPA](https://www.cloudflare.com/cloudflare-customer-dpa/)
- [Cloudflare-Unterauftragnehmer](https://www.cloudflare.com/gdpr/subprocessors/cloudflare-services/)
- [Cloudflare Security Analytics](https://developers.cloudflare.com/waf/analytics/security-analytics/)
- [Cloudflare-Cookies](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/)

## 3. Verbraucherstreitbeilegung

Offener Platzhalter:

- `[[VSBG_ANGABE_NACH_PRÜFUNG]]`

Vor Veröffentlichung feststellen und dokumentieren:

1. Handelt Werner Francis Reineke bei Angebot und Vertrieb der App als Unternehmer im Sinne des § 14 BGB?
2. Wie viele Personen waren am 31. Dezember des Vorjahres beschäftigt? Für eine Veröffentlichung im Jahr 2026 ist grundsätzlich der 31. Dezember 2025 maßgeblich.
3. Besteht eine gesetzliche, satzungsmäßige oder vertragliche Teilnahmeverpflichtung?
4. Enthalten AGB oder andere Erklärungen eine Teilnahmezusage?
5. Soll freiwillig an Verbraucherschlichtung teilgenommen werden? Keine Bereitschaft ohne bewusste Entscheidung erklären, weil daraus Verfahrens- und Kostenfolgen entstehen können.
6. Falls eine Pflicht oder Bindung besteht: Welche konkrete Verbraucherschlichtungsstelle ist zuständig und wie lauten Anschrift und Website?

Entscheidungslogik:

- Bei höchstens zehn Beschäftigten am maßgeblichen Stichtag und ohne Teilnahmebindung ist die Information nach § 36 Abs. 1 Nr. 1 VSBG grundsätzlich ausgenommen; ein nicht erforderlicher Abschnitt sollte dann entfallen.
- Eine gesetzliche oder vertragliche Pflicht nach § 36 Abs. 1 Nr. 2 kann unabhängig von dieser Beschäftigtenausnahme bestehen.
- Bei mehr als zehn Beschäftigten muss klar erklärt werden, inwieweit Bereitschaft oder Pflicht besteht.
- § 37 VSBG verlangt nach einem erfolglosen konkreten Verbrauchervertragsstreit zusätzlich einen Hinweis in Textform; dies später in den Supportprozess aufnehmen.

Amtliche Grundlagen:

- [§ 36 VSBG](https://www.gesetze-im-internet.de/vsbg/__36.html)
- [§ 37 VSBG](https://www.gesetze-im-internet.de/vsbg/__37.html)
- [§ 30 Abs. 6 VSBG](https://www.gesetze-im-internet.de/vsbg/__30.html)
- [§ 14 BGB – Unternehmer](https://www.gesetze-im-internet.de/bgb/__14.html)

## 4. EU-Online-Streitbeilegungsplattform

Keinen alten Link und keinen Standardtext zur früheren EU-OS-/ODR-Plattform ergänzen. Beschwerden konnten nur bis 20. März 2025 eingereicht werden; die zugrunde liegende Verordnung wurde zum 20. Juli 2025 aufgehoben.

- [Verordnung (EU) 2024/3228 zur Aufhebung der ODR-Verordnung](https://eur-lex.europa.eu/eli/reg/2024/3228/oj?locale=de)

Die neue [Richtlinie (EU) 2025/2647](https://eur-lex.europa.eu/eli/dir/2025/2647/oj?locale=de) ist für eine spätere Umsetzung relevant; ihre nationalen Regeln sind vor einem Release ab 2028 erneut zu prüfen.

## 5. App-Datenschutz vor finaler Freigabe

Der aktuelle Code-Audit stützt die Websiteaussagen: lokale Entfernung/Peilung, keine Übertragung von Standort und Heading an Werner Francis Reineke oder ein eigenes Backend, nur lokaler Onboardingstatus, systemeigenes Teilen und keine exakte Nutzerposition in der Share-Grafik.

Vor der finalen Rechtsfreigabe trotzdem anhand des Produktionsbinarys prüfen:

- Netzwerkverhalten auf iOS und Android, getrennt von Entwicklungswerkzeugen;
- endgültige direkte und transitive SDKs;
- Produktionsmanifeste und tatsächlich enthaltene Berechtigungen;
- `expo-dev-client` nicht versehentlich im Produktionsverhalten aktiv;
- Android-Backupverhalten des lokalen Onboardingstatus;
- Plattformdiagnosen und Store-Datenschutzangaben;
- Lebenszyklus der Standort-/Heading-Subscriptions bei Navigation zwischen Kompass, Erfolg, Share und Info;
- Metadaten und Lebensdauer der temporären Share-PNG;
- Store-Fragebögen und Datenschutzlabel gegen das reale Release-Binary.

Die Datenschutzerklärung sagt deshalb bewusst nicht pauschal, dass keinerlei Plattformverarbeitung oder Netzwerkverbindung stattfinden könne.

## 6. Store- und Freigabeangaben

Offene Platzhalter:

- `[[APPLE_APP_STORE_URL]]`
- `[[GOOGLE_PLAY_URL]]`

Solange es keine echten URLs gibt, bleiben die Store-Hinweise nicht klickbar. Vor einem öffentlichen Release müssen die Platzhalter entweder durch echte HTTPS-URLs oder – nach dokumentierter Entscheidung – durch leere Werte ersetzt werden.

Zusätzlich erforderlich:

- Markenrecherche für `zumHermann` vor Store-Veröffentlichung;
- finale Store-Datenschutzangaben;
- finaler Produktionsbinary-/Netzwerkaudit der App, danach erst
  `release.appProductionAuditComplete = true`;
- individuelle rechtliche Freigabe von Impressum und Datenschutzerklärung, danach `legal.textsApproved = true`;
- ausdrückliche öffentliche Veröffentlichungsfreigabe von Werner Francis Reineke, danach `release.publicReleaseApproved = true`;
- erfolgreicher Lauf von `npm run legal:check` und `npm run release:build`.

## 7. Aktueller Gate-Status

`npm run legal:check` muss mit dem derzeitigen Stand fehlschlagen. Ein grüner lokaler Build, ein
GitHub-Repository, ein erfolgreicher Wrangler-Dry-Run oder `noindex` hebt diese
Veröffentlichungssperre nicht auf.
