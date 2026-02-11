import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  content: z.string().min(1, "Content is required"),
  excerpt: z.string().max(300).optional().nullable(),
  heroImage: z.string().optional().nullable(),
  metaTitle: z.string().max(70).optional().nullable(),
  metaDescription: z.string().max(160).optional().nullable(),
  metaKeywords: z.string().max(500).optional().nullable(),
  ogImage: z.string().optional().nullable(),
  published: z.boolean().default(false),
});

export const updatePostSchema = createPostSchema.partial().extend({
  slug: z.string().optional(),
});

export const updateSettingsSchema = z.object({
  siteTitle: z.string().min(1).max(100),
  siteDescription: z.string().max(500),
  siteUrl: z.string().max(200).optional(),
  heroTitle: z.string().max(200),
  heroSubtitle: z.string().max(500),
  heroImage: z.string().optional().nullable(),
  siteLogo: z.string().optional().nullable(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  ogImage: z.string().optional().nullable(),
  theme: z.string().optional(),
  socialLinks: z.string().optional(),
  footerText: z.string().max(500),
  favicon: z.string().optional().nullable(),
}).partial();

export const updatePageSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string(),
  active: z.boolean().optional(),
});

export const createLinkSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  url: z.string().url("Must be a valid URL"),
  icon: z.string().max(10).optional().nullable(),
  logoImage: z.string().optional().nullable(),
  color: z.string().max(30).optional().nullable(),
  active: z.boolean().default(true),
});

export const updateLinkSchema = createLinkSchema.partial();

export const reorderLinksSchema = z.object({
  orderedIds: z.array(z.string()),
});

const linkButtonSchema = z.object({
  label: z.string().min(1).max(80),
  url: z.string().url().max(500),
});

export const createMidContentSchema = z.object({
  image: z.string().optional().nullable(),
  headline: z.string().min(1, "Headline is required").max(200),
  description: z.string().max(2000).default(""),
  linkButtons: z.array(linkButtonSchema).max(5).default([]),
  active: z.boolean().default(true),
});

export const updateMidContentSchema = createMidContentSchema.partial();

export const reorderMidContentSchema = z.object({
  orderedIds: z.array(z.string()),
});
