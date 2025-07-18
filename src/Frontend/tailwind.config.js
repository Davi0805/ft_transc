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
      keyframes: {
        progressBar: {
          'from': { width: '100%' },
          'to': { width: '0%' },
        }
      },
      animation: {
        progressBar: 'progressBar 5s linear forwards',
      }
    },
  },
  plugins: [],
};

