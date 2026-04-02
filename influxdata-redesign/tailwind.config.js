/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#0B0F1A', 800: '#111827', 700: '#1a2035' },
        cyan: { 400: '#22ADF6', 500: '#1a9de0' },
        neon: { 400: '#34D399' },
        amber: { 400: '#F59E0B' },
      },
      fontFamily: {
        sans: ['"General Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
