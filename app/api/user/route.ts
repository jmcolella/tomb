import { headers } from "next/headers";
import prisma from "@/lib/prisma";
import { UserApiEntity } from "@/app/api/user/types";

export async function GET(_: Request) {
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  if (!userId) {
    return new Response(
      JSON.stringify({ error: "User not authenticated", data: null }),
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return new Response(
      JSON.stringify({ error: "User not found", data: null }),
      { status: 404 }
    );
  }

  return new Response(
    JSON.stringify({
      data: new UserApiEntity(user.id, user.email),
      error: null,
    }),
    { status: 200 }
  );
}
