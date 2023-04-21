<script setup>
definePageMeta({
	layout: 'clean',
})
</script>

<template>
	<main>
		<div class="min-h-screen bg-no-repeat bg-center" style="background-image:url('/images/tubos_loop_ani.png'); background-size: 128px 128px;">
			<ClientOnly>
				<HeroOnOffOrtho />
			</ClientOnly>
		</div>
		<LazyPickedPortfolio />
		<LazyContact />
	</main>
</template>