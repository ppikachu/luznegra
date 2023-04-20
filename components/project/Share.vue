<script setup lang="ts">
/* Define props */
const props = defineProps({
  project: { type: Object, required: true },
})
const config = useRuntimeConfig()
const { text, isSupported, copy, copied } = useClipboard()
const sound = useSound('/sounds/Click03.mp3')
//const soundClose = useSound('/sounds/close.mp3', { volume: 0.5 })

function closeProject() {
  copy(config.HOST+'/proyecto/'+props.project.slug)
  sound.play()
}

</script>

<template>
  <div class="pt-4 md:pt-0">
    <p class="text-sm mb-1 ml-3 text-zinc-400 md:text-right">{{ $t('link_compartir') }}:</p>
    <div v-if="isSupported" class="form-control">
      <div class="input-group input-group-sm">
        <span class="input input-sm text-zinc-400 truncate">
          {{ config.HOST+'/proyecto/'+project.slug }}
        </span>
        <div class="tooltip tooltip-primary" :data-tip="copied ? $t('copied') : $t('link_copy')">
        <button
          @click="closeProject"
          class="btn btn-sm btn-square btn-secondary rounded-l-none"
        >
          <IconCSS name="mdi:clipboard-outline" />
        </button>
        </div>
      </div>
    </div>
    <div v-else class="text-xs text-zinc-400">
      <a :href="config.HOST+'/proyecto/'+project.slug" class="link link-primary">{{ project.slug }}</a>
    </div>
  </div>
</template>