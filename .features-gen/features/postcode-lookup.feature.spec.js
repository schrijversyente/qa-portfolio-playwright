// Generated from: features\postcode-lookup.feature
import { test } from "playwright-bdd";

test.describe('Postcode lookup during checkout', () => {

  test.beforeEach('Background', async ({ Given, And, page }, testInfo) => { if (testInfo.error) return;
    await Given('I am on the checkout page'); 
    await And('I have at least one product in my cart', null, { page }); 
  });
  
  test('Successful postcode lookup returns a valid address', { tag: ['@high-risk', '@smoke'] }, async ({ When, Then, And, page }) => { 
    await When('I enter a valid postcode "1234AB" and house number "10"', null, { page }); 
    await Then('the street, city and state fields should be automatically filled in', null, { page }); 
    await And('I should be able to continue to the next checkout step', null, { page }); 
  });

  test('Invalid or unknown postcode is rejected', { tag: ['@validation'] }, async ({ When, Then, And, page }) => { 
    await When('I enter an invalid postcode "XXXX"', null, { page }); 
    await Then('I should see a validation error indicating the postcode is invalid', null, { page }); 
    await And('the address fields should remain empty', null, { page }); 
    await And('I should not be able to continue to the next checkout step', null, { page }); 
  });

  test('Upstream postcode lookup service is unavailable', { tag: ['@integration-failure', '@high-risk'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('the postcode lookup upstream service is simulated to fail with a 502 error', null, { page }); 
    await When('I enter a valid postcode "1234AB" and house number "10"', null, { page }); 
    await Then('I should see a clear error message indicating the lookup failed', null, { page }); 
    await And('I should still be able to manually fill in my address', null, { page }); 
    await And('I should be able to continue to the next checkout step after manually completing the address', null, { page }); 
  });

});

// == technical section ==

test.beforeEach('BeforeEach Hooks', ({ $runScenarioHooks, page }) => $runScenarioHooks('before', { page }));

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features\\postcode-lookup.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":11,"pickleLine":11,"tags":["@high-risk","@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the checkout page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And I have at least one product in my cart","isBg":true,"stepMatchArguments":[]},{"pwStepLine":12,"gherkinStepLine":12,"keywordType":"Action","textWithKeyword":"When I enter a valid postcode \"1234AB\" and house number \"10\"","stepMatchArguments":[{"group":{"start":25,"value":"\"1234AB\"","children":[{"start":26,"value":"1234AB","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":51,"value":"\"10\"","children":[{"start":52,"value":"10","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":13,"gherkinStepLine":13,"keywordType":"Outcome","textWithKeyword":"Then the street, city and state fields should be automatically filled in","stepMatchArguments":[]},{"pwStepLine":14,"gherkinStepLine":14,"keywordType":"Outcome","textWithKeyword":"And I should be able to continue to the next checkout step","stepMatchArguments":[]}]},
  {"pwTestLine":17,"pickleLine":17,"tags":["@validation"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the checkout page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And I have at least one product in my cart","isBg":true,"stepMatchArguments":[]},{"pwStepLine":18,"gherkinStepLine":18,"keywordType":"Action","textWithKeyword":"When I enter an invalid postcode \"XXXX\"","stepMatchArguments":[{"group":{"start":28,"value":"\"XXXX\"","children":[{"start":29,"value":"XXXX","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":19,"gherkinStepLine":19,"keywordType":"Outcome","textWithKeyword":"Then I should see a validation error indicating the postcode is invalid","stepMatchArguments":[]},{"pwStepLine":20,"gherkinStepLine":20,"keywordType":"Outcome","textWithKeyword":"And the address fields should remain empty","stepMatchArguments":[]},{"pwStepLine":21,"gherkinStepLine":21,"keywordType":"Outcome","textWithKeyword":"And I should not be able to continue to the next checkout step","stepMatchArguments":[]}]},
  {"pwTestLine":24,"pickleLine":24,"tags":["@integration-failure","@high-risk"],"steps":[{"pwStepLine":7,"gherkinStepLine":7,"keywordType":"Context","textWithKeyword":"Given I am on the checkout page","isBg":true,"stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"And I have at least one product in my cart","isBg":true,"stepMatchArguments":[]},{"pwStepLine":25,"gherkinStepLine":25,"keywordType":"Context","textWithKeyword":"Given the postcode lookup upstream service is simulated to fail with a 502 error","stepMatchArguments":[]},{"pwStepLine":26,"gherkinStepLine":26,"keywordType":"Action","textWithKeyword":"When I enter a valid postcode \"1234AB\" and house number \"10\"","stepMatchArguments":[{"group":{"start":25,"value":"\"1234AB\"","children":[{"start":26,"value":"1234AB","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"},{"group":{"start":51,"value":"\"10\"","children":[{"start":52,"value":"10","children":[{}]},{"children":[{}]}]},"parameterTypeName":"string"}]},{"pwStepLine":27,"gherkinStepLine":27,"keywordType":"Outcome","textWithKeyword":"Then I should see a clear error message indicating the lookup failed","stepMatchArguments":[]},{"pwStepLine":28,"gherkinStepLine":28,"keywordType":"Outcome","textWithKeyword":"And I should still be able to manually fill in my address","stepMatchArguments":[]},{"pwStepLine":29,"gherkinStepLine":29,"keywordType":"Outcome","textWithKeyword":"And I should be able to continue to the next checkout step after manually completing the address","stepMatchArguments":[]}]},
]; // bdd-data-end