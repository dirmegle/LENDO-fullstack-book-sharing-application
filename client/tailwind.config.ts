

module.exports = {
    darkMode: ['class'],
    content: ['./index.html', 'src/**/*.{ts,tsx}'],
    theme: {
      extend: {
        colors: {
          border: 'hsl(var(--border))',
          
          input: '#ebddd3',
          ring: 'var(--ring)',
          background: '#F8FAFC',
          foreground: 'hsl(var(--foreground))',
          stoneDark: '#F3EBE5',
          darkBlue: '#0f172a',
          primary: {
            DEFAULT: 'hsl(var(--primary))',
            foreground: 'hsl(var(--primary-foreground))'
          },
          secondary: {
            DEFAULT: 'hsl(var(--secondary))',
            foreground: 'hsl(var(--secondary-foreground))'
          },
          destructive: {
            DEFAULT: 'var(--destructive)',
            foreground: 'hsl(var(--destructive-foreground))'
          },
          muted: {
            DEFAULT: 'hsl(var(--muted))',
            foreground: 'hsl(var(--muted-foreground))',
            green: '#E1F28D',
            purple: 'var(--muted-purple)'
          },
          accent: {
            DEFAULT: 'hsl(var(--accent))',
            foreground: 'hsl(var(--accent-foreground))',
            green: '#DEF080',
            peach: '#FFB28C',
            purple: '#B0A8FE'
          },
          popover: {
            DEFAULT: 'hsl(var(--popover))',
            foreground: 'hsl(var(--popover-foreground))'
          },
          card: {
            DEFAULT: 'hsl(var(--card))',
            foreground: 'hsl(var(--card-foreground))'
          },
          chart: {
            1: 'hsl(var(--chart-1))',
            2: 'hsl(var(--chart-2))',
            3: 'hsl(var(--chart-3))',
            4: 'hsl(var(--chart-4))',
            5: 'hsl(var(--chart-5))'
          }
        },
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)'
        }
      }
    },
    plugins: [require('tailwindcss-animate')]
  }