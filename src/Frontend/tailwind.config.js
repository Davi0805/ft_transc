// tailwind.config.js
module.exports = {
  content: [
    "./index.html",
    "./code/**/*.{ts,js}",     
    "./css/**/*.{css}",        
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'sans': ['Poppins', 'sans-serif'],
      },
      colors: {
        myWhite: '#fff',
        myBlack: '#333',
      },
      scale: {
        '85': '0.85',
      },
    },
  },
  plugins: [],
};

