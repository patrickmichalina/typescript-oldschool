import { createServer } from 'http'
import { app } from './app'

const server = createServer(app)

server.listen(5000, () => {
  console.log('listening')
})