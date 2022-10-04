<script setup>
const nuxtApp = useNuxtApp()
const availableLocales = computed(() => {
  return nuxtApp.$i18n.locales.filter(i => i.code !== nuxtApp.$i18n.locale)
})
</script>

<template>
  <a
    v-for="locale in availableLocales"
    :key="locale.code"
    :href="switchLocalePath(locale.code)"
    class="btn btn-outline btn-sm md:btn-md"
  >
  {{ $t('cambiar_idioma') }}: {{ locale.name }}
  </a>
</template>