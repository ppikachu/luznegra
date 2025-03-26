<script setup lang="ts">
const props = defineProps({
  project: { type: Object },
})
const target = ref(null);
const { elementX, elementY } = useMouseInElement(target);
const cssVars = computed(() => ({
  "--x": `${target.value ? elementX.value : -1000}px`,
  "--y": `${target.value ? elementY.value : -1000}px`,
}));
</script>

<template>
  <div ref="target" :style="cssVars" class="p-[2px] shine rounded-lg cursor-pointer">
    <UCard
      variant="solid"
      class="bg-(--ui-bg)/80 h-full flex flex-col overflow-hidden rounded-md"
      :ui="{
        header: 'p-0 sm:p-0',
        body:'p-2 sm:p-2 flex-grow',
        footer: 'p-2 sm:p-2'
      }"
    >
      <template #header>
        <figure>
          <img v-if="props.project?.imageFeatured"
          :src="`${props.project.imageFeatured.url}?fm=webp&fit=fill&w=600&h=400`"
          :alt="props.project.imageFeatured.title || ''"
          class="w-full"
          loading="lazy"
          width="600"
          height="400"
          />
          <img v-else src="/images/no-image.png" alt="no hay imagen" class="w-full" width="600" height="400" />
        </figure>
      </template>
      
      <h2 class="text-xl lg:text-3xl tracking-tight font-bold text-(--ui-primary) leading-none mb-2">{{ props.project?.title }}</h2>
      <p class="text-(--ui-text)" v-if="props.project?.excerpt">{{ props.project.excerpt }}</p>
      
      <template #footer>
        <ProjectMeta v-if="props.project?.contentfulMetadata.tags[0]" :tags="(props.project.contentfulMetadata.tags)" />
      </template>
    </UCard>
  </div>
</template>

<style scoped>
.shine {
  background-image: radial-gradient(
    300px circle at var(--x) var(--y),
    oklch(0.491 0.27 292.581) 0,
    transparent 100%
  );
}
</style>