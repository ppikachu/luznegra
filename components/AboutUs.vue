<script setup>
  import AOS from 'aos'
  import 'aos/dist/aos.css'

  /* Define props */
  const props = defineProps({
    ciclo: { type: String, default: 'noche' },
    color: String
  })

  const openTeam = ref(false)
  const TeamProfile = ref()

  function openPerfil(quien) {
    openTeam.value = true
    TeamProfile.value = quien
  }

  const soundClose = useSound('/sounds/close.mp3', { volume: 0.5 })
  
  function closeProject() {
    soundClose.play()
    openTeam.value = false
  }

  const colorClass = computed(() => {
    return props.ciclo === 'day' ? 'text-white' : 'text-primary'
  })

  const colorP = computed(() => {
    return props.ciclo === 'day' ? 'text-neutral' : 'text-neutral-content'
  })

  onMounted(() => {
    AOS.init({
      // Global settings:
      offset: 120, // offset (in px) from the original trigger point
      delay: 0, // values from 0 to 3000, with step 50ms
      duration: 400, // values from 0 to 3000, with step 50ms
      easing: 'ease', // default easing for AOS animations
      once: true, // whether animation should happen only once - while scrolling down
      anchorPlacement: 'top-bottom', // defines which position of the element regarding to window should trigger the animation
    })
  })

</script>

<template>
  <section
    id="about-us"
    class="py-16 md:py-32 px-4 md:px-8 text-center"
    :style="`background-color: ${ props.color }`"
  >
    <div class="flex flex-col lg:flex-row place-items-center max-w-6xl mx-auto">
      <img class="w-2/3 md:w-1/2 lg:w-full mb-8" src="/images/ET.gif" alt="Luz Negra" width="540" height="540" data-aos="zoom-in" loading="lazy" />
      <div class="lg:text-left prose">
        <h1 class="text-4xl md:text-5xl" :class="colorClass" data-aos="fade-up" >
          {{ $t('welcome') }}
        </h1>
        <p class="text-3xl" :class="colorP" data-aos="fade-up" >
          {{ $t('nos1') }}
          <span :class="colorClass">{{ $t('nos2') }}</span>
          {{ $t('nos3') }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 place-items-center max-w-6xl mx-auto mt-32">
      <p class="text-2xl prose lg:text-right" :class="colorP" data-aos="fade-up" >
        {{ $t('dir1a') }}
        <button @click="openPerfil('ines')" class="link" :class="colorClass">Inés Trigub</button>
        {{ $t('sin5') }}
        <button @click="openPerfil('santi')" class="link" :class="colorClass">Santiago Toyos</button>{{ $t('dir1b') }}
        <span :class="colorClass">{{ $t('dir2') }}</span>
        {{ $t('dir3') }}
      </p>
      <img class="max-w-sm w-full" src="/images/BETTY.gif" alt="quienes somos" width="540" height="540" data-aos="zoom-in" loading="lazy" />
      <p class="text-3xl md:text-4xl prose" :class="colorP" data-aos="fade-up" >
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
      <transition
        enter-active-class="transition ease-out duration-200 transform"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition ease-in duration-200 transform"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="openTeam"
          id="modal-team"
          class="modal bg-black/80 backdrop-blur backdrop-grayscale-[50%]"
          :class="{ 'modal-open': openTeam }"
        >
          <Perfil @close-me="closeProject" :name="TeamProfile" />
        </div>
      </transition>
    </Teleport>
  </ClientOnly>

</template>