/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fdf2f2',
          100: '#fce4e4',
          200: '#f9c0c0',
          300: '#f28b8b',
          400: '#e85555',
          500: '#c0392b',  // deep blood red
          600: '#a02020',
          700: '#7d1414',
          800: '#560d0d',
          900: '#2e0505',
        },
        gothic: {
          black:  '#0a0608',   // near-void black
          void:   '#110d0f',   // background dark
          shadow: '#1c1318',   // card/surface dark
          stone:  '#2e2329',   // borders, dividers
          ash:    '#5c4f56',   // muted text
          fog:    '#9c8e94',   // secondary text
          bone:   '#e8ddd2',   // primary text
          ivory:  '#f5f0ea',   // headings / highlights
        },
      },
      fontFamily: {
        gothic: ['"Cinzel"', 'Georgia', 'serif'],
        body:   ['"Crimson Text"', 'Georgia', 'serif'],
        mono:   ['"Courier Prime"', 'monospace'],
      },
      backgroundImage: {
        'gothic-radial': 'radial-gradient(ellipse at top, #2e0505 0%, #0a0608 70%)',
        'blood-fade':    'linear-gradient(to bottom, #560d0d, #0a0608)',
      },
      boxShadow: {
        'crimson-sm': '0 0 8px rgba(192, 57, 43, 0.4)',
        'crimson':    '0 0 20px rgba(192, 57, 43, 0.5)',
        'crimson-lg': '0 0 40px rgba(192, 57, 43, 0.7)',
        'abyss':      'inset 0 2px 20px rgba(0,0,0,0.9)',
      },
      borderColor: {
        DEFAULT: '#2e2329',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-out forwards',
        'pulse-glow': 'pulse-glow 2s infinite',
        'flicker':    'flicker 3s infinite',
        'rise':       'rise 0.7s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(192, 57, 43, 0.3)' },
          '50%':      { boxShadow: '0 0 40px rgba(192, 57, 43, 0.7)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '41%':      { opacity: '1' },
          '42%':      { opacity: '0.6' },
          '43%':      { opacity: '1' },
          '80%':      { opacity: '1' },
          '81%':      { opacity: '0.4' },
          '82%':      { opacity: '1' },
        },
        rise: {
          '0%':   { opacity: '0', transform: 'translateY(20px) scale(0.97)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
}