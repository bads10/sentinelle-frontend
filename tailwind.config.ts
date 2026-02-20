import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cybersecurity dark theme
        'cyber-bg': '#0a0e1a',
        'cyber-surface': '#0f1629',
        'cyber-card': '#141c2e',
        'cyber-border': '#1e2d45',
        'cyber-primary': '#00d4ff',
        'cyber-secondary': '#7c3aed',
        'cyber-accent': '#10b981',
        'cyber-danger': '#ef4444',
        'cyber-warning': '#f59e0b',
        'cyber-info': '#3b82f6',
        'cyber-text': '#e2e8f0',
        'cyber-muted': '#64748b',
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          from: { boxShadow: '0 0 5px #00d4ff, 0 0 10px #00d4ff' },
          to: { boxShadow: '0 0 20px #00d4ff, 0 0 40px #00d4ff' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
