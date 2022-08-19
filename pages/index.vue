<script setup>

</script>

<template>
  <main class="block">

    <HeroOnOffOrtho />
    <section class="mt-12 max-w-5xl mx-auto">
      <div class="hero bg-secondaryx">
        <div class="hero-content flex-col lg:flex-row">
          <img
            src="/images/et1.gif"
            class="max-w-sm w-full rounded-lg"
            width="540"
            height="540"
            alt="Quienes somos"
          />
          <div>
            <h1 class="my-4 text-5xl font-bold">Quienes somos</h1>
            <p class="my-4 text-2xl">Luz-negra es un Estudio Multimedia dirigido por Inés Trigub y Santiago Toyos.</p>
            <p class="my-4 text-2xl">Producimos Animación.</p>
            <div class="flex flex-col gap-4">
              <div class="flex gap-2">
                <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-6 w-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Gráfica animada (cine, tv, publicidad, redes sociales, eventos, internet)</div> 
              <div class="flex gap-2">
                <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-6 w-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Diseño Gráfico</div>
              <div class="flex gap-2">
                <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-6 w-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Diseño web </div>
              <div class="flex gap-2">
                <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-6 w-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Ilustración</div>
            </div>
          </div>
        </div>
      </div>
  
      <div class="hero bg-primaryx">
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
            <p class="my-4 text-2xl">Nuestro objetivo es encontrar una resolución original para cada trabajo, utilizando diversas técnicas y apostando a la experimentación y la combinación de diferentes lenguajes.</p>
          </div>
        </div>
      </div>
    </section>

    <Portfolio />

    <Contact />

  </main>
</template>