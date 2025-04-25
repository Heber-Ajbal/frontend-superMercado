/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
    './app.vue',
    './error.vue',
    './node_modules/flowbite/**/*.{js,ts}',
  ],
  safelist: [
    'text-blue-700',
    'text-emerald-600',
    'text-orange-600',
    'text-red-600',
    'text-fuchsia-600',
    'text-indigo-700',
    'text-pink-600',
    'text-teal-600'
  ]
  ,
  theme: {
    extend: {},
  },
  plugins: [require('flowbite/plugin')],
}
