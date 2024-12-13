import type { Config } from "tailwindcss";

export default {
    content: ["./app/**/{**,.client,.server}/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: [
                    '"Inter"',
                    "ui-sans-serif",
                    "system-ui",
                    "sans-serif",
                    '"Apple Color Emoji"',
                    '"Segoe UI Emoji"',
                    '"Segoe UI Symbol"',
                    '"Noto Color Emoji"',
                ],
            },
            colors: {
                primary: {
                    a0: "#8522fe",
                    a10: "#9743ff",
                    a20: "#a85dff",
                    a30: "#b775ff",
                    a40: "#c58cff",
                    a50: "#d2a3ff",
                },
                surface: {
                    a0: "#121212",
                    a10: "#282828",
                    a20: "#3f3f3f",
                    a30: "#575757",
                    a40: "#717171",
                    a50: "#8b8b8b",
                },
                surfaceTonal: {
                    a0: "#1e1726",
                    a10: "#332c3a",
                    a20: "#494350",
                    a30: "#615b67",
                    a40: "#79747e",
                    a50: "#928e97",
                },
                primaryDark: "#121212",
            },
        },
    },
    plugins: [],
} satisfies Config;
