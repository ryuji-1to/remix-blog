module.exports = {
  purge: ['./app/**/*.tsx', './app/**/*.jsx', './app/**/*.js', './app/**/*.ts'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp'),
  ],
};
