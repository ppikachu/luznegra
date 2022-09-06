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
    <div class="hero pt-8 lg:pt-16 max-w-5xl mx-auto">
      <div class="hero-content flex-col lg:flex-row">
        <img
          src="/images/ET_en_nave_transparente.gif"
          loading="lazy"
          class="max-w-sm w-full rounded-lg"
          width="540"
          height="540"
          alt="Quienes somos"
        />
        <div>
          <h1
            :class="{'text-primary': props.ciclo === 'night', 'text-primary-content': props.ciclo === 'day'}"
            class="text-center lg:text-left my-4 text-5xl font-bold"
          >
            Quienes somos
          </h1>
          <div class="prose" :class="{'text-primary-content': props.ciclo === 'day'}">
            <p class="my-4 text-2xl">Luz-negra es un Estudio Multimedia que produce Gráfica Animada.</p>
            <p class="my-4 text-2xl">Cine, tv, publicidad, redes sociales, eventos, Diseño Gráfico, Diseño web, Ilustración.</p>
            <p class="my-4 text-2xl">LUZ NEGRA está dirigido por Inés Trigub y Santiago Toyos y cuenta con un equipo de profesionales con amplia experiencia.</p>
          </div>
        </div>
      </div>
    </div>

    <div class="hero max-w-5xl mx-auto">
      <div class="hero-content flex-col lg:flex-row-reverse">
        <img
          src="/images/bety.gif"
          loading="lazy"
          class="max-w-sm w-full rounded-lg"
          width="540"
          height="540"
          alt="Qué hacemos"
        />
        <div>
          <h1
            :class="{'text-primary': props.ciclo === 'night', 'text-primary-content': props.ciclo === 'day'}"
            class="text-center lg:text-right text-5xl font-bold"
          >
            Qué hacemos
          </h1>
          <div class="prose lg:text-right" :class="{'text-primary-content': props.ciclo === 'day'}">
            <p class="my-4 text-2xl">Buscamos la mejor manera de COMUNICAR las ideas en forma ORIGINAL y CREATIVA.</p>
            <p class="my-4 text-2xl">Nos especializamos en COMUNICACiÓN CREATIVA, dando vida a las ideas y ofreciendo la mejor imagen para tus proyectos.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>