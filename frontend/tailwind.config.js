/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,jsx,ts,tsx}", // Mantido apenas uma vez
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'custom-pink': '#ff007f',
        'custom-magenta': '#ff00ff',
        'custom-purple': '#8000ff',
      },
      backgroundImage: theme => ({
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }),
      animation: {
        'spin-slow': 'spin 4s linear',
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    // outros plugins podem ser adicionados aqui
  ],
};
