<script setup>
import chroma from 'chroma-js'

definePageMeta({
  layout: 'clean',
})

const heroBgColor = ref()
const heroTypeColor = ref()

function onSwapScene(bgColor) {
  heroBgColor.value = bgColor.which == 'day' ?  chroma(bgColor.color).brighten(1.9) : chroma(bgColor.color).darken(0.8)
  heroTypeColor.value = bgColor.which == 'day' ? 'text-black' : 'text-white'
}

</script>

<template>
  <main class="block">

    <HeroOnOffOrtho @bgColor="onSwapScene" />

    <AboutUs :hero-type-color="heroTypeColor" :hero-bg-color="heroBgColor" />

    <Portfolio />

    <Contact />

  </main>
</template>