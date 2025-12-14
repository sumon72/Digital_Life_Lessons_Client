/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/daisyui/dist/**/*.js",
    "node_modules/react-daisyui/dist/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#4f46e5",           // Indigo-600 - Main brand color
          "primary-focus": "#4338ca",  // Indigo-700 - Hover state
          "primary-content": "#ffffff", // White text on primary
          secondary: "#06b6d4",         // Cyan-500 - Accent color
          "secondary-focus": "#0891b2", // Cyan-600 - Hover state
          "secondary-content": "#ffffff", // White text on secondary
          accent: "#8b5cf6",            // Violet-500
          neutral: "#1f2937",           // Gray-800
          "base-100": "#ffffff",        // White background
          "base-200": "#f3f4f6",        // Gray-100
          "base-300": "#e5e7eb",        // Gray-200
          warning: "#fbbf24",           // Amber-400 - Premium/Gold color
          "warning-content": "#78350f", // Amber-900 - Text on warning
        },
      },
      {
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          primary: "#4f46e5",           // Indigo-600 - Main brand color
          "primary-focus": "#6366f1",  // Indigo-500 - Hover state (lighter for dark mode)
          "primary-content": "#ffffff", // White text on primary
          secondary: "#06b6d4",         // Cyan-500 - Accent color
          "secondary-focus": "#22d3ee", // Cyan-400 - Hover state (lighter for dark mode)
          "secondary-content": "#ffffff", // White text on secondary
          accent: "#8b5cf6",            // Violet-500
          neutral: "#e5e7eb",           // Gray-200
          "base-100": "#1e293b",        // Slate-800
          "base-200": "#0f172a",        // Slate-900
          "base-300": "#020617",        // Slate-950
          warning: "#fbbf24",           // Amber-400 - Premium/Gold color
          "warning-content": "#78350f", // Amber-900 - Text on warning
        },
      },
    ],
    darkMode: "class",
  },
}
