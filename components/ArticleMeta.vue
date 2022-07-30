<script lang="ts" setup>
/**
 * Define props
*/
interface Props {
  tags: object[]
}
const props = defineProps({
  tags: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <aside class="space-x-2">
    <div v-for="tag in props.tags" class="badge badge-accent">{{ tag.sys.id }}</div>
  </aside>
</template>