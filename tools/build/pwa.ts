require('workbox-build')
  .generateSW({
    swDest: '.dist/wwwroot/sw.script.js',
    globDirectory: '.dist/wwwroot',
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
          }
        }
      },
      {
        urlPattern: /\.(?:js|css|json|png|svg|jpeg|jpg)$/,
        handler: 'staleWhileRevalidate',
        options: {
          cacheName: 'static-resources'
        }
      },
      {
        urlPattern: /\/(.+)\/([^\./]+)*$/gm,
        handler: 'networkFirst',
        options: {
          cacheName: 'pages'
        }
      }
    ]
  })

