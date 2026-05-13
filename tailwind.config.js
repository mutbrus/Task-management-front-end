/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:'#eef4ff',100:'#dbe6ff',200:'#bdd0ff',300:'#90b0ff',
          400:'#5d87ff',500:'#3b66f5',600:'#2748e0',700:'#1f38b8',
          800:'#1f3192',900:'#1f2d75'
        }
      },
      fontFamily: { sans: ['Inter','system-ui','sans-serif'] },
      boxShadow: { soft: '0 4px 20px -4px rgba(0,0,0,0.08)' }
    }
  },
  plugins: []
}
