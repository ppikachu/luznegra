<script setup lang="ts">

/* Define props */
const props = defineProps({
	project: { type: Object, required: true },
})
const config = useRuntimeConfig()
const { copy, copied } = useClipboard()
const sound = useSound('/sounds/Click03.mp3')
const canShareData = navigator.canShare
const resultPara = ref(config.public.HOST + '/proyecto/' + props.project.slug)

async function copyLink() {
	sound.play()
	if (!useDevice().isMobile) {
		// si no permite compartir, copia el link 'ctrl/cmd c'
		copy(resultPara.value)
	} else {
		//si el navegador permite 'compartir'
		try {
			const shareData = {
				text: props.project.title,
				url: resultPara.value,
			}
			await navigator.share(shareData);
		} catch (err) {
			resultPara.value = `Error: ${err}`
		}
	}
}
</script>

<template>
	<div class="pb-16 md:pb-0">
		<!--si no permite compartir, copia el link 'ctrl/cmd c'-->
		<div v-if="!$device.isMobile" class="tooltip tooltip-primary" :data-tip="copied ? $t('copied') : $t('link_copy')">
			<button @click="copyLink" class="btn btn-xs btn-secondary flex">
				
				<svg class="flex-shrink inline" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
					 <path fill="currentColor" d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2m-7 0a1 1 0 0 1 1 1a1 1 0 0 1-1 1a1 1 0 0 1-1-1a1 1 0 0 1 1-1M7 7h10V5h2v14H5V5h2z"/>
				</svg>
				<span class="font-normal">{{ $t('link_compartir') }}</span>
			</button>
		</div>
		<!--si el navegador permite 'compartir'-->
		<button v-else @click="copyLink" class="btn btn-xs btn-secondary flex">
			<svg class="flex-shrink inline" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
				<path fill="currentColor" d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81a3 3 0 0 0 3-3a3 3 0 0 0-3-3a3 3 0 0 0-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.15c-.05.21-.08.43-.08.66c0 1.61 1.31 2.91 2.92 2.91s2.92-1.3 2.92-2.91A2.92 2.92 0 0 0 18 16.08"/>
			</svg>
			<span class="font-normal">{{ $t('link_compartir') }}</span>
		</button>
	</div>
</template>