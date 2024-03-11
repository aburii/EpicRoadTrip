import type { Config } from "tailwindcss";

export default {
	content: [
		"./components/**/*.{js,vue,ts}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./nuxt.config.ts",
		"./app.vue",
	],
	theme: {
		extend: {
			colors: {
				'yellow-orange': {
					'50': '#fff8eb',
					'100': '#ffeac6',
					'200': '#ffd388',
					'300': '#ffb13d',
					'400': '#ff9c20',
					'500': '#f97607',
					'600': '#dd5202',
					'700': '#b73506',
					'800': '#94280c',
					'900': '#7a230d',
					'950': '#460f02',
				},
				'white-gray': {
					'50': '#ffffff',
					'100': '#ffffff',
					'200': '#ffffff',
					'300': '#ffffff',
					'400': '#e6e6e6',
					'500': '#c9c9c9',
					'600': '#b3b3b3',
					'700': '#9e9e9e',
					'800': '#919191',
					'900': '#8a8a8a',
					'950': '#757575',
				},
			},
			fontFamily: {
				sans: 'var(--font-family)',
			},
		},
	},
} satisfies Config;