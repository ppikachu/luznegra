<script setup>
/* Define props */
const props = defineProps({ gallery: Array })
</script>

<template>
  <aside v-if="props.gallery" class="space-y-2 my-4">
      <div v-for="(img, i) in props.gallery">
        <figure class="max-w-full">
          <img :src="img.fields.file.url" class="max-w-full border-round" />
        </figure>
      </div>
  </aside>
</template>