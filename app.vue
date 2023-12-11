<script lang="ts" setup>
	const config = useRuntimeConfig()
	useSeoMeta({
		title: config.public.siteName,
		ogTitle: config.public.siteName,
		ogDescription: config.public.siteDescription,
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
		<NuxtPage />
	</NuxtLayout>
</template>