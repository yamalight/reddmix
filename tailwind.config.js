module.exports = {
  mode: 'jit',
  purge: ['./app/**/*.{ts,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      height: {
        'screen-70': '70vh',
        'screen-80': '80vh',
      },
      maxHeight: {
        'screen-70': '70vh',
        'screen-80': '80vh',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};
