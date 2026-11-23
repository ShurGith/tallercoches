/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        'ink-deep': 'var(--ink-deep)',
        'ink-soft': 'var(--ink-soft)',
        canvas: 'var(--canvas)',
        surface: 'var(--surface)',
        'surface-tint': 'var(--surface-tint)',
        text: 'var(--text)',
        muted: 'var(--muted)',
        line: 'var(--line)',
        lime: 'var(--lime)',
        'lime-deep': 'var(--lime-deep)',
        amber: 'var(--amber)',
        'amber-bg': 'var(--amber-bg)',
        red: 'var(--red)',
        'red-bg': 'var(--red-bg)',
        green: 'var(--green)',
        'green-bg': 'var(--green-bg)',
        'on-accent': 'var(--on-accent)',
      },
    },
  },
  plugins: [],
}

