<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()

interface Locale {
	code: string
	name: string
}

const availableLocales = computed<Locale[]>((): Locale[] => {
	return locales.value.filter((i: Locale) => i.code !== locale.value)
})
</script>

<template>
	<a
		href="#"
		v-for="locale in availableLocales"
		:key="locale.code"
		@click.stop.prevent="setLocale(locale.code)"
		class="text-xs py-4"
	>
		{{ $t('cambiar_idioma') }} {{ locale.name }}
	</a>
</template>