<script lang="ts" setup>
const { data } = await useAsyncData('entradas', async (nuxtApp) => {
  const { $contentfulClient } = nuxtApp
  return $contentfulClient.getEntries({
    order: 'sys.createdAt',
  })
})
const posts = data
const currentTag = ref()

function onTag(tag) {
  currentTag.value = tag.sys.id
}

const filtered = computed(() => {
  return posts.value.items.filter(tag => tag.metadata.tags[0].sys.id == currentTag.value)
})

//init seccion tv
onTag({sys:{id:'tv'}})
</script>

<template>
  <section id="portfolio" class="container mx-auto px-4 md:px-8 my-10">
    <ProjectTags @tag="onTag" />
    <div class="space-y-4">
      <TransitionGroup name="list" tag="ul" class="grid md:grid-cols-4 gap-4">
        <li v-for="(post, i) in filtered" class="card card-compact bg-base-300 shadow-xl">
          <a :href="`/proyecto/${post.fields.slug}`">
          <figure v-if="post.fields.imageFeatured">
            <img
              :src="`${post.fields.imageFeatured.fields.file.url}?fm=webp&fit=fill&w=400&h=300`"
              :alt="post.fields.imageFeatured.fields.title"
              :loading="i > 0 ? 'lazy' : undefined"
              class="w-full border-round"
            />
          </figure>
          <figure v-else>
            <img
              src="/images/no-image2.png"
              alt="no hay imagen"
              class="w-full border-round"
            />
          </figure>
          
          <div class="card-body">
            <h2 class="card-title">{{ post.fields.title }}</h2>
            <div class="space-x-2"><span v-if="!post.fields.content" class="badge badge-outline">⚠️ no content</span><span v-if="post.fields.video" class="badge badge-outline">video</span></div>
            <p class="text-sm">{{ post.fields.excerpt }}</p>
            <div class="card-actions">
              <ArticleMeta v-if="post.metadata.tags[0]" :tags="post.metadata.tags" />
            </div>
          </div>
          </a>
        </li>
      </TransitionGroup>
    </div>
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