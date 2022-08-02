<script lang="ts" setup>
import { symlinkSync } from 'fs';

/* Fetch projects */
const { data } = await useAsyncData('entradas', async (nuxtApp) => {
  const { $contentfulClient } = nuxtApp
  return $contentfulClient.getEntries({
    order: 'sys.createdAt',
  })
})
const posts = data
/* Default tags */
const currentTag = ref('tv')

function onTag(tag) {
  currentTag.value = tag != '' ? tag.sys.id : null
}

const filtered = computed(() => {
 return currentTag.value
  //? posts.value.items.filter(project => project.metadata.tags.every(tag => tag.sys.id.includes(currentTag.value)))
  ? posts.value.items.filter(r => r.metadata.tags.some(i => i.sys.id === currentTag.value))
  : posts.value.items
})

</script>

<template>
  <section id="portfolio" class="container mx-auto px-4 md:px-8 my-10">
    <ProjectTags @tag="onTag" :initTag="currentTag" />
    <TransitionGroup name="list" tag="ul" class="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
      <li v-for="(post, i) in filtered" :key="post" class="card card-compact bg-base-300 shadow-xl">
          <figure>
            <img v-if="post.fields.imageFeatured"
              :src="`${post.fields.imageFeatured.fields.file.url}?fm=webp&fit=fill&w=400&h=300`"
              :alt="post.fields.imageFeatured.fields.title"
              :loading="i > 0 ? 'lazy' : undefined"
              class="w-full"
            />
            <img v-else
              src="/images/no-image2.png"
              alt="no hay imagen"
              class="w-full"
            />
          </figure>
          <div class="card-body">
            <a :href="`/proyecto/${post.fields.slug}`">
              <h2 class="card-title">{{ post.fields.title }}</h2>
              <p v-if="post.fields.excerpt" class="text-sm">{{ post.fields.excerpt }}</p>
              <div class="card-actions mt-3">
                <ArticleMeta v-if="post.metadata.tags[0]" :tags="post.metadata.tags" />
                <span v-if="!post.fields.content" class="badge badge-outline">⚠️content</span>
                <span v-if="post.fields.video" class="badge badge-outline">video</span>
              </div>
            </a>
          </div>
      </li>
    </TransitionGroup>
  </section>
</template>

<style>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  /*transform: translateX(30px);*/
}
</style>