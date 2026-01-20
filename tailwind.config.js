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
          black: 'var(--brand-dark)', // Alias for design system
        },
        text: {
          heading: 'var(--color-text-heading)',
          body: 'var(--color-text-body)',
          eyebrow: 'var(--color-text-eyebrow)',
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          sub: 'var(--color-text-sub)',
        },
        bg: {
          surface: 'var(--color-bg-surface)',
          surfaceSecondary: 'var(--color-bg-surface-secondary)',
          surfaceTertiary: 'var(--color-bg-surface-tertiary)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          input: 'var(--color-border-input)',
          light: 'var(--color-border-light)',
        },
        // Replace primary color scale with brand black (dark)
        primary: {
          50: 'rgba(40, 40, 40, 0.05)',
          100: 'rgba(40, 40, 40, 0.1)',
          200: 'rgba(40, 40, 40, 0.2)',
          300: 'rgba(40, 40, 40, 0.3)',
          400: 'rgba(40, 40, 40, 0.4)',
          500: 'rgba(40, 40, 40, 0.5)',
          600: 'var(--brand-dark)', // #282828 - Main primary color
          700: 'var(--brand-darkDarker)', // #1a1a1a - Hover state
          800: 'rgba(26, 26, 26, 0.8)',
          900: 'rgba(26, 26, 26, 0.9)',
        },
        gray: {
          50: '#f5f5f5',
          200: '#E5E7EB', // For borders (Gray-200)
          300: '#D1D5DB', // For form inputs (Gray-300)
        },
        greys: {
          50: '#F9FAFB',
          100: '#F5F5F5',  // var(--base-muted)
          300: '#D4D4D4',
          500: '#6B7280',  // Similar to gray-500
          600: '#4B5563',
          700: '#374151',
          900: '#111827',   // Dark text
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
        sans: ['Figtree', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'h1-hero': [
          'var(--text-h1)', // 64px - Desktop size per spec
          { 
            lineHeight: '1.1', 
            fontWeight: '800', // ExtraBold
            letterSpacing: '-0.02em' // Tight tracking
          }
        ],
        'h2-section': [
          'var(--text-h2)', // 40px - Desktop size per spec
          { 
            lineHeight: '1.2', 
            fontWeight: '700', // Bold
            letterSpacing: '-0.01em'
          }
        ],
        'h3-card': [
          'var(--text-h3)', // 24px - Card Title per spec
          { 
            lineHeight: '1.3', 
            fontWeight: '600', // SemiBold
            letterSpacing: '0em' // Normal
          }
        ],
        'subtitle': [
          'var(--text-subtitle)', // 18px mobile / 20px desktop
          { 
            lineHeight: '1.5', 
            fontWeight: '500', // Medium
            letterSpacing: '0em'
          }
        ],
        'body-text': [
          'var(--text-body)', // 16px - Base font size, same on all devices
          { 
            lineHeight: '1.6', 
            fontWeight: '400', // Regular
            letterSpacing: '0em'
          }
        ],
        'small-label': [
          'var(--text-small)', // 14px - Same on all devices
          { 
            lineHeight: '1.4', 
            fontWeight: '500', // Medium
            letterSpacing: '0.01em' // Wide
          }
        ],
        'button-text': [
          'var(--text-button)', // 15px - Fixed per spec
          { 
            lineHeight: '1', 
            fontWeight: '500', // Medium (per spec, not SemiBold)
            letterSpacing: '0em'
          }
        ],
        'eyebrow': [
          'var(--text-eyebrow)', // 12px
          { 
            lineHeight: '1.4', 
            fontWeight: '700', // Bold
            letterSpacing: '0.05em', // Wide tracking
            textTransform: 'uppercase'
          }
        ],
        // Fluid Typography - Responsive scaling
        'fluid-xs': ['var(--text-fluid-xs)', { lineHeight: 'var(--leading-4)' }],
        'fluid-sm': ['var(--text-fluid-sm)', { lineHeight: 'var(--leading-5)' }],
        'fluid-base': ['var(--text-fluid-base)', { lineHeight: 'var(--leading-5)' }],
        'fluid-lg': ['var(--text-fluid-lg)', { lineHeight: 'var(--leading-6)' }],
        'fluid-xl': ['var(--text-fluid-xl)', { lineHeight: 'var(--leading-7)' }],
        'fluid-2xl': ['var(--text-fluid-2xl)', { lineHeight: 'var(--leading-7)' }],
        // Legacy aliases for backward compatibility
        'h4-sub': ['var(--text-h4)', { lineHeight: '1.4', fontWeight: '600' }],
        'nav-text': ['var(--text-small)', { lineHeight: '1.5', fontWeight: '500' }],
        'text-xs': ['var(--text-xs)', { lineHeight: '1.5' }],
      },
      letterSpacing: {
        'button': '0.0625rem', // 1px for buttons/CTAs (legacy)
      },
      boxShadow: {
        'subtle': 'var(--shadow-subtle)',
        'card': 'var(--shadow-card)',
        'mk-dashboard-card': 'var(--mk-dashboard-card-shadow)',
        'nsc-card': 'var(--nsc-card-shadow)',
      },
      borderRadius: {
        '2xl': '1rem',
        'card': 'var(--radius-card)', // 12px or 16px
        'btn': 'var(--radius-btn)', // 8px
      },
    },
  },
  plugins: [],
}
