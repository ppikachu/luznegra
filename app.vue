<script lang="ts" setup>
	const config = useRuntimeConfig()
	useSeoMeta({
		//title: 'Home',
		description: 'Diseño y animación',
		ogImage: config.public.OG,
		ogUrl: config.public.HOST,
		twitterTitle: config.public.TEAM_NAME,
		twitterDescription: 'Diseño y animación',
		twitterImage: config.public.OG, //summary_large_image
		twitterCard: 'summary_large_image'
	})
	useHead({
	htmlAttrs: {
		lang: 'es',
		class: 'scroll-smooth'
	},
	link: [
		{
			rel: 'icon',
			type: 'image/png',
			href: '/icon.png'
		}
	]
})
</script>

<template>
	<NuxtLayout>
		<!--<SchemaOrgWebSite name="LUZ NEGRA - Diseño y animación" />
		<OgImageStatic />-->
		<NuxtPage />
	</NuxtLayout>
</template>