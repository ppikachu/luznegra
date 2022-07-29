<script setup>
const config = useRuntimeConfig()
useHead({
  titleTemplate: `${config.SITE_TITLE}`,
  htmlAttrs: {
    lang: 'es-AR',
  },
  meta: [
    { hid: 'description', name: 'description', content: config.public.SITE_TOP_DESCRIPTION },
    { hid: 'og:type', property: 'og:type', content: 'website' },
    { hid: 'og:title', property: 'og:title', content: config.public.SITE_TITLE },
    { hid: 'og:description', property: 'og:description', content: config.public.SITE_TOP_DESCRIPTION },
    { hid: 'og:url', property: 'og:url', content: `${config.public.HOST}` },
    {
      hid: 'og:image',
      property: 'og:image',
      content: `${config.public.HOST}${config.public.TEAM_LOGO_BLACK}`,
    },
    { hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
  ],
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>