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
  <div class="modal-box rounded-none md:rounded-3xl relative max-w-2xl">
  <label for="modal-proyecto" @click="$emit('closeMe')" class="btn btn-primary btn-sm btn-circle absolute left-2 top-2">
    <Icon name="mdi:close-thick" />
  </label>
  <div class="mt-8">
    <div class="mb-4" id="content" >
      <div class="avatar">
        <div class="w-20 rounded">
          <img :src="teamAvatar" />
        </div>
      </div>
      <h1 class="text-2xl text-primary">{{ teamName }}</h1>
      {{ teamProfile }}
    </div>
  </div>
</div>
</template>