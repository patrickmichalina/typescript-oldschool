import { fromEvent } from 'most'

const button = document.querySelector('button')

fromEvent('click', button)
  .scan(b => b + 1, 0)
  .observe(console.log)
