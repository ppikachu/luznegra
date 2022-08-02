<script setup>
/* Define props */
const props = defineProps({ videos: Array })
let videoId = []
let provider = []
if (props.videos) {
  props.videos.forEach(video => {
    videoId.push(video.split('/').pop())
    video.includes('youtu') ? provider.push('youtube') : provider.push('vimeo')
  })
}

const videoProvider = computed((i) => {
 return provider[i].includes('youtu') ? 'youtube' : 'vimeo'
})

</script>

<template>
  <aside v-if="videoId.length>0" class="flex flex-col space-y-2 my-4">
    <ClientOnly>
      <div v-for="(video, i) in videoId">
        <VuePlyr>
          <iframe v-if="provider[i] == 'youtube'"
            :src="`https://www.youtube.com/embed/${video}?iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`"
            allowfullscreen
            allowtransparency
            allow="autoplay"
            class="w-full aspect-video rounded-lg"
          ></iframe>
          <!--<div v-if="provider[i] == 'youtube'" data-plyr-provider="youtube" data-plyr-embed-id="bTqVqk7FSmY"></div>-->
          <iframe v-if="provider[i] == 'vimeo'"
            :src="`https://player.vimeo.com/video/${video}?loop=false&amp;byline=false&amp;portrait=false&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media`"
            allowfullscreen
            allowtransparency
            allow="autoplay"
            class="w-full aspect-video rounded-lg"
          />
          <!--<div v-if="provider[i] == 'vimeo'" data-plyr-provider="vimeo" :data-plyr-embed-id="video"></div>-->
        </VuePlyr>
      </div>
    </ClientOnly>
  </aside>
</template>