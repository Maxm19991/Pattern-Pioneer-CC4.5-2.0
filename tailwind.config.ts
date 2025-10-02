import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Pastel color scheme
        pastel: {
          pink: '#FFB3BA',
          peach: '#FFDFBA',
          yellow: '#FFFFBA',
          mint: '#BAFFC9',
          sky: '#BAE1FF',
          lavender: '#D5BAFF',
          rose: '#FFB3D9',
        },
        primary: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
        },
      },
    },
  },
  plugins: [],
};
export default config;
