/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'chess-active': '#77ff38',
        'chess-default': '#E7EBEF',
        'chess-dark': '#1A2027',
        'chess-control': '#333436',
        'chess-danger': '#fd0000',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        '6xl': '6rem',
      },
    },
  },
  plugins: [],
}
