/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'coplace-bg': '#0a0a0a',
        'coplace-orange': '#f97316',
        'coplace-lime': '#84cc16',
      },
      fontFamily: {
        'clash': ['Clash Display', 'sans-serif'],
        'jakarta': ['Plus Jakarta Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
