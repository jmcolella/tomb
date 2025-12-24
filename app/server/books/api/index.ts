"use server";

import { revalidatePath } from "next/cache";
import { readBooks } from "../internals/book_reader";
import { getOrCreateBook, deleteBook } from "../internals/books_writer";
import { AddBookApiInput } from "./types";

export async function addBook(input: AddBookApiInput) {
  const { book, error } = await getOrCreateBook(
    input.title,
    input.author,
    input.totalPages
  );

  if (error) {
    return { error };
  }

  if (!book) {
    return { error: "Failed to add book" };
  }

  revalidatePath("/");
  return { success: true };
}

export async function getBooks() {
  const { books, error } = await readBooks();

  if (error) {
    return { error, data: null };
  }

  return { data: books, error: null };
}

export async function deleteBookById(sid: string) {
  const { success, error } = await deleteBook(sid);

  if (error) {
    return { error };
  }

  revalidatePath("/");
  return { success: true };
}
