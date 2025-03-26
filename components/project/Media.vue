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
	if (!props.project.videos || !props.project.videos[index]) {
		return '';
	}
	const url = props.project.videos[index];
	const provider = url.includes('youtu') ? 'youtube' : 'vimeo';
	return provider === "vimeo"
		? `https://player.vimeo.com/video/${url.split('/').pop()}?loop=false&amp;byline=false&amp;portrait=false&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media`
		// #BUG: youtube error in console
		: `https://www.youtube.com/embed/${url.split('/').pop()}?iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`
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
		<div v-if="props.project.gallery?.length > 1">
			<UCarousel
				v-if="props.project.gallery?.length"
				:items="props.project.gallery"
				v-slot="{ item }"
				auto-height
				:dots="props.project.gallery.length > 1"
			>
				<img
					v-if="item"
					:src="item.url"
					:width="item.width"
					:height="item.height"
					:alt="item.title"
					class="h-fit object-contain mx-auto"
				>
			</UCarousel>
		</div>
		<!--single pic-->
		<img v-else-if="props.project.gallery?.length === 1"
			:src="props.project.gallery[0].url"
			:width="props.project.gallery[0].width"
			:height="props.project.gallery[0].height"
			:alt="props.project.gallery[0].title"
			class="h-fit object-contain mx-auto"
		>

		<!--vids-->
		<div v-if="props.project.videos?.length > 1">
			<UCarousel
				:items="props.project.videos"
				v-slot="video"
				:dots = "props.project.videos.length > 1 ? true : false"
			>
				<iframe
					v-if="videoProvider(video.index)"
					:src="videoProvider(video.index)"
					allowfullscreen
					allowtransparency
					allow="autoplay"
					class="aspect-video w-full"
				></iframe>
			</UCarousel>
		</div>
		<!--single vid-->
		<iframe 
			v-else-if="props.project.videos?.length === 1"
			:src="videoProvider(0)"
			allowfullscreen
			allowtransparency
			allow="autoplay"
			class="aspect-video w-full"
		></iframe>
	</aside>
</template>