/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pastel-lavender': '#e8d5f5',
        'pastel-lavender-dark': '#c9a8e8',
        'pastel-mint': '#c8f5e4',
        'pastel-mint-dark': '#8ee8c0',
        'pastel-peach': '#ffe5cc',
        'pastel-peach-dark': '#ffbf80',
        'pastel-blue': '#cce5ff',
        'pastel-blue-dark': '#80bfff',
        'pastel-yellow': '#fff8cc',
        'pastel-yellow-dark': '#ffe566',
        'pastel-gray': '#f0f0f0',
        'pastel-gray-dark': '#d0d0d0',
        'pastel-pink': '#fce4ec',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        'bounce-in': {
          '0%': { transform: 'scale(0.7)', opacity: '0' },
          '60%': { transform: 'scale(1.1)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bar-grow': {
          '0%': { transform: 'scaleY(0)', opacity: '0' },
          '100%': { transform: 'scaleY(1)', opacity: '1' },
        },
      },
      animation: {
        'bounce-in': 'bounce-in 0.35s ease-out',
        'fade-in': 'fade-in 0.4s ease-out',
        'bar-grow': 'bar-grow 0.5s ease-out',
      },
    },
  },
  plugins: [],
}
