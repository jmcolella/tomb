"use server";

import { Book, BookEvent, BookFilters } from "@/app/server/books/types";
import {
  queryBooks,
  getBookById as getBookByIdReader,
} from "@/app/server/books/internals/bookReader";
import {
  createBook,
  archiveBook,
  startBook,
  updateBookProgress,
  CreateBookParams,
  ArchiveBookParams,
  StartBookParams,
  UpdateBookProgressParams,
} from "@/app/server/books/internals/bookWriter";
import { queryBookEventsAtLatestVersion } from "@/app/server/books/internals/bookEventReader";

export async function getBooks(filters?: BookFilters): Promise<Book[]> {
  return queryBooks(filters);
}

export async function getBookById(bookId: string): Promise<Book> {
  return getBookByIdReader(bookId);
}

export async function createBookService(params: CreateBookParams): Promise<{
  book: Book | null;
  error: string | null;
}> {
  return createBook(params);
}

export async function archiveBookService(params: ArchiveBookParams): Promise<{
  book: Book | null;
  error: string | null;
}> {
  return archiveBook(params);
}

export async function startBookService(params: StartBookParams): Promise<{
  book: Book | null;
  error: string | null;
}> {
  return startBook(params);
}

export async function updateBookProgressService(
  params: UpdateBookProgressParams
): Promise<{
  book: Book | null;
  error: string | null;
}> {
  return updateBookProgress(params);
}

export async function getBookEvents(
  bookId: string,
  dateEffectiveOrder: "asc" | "desc" = "desc"
): Promise<BookEvent[]> {
  return queryBookEventsAtLatestVersion(bookId, dateEffectiveOrder);
}
