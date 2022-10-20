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
    class="text-xs absolute right-0 p-4"
  >
    {{ $t('cambiar_idioma') }} {{ locale.name }}
  </a>
</template>