describe('My First Test', () => {
  it('finds the content "type"', () => {
    cy.visit('/about')
    cy.get('button').contains('Test this out')
  })
})