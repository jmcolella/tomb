import { prisma } from "@/lib/prisma";
import { Book } from "./types";

export async function getBookByTitleOptional(
  title: string
): Promise<{ book: Book | null }> {
  try {
    const data = await prisma.book.findFirst({
      where: {
        title: title.trim(),
      },
    });

    if (!data) {
      return { book: null };
    }

    return {
      book: {
        sid: data.sid,
        title: data.title,
        authorName: data.author_name || null,
        datetimeCreated: data.datetime_created,
        status: data.status,
        totalPages: data.total_pages || null,
      },
    };
  } catch (error) {
    console.error("Prisma error:", error);
    return { book: null };
  }
}

export async function readBooks(): Promise<{
  books: Book[] | null;
  error: string | null;
}> {
  try {
    const data = await prisma.book.findMany({
      where: {
        status: {
          not: "DELETED",
        },
      },
      orderBy: {
        datetime_created: "desc",
      },
    });

    const books: Book[] = data.map((row: (typeof data)[0]) => ({
      sid: row.sid,
      title: row.title,
      authorName: row.author_name || null,
      datetimeCreated: row.datetime_created,
      status: row.status,
      totalPages: row.total_pages || null,
    }));

    return { books, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      books: null,
      error: "An unexpected error occurred while reading books",
    };
  }
}
