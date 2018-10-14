require('workbox-build')
  .generateSW({
    swDest: '.dist/.public/js/sw.js',
    globDirectory: '.dist/.public',
    globPatterns: ['**\/*.{js,css}'],
    runtimeCaching: [
      {
        urlPattern: /https:\/\/unpkg.com\//,
        handler: 'cacheFirst',
        options: {
          cacheName: 'external-static-resources',
          cacheableResponse: { statuses: [0, 200] },
          expiration: {
            maxEntries: 20,
          },
        }
      },
      {
        urlPattern: /\.(?:js|css)$/,
        handler: 'cacheFirst',
        options: {
          cacheName: 'static-resources'
        }
      },
      {
        urlPattern: /\/(.+)\/([^\./]+)*$/,
        handler: 'networkFirst',
        options: {
          cacheName: 'pages'
        }
      }
    ]
  })

