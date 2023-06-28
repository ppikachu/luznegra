<script lang="ts" setup>
	const config = useRuntimeConfig()
	useSeoMeta({
		//title: 'Home',
		description: config.public.siteDescription,
		ogImage: config.public.OG,
		ogUrl: config.public.siteUrl,
		twitterTitle: config.public.siteName,
		twitterDescription: config.public.siteDescription,
		twitterImage: config.public.OG, //summary_large_image
		twitterCard: 'summary_large_image'
	})
	useHead({
	htmlAttrs: {
		lang: 'es'
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
		<SeoKit />
		<!--<SchemaOrgWebSite name="LUZ NEGRA - Diseño y animación" />
		<OgImageStatic />-->
		<NuxtPage />
	</NuxtLayout>
</template>