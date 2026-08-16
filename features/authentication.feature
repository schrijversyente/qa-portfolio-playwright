Feature: Authentication
  As a user
  I want to log in to my account
  So that I have access to my orders and personal information

  @high-risk @smoke
  Scenario: Successful login with valid credentials
    Given I am on the login page
    When I log in with a valid email and password
    Then I should be logged in
    And I should have access to my account

  @high-risk
  Scenario: Login fails with an incorrect password
    Given I am on the login page
    When I log in with a valid email and an incorrect password
    Then I should see an error message
    And I should not be logged in

  @validation
  Scenario: Login fails for a non-existent account
    Given I am on the login page
    When I log in with an email that is not registered
    Then I should see an error message
    And I should not be logged in

  @high-risk
  Scenario: Successful registration of a new account
    Given I am on the registration page
    When I register with valid, unique account details
    Then my account should be created
    And I should be able to log in with those details

  @edge-case
  Scenario: Registration fails for an already registered email address
    Given I am on the registration page
    When I register using an email address that already has an account
    Then I should see an error message indicating the account already exists

  @high-risk
  Scenario: Access to protected resources without a valid session
    Given I am not logged in
    When I attempt to access a protected endpoint or page
    Then I should be denied access
    And I should be redirected to the login page or receive an unauthorized response
