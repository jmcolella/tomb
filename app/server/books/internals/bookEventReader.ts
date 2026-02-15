"use server";

import { BookEvent } from "@/app/server/books/types";
import prisma from "@/lib/prisma";
import { getLatestBookEventVersion } from "@/app/server/books/internals/bookEventVersionReader";

export async function queryBookEventsAtLatestVersion(
  bookId: string,
  dateEffectiveOrder: "asc" | "desc" = "desc"
): Promise<BookEvent[]> {
  // Get the latest version for this book
  const latestVersion = await getLatestBookEventVersion(bookId);

  // Query book events filtered by book_sid and version, ordered by date_effective (asc/desc),
  // then creation_order_id (asc/desc)
  const data = await prisma.bookEvent.findMany({
    where: {
      book_sid: bookId,
      version: latestVersion.version,
    },
    orderBy: [
      {
        date_effective: dateEffectiveOrder,
      },
      {
        creation_order_id: dateEffectiveOrder,
      },
    ],
  });

  const bookEvents: BookEvent[] = data.map((row) => new BookEvent(row));

  return bookEvents;
}
