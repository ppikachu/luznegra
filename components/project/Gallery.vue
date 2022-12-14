<script setup>
/* Define props */
const props = defineProps({ gallery: Array })
const imgGallery = props.gallery.items
</script>

<template>
  <!--gallery component-->
  <section v-if="imgGallery.length>0">
    <!--gallery ON-->
    <aside class="carousel mt-8 items-center rounded-lg">
      <div v-for="(img, i) in imgGallery" class="carousel-item w-full h-fit justify-center">
        <img
          :id="i"
          :src="img.url"
          :width="img.width"
          :height="img.height"
        />
      </div>
    </aside>
    <div class="flex justify-center py-2 btn-group">
      <a v-for="(img, i) in imgGallery" :href="`#${i}`" class="btn btn-sm text-xs">{{ img.title }}</a>
    </div>
  </section>
</template>