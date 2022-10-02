<script setup lang="ts">
  /* Define props */
  interface Props{
    ciclo: String,
    color?: String, 
  }
  const props = defineProps<Props>()
  
  const openTeam = ref(null)
  const TeamProfile = ref(null)

  function openPerfil(quien: string) {
    openTeam.value = true
    TeamProfile.value = quien
  }

  //const sound = useSound('/audio/Click03.mp3')
  //const soundClose = useSound('/audio/close.mp3', { volume: 0.5 })
  
  function closeProject() {
    //soundClose.play()
    openTeam.value = false
  }

  const colorClass = computed(() => {
    return props.ciclo === 'day' ? 'text-white' : 'text-primary'
  })

  const colorP = computed(() => {
    return props.ciclo === 'day' ? 'text-neutral' : 'text-neutral-content'
  })
</script>

<template>
  <section id="about-us" class="py-16 md:py-32 px-4 md:px-8 text-center" :style="`background-color: ${ props.color }`" >

    <div class="flex flex-col lg:flex-row place-items-center max-w-6xl mx-auto">
      <img class="w-2/3 md:w-1/2 lg:w-full mb-8" src="/images/ET.gif" />
      <div class="lg:text-left prose">
        <h1 class="text-4xl md:text-5xl" :class="colorClass" >
          {{ $t('welcome') }}
        </h1>
        <p class="text-3xl" :class="colorP" >
          {{ $t('nos1') }}
          <span :class="colorClass">{{ $t('nos2') }}</span>
          {{ $t('nos3') }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 place-items-center max-w-6xl mx-auto mt-32">
      <p class="text-2xl prose lg:text-right" :class="colorP" >
        {{ $t('dir1a') }}
        <button @click="openPerfil('ines')" class="link link-primary">Inés Trigub</button>
        {{ $t('sin5') }}
        <button @click="openPerfil('santi')" class="link link-primary">Santiago Toyos</button>{{ $t('dir1b') }}
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
  <ClientOnly>
      <Teleport to="body">
        <div
          v-if="openTeam"
          id="modal-team"
          class="modal bg-black/80 backdrop-blur backdrop-grayscale"
          :class="{ 'modal-open': openTeam }"
        >
          <Perfil @close-me="closeProject" :name="TeamProfile" />
        </div>
      </Teleport>
  </ClientOnly>

</template>
<style scoped>
  #about-us {
    position: relative;
    top: 100vh;
  }
</style>