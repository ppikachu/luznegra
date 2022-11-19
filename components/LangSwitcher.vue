<script setup>
const { locale, locales, setLocale } = useI18n()
const nuxtApp = useNuxtApp()
const availableLocales = computed(() => {
  return (locales.value).filter(i => i.code !== locale.value)
})
</script>

<template>
  <a
    href="#"
    v-for="locale in availableLocales"
    :key="locale.code"
    @click.prevent.stop="setLocale(locale.code)"
    class="text-xs absolute right-0 p-4"
  >
    {{ $t('cambiar_idioma') }} {{ locale.name }}
  </a>
</template>