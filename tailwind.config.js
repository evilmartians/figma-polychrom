/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{ts,tsx}'],
  plugins: [],
  theme: {
    extend: {
      fontFamily: {
        martian: ['martian', 'monospace'],
      },
      fontSize: {
        '7.5xl': '5.25rem',
        '8.5xl': '6.75rem',
        xxs: '0.625rem',
      },
    },
  },
};
