<script lang="ts" setup>
/**
 * Define props
 */

interface Props {
  tags: object[]
}

// TODO
const props = defineProps({
  tags: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <aside class="space-x-2">
    <div v-for="tag in props.tags" class="badge badge-info">{{ tag.sys.id }}</div>
  </aside>
</template>