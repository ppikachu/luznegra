<script setup lang="ts">
/* Define props */
interface Props { name: string }
const props = defineProps<Props>()
//oculta scroll al visualizar proyecto:
const el = ref<HTMLElement | null>(null)
onMounted(() => { el.value = document.body })
//Traducciones:
const nuxtApp = useNuxtApp()
const teamAvatar = computed(() => { return props.name === 'ines' ? '/images/ine.jpg' : '/images/santi.jpg' })
const teamName = computed(() => { return props.name === 'ines' ? 'Inés Trigub' : 'Santiago Toyos' })
const teamProfile = computed(() => { return props.name === 'ines' ? nuxtApp.$i18n.t('info_ine') : nuxtApp.$i18n.t('info_santi')})
</script>
<template>
	<CloseButton @close-me="$emit('closeMe')" />
		<div class="inner modal-box bg-base-300 rounded-3xl p-0 relative max-w-2xl mx-3 md:mx-8">
			<div class="gradient-bold p-1">
				<div class="z-10 h-full flex flex-col md:flex-row md:space-x-4">
					<div class="flex-shrink-0 bg-base-100 p-8 md:p-12 flex flex-col items-center space-y-4">
						<div class="avatar">
							<div class="w-28 h-28 md:w-32 md:h-32 rounded-full ring-4 ring-base-100">
								<NuxtImg :src="teamAvatar" :alt="teamName" width="128" height="128" />
							</div>
						</div>
						<h1 class="text-primary text-2xl">{{ teamName }}</h1>
					</div>
					<div class="prose p-4 md:p-8 -mt-4">
						<p v-html="teamProfile"></p>
					</div>
				</div>
			</div>
		</div>
</template>