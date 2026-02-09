import type { ThemeConfig } from "@/types";

export const DEFAULT_THEME: ThemeConfig = {
  primaryColor: "#3B82F6",
  primaryColorHover: "#2563EB",
  fontFamily: '"DM Sans", system-ui, sans-serif',
  borderRadius: "12px",
  buttonStyle: "filled",
  bgStyle: "white",
};

export function parseTheme(themeJson: string): ThemeConfig {
  try {
    const parsed = JSON.parse(themeJson);
    return { ...DEFAULT_THEME, ...parsed };
  } catch {
    return DEFAULT_THEME;
  }
}

export function getThemeCssVariables(theme: ThemeConfig): string {
  const bgColor =
    theme.bgStyle === "light"
      ? "#fafaf9"
      : theme.bgStyle === "gradient"
        ? "#fafaf9"
        : "#fafaf9";

  const bgGradient =
    theme.bgStyle === "gradient"
      ? `linear-gradient(135deg, ${theme.bgGradientFrom || "#EFF6FF"}, ${theme.bgGradientTo || "#F5F3FF"})`
      : "none";

  return `
    :root {
      --color-primary: ${theme.primaryColor};
      --color-primary-hover: ${theme.primaryColorHover};
      --font-family: ${theme.fontFamily};
      --border-radius: ${theme.borderRadius};
      --bg-color: ${bgColor};
      --bg-gradient: ${bgGradient};
    }
  `;
}
