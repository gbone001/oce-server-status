/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2B7A78',
          50: '#E6F3F2',
          100: '#CFE9E7',
          200: '#A2D5D1',
          300: '#73C1BB',
          400: '#49B0AA',
          500: '#3AAFA9',
          600: '#2B7A78',
          700: '#205E5C',
          800: '#174746',
          900: '#0F2F2E',
        },
        gold: {
          DEFAULT: '#fbbf24',
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        }
      }
    },
  },
  plugins: [],
}
