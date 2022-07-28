import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  target: 'static',
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    private: {
      // CONTENT_KEY: process.env.CONTENT_KEY,
      SPACE_ID: process.env.SPACE_ID,
      ACCESS_TOKEN: process.env.ACCESS_TOKEN,
    },
    public: {
      DEFAULT_LANGUAGE: 'es-AR',
      HOST: process.env.NODE_ENV === 'production' ? 'https://luznegra-nuxt.vercel.app' : 'http://localhost:3000',// WARN cambiar al deploy final 
      APP_NAME: 'LuzNegra',
      APP_URL: 'https://luznegra-nuxt.vercel.app',
      SITE_TITLE: 'LuzNegra - Diseño y animación',
      SITE_TOP_DESCRIPTION: 'Diseño y animación',
      TEAM_NAME: 'LuzNegra',
      TEAM_WEBSITE_URL: 'https://luz-negra.com',
      TEAM_STATEMENT: 'Utilizamos diversas técnicas y apostamos a la experimentación. Logramos una resolución original para cada proyecto.',
      TEAM_LOGO_IMAGE_ON_FOOTER: '/images/tubos_loop_ani.png',
      TEAM_LOGO_BLACK: '/images/tuboluz.png',
      //GITHUB_ORGANIZATION_URL: 'https://github.com/longrun',
      //GA_ID: process.env.GA_ID,
      //GA_APP_NAME: 'LongRun Blog',
    },
  },
})
