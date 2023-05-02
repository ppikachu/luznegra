<script setup lang="ts">
/* Define props */
interface Tag {
  id: string
  name: string
}
const props = defineProps({
	tags: { type: Array as PropType<Tag[]>, required: true }
})
</script>

<template>
	<ul class="flex flex-wrap flex-row gap-2 uppercase whitespace-nowrap">
		<li v-for="tag in props.tags" class="tag badge bg-secondary drop-shadow cursor-default">
			{{ $t(tag.id) }}
		</li>
	</ul>
</template>