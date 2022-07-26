import * as contentful from "contentful";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const client = contentful.createClient({
    space: config.SPACE_ID,
    accessToken: config.ACCESS_TOKEN,
  });

  nuxtApp.provide("contentfulClient", client);
});