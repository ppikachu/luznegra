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

//const categoryTitle = props.category && props.category !== '__hide__' ? upperFirst(camelCase(props.category)) : null
function categoryTitle(tagId) {
  //console.log(upperFirst(camelCase(tagId)))
  return tagId && tagId !== '__hide__' ? upperFirst(startCase(tagId)) : null
}

</script>

<template>
  <ul class="space-x-2 uppercase font-semibold">
    <li v-for="tag in props.tags" class="badge badge-sm badge-primary drop-shadow-sm">{{ categoryTitle(tag.sys.id) }}</li>
  </ul>
</template>