<script setup>
/* Define props */
const props = defineProps({
  tags: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <ul class="space-x-2">
    <li v-for="tag in props.tags" class="badge badge-accent uppercase">{{ tag.sys.id }}</li>
  </ul>
</template>