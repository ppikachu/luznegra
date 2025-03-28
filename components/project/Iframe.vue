<script lang="ts" setup>
const props = defineProps({
	url: {
    type: String,
    required: true,
	},
})
</script>

<template>
  <iframe
    :src="props.url"
    title="video player"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    referrerpolicy="strict-origin-when-cross-origin"
    allowfullscreen
    class="aspect-video w-full"
  ></iframe>
</template>