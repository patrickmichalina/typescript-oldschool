const concurrently = require('concurrently')

concurrently([
  'npm:copy.scripts',
  { command: 'cpx \"src/**/*.{pug,pug}\" .dist -w', name: 'views' },
  { command: 'node_modules/.bin/tsc -w', name: 'ts compiler' },
  { command: 'mkdir -p .dist/_public/css && node_modules/.bin/stylus -w src/**/*.styl -o .dist/_public/css', name: 'stylus' },
  { command: 'nodemon --delay 20ms --ignore .dist/_public -w .dist .dist/server.js', name: 'server', prefixColor: 'blue' }
], {
    prefix: 'name',
    killOthers: ['failure', 'success'],
    restartTries: 3,
  })

