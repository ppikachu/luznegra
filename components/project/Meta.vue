<script setup lang="ts">
interface Tag { id: string }
/* Define props */
const props = defineProps({
	tags: {
		type: Array as PropType<Tag[]>,
		required: false
	}
})
</script>

<template>
	<div class="flex flex-wrap flex-row gap-2 whitespace-nowrap h-fit">
		<UButtonGroup>
			<UBadge v-for="tag in props.tags"
				color="info"
				variant="outline"
			>
				{{ $t(tag.id) }}
			</UBadge>
		</UButtonGroup>
	</div>
</template>