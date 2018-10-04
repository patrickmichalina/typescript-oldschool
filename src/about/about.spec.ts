import { expect } from 'chai'
import { aboutModule } from './about.module'
import { getAboutHandler } from './about.handlers'

describe('AboutModule', () => {
  it('should define handlers', () => {
    expect(aboutModule).to.not.be.null
  })

  it('map /about path to correct handler', () => {
    expect(aboutModule.get).to.have.property('/about').that.equal(getAboutHandler)
  })
})