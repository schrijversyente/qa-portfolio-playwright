Feature: Postcode lookup during checkout
  As a customer
  I want my address to be automatically filled in based on my postcode
  So that I don't have to manually enter all address details during checkout

  Background:
    Given I am on the checkout page
    And I have at least one product in my cart

  @high-risk @smoke
  Scenario: Successful postcode lookup returns a valid address
    Given I enter a valid postcode "1234AB" and house number "10"
    When I trigger the postcode lookup
    Then the street, city and state fields should be automatically filled in
    And I should be able to continue to the next checkout step

  @validation
  Scenario: Invalid or unknown postcode is rejected
    Given I enter an invalid postcode "XXXX"
    When I trigger the postcode lookup
    Then I should see a validation error indicating the postcode is invalid
    And the address fields should remain empty
    And I should not be able to continue to the next checkout step

  @integration-failure @high-risk
  Scenario: Upstream postcode lookup service is unavailable
    Given the postcode lookup upstream service is simulated to fail with a 502 error
    And I enter a valid postcode "1234AB" and house number "10"
    When I trigger the postcode lookup
    Then I should see a clear error message indicating the lookup failed
    And I should still be able to manually fill in my address
    And I should be able to continue to the next checkout step after manually completing the address

  @validation
  Scenario: Missing required query parameters
    Given I attempt a postcode lookup without providing a country
    When I trigger the postcode lookup
    Then I should see a validation error indicating required fields are missing