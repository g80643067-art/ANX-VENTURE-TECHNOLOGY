import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#08090B',
        anx: {
          950: '#040507',
          900: '#08090B',
          850: '#0D0F13',
          800: '#13161C',
          700: '#1A1E26',
          600: '#2A303C',
          500: '#434C5E',
          400: '#7E8B9F',
          300: '#B0BCCE',
          200: '#D5DFED',
          100: '#EDF2F8',
          50: '#F7FAFC',
        },
        silver: {
          highlight: '#FFFFFF',
          pure: '#F0F3F7',
          light: '#E2E6EC',
          medium: '#C4CAD3',
          dark: '#8590A2',
        },
        accent: {
          cyan: '#38BDF8',
          blue: '#2563EB',
          meta: '#0081FB',
          glow: 'rgba(56, 189, 248, 0.15)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        widest: '0.25em',
        mega: '0.4em',
      },
      boxShadow: {
        'silver-glow': '0 0 35px -5px rgba(226, 230, 236, 0.12)',
        'blue-glow': '0 0 45px -8px rgba(37, 99, 235, 0.3)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};
export default config;
