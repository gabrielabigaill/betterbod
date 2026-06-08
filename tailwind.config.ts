import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        coral:   { DEFAULT: '#FF6357', dark: '#E04A3F', light: '#FFF0EE' },
        teal:    { DEFAULT: '#00B4A0', dark: '#009688', light: '#E0F7F5' },
        amber:   { DEFAULT: '#F5A623', dark: '#D48F1A', light: '#FEF3DC' },
        cream:   '#FFF8F6',
        charcoal:'#1A1A1A',
        muted:   '#6B7280',
        border:  '#F0EAE8',
      },
      fontFamily: {
        sans:    ['var(--font-inter)', 'sans-serif'],
        display: ['var(--font-playfair)', 'serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}

export default config
