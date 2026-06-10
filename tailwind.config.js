/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // Penting: data berisi class Tailwind (warna unit di learningPath.js)
    "./src/data/**/*.{js,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
