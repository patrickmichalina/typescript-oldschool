import * as glob from 'glob'
import { minify } from 'uglify-js'
import { resolve } from 'path'
import { readFileSync, writeFileSync } from 'fs'

glob('.dist/.public/**/*.js', (err, matches) => {
  matches
    .map(path => resolve(path))
    .map(path => ({ path, file: readFileSync(path, 'utf-8') }))
    .map(res => {
      return {
        ...res,
        code: minify(res.file, { compress: true, mangle: true }).code
      }
    })
    .forEach(res => {
      writeFileSync(res.path, res.code)
    })
})