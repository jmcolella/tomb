"use server";

import { Book } from "@/app/server/books/types";
import prisma from "@/lib/prisma";

export async function readBooksByUserId(userId: string): Promise<{
  books: Book[] | null;
  error: string | null;
}> {
  try {
    const data = await prisma.book.findMany({
      where: {
        user_id: userId,
        status: {
          not: "DELETED",
        },
      },
      orderBy: {
        datetime_created: "desc",
      },
    });

    const books: Book[] = data.map((row) => new Book(row));

    return { books, error: null };
  } catch (error) {
    console.error("Unexpected error reading books by user_id:", error);
    return {
      books: null,
      error: "An unexpected error occurred while reading books",
    };
  }
}
