export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: { extend: {
    colors: { ink: '#07090d', paper: '#ece9e2', mute: '#8b909b', volt: '#3d7bff' },
    fontFamily: { display: ['"Instrument Serif"', 'Georgia', 'serif'], sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'] },
  } },
  plugins: [],
}
