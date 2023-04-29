<script setup lang="ts">
/* Define props */
const props = defineProps<{ videos: [] }>()
const currentVideo = ref(0)

let videoId:any = []
let provider:any = []
if (props.videos) {
	props.videos.forEach((video: any) => {
		videoId.push(video.split('/').pop())
		video.includes('youtu') ? provider.push('youtube') : provider.push('vimeo')
	})
}

function buttonClick(tag:number) {
	currentVideo.value = tag
}
</script>

<template>
	<!--videos component-->
	<section v-if="videoId.length > 0">
		<ClientOnly>
			<aside
				class="carousel aspect-video bg-neutral"
				style="background-image: url(/images/tubos_loop_ani.png); background-repeat: no-repeat; background-position: center; background-size: 128px;"
			>
				<div v-for="(video, i) in videoId" :key="i" class="carousel-item w-full" :id="'vid'+i">
					<VuePlyr class="w-full">
						<iframe v-if="provider[i] == 'youtube'"
							:src="`https://www.youtube.com/embed/${video}?iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`"
							allowfullscreen
							allowtransparency
							allow="autoplay"
							class="aspect-video rounded w-full"
						></iframe>
						<iframe v-if="provider[i] == 'vimeo'"
							:src="`https://player.vimeo.com/video/${video}?loop=false&amp;byline=false&amp;portrait=false&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media`"
							allowfullscreen
							allowtransparency
							allow="autoplay"
							class="aspect-video rounded w-full"
						></iframe>
					</VuePlyr>
				</div>
			</aside>
			<!--chooser-->
			<div v-if="props.videos.length > 1" class="flex justify-center">
				<div class="py-4 btn-group overflow-x-auto">
					<a v-for="(video, i) in videoId"
						:href="`#vid${i}`"
						:class="{ 'btn-active': i == currentVideo }"
						class="btn btn-sm"
						@click="buttonClick(i)"
					>
						{{ i+1 }}
					</a>
				</div>
			</div>
		</ClientOnly>
	</section>
</template>
<style>
.carousel {
	scroll-behavior: auto;
}
</style>