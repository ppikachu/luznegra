import * as contentful from "contentful";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const client = contentful.createClient({
    space: config.public.SPACE_ID,
    accessToken: config.public.ACCESS_TOKEN,
  });

  nuxtApp.provide("contentfulClient", client);
});