<script setup>
/* Define props */
const props = defineProps({ gallery: Array })
console.log(props.gallery)
</script>

<template>
  <!--gallery component-->
  <section v-if="props.gallery">
    <aside class="carousel mt-8 items-center rounded-lg">
      <div v-for="(img, i) in props.gallery" class="carousel-item w-full h-fit justify-center">
        <img
          :id="i"
          :src="img.fields.file.url"
          :width="img.fields.file.details.image.width"
          :height="img.fields.file.details.image.height"
        />
      </div>
    </aside>
    <div class="flex justify-center py-2 btn-group">
      <a v-for="(img, i) in props.gallery" :href="`#${i}`" class="btn btn-sm text-xs">{{ img.fields.title }}</a>
    </div>
  </section>
</template>