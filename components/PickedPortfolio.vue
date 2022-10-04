<script lang="ts" setup>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

/* Fetch all projects */
const { data } = await useAsyncData('entradas', async (nuxtApp) => {
  const { $contentfulClient } = nuxtApp
  return $contentfulClient.getEntries({
    locale: 'en',
    content_type: 'entradas',
    order: '-fields.date'
  })
})
const posts = data

const config = useRuntimeConfig()
const openProyect = ref(null)
const destacadoTodos = ref(true)

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
const filtered = computed(() => {
 return currentTag.value
  ? posts.value.items.filter(r => r.metadata.tags.some(i => i.sys.id === currentTag.value))
  : posts.value.items
})

const sound = useSound('/audio/Click03.mp3')
const soundClose = useSound('/audio/close.mp3', { volume: 0.5 })

function swapDestacados () {
  sound.play()
  destacadoTodos.value =! destacadoTodos.value
}

function closeProject() {
  soundClose.play()
  openProyect.value = false
}
</script>

<template>
  <section id="hero" class="container"></section>
  <section id="portfolio" class="mx-auto px-4 md:px-8 my-16 relative">
    <!--Modal-->
    <ClientOnly>
      <Teleport to="html">
        <div
          v-if="openProyect"
          id="modal-proyecto"
          class="modal bg-black/80 backdrop-blur backdrop-grayscale-[50%]"
          :class="{ 'modal-open': openProyect }"
        >
          <div class="modal-box rounded-none md:rounded-3xl relative w-full max-w-5xl max-h-full">
            <label for="modal-proyecto" @click="closeProject" class="btn btn-primary btn-sm btn-circle absolute left-2 top-2">
              <Icon name="mdi:close-thick" />
            </label>
            <ProjectVideos v-if="openProyect.fields.video" :videos="openProyect.fields.video" />
            <ProjectGallery v-if="openProyect.fields.imgGallery" :gallery="openProyect.fields.imgGallery" />
            <div class="flex flex-col md:flex-row space-y-4 md:space-y-0 lg:space-x-4 md:justify-between lg:items-center mt-4">
              <h1 class="text-4xl text-primary">{{ openProyect.fields.title }}</h1>
              <ProjectMeta :tags="openProyect.metadata.tags" />
            </div>
            <div class="prose my-4">
              <div class="mb-4" id="content" v-html="openProyect.fields.content ? documentToHtmlString(openProyect.fields.content) : ''"></div>
            </div>
            <div v-if="openProyect.fields.contenido" v-html="openProyect.fields.contenido" class="rounded-lg aspect-video w-full"></div>
            <div class="modal-action">
              <p class="text-xs text-zinc-400">
                {{ $t('link_compartir') }}: <a :href="config.HOST+'/proyecto/'+openProyect.fields.slug" class="link link-primary">{{ openProyect.fields.slug }}</a>
              </p>
            </div>
          </div>
        </div>
      </Teleport>
    </ClientOnly>
    
    <h1 class="text-5xl text-primary text-center font-bold">Portfolio</h1>
    <!--SWITCH-->
    <div class="flex justify-center items-center py-8 mx-auto">
      <div class="form-control md:text-xl">
        <label class="label cursor-pointer">
          <span :class="{ 'opacity-25' : !destacadoTodos }">{{ $t('destacados') }}</span>
          <input type="checkbox" @click="swapDestacados" class="toggle toggle-md mx-6" />  
          <span :class="{ 'opacity-25' : destacadoTodos }">Portfolio</span>
        </label>
      </div>
    </div>
    <!--Proyectos destacados-->
    <ul v-show="destacadoTodos" class="grid md:grid-cols-3 gap-4 lg:gap-8">
      <li v-for="(post) in pickedPortfolioItems" :key="post">
        <a
          :href="`/proyecto/${post.fields.slug}`"
          @click.prevent="openProyect = post"
          class="gradient-border h-full card card-compact md:card-normal bg-base-300 shadow-lg"
        >
          <figure>
            <img v-if="post.fields.imageFeatured"
              :src="`${post.fields.imageFeatured.fields.file.url}?fm=webp&fit=fill&w=600&h=400`"
              :alt="post.fields.imageFeatured.fields.title"
              class="w-full"
              loading="lazy"
              width="600"
              height="400"
            />
            <img v-else src="/images/no-image.png" alt="no hay imagen" class="w-full" width="600" height="400" />
          </figure>
          <div class="card-body">
            <h2 class="text-3xl lg:text-3xl text-primary leading-none">{{ post.fields.title }}</h2>
            <p v-if="post.fields.excerpt">{{ post.fields.excerpt }}</p>
            <div class="card-actions" v-if="post.metadata.tags[0]">
              <ProjectMeta :tags="post.metadata.tags" />
            </div>
          </div>
        </a>
      </li>
    </ul>
    <!--Portfolio-->
    <div v-show="!destacadoTodos" class="">
      <ProjectTags @tag="onTag" :initTag="currentTag" />
      <TransitionGroup
        tag="div"
        name="list"
        class="grid md:grid-cols-3 lg:grid-cols-4 gap-4 content-start relative"
      >
        <div v-for="(post, i) in filtered"
          :key="post"
          :data-index="i"
          class="col-span-1"
        >
          <a
            :href="`/proyecto/${post.fields.slug}`"
            @click.prevent="openProyect = post"
            class="gradient-border h-full card card-compact bg-base-300 shadow-lg"
          >
          <figure>
            <img v-if="post.fields.imageFeatured"
              :src="`${post.fields.imageFeatured.fields.file.url}?fm=webp&fit=fill&w=600&h=400`"
              :alt="post.fields.imageFeatured.fields.title"
              loading="lazy"
              class="w-full"
              width="600"
              height="400"
            />
            <img v-else src="/images/no-image.png" alt="no hay imagen" class="w-full" width="600" height="400" />
          </figure>
          <div class="card-body">
            <h2 class="card-title text-primary text-2xl leading-tight">{{ post.fields.title }}</h2>
            <p v-if="post.fields.excerpt" class="text-sm">{{ post.fields.excerpt }}</p>
            <div class="card-actions">
              <ProjectMeta v-if="post.metadata.tags[0]" :tags="post.metadata.tags" />
            </div>
          </div>
          </a>
        </div>
      </TransitionGroup>
    </div>
    <!--Gradient-->
    <div class="fixed z-10 bottom-0 left-0 w-full h-24 spotlight bg-gradient-to-t from-zinc-900"></div>
  </section>
</template>
<!--.list-enter-from {
  opacity: 0;
  transform: scale(0.6);
}
.list-enter-to {
  opacity: 1;
  transform: scale(1);
}
.list-enter-active {
  transition: all 0.5s ease;
}
.list-leave-from {
  opacity: 1;
  transform: scale(1);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.6)
}
.list-leave-active {
  transition: opacity;
  position: absolute;
  /*transition: all 0.5s ease;*/
}
.list-complete-active {
  position: absolute;
}
.list-move {
  transition: all 0.5s;
}-->
<style scoped>
.toggle {
  background-color: white;
}
</style>