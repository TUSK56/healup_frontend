import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './legacy-pages-sources/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-cairo)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        healup: {
          primary: '#0d9488',
          secondary: '#0f766e',
          accent: '#14b8a6',
          muted: '#99f6e4',
        },
        brand: {
          DEFAULT: 'rgb(4 86 174 / <alpha-value>)',
          light: '#EBF3FF',
        },
        success: {
          DEFAULT: '#10B981',
          light: '#ECFDF5',
        },
        warning: {
          DEFAULT: '#F59E0B',
          light: '#FFFBEB',
        },
        primary: '#0055D4',
        'primary-light': '#F0F7FF',
        'primary-hover': '#1E429F',
        danger: '#EF4444',
        'healup-blue': '#0052CC',
        'healup-light-blue': '#E6F0FF',
        'healup-bg': '#F8FAFC',
        'brand-blue': '#004FAC',
        'brand-light-blue': '#E6F0FF',
        'brand-green': '#28A745',
        'brand-light-green': '#E9F7EF',
        'brand-gray': '#6C757D',
        'brand-bg': '#F8F9FA',
      },
    },
  },
  plugins: [],
};
export default config;
