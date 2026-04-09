// frontend-cuadrusistem/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        // 1.5rem for vertical name, 6rem to 8rem for labels, and flexible for numbers
        'planilla': 'minmax(1.5rem, auto) minmax(6rem, 8rem) repeat(19, minmax(1.1rem, 1fr))',
      }
    },
  },
  plugins: [],
}
