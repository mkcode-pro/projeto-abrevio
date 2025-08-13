import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        'sm': '640px',   // Mobile landscape
        'md': '768px',   // Tablet
        'lg': '1024px',  // Desktop
        'xl': '1280px',  // Large desktop
        '2xl': '1400px'  // Extra large desktop
      }
    },
    extend: {
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        neon: {
          blue: 'hsl(var(--neon-blue))',
          purple: 'hsl(var(--neon-purple))',
        }
      },
      spacing: {
        '4': '4px',    // Micro
        '8': '8px',    // Tiny
        '12': '12px',  // Extra Small
        '16': '16px',  // Small
        '24': '24px',  // Medium
        '32': '32px',  // Large
        '48': '48px',  // Extra Large
        '64': '64px',  // Huge
      },
      fontSize: {
        'xs': '12px',     // Caption
        'sm': '14px',     // Small text
        'base': '16px',   // Body text
        'lg': '18px',     // Large text
        'xl': '20px',     // Title
        '2xl': '24px',    // H3
        '3xl': '32px',    // H2
        '4xl': '40px',    // H1
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '24px',
      },
      backgroundImage: {
        'gradient-neon': 'var(--gradient-neon)',
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-card': 'var(--gradient-card)'
      },
      boxShadow: {
        'neon': 'var(--shadow-neon)',
        'glass': 'var(--shadow-glass)',
        'elegant': 'var(--shadow-elegant)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'grid-move': 'grid-move 20s ease-in-out infinite',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;