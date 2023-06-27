<script setup lang="ts">
/* Define props */
const props = defineProps({
	initTag: { type: String, default: '' },
	items: { type: Array, default: () => [] }
})

const getUniqueTagsFromItems = (items:any) => {
	const uniqueTags: Record<string, any> = {}
	items.forEach((item:any) => {
		if (item.contentfulMetadata && item.contentfulMetadata.tags) {
			item.contentfulMetadata.tags.forEach((tag:any) => {
				uniqueTags[tag.id] = tag
			})
		}
	})
	return Object.values(uniqueTags)
}

const uniqueTags = getUniqueTagsFromItems(props.items)
//console.table(uniqueTags)

const currentTag = ref(props.initTag)
const emit = defineEmits(['tag'])

const sound = useSound('/sounds/Click03.mp3')
function buttonClick(tag:any) {
	sound.play()
	if (tag.id===currentTag.value) {
		currentTag.value = ''
		emit('tag', '')
		return
	}
	emit('tag', tag)
	currentTag.value = tag.id
}
</script>

<template>
	<section id="tags" class="md:join md:join-horizontal pb-8 md:pb-12 w-full flex flex-wrap md:flex-nowrap justify-center gap-2 md:gap-0">
		<button
			v-for="(tag, i) in uniqueTags"
			:key="i"
			@click="buttonClick(tag)"
			class="md:btn badge badge-neutral badge-lg join-item"
			:class="{ 'badge-primary md:btn-primary': tag.id == currentTag }"
		>
			<!-- como contentful no permite idiomas en tags uso i18n: -->
			{{ $t(tag.id) }}
		</button>
	</section>
</template>