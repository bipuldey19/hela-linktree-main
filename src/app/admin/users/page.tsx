import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import UsersPageClient from "./UsersPageClient";

export default async function UsersPage() {
  const session = await auth();
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return (
    <UsersPageClient
      users={users.map((u) => ({
        ...u,
        createdAt: u.createdAt.toISOString(),
      }))}
      currentUserId={session?.user?.id || ""}
    />
  );
}
