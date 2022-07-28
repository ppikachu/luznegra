/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: ["synthwave", "dark", "halloween"],
    darkTheme: "synthwave",
  },
}
