/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background:        "var(--background)",
        sectionBackground: "var(--section-background)",
        surface:           "var(--surface)",
        surfaceHover:      "var(--surface-hover)",
        primary:           "var(--primary)",
        primaryHover:      "var(--primary-hover)",
        secondary:         "var(--secondary)",
        accent:            "var(--accent)",
        success:           "var(--success)",
        warning:           "var(--warning)",
        danger:            "var(--danger)",
        textPrimary:       "var(--text-primary)",
        textSecondary:     "var(--text-secondary)",
        border:            "var(--border)",
        ring:              "var(--ring)",
        neon:              "var(--neon)",
        neonHover:         "var(--neon-hover)",
        neonSoft:          "var(--neon-soft)",
      },
      fontFamily: {
        sans:  ["Space Grotesk", "Inter", "sans-serif"],
        mono:  ["JetBrains Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        card:   "20px",
        "card-lg": "24px",
        input:  "12px",
        button: "10px",
      },
      boxShadow: {
        premium:        "0 4px 24px -4px rgba(124,58,237,0.06), 0 1px 4px -1px rgba(0,0,0,0.3)",
        "premium-hover":"0 12px 40px -8px rgba(124,58,237,0.25), 0 2px 8px -1px rgba(0,0,0,0.4)",
        neon:           "0 0 20px rgba(124,58,237,0.35), 0 0 40px rgba(124,58,237,0.15)",
        "neon-sm":      "0 0 10px rgba(124,58,237,0.3), 0 0 20px rgba(124,58,237,0.1)",
        "neon-lg":      "0 0 30px rgba(124,58,237,0.4), 0 0 60px rgba(124,58,237,0.2)",
        glass:          "0 8px 32px 0 rgba(0,0,0,0.37), inset 0 1px 0 rgba(255,255,255,0.05)",
        "inner-glow":   "inset 0 1px 0 rgba(255,255,255,0.08)",
      },
      backgroundImage: {
        "neon-gradient":  "linear-gradient(135deg, #7C3AED 0%, #A855F7 50%, #6D28D9 100%)",
        "neon-gradient-2":"linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #A855F7 100%)",
        "dark-gradient":  "linear-gradient(135deg, #0B0B12 0%, #111118 100%)",
        "card-gradient":  "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
        "glow-radial":    "radial-gradient(circle at center, rgba(124,58,237,0.15) 0%, transparent 70%)",
      },
      keyframes: {
        shimmer: {
          '0%':   { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(200%)' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        breathe: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(124,58,237,0.2), 0 0 40px rgba(124,58,237,0.08)' },
          '50%':      { boxShadow: '0 0 30px rgba(124,58,237,0.35), 0 0 60px rgba(124,58,237,0.15)' },
        },
        "float-blob": {
          '0%':   { transform: 'translate(0, 0) scale(1)' },
          '33%':  { transform: 'translate(40px, -40px) scale(1.08)' },
          '66%':  { transform: 'translate(-25px, 35px) scale(0.96)' },
          '100%': { transform: 'translate(0, 0) scale(1)' },
        },
        "spin-slow": {
          '0%':   { transform: 'rotateY(0deg) rotateX(0deg)' },
          '100%': { transform: 'rotateY(360deg) rotateX(360deg)' },
        },
        particle: {
          '0%':   { transform: 'translateY(100vh) translateX(0)', opacity: '0' },
          '10%':  { opacity: '1' },
          '90%':  { opacity: '1' },
          '100%': { transform: 'translateY(-100px) translateX(20px)', opacity: '0' },
        },
        streak: {
          '0%':   { transform: 'translateX(-200px) translateY(200px)', opacity: '0' },
          '20%':  { opacity: '0.4' },
          '80%':  { opacity: '0.2' },
          '100%': { transform: 'translateX(100vw) translateY(-100vh)', opacity: '0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.5' },
          '50%':      { opacity: '1' },
        },
      },
      animation: {
        shimmer:      'shimmer 1.8s infinite',
        'fade-up':    'fadeUp 0.5s ease-out',
        'fade-in':    'fadeIn 0.4s ease-out',
        float:        'float 4s ease-in-out infinite',
        breathe:      'breathe 3s ease-in-out infinite',
        'float-blob': 'float-blob 28s infinite alternate ease-in-out',
        'spin-slow':  'spin-slow 20s linear infinite',
        particle:     'particle 8s linear infinite',
        streak:       'streak 6s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
