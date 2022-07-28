<script lang="ts" setup>
/**
 * Define props
 */

interface Props {
  videos: object[]
}

// TODO
const props = defineProps({
  videos: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <aside class="flex flex-col space-y-2">
    <div v-for="video in props.videos" class="badge badge-sm badge-primary">{{ video }}</div>
  </aside>
</template>