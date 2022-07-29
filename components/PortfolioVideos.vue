<script lang="ts" setup>
/* Define props */
interface Props { videos: object[] }
const props = defineProps({
  videos: {
    type: Array,
    required: true,
  },
})
</script>

<template>
  <aside class="flex flex-col space-y-2 my-4">
    <!--<ClientOnly><VuePlyr>
			<div class="plyr__video-embed">
				<iframe src="https://player.vimeo.com/video/147865858?loop=false&amp;byline=false&amp;portrait=false&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media"
					allowfullscreen
					allowtransparency
					allow="autoplay" />
			</div>
		</VuePlyr></ClientOnly>-->
    <div v-for="video in props.videos" class="badge badge-sm badge-primary">
    {{ video }}
    </div>
  </aside>
</template>