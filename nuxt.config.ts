import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    SPACE_ID: process.env.SPACE_ID,
    ACCESS_TOKEN: process.env.ACCESS_TOKEN,
  },
})
