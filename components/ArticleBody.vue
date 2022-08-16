<script lang="ts" setup>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
/* Define props */
interface Props { articleId: string }
const props = defineProps<Props>()
/* Get contentful data */
const { data } = await useAsyncData('entradas', async (nuxtApp) => {
  const { $contentfulClient } = nuxtApp
  return $contentfulClient.getEntries({
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
const project = data
const articleBody = project.value.items[0].fields.content ? documentToHtmlString(project.value.items[0].fields.content) : ''
const articleTitle = project.value.items[0].fields.title
const articleVideos = project.value.items[0].fields.video
const img = project.value.items[0].fields.imageFeatured ? project.value.items[0].fields.imageFeatured.fields.file.url : '/images/no-image.png'
const articleTags = project.value.items[0].metadata.tags
//const createdAt = new Date(project.value.items[0].sys.createdAt)
const imgGallery = project.value.items[0].fields.imgGallery
const articleContenido = project.value.items[0].fields.contenido ? project.value.items[0].fields.contenido : ''
</script>

<template>
  <div class="container mx-auto px-4 md:px-8 pb-16">
    <PortfolioVideos :videos="articleVideos" />
    <PortfolioGallery :gallery="imgGallery" />
    <div class="flex md:flex-row space-x-4 lg:justify-between items-center my-8">
      <h1 class="text-4xl">{{ articleTitle }}</h1>
      <ArticleMeta :tags="articleTags" />
    </div>
    <div class="prose my-4">
      <div class="mb-4" id="content" v-html="articleBody"></div>
    </div>
    <div v-if="articleContenido" v-html="articleContenido" class="rounded-lg aspect-video w-full"></div>
  </div>
</template>