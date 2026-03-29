/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'rf-bg': '#000000',
        'rf-fg': '#ffffff',
        'rf-muted': '#71717a',
        'rf-muted-light': '#a1a1aa',
        'rf-border': 'rgba(255,255,255,0.08)',
        'rf-surface': 'rgba(255,255,255,0.03)',
        'rf-zinc-900': '#18181b',
        'rf-zinc-800': '#27272a',
        'rf-zinc-700': '#3f3f46',
        'rf-zinc-600': '#52525b',
        'rf-zinc-500': '#71717a',
        'rf-zinc-400': '#a1a1aa',
        'rf-zinc-300': '#d4d4d8',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'hero': 'clamp(3.5rem, 10vw, 8rem)',
        'display': 'clamp(2.5rem, 6vw, 5rem)',
      },
      animation: {
        'scan': 'scan-line 10s linear infinite',
        'status-ping': 'status-ping 2s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s ease-out infinite',
      },
    },
  },
  plugins: [],
};