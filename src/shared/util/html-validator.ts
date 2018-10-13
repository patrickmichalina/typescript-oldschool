const validator = require('html-validator')

interface ValidationError {
  readonly type: string
  readonly lastLine: number
  readonly lastColumn: number
  readonly firstColumn: number
  readonly message: string
  readonly extract: string
  readonly hiliteStart: number
  readonly hiliteLength: number
}

interface ValidatorResponse {
  readonly messages: ReadonlyArray<ValidationError>
}

const convertStringToObj = (str: string): ValidatorResponse => JSON.parse(str)
const convertResponseText =
  (errors: ReadonlyArray<ValidationError>) =>
    errors.reduce((acc, curr) => `${acc}\n${curr.message}`, '')

export const validateHtmlByString =
  (data: string) =>
    (validator({ data }) as Promise<string>)
      .then(convertStringToObj)
      .then(response => {
        return {
          response,
          message: convertResponseText(response.messages),
          isFailure: response.messages.length
        }
      })
