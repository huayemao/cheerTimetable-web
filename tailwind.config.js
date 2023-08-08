import colors from "tailwindcss/colors";
const { withShurikenUI } = require("@shuriken-ui/tailwind")

module.exports = withShurikenUI({
  mode: 'jit',
  content: [
    "app/**/*.{ts,tsx}",
    "pages/**/*.{js,ts,jsx,tsx}",
    "components/**/*.{ts,tsx}"
  ],
  darkMode: ['class'],
  theme: {
    extend: {
      colors: {
        primary: colors.violet,
        muted: colors.slate,
        info: colors.sky,
        success: colors.teal,
        danger: colors.rose,
        warning: colors.amber,
      },
    },
  },
})


