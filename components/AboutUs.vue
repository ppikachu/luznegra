<script setup lang="ts">
  /* Define props */
  const props = defineProps({
    ciclo: {
    type: String,
    required: false,
    }
  })

  const colorClass = computed(() => {
    return props.ciclo === 'day' ? 'text-white' : 'text-primary'
  })

  const colorP = computed(() => {
    return props.ciclo === 'day' ? 'text-neutral' : 'text-neutral-content'
  })
</script>

<template>
  <section class="py-16 md:py-32 px-4 md:px-8 text-center lg:text-left">
      <div class="grid grid-cols-1 lg:grid-cols-3 place-items-center max-w-6xl mx-auto">
        <h1 class="text-4xl md:text-5xl lg:text-right prose" :class="colorClass" >
          LUZ NEGRA es el Estudio Multimedia que buscabas.
        </h1>

        <img class="w-2/3 md:w-1/2 lg:w-full mb-8" src="/images/ET.GIF" type="video/webm" />
        
        <p class="text-3xl prose" :class="colorP" >
          Nos especializamos en <span :class="colorClass">comunicación creativa</span>, dando vida a tus ideas y produciendo la mejor imagen para tus proyectos.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 place-items-center max-w-6xl mx-auto mt-32">
        <p class="text-2xl prose lg:text-right" :class="colorP" >
          LUZ NEGRA está dirigido por Inés Trigub y Santiago Toyos.  Junto a un equipo de profesionales con amplia experiencia, producimos <span :class="colorClass">Video</span>, <span :class="colorClass">Animación</span>, <span :class="colorClass">Motion Graphics</span>, <span :class="colorClass">Diseño Gráfico</span> y <span :class="colorClass">Diseño Web</span>, combinando técnicas tradicionales con las nuevas tecnologías.
        </p>

        <img class="max-w-sm w-full" src="/images/BETTY.gif" />

        <p class="text-3xl md:text-4xl prose" :class="colorP" >
          Buscamos la <span :class="colorClass">síntesis</span> necesaria para comunicar de manera <span :class="colorClass">original</span> y <span :class="colorClass">efectiva</span> tu mensaje.
        </p>
      </div>
  </section>
</template>