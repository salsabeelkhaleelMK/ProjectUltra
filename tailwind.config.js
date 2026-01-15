/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/@motork/component-library/**/*.js",
  ],
  presets: [require('@motork/component-library/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          red: 'var(--brand-red)',
          redDark: 'var(--brand-red-dark)',
          dark: 'var(--brand-dark)',
          darkDarker: 'var(--brand-dark-darker)',
          gray: 'var(--brand-gray)',
          slate: 'var(--brand-slate)',
          blue: 'var(--brand-blue)',
          blueLight: 'var(--brand-blue-light)',
          white: 'var(--brand-white)',
          textBody: 'var(--brand-text-body)',
        },
        // Replace primary color scale with brand red
        primary: {
          50: 'rgba(248, 0, 50, 0.05)',
          100: 'rgba(248, 0, 50, 0.1)',
          200: 'rgba(248, 0, 50, 0.2)',
          300: 'rgba(248, 0, 50, 0.3)',
          400: 'rgba(248, 0, 50, 0.4)',
          500: 'rgba(248, 0, 50, 0.5)',
          600: 'var(--brand-red)',
          700: 'var(--brand-red-dark)',
          800: 'rgba(208, 0, 42, 0.8)',
          900: 'rgba(208, 0, 42, 0.9)',
        },
        gray: {
          50: '#f5f5f5',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        sans: ['var(--font-body)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'h1-hero': ['var(--text-h1)', { lineHeight: '1.2', fontWeight: '700' }], /* 28px (reduced from 32px) */
        'h2-section': ['var(--text-h2)', { lineHeight: '1.3', fontWeight: '700' }], /* 24px (was 32px) */
        'h3-card': ['var(--text-h3)', { lineHeight: '1.4', fontWeight: '600' }], /* 20px (was 24px) */
        'h4-sub': ['var(--text-h4)', { lineHeight: '1.4', fontWeight: '600' }], /* 16px (was 20px) */
        'body-text': ['var(--text-body)', { lineHeight: '1.6', fontWeight: '400' }], /* 14px (was 16px) */
        'button-text': ['var(--text-small)', { lineHeight: '1.5', fontWeight: '700', letterSpacing: '0.0625rem' }], /* 12px (was 14px) */
        'nav-text': ['var(--text-small)', { lineHeight: '1.5', fontWeight: '500' }], /* 12px (was 14px) */
        'text-xs': ['var(--text-xs)', { lineHeight: '1.5' }], /* 10px - Below recommended 12px minimum (was 12px) */
      },
      letterSpacing: {
        'button': '0.0625rem', // 1px for buttons/CTAs
      },
      boxShadow: {
        'subtle': 'var(--shadow-subtle)',
        'card': 'var(--shadow-card)',
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}
