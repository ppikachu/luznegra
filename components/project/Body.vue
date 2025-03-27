<script lang="ts" setup>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
const props = defineProps({ project: { type: Object, required: true } })
const articleTitle        = props.project?.title
const articleTags:any     = props.project?.contentfulMetadata?.tags ?? []
const articleBody:string  = props.project?.content ? documentToHtmlString(props.project.content.json) : ''
</script>

<template>
	<h1 class="text-3xl text-(--ui-primary) mb-4">{{ articleTitle }}</h1>
	<div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 md:justify-between md:items-end">
		<div id="content" v-html="articleBody" class="prose prose-invert prose-a:text-(--ui-primary) flex-grow"></div>
		<ProjectMeta :tags="articleTags" />
		<ProjectShare :project="project" />
	</div>
</template>