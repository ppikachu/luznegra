<script setup>
/* Define props */
const props = defineProps({
	tags: { type: Array, required: true }
})
</script>

<template>
	<ul class="flex flex-wrap flex-row gap-2 uppercase whitespace-nowrap">
		<li v-for="tag in props.tags" class="tag badge bg-secondary-focus drop-shadow cursor-default">
			{{ $t(tag.id) }}
		</li>
	</ul>
</template>