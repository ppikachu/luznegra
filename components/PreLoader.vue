<script setup lang="ts">
/* Define props */
const props = defineProps({
	loading: {
		type: Boolean,
		default: false
	},
})
const { isMobile } = useDevice()
</script>

<template>
	<Transition>
		<div
			v-show="!props.loading"
			id="fader"
			class="absolute z-30 top-0 w-full h-screen flex flex-col justify-center items-center"
			style="background-color: #85070d;"
		>
			<img src="/images/tubos_loop_ani.png" alt="loading..." class="w-32" width="256" height="256">
		</div>
	</Transition>
</template>

<style scoped>
.v-leave-active {
	transition: opacity 0.5s ease;
}
.v-enter-from,
.v-leave-to {
	opacity: 0;
}
</style>