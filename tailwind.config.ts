const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: [
    "./src/App.tsx",
    "./src/screens/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "selector",
  theme: {
    colors: {
      primary: "#3E6AE1",
      "primary-dark": "#355BC2",
      "primary-light": "#5D83E7",
      secondary: "#171A20",
      "secondary-dark": "#0F1115",
      "secondary-light": "#393C41",
      tertiary: "#5C5E62",
      slate: {
        50: "#ffffff",
        100: "#f4f4f4",
        200: "#eeeeee",
        300: "#d0d1d2",
        400: "#8e8e8e",
        500: "#5c5e62",
        600: "#393c41",
        700: "#2a2e35",
        800: "#171a20",
        900: "#0f1115",
      }
    },
    fontFamily: {
      primary: ["Montserrat", "sans-serif"],
      secondary: ["Montserrat", "sans-serif"],
    },
    screens: {
      lg: "1080px",
    },
    extend: {
      borderRadius: {
        DEFAULT: "4px",
        sm: "4px",
        md: "4px",
        lg: "4px",
        xl: "4px",
        "2xl": "4px",
        "3xl": "4px",
        full: "4px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
});
