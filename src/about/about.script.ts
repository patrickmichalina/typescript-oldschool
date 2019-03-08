import { fromEvent } from 'most'

const button = document.querySelector('button')
fromEvent('click', button)
  .observe(console.log)
