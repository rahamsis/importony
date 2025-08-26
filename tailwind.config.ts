import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage:{
        postService: "url(/images/banner/banner2.png)"
      },
      colors : {
        primary: "#1f1f1f",
        buttonGray: "#f0f0f0",
        top_bar: "#f48380",
        banner: "#fedbe1",
        gray: "#696969",
        lightGray: "#f7f7f7"
      }
    },
    screens: {
      "xxs": "280px",
      "xs": "320px",
      "ss": "480px",
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "x": "1216px",
      "xl": "1280px",
      "2xl": "1536px",
    },
  },
  plugins: [],
};

export default config