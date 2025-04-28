/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#121212',
        'background-light': '#1E1E1E',
        pink: {
          500: '#FF3C78',
          600: '#E82D69',
          700: '#C62258',
        },
        blue: {
          400: '#4FC3F7',
          500: '#29B6F6',
          600: '#0288D1',
        },
        green: {
          500: '#00E676',
          600: '#00C853',
          700: '#00B248',
        },
        amber: {
          500: '#FFC107',
          600: '#FFB300',
          700: '#FFA000',
        },
        gray: {
          300: '#B0BEC5',
          400: '#78909C',
          600: '#546E7A',
          700: '#37474F',
          800: '#263238',
          900: '#1A1A1A',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'neon': '0 0 5px theme("colors.pink.500"), 0 0 20px theme("colors.pink.500")',
        'neon-blue': '0 0 5px theme("colors.blue.400"), 0 0 20px theme("colors.blue.400")',
        'neon-green': '0 0 5px theme("colors.green.500"), 0 0 20px theme("colors.green.500")',
        'neon-red': '0 0 5px theme("colors.red.500"), 0 0 20px theme("colors.red.500")',
      },
      animation: {
        'gradient': 'gradient 8s ease infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};