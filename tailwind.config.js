import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                lime: {
                    400: '#a3e635',
                    500: '#84cc16',
                    glow: 'rgba(163, 230, 53, 0.35)',
                },
                dark: {
                    base: '#0B0F17',
                    card: 'rgba(18, 24, 38, 0.65)',
                    sidebar: 'rgba(13, 17, 26, 0.75)',
                    border: 'rgba(255, 255, 255, 0.08)',
                }
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                'glow-lime': '0 0 20px rgba(163, 230, 53, 0.35)',
                'glow-active': '0 0 15px rgba(163, 230, 53, 0.25)',
            },
            backdropBlur: {
                'glass': '16px',
            }
        },
    },

    plugins: [forms],
};
