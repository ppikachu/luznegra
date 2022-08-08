<script setup>

</script>

<template>
  <main class="block">

    <Hero />
    <section class="container mx-auto mt-12">
      <div class="hero bg-base-200">
        <div class="hero-content flex-col lg:flex-row">
          <img src="/images/et2.gif" class="max-w-sm w-full rounded-lg shadow-2xl" />
          <div>
            <h1 class="text-5xl font-bold">Quienes somos</h1>
            <p class="py-6">Luz-negra es un Estudio Multimedia dirigido por Inés Trigub y Santiago Toyos. Producimos Animación - Gráfica animada (cine, tv, publicidad, redes sociales, eventos, internet) - Diseño Gráfico - Diseño web - Ilustración.</p>
            <!--<button class="btn btn-primary">Get Started</button>-->
          </div>
        </div>
      </div>
  
      <div class="hero bg-base-200">
        <div class="hero-content flex-col lg:flex-row-reverse">
          <img src="/images/bety.gif" class="max-w-sm w-full rounded-lg shadow-2xl" />
          <div>
            <h1 class="text-5xl font-bold">Qué hacemos</h1>
            <p class="py-6">Nuestro objetivo es encontrar una resolución original para cada trabajo, utilizando diversas técnicas y apostando a la experimentación y la combinación de diferentes lenguajes.</p>
            <button class="btn btn-primary">Mirá nuestro reel / portfolio</button>
          </div>
        </div>
      </div>
    </section>

    <Portfolio />

    <Contact />

  </main>
</template>