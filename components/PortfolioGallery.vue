<script setup>
/* Define props */
const props = defineProps({ gallery: Array })
</script>

<template>
  <aside v-if="props.gallery" class="carousel mt-8 items-center">
    <div v-for="(img, i) in props.gallery" class="carousel-item w-full h-fit justify-center">
      <img :id="i" :src="img.fields.file.url" class="rounded-box" />
    </div>
  </aside>
  <div class="justify-center py-2 btn-group">
    <a v-for="(img, i) in props.gallery" :href="`#${i}`" class="btn">{{ img.fields.title }}</a> 
  </div>
</template>