import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Base — near-black navy, per brief
        void: {
          DEFAULT: '#050816',
          800: '#0a0e24',
          700: '#0f1430',
          600: '#161b3d',
        },
        // Primary accent — violet/indigo (the "intelligence" glow), used
        // sparingly now (particles, small neon accents) rather than as a
        // dominant surface color.
        signal: {
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
        },
        // Secondary accent — cyan (the "data" glow)
        pulse: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        // Flat CTA color — replaces the signal gradient on real buttons per
        // the "remove excessive gradients" pass. Gradient is kept only for
        // small decorative brand marks (logo badge, avatar).
        cta: {
          DEFAULT: '#6366F1',
          hover: '#4F46E5',
        },
        // Text — Tailwind's slate scale, chosen for guaranteed contrast
        // against the #050816 base (this was the fix for "text disappears
        // into background"). Keys unchanged from before (100/300/400/500/700)
        // so every existing text-ink-* reference across the app still
        // resolves — only the hex values changed.
        ink: {
          100: '#F8FAFC', // primary
          300: '#CBD5E1',
          400: '#94A3B8', // secondary
          500: '#64748B', // muted
          700: '#334155',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'signal-gradient': 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
      },
      boxShadow: {
        // Reduced ~70% from the original (40px/-8px/0.45 alpha) — a subtle
        // lift, not a bloom.
        glow: '0 0 12px -4px rgba(139,92,246,0.14)',
        'glow-cyan': '0 0 12px -4px rgba(34,211,238,0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(0.85)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-dot': 'pulse-dot 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
