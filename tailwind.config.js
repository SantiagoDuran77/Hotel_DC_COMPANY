/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "./index.html", // Added from updates
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "#eff6ff", // Added from updates
          100: "#dbeafe", // Added from updates
          200: "#bfdbfe", // Added from updates
          300: "#93c5fd", // Added from updates
          400: "#60a5fa", // Added from updates
          500: "#3b82f6", // Added from updates
          600: "#2563eb", // Added from updates
          700: "#1d4ed8", // Added from updates
          800: "#1e40af", // Added from updates
          900: "#1e3a8a", // Added from updates
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          50: "#f8fafc", // Added from updates
          100: "#f1f5f9", // Added from updates
          200: "#e2e8f0", // Added from updates
          300: "#cbd5e1", // Added from updates
          400: "#94a3b8", // Added from updates
          500: "#64748b", // Added from updates
          600: "#475569", // Added from updates
          700: "#334155", // Added from updates
          800: "#1e293b", // Added from updates
          900: "#0f172a", // Added from updates
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"], // Added from updates
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        fadeIn: {
          "0%": { opacity: "0" }, // Added from updates
          "100%": { opacity: "1" }, // Added from updates
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" }, // Updated from 20px to 10px
          "100%": { transform: "translateY(0)", opacity: "1" }, // Added from updates
        },
        bounceIn: {
          "0%": { transform: "scale(0.3)", opacity: "0" }, // Added from updates
          "50%": { transform: "scale(1.05)" }, // Added from updates
          "70%": { transform: "scale(0.9)" }, // Added from updates
          "100%": { transform: "scale(1)", opacity: "1" }, // Added from updates
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fadeIn 0.5s ease-in-out", // Added from updates
        "slide-up": "slideUp 0.3s ease-out", // Added from updates
        "bounce-in": "bounceIn 0.6s ease-out", // Added from updates
      },
    },
  },
  plugins: [require("tailwindcss-animate")], // Updated from []
}
