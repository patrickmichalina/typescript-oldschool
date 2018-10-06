
document.addEventListener("DOMContentLoaded", _ => {
  Array.from(document.querySelectorAll<HTMLDivElement>('.card-component')).forEach(a => {
    console.log('I am a component that needs javascript all to myself :)')
  })
})
