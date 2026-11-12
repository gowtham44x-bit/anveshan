import type { Config } from 'tailwindcss';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        estuary: {
          50: '#F0FDF9',
          100: '#CCFBEE',
          200: '#99F6DE',
          300: '#5EEAD0',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0E7468', /* Deep Estuary Green Brand Color */
          700: '#0B5B52',
          800: '#08443D',
          900: '#052D28',
          950: '#031916'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace']
      }
    },
  },
  plugins: [],
} satisfies Config;
