<script lang="ts" setup>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
/* Fetch projects */
const { data } = await useAsyncGql('entradas', { limit: 0 })
const posts = data.value?.entradasCollection?.items
//console.table(posts)

const openProyect = ref()
const config = useRuntimeConfig()
</script>

<template>
  <section id="portfolio" class="container mx-auto px-4 md:px-8 my-10">
    <ClientOnly>
      <Teleport to="html">
        <div v-if="openProyect" :class="{ 'modal-open': openProyect }" class="modal" id="modal-proyecto">
          <div class="modal-box rounded-none relative w-full max-w-5xl max-h-full">
            <label for="modal-proyecto" @click="openProyect = false" class="btn btn-primary btn-sm btn-circle absolute right-6 top-3 font-black">✕</label>
            <ProjectVideos :videos="openProyect.video" />
            <ProjectGallery :gallery="openProyect.imgGalleryCollection" />
            <div class="flex md:flex-row space-x-4 lg:justify-between items-center">
              <h1 class="text-4xl">{{ openProyect.title }}</h1>
              <ProjectMeta :tags="openProyect.contentfulMetadata.tags" />
            </div>

            <div class="prose my-4">
              <div class="mb-4" id="content" v-html="openProyect.content ? documentToHtmlString(openProyect.content.json) : ''"></div>
            </div>

            <div class="modal-action">
              <p class="text-xs text-zinc-400">
                {{ $t('link_compartir') }}: <a :href="config.HOST+'/proyecto/'+openProyect.slug" class="link link-primary">{{ openProyect.slug }}</a>
              </p>
            </div>

          </div>
        </div>
      </Teleport>
    </ClientOnly>

    <h1 class="text-5xl font-bold text-center my-8">
      Portfolio
    </h1>

    <ProjectTags @tag="onTag" :initTag="currentTag" :items="posts" />

    <TransitionGroup name="list" tag="ul" class="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
      <li v-for="(post, i) in posts" :key="i" class="card card-compact bg-base-300 shadow-xl">
          <figure>
            <img v-if="post?.imageFeatured"
              :src="`${post.imageFeatured.url}?fm=webp&fit=fill&w=400&h=300`"
              :alt="post.imageFeatured.title"
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
              <h2 class="card-title">{{ post?.title }}</h2>
              <p v-if="post?.excerpt" class="text-sm">{{ post?.excerpt }}</p>
              <div class="card-actions">
                <ProjectMeta v-if="post?.contentfulMetadata.tags[0]" :tags="post?.contentfulMetadata.tags" />
                <span v-if="!post?.content" class="badge badge-error">⚠️ content</span>
                <a
                  :href="`/proyecto/${post?.slug}`"
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