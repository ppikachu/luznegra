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
		<div class="flex md:flex-row space-x-4 lg:justify-between items-center my-8 max-w-4xl mx-auto">
			<h1 class="text-4xl text-(--ui-primary)">{{ articleTitle }}</h1>
			<ProjectMeta :tags="articleTags" />
		</div>
		<div class="prose prose-a:text-primary prose-invert my-4 max-w-4xl mx-auto">
			<div class="mb-4" id="content" v-html="articleBody"></div>
			<ProjectShare :project="proyecto" />
		</div>
	</div>
</template>