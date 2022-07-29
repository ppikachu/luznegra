<script lang="ts" setup>
/* Define props */
interface Props { articleId: string }
const props = defineProps<Props>()

const { data, refresh } = await useAsyncData('entradas', async (nuxtApp) => {
  const { $contentfulClient } = nuxtApp
  return $contentfulClient.getEntries({
    content_type: 'entradas',
    'fields.slug[in]': props.articleId,
    limit: 1,
  })
})
const project = data
const articleBody = project.value.items[0].fields.content ? project.value.items[0].fields.content.content[0].content[0].value : ''
const articleTitle = project.value.items[0].fields.title
const articleVideos = project.value.items[0].fields.video
</script>

<template>
  <div class="container mx-auto px-4 md:px-8">
    <h1 class="text-3xl">{{ articleTitle }}</h1>
    <p class="my-4">{{ articleBody }}</p>
    <PortfolioVideos :videos="articleVideos" />
  </div>
</template>