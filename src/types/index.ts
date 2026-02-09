export interface ThemeConfig {
  primaryColor: string;
  primaryColorHover: string;
  fontFamily: string;
  borderRadius: string;
  buttonStyle: "filled" | "outline" | "ghost";
  bgStyle: "white" | "light" | "gradient";
  bgGradientFrom?: string;
  bgGradientTo?: string;
}

export interface SocialLink {
  platform: string;
  url: string;
}

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: string | null;
  logoImage: string | null;
  color: string | null;
  order: number;
  active: boolean;
}

export interface BlogPostCard {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  heroImage: string | null;
  publishedAt: Date | null;
}
