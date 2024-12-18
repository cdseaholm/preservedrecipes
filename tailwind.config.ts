import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        mainBack: 'rgba(var(--mainBack-rgb), var(--mainBack-opacity))',
        mainContent: 'rgba(var(--mainContent-rgb), var(--mainContent-opacity))',
        altContent: 'rgba(var(--altContent-rgb), var(--altContent-opacity))',
        accent: 'rgba(var(--accent-rgb), var(--accent-opacity))',
        highlight: 'rgba(var(--highlight-rgb), var(--highlight-opacity))',
        altBack: 'rgba(var(--altBack-rgb), var(--altBack-opacity))',
        mainText: 'rgba(var(--mainText-rgb), var(--mainText-opacity))',
        lightText: 'rgba(var(--lightText-rgb), var(--lightText-opacity))',
        darkText: 'rgba(var(--darkText-rgb), var(--darkText-opacity))'
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
