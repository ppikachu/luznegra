<template>
  <div class="hero min-h-screen" style="background-image: url(/images/luznegrazilla.jpg);">
    <div class="hero-overlay bg-opacity-60"></div>
    <div class="hero-content text-center text-neutral-content">
      <div class="max-w-md">
        <h1 class="mb-5 text-5xl font-bold">{{ config.public.TEAM_NAME }}</h1>
        <p class="mb-5">{{ config.public.SITE_TOP_DESCRIPTION }}</p>
        <!--<button class="btn btn-primary">Get Started</button>-->
      </div>
    </div>
  </div>
  <div class="container mx-auto px-4 md:px-8 my-10 columns-2 md:columns-4 space-y-4">
    <div v-for="(post, i) in posts.items" class="card card-compact bg-base-300 shadow-xl">
      <figure v-if="post.fields.imageFeatured">
        <img
          :src="`${post.fields.imageFeatured.fields.file.url}?fm=webp&fit=fill&w=400&h=300`"
          :alt="post.fields.imageFeatured.fields.title"
          :loading="i > 0 ? 'lazy' : undefined"
          class="max-w-full border-round"
        />
      </figure>
      <figure v-else>
        <img
          src="/images/no-image2.png"
          alt="no hay imagen"
          class="max-w-full border-round"
        />
      </figure>
      
      <div class="card-body">
        <h2 class="card-title">{{ post.fields.title }}</h2>
        <p class="text-sm">{{ post.fields.excerpt }}</p>
        <p class="text-sm">{{ post.fields.contenido }}</p>
        <div class="card-actions">
          <ArticleMeta v-if="post.metadata.tags[0]" :tags="post.metadata.tags" />
          <PortfolioVideos v-if="post.fields.video" :videos="post.fields.video" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import ArticleMeta from "./components/ArticleMeta.vue";
import PortfolioVideos from "./components/PortfolioVideos.vue";
const config = useRuntimeConfig()
useHead({
  titleTemplate: `${config.SITE_TITLE}`,
  htmlAttrs: {
    lang: 'es-AR',
  },
  meta: [
    { hid: 'description', name: 'description', content: config.public.SITE_TOP_DESCRIPTION },
    { hid: 'og:type', property: 'og:type', content: 'website' },
    { hid: 'og:title', property: 'og:title', content: config.public.SITE_TITLE },
    { hid: 'og:description', property: 'og:description', content: config.public.SITE_TOP_DESCRIPTION },
    { hid: 'og:url', property: 'og:url', content: `${config.public.HOST}` },
    {
      hid: 'og:image',
      property: 'og:image',
      content: `${config.public.HOST}${config.public.TEAM_LOGO_BLACK}`,
    },
    { hid: 'twitter:card', property: 'twitter:card', content: 'summary_large_image' },
  ],
})
const { data } = await useAsyncData('entradas', async (nuxtApp) => {
  const { $contentfulClient } = nuxtApp
  return $contentfulClient.getEntries({
    order: '-sys.createdAt',
    // limit: 10,
  })
})
const posts = data
</script>