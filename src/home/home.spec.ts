import { expect } from 'chai'
import { homeModule } from './home.module'
import { getIndexHandler } from './home.handler'

describe('HomeModule', () => {
  it('should define handlers', () => {
    expect(homeModule).to.not.be.null
  })

  it('map / path to correct handler', () => {
    expect(homeModule.get).to.have.property('/').that.equal(getIndexHandler)
  })
})