const withMT = require("@material-tailwind/react/utils/withMT");

// Allows Tailwind opacity modifiers (e.g. `bg-bg-card/80`, `text-foreground/70`)
// to work on colors backed by CSS variables. Without this, those utilities are
// silently dropped and elements fall back to the wrong color in dark mode.
function withAlpha(variable) {
  return ({ opacityValue } = {}) => {
    if (opacityValue === undefined) {
      return `var(${variable})`;
    }
    return `color-mix(in srgb, var(${variable}) calc(${opacityValue} * 100%), transparent)`;
  };
}

const SCALE_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

// Flat hyphenated keys (e.g. `primary-500`) because the base keys
// (`primary`, `secondary`, `tertiary`) are taken by single-value hex colors.
function flatScale(prefix) {
  const out = {};
  SCALE_STEPS.forEach((step) => {
    out[`${prefix}-${step}`] = withAlpha(`--color-${prefix}-${step}`);
  });
  return out;
}

// Nested scale object (e.g. `info: { 500: ... }`).
function nestedScale(prefix) {
  const out = {};
  SCALE_STEPS.forEach((step) => {
    out[step] = withAlpha(`--color-${prefix}-${step}`);
  });
  return out;
}

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
      },

      // Cidade Ativa design-system token scales (shared with citizen platform).
      // Driven by the CSS variables in src/styles/globals.css so they respond to
      // dark mode, with working opacity modifiers via withAlpha().
      ...flatScale("primary"),
      ...flatScale("secondary"),
      ...flatScale("tertiary"),

      info: nestedScale("info"),
      success: nestedScale("success"),
      alert: nestedScale("alert"),
      destructive: nestedScale("destructive"),

      background: withAlpha("--color-background"),
      foreground: withAlpha("--color-foreground"),
      "bg-card": withAlpha("--color-bg-card"),
      "border-card": withAlpha("--color-border-card"),
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
        full: "9999px",
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
