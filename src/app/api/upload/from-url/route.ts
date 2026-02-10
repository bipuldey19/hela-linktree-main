import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { downloadAndSaveImageFromUrl } from "@/lib/upload";

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const url = typeof body?.url === "string" ? body.url.trim() : "";
    const category = (body?.category === "site" ? "site" : "blog") as "blog" | "site";

    if (!url || !url.startsWith("http")) {
      return NextResponse.json(
        { error: "Valid image URL is required" },
        { status: 400 }
      );
    }

    const result = await downloadAndSaveImageFromUrl(url, category);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Import failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
