import { expect } from 'chai'
import { homeModule } from './home.module'
import { getIndexHandler } from './home.handler'

describe('Home Module', () => {
  it('Should define handlers', () => {
    expect(homeModule).to.not.be.null
  })

  it('Should map "/path" to correct handler', () => {
    expect(homeModule.get).to.have.property('/').that.equal(getIndexHandler)
  })
})