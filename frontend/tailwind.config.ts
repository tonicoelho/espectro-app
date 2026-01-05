import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Bias color scheme
        'bias-left': '#EF4444',      // Red
        'bias-center': '#6B7280',    // Gray
        'bias-right': '#3B82F6',     // Blue
        'z-axis-pro': '#10B981',     // Green (Pro-Establishment)
        'z-axis-anti': '#F59E0B',    // Orange (Anti-System)
      },
    },
  },
  plugins: [],
}

export default config
