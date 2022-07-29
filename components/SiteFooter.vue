<template>
  <footer class="flex flex-col items-center pb-2">
    <img :src="$config.TEAM_LOGO_IMAGE_ON_FOOTER" :alt="$config.TEAM_NAME" class="w-20" />
    <div class="">&copy; {{ new Date().getFullYear() }} <a :href="$config.TEAM_WEBSITE_URL" target="_blank">{{ $config.TEAM_NAME }}</a></div>
  </footer>
</template>