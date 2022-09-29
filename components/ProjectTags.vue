<script setup lang="ts">
/* Define props */
const props = defineProps<{ initTag?: string }>()

const { data } = await useAsyncData('tags', async (nuxtApp) => {
  const { $contentfulClient } = nuxtApp
  return $contentfulClient.getTags()
})

const currentTag = ref(props.initTag)
const emit = defineEmits(['tag'])

function buttonClick(tag) {
  if (tag.sys.id===currentTag.value) {
    currentTag.value = ''
    emit('tag', '')
    return
  }
  emit('tag', tag)
  currentTag.value = tag.sys.id
}
</script>

<template>
  <section id="tags" class="pb-8 flex flex-col items-center">
    <div class="btn-group btn-group-vertical md:btn-group-horizontal">
      <button
        v-for="tag in data.items"
        :key="tag"
        @click="buttonClick(tag)"
        class="btn btn-sm lg:btn-md"
        :class="{ 'btn-active': tag.sys.id == currentTag }"
      >
        <!--{{ tag.name }}-->
        {{ $t(tag.sys.id) }}
      </button>
    </div>
  </section>
</template>