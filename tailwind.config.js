/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#1E293B', // A deep navy blue for backgrounds
        'brand-card': '#334155', // A slightly lighter color for cards
        'brand-primary': '#10B981', // The vibrant green for positive numbers/buttons
        'brand-secondary': '#64748B', // A neutral gray for text
        'brand-danger': '#EF4444', // A clear red for negative numbers
      },
    },
  },
  plugins: [],
}
