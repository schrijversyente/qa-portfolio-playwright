# Coding conventions & best practices

Korte, praktische afspraken voor consistentie in dit project. Geen uitputtende stijlgids — de nadruk ligt op de keuzes die in dit project specifiek zijn gemaakt en waarom.

## Taal

- **Code, Gherkin-feature files, step definitions, Page Objects:** Engels. Dit is de gangbare conventie in internationale/technische Playwright-repo's en houdt de code herbruikbaar.
- **Documentatie in `docs/`** (teststrategie, requirements-mapping, onboarding): Nederlands, een bewuste keuze in dit project — niet verplicht voor elk project, maar hier consistent toegepast.

## Locators

- **Voorkeur:** `data-test`-attributen (`page.locator('[data-test="..."]')`) — stabiel, onafhankelijk van tekst/taal/styling.
- **Alleen als er geen `data-test` is:** `getByRole`, `getByLabel`.
- **Vermijd:** CSS-selectors op class-namen of DOM-structuur — breekt snel bij UI-wijzigingen.

## Page Object Model

- Eén klasse per pagina/component in `tests/pages/`.
- Locators als `readonly`-properties in de constructor.
- Acties en assertions als methodes — step definitions roepen alleen deze methodes aan, geen losse locators.
- Een Page Object bevat geen Gherkin-kennis en geen *scenario-afhankelijke* testdata (accounts, product-ID's, adressen) — die horen in de step definitions/fixtures.
- Vaste UI-copy (bijv. een exacte foutmeldingstekst) mag wél in een Page Object staan, als onderdeel van een betekenisvolle assertion-methode (`expectLoginError()`) — dat is precies de locator-plus-verwacht-resultaat-kennis die een Page Object hoort te verbergen voor de step. Het onderscheid: verandert de waarde per scenario (test data) of is het een vast kenmerk van de pagina zelf (UI-contract)?

## Wachten en timing

- **Vermijd vaste `waitForTimeout()`-calls** waar mogelijk — ze zijn een gok, geen garantie, en maken tests trager dan nodig.
- **Voorkeur:** `expect(locator).toHaveValue(...)`, `expect.poll(...)`, of `page.waitForURL(...)` — deze wachten op een concreet, verifieerbaar signaal en falen sneller/duidelijker als er echt iets mis is.
- Als je toch een vaste timeout nodig hebt (bijv. om een race condition te overbruggen), documenteer waarom in een comment — een kale timeout zonder uitleg is een toekomstig raadsel voor jezelf of een collega.

## Fixtures

- Herbruikbare setup (bijv. data aanmaken) hoort in `tests/fixtures/`, niet gedupliceerd in losse step definitions.
- Geef de voorkeur aan setup via de API boven UI-interactie waar mogelijk — sneller en minder gevoelig voor UI-wijzigingen elders in de flow.

## Tags

Scenario's zijn getagd op risiconiveau en type, gebaseerd op de risicoanalyse in `docs/test-strategy.md`:
- `@high-risk` — hoog-risico scenario's uit de risicoanalyse
- `@smoke` — kernscenario's voor een snelle sanity-check
- `@integration-failure` — scenario's die een falende afhankelijke service simuleren
- `@validation` / `@edge-case` — randgevallen en invoervalidatie
- `@wip` — geïmplementeerd maar niet betrouwbaar genoeg om in CI te draaien (zie "Bekende beperkingen" hieronder); uitgesloten via `--grep-invert @wip` in de pipeline

Gebruik tags om selectief te draaien, bijv. `npx playwright test --grep @smoke` voor een snelle CI-check.

## Commits

- Aparte commits voor code-wijzigingen en documentatie-wijzigingen waar dat de historie leesbaarder maakt.
- Duidelijke, beschrijvende commit messages — bij een debug-traject: benoem de daadwerkelijke oorzaak die je vond, niet alleen "fix bug".

## Bekende beperkingen

Niet elk scenario is (nog) volledig werkend of geïmplementeerd. Dit wordt expliciet gedocumenteerd (zie `docs/test-strategy.md`, sectie "Bekende beperking") in plaats van verborgen — een eerlijke, onderbouwde beperking is waardevoller dan de indruk wekken dat alles perfect werkt.
