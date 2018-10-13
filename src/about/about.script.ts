import { fromEvent } from 'most'
import * as monads from 'typescript-monads'

const button = document.querySelector('button')
monads.maybe(button).tapSome(console.log)
fromEvent('click', button)
  .map(a => 1)
  .observe(console.log)
