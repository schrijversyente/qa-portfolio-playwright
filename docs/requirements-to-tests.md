# Requirements → Testscenario's — Toolshop Playwright

**Status:** Eerste opzet — doorgetrokken patroon voor alle hoog-risico items uit `test-strategy.md`. Nog te verfijnen (edge cases, Gherkin-detaillering, koppeling aan concrete API-velden).

Elke requirement is fictief maar herleidbaar tot een echte flow in de Toolshop-applicatie, gekoppeld aan het risiconiveau uit de teststrategie.

---

## R1 — Checkout / order plaatsen

**Requirement:** Als klant wil ik mijn winkelmandje kunnen afrekenen, zodat ik het bestelde product ontvang.
**Risiconiveau:** Hoog

**Testscenario's:**
1. Succesvolle checkout met geldige gegevens en geldige betaling
2. Checkout met falende betaling (`/payment/check` retourneert een afwijzing)
3. Checkout waarbij de postcode-lookup faalt (502 Upstream) — verifiëren dat de gebruiker toch kan doorgaan of een duidelijke foutmelding krijgt, niet vastloopt
4. Checkout met een leeg winkelmandje (edge case — moet geblokkeerd worden)
5. Checkout waarbij een product tussentijds niet meer beschikbaar is

---

## R2 — Authenticatie (login/registratie)

**Requirement:** Als gebruiker wil ik kunnen inloggen op mijn account, zodat ik toegang heb tot mijn bestellingen en gegevens.
**Risiconiveau:** Hoog

**Testscenario's:**
1. Succesvolle login met geldige combinatie e-mail/wachtwoord
2. Login met onjuist wachtwoord — correcte foutmelding, geen toegang
3. Login met niet-bestaand account
4. Registratie van een nieuw account met geldige gegevens
5. Registratie met reeds bestaand e-mailadres (conflict-scenario)
6. Toegang tot beveiligde endpoints zonder geldige sessie/token (401-gedrag)

---

## R3 — Betaling (`/payment/check`)

**Requirement:** Als klant wil ik dat mijn betaling correct gecontroleerd wordt tijdens checkout, zodat ik zeker weet dat mijn bestelling correct is afgerond.
**Risiconiveau:** Hoog

**Testscenario's:**
1. Betaling met geldige gegevens — succesvolle bevestiging
2. Betaling die door de check wordt afgewezen — correcte foutafhandeling, geen orderbevestiging
3. Betaling met ontbrekende verplichte velden (validatiefout)
4. Gedrag bij trage/niet-reagerende betaalcontrole (timeout simuleren via `page.route`)

---

## R4 — Postcode-lookup (adresvalidatie)

**Requirement:** Als klant wil ik dat mijn adres automatisch wordt aangevuld op basis van mijn postcode, zodat ik minder gegevens handmatig hoef in te vullen tijdens checkout.
**Risiconiveau:** Hoog

**Testscenario's:**
1. Geldige postcode + huisnummer — correcte straat/stad/staat teruggegeven
2. Ongeldige/onbekende postcode — 422-validatiefout correct afgehandeld in de UI
3. **Kernscenario: upstream-service faalt (502 "Upstream lookup failure")** — verifiëren dat de gebruiker het adres alsnog handmatig kan invullen en niet vastloopt in de flow
4. Ontbrekende verplichte queryparameters (country/postcode)

---

## R5 — Factuurgeneratie (achtergrondproces + PDF)

**Requirement:** Als klant wil ik na een succesvolle bestelling een factuur ontvangen die ik kan downloaden, zodat ik een correct betalingsbewijs heb.
**Risiconiveau:** Hoog

**Testscenario's:**
1. Factuur wordt correct gegenereerd na een succesvolle order
2. Factuurgeneratie faalt bij ontbrekende/inconsistente brondata (reproductie van het scenario uit Fase 0 — cron-taak faalt bij lege database)
3. PDF-statuspolling: correcte afhandeling van INITIATED → IN_PROGRESS → COMPLETED
4. PDF-statuspolling: gedrag wanneer status nooit COMPLETED bereikt (timeout-scenario)
5. Downloaden van een reeds gegenereerde PDF — correcte inhoud/toegankelijkheid
6. Autorisatie: gebruiker kan alleen eigen facturen inzien/downloaden, niet die van anderen

---

## Openstaande verfijning
- Elk scenario hierboven vertalen naar concrete Gherkin `.feature`-bestanden (Fase 3)
- Concrete testdata per scenario vastleggen (welke accounts, welke producten, welke postcodes)
- Prioriteit binnen elke requirement aangeven (welke scenario's eerst geautomatiseerd worden)