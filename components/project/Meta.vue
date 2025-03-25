<script setup lang="ts">
/* Define props */
const props = defineProps({
	tags: { type: Array as PropType<Tag[]>, required: false }
})
</script>

<template>
	<div class="flex flex-wrap flex-row gap-2 whitespace-nowrap h-fit">
		<UButtonGroup>
			<UBadge v-for="tag in props.tags"
				color="info"
				variant="outline"
				class="uppercase"
			>
				{{ $t(tag.id) }}
			</UBadge>
		</UButtonGroup>
	</div>
</template>