<template>
  <div class="absolute bg-zinc-900 h-full w-full flex items-center justify-center p-4">
    <div class="max-w-lg text-center flex flex-col items-center">
      <h1 v-if="error.statusCode === 404" class="my-4 text-6xl tracking-tighter text-primary">404</h1>
      <h1 v-else class="my-4 text-6xl tracking-tighter">💣 <span class="text-primary">PUM!</span></h1>
      <code class="my-2 text-gray-500">{{ error.statusCode }}: {{ error.message }}</code>
      <img src="/images/ET_en_nave_transparente.gif" class="my-8 rounded max-w-sm" alt="404" width="540" height="540" />
      <button class="btn btn-error" @click="handleError">Mmmm. Volver al inicio</button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  error: Object
})

const handleError = () => clearError({ redirect: '/' })
</script>