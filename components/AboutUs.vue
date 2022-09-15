<script setup lang="ts">
  /* Define props */
  const props = defineProps({
    ciclo: {
    type: String,
    required: false,
    }
  })

  const colorClass = computed(() => {
    return props.ciclo === 'day' ? 'text-secondary' : 'text-primary'
  })
</script>

<template>
  <section>
    <div class="hero pt-8 md:pt-32 max-w-5xl mx-auto">
      <div class="text-center grid grid-cols-1 lg:grid-cols-2 gap-8 place-items-center justify-center">
        <h1
        :class="colorClass"
        class="text-4xl md:text-5xl px-4 lg:text-left my-4 font-bold max-w-md leading-tight lg:leading-none"
        >
        LUZ NEGRA es el Estudio Multimedia que buscabas.
        </h1>
        <div
          class="text-center w-full lg:w-96 relative px-4 lg:px-0 text-3xl leading-none"
          :class="{'text-neutral': props.ciclo === 'day', 'text-neutral-content': props.ciclo === 'night'}"
        >
          <video autoplay loop muted class="absolute left-1/4 md:left-1/3 top-40 w-1/2 md:w-1/3 lg:w-2/3 lg:-top-8 lg:-left-1/2" >
            <source src="/images/ET_en_nave_transparente.webm" type="video/webm">
          </video>
          <div>Nos especializamos en <span :class="colorClass">comunicación creativa</span>, dando vida a tus ideas y produciendo la mejor imagen para tus proyectos.</div>
        </div>
      </div>
    </div>
    <div class="hero max-w-5xl mx-auto mt-64 md:mt-96 lg:mt-32">
      <div class="hero-content flex-col lg:flex-row-reverse text-center lg:text-left">
          <div
            class="prose"
            :class="{'text-neutral' : props.ciclo === 'day', 'text-neutral-content' : props.ciclo === 'night'}"
          >
            <p class="my-4 text-2xl">LUZ NEGRA está dirigido por Inés Trigub y Santiago Toyos.  Junto a un equipo de profesionales con amplia experiencia, producimos <span :class="colorClass">Video</span>, <span :class="colorClass">Animación</span>, <span :class="colorClass">Motion Graphics</span>, <span :class="colorClass">Diseño Gráfico</span> y <span :class="colorClass">Diseño Web</span>, combinando técnicas tradicionales con las nuevas tecnologías.</p>
            <p class="my-4 text-2xl">Buscamos la síntesis <span :class="colorClass">necesaria</span> para comunicar de manera <span :class="colorClass">original</span> y <span :class="colorClass">efectiva</span> tu mensaje.</p>
          </div>
        <video autoplay loop muted class="max-w-sm w-full" >
          <source src="/images/bety.webm" type="video/webm">
        </video>
      </div>
    </div>
  </section>
</template>