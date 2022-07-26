//import { defineNuxtConfig } from 'nuxt'
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  telemetry: false,
  ssr: false,
  //target: 'static',
  //typescript: {
  //  shim: false
  //},
  nitro: {
    preset: 'vercel-edge',
  },
  modules: [
    'nuxt-graphql-client',
    '@nuxtjs/tailwindcss',
    //'@nuxt/image-edge',
    '@nuxtjs/google-fonts',
    '@vueuse/nuxt',
    '@kevinmarrec/nuxt-pwa',
    'nuxt-icon',
    ['@nuxtjs/i18n',
      {
        locales: [
          { code: 'es',  iso: 'es',name: 'Español', file: 'es.json' },
          { code: 'en',  iso: 'en',name: 'English', file: 'en.json' },
        ],
        vueI18n: {
          fallbackLocale: 'es',
          messages: {
            en: {
              welcome: 'LUZ NEGRA is the Multimedia Studio that you were looking for.',
              nos1: 'We specialize in',
              nos2: 'creative communication',
              nos3: 'giving life to your ideas and producing the best image for your projects.',
              dir1a: 'LUZ NEGRA is directed by ',
              dir1b: '. Together with a team of experienced professionals, we produce',
              dir2: 'video, animation, motion graphics, graphic design and web design',
              dir3: 'combining traditional techniques and new technologies.',

              sin1: 'We look for the',
              sin2: 'synthesis',
              sin3: 'necessary to communicate your message in an',
              sin4: 'original',
              sin5: 'and',
              sin6: 'creative',
              sin7: 'way.',

              info_ine: '<p>Inés Trigub was born in Buenos Aires in 1974. She is an animator. She graduated in Cinema Studies at FUC in 1996, and studied Arts at Pridiliano Pueyrredón School and drawing with Roberto Paéz.</p><p>She has worked in the animation studios Videocolor, Bujos and Hook Up. As an animator, she has worked for the TV channels Ciudad Abierta and Encuentro. The publishing house Pequeño Editor has issued two of her books Fiesta de disfraces (Costume Party) (2007) and Autos (Cars) (2008).</p><p>Since 2005 she is co-director of the design and animation studio LUZ NEGRA.</p>',
              info_santi: '<p>Santiago Toyos was born in Buenos Aires in 1969. He is a graphic designer.</p><p>He lived in Bogotá, Colombia, while he was at secondary school, and he discovered there his vocation as he worked for the advertising agency Casares Grey & Asociados. In Argentina, he followed graphic design studies at Universidad de Palermo, and attended Pridiliano Pueyrredón School. He was part of Smartmedia, one of the first web design agencies in Argentina with clients such as Fiat Argentina, Iveco, Metropolitan trains and Edenor.</p><p>He is co-director of the design and animation studio LUZ NEGRA.</p>',

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
              vamos: "let's go!",
              drag_m_experiment: 'drag over the cinema!',
              drag_d_experiment: 'drag mouse over the cinema!',
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

              info_ine: '<p>Nació en Buenos Aires, en 1974. Es animadora. Estudió cine en la FUC, donde se graduó en 1996. Paralelamente cursó la carrera de Bellas Artes en la escuela Pridiliano Pueyrredón y estudió dibujo con Roberto Paéz</p><p>Trabajó en los estudios de animación de Videocolor, Bujos y Hook up, y como animadora en los canales Ciudad Abierta y Encuentro. Con el sello Pequeño Editor publicó dos libros Fiesta de disfraces (2007) y Autos (2008).</p><p>Desde 2005 es co-directora del estudio de diseño y animación Luz Negra.</p><p>Es egresada del Colegio Nacional de Buenos Aires.</p>',
              info_santi: '<p>Diseñador Gráfico con 20 años de experiencia en producción de contenido multimedia. Residió en Bogotá, Colombia durante el secundario. En Argentina cursó Diseño Gráfico en la Universidad de Palermo y 2 años de Bellas Artes en la escuela Pridiliano Pueyrredón.</p><p>Formó parte de Smartmedia, una de las primeras agencias de diseño web con clientes como Fiat Argentina, Iveco, Trenes Metropolitano y Edenor.</p><p>Es co-director de Luz Negra.</p>',

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
              vamos: 'vamos!',
              drag_m_experiment: 'arrastra el dedo sobre el autocine!',
              drag_d_experiment: 'arrastra el ratón sobre el autocine!',
            }
          }
        },
        //lazy: true,
        //langDir: 'lang/',//WARN: estos dos no funcionan
        //detectBrowserLanguage: true,
        defaultLocale: 'es',
      }
    ]
  ],
  runtimeConfig: {
    private: {
    },
    public: {
      CONTENT_KEY: process.env.CONTENT_KEY,
      SPACE_ID: process.env.SPACE_ID,
      ACCESS_TOKEN: process.env.ACCESS_TOKEN,
      DEFAULT_LANGUAGE: 'es-AR',
      HOST: process.env.NODE_ENV === 'production' ? 'https://luz-negra.com' : 'https://localhost:3000',
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
      twitterUrlI: '#',
      twitterUrlS: 'https://twitter.com/ppika',
      behanceI: '#',
      behanceS: '#'
    },
  },
  css: [
    // https://github.com/sampotts/plyr#options
    'vue-plyr/dist/vue-plyr.css',
  ],
  googleFonts: {
    families: {
      'Varela Round': true,
      //'Open Sans': true,
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
  'graphql-client': {
    clients: {
      default: {
        host: 'https://graphql.contentful.com/content/v1/spaces/jwdsialp51tb/',
        headers: {
          'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN,
        }
      }
    }
  }
})
