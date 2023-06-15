<script setup lang="ts">
/* Define props */
const props = defineProps({
	tags: { type: Array as PropType<Tag[]>, required: false }
})
</script>

<template>
	<ul class="flex flex-wrap flex-row gap-2 whitespace-nowrap">
		<li v-for="tag in props.tags" class="tag badge bg-secondary drop-shadow cursor-default">
			{{ $t(tag.id) }}
		</li>
	</ul>
</template>