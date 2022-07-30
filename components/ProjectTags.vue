<script setup>
const { data } = await useAsyncData('tags', async (nuxtApp) => {
  const { $contentfulClient } = nuxtApp
  return $contentfulClient.getTags()
})
const tags = data
console.log(tags)

/*function filterProjects(tags: string[]) {
  return posts.items.filter(post => {
    return post.fields.tags.some(tag => tags.includes(tag))
  })
}*/
</script>

<template>
  <section id="tags" class="pb-8 flex flex-col">
    <div class="">categorías:</div>
    <div class="btn-group">
      <button v-for="(tag, i) in tags.items" class="btn btn-xs">
        {{ tag.name }}
      </button>
    </div>
  </section>
</template>