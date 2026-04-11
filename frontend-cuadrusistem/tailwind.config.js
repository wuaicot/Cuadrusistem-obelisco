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
        // 1rem para nombre, 4.5rem para etiquetas, y celdas de números flexibles pero compactas
        'planilla': 'minmax(1rem, auto) minmax(4.5rem, 6rem) repeat(19, minmax(0, 1fr))',
      }
    },
  },
  plugins: [],
}
