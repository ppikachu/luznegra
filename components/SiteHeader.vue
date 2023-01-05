<script lang="ts" setup>
  const config = useRuntimeConfig()
</script>

<template>
  <div class="bg-base-100n">
    <div class="navbar bg-base-100 container mx-auto md:px-8">
      <div class="navbar-start"></div>
      <div class="navbar-center">
        <a href="/" class="p-8">
          <img class="w-60" src="/images/logo2022.svg" :alt="config.public.TEAM_NAME" />
        </a>
      </div>
      <div class="navbar-end"></div>
    </div>
  </div>
</template>