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
/* Define article data */
const project = data
const articleBody = project.value.items[0].fields.content ? documentToHtmlString(project.value.items[0].fields.content) : ''
const articleTitle = project.value.items[0].fields.title
const articleVideos = project.value.items[0].fields.video
const img = project.value.items[0].fields.imageFeatured ? project.value.items[0].fields.imageFeatured.fields.file.url : '/images/no-image.png'
const articleTags = project.value.items[0].metadata.tags
//const createdAt = new Date(project.value.items[0].sys.createdAt)
const imgGallery = project.value.items[0].fields.imgGallery
</script>

<template>
  <div class="container mx-auto px-4 md:px-8 pb-16">
    <!--<figure><img :src="`${img}?fm=webp`" :alt="articleTitle" class="max-w-full border-round" /></figure>-->
    <PortfolioVideos :videos="articleVideos" />
    <PortfolioGallery :gallery="imgGallery" />
    <h1 class="text-5xl my-4">{{ articleTitle }}</h1>
    <div class="my-4" id="content" v-html="articleBody"></div>
    <ArticleMeta :tags="articleTags" />
  </div>
</template>