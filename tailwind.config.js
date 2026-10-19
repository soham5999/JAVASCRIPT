/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        space: {
          950: '#030306',
          900: '#07070d',
          850: '#0b0c16',
          800: '#111222',
          700: '#1b1d36',
        },
        electric: {
          cyan: '#06b6d4',
          violet: '#8b5cf6',
          indigo: '#6366f1',
          emerald: '#10b981',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 3s infinite',
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'orbit': 'orbit 25s linear infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(1deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(120px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(120px) rotate(-360deg)' },
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 35px -5px rgba(6, 182, 212, 0.4)',
        'glow-indigo': '0 0 35px -5px rgba(99, 102, 241, 0.4)',
        'glow-violet': '0 0 35px -5px rgba(139, 92, 246, 0.4)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
