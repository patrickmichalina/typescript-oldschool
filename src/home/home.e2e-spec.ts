Feature('Home Page')

Scenario('check home page', (I) => {
  I.amOnPage('/')
  I.see('3')
})