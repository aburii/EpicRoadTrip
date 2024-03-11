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
					'100': '#efefef',
					'200': '#dcdcdc',
					'300': '#bdbdbd',
					'400': '#989898',
					'500': '#7c7c7c',
					'600': '#656565',
					'700': '#525252',
					'800': '#464646',
					'900': '#3d3d3d',
					'950': '#292929',
				},
			},
			fontFamily: {
				sans: 'var(--font-family)',
			},
		},
	},
} satisfies Config;
