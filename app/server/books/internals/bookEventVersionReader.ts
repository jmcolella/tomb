"use server";

import { BookEventVersion } from "@/app/server/books/types";
import prisma from "@/lib/prisma";

export async function getLatestBookEventVersion(
  bookId: string
): Promise<BookEventVersion> {
  const data = await prisma.bookEventVersion.findFirstOrThrow({
    where: {
      book_sid: bookId,
    },
    orderBy: {
      version: "desc",
    },
  });

  return new BookEventVersion(data);
}
