import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        mainBack: 'rgba(var(--mainBack-rgb))',
        mainContent: 'rgba(var(--mainContent-rgb))',
        altContent: 'rgba(var(--altContent-rgb))',
        accent: 'rgba(var(--accent-rgb))',
        highlight: 'rgba(var(--highlight-rgb))',
        altBack: 'rgba(var(--altBack-rgb))',
        mainText: 'rgba(var(--mainText-rgb))',
        lightText: 'rgba(var(--lightText-rgb))',
        darkText: 'rgba(var(--darkText-rgb))'
      },
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: any }) {
      const newUtilities = {
        ".scrollbar-thin": {
          scrollbarWidth: 'thin',
          scrollbarColor: "rgba(0, 0, 0, 0.5) transparent",
        },
        ".scrollbar-webkit": {
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            borderRadius: "20px",
            border: "1px solid transparent"
          },
        }
      }

      addUtilities(newUtilities, ['responsive', 'hover'])
    }
  ],
} satisfies Config;
