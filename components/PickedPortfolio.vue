<script setup lang="ts">
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'
// import type { Tag } from '@contentful/rich-text-types'

/* Fetch all projects */
const { data } = await useAsyncGql('entradas', { limit: 0 })
const posts = data.value.entradasCollection?.items || []

const openedProyect = ref()
const destacadoTodos = ref(true)

// Display correct state of destacados/portfolio switch (inverted)
const notDestacadoTodos = computed(() => {
	return !destacadoTodos.value
})

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

function showDestacados() {
	sound.play()
	destacadoTodos.value = true
}

function showPortfolio() {
	sound.play()
	destacadoTodos.value = false
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
				<transition name="nested" :duration="250">
					<div
						v-if="openedProyect"
						id="modal-proyecto"
						class="flex justify-center fixed top-0 bottom-0 left-0 right-0 z-10 bg-black/80 backdrop-blur backdrop-grayscale-[50%] items-start md:items-center overflow-y-auto"
						:class="{ 'modal-open': openedProyect }"
					>
						<UCard
							variant="solid"
							class="flex flex-col overflow-hidden bg-zinc-800 rounded-none w-full md:rounded-lg max-w-4xl h-full md:h-fit"
							:ui="{ header: 'p-0 sm:p-0' }"
						>
							<template #header>
								<ProjectMedia :project="{ 'videos': openedProyect.video, 'gallery': openedProyect.imgGalleryCollection?.items}" />
							</template>
							
							<h1 class="text-3xl text-(--ui-primary) mb-4">{{ openedProyect.title }}</h1>
							
							<div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 md:justify-between md:items-end">
								<div
								v-html="openedProyect.content ? documentToHtmlString(openedProyect.content.json) : ''"
								id="content"
								class="prose prose-invert"
								></div>
								<ProjectMeta :tags="openedProyect.contentfulMetadata.tags" />
								<ProjectShare :project="openedProyect" />
							</div>

							<CloseButton @close-me="closeProject" />

						</UCard>
					</div>
				</transition>
			</Teleport>
		</ClientOnly>
		
		<h1 class="text-5xl text-(--ui-primary) text-center">Portfolio</h1>

		<!--SWITCH-->
		<div class="flex gap-6 justify-center items-center py-4 md:py-8 mx-auto uppercase">
			<span
				@click="showDestacados"
				class="cursor-pointer"
				:class="{ 'text-(--ui-primary)' : destacadoTodos }"
			>{{ $t('destacados') }}</span>
			<USwitch
				:model-value="notDestacadoTodos"
				@update:model-value="swapDestacados" 
				size="xl"
				class="cursor-pointer"
				:ui="{ base: 'data-[state=unchecked]:bg-(--ui-primary)', thumb: 'bg-zinc-800', wrapper: 'bg-zinc-800' }"
			/>
			<span
				@click="showPortfolio"
				class="cursor-pointer"
				:class="{ 'text-(--ui-primary)' : !destacadoTodos }"
			>Portfolio</span>
		</div>

		<!--Proyectos destacados-->
		<div v-show="destacadoTodos" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-8">
			<TheBox v-for="(post, i) in pickedPortfolioItems"
				:key="i"
				:href="`/proyecto/${post?.slug}`"
				@click.prevent="openProject(post as object)"
				:project="post || {}"
				class="flex"
			/>
		</div>
		<!--Portfolio-->
		<div v-show="!destacadoTodos">

			<ProjectTags @tag="onTag" :initTag="currentTag" :items="posts" />

			<TransitionGroup
				tag="div"
				name="list"
				class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-8 content-start relative"
			>
				<TheBox v-for="(post, i) in filtered"
					:key="i"
					@click="openProject(post as object)"
					:project="post || {}"
				/>

			</TransitionGroup>
		</div>
	</section>
</template>

<style scoped>
#modal-proyecto .prose-invert a {
	color: var(--ui-primary);
}
</style>