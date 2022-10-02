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
    ['@nuxtjs/i18n',
      {
        locales: [
          { code: 'es',  iso: 'es',name: 'Español', file: 'es.js' },
          { code: 'en',  iso: 'en',name: 'English', file: 'en.js' },
        ],
        vueI18n: {
          fallbackLocale: 'es',
          messages: {
            en: {
              welcome: 'LUZ NEGRA es el Estudio Multimedia que buscabas.',
              nos1: 'Nos especializamos en',
              nos2: 'comunicación creativa',
              nos3: 'dando vida a tus ideas y produciendo la mejor imagen para tus proyectos.',
              dir1a: 'LUZ NEGRA está dirigido por ',
              dir1b: '. Junto a un equipo de profesionales con amplia experiencia, producimos',
              dir2: 'Video, Animación, Motion Graphics, Diseño Gráfico y Diseño Web',
              dir3: 'combinando técnicas tradicionales con las nuevas tecnologías.',

              sin1: 'Buscamos la',
              sin2: 'síntesis',
              sin3: 'necesaria para comunicar de manera',
              sin4: 'original',
              sin5: 'y',
              sin6: 'efectiva',
              sin7: 'tu mensaje.',

              info_ine: 'Texto ine inglés',
              info_santi: 'Texto santi inglés',

              destacados: 'Highlighted',
              series: 'series',
              booktrailer: 'booktrailer',
              animacion: 'animation',
              motionGraphics: 'motion graphics',
              ilustracion: 'ilustration & design',
              link_compartir: 'share project link',

              escribinos: 'Contact us',
              mensaje: 'Message',
              tu_mensaje: 'Your message',
              enviar: 'send',

              cambiar_idioma: 'cambiar a',
              vamos: "let's go!"
            },
            es: {
              welcome: 'LUZ NEGRA es el Estudio Multimedia que buscabas.',
              nos1: 'Nos especializamos en',
              nos2: 'comunicación creativa',
              nos3: 'dando vida a tus ideas y produciendo la mejor imagen para tus proyectos.',
              dir1a: 'LUZ NEGRA está dirigido por ',
              dir1b: '. Junto a un equipo de profesionales con amplia experiencia, producimos',
              dir2: 'Video, Animación, Motion Graphics, Diseño Gráfico y Diseño Web',
              dir3: 'combinando técnicas tradicionales con las nuevas tecnologías.',

              sin1: 'Buscamos la',
              sin2: 'síntesis',
              sin3: 'necesaria para comunicar de manera',
              sin4: 'original',
              sin5: 'y',
              sin6: 'efectiva',
              sin7: 'tu mensaje.',

              info_ine: 'Texto ine español',
              info_santi: 'Texto santi español',

              destacados: 'Destacados',
              series: 'series',
              booktrailer: 'booktrailer',
              animacion: 'animación',
              motionGraphics: 'motion graphics',
              ilustracion: 'ilustración & diseño',
              link_compartir: 'link para compartir proyecto',

              escribinos: 'Escribínos',
              mensaje: 'Mensaje',
              tu_mensaje: 'Tu mensaje',
              enviar: 'enviar',
              
              cambiar_idioma: 'switch to',
              vamos: "vamos!"
            }
          }
        },
        detectBrowserLanguage: true,
        defaultLocale: 'en',
      }
    ]
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
      HOST: process.env.NODE_ENV === 'production' ? 'https://luz-negra.com' : 'http://localhost:3000',
      APP_NAME: 'LUZ NEGRA',
      APP_URL: 'https://luz-negra.com',
      SITE_TITLE: 'LUZ NEGRA - Diseño y animación',
      SITE_TOP_DESCRIPTION: 'Diseño y animación',
      TEAM_NAME: 'LUZ NEGRA',
      TEAM_WEBSITE_URL: 'https://luz-negra.com',
      TEAM_STATEMENT: 'Nos especializamos en comunicación creativa, dando vida a tus ideas y produciendo la mejor imagen para tus proyectos.',
      TEAM_LOGO_IMAGE_ON_FOOTER: '/images/tubos_loop_ani.png',
      TEAM_LOGO_BLACK: '/images/tubos_loader_a.png',
      OG_IMAGE: '/OG.png',
      //GITHUB_ORGANIZATION_URL: 'https://github.com/luznegra',
      //GA_ID: process.env.GA_ID,
      //GA_APP_NAME: 'LUZ NEGRA',
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
      ogHost: process.env.NODE_ENV === 'production' ? 'https://luz-negra.com' : 'http://localhost:3000',
      ogImage: '/OG.png',
      twitterCard: 'summary_large_image',
    }
  },
  nuxtIcon: {
    size: '1em' // default <Icon> size applied
  },
})
