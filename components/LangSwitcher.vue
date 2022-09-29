<script setup>
const nuxtApp = useNuxtApp()
const availableLocales = computed(() => {
  return nuxtApp.$i18n.locales.filter(i => i.code !== nuxtApp.$i18n.locale)
})
</script>

<template>
  <div class="fixed right-0 z-50 p-6">
    <nuxt-link
      v-for="locale in availableLocales"
      :key="locale.code"
      :to="switchLocalePath(locale.code)"
      class="btn btn-primary btn-xs"
    >
      {{ locale.name }}
    </nuxt-link>
  </div>
</template>