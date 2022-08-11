<script setup>
const config = useRuntimeConfig()
</script>

<template>
  <div class="bg-base-100n">
    <div class="navbar bg-base-100 container mx-auto md:px-8">
      <div class="navbar-start">
        <a href="/">
          <img class="w-48 ml-2" src="/images/tuboluz.png" :alt="config.public.TEAM_NAME" />
        </a>
      </div>
    </div>
  </div>
</template>