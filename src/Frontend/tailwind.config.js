// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./code/**/*.{ts,js}",     
    "./css/**/*.{css}",        
  ],
  theme: {
    extend: {
      'poppins': ['Poppins', 'sans-serif'],
      'sans': ['Poppins', 'sans-serif'],
    },
  },
  plugins: [],
};
