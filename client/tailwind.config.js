/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#14161B',
          900: '#1C1F27',
          800: '#262A35',
          700: '#333846',
        },
        paper: {
          50: '#F7F7F5',
          100: '#EFEFEA',
        },
        moss: {
          400: '#3FA98A',
          500: '#1F7A5C',
          600: '#175E46',
        },
        clay: {
          400: '#D68A4C',
          500: '#C06B2E',
        },
      },
      fontFamily: {
        serif: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
