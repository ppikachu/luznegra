<script lang="ts" setup>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
/* Define props */
interface Props { articleId: string }
const props = defineProps<Props>()
/* Get contentful data */
const config = useRuntimeConfig()

const { data } = await useAsyncData('entradas', async (nuxtApp) => {
  const { $contentfulClient }:any = nuxtApp
  return await $contentfulClient.getEntries({
    content_type: 'entradas',
    'fields.slug[in]': props.articleId,
    limit: 1,
  })
})
if (!data) {
  console.log('No data')
  
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

/* Define article data */
const project           = data
const imgGallery        = project.value.items[0].fields.imgGallery
const articleVideos     = project.value.items[0].fields.video
const articleTitle      = project.value.items[0].fields.title
const articleTags       = project.value.items[0].metadata.tags
const articleBody       = project.value.items[0].fields.content ? documentToHtmlString(project.value.items[0].fields.content) : ''
const articleContenido  = project.value.items[0].fields.contenido ? project.value.items[0].fields.contenido : ''
</script>

<template>
  <div class="container mx-auto px-4 md:px-8 pb-16">
    <ProjectVideos :videos="articleVideos" />
    <ProjectGallery :gallery="imgGallery" />
    <div class="flex md:flex-row space-x-4 lg:justify-between items-center my-8 max-w-4xl mx-auto">
      <h1 class="text-4xl">{{ articleTitle }}</h1>
      <ProjectMeta :tags="articleTags" />
    </div>
    <div class="prose my-4 max-w-4xl mx-auto">
      <div class="mb-4" id="content" v-html="articleBody"></div>
    </div>
    <div v-if="articleContenido" v-html="articleContenido" class="rounded-lg aspect-video w-full"></div>
  </div>
</template>