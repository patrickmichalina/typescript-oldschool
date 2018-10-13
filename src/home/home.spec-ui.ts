describe('My First Test', () => {
  it('finds the content', () => {
    cy.visit('/')
    cy.get('p').contains('3')
  })
})