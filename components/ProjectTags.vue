<script setup>
const { data } = await useAsyncData('tags', async (nuxtApp) => {
  const { $contentfulClient } = nuxtApp
  return $contentfulClient.getTags()
})
</script>

<template>
  <section id="tags" class="pb-8 flex flex-col items-center">
    <div class="btn-group">
      <button v-for="tag in data.items" :key="tag" @click="$emit('tag', tag)" class="btn btn-outline btn-sm">
        {{ tag.name }}
      </button>
    </div>
  </section>
</template>