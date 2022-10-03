<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style>
  .gradient-bold {
    position: relative;
    border-radius: 1.5rem;
    width: 100%;
  }
  .gradient-bold::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 1.5rem;
    padding: 4px;
    /*width: 100%;*/
    background: linear-gradient(135deg, hsl(var(--s)) 0%, hsl(var(--s)) 50%, hsl(var(--p)) 100%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
  .gradient-border {
    position: relative;
    border-radius: 1rem;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    width: 100%;
  }
  .gradient-border::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 1rem;
    padding: 2px;
    width: 100%;
    background: linear-gradient(90deg, hsl(var(--s)) 0%, hsl(var(--s)) 50%, hsl(var(--p)) 100%);
    background-size: 400% auto;
    background-position: 0 0;
    /*opacity: 0.5;*/
    transition: background-position 0.3s ease-in-out, opacity 0.2s ease-in-out;
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
  .gradient-border:hover::before {
    background-position: -50% 0;
    opacity: 1;
  }
  </style>