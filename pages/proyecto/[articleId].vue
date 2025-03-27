<script lang="ts" setup>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

/* Get contentful data */
const route = useRoute();
const articleId: string = Array.isArray(route.params.articleId) && route.params.articleId.length > 0 
  ? route.params.articleId[0] 
  : (route.params.articleId as string || '');
const { data, error } = await useAsyncGql('proyecto', { slug: articleId })

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
		<ProjectBody :project="proyecto"/>
	</div>
</template>