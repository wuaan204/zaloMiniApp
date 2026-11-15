module.exports = {
  darkMode: ["selector", '[zaui-theme="dark"]'],
  purge: {
    enabled: true,
    content: ['./src/**/*.{js,jsx,ts,tsx,vue}'],
  },
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
        mono: ["Roboto Mono", "monospace"],
      },
      colors: {
        primary: {
          50: "#EEF4FF",
          100: "#DCE7FF",
          200: "#BBD1FF",
          400: "#6F9BFF",
          500: "#4F82FF",
          600: "#2F6BFF",
          700: "#1F55E0",
          800: "#173FA8",
        },
        ink: {
          950: "#0B1220",
          900: "#121B2E",
          800: "#1A2740",
          700: "#25324A",
          inactive: "#AEB8C8",
          icon: "#8492A6",
          muted: "#C7D0DE",
        },
        canvas: "#F5F7FB",
        surface: "#FFFFFF",
        surfaceMuted: "#F8FAFC",
        line: "#E4E9F2",
        lineStrong: "#CBD5E1",
        content: {
          DEFAULT: "#0B1220",
          secondary: "#5B6577",
          muted: "#8A94A6",
          inverse: "#F8FAFC",
        },
        success: {
          DEFAULT: "#16A34A",
          soft: "#ECFDF3",
        },
        warning: {
          DEFAULT: "#D97706",
          soft: "#FFF7E6",
        },
        danger: {
          DEFAULT: "#DC2626",
          soft: "#FEF2F2",
        },
        info: {
          DEFAULT: "#0284C7",
          soft: "#EFF8FF",
        },
        inbody: {
          DEFAULT: "#7C3AED",
          soft: "#F5F3FF",
        },
        vital: "#0D9488",
      },
      borderRadius: {
        nav: "10px",
        card: "16px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(11,18,32,.04), 0 1px 3px rgba(11,18,32,.06)",
        raised: "0 8px 24px rgba(11,18,32,.08)",
        nav: "0 4px 12px rgba(47,107,255,.28)",
      },
      spacing: {
        nav: "64px",
        sidebar: "264px",
        rail: "88px",
        sidebarCollapsed: "76px",
      },
    },
  },
};
