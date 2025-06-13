/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontSize: {
        xs: "12px",
        sm: "14px",
        base: "16px",
        lg: "17px",
        xl: "20px",
        "2xl": "27px",
        "3xl": "30px",
        "4xl": "36px",
        "5xl": "48px",
      },
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
      },
    },
  },
  plugins: [],
};
