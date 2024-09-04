// tailwind.config.js
import flowbite from 'flowbite-react/tailwind'


export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content()
  ],
  theme: {
    extend: {
      fontWeight:{
        "medium":420
      },
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
        "sm":"5px",
        "md":"8px",
        "lg":"10px",
        "xl":"16px"
      }
    },
  },
  plugins: [flowbite.plugin()],
}
