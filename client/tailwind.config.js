/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "primary":"#FF9900",
        "secondary":"#000",
        "util":"#fff",
        "hover":"#6F757E"
      },
      borderColor:{
        "input":"#e6e6eb"
      },
      borderRadius:{
        "lg":"10px"
      }

    },
  },
  plugins: [],
}