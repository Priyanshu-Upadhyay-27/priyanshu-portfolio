/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'charcoal': '#121212',
        'near-black': '#0a0a0a',
        'soft-white': '#f5f5f5',
        'teal': '#008080',
        'muted-green': '#5A7D7C',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
