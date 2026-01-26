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
        // Creates a 21-column grid: 
        // 1 for the vertical ingredient name, 
        // 1 for the segment labels, 
        // 19 for the numbers. Min width is adjusted for responsiveness.
        'planilla': 'min-content max-content repeat(19, minmax(1.75rem, 1fr))',
      }
    },
  },
  plugins: [],
}
