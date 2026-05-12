/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8B5CF6", // Electric Purple
          light: "#C4B5FD",
          dark: "#6D28D9",
        },
        secondary: {
          DEFAULT: "#3B82F6", // Electric Blue
          light: "#93C5FD",
          dark: "#1D4ED8",
        },
        accent: "#F472B6", // Pink
        background: "#F8FAFC",
        surface: "#FFFFFF",
        card: "rgba(255, 255, 255, 0.8)",
      },
      borderRadius: {
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '3rem',
      },
      boxShadow: {
        'premium': '0 10px 30px -5px rgba(139, 92, 246, 0.15)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'neon': '0 0 15px rgba(139, 92, 246, 0.3)',
      }
    },
  },
  plugins: [],
}
