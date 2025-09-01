import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        "noto-tc": ["var(--font-noto-tc)", "system-ui", "sans-serif"],
        playfair: ["var(--font-playfair)", "serif"],
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-noto-tc)", "system-ui", "sans-serif"],
        ui: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      colors: {
        border: "rgb(var(--border) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        background: {
          DEFAULT: "rgb(var(--background) / <alpha-value>)",
          secondary: "rgb(var(--background-secondary) / <alpha-value>)",
        },
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          hover: "rgb(var(--primary-hover) / <alpha-value>)",
          light: "rgb(var(--primary-light) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          hover: "rgb(var(--secondary-hover) / <alpha-value>)",
        },
        success: {
          DEFAULT: "rgb(var(--success) / <alpha-value>)",
          hover: "rgb(var(--success-hover) / <alpha-value>)",
          light: "rgb(var(--success-light) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "rgb(var(--danger) / <alpha-value>)",
          hover: "rgb(var(--danger-hover) / <alpha-value>)",
          light: "rgb(var(--danger-light) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "rgb(var(--warning) / <alpha-value>)",
          hover: "rgb(var(--warning-hover) / <alpha-value>)",
          light: "rgb(var(--warning-light) / <alpha-value>)",
        },
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius)",
        sm: "var(--radius-sm)",
      },
    },
  },
  plugins: [],
};
export default config;
