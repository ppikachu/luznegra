<script setup>
import upperFirst from 'lodash.upperfirst'
import startCase from 'lodash.startcase'
/* Define props */
const props = defineProps({
  tags: {
    type: Array,
    required: true,
  },
})

function categoryTitle(tagId) {
  return tagId && tagId !== '__hide__' ? upperFirst(startCase(tagId)) : null
}
</script>

<template>
  <ul class="flex flex-wrap justify-center flex-col lg:flex-col xl:flex-row gap-2 uppercase whitespace-nowrap">
    <li v-for="tag in props.tags" class="tag badge badge-sm bg-secondary-focus drop-shadow font-tag0">{{ tag.id }}</li>
  </ul>
</template>