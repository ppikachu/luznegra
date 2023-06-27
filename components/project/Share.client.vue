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
	if (!navigator.canShare) {
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
		<div v-if="!canShareData" class="tooltip tooltip-primary" :data-tip="copied ? $t('copied') : $t('link_copy')">
			<button @click="copyLink" class="btn btn-xs btn-secondary flex">
				<IconCSS name="mdi:clipboard-outline" class="flex-shrink" size="14" />
				<span class="font-normal">{{ $t('link_compartir') }}</span>
			</button>
		</div>
		<!--si el navegador permite 'compartir'-->
		<button v-else @click="copyLink" class="btn btn-xs btn-secondary flex">
			<IconCSS name="mdi:share-variant" size="14" />
			<span class="font-normal">{{ $t('link_compartir') }}</span>
		</button>
	</div>
</template>