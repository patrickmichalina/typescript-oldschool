import { createReadStream, createWriteStream, readdirSync, statSync } from 'fs'
import { createBrotliCompress, createGzip } from 'zlib'
import { resolve } from 'path'

const files: ReadonlyArray<string> = ['.dist/.public', '.dist/.public/js', '.dist/.public/css']

const compressFile =
  (filename: string, compression: Function, ext: string) =>
    new Promise((res, _rej) => {
      const input = createReadStream(filename)
      const output = createWriteStream(filename + `.${ext}`)
      input.pipe(compression()).pipe(output)

      output.on('end', () => {
        return res()
      })
    })

const getPathsDeep =
  (dirs: ReadonlyArray<string>): ReadonlyArray<string> => {
    return dirs
      .map(dirPath => resolve(dirPath))
      .map(dirPath => readdirSync(dirPath)
        .map(a => {
          const path = resolve(dirPath, a)
          return statSync(path).isDirectory()
            ? getPathsDeep([path])
            : [resolve(dirPath, a)]
        })
        .reduce((acc, curr) => {
          return [
            ...acc,
            ...curr
          ]
        }, [])
      )
      .reduce((acc, curr) => {
        return [
          ...acc,
          ...[...curr]
        ]
      }, [])
  }

const gzip = getPathsDeep(files).filter(a => !new RegExp(/.gz|.br/).test(a)).map(file => compressFile(file, createGzip, 'gz'))
const brotli = getPathsDeep(files).filter(a => !new RegExp(/.br|.gz/).test(a)).map(file => compressFile(file, createBrotliCompress, 'br'))

Promise.all([...gzip, ...brotli])