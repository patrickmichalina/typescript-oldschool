Array.from(document.querySelectorAll<HTMLDivElement>('.card-component')).forEach(element => {
  console.log('I am a component that needs javascript all to myself :)')
  element.addEventListener('click', evt => {
    console.log(element.id, element.getAttribute('data-meta'))
  })
})
