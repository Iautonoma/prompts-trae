/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        trae: {
          DEFAULT: '#27cd7e',
          hover: '#20a866', // Versão um pouco mais escura para hover
          light: '#e0fcf0', // Versão clara para fundos
        }
      }
    },
  },
  plugins: [],
};
