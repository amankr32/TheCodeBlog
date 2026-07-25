/** @type {import('tailwindcss').Config} */
import flowbite from 'flowbite/plugin';
import tailwindScrollbar from 'tailwind-scrollbar';

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        body: ['"Source Serif 4"', 'Georgia', 'serif'],
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: '#F6F3EC',
        paperdark: '#17160F',
        ink: '#1B1A17',
        inkdark: '#ECE7DA',
        rule: '#C9C2B4',
        ruledark: '#3A362C',
        masthead: '#8A1F11',
        mastheaddark: '#D9694A',
        press: '#253A5E',
        pressdark: '#8AA7CC',
        muted: '#6E6A61',
        muteddark: '#A39C8C',
      },
    },
  },
  plugins: [flowbite, tailwindScrollbar],
};
