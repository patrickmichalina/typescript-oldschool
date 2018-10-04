import { createServer } from 'http'
import { app } from './app'

const server = createServer(app)
const PORT = 5000

server.listen(PORT, () => {
  console.log('\n', 'Application server listening on port', PORT)
})