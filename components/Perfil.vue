<script setup lang="ts">
/* Define props */
interface Props{ name: String }
const props = defineProps<Props>()

const nuxtApp = useNuxtApp()
const runtimeConfig = useRuntimeConfig()

const teamName = computed(() => {
  return props.name ==='ines' ? 'Inés Trigub' : 'Santiago Toyos'
})

const networkUrl = computed(() => {
  return props.name ==='ines' ? runtimeConfig.public.twitterUrlI : runtimeConfig.public.twitterUrlS
})

const teamProfile = computed(() => {
  return props.name ==='ines' ? nuxtApp.$i18n.t('info_ine') : nuxtApp.$i18n.t('info_santi')
})

const teamAvatar = computed(() => {
  return props.name ==='ines' ? '/images/ine.jpg' : '/images/santi.jpg'
})
</script>
<template>
  <div class="modal-box bg-base-300 p-1 gradient-bold rounded-none md:rounded-3xl relative max-w-2xl mx-3 md:mx-8">
  <label for="modal-proyecto" @click="$emit('closeMe')" class="btn btn-primary btn-sm btn-circle absolute z-10 left-4 top-4">
    <Icon name="mdi:close-thick" />
  </label>
  <div class="z-10 h-full flex flex-col md:flex-row md:space-x-4">
    <div class="flex-shrink-0 bg-base-100 p-12 flex flex-col items-center space-y-4">
      <div class="avatar">
        <div class="w-32 h-32 rounded-full ring-4 ring-base-100">
          <img :src="teamAvatar" :alt="teamName" width="128" height="128" />
        </div>
      </div>
      <h1 class="text-primary text-2xl">{{ teamName }}</h1>
      <!--<div id="redes-sociales" class="flex space-x-4 text-2xl">
        <a :href="networkUrl">
          <Icon name="mdi:twitter" />
        </a>
        <Icon name="carbon:logo-instagram" />
      </div>-->
    </div>
    <div class="prose p-8">
      <p v-html="teamProfile"></p>
    </div>
  </div>
</div>
</template>