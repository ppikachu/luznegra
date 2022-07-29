<script setup>
const config = useRuntimeConfig()
</script>

<template>
  <main class="block">
    <div class="hero h-96" style="background-image: url(/images/luznegrazilla.jpg);">
      <div class="hero-overlay bg-opacity-60"></div>
      <div class="hero-content text-center text-neutral-content">
        <div class="max-w-md">
          <h1 class="mb-5 text-5xl font-bold">{{ config.public.TEAM_NAME }}</h1>
          <p class="mb-5">{{ config.public.SITE_TOP_DESCRIPTION }}</p>
          <!--<button class="btn btn-primary">Get Started</button>-->
        </div>
      </div>
    </div>

    <Portfolio />

  </main>
</template>