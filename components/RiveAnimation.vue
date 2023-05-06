<script setup lang="ts">
import { Rive } from '@rive-app/canvas'

/* Define props */
const props = defineProps({
	src: { type: String, required: true },
	animation: { type: String, default: "start" },
})

/* Start when enters viewport */
const enter = ref()
const targetIsVisible = useElementVisibility(enter)

const now = computed(() => {
	return targetIsVisible.value.toString()
})

watchOnce(now, () => {
	console.log('play fired!!!');
	bumpTrigger.fire()
})

let bumpTrigger: any
onMounted(() => {
	//Rive animation
	const canvas = document.getElementById("canvas") as HTMLCanvasElement
	const foo = new Rive({
		src: props.src,
		canvas,
		autoplay: true,
		animations: props.animation,
		onLoad: () => {
			foo.resizeDrawingSurfaceToCanvas()
			// Get the inputs via the name of the state machine
			const inputs = foo.stateMachineInputs(props.animation)
			// Find the input you want to set a value for, or trigger
			bumpTrigger = inputs.find(i => i.name === 'play')
		},
	})
})
</script>

<template>
	<div class=" max-w-fit">
		<canvas id="canvas" width="500" height="500" class="w-full"></canvas>
		<div ref="enter" class="bottom-0 relative h-1"></div>
	</div>
</template>