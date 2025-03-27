<script lang="ts" setup>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
/* Define props */
interface Props { articleSlug:any }
const props = defineProps<Props>()

/* Get contentful data */
const { data, error } = await useAsyncGql('proyecto', { slug: props.articleSlug })

/* Define article data */
interface Proyecto {
  imgGalleryCollection?: {
	items?: Array<{
	  title?: string | null;
	  url?: string | null;
	  width?: number | null;
	  height?: number | null;
	} | null> | null;
  } | null;
  video?: (string | null)[] | null;
  title?: string | null;
  content?: {
	json: any;
  } | null;
  contentfulMetadata?: {
	tags: any;
  };
}

const proyecto: Proyecto = data.value?.entradasCollection?.items[0] || {
  imgGalleryCollection: null,
  video: null,
  title: null,
  content: undefined,
  contentfulMetadata: {
    tags: []
  }
}

const projectMedia        = { 
  'videos': (proyecto?.video ?? []).filter((video: string | null): video is string => video !== null), 
  'gallery': proyecto?.imgGalleryCollection?.items?.map(item => ({
	title: item?.title ?? '',
	url: item?.url ?? '',
	width: item?.width ?? 0,
	height: item?.height ?? 0
  })) ?? []
}
const articleTitle        = proyecto?.title
const articleTags:any     = proyecto?.contentfulMetadata?.tags ?? []
const articleBody:string  = proyecto?.content ? documentToHtmlString(proyecto.content.json) : ''
</script>

<template>
	<div class="container max-w-4xl mx-auto px-4 pb-16">
		<ProjectMedia :project="projectMedia" />
		<h1 class="text-3xl text-(--ui-primary) mb-4 mt-8">{{ articleTitle }}</h1>
							
		<div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 md:justify-between md:items-end">
			<div
				v-html="articleBody"
				id="content"
				class="prose prose-invert prose-a:text-(--ui-primary) flex-grow"
			></div>
			<ProjectMeta :tags="articleTags" />
			<ProjectShare :project="proyecto" />
		</div>
	</div>
</template>