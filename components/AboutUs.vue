<script setup lang="ts">
/* Define props */
const props = defineProps({
ciclo: {
type: String,
required: false,
},
})
</script>
<template>
  <section>
    <div class="hero pt-8 md:pt-32 max-w-5xl mx-auto">
      <div class="text-center grid grid-cols-1 lg:grid-cols-2 gap-8 place-items-center justify-center">
        <h1
        :class="{'text-primary': props.ciclo === 'night', 'text-neutral': props.ciclo === 'day'}"
        class="text-4xl md:text-5xl px-4 lg:text-left my-4 font-bold max-w-md leading-tight lg:leading-none"
        >
        LUZ NEGRA es el Estudio Multimedia que buscabas.
        </h1>
        <div
          class="text-center w-full lg:w-96 relative px-4 lg:px-0 text-3xl leading-none"
          :class="{'text-neutral': props.ciclo === 'day', 'text-neutral-content': props.ciclo === 'night'}"
        >
          <img
            src="/images/ET_en_nave_transparente.gif"
            loading="lazy"
            class="absolute left-1/4 md:left-1/3 top-40 w-1/2 md:w-1/3 lg:w-2/3 lg:-top-8 lg:-left-1/2"
            width="540"
            height="540"
            alt="Quienes somos"
          />
          <div>Nos especializamos en COMUNICACiÓN CREATIVA, dando vida a tus ideas y produciendo la mejor imagen para tus proyectos.</div>
          <!--<div class="grid justify-items-stretch md:grid-cols-5 lg:grid-cols-1 gap-2">
            <div class="flex items-center justify-center rounded-lg bg-primary bg-opacity-10 p-4">Cine</div>
            <div class="flex items-center justify-center rounded-lg bg-primary bg-opacity-10 p-4">TV</div>
            <div class="flex items-center justify-center rounded-lg bg-primary bg-opacity-10 p-4">Redes Sociales</div>
            <div class="flex items-center justify-center rounded-lg bg-primary bg-opacity-10 p-4">Gráfica</div>
            <div class="flex items-center justify-center rounded-lg bg-primary bg-opacity-10 p-4">Web</div>
          </div>-->
        </div>
      </div>
    </div>
    <div class="hero max-w-5xl mx-auto mt-64 md:mt-96 lg:mt-32">
      <div class="hero-content flex-col lg:flex-row-reverse text-center lg:text-left">
          <div
            class="prose"
            :class="{'text-neutral' : props.ciclo === 'day', 'text-neutral-content' : props.ciclo === 'night'}"
          >
            <p class="my-4 text-2xl">LUZ NEGRA está dirigido por Inés Trigub y Santiago Toyos.  Junto a un equipo de profesionales con amplia experiencia, producimos VIDEO, ANIMACIÓN, MOTION GRAPHICS, DISEÑO GRÁFICO y DISEÑO WEB, combinando técnicas tradicionales con las nuevas tecnologías.</p>
            <p class="my-4 text-2xl">Buscamos la síntesis necesaria para comunicar de manera original y efectiva tu mensaje.</p>
          </div>
        <img
          src="/images/bety.gif"
          loading="lazy"
          class="max-w-sm w-full rounded-lg"
          width="540"
          height="540"
          alt="Qué hacemos"
        />
      </div>
    </div>
  </section>
</template>