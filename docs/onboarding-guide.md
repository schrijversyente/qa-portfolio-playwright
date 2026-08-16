# Onboarding: een nieuw testscenario toevoegen

Dit document legt uit hoe je een nieuw testscenario toevoegt aan dit framework, bedoeld voor iemand die voor het eerst in deze repo werkt.

## Architectuur in het kort

```
docs/                          Strategie- en procesdocumentatie
features/
├── *.feature                  Geïmplementeerde Gherkin-scenario's
├── pending/                   Gherkin-scenario's, nog niet geïmplementeerd
└── steps/                     Step definitions (TypeScript, koppelt Gherkin aan Page Objects)
tests/
├── pages/                     Page Objects (locators + acties per pagina)
└── fixtures/                  Herbruikbare setup-logica (bijv. cart-seeding via de API)
.github/workflows/             CI-pipeline
```

**Kernprincipe:** Gherkin-stappen bevatten geen locators of technische details — die zitten in de Page Objects. Step definitions zijn een dunne vertaallaag ertussen.

## Stap voor stap: een nieuw scenario toevoegen

1. **Schrijf het scenario in Gherkin.** Begin met de business-taal, niet met code. Als er nog geen `.feature`-bestand is voor dit onderwerp, maak er een aan in `features/`. Als het scenario nog niet geïmplementeerd wordt, zet het in `features/pending/` totdat je eraan toe bent (zie "Waarom een `pending/`-map" onderaan).

2. **Inspecteer de relevante pagina.** Zoek de daadwerkelijke HTML op (devtools → Elements). Geef de voorkeur aan `data-test`-attributen boven labels of tekst — die zijn stabieler en minder gevoelig voor UI-wijzigingen.

3. **Breid een bestaand Page Object uit, of maak een nieuwe.** Elke pagina/component heeft zijn eigen klasse in `tests/pages/`. Voeg locators toe in de constructor, en acties/assertions als methodes.

4. **Schrijf de step definitions.** In `features/steps/`, koppel elke Gherkin-stap aan een methode-aanroep op het Page Object. Step definitions bevatten zelf geen locators.

5. **Genereer en draai:**
   ```
   npx bddgen
   npx playwright test
   ```
   Gebruik `npx playwright test --ui` om stap voor stap te debuggen, of `-g "scenario naam"` om één scenario te filteren.

6. **Commit in twee stappen indien relevant:** code (feature/steps/page objects) en documentatie apart, met een duidelijke commit message.

## Veelvoorkomende valkuilen (uit ervaring in dit project)

- **`.fill()` triggert soms geen Angular-formulierlogica.** Als een veld niet reageert zoals verwacht, probeer `pressSequentially()` (echte toetsaanslag-events) in plaats van `.fill()`.
- **Navigatie na een actie is niet automatisch afgewacht.** Een `.click()` die een paginawissel veroorzaakt, moet je expliciet opvolgen met een wacht op een betrouwbaar signaal (bijv. `page.waitForURL()`), anders werkt de test op de oude pagina verder.
- **Niet elk laadmoment heeft een betrouwbare loading-indicator.** Als een indicator te snel verschijnt/verdwijnt om te vangen, poll liever op het daadwerkelijke resultaatveld (`expect.poll()`) dan op het tussentijdse UI-signaal.
- **Testdata is niet altijd compleet.** Sommige lookups/services geven niet voor elke input alle velden terug — verifieer dit handmatig voor je een assertie schrijft die op elk veld rekent.

## Waarom een `pending/`-map

`npx bddgen` faalt op de volledige build zodra er één ontbrekende step-definition is, ongeacht in welk bestand. Door nog-niet-geïmplementeerde scenario's in `features/pending/` te zetten (buiten het gescande pad), kan de rest van de suite gewoon draaien. Verplaats een scenario terug naar `features/` zodra je de bijbehorende steps hebt geschreven.

## CI/CD

De pipeline (`.github/workflows/playwright.yml`) start de volledige applicatie (Docker Compose) op binnen de CI-runner zelf, seedt de database, en draait de tests op drie browsers. Zie de commit-historie voor het debug-traject als je hier iets aanpast — een aantal niet-voor-de-hand-liggende volgorde- en permissieproblemen zijn daar al opgelost en gedocumenteerd.
