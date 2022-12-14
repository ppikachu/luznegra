<script setup>
/* Define props */
const props = defineProps({
  tags: { type: Array, required: true }
})
</script>

<template>
  <ul class="flex flex-wrap justify-center flex-col lg:flex-col xl:flex-row gap-2 uppercase whitespace-nowrap">
    <li v-for="tag in props.tags" class="tag badge badge-sm bg-secondary-focus drop-shadow font-tag0">
      {{ $t(tag.id) }}
    </li>
  </ul>
</template>