
export default {
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',

  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    title: '따봉도치봇 공식사이트',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport'  , content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name   : '따봉도치봇은 로스트아크를 위한 디스코드용 로봇입니다. 지금 바로 여러분의 채널에 초대해보세요!' }
    ],
    link: [
      {
        rel: 'stylesheet',
        type: 'text/css',
        href:
          'https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css'
      }
    ]
  },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/css/fontawesome-all.css',
    '~/assets/css/swiper.css',
    '~/assets/css/magnific-popup.css',
    '~/assets/css/styles.css',
    '~/assets/css/custom.css',
  ],

  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
  ],

  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,

  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://http.nuxtjs.org
    '@nuxt/http'
  ],

  /*
  ** Server Middleware
  */
  serverMiddleware: {
    '/api': '~/api'
  },

  /*
  ** For deployment you might want to edit host and port
  */
  // server: {
  //  port: 8000, // default: 3000
  //  host: '0.0.0.0' // default: localhost
  // },

  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  }
}
