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
        // 1rem para nombre, 4.5rem para etiquetas, y 20 celdas para números (incluyendo 0.5)
        'planilla': 'minmax(1rem, auto) minmax(4.5rem, 6rem) repeat(20, minmax(0, 1fr))',
      }
    },
  },
  plugins: [],
}
