/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cyber: {
          50:  '#f0fffe',
          100: '#ccfffe',
          200: '#99fffd',
          300: '#4dfff9',
          400: '#00f5e8',
          500: '#00d4c8',
          600: '#00a8a0',
          700: '#008580',
          800: '#006b67',
          900: '#005855',
        },
        bio: {
          50:  '#f0fff4',
          100: '#c6f6d5',
          200: '#9ae6b4',
          300: '#68d391',
          400: '#48bb78',
          500: '#38a169',
          600: '#2f855a',
          700: '#276749',
          800: '#22543d',
          900: '#1c4532',
        },
        void: {
          50:  '#f8fafc',
          100: '#e2e8f0',
          700: '#1a1f2e',
          800: '#12161f',
          850: '#0e1119',
          900: '#080b10',
          950: '#040608',
        },
      },
      fontFamily: {
        display: ['"Orbitron"', 'monospace'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scan': 'scan 4s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'data-stream': 'dataStream 20s linear infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(400%)' },
        },
        glow: {
          'from': { textShadow: '0 0 10px #00f5e8, 0 0 20px #00f5e8' },
          'to': { textShadow: '0 0 20px #00f5e8, 0 0 40px #00f5e8, 0 0 60px #00f5e8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        dataStream: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'cyber': '0 0 20px rgba(0, 245, 232, 0.15), inset 0 1px 0 rgba(0, 245, 232, 0.1)',
        'cyber-strong': '0 0 40px rgba(0, 245, 232, 0.3), 0 0 80px rgba(0, 245, 232, 0.1)',
        'bio': '0 0 20px rgba(72, 187, 120, 0.2)',
        'panel': '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
      },
    },
  },
  plugins: [],
}
