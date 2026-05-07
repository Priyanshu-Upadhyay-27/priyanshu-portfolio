/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        dataRipple: {
          '0%, 100%': { transform: 'translateZ(5px)' },
          '50%': { transform: 'translateZ(60px)' },
        }
      },
      animation: {
        dataRipple: 'dataRipple 2.5s ease-in-out infinite',
      },
      colors: {
        'charcoal': '#121212',
        'near-black': '#0a0a0a',
        'soft-white': '#f5f5f5',
        'teal': '#009394',
        'muted-green': '#006270',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'SF Pro Display', 'sans-serif'],
        display: ['Inter', '-apple-system', 'SF Pro Display', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
