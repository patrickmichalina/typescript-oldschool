import { agent } from 'supertest'
import { syntheticHttpTestApp, validateHtml, expectText200Done } from '../shared/util/http-test'

describe('About HTTP', () => {
  const client = agent(syntheticHttpTestApp)
  const page = '/about'

  it('Should render text/html', expectText200Done(client)(page))
  it('Should render valid HTML', validateHtml(client)(page))
})
