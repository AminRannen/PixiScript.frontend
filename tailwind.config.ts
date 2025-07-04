import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Piximind Primary
        primary: {
          50: '#EEFBDE',
          100: '#D6F1AD',
          200: '#C9EA84',
          300: '#B7E35B',
          400: '#94CF33',
          500: '#79C300', // Main
          600: '#66A300',
          700: '#6FB200',
          800: '#589200',
          900: '#4B7A00',
        },

        // Piximind Gray
        gray: {
          50: '#F8F8F8',
          100: '#E0E0E0',
          200: '#C6C6C6',
          300: '#A8A8A8',
          400: '#8B8B8B',
          500: '#6E6E6E',
          600: '#525252',
          700: '#393939',
          800: '#2D2D2D',
          900: '#1F1F1F',
        },

        // Piximind Blue
        blue: {
          50: '#E5F6F8',
          100: '#C1ECF2',
          200: '#A1E0EB',
          300: '#76D3E4',
          400: '#52C8DD',
          500: '#2FBBD5',
          600: '#00AFCF',
          700: '#0096B7',
          800: '#007E9F',
          900: '#006687',
        },

        // Piximind Pink
        pink: {
          50: '#FFEFF3',
          100: '#FFD6DF',
          200: '#FFB3C5',
          300: '#FF8CA8',
          400: '#FF5A88',
          500: '#FF2D6A',
          600: '#E60052',
          700: '#C00042',
          800: '#990033',
          900: '#730024',
        },

        // Piximind Secondary
        secondary: {
          50: '#EAEEE6',
          100: '#DCE0DC',
          200: '#CAD1C8',
          300: '#BCC6BE',
          400: '#9BD0B8',
          500: '#EAEEEB', // Main
          600: '#DCE0DC',
          700: '#4B5F4C',
          800: '#3D4F3F',
          900: '#2F4031',
        },

        // Piximind Tertiary
        tertiary: {
          50: '#D6F3F4',
          100: '#BEE9EC',
          200: '#A2D8D8',
          300: '#87D1CE',
          400: '#66C6C8',
          500: '#00A6BF', // Main
          600: '#00968F',
          700: '#02787A',
          800: '#005A5D',
          900: '#00414D',
        },

        // System Colors
        success: {
          50: '#E6FCEF',
          100: '#CCF9E0',
          200: '#99F3C2',
          300: '#66EDA3',
          400: '#33E785',
          500: '#00E066',
          600: '#00B351',
          700: '#00873D',
          800: '#005B29',
          900: '#003F1B',
        },
        warning: {
          50: '#FFF9E6',
          100: '#FFF2CC',
          200: '#FFE699',
          300: '#FFDA66',
          400: '#FFCE33',
          500: '#FFC200',
          600: '#CC9B00',
          700: '#997400',
          800: '#664E00',
          900: '#332700',
        },
        red: {
          0: '#FFF5F5',
          1: '#FFE3E3',
          2: '#FFBDBD',
          3: '#FF9B9B',
          4: '#F86A6A',
          5: '#EF4E4E',
          6: '#E12D39',
          7: '#CF1124',
          8: '#AB091E',
          9: '#8A041A',
        },
        text: {
          50: '#FFFFFF',
          100: '#F7F7F7',
          200: '#E1E1E1',
          300: '#CFCFCF',
          400: '#B1B1B1',
          500: '#9E9E9E',
          600: '#7E7E7E',
          700: '#626262',
          800: '#515151',
          900: '#3B3B3B',
        },
      },
    },
  },
  plugins: [],
};

module.exports = config;
