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
