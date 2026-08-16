Feature: Payment
  As a customer
  I want my payment to be correctly verified during checkout
  So that I can be confident my order has been processed correctly

  Background:
    Given I am logged in as a registered customer
    And I have proceeded to the payment step of checkout

  @high-risk @smoke
  Scenario: Payment succeeds with valid payment details
    When I submit valid payment details
    Then the payment should be confirmed
    And my order should proceed to confirmation

  @high-risk
  Scenario: Payment is declined
    When I submit payment details that result in a decline
    Then I should see a clear payment failure message
    And my order should not be confirmed

  @validation
  Scenario: Payment fails validation with missing required fields
    When I submit the payment form with required fields left empty
    Then I should see a validation error
    And the payment should not be submitted

  @integration-failure @high-risk
  Scenario: Payment verification is slow or unresponsive
    Given the payment verification service responds slowly or not at all
    When I submit valid payment details
    Then I should see an appropriate waiting or error state
    And I should not be charged multiple times for the same order
