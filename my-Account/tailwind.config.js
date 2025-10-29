/** @type {import('tailwindcss').Config} */
// possible color additions from-purple-600 to-pink-500 indigo-600 to-purple-500
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        "dark-blue": {
          DEFAULT: "#00385f", // This preserves existing usage of 'dark-blue'
          50: "#f0f5f9",
          100: "#dce7f0",
          200: "#b8d0e2",
          300: "#88b1cd",
          400: "#558db3",
          500: "#366d95",
          600: "#235580",
          700: "#194468",
          800: "#143656",
          900: "#0e2c48",
          950: "#00385f", // Your original color
        },
        "sentiments-negative": "#d9534f",
        "sentiments-neutral": "#F0BF4C",
        "steel-blue": "#1f7796",
        "light-blue": "#6bacc9",
        "lime-green": {
          DEFAULT: "#98cb4d", // This preserves existing usage of 'lime-green'
          50: "#f7faef",
          100: "#ecf5d7",
          200: "#dbedb3",
          300: "#c5e287",
          400: "#a9d463",
          500: "#98cb4d",
          600: "#7aa83c",
          700: "#5e832e",
          800: "#4a6824",
          900: "#3b531d",
          950: "#1e2c0e",
        },

        "card-header-gray": "#F3F4F6",

        emerald: "#42b371",
        "bright-green": "#70d057",
        "theme-teal": "#109393",
        "theme-gray": "#7C7C7C",
        "light-gray": "#9F9FA6",
        "background-gray": "#e5e7eb",
        "lightest-gray": "#D9D9D9",
        "khaki-green": "#045148",
        "fluorescent-green": "#7FFF00",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        border: "hsl(var(--border))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        ring: "hsl(var(--ring))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        input: "hsl(var(--input))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
      },
      transformStyle: {
        "preserve-3d": "preserve-3d",
      },
      backfaceVisibility: {
        hidden: "hidden",
      },
      perspective: {
        1000: "1000px",
      },

      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        expandCollapse: {
          "0%": { maxHeight: "0", opacity: "0" },
          "100%": { maxHeight: "500px", opacity: "1" },
        },
        "slide-in": {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "bounce-x": {
          "0%, 100%": { transform: "translateX(0)" },
          "50%": { transform: "translateX(25%)" },
        },
        "flip-in": {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(180deg)" },
        },
        "flip-out": {
          "0%": { transform: "rotateY(180deg)" },
          "100%": { transform: "rotateY(0deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 1s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "bounce-x": "bounce-x 1s infinite",
        "flip-in": "flip-in 0.6s forwards",
        "flip-out": "flip-out 0.6s forwards",
        "expand-collapse": "expandCollapse 0.3s ease-in-out",
      },
    },
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".icon-button": {
          background: "none",
          border: "none",
          font: "inherit",
          color: "inherit",
          cursor: "pointer",
          outline: "none",
          "&:disabled": {
            cursor: "not-allowed",
          },
        },
      });
    },
    function ({ addUtilities }) {
      const newUtilities = {
        ".preserve-3d": {
          "transform-style": "preserve-3d",
        },
        ".backface-hidden": {
          "backface-visibility": "hidden",
        },
        ".perspective-1000": {
          perspective: "1000px",
        },
        ".rotate-y-0": {
          transform: "rotateY(0deg)",
        },
        ".rotate-y-180": {
          transform: "rotateY(180deg)",
        },
        ".scrollbar-thin": {
          scrollbarWidth: "thin",
          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f1f5f9",
            borderRadius: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#cbd5e1",
            borderRadius: "4px",
          },
        },
        ".scroll-shadow-top": {
          position: "sticky",
          top: "0",
          height: "20px",
          pointerEvents: "none",
          zIndex: "10",
          background:
            "linear-gradient(to bottom, rgba(229, 231, 235, 0.9) 0%, rgba(229, 231, 235, 0) 100%)",
        },
        ".scroll-shadow-bottom": {
          position: "sticky",
          bottom: "0",
          height: "20px",
          pointerEvents: "none",
          zIndex: "10",
          background:
            "linear-gradient(to top, rgba(229, 231, 235, 0.9) 0%, rgba(229, 231, 235, 0) 100%)",
        },
      };
      addUtilities(newUtilities);
    },
    require("tailwindcss-animate"),
  ],
  // Since you're using antd, you might want to add this to prevent conflicts
  corePlugins: {
    // preflight: false, // This prevents Tailwind from resetting styles that might affect antd
  },
  safelist: [
    "flip-in",
    "flip-out",
    "preserve-3d",
    "backface-hidden",
    "perspective-1000",
    "text-fluorescent-green",
    "fill-amber-500",
    "text-amber-500",
    "fill-dark-blue",
    "text-dark-blue",
    "dark-blue",
    "border-dark-blue",
    "bg-dark-blue",
    "border-lime-green",
    "bg-lime-green",
    "scrollbar-thin",
    "scroll-shadow-top",
    "scroll-shadow-bottom",
  ],
};
