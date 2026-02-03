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
        arqia: {
          olive: "var(--arqia-olive)",
          white: "var(--arqia-white)",
          ink: "var(--arqia-ink)",
          brassLight: "var(--arqia-brass-light)",
          brassDark: "var(--arqia-brass-dark)",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "ui-serif", "Georgia"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};
export default config;
