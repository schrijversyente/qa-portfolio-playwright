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
