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
        'h1-hero': ['3rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h2-section': ['2rem', { lineHeight: '1.3', fontWeight: '700' }],
        'h3-card': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-text': ['1rem', { lineHeight: '1.6', fontWeight: '400' }],
        'button-text': ['0.875rem', { lineHeight: '1.5', fontWeight: '700', letterSpacing: '0.0625rem' }],
        'nav-text': ['0.875rem', { lineHeight: '1.5', fontWeight: '500' }],
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
