/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0F172A', // A richer, darker navy blue
        'brand-card': '#1E293B', // The old dark color is now our card color
        'brand-border': '#334155', // A subtle border color
        'brand-primary': '#10B981',
        'brand-secondary': '#94A3B8', // Lighter gray for text
        'brand-danger': '#EF4444',
      },
    },
  },
  plugins: [],
}
