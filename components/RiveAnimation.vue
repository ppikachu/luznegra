<script setup lang="ts">
import { Rive } from '@rive-app/canvas'

/* Define props */
const props = defineProps({ src: String })
let foo:any = null
onMounted(() => {
	//Rive animations
	const canvas = document.getElementById("canvas") as HTMLCanvasElement
	foo = new Rive({
		src: props.src,
		canvas,
		autoplay: true,
		onLoad: () => {
			foo.resizeDrawingSurfaceToCanvas()
		},
	})
})
</script>

<template>
	<canvas id="canvas" width="500" height="500"></canvas>
</template>