/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['var(--font-poppins)', 'ui-sans-serif', 'system-ui'],
        'serif': ['var(--font-playfair)', 'ui-serif', 'Georgia'],
        'mono': ['var(--font-jetbrains-mono)', 'ui-monospace', 'SFMono-Regular'],
        'poppins': ['var(--font-poppins)', 'sans-serif'],
        'playfair': ['var(--font-playfair)', 'serif'],
        'jetbrains': ['var(--font-jetbrains-mono)', 'monospace'],
        'heading': ['var(--font-playfair)', 'serif'],
        'body': ['var(--font-poppins)', 'sans-serif'],
        'accent': ['var(--font-playfair)', 'serif'],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
      },
      letterSpacing: {
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
      },
    },
  },
  plugins: [],
}