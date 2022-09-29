<script setup lang="ts">
  /* Define props */
  const props = defineProps({
    ciclo: {
    type: String,
    required: false,
    }
  })

  const colorClass = computed(() => {
    return props.ciclo === 'day' ? 'text-white' : 'text-primary'
  })

  const colorP = computed(() => {
    return props.ciclo === 'day' ? 'text-neutral' : 'text-neutral-content'
  })
</script>

<template>
  <section class="py-16 md:py-32 px-4 md:px-8 text-center lg:text-left">
      <div class="grid grid-cols-1 lg:grid-cols-3 place-items-center max-w-6xl mx-auto">
        <h1 class="text-4xl md:text-5xl lg:text-right prose" :class="colorClass" >
          {{ $t('welcome') }}
        </h1>

        <img class="w-2/3 md:w-1/2 lg:w-full mb-8" src="/images/ET.gif" />
        
        <p class="text-3xl prose" :class="colorP">{{ $t('welcome') }}</p>
        
        <p class="text-3xl prose" :class="colorP" >
          {{ $t('nos1') }}
          <span :class="colorClass">{{ $t('nos2') }}</span>
          {{ $t('nos3') }}
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 place-items-center max-w-6xl mx-auto mt-32">
        <p class="text-2xl prose lg:text-right" :class="colorP" >
          {{ $t('dir1') }}
          <span :class="colorClass">{{ $t('dir2') }}</span>
          {{ $t('dir3') }}
        </p>

        <img class="max-w-sm w-full" src="/images/BETTY.gif" />

        <p class="text-3xl md:text-4xl prose" :class="colorP" >
          {{ $t('sin1') }}
          <span :class="colorClass">{{ $t('sin2') }}</span>
          {{ $t('sin3') }}
          <span :class="colorClass">{{ $t('sin4') }}</span>
          {{ $t('sin5') }}
          <span :class="colorClass">{{ $t('sin6') }}</span>
          {{ $t('sin7') }}
        </p>
      </div>
  </section>
</template>