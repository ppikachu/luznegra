<script setup lang="ts">
import { url } from 'inspector'

/* Define props */
const props = defineProps({
	project: { type: Object, required: true },
})
const config = useRuntimeConfig()
const { copy, copied } = useClipboard()
const sound = useSound('/sounds/Click03.mp3')
const canShareData = navigator.canShare
const resultPara = ref(config.HOST + '/proyecto/' + props.project.slug)

async function copyLink() {
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
			sound.play()
		} catch (err) {
			resultPara.value = `Error: ${err}`
		}
	}
}
</script>

<template>
	<div class="pt-4 md:pt-0">
		<!--si no permite compartir, copia el link 'ctrl/cmd c'-->
		<div v-if="!canShareData">
			<div class="tooltip tooltip-primary" :data-tip="copied ? $t('copied') : $t('link_copy')">
				<button @click="copyLink" class="btn btn-sm btn-secondary space-x-2">
					<IconCSS name="mdi:clipboard-outline" /><span>{{ $t('link_compartir') }}</span>
				</button>
			</div>
		</div>
		<!--si el navegador permite 'compartir'-->
		<div v-else class="text-xs text-zinc-400">
			<button @click="copyLink" class="btn btn-sm btn-secondary space-x-2">
				<IconCSS name="mdi:clipboard-outline" /><span>{{ $t('link_compartir') }}</span>
			</button>
		</div>
	</div>
</template>