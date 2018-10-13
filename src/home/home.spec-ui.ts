describe('My First Test', () => {
  it('finds the content', () => {
    cy.visit('/')
    cy.get('.card-component').contains(3)
  })
})