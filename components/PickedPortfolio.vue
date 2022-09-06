<script lang="ts" setup>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
import gsap from 'gsap'

/* Fetch all projects */
const { data } = await useAsyncData('entradas', async (nuxtApp) => {
  const { $contentfulClient } = nuxtApp
  return $contentfulClient.getEntries({ order: 'sys.createdAt' })
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

function onBeforeEnter(el) {
  el.style.opacity = 0
  //el.style.height = 0
}

function onEnter(el, done) {
  gsap.to(el, {
    opacity: 1,
    scale: 1,
    delay: el.dataset.index * 0.1,
    onComplete: done
  })
}

function onLeave(el, done) {
  gsap.to(el, {
    opacity: 0,
    scale: 0,
    delay: el.dataset.index * 0.1,
    onComplete: done
  })
}
</script>

<template>
  <section id="portfolio" class="container mx-auto px-4 md:px-8 my-10 relative">
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
            <div class="modal-action">
              <p class="text-xs text-zinc-400">
                link para compartir proyecto: <a :href="config.HOST+'/proyecto/'+openProyect.fields.slug" class="link link-primary">{{ openProyect.fields.slug }}</a>
              </p>
            </div>
          </div>
        </div>
      </Teleport>
    </ClientOnly>
    <!--SWITCH-->
    <div class="text-xl flex justify-center w-full my-8">
      <div class="form-control">
        <label class="label cursor-pointer space-x-2 font-bold">
          <span :class="{'opacity-25': !destacadoTodos }" >Destacados</span>
          <input type="checkbox" @click="destacadoTodos =! destacadoTodos" class="toggle toggle-lg" />  
          <span :class="{'opacity-25':   destacadoTodos }"  >Portfolio</span>
        </label>
      </div>
    </div>

    <ul v-show="destacadoTodos" class="grid md:grid-rows-3 gap-4 md:gap-8">
      <li v-for="(post, i) in pickedPortfolioItems" :key="post">
        <a :href="`/proyecto/${post.fields.slug}`" class="gradient-border shadow-lg card md:card-side" @click.prevent="openProyect = post" >
        <figure>
          <img v-if="post.fields.imageFeatured"
            :src="`${post.fields.imageFeatured.fields.file.url}?fm=webp&fit=fill&w=520&h=320`"
            :alt="post.fields.imageFeatured.fields.title"
            :loading="i > 0 ? 'lazy' : undefined"
          />
          <img v-else src="/images/no-image2.png" alt="no hay imagen" class="w-full" />
        </figure>
        <div class="card-body">
          <h2 class="card-title md:text-2xl text-primary">{{ post.fields.title }}</h2>
          <p v-if="post.fields.excerpt" class="text-sm">{{ post.fields.excerpt }}</p>
          <div class="card-actions">
            <ArticleMeta v-if="post.metadata.tags[0]" :tags="post.metadata.tags" />
          </div>
        </div>
        </a>
      </li>
    </ul>

    <div v-show="!destacadoTodos" class="">
      <ProjectTags @tag="onTag" :initTag="currentTag" />
      <TransitionGroup
        tag="ul"
        @beforeEnter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
        class="grid md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        <li v-for="(post, i) in filtered" :key="post" :data-index="i" class="card card-compact bg-base-300 shadow-lg">
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
            <h2 class="card-title text-primary">{{ post.fields.title }}</h2>
            <p v-if="post.fields.excerpt" class="text-sm">{{ post.fields.excerpt }}</p>
            <div class="card-actions">
              <ArticleMeta v-if="post.metadata.tags[0]" :tags="post.metadata.tags" />
              <a :href="`/proyecto/${post.fields.slug}`" class="absolute inset-0" @click.prevent="openProyect = post" ></a>
            </div>
          </div>
        </li>
      </TransitionGroup>
    </div>
    
    <div class="spotlight-wrapper"><div class="fixed z-10 left-0 right-0 spotlight"></div></div>
  </section>
</template>

<style scoped>
.toggle {
  background-color: white;
}

.list-enter-active, .list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from, .list-leave-to {
  /*opacity: 0;*/
  /*transform: scale(0);*/
}
.list-leave-active {
  /*transition-delay: 0.2s;*/
}

.spotlight {
  background: linear-gradient(40deg, hsl(var(--sf)) 0%, hsl(var(--s)) 100%);
  filter: blur(10vh);
  height: 40vh;
  bottom: -30vh;
}

.spotlight-wrapper {
  opacity: 0.9;
  transition: opacity 0.4s ease-in;
  z-index: 0;
}

.gradient-border {
  position: relative;
  border-radius: 0.5rem;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
  background-color: rgba(20, 20, 20, 0.3);
  width: 100%
}

.gradient-border::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 0.5rem;
  padding: 4px;
  width: 100%;
  background: linear-gradient(90deg, hsl(var(--sf)) 0%, hsl(var(--s)) 50%, #5800b0 100%);
  background-size: 400% auto;
  background-position: 0 0;
  opacity: 0.5;
  transition: background-position 0.3s ease-in-out, opacity 0.2s ease-in-out;
  -webkit-mask: linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude
}

.gradient-border:hover::before {
  background-position: -50% 0;
  opacity: 1
}
</style>