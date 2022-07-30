<script lang="ts" setup>
/* Define props */
interface Props { videos: object[] }
const props = defineProps({
  videos: {
    type: Array,
    required: true,
  },
})

let videos = []
if (props.videos) {
  props.videos.forEach(video => { videos.push(video.split('/').pop()) })
  console.log(videos)
}
console.log(videos)
</script>

<template>
  <aside v-if="videos.length>0" class="flex flex-col space-y-2 my-4">
    <ClientOnly>
      <div v-for="video in videos">
        <VuePlyr>
          <iframe :src="`https://player.vimeo.com/video/${video}?loop=false&amp;byline=false&amp;portrait=false&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media`"
            allowfullscreen
            allowtransparency
            allow="autoplay"
            class="w-full aspect-video rounded-lg"
          />
          <!--<div data-plyr-provider="vimeo" :data-plyr-embed-id="video"></div>-->
        </VuePlyr>
      </div>
    </ClientOnly>
  </aside>
</template>