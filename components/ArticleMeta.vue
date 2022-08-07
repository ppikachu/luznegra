<script setup>
import upperFirst from 'lodash.upperfirst'
import camelCase from 'lodash.camelcase'
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
  <ul class="grid grid-flow-col md:grid-flow-row lg:grid-flow-col gap-2 uppercase font-semibold">
    <li v-for="tag in props.tags" class="badge badge-primary drop-shadow-sm">{{ categoryTitle(tag.sys.id) }}</li>
  </ul>
</template>