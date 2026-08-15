# Teststrategie — Toolshop (Practice Software Testing) Automatiseringsproject

**Status:** Eerste opzet — te valideren en aan te scherpen na volledige verkenning van de API/UI.

## 1. Doel en scope

Dit document beschrijft de teststrategie voor een geautomatiseerde testsuite tegen de Toolshop-applicatie (Angular UI + Laravel REST API), lokaal gedraaid via Docker. Het doel is niet alleen functionele correctheid aan te tonen, maar een risk-based, requirements-based teststrategie te demonstreren zoals die in een enterprise/Agile-testomgeving zou worden toegepast.

**In scope:**
- Kernflows: authenticatie, productcatalogus/zoeken, winkelmandje, checkout, orderhistorie, facturatie
- Integratie tussen UI en API
- Achtergrondprocessen die business-kritieke output genereren (bijv. factuurgeneratie)

**Out of scope (voor dit project):**
- Performance-/load-testing
- Volledige security-penetratietests (wel: basis input-validatie/auth-checks)
- Admin-functionaliteit, tenzij relevant voor een specifiek risicoscenario

## 2. Risicoanalyse

**Gevalideerd tegen de daadwerkelijke API-specificatie (resource-groepen: Brand, Cart, Category, Contact/Messages, Favorite, Image, Invoice, Payment, Postcode-lookup, Product).**

| Flow / Component                                                           | Business-impact bij falen                                                                               | Waarschijnlijkheid van falen                    | Risiconiveau | Testlevel(s)                    |
|----------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|-------------------------------------------------|--------------|---------------------------------|
| Authenticatie (login/registratie)                                          | Hoog — geen toegang = geen omzet                                                                        | Midden                                          | **Hoog**     | Unit, E2E                       |
| Checkout / order plaatsen                                                  | Hoog — direct omzetverlies                                                                              | Midden                                          | **Hoog**     | Integratie, E2E                 |
| Betaling (`/payment/check`)                                                | Hoog — financiële transactiecorrectheid                                                                 | Midden                                          | **Hoog**     | Integratie, API                 |
| Postcode-lookup (adresvalidatie)                                           | Hoog — expliciet afhankelijk van externe/gesimuleerde service, met officieel gedocumenteerd 502-faalpad | Hoog                                            | **Hoog**     | Integratie, API (contractfalen) |
| Factuurgeneratie (achtergrondproces + PDF-generatie met statuspolling)     | Hoog — financiële correctheid + asynchroon proces (INITIATED/IN_PROGRESS/COMPLETED)                     | Hoog (afhankelijk van brondata en async timing) | **Hoog**     | Integratie, contract/API        |
| Productcatalogus / zoeken                                                  | Midden — slechte UX, geen directe blokkade                                                              | Laag                                            | **Midden**   | E2E (smoke)                     |
| Orderhistorie / accountoverzicht                                           | Midden — vertrouwen/transparantie klant                                                                 | Laag                                            | **Midden**   | E2E                             |
| Contact/Messages (incl. status-flow, bijlagen)                             | Midden — klantcommunicatie, geen directe omzetimpact                                                    | Laag                                            | **Midden**   | E2E, API                        |
| Admin-functionaliteit                                                      | Laag-Midden — interne impact                                                                            | Laag                                            | **Laag**     | Steekproefsgewijs               |

**Toelichting factuurgeneratie:** dit proces draait als achtergrondtaak (cron) en faalt zichtbaar wanneer brondata ontbreekt of inconsistent is. Daarnaast is PDF-generatie asynchroon met een apart statuspolling-endpoint, wat een extra testdimensie toevoegt (race conditions, polling-gedrag). Dit maakt het een geschikt scenario om integratie-falen te simuleren en te testen — zie sectie 5.

**Toelichting postcode-lookup:** dit endpoint is expliciet gebouwd met een configureerbare datasource (lokale faker-driver of externe HTTP-service/WireMock-stub), inclusief een gedocumenteerd 502-foutpad ("Upstream lookup failure"). Dit is het sterkste, officieel ondersteunde scenario in deze applicatie om een falende externe afhankelijkheid te testen — zie sectie 5.

## 3. Testlevels en verantwoordelijkheden

| Testlevel                                                 | Wat wordt gedekt                                                                   | Tooling                               |
|-----------------------------------------------------------|------------------------------------------------------------------------------------|---------------------------------------|
| Unit (buiten scope van dit project, ligt bij development) | Individuele functies/componenten                                                   | —                                     |
| API / Integratie                                          | Correctheid van endpoints, contractvalidatie, gedrag bij falende afhankelijkheden  | Playwright (API-context)              |
| End-to-end (E2E)                                          | Kritieke user journeys via de UI | Playwright + TypeScript, BDD (Cucumber/Gherkin) | —                                     |
| Regressie                                                 | Herhaalbare uitvoering van kernscenario's bij elke wijziging                       | Playwright, geautomatiseerd via CI/CD |

## 4. Aanpak: Requirements- en Risk-Based Testing

- Elke testscenario wordt herleid tot een expliciete (fictieve) business requirement (zie `requirements-to-tests.md`, Fase 2)
- Prioritering van testuitvoering en -diepgang volgt het risiconiveau uit sectie 2: hoog risico → uitgebreide dekking + negatieve/edge-case scenario's; laag risico → smoke-niveau
- Testscenario's worden geschreven in Gherkin-vorm zodat ze leesbaar en valideerbaar zijn voor niet-technische stakeholders (business/PO)

## 5. Integratie- en foutscenario's

Om aan te tonen dat afhankelijkheden tussen systemen expliciet worden getest (niet alleen de happy path):
- **Postcode-lookup faalpad testen**: dit endpoint heeft een gedocumenteerd 502-scenario ("Upstream lookup failure") voor wanneer de onderliggende adres-service niet beschikbaar is. Dit is het meest realistische en officieel ondersteunde integratiefalen-scenario in deze applicatie, en wordt als primair voorbeeld gebruikt in de testautomatisering.
- Simuleren van een falende/trage API-response tijdens checkout (via Playwright's `page.route`) en verifiëren dat de UI dit correct afvangt (foutmelding, geen halve transactie)
- Testen van het gedrag rond factuurgeneratie wanneer brondata ontbreekt — reproduceren en documenteren van het scenario dat initieel werd waargenomen bij het opzetten van de omgeving (cron-taak faalt bij lege database)
- Testen van het asynchrone PDF-generatieproces van facturen: statuspolling (INITIATED → IN_PROGRESS → COMPLETED) correct afhandelen, inclusief het scenario waarin de status nooit naar COMPLETED overgaat (timeout-gedrag)

## 6. Entry- en exit-criteria

**Entry-criteria (voor een testcyclus/build):**
- Applicatie succesvol gedeployed in de testomgeving (lokaal via Docker)
- Testdata geseed en in bekende, consistente staat
- Testomgeving toegankelijk (UI + API + Swagger-documentatie bereikbaar)

**Exit-criteria:**
- Alle hoog-risico scenario's (sectie 2) hebben een groene testrun
- Geen openstaande kritieke of hoge-severity defecten in kernflows
- CI-pipeline groen op main branch
- Testrapportage gegenereerd en beschikbaar (Allure/Playwright HTML report)

## 7. Test data-strategie

- Testdata wordt gereset via `migrate:fresh --seed` voor een consistente uitgangspositie per testrun
- Voor specifieke scenario's (bijv. lege database, ontbrekende orderdata) wordt bewust een afwijkende databasestaat gebruikt om randgevallen te testen

## 8. Rapportage en zichtbaarheid

- Testresultaten worden na elke CI-run gepubliceerd (Allure of Playwright HTML report via GitHub Pages)
- Falende hoog-risico scenario's worden expliciet gemarkeerd/geprioriteerd in de rapportage, in lijn met de risicoclassificatie uit sectie 2

---
*Gevalideerd tegen de publieke API-specificatie (api.practicesoftwaretesting.com/docs). Resource-groepen en risico's zijn bevestigd; de lokale omgeving (localhost:8091) draait dezelfde applicatie/versie, dus deze validatie geldt ook daar.*
