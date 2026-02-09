import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { updateSettingsSchema } from "@/lib/validators";

export async function GET() {
  const settings = await prisma.siteSettings.findUnique({
    where: { id: "singleton" },
  });

  if (!settings) {
    return NextResponse.json(
      {
        id: "singleton",
        siteTitle: "My Site",
        siteDescription: "",
        siteUrl: "",
        siteLogo: null,
        heroTitle: "Welcome",
        heroSubtitle: "",
        heroImage: null,
        metaTitle: "",
        metaDescription: "",
        ogImage: null,
        theme: "{}",
        socialLinks: "[]",
        footerText: "",
        favicon: null,
      },
      { status: 200 }
    );
  }

  return NextResponse.json(settings);
}

export async function PUT(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = updateSettingsSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: parsed.data,
    create: { id: "singleton", ...parsed.data },
  });

  return NextResponse.json(settings);
}
