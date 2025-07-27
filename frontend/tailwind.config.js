/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        ocean: {
          500: '#0ea5e9',
          600: '#0284c7',
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 2s linear infinite',
        'heartbeat': 'heartbeat 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-15px) rotate(1deg)' },
          '66%': { transform: 'translateY(-5px) rotate(-1deg)' },
        },
        scan: {
          '0%': { top: '0' },
          '100%': { top: '100%' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.1)' },
          '50%': { transform: 'scale(1)' },
          '75%': { transform: 'scale(1.05)' },
        },
        glow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.1)'
          },
          '50%': {
            boxShadow: '0 0 30px rgba(255, 255, 255, 0.5), 0 0 60px rgba(255, 255, 255, 0.2)'
          },
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}