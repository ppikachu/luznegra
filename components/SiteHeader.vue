<script setup>
const config = useRuntimeConfig()
</script>

<template>
  <div class="bg-base-100n">
    <div class="navbar bg-base-100 container mx-auto md:px-8">
      <div class="navbar-start">
        <div class="dropdown">
          <label tabindex="0" class="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
          </label>
          <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
            <li><a>Quienes somos</a></li>
            <li><a>Portfolio</a></li>
            <li><a>Micromerciales</a></li>
          </ul>
        </div>
        <a href="/">
          <img class="w-48 ml-2" src="/images/tuboluz.png" :alt="config.public.TEAM_NAME" />
        </a>
      </div>
      <div class="navbar-center hidden lg:flex">
        <ul class="menu menu-horizontal p-0">
          <li><a href="#quienes_somos">Quienes somos</a></li>
          <li><a href="#portfolio">Portfolio</a></li>
          <!--<li><a>Micromerciales</a></li>-->
        </ul>
      </div>
    </div>
  </div>
</template>