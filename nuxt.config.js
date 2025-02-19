import colors from "vuetify/es5/util/colors";
import firebaseConfig from "./firebase.config.json";

export default {
	// Global page headers (https://go.nuxtjs.dev/config-head)
	head: {
		titleTemplate: "HeadLogger - %s",
		title: "HeadLogger",
		meta: [
			{charset: "utf-8"},
			{name: "viewport", content: "width=device-width, initial-scale=1"}
		],
		link: [
			{rel: "icon", type: "image/x-icon", href: "/favicon.ico"}
		]
	},

	router: {
		extendRoutes(routes, resolve) {
			routes.push({
				path: "/",
				redirect: "/login"
			});
		}
	},
	// Global CSS (https://go.nuxtjs.dev/config-css)
	css: [],

	// Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
	plugins: [
		{src: "~/plugins/v-charts.js", mode: "client"}
	],

	// Auto import components (https://go.nuxtjs.dev/config-components)
	components: true,

	// Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
	buildModules: [
		// https://go.nuxtjs.dev/eslint
		"@nuxtjs/eslint-module",
		// https://go.nuxtjs.dev/vuetify
		"@nuxtjs/vuetify"
	],

	// Modules (https://go.nuxtjs.dev/config-modules)
	modules: [
		// https://go.nuxtjs.dev/axios
		"@nuxtjs/axios",
		// https://go.nuxtjs.dev/pwa
		"@nuxtjs/pwa",
		"@nuxtjs/firebase",
		"vuetify-dialog/nuxt"
	],

	// Axios module configuration (https://go.nuxtjs.dev/config-axios)
	axios: {},

	// Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
	vuetify: {
		customVariables: ["~/assets/variables.scss"],
		icons: {
			iconfont: "mdi" // default - only for display purposes
		},
		theme: {
			dark: true,
			themes: {
				dark: {
					primary: colors.blue.darken2,
					accent: colors.grey.darken3,
					secondary: colors.amber.darken3,
					info: colors.teal.lighten1,
					warning: colors.amber.base,
					error: colors.deepOrange.accent4,
					success: colors.green.accent3
				}
			}
		}
	},

	//PWA
	pwa: {
		manifest: {
			name: "HeadLogger",
			short_name: "HeadLogger",
			background_color: colors.grey.darken4
		},
		meta: {
			name: "HeadLogger"
		},
		workbox: {
			importScripts: [
				"/firebase-auth-sw.js"
			],
			// by default the workbox module will not install the service worker in dev environment to avoid conflicts with HMR
			// only set this true for testing and remember to always clear your browser cache in development
			dev: process.env.NODE_ENV === "development"
		}
	},

	//firebase
	firebase: {
		config: firebaseConfig,
		services: {
			auth: {
				initialize: {
					onAuthStateChangedAction: "onAuthStateChanged"
				}
			},
			firestore: {
				memoryOnly: false,
				static: false
			}
		},
		onFirebaseHosting: true
	},

	// Build Configuration (https://go.nuxtjs.dev/config-build)
	build: {}
};
