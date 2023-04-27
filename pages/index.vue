<script setup>
definePageMeta({
	layout: 'clean',
})
</script>

<template>
	<main>
		<!--WARN hardcoded hero background-color check (HeroOnOffOrtho:~77)-->
		<div
			class="min-h-screen bg-no-repeat bg-center"
			style="background-color: #85070d; background-image:url('/images/tubos_loop_ani.png'); background-size: 128px 128px;"
		>
			<ClientOnly>
				<HeroOnOffOrtho />
			</ClientOnly>
		</div>
		<LazyPickedPortfolio />
		<LazyContact />
	</main>
</template>