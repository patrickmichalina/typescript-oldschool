import { fromEvent } from 'most'

Array.from(document.querySelectorAll<HTMLDivElement>('.card-component')).forEach(element => {
  console.log('I am a component that needs javascript all to myself :)')
  fromEvent('click', element)
    .map(evt => (evt.target as HTMLElement).getAttribute('data-meta'))
    .observe(console.log)
})
