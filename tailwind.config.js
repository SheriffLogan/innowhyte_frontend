/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",                // Include this if you're using Vite
    "./src/**/*.{js,jsx,ts,tsx}",  // This is important: covers all component files
  ],
    theme: {
      extend: {},
    },
    plugins: [],
  }