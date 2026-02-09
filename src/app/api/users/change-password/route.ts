import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { z } from "zod";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export async function PUT(request: Request) {
  let session;
  try {
    session = await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = changePasswordSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user?.id as string },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isValid = await bcrypt.compare(
    parsed.data.currentPassword,
    user.password
  );

  if (!isValid) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(parsed.data.newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });

  return NextResponse.json({ message: "Password updated successfully" });
}
