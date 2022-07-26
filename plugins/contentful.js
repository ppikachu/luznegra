import {createClient} from "contentful";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()
  const client = createClient({
    space: config.SPACE_ID,
    accessToken: config.ACCESS_TOKEN,
  });

  nuxtApp.provide("contentfulClient", client);
});