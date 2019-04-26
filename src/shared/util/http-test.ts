import { createApplication } from '../../app'
import { SuperTest, Test } from 'supertest'
import { validateHtmlByString } from './html-validator'
import { maybe } from 'typescript-monads'

// creates an express app instance that is great for testing in Supertest
export const syntheticHttpTestApp =
  createApplication()
    .run({
      APP_VERSION: 'testing-app-version',
      CLUSTERED_WORKERS: 1,
      NODE_DEBUG: true,
      PORT: 5005,
      EXTERANL_JS_DEPEPENDENCIES: {
        map: {}
      },
      MANIFEST: {},
      DIST_FOLDER: '.dist/wwwroot',
      MANIFEST_CACHE_CONTROL: 'private, no-cache'
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
      (done: any) => {
        expectText200(client)(url).end(done)
      }

export const validateHtml =
  (client: SuperTest<Test>) =>
    (url: string) =>
      (done: any) => {
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