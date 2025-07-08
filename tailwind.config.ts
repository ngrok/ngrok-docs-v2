import type { Config } from "tailwindcss";
import {
  mantlePreset,
  resolveMantleContentGlob,
} from "@ngrok/mantle/tailwind-preset";

export default {
  presets: [mantlePreset],
  content: [
    resolveMantleContentGlob(require),
    "./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
          "Apple Color Emoji",
          "Segoe UI Emoji",
          "Segoe UI Symbol",
          "Noto Color Emoji",
        ],
      },
    },
  },
  plugins: [],
} satisfies Config;
