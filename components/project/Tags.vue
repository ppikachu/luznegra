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
	<section id="tags" class="pb-4 md:pb-8 flex flex-wrap justify-center space-x-2 w-full md:w-auto">
		<button
			v-for="(tag, i) in uniqueTags"
			:key="i"
			@click="buttonClick(tag)"
			class="badge btn-sm mb-2"
			:class="{ 'badge-primary': tag.id == currentTag }"
		>
			<!-- como contentful no permite idiomas en tags uso i18n: -->
			{{ $t(tag.id) }}
		</button>
	</section>
</template>