const colors = require('tailwindcss/colors')

module.exports = {
    darkMode: ['class'],
    content: ['./index.html', 'src/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                border: 'var(--border)',
                input: 'bg-orange-50',
                ring: 'var(--ring)',
                background: colors.amber[50],
                foreground: 'var(--foreground)',
                primary: {
                    DEFAULT: 'var(--primary)',
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
                    DEFAULT: '#F8FAFC',
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
};
