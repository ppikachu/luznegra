<script setup>
/* Define props */
const props = defineProps({
  tags: {
    type: Array,
    required: true,
  },
})

/*const { data } = await useAsyncData('tags', async (nuxtApp) => {
  const { $contentfulClient } = nuxtApp
  return $contentfulClient.getTag()
})*/
</script>

<template>
  <ul class="space-x-2 uppercase font-semibold">
    <li v-for="tag in props.tags" class="badge badge-sm drop-shadow-sm">{{ tag.sys.id }}</li>
  </ul>
</template>