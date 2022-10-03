<script setup lang="ts">
/* Define props */
interface Props{ name: String }
const props = defineProps<Props>()
const nuxtApp = useNuxtApp()

const teamName = computed(() => {
  return props.name ==='ines' ? 'Inés Trigub' : 'Santiago Toyos'
})

const teamProfile = computed(() => {
  return props.name ==='ines' ? nuxtApp.$i18n.t('info_ine') : nuxtApp.$i18n.t('info_santi')
})

const teamAvatar = computed(() => {
  return props.name ==='ines' ? '/images/ine.jpg' : '/images/santi.jpg'
})
</script>
<template>
  <div class="modal-box gradient-bold rounded-none md:rounded-3xl relative max-w-2xl mx-3 md:mx-8">
  <label for="modal-proyecto" @click="$emit('closeMe')" class="btn btn-primary btn-sm btn-circle absolute z-10 left-2 top-2">
    <Icon name="mdi:close-thick" />
  </label>
  <div class="flex flex-col md:flex-row md:space-x-4 mt-8">
    <div class="avatar">
      <div class="w-32 h-32 rounded">
        <img :src="teamAvatar" />
      </div>
    </div>
    <div class="mb-4 prose" id="content" >
      <h2 class="text-primary my-4 md:mt-0">{{ teamName }}</h2>
      <p>{{ teamProfile }}</p>
    </div>
  </div>
</div>
</template>