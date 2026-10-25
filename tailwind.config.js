/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: '#030712',
          card: 'rgba(15, 23, 42, 0.75)',
          border: 'rgba(56, 189, 248, 0.25)',
          cyan: '#06b6d4',
          emerald: '#10b981',
          amber: '#f59e0b',
          rose: '#f43f5e',
          violet: '#a855f7',
        },
      },
      boxShadow: {
        'neon-cyan': '0 0 20px -2px rgba(6, 182, 212, 0.5), 0 0 8px 0 rgba(6, 182, 212, 0.3)',
        'neon-emerald': '0 0 20px -2px rgba(16, 185, 129, 0.5), 0 0 8px 0 rgba(16, 185, 129, 0.3)',
        'neon-amber': '0 0 20px -2px rgba(245, 158, 11, 0.5), 0 0 8px 0 rgba(245, 158, 11, 0.3)',
        'neon-rose': '0 0 25px 0 rgba(244, 63, 94, 0.6), 0 0 10px 0 rgba(244, 63, 94, 0.4)',
        'inner-glow': 'inset 0 0 15px rgba(6, 182, 212, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'flicker': 'flicker 0.15s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        flicker: {
          '0%': { opacity: '0.9' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
