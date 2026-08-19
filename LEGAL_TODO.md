# Offene Rechts- und Pflichtangaben

Stand: 19. August 2026
Status: **Veröffentlichung gesperrt**

Die Website ist technisch und redaktionell als Entwurf vorbereitet. Dieses Dokument ist keine individuelle Rechtsberatung. Tatsachen, Vertragssituation und endgültige Texte müssen vor dem öffentlichen Betrieb geprüft werden.

## 1. Betreiber- und Kontaktangaben

In `src/config/site.ts` bestätigt und eingetragen:

- Werner Francis Reineke-Ryskiewicz;
- Geseker Str. 26, 33154 Salzkotten;
- `tach@zumhermann.de`;
- Telefon 05258 987282.

Noch zu erledigen:

- Proton-Mail-DNS reparieren beziehungsweise verifizieren: Der autoritative DNS-Audit fand trotz
  Proton-Verifizierungs-TXT keinen MX-Eintrag und `v=spf1 -all`; danach E-Mail aus einem unabhängigen
  externen Postfach erneut testen;
- prüfen, ob eine Umsatzsteuer-Identifikationsnummer oder Wirtschafts-Identifikationsnummer besteht und nach der konkreten Anwendbarkeit von § 5 DDG veröffentlicht werden muss;
- keine persönliche Steuernummer anfordern oder veröffentlichen;
- keine Rechtsform, Registerdaten, Aufsichts- oder Berufsangaben ergänzen, solange sie nicht tatsächlich einschlägig sind;
- ausschließlich den bestätigten persönlichen Betreiber nennen und keine Unternehmensbezeichnung verwenden.

Amtliche Grundlagen:

- [§ 5 DDG – Allgemeine Informationspflichten](https://www.gesetze-im-internet.de/ddg/__5.html)
- [§ 18 MStV – Informationspflichten und Verantwortlicher](https://www.gesetze-bayern.de/Content/Document/MStV-18)
- [EuGH, C-298/07 – schneller und unmittelbarer Kommunikationsweg](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A62007CJ0298)

§ 18 Abs. 2 MStV ist im Entwurf bewusst nicht genannt, weil die Website derzeit keine journalistisch-redaktionellen Inhalte vorsieht. Bei einem späteren Blog-, News- oder redaktionellen Regionalbereich neu prüfen.

## 2. Domain, Hosting und Website-Datenschutz

In `src/config/site.ts` sind anhand der aktuellen offiziellen Cloudflare-Unterlagen vorbereitet:

- Cloudflare, Inc. und Cloudflare Workers Static Assets als Anbieter;
- Löschkriterien nach dem Cloudflare-DPA bei deaktivierten eigenen Workers Logs;
- Empfänger-/Unterauftragnehmer- und globale Verarbeitungs-/Transferbeschreibung;
- LDI NRW als zuständige Datenschutzaufsichtsbehörde.

Die Produktionsdomain ist als `https://zumhermann.de` bestätigt und bereits zu Cloudflare delegiert.
Offen bleibt die Kundenidentität: Wrangler ist derzeit bei einem Cloudflare-Account mit der
Bezeichnung Reineke Technik GmbH angemeldet. Vor dem persönlichen Release muss der Account auf Werner
persönlich umgestellt oder ein persönlicher Account gewählt und dessen Account-ID fest gepinnt werden.

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

Erst nach Klärung der persönlichen Kundenidentität, des Self-Serve-Vertrags und des Dashboardzustands
`hosting.privacyDetailsComplete` auf `true` setzen.

Amtliche Grundlagen:

- [DSGVO, insbesondere Art. 5, 6, 13, 15–21, 28 und 77](https://eur-lex.europa.eu/eli/reg/2016/679/oj?locale=de)
- [§ 25 TDDDG – Schutz der Privatsphäre bei Endeinrichtungen](https://www.gesetze-im-internet.de/ttdsg/__25.html)
- [§ 40 BDSG – Aufsichtsbehörden der Länder](https://www.gesetze-im-internet.de/bdsg_2018/__40.html)
- [EuGH, C-582/14 – dynamische IP-Adressen](https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX%3A62014CJ0582)
- [Cloudflare Customer DPA](https://www.cloudflare.com/cloudflare-customer-dpa/)
- [Cloudflare Self-Serve-Vertrag](https://www.cloudflare.com/de-de/terms/)
- [Cloudflare-Unterauftragnehmer](https://www.cloudflare.com/gdpr/subprocessors/cloudflare-services/)
- [Cloudflare-Datenschutzerklärung](https://www.cloudflare.com/privacypolicy/)
- [Cloudflare-GDPR-/Transferinformationen](https://www.cloudflare.com/trust-hub/gdpr/)
- [Cloudflare Security Analytics](https://developers.cloudflare.com/waf/analytics/security-analytics/)
- [Cloudflare-Cookies](https://developers.cloudflare.com/fundamentals/reference/policies-compliances/cloudflare-cookies/)
- [LDI NRW – Kontakt](https://www.ldi.nrw.de/kontakt)

## 3. Verbraucherstreitbeilegung

Offener Platzhalter:

- `[[VSBG_ANGABE_NACH_PRÜFUNG]]`

Vor Veröffentlichung feststellen und dokumentieren:

1. Handelt der persönliche Betreiber bei Angebot und Vertrieb der App als Unternehmer im Sinne des § 14 BGB?
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

Der aktuelle Code-Audit stützt die Websiteaussagen: lokale Entfernung/Peilung, keine Übertragung von Standort und Heading an den konfigurierten persönlichen Betreiber oder ein eigenes Backend, nur lokaler Onboardingstatus, systemeigenes Teilen und keine exakte Nutzerposition in der Share-Grafik.

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

Die Store-URLs sind bis zur tatsächlichen Veröffentlichung bewusst leer. Die Oberfläche zeigt deshalb nicht klickbare Hinweise `Demnächst erhältlich`. Später dürfen ausschließlich die echten HTTPS-URLs eingetragen werden.

Für die rechtlich vollständige, noch nicht indexierte Website erforderlich:

- bestätigte exakte Betreiberidentität (`owner.identityApproved = true`);
- Werner hat Impressum und Datenschutzerklärung als Betreiber freigegeben (`legal.textsApproved = true`);
- Werner hat die spätere externe Website-Bereitstellung freigegeben (`release.externalReviewApproved = true`);
- erfolgreicher Lauf von `npm run legal:check` und `npm run release:build`.

Erst für den öffentlichen App-Launch zusätzlich erforderlich:

- Markenrecherche für `zumHermann` vor Store-Veröffentlichung;
- finale Store-Datenschutzangaben;
- finaler Produktionsbinary-/Netzwerkaudit der App, danach `release.appProductionAuditComplete = true`;
- nach finaler App-Prüfung und separater Marketingfreigabe `release.publicReleaseApproved = true`.

## 7. Aktueller Gate-Status

`npm run legal:check` muss mit dem derzeitigen Stand fehlschlagen. Ein grüner lokaler Build, ein
GitHub-Repository, ein erfolgreicher Wrangler-Dry-Run oder `noindex` hebt diese
Veröffentlichungssperre nicht auf.
