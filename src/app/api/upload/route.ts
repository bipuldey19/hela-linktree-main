import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { processAndSaveImage } from "@/lib/upload";

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const category = (formData.get("category") as "blog" | "site") || "blog";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const result = await processAndSaveImage(file, category);
    return NextResponse.json(result, { status: 201 });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
