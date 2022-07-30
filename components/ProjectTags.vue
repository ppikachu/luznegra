<script setup>
const { data } = await useAsyncData('tags', async (nuxtApp) => {
  const { $contentfulClient } = nuxtApp
  return $contentfulClient.getTags()
})
</script>

<template>
  <section id="tags" class="pb-8 flex flex-col">
    <div class="">categorías:</div>
    <div class="btn-group">
      <button v-for="tag in data.items" :key="tag" @click="$emit('tag', tag)" class="btn btn-xs">
        {{ tag.name }}
      </button>
    </div>
  </section>
</template>