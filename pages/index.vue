<script setup>
definePageMeta({
	layout: 'clean',
})
</script>

<template>
	<main>
		<!--WARN hardcoded hero background-color check (HeroOnOffOrtho:~77)-->
		<div
			class="min-h-screen"
		>
			<HeroOnOffOrtho />
		</div>
		<LazyPickedPortfolio />
		<LazyContact />
	</main>
</template>