import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { z } from "zod";

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().max(100).optional().nullable(),
  password: z.string().min(6).optional(),
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = updateUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data: Record<string, unknown> = {};

  if (parsed.data.email) {
    const existing = await prisma.user.findFirst({
      where: { email: parsed.data.email, NOT: { id } },
    });
    if (existing) {
      return NextResponse.json(
        { error: "A user with this email already exists" },
        { status: 409 }
      );
    }
    data.email = parsed.data.email;
  }

  if (parsed.data.name !== undefined) {
    data.name = parsed.data.name;
  }

  if (parsed.data.password) {
    data.password = await bcrypt.hash(parsed.data.password, 12);
  }

  const user = await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  return NextResponse.json(user);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await (async () => {
    try {
      return await requireAuth();
    } catch {
      return null;
    }
  })();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  // Prevent deleting yourself
  if (session.user?.id === id) {
    return NextResponse.json(
      { error: "You cannot delete your own account" },
      { status: 400 }
    );
  }

  const userCount = await prisma.user.count();
  if (userCount <= 1) {
    return NextResponse.json(
      { error: "Cannot delete the last admin user" },
      { status: 400 }
    );
  }

  await prisma.user.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
