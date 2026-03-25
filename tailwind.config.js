/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#312e81',
          900: '#141E30',
          950: '#050c1a', // Page background (dark navy)
        },
        teal: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          400: '#2dd4bf', // bright mint/teal text
          500: '#14b8a6', // button bright
          600: '#0d9488', // button dark
          700: '#0f766e',
        },
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          400: '#8E9FBE', // cool grey for subtexts
          500: '#64748b',
          700: '#334155',
          800: '#1e293b', 
          900: '#131E2D', // Card bg glassmorphism
          950: '#060A10', // Dark input field bg
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'button-glow': '0 4px 20px -2px rgba(20, 184, 166, 0.4)',
        card: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        'card-teal':
          '0 0 0 1px rgba(45, 212, 191, 0.08), 0 0 48px -12px rgba(45, 212, 191, 0.18), 0 25px 50px -12px rgba(0, 0, 0, 0.55)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
