// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  telemetry: false,
  target: 'static',
  server: {
    host: '0' // default: localhost
  },
  modules: [
    '@nuxtjs/tailwindcss',
    //'@nuxt/image-edge',
    '@vueuse/nuxt',
    '@kevinmarrec/nuxt-pwa',
    'nuxt-icon',
],
  buildModules: [
    '@nuxtjs/google-fonts'
  ],
  runtimeConfig: {
    private: {
    },
    public: {
      //WARN cambiar al deploy final:
      CONTENT_KEY: process.env.CONTENT_KEY,
      SPACE_ID: process.env.SPACE_ID,
      ACCESS_TOKEN: process.env.ACCESS_TOKEN,
      DEFAULT_LANGUAGE: 'es-AR',
      HOST: process.env.NODE_ENV === 'production' ? 'https://luznegra.vercel.app' : 'http://localhost:3000',
      APP_NAME: 'LUZ NEGRA',
      APP_URL: 'https://luznegra.vercel.app',
      SITE_TITLE: 'LUZ NEGRA - Diseño y animación',
      SITE_TOP_DESCRIPTION: 'Diseño y animación',
      TEAM_NAME: 'LUZ NEGRA',
      TEAM_WEBSITE_URL: 'https://luz-negra.com',
      TEAM_STATEMENT: 'Utilizamos diversas técnicas y apostamos a la experimentación. Logramos una resolución original para cada proyecto.',
      TEAM_LOGO_IMAGE_ON_FOOTER: '/images/tubos_loop_ani.png',
      TEAM_LOGO_BLACK: '/images/tubos_loader_a.png',
      OG_IMAGE: '/OG.png',
      //GITHUB_ORGANIZATION_URL: 'https://github.com/longrun',
      //GA_ID: process.env.GA_ID,
      //GA_APP_NAME: 'LongRun Blog',
    },
  },
  css: [
    // https://github.com/sampotts/plyr#options
    'vue-plyr/dist/vue-plyr.css',
  ],
  googleFonts: {
    families: {
      'Open Sans': true,
      'Varela Round': true,//FIXME no carga en los project tags
    }
  },
  //image: {
    // Options
  //}
  pwa: {
    manifest: {
      name: 'LUZ NEGRA - Diseño y animación',
      short_name: 'LUZ NEGRA',
      lang: 'es',
      description: 'Diseño y animación',
      background_color: '#212121',
      theme_color: '#212121',
    },
    meta: {
      name: 'LUZ NEGRA - Diseño y animación',
      author: 'LUZ NEGRA',
      description: 'Diseño y animación',
    }
  },

  nuxtIcon: {
    size: '1em' // default <Icon> size applied
  },
})
