<template>
  <div class="container mx-auto my-8 grid grid-flow-row grid-cols-3 gap-4">

      <div v-for="post in posts.items" class="">
        <div class="card bg-base-100 shadow-xl">
          <figure v-if="post.fields.imageFeatured">
            <img
              :src="`${post.fields.imageFeatured.fields.file.url}?fm=webp`"
              :alt="post.fields.imageFeatured.fields.title"
              class="max-w-full border-round"
            />
              <!-- :loading="i > 0 ? 'lazy' : undefined" -->
          </figure>
          <div class="card-body">
            <h2 class="card-title">{{ post.fields.title }}</h2>
            <p>{{ post.fields.excerpt }}</p>
            <div class="card-actions">
              <button class="btn btn-secondary">Ver</button>
            </div>
          </div>
        </div>
      </div>

  </div>
</template>

<script setup>
  const { $contentfulClient } = useNuxtApp()
  const posts = await $contentfulClient.getEntries({
    content_type: 'entradas'
  })
  console.log(posts)
</script>