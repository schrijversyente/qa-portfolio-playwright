Feature: Invoice generation
  As a customer
  I want to receive a downloadable invoice after a successful order
  So that I have correct proof of payment

  @high-risk @smoke
  Scenario: Invoice is generated after a successful order
    Given I have completed a successful order
    When the invoice generation process runs
    Then an invoice should be created for my order

  @high-risk @integration-failure
  Scenario: Invoice generation fails due to missing or inconsistent source data
    Given an order exists with missing or inconsistent underlying data
    When the invoice generation process runs
    Then the invoice generation should fail visibly
    And this failure should be logged/reported rather than silently ignored

  @integration-failure
  Scenario: Invoice PDF generation is asynchronous and eventually completes
    Given an invoice has been generated for my order
    When I request the PDF version of the invoice
    Then the PDF status should progress from initiated to in progress to completed
    And I should be able to download the completed PDF

  @edge-case
  Scenario: Invoice PDF generation never completes
    Given an invoice PDF generation has been requested
    But the PDF status never reaches "completed"
    When I check the status after a reasonable timeout
    Then I should see an appropriate error or retry option

  @high-risk
  Scenario: Users can only access their own invoices
    Given I am logged in as a customer
    When I attempt to view or download an invoice belonging to another customer
    Then access should be denied
