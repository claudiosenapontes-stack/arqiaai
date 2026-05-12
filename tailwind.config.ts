import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: "var(--olive)",
        oliveDark: "var(--olive-dark)",
        oliveDeep: "var(--olive-deep)",
        bone: "var(--bone)",
        boneSoft: "var(--bone-2)",
        brassLight: "var(--brass-light)",
        brassDark: "var(--brass-dark)",
        ink: "var(--ink)",
        arqia: {
          olive: "var(--olive)",
          white: "var(--bone)",
          ink: "var(--ink)",
          brassLight: "var(--brass-light)",
          brassDark: "var(--brass-dark)",
        },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "var(--font-sans)", "ui-sans-serif", "system-ui"],
        serif: ["var(--font-serif)", "ui-serif", "Georgia"],
        montserrat: ["var(--font-montserrat)", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
export default config;
