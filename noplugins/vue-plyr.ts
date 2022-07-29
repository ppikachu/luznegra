import VuePlyr from 'vue-plyr/dist/vue-plyr.ssr'
import 'vue-plyr/dist/vue-plyr.css'
export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(VuePlyr, { plyr: {} })
})