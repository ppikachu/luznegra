<script lang="ts" setup>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
/* Define props */
interface Props { articleSlug:any }
const props = defineProps<Props>()

/* Get contentful data */
const { data } = await useAsyncGql('proyecto', { slug: props.articleSlug })

/* Define article data */
const project             = data.value?.entradasCollection?.items[0]
const imgGallery:any      = project?.imgGalleryCollection
const articleVideos:any   = project?.video
const articleTitle        = project?.title
const articleTags:any     = project?.contentfulMetadata.tags
const articleBody:string  = project?.content ? documentToHtmlString(project.content.json) : ''
</script>

<template>
	<div class="container mx-auto px-4 md:px-8 pb-16">
		<ProjectVideos :videos="articleVideos" />
		<ProjectGallery :gallery="imgGallery" />
		<div class="flex md:flex-row space-x-4 lg:justify-between items-center my-8 max-w-4xl mx-auto">
			<h1 class="text-4xl text-primary">{{ articleTitle }}</h1>
			<ProjectMeta :tags="articleTags" />
		</div>
		<div class="prose prose-a:text-primary my-4 max-w-4xl mx-auto">
			<div class="mb-4" id="content" v-html="articleBody"></div>
		</div>
	</div>
</template>