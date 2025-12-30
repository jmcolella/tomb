"use server";

import { Book, BookStatus, BookFilters } from "@/app/server/books/types";
import prisma from "@/lib/prisma";
import { Prisma } from "@/lib/generated/prisma-client/client";

const defaultFilters: BookFilters = {
  includeStatuses: [
    BookStatus.WANT_TO_READ,
    BookStatus.READING,
    BookStatus.READ,
  ],
};

export async function queryBooks(
  filters: BookFilters = defaultFilters
): Promise<Book[]> {
  try {
    const whereClause = buildFilters(filters);

    const data = await prisma.book.findMany({
      where: whereClause,
      orderBy: {
        datetime_created: "desc",
      },
    });

    const books: Book[] = data.map((row) => new Book(row));

    return books;
  } catch (error) {
    console.error("Unexpected error querying books:", error);
    throw new Error("An unexpected error occurred while querying books");
  }
}

function buildFilters(incomingFilters: BookFilters): Prisma.BookWhereInput {
  const filters = applyDefaultFilters(incomingFilters);
  const whereClause: Prisma.BookWhereInput = {};

  if (filters.userId) {
    whereClause.user_id = {
      equals: filters.userId,
    };
  }

  if (filters.includeStatuses) {
    whereClause.status = {
      in: filters.includeStatuses,
    };
  }

  return whereClause;
}
function applyDefaultFilters(filters: BookFilters): BookFilters {
  return {
    ...defaultFilters,
    ...filters,
  };
}

export async function getBookById(bookId: string): Promise<Book> {
  const data = await prisma.book.findFirstOrThrow({
    where: {
      sid: bookId,
    },
  });

  return new Book(data);
}
