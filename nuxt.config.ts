// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	telemetry: false,
	typescript: {
		//shim: false,
		//typeCheck: true
	},
	nitro: {
		//WARN: on for deploying to vercel, off to test build in dev:
		//preset: 'vercel-edge',
	},
	modules: [
		'nuxt-graphql-client',
		'@nuxtjs/tailwindcss',
		'@nuxtjs/google-fonts',
		'@vueuse/nuxt',
		'@kevinmarrec/nuxt-pwa',
		'nuxt-icon',
		'@nuxtjs/i18n',
		'@nuxtjs/turnstile',
		'@nuxtjs/device',
		'@nuxt/devtools',
	],
	turnstile: {
		siteKey: '0x4AAAAAAAAnaWdzLNaGsIA-',
	},
	i18n: {
		locales: [
			{ code: 'es',  iso: 'es',name: 'Español', file: 'es.json' },
			{ code: 'en',  iso: 'en',name: 'English', file: 'en.json' },
		],
		defaultLocale: 'es',
		langDir: 'lang',
		vueI18n: {
			fallbackLocale: 'es',
		},
	},
	runtimeConfig: {
		public: {
			CONTENT_KEY: process.env.CONTENT_KEY,
			SPACE_ID: process.env.SPACE_ID,
			ACCESS_TOKEN: process.env.ACCESS_TOKEN,
			HOST: process.env.NODE_ENV === 'production' ? 'https://luz-negra.com' : 'https://localhost:3000',
			TEAM_NAME: 'LUZ NEGRA',
			TEAM_LOGO_IMAGE_ON_FOOTER: '/images/tubos_loop_ani.png',
		},
		turnstile: {
			secretKey: process.env.TURNSTILE_SECRET_KEY,
		},
	},
	css: [
		// https://github.com/sampotts/plyr#options
		'vue-plyr/dist/vue-plyr.css',
		// Global CSS
    '@/assets/global.css',
	],
	googleFonts: {
		families: {
			'Varela Round': true,
			//'Open Sans': true,
		}
	},
	pwa: {
		manifest: {
			name: 'LUZ NEGRA - Diseño y animación',
			short_name: 'LUZ NEGRA',
			lang: 'es',
			description: 'Diseño y animación',
			background_color: '#212121',
			theme_color: '#212121',
		},
		meta: {
			mobileApp: false,
			name: 'LUZ NEGRA - Diseño y animación',
			author: 'LUZ NEGRA',
			description: 'Diseño y animación',
			ogHost: process.env.NODE_ENV === 'production' ? 'https://luz-negra.com' : 'http://localhost:3000',
			ogImage: '/OG.png',
			twitterCard: 'summary_large_image',
		}
	},
	'graphql-client': {
		clients: {
			default: {
				host: 'https://graphql.contentful.com/content/v1/spaces/jwdsialp51tb/',
				headers: {
					'Authorization': 'Bearer ' + process.env.ACCESS_TOKEN,
				}
			}
		}
	}
})
