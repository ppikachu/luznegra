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
</script>

<template>
  <ClientOnly>
    <aside v-if="videoId.length>0" class="space-y-2 carousel mt-8 items-center rounded-lg">
      <div v-for="(video, i) in videoId" class="carousel-item w-full" :id="i">
        <VuePlyr class="w-full">
          <iframe v-if="provider[i] == 'youtube'"
            :src="`https://www.youtube.com/embed/${video}?iv_load_policy=3&amp;modestbranding=1&amp;playsinline=1&amp;showinfo=0&amp;rel=0&amp;enablejsapi=1`"
            allowfullscreen
            allowtransparency
            allow="autoplay"
            class="aspect-video w-full"
          ></iframe>
          <iframe v-if="provider[i] == 'vimeo'"
            :src="`https://player.vimeo.com/video/${video}?loop=false&amp;byline=false&amp;portrait=false&amp;title=false&amp;speed=true&amp;transparent=0&amp;gesture=media`"
            allowfullscreen
            allowtransparency
            allow="autoplay"
            class="aspect-video w-full"
          ></iframe>
        </VuePlyr>
      </div>
    </aside>
    <div v-if="props.videos.length > 1" class="flex justify-center py-2 btn-group">
      <a v-for="(video, i) in videoId" :href="`#${i}`" class="btn btn-sm text-xs">{{ i+1 }}</a>
    </div>
  </ClientOnly>
</template>