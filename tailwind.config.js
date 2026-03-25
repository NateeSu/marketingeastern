/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#1c1008',
        },
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.35s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pop': 'pop 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%':   { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)',    opacity: '1' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #1c1008 0%, #3d2007 50%, #92400e 100%)',
        'card-shine':    'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 100%)',
      },
      boxShadow: {
        'yellow-glow': '0 0 20px rgba(251,191,36,0.35)',
        'card':        '0 2px 12px rgba(0,0,0,0.08)',
        'card-hover':  '0 8px 24px rgba(0,0,0,0.14)',
      },
    },
  },
  plugins: [],
}
