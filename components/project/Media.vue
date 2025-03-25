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

let videoId:any = []
let provider:any = []
if (props.project.videos) {
	props.project.videos.forEach((video: any) => {
		videoId.push(video.split('/').pop())
		video.includes('youtu') ? provider.push('youtube') : provider.push('vimeo')
	})
}

function videoProvider(index: number) {
	const url = props.project.videos[index]
	const provider = url.includes('youtu') ? 'youtube' : 'vimeo'
	return provider === "vimeo"
	?`https://player.vimeo.com/video/${url.split('/').pop()}?loop=false&amp;byline=false&amp;portrait=false&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media`
	:`https://www.youtube.com/embed/${url.split('/').pop()}?iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`
}

</script>

<template>
	<!--videos component-->
	<aside
		id="mediaComponent"
		:class="props.project.videos?.length > 1 || props.project.gallery?.length > 1 ? 'mb-12' : 'mb-4'"
		style="
			background-image: url(/images/tubos_loop_ani.png);
			background-repeat: no-repeat;
			background-position: center;
			background-size: 128px;
		"
	>
		<!--pics-->
		<UCarousel v-if="props.project.gallery"
			:items="props.project.gallery"
			v-slot="{ item }"
			auto-height
			:dots = "props.project.gallery.length > 1 ? true : false"
		>
			<img
				:src="item.url"
				:width="item.width"
				:height="item.height"
				:alt="item.title"
				class="max-h-96x object-contain w-full"
			>
		</UCarousel>
		<!--vids-->
		<UCarousel v-if="props.project.videos"
			:items="props.project.videos"
			v-slot="video"
			:dots = "props.project.videos.length > 1 ? true : false"
		>
			<!-- <VuePlyr class="w-full"> -->
				<!--Vimeo:-->
				<iframe 
				:src="videoProvider(video.index)"
				allowfullscreen
				allowtransparency
				allow="autoplay"
				class="aspect-video w-full"
				></iframe>
			<!-- </VuePlyr> -->
		</UCarousel>
	</aside>
</template>