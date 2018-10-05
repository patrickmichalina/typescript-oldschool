Feature('CodeceptJS demo')

Scenario('check Welcome page on site', (I) => {
  I.amOnPage('/about')
  I.see('ABOUT')
})