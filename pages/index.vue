<script setup>
import chroma from 'chroma-js'

definePageMeta({
  layout: 'clean',
})

function onSwapScene(bgColor) {
  heroBgColor.value = bgColor.which == 'day' ?  chroma(bgColor.color).brighten(1.9) : chroma(bgColor.color).darken(0.8)
  heroTypeColor.value = bgColor.which == 'day' ? 'text-black' : 'text-white'
}

</script>

<template>
  <main class="block">

    <HeroOnOffOrtho />

    <Portfolio />

    <Contact />

  </main>
</template>