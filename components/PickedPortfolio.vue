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
    <h1 class="text-5xl text-primary text-center font-bold">Portfolio</h1>
    <!--Modal-->
    <ClientOnly>
      <Teleport to="html">
        <div v-if="openProyect" :class="{ 'modal-open': openProyect }" class="modal" id="modal-proyecto">
          <div class="modal-box rounded-none relative w-full max-w-5xl max-h-full">
            <label for="modal-proyecto" @click="closeProject" class="btn btn-primary btn-sm btn-circle absolute right-6 top-3 font-black">✕</label>
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
              <p class="text-xs text-zinc-400">
                link para compartir proyecto: <a :href="config.HOST+'/proyecto/'+openProyect.fields.slug" class="link link-primary">{{ openProyect.fields.slug }}</a>
              </p>
            </div>
          </div>
        </div>
      </Teleport>
    </ClientOnly>
    <!--SWITCH-->
    <div class="text-xl md:text-2xl flex justify-center items-center space-x-4 my-8 mx-auto leading-none">
      <span class="text-right basis-1/3" :class="{'opacity-25': !destacadoTodos, 'text-primary': destacadoTodos }">Proyectos destacados</span>
      <div class="form-control">
        <label class="label cursor-pointer">
          <input type="checkbox" @click="swapDestacados" class="toggle toggle-lg" />  
        </label>
      </div>
      <span class="basis-1/3" :class="{'opacity-25': destacadoTodos, 'text-primary': !destacadoTodos  }">Portfolio</span>
    </div>
    <!--Proyectos destacados-->
    <ul v-show="destacadoTodos" class="grid md:grid-rows-3 gap-4 md:gap-8">
      <li v-for="(post) in pickedPortfolioItems" :key="post">
        <a
          :href="`/proyecto/${post.fields.slug}`"
          @click.prevent="openProyect = post"
          class="gradient-border card card-compact md:card-normal md:card-side bg-base-300 shadow-lg"
        >
          <figure class="basis-3/5">
            <img v-if="post.fields.imageFeatured"
              :src="`${post.fields.imageFeatured.fields.file.url}?fm=webp&fit=fill&w=520&h=320`"
              :alt="post.fields.imageFeatured.fields.title"
              class="w-full"
              loading="lazy"
            />
            <img v-else src="/images/no-image2.png" alt="no hay imagen" class="w-full" />
          </figure>
          <div class="card-body basis-2/5">
            <h2 class="text-2xl lg:text-4xl text-primary leading-none">{{ post.fields.title }}</h2>
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
        tag="ul"
        @beforeEnter="onBeforeEnter"
        @enter="onEnter"
        @leave="onLeave"
        class="grid md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        <li v-for="(post, i) in filtered" :key="post" :data-index="i">
          <a
            :href="`/proyecto/${post.fields.slug}`"
            @click.prevent="openProyect = post"
            class="h-full card card-compact bg-base-300 shadow-lg transition-shadow duration-300 delay-100 hover:shadow-secondary"
          >
          <figure>
            <img v-if="post.fields.imageFeatured"
              :src="`${post.fields.imageFeatured.fields.file.url}?fm=webp&fit=fill&w=600&h=400`"
              :alt="post.fields.imageFeatured.fields.title"
              loading="lazy"
              class="w-full"
            />
            <img v-else src="/images/no-image2.png" alt="no hay imagen" class="w-full" />
          </figure>
          <div class="card-body">
            <h2 class="card-title text-primary leading-tight">{{ post.fields.title }}</h2>
            <p v-if="post.fields.excerpt" class="text-sm">{{ post.fields.excerpt }}</p>
            <div class="card-actions">
              <ProjectMeta v-if="post.metadata.tags[0]" :tags="post.metadata.tags" />
            </div>
          </div>
          </a>
        </li>
      </TransitionGroup>
    </div>
    <!--Gradient-->
    <div class="spotlight-wrapper overflow-hidden"><div class="fixed z-10 spotlight"></div></div>
  </section>
</template>

<style scoped>
.toggle {
  background-color: white;
}

.spotlight {
  background: linear-gradient(45deg, hsl(var(--b3)) 0%, hsl(var(--sf)) 100%);
  filter: blur(2vh);
  height: 9rem;
  bottom: -4rem;
  left: -4rem;
  right: -4rem;
}

.gradient-border {
  position: relative;
  border-radius: 1rem;
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
  border-radius: 1rem;
  padding: 4px;
  width: 100%;
  background: linear-gradient(90deg, hsl(var(--s)) 0%, hsl(var(--p)) 100%);
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