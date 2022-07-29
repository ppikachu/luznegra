<script setup>
const config = useRuntimeConfig()
</script>

<template>
  <div class="bg-base-100">
    <div class="navbar container mx-auto px-4 md:px-8">
      <div class="flex-1">
        <a href="/">
          <img class="w-32" src="/images/tuboluz.png" :alt="config.public.TEAM_NAME" />
        </a>
      </div>
      <div class="flex-none">
        <ul class="menu menu-horizontal p-0">
          <li><a>Quienes somos</a></li>
          <li tabindex="0">
            <a>
              Portfolio
              <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"/></svg>
            </a>
            <ul class="p-2 bg-base-100">
              <li><a>Submenu 1</a></li>
              <li><a>Submenu 2</a></li>
            </ul>
          </li>
          <li><a>Micromerciales</a></li>
        </ul>
      </div>
    </div>
  </div>
</template>