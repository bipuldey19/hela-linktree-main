import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth-utils";
import { z } from "zod";

const createUserSchema = z.object({
  email: z.string().email("Must be a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().max(100).optional().nullable(),
});

export async function GET() {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(users);
}

export async function POST(request: Request) {
  try {
    await requireAuth();
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existing) {
    return NextResponse.json(
      { error: "A user with this email already exists" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

  const user = await prisma.user.create({
    data: {
      email: parsed.data.email,
      password: hashedPassword,
      name: parsed.data.name || null,
    },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  return NextResponse.json(user, { status: 201 });
}
