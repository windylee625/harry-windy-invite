/** @type {import('tailwindcss').Config} */
export default {
  content: { relative: true, files: ['./index.html', './src/**/*.{js,jsx}'] },
  theme: {
    extend: {
      colors: {
        beige: {
          DEFAULT: '#D8CCB6', // 奶茶米色 Milk Tea Beige
          light: '#E6DDCD',
          dark: '#C4B59B',
        },
        earth: {
          DEFAULT: '#583217', // 深大地棕 Deep Earthy Brown
          light: '#7A5236',
          dark: '#3F230F',
        },
        cream: {
          DEFAULT: '#F5F2EC', // 柔和奶白 Off-White
          light: '#FBF9F5',
        },
      },
      fontFamily: {
        display: ['"Italiana"', '"Cinzel"', 'serif'],
        serif: ['"Cinzel"', '"Playfair Display"', '"Noto Serif TC"', 'serif'],
        elegant: ['"Playfair Display"', '"Noto Serif TC"', 'serif'],
        sans: ['"Inter"', '"Noto Sans TC"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.35em',
        widest3: '0.5em',
      },
      boxShadow: {
        soft: '0 18px 40px -20px rgba(88, 50, 23, 0.35)',
      },
    },
  },
  plugins: [],
};
