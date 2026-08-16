// Generated from: features\authentication.feature
import { test } from "playwright-bdd";

test.describe('Authentication', () => {

  test('Successful login with valid credentials', { tag: ['@high-risk', '@smoke'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I am on the login page', null, { page }); 
    await When('I log in with a valid email and password', null, { page }); 
    await Then('I should be logged in', null, { page }); 
    await And('I should have access to my account', null, { page }); 
  });

  test('Login fails with an incorrect password', { tag: ['@high-risk'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I am on the login page', null, { page }); 
    await When('I log in with a valid email and an incorrect password', null, { page }); 
    await Then('I should see an error message', null, { page }); 
    await And('I should not be logged in', null, { page }); 
  });

  test('Login fails for a non-existent account', { tag: ['@validation'] }, async ({ Given, When, Then, And, page }) => { 
    await Given('I am on the login page', null, { page }); 
    await When('I log in with an email that is not registered', null, { page }); 
    await Then('I should see an error message', null, { page }); 
    await And('I should not be logged in', null, { page }); 
  });

});

// == technical section ==

test.use({
  $test: [({}, use) => use(test), { scope: 'test', box: true }],
  $uri: [({}, use) => use('features\\authentication.feature'), { scope: 'test', box: true }],
  $bddFileData: [({}, use) => use(bddFileData), { scope: "test", box: true }],
});

const bddFileData = [ // bdd-data-start
  {"pwTestLine":6,"pickleLine":7,"tags":["@high-risk","@smoke"],"steps":[{"pwStepLine":7,"gherkinStepLine":8,"keywordType":"Context","textWithKeyword":"Given I am on the login page","stepMatchArguments":[]},{"pwStepLine":8,"gherkinStepLine":9,"keywordType":"Action","textWithKeyword":"When I log in with a valid email and password","stepMatchArguments":[]},{"pwStepLine":9,"gherkinStepLine":10,"keywordType":"Outcome","textWithKeyword":"Then I should be logged in","stepMatchArguments":[]},{"pwStepLine":10,"gherkinStepLine":11,"keywordType":"Outcome","textWithKeyword":"And I should have access to my account","stepMatchArguments":[]}]},
  {"pwTestLine":13,"pickleLine":14,"tags":["@high-risk"],"steps":[{"pwStepLine":14,"gherkinStepLine":15,"keywordType":"Context","textWithKeyword":"Given I am on the login page","stepMatchArguments":[]},{"pwStepLine":15,"gherkinStepLine":16,"keywordType":"Action","textWithKeyword":"When I log in with a valid email and an incorrect password","stepMatchArguments":[]},{"pwStepLine":16,"gherkinStepLine":17,"keywordType":"Outcome","textWithKeyword":"Then I should see an error message","stepMatchArguments":[]},{"pwStepLine":17,"gherkinStepLine":18,"keywordType":"Outcome","textWithKeyword":"And I should not be logged in","stepMatchArguments":[]}]},
  {"pwTestLine":20,"pickleLine":21,"tags":["@validation"],"steps":[{"pwStepLine":21,"gherkinStepLine":22,"keywordType":"Context","textWithKeyword":"Given I am on the login page","stepMatchArguments":[]},{"pwStepLine":22,"gherkinStepLine":23,"keywordType":"Action","textWithKeyword":"When I log in with an email that is not registered","stepMatchArguments":[]},{"pwStepLine":23,"gherkinStepLine":24,"keywordType":"Outcome","textWithKeyword":"Then I should see an error message","stepMatchArguments":[]},{"pwStepLine":24,"gherkinStepLine":25,"keywordType":"Outcome","textWithKeyword":"And I should not be logged in","stepMatchArguments":[]}]},
]; // bdd-data-end