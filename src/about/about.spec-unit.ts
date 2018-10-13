import { expect } from 'chai'
import { aboutModule } from './about.module'
// import { getAboutHandler } from './about.handlers'

describe('AboutModule', () => {
  it('Should define handlers', () => {
    expect(aboutModule).to.not.be.null
  })

  it('Should map "/about" path to correct handler', () => {
    // expect(aboutModule.get).to.have.property('/about').that.equal(getAboutHandler)
  })
})