<script setup lang="ts">
/* Define props */
interface Media {
	project: {
		gallery: Array<{
			title: string,
			url: string,
			width: number,
			height: number
		}>,
		videos: string[]
	}
}
const props = defineProps<Media>()

const carousel = ref()
const selectedMedia = ref(0)

let videoId:any = []
let provider:any = []
if (props.project.videos) {
	props.project.videos.forEach((video: any) => {
		videoId.push(video.split('/').pop())
		video.includes('youtu') ? provider.push('youtube') : provider.push('vimeo')
	})
}

const chooser = computed(() => {
	let item:any = []
	if (props.project.gallery) {
		props.project.gallery.forEach((pic: any) => {
			item.push(pic.title)
		})
	}
	if (props.project.videos) {
		props.project.videos.forEach((video: any,i) => {
			item.push(i+1)
		})
	}	
	return item
})

const goTo = (tag:number) => {
	//marca active el button group:
	selectedMedia.value = tag
	//scroll to:
	const target = carousel.value.children[tag]
	const left = target.offsetLeft
	carousel.value.scrollTo({left: left})
}
</script>

<template>
	<!--videos component-->
	<section v-if="chooser.length > 0">
		<aside class="-mx-6 -mt-6 md:mx-0 md:mt-0">
			<div
			ref="carousel"
			class="carousel min-w-full"
			style="background-image: url(/images/tubos_loop_ani.png); background-repeat: no-repeat; background-position: center; background-size: 128px;"
			>
				<!--pics-->
				<div v-for="(img, i) in props.project.gallery" :key="i" :id="'img'+i" class="carousel-item w-full h-fit justify-center">
					<img
						:src="img.url"
						:width="img.width"
						:height="img.height"
						:alt="img.title"
						class="rounded"
					/>
				</div>
				<!--vids-->
				<div v-for="(video, i) in videoId" :key="i" :id="'vid'+i" class="carousel-item w-full">
					<VuePlyr class="w-full">
						<!--YouTube:-->
						<iframe v-if="provider[i] == 'youtube'"
							:src="`https://www.youtube.com/embed/${video}?iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`"
							allowfullscreen
							allowtransparency
							allow="autoplay"
							class="aspect-video md:rounded w-full"
						></iframe>
						<!--Vimeo:-->
						<iframe v-if="provider[i] == 'vimeo'"
							:src="`https://player.vimeo.com/video/${video}?loop=false&amp;byline=false&amp;portrait=false&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media`"
							allowfullscreen
							allowtransparency
							allow="autoplay"
							class="aspect-video md:rounded w-full"
						></iframe>
					</VuePlyr>
				</div>
			</div>
		</aside>
		<!--media chooser:-->
		<div v-if="chooser.length > 1" class="flex justify-center">
			<div class="py-4 btn-group overflow-x-auto">
				<span v-for="(item, i) in chooser"
					:class="{ 'btn-active': i === selectedMedia }"
					class="btn btn-sm font-normal"
					@click="goTo(i)"
				>
					{{ item }}
				</span>
			</div>
		</div>
	</section>
</template>