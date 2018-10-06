import { expect } from 'chai'
import { reduceAppModuleToSimple } from './add-to-engine'
import { AppModule } from '../interfaces/app-module.interface'

describe('When adding handler modules to Express application', () => {
  it('Should return empty object if module input is empty', () => {
    const someModuleDefinition: AppModule = {}
    const sut = reduceAppModuleToSimple(someModuleDefinition)('get')

    expect(sut).to.be.an('object').that.is.empty
  })

  it('Should extract method and path key object', () => {
    const someModuleDefinition: AppModule = {
      get: {
        '/some-path': () => 'test'
      }
    }
    const sut = reduceAppModuleToSimple(someModuleDefinition)('get')

    expect(sut).to.deep.equal({
      methodKey: 'get',
      pathKey: '/some-path'
    })
  })
})