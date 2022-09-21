<script lang="ts" setup>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
/* Fetch projects */
const { data } = await useAsyncData('entradas', async (nuxtApp) => {
  const { $contentfulClient } = nuxtApp
  return $contentfulClient.getEntries({
    order: 'sys.createdAt',
    'metadata.tags.sys.id[all]': 'booktrailer',
  })
})
const posts = data.value.items
const openProyect = ref(null)
</script>

<template>
  <section id="portfolio" class="container mx-auto px-4 md:px-8 my-10">
    <ClientOnly>
      <Teleport to="html">
        <div v-if="openProyect" :class="{ 'modal-open': openProyect }" class="modal" id="modal-proyecto">
          <div class="modal-box rounded-none relative w-full max-w-5xl max-h-full">
            <label for="modal-proyecto" @click="openProyect = false" class="btn btn-primary btn-sm btn-circle absolute right-6 top-3 font-black">✕</label>
            <ProjectVideos :videos="openProyect.fields.video" />
            <ProjectGallery :gallery="openProyect.fields.imgGallery" />
            <div class="flex md:flex-row space-x-4 lg:justify-between items-center">
              <h1 class="text-4xl">{{ openProyect.fields.title }}</h1>
              <ProjectMeta :tags="openProyect.metadata.tags" />
            </div>
            <div class="prose my-4">
              <div class="mb-4" id="content" v-html="openProyect.fields.content ? documentToHtmlString(openProyect.fields.content) : ''"></div>
            </div>
            <div v-if="openProyect.fields.contenido" v-html="openProyect.fields.contenido" class="rounded-lg aspect-video w-full"></div>
            <div class="modal-action">
              <!--<button @click="openProyect = false" class="btn btn-secondary">Cerrar</button>-->
            </div>
          </div>
        </div>
      </Teleport>
    </ClientOnly>

    <h1 class="text-5xl font-bold text-center my-8">
      Portfolio
    </h1>

    <TransitionGroup name="list" tag="ul" class="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
      <li v-for="(post, i) in posts" :key="post" class="card card-compact bg-base-300 shadow-xl">
          <figure>
            <img v-if="post.fields.imageFeatured"
              :src="`${post.fields.imageFeatured.fields.file.url}?fm=webp&fit=fill&w=400&h=300`"
              :alt="post.fields.imageFeatured.fields.title"
              :loading="i > 0 ? 'lazy' : undefined"
              class="w-full"
              width="400"
              height="300"
            />
            <img v-else
              src="/images/no-image.png"
              alt="no hay imagen"
              class="w-full"
              width="400"
              height="300"
            />
          </figure>
          <div class="card-body">
              <h2 class="card-title">{{ post.fields.title }}</h2>
              <p v-if="post.fields.excerpt" class="text-sm">{{ post.fields.excerpt }}</p>
              <div class="card-actions">
                <ProjectMeta v-if="post.metadata.tags[0]" :tags="post.metadata.tags" />
                <span v-if="!post.fields.content" class="badge badge-error">⚠️ content</span>
                <a
                  :href="`/proyecto/${post.fields.slug}`"
                  class="absolute inset-0"
                  @click.prevent="openProyect = post"
                >
                </a>
              </div>
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
  transform: scale(0.1);
}
</style>