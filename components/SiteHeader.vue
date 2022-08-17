<script setup>
const config = useRuntimeConfig()
</script>

<template>
  <div class="bg-base-100n">
    <div class="navbar bg-base-100 container mx-auto md:px-8">
      <div class="navbar-start"></div>
      <div class="navbar-center">
        <a href="/">
          <img class="w-48" src="/images/tuboluz.png" :alt="config.public.TEAM_NAME" />
        </a>
      </div>
      <div class="navbar-end"></div>
    </div>
  </div>
</template>