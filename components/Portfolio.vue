<script setup>
const { data } = await useAsyncData('entradas', async (nuxtApp) => {
  const { $contentfulClient } = nuxtApp
  return $contentfulClient.getEntries({
    order: '-sys.createdAt',
    // limit: 10,
  })
})
const posts = data
</script>

<template>
  <section id="portfolio">
    <div class="container mx-auto px-4 md:px-8 my-10 columns-2 md:columns-4 space-y-4">
      <div v-for="(post, i) in posts.items" class="card card-compact bg-base-300 shadow-xl">
        <NuxtLink :to="`/proyecto/${post.fields.slug}`">
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
          <p v-if="post.fields.content" class="text-sm">{{ post.fields.content.content[0].content[0].value }}</p>
          <p class="text-sm">{{ post.fields.contenido }}</p>
          <PortfolioVideos v-if="post.fields.video" :videos="post.fields.video" />
          <div class="card-actions justify-end">
            <ArticleMeta v-if="post.metadata.tags[0]" :tags="post.metadata.tags" />
          </div>
        </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>