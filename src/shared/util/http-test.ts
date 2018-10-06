import { createApplication } from '../../app'
import { SuperTest, Test } from 'supertest'
import { validateHtmlByString } from './html-validator'
import { maybe } from 'typescript-monads'

// creates an express app instance that is great for testing in Supertest
export const syntheticHttpTestApp =
  createApplication()
    .run({
      CLUSTERED_WORKERS: 1,
      NODE_DEBUG: true,
      PORT: 50005
    })

// commonly used test functions
export const expectText200 =
  (client: SuperTest<Test>) =>
    (url: string) =>
      client
        .get(url)
        .expect('Content-Type', /text\/html/)
        .expect(200)

export const expectText200Done =
  (client: SuperTest<Test>) =>
    (url: string) =>
      (done: Mocha.Done) => {
        expectText200(client)(url).end(done)
      }

export const validateHtml =
  (client: SuperTest<Test>) =>
    (url: string) =>
      (done: Mocha.Done) => {
        expectText200(client)(url)
          .end((err, res) => {
            maybe(err)
              .tap({
                some: done,
                none: () => {
                  validateHtmlByString(res.text)
                    .then(a => {
                      a.isFailure
                        ? done(new Error(a.message))
                        : done()
                    })
                    .catch(done)
                }
              })
          })
      }