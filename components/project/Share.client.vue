<script setup lang="ts">
import { isClient } from '@vueuse/shared'
/* Define props */
const props = defineProps({
	project: { type: Object, required: true },
})
const config = useRuntimeConfig()
const { copy, copied } = useClipboard()
const sound = useSound('/sounds/Click03.mp3')
const canShareData = () => navigator.canShare
const resultPara = ref(config.public.HOST + '/proyecto/' + props.project.slug)

const toast = useToast()

const options = {
  title: 'VueUse',
  text: 'Collection of essential Vue Composition Utilities!',
  url: isClient ? location.href : '',
}
const { share, isSupported } = useShare(options)

function copyLink() {
	sound.play()
	if (!useDevice().isMobile) {
		// si no permite compartir, copia el link 'ctrl/cmd c'
		copy(resultPara.value)
		console.log('copied', resultPara.value);
		
		toast.add({
			title: 'Copiado!',
			description: 'El enlace ha sido copiado al portapapeles',
			icon: 'line-md:confirm'
		})
	} else {
		//si el navegador permite 'compartir'
		return share().catch(err => err)
	}
}
</script>

<template>
	<!--si no permite compartir, copia el link 'ctrl/cmd c'-->
	<!-- <div :data-tip="copied ? $t('copied') : $t('link_copy')"> -->
			<UButton v-if="isSupported"
				:label="$t('link_compartir')"
				variant="soft"
				icon="mdi-share-variant"
				size="xs"
				class="w-fit"
				@click="copyLink"
			/>
	<!-- </div> -->
	<!--si el navegador permite 'compartir'-->
		<UButton v-else
			:label="$t('link_compartir')"
			variant="soft"
			icon="line-md:clipboard"
			size="xs"
			class="w-fit"
			@click="copyLink"
		/>
</template>