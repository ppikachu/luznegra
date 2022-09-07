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
        class="px-4 lg:text-left my-4 text-5xl font-bold max-w-md leading-tight lg:leading-none"
        >
        LUZ NEGRA es un Estudio Multimedia que produce Gráfica Animada
        </h1>
        <div
          class="text-center w-full lg:w-96 relative px-4 lg:px-0 text-3xl leading-none"
          :class="{'text-neutral': props.ciclo === 'day', 'text-neutral-content': props.ciclo === 'night'}"
        >
          <img
            src="/images/ET_en_nave_transparente.gif"
            loading="lazy"
            class="absolute -top-1/2 left-1/4 md:left-1/4 md:-top-0 w-1/2 md:w-1/2 lg:w-full lg:-top-8 lg:-left-48"
            width="540"
            height="540"
            alt="Quienes somos"
          />
          <div class="grid justify-items-stretch md:grid-cols-5 lg:grid-cols-1 gap-2">
            <div class="flex items-center justify-center rounded-lg bg-primary bg-opacity-10 p-4">Cine</div>
            <div class="flex items-center justify-center rounded-lg bg-primary bg-opacity-10 p-4">TV</div>
            <div class="flex items-center justify-center rounded-lg bg-primary bg-opacity-10 p-4">Redes Sociales</div>
            <div class="flex items-center justify-center rounded-lg bg-primary bg-opacity-10 p-4">Gráfica</div>
            <div class="flex items-center justify-center rounded-lg bg-primary bg-opacity-10 p-4">Web</div>
          </div>
        </div>
      </div>
    </div>
    <div class="hero max-w-5xl mx-auto mt-32 md:mt-64 lg:mt-32">
      <div class="hero-content flex-col lg:flex-row-reverse text-center lg:text-left">
        <div>
          <h1
            :class="{'text-primary' : props.ciclo === 'night', 'text-neutral' : props.ciclo === 'day'}"
            class="text-5xl px-4 font-bold mb-16"
          >
            Comunicación creativa y síntesis
          </h1>
          <div
            class="prose"
            :class="{'text-neutral' : props.ciclo === 'day', 'text-neutral-content' : props.ciclo === 'night'}"
          >
            <p class="my-4 text-2xl">LUZ NEGRA está dirigido por Inés Trigub y Santiago Toyos y cuenta con un equipo de
              profesionales con amplia experiencia.</p>
            <p class="my-4 text-2xl">Nos especializamos en COMUNICACiÓN CREATIVA, dando vida a las ideas y ofreciendo la
              mejor imagen para tus proyectos.</p>
          </div>
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