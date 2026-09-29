/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Fő márkaszín – bizalom és profizmus (mélykék)
        primary: {
          DEFAULT: '#1d4ed8', // blue-700
          dark: '#1e40af', // blue-800
        },
        // Kiemelő / CTA – meleg narancs
        accent: {
          DEFAULT: '#f97316', // orange-500
          light: '#fbbf24', // amber-400
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
};
