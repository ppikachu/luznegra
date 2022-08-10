<script setup>

</script>

<template>
  <main class="block">

    <Hero />
    <section class="mt-12">
      <div class="hero container bg-secondary">
        <div class="hero-content flex-col lg:flex-row">
          <img
            src="/images/et2.gif"
            class="max-w-sm w-full rounded-lg"
            width="540"
            height="540"
            alt="Quienes somos"
          />
          <div>
            <h1 class="text-5xl font-bold">Quienes somos</h1>
            <p class="py-6 text-xl">Luz-negra es un Estudio Multimedia dirigido por Inés Trigub y Santiago Toyos. Producimos Animación - Gráfica animada (cine, tv, publicidad, redes sociales, eventos, internet) - Diseño Gráfico - Diseño web - Ilustración.</p>
            <!--<button class="btn btn-primary">Get Started</button>-->
          </div>
        </div>
      </div>
  
      <div class="hero">
        <div class="hero-content flex-col lg:flex-row-reverse">
          <img
            src="/images/bety.gif"
            class="max-w-sm w-full rounded-lg"
            width="540"
            height="540"
            alt="Qué hacemos"
          />
          <div>
            <h1 class="text-5xl font-bold">Qué hacemos</h1>
            <p class="py-6 text-xl">Nuestro objetivo es encontrar una resolución original para cada trabajo, utilizando diversas técnicas y apostando a la experimentación y la combinación de diferentes lenguajes.</p>
          </div>
        </div>
      </div>
    </section>

    <Portfolio />

    <Contact />

  </main>
</template>