/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── BookHaven Warm Sage & Ivory Palette ────────────────────────────────
        // Primary: sage green (warm, not dark)
        primary: {
          DEFAULT: '#78917B',
          hover:   '#67806A',
          50:  '#F4F7F4',
          100: '#E6EDE6',
          200: '#CCDBCE',
          300: '#A8BEA9',
          400: '#8CA68E',
          500: '#78917B',
          600: '#67806A',
          700: '#546757',
          800: '#435145',
          900: '#2F3A31',
        },
        // Soft olive / muted sage
        sage: {
          DEFAULT: '#A8B5A0',
          50:  '#F6F8F5',
          100: '#EBF0E9',
          200: '#D4DDD0',
          300: '#BAC8B5',
          400: '#A8B5A0',
          500: '#8FA38A',
          600: '#748D6E',
          700: '#5D7258',
          800: '#485847',
          900: '#323F34',
        },
        // Background: warm ivory
        cream: {
          DEFAULT: '#FAF7F0',
          50:  '#FDFCF8',
          100: '#FAF7F0',
          200: '#F3EDE0',
          300: '#E8DECE',
          400: '#D9CEBC',
        },
        // Muted terracotta accent
        terracotta: {
          DEFAULT: '#C98268',
          50:  '#FBF4F1',
          100: '#F5E4DC',
          200: '#EAC5B4',
          300: '#DDA48E',
          400: '#D29278',
          500: '#C98268',
          600: '#B36E55',
          700: '#945A44',
          800: '#774635',
        },
        // Caramel gold
        gold: {
          DEFAULT: '#C9A96A',
          50:  '#FBF6EC',
          100: '#F5E9CE',
          200: '#EBCEA1',
          300: '#DFB577',
          400: '#D4A264',
          500: '#C9A96A',
          600: '#A8883E',
          700: '#896D2E',
          800: '#6B5222',
        },
        // Warm white for cards / modals
        card: '#FFFFFF',
        warmWhite: '#FFFCF7',
        // Main text
        charcoal: '#293B32',
        muted:    '#68736B',
        // Borders
        border: '#E8E2D8',
        warmBorder: '#E8E2D8',
        // Navigation background
        navBg: '#FDFCF8',
        // Semantic success (soft green)
        success: {
          DEFAULT: '#5A7A5E',
          50:  '#F0F7F1',
          100: '#D6EDD9',
          600: '#5A7A5E',
          700: '#486250',
        },
        // Backward-compat aliases — map to warm sage palette
        brand: {
          50:  '#F4F7F4',
          100: '#E6EDE6',
          200: '#CCDBCE',
          300: '#A8BEA9',
          400: '#8CA68E',
          500: '#78917B',
          600: '#67806A',
          700: '#546757',
          800: '#435145',
          900: '#2F3A31',
        },
        // teal → warm sage
        teal: {
          50:  '#F4F7F4',
          100: '#E6EDE6',
          200: '#CCDBCE',
          300: '#A8BEA9',
          400: '#8CA68E',
          500: '#78917B',
          600: '#67806A',
          700: '#546757',
          800: '#435145',
          900: '#2F3A31',
        },
        // navy → deep sage
        navy: {
          50:  '#F4F7F4',
          100: '#E6EDE6',
          200: '#CCDBCE',
          300: '#A8BEA9',
          400: '#8CA68E',
          500: '#78917B',
          600: '#67806A',
          700: '#546757',
          800: '#435145',
          900: '#2F3A31',
        },
        // secondary → soft olive
        secondary: {
          DEFAULT: '#A8B5A0',
          50:  '#F6F8F5',
          100: '#EBF0E9',
          200: '#D4DDD0',
          300: '#BAC8B5',
          400: '#A8B5A0',
          500: '#8FA38A',
          600: '#748D6E',
          700: '#5D7258',
          800: '#485847',
          900: '#323F34',
        },
        // accent → gold
        accent: {
          DEFAULT: '#C9A96A',
          50:  '#FBF6EC',
          100: '#F5E9CE',
          200: '#EBCEA1',
          300: '#DFB577',
          400: '#D4A264',
          500: '#C9A96A',
          600: '#A8883E',
          700: '#896D2E',
          800: '#6B5222',
        },
        // ivory alias
        ivory: {
          DEFAULT: '#FAF7F0',
          50:  '#FAF7F0',
          100: '#F3EDE0',
          200: '#E8DECE',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Georgia', '"Times New Roman"', 'serif'],
      },
      boxShadow: {
        card:         '0 2px 8px 0 rgb(120 145 123 / 0.10), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 12px 28px -5px rgb(120 145 123 / 0.18), 0 4px 10px -5px rgb(0 0 0 / 0.07)',
        nav:          '0 1px 4px 0 rgb(0 0 0 / 0.07)',
        warm:         '0 4px 14px 0 rgb(201 130 104 / 0.20)',
        teal:         '0 4px 14px 0 rgb(120 145 123 / 0.20)',
      },
    },
  },
  plugins: [],
};
