<script setup>
/* Define props */
const props = defineProps({
	initTag: { type: String, default: '' },
	items: { type: Array, default: '' }
})

const getUniqueTagsFromItems = (items) => {
	const uniqueTags = {}
	items.forEach((item) => {
		item.contentfulMetadata.tags.forEach(tag => {
			uniqueTags[tag.id] = tag
		})
	})
	return Object.values(uniqueTags)
}

const uniqueTags = getUniqueTagsFromItems(props.items)
//console.table(uniqueTags)

const currentTag = ref(props.initTag)
const emit = defineEmits(['tag'])

function buttonClick(tag) {
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
	<section id="tags" class="pb-8 flex flex-col items-center">
		<div class="btn-group btn-group-vertical md:btn-group-horizontal">
			<button
				v-for="(tag, i) in uniqueTags"
				:key="i"
				@click="buttonClick(tag)"
				class="btn btn-sm lg:btn-md"
				:class="{ 'btn-active': tag.id == currentTag }"
			>
				<!-- como contentful no permite idiomas en tags uso i18n: -->
				{{ $t(tag.id) }}
			</button>
		</div>
	</section>
</template>