<script setup lang="ts">
/* Define props */
interface Props{ name: String }
const props = defineProps<Props>()
const nuxtApp = useNuxtApp()
const lang = nuxtApp.$i18n.locale.destacados
</script>
<template>
  <div class="modal-box rounded-none md:rounded-3xl relative w-full max-w-5xl max-h-full">
  <label for="modal-proyecto" @click="$emit('closeMe')" class="btn btn-primary btn-sm btn-circle absolute left-2 top-2">
    <Icon name="mdi:close-thick" />
  </label>
  <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 lg:space-x-4 md:justify-between lg:items-center mt-4">
    <h1 class="text-4xl text-primary">{{ props.name }}</h1>
  </div>
  <div class="prose my-4">
    <div class="mb-4" id="content" >
      {{ lang }}
    </div>
  </div>
  <div class="modal-action">
    <p class="text-xs text-zinc-400">
      
    </p>
  </div>
</div>
</template>