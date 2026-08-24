import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0f7f3',
          100: '#d9ede0',
          200: '#b3dbc1',
          300: '#7fc29a',
          400: '#4da672',
          500: '#2d8a54',
          600: '#1f6e42',
          700: '#1B4332',
          800: '#163828',
          900: '#112d20',
          950: '#0a1a13',
        },
        saffron: {
          50: '#fef8ee',
          100: '#fcefd6',
          200: '#f8dbac',
          300: '#f3c177',
          400: '#eda040',
          500: '#C17817',
          600: '#b06510',
          700: '#924c10',
          800: '#773d15',
          900: '#633414',
        },
        maroon: {
          50: '#fdf2f4',
          100: '#fce7ea',
          200: '#f8d0d7',
          300: '#f2a9b6',
          400: '#e97a90',
          500: '#dc4f6e',
          600: '#c82e56',
          700: '#a82148',
          800: '#6B1D2A',
          900: '#5c1a26',
          950: '#340a12',
        },
        parchment: {
          50: '#FDFBF7',
          100: '#F5F0E8',
          200: '#EDE5D5',
          300: '#DDD2BA',
          400: '#C9B998',
          500: '#B5A07A',
          600: '#A18A63',
          700: '#867050',
          800: '#6E5C44',
          900: '#5B4D3B',
        },
        stone: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        },
      },
      fontFamily: {
        heading: ['Crimson Pro', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.4s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'heritage-gradient': 'linear-gradient(135deg, #1B4332 0%, #2d8a54 50%, #1B4332 100%)',
        'saffron-gradient': 'linear-gradient(135deg, #C17817 0%, #eda040 50%, #C17817 100%)',
        'parchment-gradient': 'linear-gradient(180deg, #FDFBF7 0%, #F5F0E8 100%)',
        'maroon-gradient': 'linear-gradient(135deg, #6B1D2A 0%, #a82148 50%, #6B1D2A 100%)',
        'sacred-overlay': 'linear-gradient(180deg, rgba(27,67,50,0.9) 0%, rgba(27,67,50,0.4) 50%, rgba(27,67,50,0.9) 100%)',
      },
      boxShadow: {
        'heritage': '0 4px 20px rgba(27, 67, 50, 0.15)',
        'heritage-lg': '0 8px 40px rgba(27, 67, 50, 0.2)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(0, 0, 0, 0.12)',
        'sacred': '0 4px 20px rgba(107, 29, 42, 0.15)',
      },
      borderRadius: {
        'heritage': '12px',
      },
    },
  },
  plugins: [],
};
export default config;
