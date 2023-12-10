<script setup lang="ts">
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

/* Fetch all projects */
const { data } = await useAsyncGql('entradas', { limit: 0 })
const posts = data.value.entradasCollection?.items || []

const openedProyect = ref()
const destacadoTodos = ref(true)

//oculta scroll al visualizar proyecto:
const el = ref<HTMLElement | null>(null)
const preventScroll = useScrollLock(el)
onMounted(() => {
	el.value = document.body
})

/* Default tags */
const currentTag = ref('')

function onTag(tag:any) {
	currentTag.value = tag.id || null
}

//Filter picked projects
const pickedPortfolioItems = computed(() => {
	return posts.filter(itemPortfolio => itemPortfolio?.destacado===true)
})

//Filter standard projects
const filtered = computed(() => {
 return currentTag.value ?
 posts.filter((r) => r?.contentfulMetadata?.tags?.some((i) => i?.id === currentTag.value))
	: posts
})

const sound = useSound('/sounds/Click03.mp3')
const soundClose = useSound('/sounds/close.mp3', { volume: 0.5 })

function swapDestacados () {
	sound.play()
	destacadoTodos.value =! destacadoTodos.value
}

function openProject(which:object) {
	//evita el scroll del fondo
	preventScroll.value = true
	//agrega margen para compensar el preventScroll:
	el.value?.classList.add('md:pr-4')
	openedProyect.value = which
	sound.play()
}

function closeProject() {
	//permite el scroll del fondo
	preventScroll.value = false
	//saca margen para compensar el preventScroll:
	el.value?.classList.remove('md:pr-4')
	openedProyect.value = null
	soundClose.play()
}
</script>

<template>
	<section id="portfolio" class="mx-auto max-w-6xl px-4 md:px-8 my-16 relative">
		<!--Modal-->
		<ClientOnly>
			<Teleport to="html">
				<transition
					name="nested"
					:duration="250"
				>
					<div
						v-if="openedProyect"
						id="modal-proyecto"
						class="modal bg-black/80 backdrop-blur backdrop-grayscale-[50%] items-start md:items-center overscroll-none"
						:class="{ 'modal-open': openedProyect }"
					>
						<CloseButton @close-me="closeProject" />
						<div class="inner modal-box rounded-none md:rounded-3xl w-full max-w-full md:max-w-3xl lg:max-w-4xl xl:max-w-5xl min-h-full md:min-h-fit overscroll-contain">

							<ProjectMedia :project="{ 'videos': openedProyect.video, 'gallery': openedProyect.imgGalleryCollection?.items}" />

							<div class="flex flex-col md:flex-row space-y-4 md:space-y-0 lg:space-x-4 md:justify-between lg:items-center my-4">
								<h1 class="text-4xl text-primary">{{ openedProyect.title }}</h1>
								<ProjectMeta :tags="openedProyect.contentfulMetadata.tags" />
							</div>

							<div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 md:justify-between md:items-end">
								<div
									v-html="openedProyect.content ? documentToHtmlString(openedProyect.content.json) : ''"
									id="content"
									class="prose prose-a:text-primary"
								></div>
								<ProjectShare :project="openedProyect" />
							</div>

						</div>
					</div>
				</transition>
			</Teleport>
		</ClientOnly>
		
		<h1 class="text-5xl text-primary text-center">Portfolio</h1>
		<!--SWITCH-->
		<div class="flex justify-center items-center py-4 md:py-8 mx-auto">
			<div class="form-control">
				<label class="label cursor-pointer uppercase">
					<span :class="{ 'text-primary' : destacadoTodos }">{{ $t('destacados') }}</span>
					<input type="checkbox" @click="swapDestacados" class="toggle mx-6" />  
					<span :class="{ 'text-primary' : !destacadoTodos }">Portfolio</span>
				</label>
			</div>
		</div>
		<!--Proyectos destacados-->
		<ul v-show="destacadoTodos" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-8">
			<li v-for="(post, i) in pickedPortfolioItems" :key="i">
				<a
					:href="`/proyecto/${post?.slug}`"
					@click.prevent="openProject(post as object)"
					class="gradient-border h-full card card-compact bg-base-300 shadow-lg"
				>
					<NuxtImg
						:src="post?.imageFeatured ?`${post.imageFeatured.url}?fm=webp&fit=fill&w=600&h=400` : '/images/no-image.png'"
						:alt="post?.imageFeatured?.title || ''"
						class="w-full p-[1px] rounded-t-2xl"
						loading="lazy"
						width="600"
						height="400"
						placeholder
					/>
					<div class="card-body">
						<h2 class="text-3xl lg:text-3xl text-primary leading-none">{{ post?.title }}</h2>
						<p v-if="post?.excerpt">{{ post.excerpt }}</p>
						<div class="card-actions" v-if="post?.contentfulMetadata.tags[0]">
							<ProjectMeta :tags="(post.contentfulMetadata.tags as Tag[])" />
						</div>
					</div>
				</a>
			</li>
		</ul>
		<!--Portfolio-->
		<div v-show="!destacadoTodos">

			<ProjectTags @tag="onTag" :initTag="currentTag" :items="posts" />

			<TransitionGroup
				tag="div"
				name="list"
				class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8 content-start relative"
			>

				<a
					v-for="(post, i) in filtered"
					:key="i"
					:data-index="i"
					:href="`/proyecto/${post?.slug}`"
					@click.prevent="openProject(post as object)"
					class="gradient-border col-span-1 card card-compact bg-base-300 shadow-lg cursor-pointer"
				>
					<NuxtImg
						:src="post?.imageFeatured ?`${post.imageFeatured.url}?fm=webp&fit=fill&w=600&h=400` : '/images/no-image.png'"
						:alt="post?.imageFeatured?.title || ''"
						class="w-full p-[1px] rounded-t-2xl"
						loading="lazy"
						width="600"
						height="400"
						placeholder
					/>
					<div class="card-body">
						<h2 class="text-primary text-xl md:text-2xl leading-none">{{ post?.title }}</h2>
						<p v-if="post?.excerpt" class="text-sm">{{ post.excerpt }}</p>
						<div class="card-actions">
							<ProjectMeta v-if="post?.contentfulMetadata.tags[0]" :tags="(post.contentfulMetadata.tags as Tag[])" />
						</div>
					</div>
					</a>

			</TransitionGroup>
		</div>
	</section>
</template>

<style scoped>
.toggle {
	background-color: white;
}
#content li p {
	margin-top: 0px;
	margin-bottom: 0px;
}
</style>