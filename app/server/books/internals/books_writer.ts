import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { Book } from "./types";
import { getBookByTitleOptional } from "./book_reader";

export async function getOrCreateBook(
  title: string,
  authorName: string,
  totalPages: number
): Promise<{ book: Book | null; error: string | null }> {
  try {
    // First, try to find the book by title
    const { book: existingBook } = await getBookByTitleOptional(title);

    if (existingBook) {
      return {
        book: existingBook,
        error: null,
      };
    }

    // Book doesn't exist, create it
    // Get the max creation_order_id and library_sid from existing books
    const maxOrderBook = await prisma.book.findFirst({
      orderBy: {
        creation_order_id: "desc",
      },
      select: {
        creation_order_id: true,
        library_sid: true,
      },
    });

    const creationOrderId = maxOrderBook
      ? maxOrderBook.creation_order_id + 1
      : 1;
    const librarySid = maxOrderBook?.library_sid || "default-library"; // Use existing or default

    const sid = uuidv4();

    const newBook = await prisma.book.create({
      data: {
        sid: sid,
        title: title,
        author_name: authorName.trim(),
        status: "SHELF",
        total_pages: totalPages,
        creation_order_id: creationOrderId,
        library_sid: librarySid,
      },
    });

    return {
      book: {
        sid: newBook.sid,
        title: newBook.title,
        authorName: newBook.author_name || null,
        datetimeCreated: newBook.datetime_created,
        status: newBook.status,
        totalPages: newBook.total_pages || null,
      },
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      book: null,
      error: "An unexpected error occurred while getting or creating book",
    };
  }
}

export async function deleteBook(
  sid: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    // Check if book exists
    const book = await prisma.book.findUnique({
      where: { sid },
      select: {
        sid: true,
      },
    });

    if (!book) {
      return {
        success: false,
        error: "Book not found",
      };
    }

    // Update book status to DELETED
    await prisma.book.update({
      where: { sid },
      data: { status: "DELETED" },
    });

    return { success: true, error: null };
  } catch (error) {
    console.error("Unexpected error:", error);
    return {
      success: false,
      error: "An unexpected error occurred while deleting book",
    };
  }
}
