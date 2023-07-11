const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class', '.figma-dark'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,svg}'],
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        {
          'text-shadow': (value) => ({
            textShadow: value,
          }),
        },
        { values: theme('textShadow') }
      );
    }),
  ],
  theme: {
    extend: {
      textShadow: {
        DEFAULT: '0px 4px 24px var(--text-shadow-color)',
      },
      fontFamily: {
        martian: ['martian', 'monospace'],
      },
      fontSize: {
        xxs: '0.625rem',
        xxxs: '0.46875rem',
      },
      margin: {
        13: '3.25rem',
      },
      borderRadius: {
        '2.5xl': '1.25rem',
      },
      width: {
        13: '3.25rem',
      },
      height: {
        13: '3.25rem',
      },
      borderWidth: {
        0.5: '0.5px',
      },
      colors: {
        indicatorsHover: 'var(--indicators-hover)',
        indicatorsActive: 'var(--indicators-active)',
        elevation: {
          1: 'var(--elevation-1)',
        },
        universal: {
          25: 'var(--universal-25)',
        },
        secondary: {
          35: 'var(--secondary-35)',
          75: 'var(--secondary-75)',
        },
        focus: 'var(--figma-color-border-selected)',
      },
    },
  },
};
