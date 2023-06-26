<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

const availableLocales = computed(() => {
	return locales.value.filter((i: { code: any }) => i.code !== locale.value)
})
</script>

<template>
	<a
		href="#"
		v-for="locale in availableLocales"
		:key="locale.code"
		@click.stop.prevent="setLocale(locale.code)"
		class="text-xs absolute right-0 p-4"
	>
		{{ $t('cambiar_idioma') }} {{ locale.name }}
	</a>
</template>