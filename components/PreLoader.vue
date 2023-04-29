<script setup lang="ts">
import isMobile from 'ismobilejs'

/* Define props */
const props = defineProps({
	loading: { type: Boolean, default: false },
})

const amIMobile = ref(isMobile().any)
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
			<p v-if="amIMobile===true" class="text-sm"><Icon name="icon-park-outline:hand-drag" class="text-2xl wave" /> {{ $t('drag_m_experiment') }}</p>
			<p v-else-if="amIMobile===false" class="text-sm"><Icon name="material-symbols:mouse" class="text-4xl wave" /> {{ $t('drag_d_experiment') }}</p>
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