/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark theme base colors
        'game-bg': '#111827', // Dark blue-gray background
        'panel-bg': '#1F2937', // Slightly lighter for containers
        'border-accent': '#374151', // Border color
        
        // Tetromino piece colors with glow effects
        'tetromino-i': '#06B6D4', // Cyan for I piece
        'tetromino-o': '#FBBF24', // Yellow for O piece
        'tetromino-t': '#8B5CF6', // Purple for T piece
        'tetromino-s': '#10B981', // Green for S piece
        'tetromino-z': '#EF4444', // Red for Z piece
        'tetromino-j': '#3B82F6', // Blue for J piece
        'tetromino-l': '#F97316', // Orange for L piece
      },
      boxShadow: {
        'glow': '0 0 8px rgba(59, 130, 246, 0.5)',
        'glow-lg': '0 0 15px rgba(59, 130, 246, 0.7)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
