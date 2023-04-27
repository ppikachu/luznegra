<script setup>
import { documentToHtmlString } from '@contentful/rich-text-html-renderer'

/* Fetch all projects */
const { data } = await useAsyncGql('entradas', { limit: 0 })
const posts = data.value.entradasCollection.items

const openProyect = ref()
const destacadoTodos = ref(true)

watch(openProyect, () => {
	//oculta scroll al visualizar proyecto:
	openProyect.value ? document.body.style.overflow='hidden' : document.body.style.overflow='auto'
})

/* Default tags */
const currentTag = ref()

function onTag(tag) {
	currentTag.value = tag != '' ? tag.id : null
}

//Filter picked projects
const pickedPortfolioItems = computed(() => {
	return posts.filter(itemPortfolio => itemPortfolio.destacado==true)
})

//Filter standard projects
const filtered = computed(() => {
 return currentTag.value ?
 posts.filter((r) => r.contentfulMetadata.tags.some((i) => i.id === currentTag.value))
	: posts
})

const sound = useSound('/sounds/Click03.mp3')
const soundClose = useSound('/sounds/close.mp3', { volume: 0.5 })

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
	<section id="portfolio" class="mx-auto max-w-6xl px-4 md:px-8 my-16 relative">
		<!--Modal-->
		<ClientOnly>
			<Teleport to="html">
				<transition
					enter-active-class="transition ease-out duration-200 transform"
					enter-from-class="opacity-0"
					enter-to-class="opacity-100"
					leave-active-class="transition ease-in duration-200 transform"
					leave-from-class="opacity-100"
					leave-to-class="opacity-0"
				>
					<div
						v-if="openProyect"
						id="modal-proyecto"
						class="modal bg-black/80 backdrop-blur backdrop-grayscale-[50%] items-start md:items-center"
						:class="{ 'modal-open': openProyect }"
					>
						<div class="tooltip tooltip-primary absolute bottom-6 md:bottom-12 left-1/2 -ml-6 z-10" :data-tip="$t('close')">
							<label for="modal-proyecto" @click="closeProject" class="btn btn-primary btn-circle hover:scale-90">
								<Icon name="mdi:close-thick" />
							</label>
						</div>
						<div class="modal-box rounded-none md:rounded-3xl w-full max-w-full md:max-w-3xl lg:max-w-4xl xl:max-w-5xl min-h-full md:min-h-fit">

							<ProjectVideos v-if="openProyect.video" :videos="openProyect.video" />

							<ProjectGallery :gallery="openProyect.imgGalleryCollection" />

							<div class="flex flex-col md:flex-row space-y-4 md:space-y-0 lg:space-x-4 md:justify-between lg:items-center my-4">
								<h1 class="text-4xl text-primary">{{ openProyect.title }}</h1>
								<ProjectMeta :tags="openProyect.contentfulMetadata.tags" />
							</div>

							<div class="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 md:justify-between md:items-end">
								<div
									v-html="openProyect.content ? documentToHtmlString(openProyect.content.json) : ''"
									id="content"
									class="prose prose-a:text-primary"
								></div>
								<ProjectShare :project="openProyect" />
							</div>

						</div>
					</div>
				</transition>
			</Teleport>
		</ClientOnly>
		
		<h1 class="text-5xl text-primary text-center font-bold">Portfolio</h1>
		<!--SWITCH-->
		<div class="flex justify-center items-center py-8 mx-auto">
			<div class="form-control">
				<label class="label cursor-pointer uppercase">
					<span :class="{ 'opacity-25' : !destacadoTodos }">{{ $t('destacados') }}</span>
					<input type="checkbox" @click="swapDestacados" class="toggle toggle-md mx-6" />  
					<span :class="{ 'opacity-25' : destacadoTodos }">Portfolio</span>
				</label>
			</div>
		</div>
		<!--Proyectos destacados-->
		<ul v-show="destacadoTodos" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-8">
			<li v-for="(post, i) in pickedPortfolioItems" :key="i">
				<a
					:href="`/proyecto/${post.slug}`"
					@click.prevent="openProyect = post"
					class="gradient-border h-full card card-compact bg-base-300 shadow-lg"
				>
					<figure>
						<img v-if="post.imageFeatured"
							:src="`${post.imageFeatured.url}?fm=webp&fit=fill&w=600&h=400`"
							:alt="post.imageFeatured.title"
							class="w-full"
							loading="lazy"
							width="600"
							height="400"
						/>
						<img v-else src="/images/no-image.png" alt="no hay imagen" class="w-full" width="600" height="400" />
					</figure>
					<div class="card-body">
						<h2 class="text-3xl lg:text-3xl text-primary leading-none">{{ post.title }}</h2>
						<p v-if="post.excerpt">{{ post.excerpt }}</p>
						<div class="card-actions" v-if="post.contentfulMetadata.tags[0]">
							<ProjectMeta :tags="post.contentfulMetadata.tags" />
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
				class="grid md:grid-cols-3 lg:grid-cols-4 gap-8 content-start relative"
			>
				<div v-for="(post, i) in filtered"
					:key="i"
					:data-index="i"
					class="col-span-1"
				>
					<a
						:href="`/proyecto/${post.slug}`"
						@click.prevent="openProyect = post"
						class="gradient-border h-full card card-compact bg-base-300 shadow-lg"
					>
					<figure>
						<img v-if="post.imageFeatured"
							:src="`${post.imageFeatured.url}?fm=webp&fit=fill&w=600&h=400`"
							:alt="post.imageFeatured.title"
							loading="lazy"
							class="w-full"
							width="600"
							height="400"
						/>
						<img v-else src="/images/no-image.png" alt="no hay imagen" class="w-full" width="600" height="400" />
					</figure>
					<div class="card-body">
						<h2 class="card-title text-primary text-2xl leading-tight">{{ post.title }}</h2>
						<p v-if="post.excerpt" class="text-sm">{{ post.excerpt }}</p>
						<div class="card-actions">
							<ProjectMeta v-if="post.contentfulMetadata.tags[0]" :tags="post.contentfulMetadata.tags" />
						</div>
					</div>
					</a>
				</div>
			</TransitionGroup>
		</div>
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
<style>
.toggle {
	background-color: white;
}
#content li p {
	margin-top: 0px;
	margin-bottom: 0px;
}
</style>