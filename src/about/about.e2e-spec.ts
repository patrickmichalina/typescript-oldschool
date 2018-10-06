Feature('About Page')

Scenario('check about page', (I) => {
  I.amOnPage('/about')
  I.see('ABOUT')
})