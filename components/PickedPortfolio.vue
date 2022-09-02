<script lang="ts" setup>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

/* Fetch all projects */
const { data } = await useAsyncData('entradas', async (nuxtApp) => {
  const { $contentfulClient } = nuxtApp
  return $contentfulClient.getEntries({ order: 'sys.createdAt' })
})
const posts = data

const config = useRuntimeConfig()
const openProyect = ref(null)

/* Default tags */
const currentTag = ref()

function onTag(tag) {
  currentTag.value = tag != '' ? tag.sys.id : null
}

//Filter picked projects
const pickedPortfolioItems = computed(() => {
  return posts.value.items.filter((itemPortfolio: { fields: { destacado: boolean; }; }) => itemPortfolio.fields.destacado)
})

//Filter standard projects
const standardPortfolioItems = computed(() => {
 return posts.value.items.filter((itemPortfolio: { fields: { destacado: boolean; }; }) => !itemPortfolio.fields.destacado)
})

const filtered = computed(() => {
 return currentTag.value
  ? posts.value.items.filter(r => r.metadata.tags.some(i => i.sys.id === currentTag.value))
  : posts.value.items
})
</script>

<template>
  <section id="portfolio" class="container mx-auto px-4 md:px-8 my-10">
    <ClientOnly>
      <Teleport to="html">
        <div v-if="openProyect" :class="{ 'modal-open': openProyect }" class="modal" id="modal-proyecto">
          <div class="modal-box rounded-none relative w-full max-w-5xl max-h-full">
            <label for="modal-proyecto" @click="openProyect = false" class="btn btn-primary btn-sm btn-circle absolute right-6 top-3 font-black">✕</label>
            <PortfolioVideos :videos="openProyect.fields.video" />
            <PortfolioGallery :gallery="openProyect.fields.imgGallery" />
            <div class="flex md:flex-row space-x-4 lg:justify-between items-center">
              <h1 class="text-4xl">{{ openProyect.fields.title }}</h1>
              <ArticleMeta :tags="openProyect.metadata.tags" />
            </div>
            <div class="prose my-4">
              <div class="mb-4" id="content" v-html="openProyect.fields.content ? documentToHtmlString(openProyect.fields.content) : ''"></div>
            </div>
            <div v-if="openProyect.fields.contenido" v-html="openProyect.fields.contenido" class="rounded-lg aspect-video w-full"></div>
            <p class="text-xs text-zinc-400">
              link para compartir proyecto: <a :href="config.HOST+'/proyecto/'+openProyect.fields.slug" class="link link-primary">{{ openProyect.fields.slug }}</a>
            </p>
            <div class="modal-action">
              <!--<button @click="openProyect = false" class="btn btn-secondary">Cerrar</button>-->
            </div>
          </div>
        </div>
      </Teleport>
    </ClientOnly>

    <h1 class="text-5xl font-bold text-center my-8">Destacados</h1>
    
    <ul class="grid md:grid-rows-3 gap-4 md:gap-8">
      <li v-for="(post, i) in pickedPortfolioItems"
        :key="post"
        class="card card-side bg-indigo-900 shadow-lg"
      >
        <figure>
          <img v-if="post.fields.imageFeatured"
            :src="`${post.fields.imageFeatured.fields.file.url}?fm=webp&fit=fill&w=340&h=340`"
            :alt="post.fields.imageFeatured.fields.title"
            :loading="i > 0 ? 'lazy' : undefined"
            class="w-full"
          />
          <img v-else src="/images/no-image2.png" alt="no hay imagen" class="w-full" />
        </figure>
        <div class="card-body self-center w-96 md:w-16">
          <h2 class="card-title md:text-2xl">{{ post.fields.title }}</h2>
          <p v-if="post.fields.excerpt" class="text-sm">{{ post.fields.excerpt }}</p>
          <div class="card-actions">
            <ArticleMeta v-if="post.metadata.tags[0]" :tags="post.metadata.tags" />
            <a :href="`/proyecto/${post.fields.slug}`" class="absolute inset-0" @click.prevent="openProyect = post" ></a>
          </div>
        </div>
      </li>
    </ul>

    <h1 class="text-5xl font-bold text-center my-8">Portfolio</h1>
    <ProjectTags @tag="onTag" :initTag="currentTag" />
    <TransitionGroup name="list" tag="ul" class="grid md:grid-cols-4 lg:grid-cols-5 gap-4">
      <li v-for="(post, i) in filtered" :key="post" class="card card-compact bg-base-300 shadow-lg">
        <figure>
          <img v-if="post.fields.imageFeatured"
            :src="`${post.fields.imageFeatured.fields.file.url}?fm=webp&fit=fill&w=300&h=300`"
            :alt="post.fields.imageFeatured.fields.title"
            :loading="i > 0 ? 'lazy' : undefined"
            class="w-full"
          />
          <img v-else src="/images/no-image2.png" alt="no hay imagen" class="w-full" />
        </figure>
        <div class="card-body">
          <h2 class="card-title">{{ post.fields.title }}</h2>
          <p v-if="post.fields.excerpt" class="text-sm">{{ post.fields.excerpt }}</p>
          <div class="card-actions">
            <ArticleMeta v-if="post.metadata.tags[0]" :tags="post.metadata.tags" />
            <a :href="`/proyecto/${post.fields.slug}`" class="absolute inset-0" @click.prevent="openProyect = post" ></a>
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