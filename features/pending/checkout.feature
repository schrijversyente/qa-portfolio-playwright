Feature: Checkout
  As a customer
  I want to check out the products in my cart
  So that I receive the products I ordered

  Background:
    Given I am logged in as a registered customer
    And I have at least one product in my cart

  @high-risk @smoke
  Scenario: Successful checkout with valid payment
    When I complete the checkout with valid shipping and payment details
    Then my order should be confirmed
    And I should see an order confirmation

  @high-risk
  Scenario: Checkout fails when payment is declined
    When I complete the checkout with details that result in a declined payment
    Then I should see a payment failure message
    And no order confirmation should be shown

  @edge-case
  Scenario: Checkout is blocked with an empty cart
    Given my cart is empty
    When I navigate to checkout
    Then I should not be able to proceed to payment

  @edge-case
  Scenario: Product becomes unavailable during checkout
    Given a product in my cart becomes unavailable while I am checking out
    When I attempt to complete the checkout
    Then I should see a message indicating the product is no longer available
    And I should not be charged
