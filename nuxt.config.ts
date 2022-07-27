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
    }
  },
})
