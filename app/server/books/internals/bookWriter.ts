"use server";

import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
import { Book, BookStatus, BookEventType } from "@/app/server/books/types";
import { getBookById } from "@/app/server/books/internals/bookReader";

export interface CreateBookParams {
  userId: string;
  title: string;
  authorName: string;
  totalPages: number;
  currentPage?: number;
}

export async function createBook(params: CreateBookParams): Promise<{
  book: Book | null;
  error: string | null;
}> {
  try {
    // Idempotent check: check if book with same title already exists for this user
    const existingBook = await prisma.book.findFirst({
      where: {
        user_id: params.userId,
        title: params.title,
      },
    });

    if (existingBook) {
      return {
        book: new Book(existingBook),
        error: null,
      };
    }

    const bookSid = uuidv4();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for date_effective

    const bookEventSid = uuidv4();
    const bookEventVersionSid = uuidv4();
    const pageNumber = params.currentPage ?? 0;

    // Create book, book event, and book event version in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create book
      const book = await tx.book.create({
        data: {
          sid: bookSid,
          title: params.title,
          author_name: params.authorName,
          total_pages: params.totalPages,
          status: BookStatus.WANT_TO_READ,
          user_id: params.userId,
          current_page: pageNumber,
        },
      });

      // Create book event
      await tx.bookEvent.create({
        data: {
          sid: bookEventSid,
          book_sid: bookSid,
          event_type: BookEventType.ADD_TO_LIBRARY,
          date_effective: today,
          page_number: pageNumber,
          version: 1,
        },
      });

      // Create book event version
      await tx.bookEventVersion.create({
        data: {
          sid: bookEventVersionSid,
          book_sid: bookSid,
          version: 1,
          description: "Initial version",
        },
      });

      return book;
    });

    return {
      book: new Book(result),
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error creating book:", error);
    return {
      book: null,
      error: "An unexpected error occurred while creating book",
    };
  }
}

export interface ArchiveBookParams {
  bookId: string;
  userId: string;
}

export async function archiveBook(params: ArchiveBookParams): Promise<{
  book: Book | null;
  error: string | null;
}> {
  try {
    // First, verify the book exists and belongs to the user
    const existingBook = await prisma.book.findFirst({
      where: {
        sid: params.bookId,
        user_id: params.userId,
      },
    });

    if (!existingBook) {
      return {
        book: null,
        error: "Book not found or access denied",
      };
    }

    // Get the latest book_event_versions version for this book
    const latestVersion = await prisma.bookEventVersion.findFirst({
      where: {
        book_sid: params.bookId,
      },
      orderBy: {
        version: "desc",
      },
    });

    if (!latestVersion) {
      return {
        book: null,
        error: "No version found for book",
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for date_effective

    const bookEventSid = uuidv4();

    // Update book status and create book event in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update book status to ARCHIVED
      const book = await tx.book.update({
        where: {
          sid: params.bookId,
        },
        data: {
          status: BookStatus.ARCHIVED,
        },
      });

      // Create book event with ARCHIVED type
      await tx.bookEvent.create({
        data: {
          sid: bookEventSid,
          book_sid: params.bookId,
          event_type: BookEventType.ARCHIVED,
          date_effective: today,
          page_number: existingBook.current_page,
          version: latestVersion.version,
        },
      });

      return book;
    });

    return {
      book: new Book(result),
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error archiving book:", error);
    return {
      book: null,
      error: "An unexpected error occurred while archiving book",
    };
  }
}

export interface StartBookParams {
  bookId: string;
  userId: string;
  dateEffective: Date;
  currentPage: number;
}

export async function startBook(params: StartBookParams): Promise<{
  book: Book | null;
  error: string | null;
}> {
  try {
    // First, verify the book exists and belongs to the user
    const existingBook = await prisma.book.findFirst({
      where: {
        sid: params.bookId,
        user_id: params.userId,
      },
    });

    if (!existingBook) {
      return {
        book: null,
        error: "Book not found or access denied",
      };
    }

    // Get the latest book_event_versions version for this book
    const latestVersion = await prisma.bookEventVersion.findFirst({
      where: {
        book_sid: params.bookId,
      },
      orderBy: {
        version: "desc",
      },
    });

    if (!latestVersion) {
      return {
        book: null,
        error: "No version found for book",
      };
    }

    const bookEventSid = uuidv4();

    // Update book status and create book event in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update book status to READING and current_page
      const book = await tx.book.update({
        where: {
          sid: params.bookId,
        },
        data: {
          status: BookStatus.READING,
          current_page: params.currentPage,
        },
      });

      // Create book event with STARTED type
      await tx.bookEvent.create({
        data: {
          sid: bookEventSid,
          book_sid: params.bookId,
          event_type: BookEventType.STARTED,
          date_effective: params.dateEffective,
          page_number: params.currentPage,
          version: latestVersion.version,
        },
      });

      return book;
    });

    return {
      book: new Book(result),
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error starting book:", error);
    return {
      book: null,
      error: "An unexpected error occurred while starting book",
    };
  }
}

export interface UpdateBookProgressParams {
  bookId: string;
  userId: string;
  dateEffective: Date;
  currentPage: number;
}

export async function updateBookProgress(
  params: UpdateBookProgressParams
): Promise<{
  book: Book | null;
  error: string | null;
}> {
  try {
    // First, verify the book exists and belongs to the user
    const existingBook = await getBookById(params.bookId);

    // Validate currentPage doesn't exceed totalPages if totalPages exists
    if (
      existingBook.totalPages !== null &&
      params.currentPage > existingBook.totalPages
    ) {
      return {
        book: null,
        error: `currentPage cannot exceed total pages (${existingBook.totalPages})`,
      };
    }

    // Get the latest book_event_versions version for this book
    const latestVersion = await prisma.bookEventVersion.findFirst({
      where: {
        book_sid: params.bookId,
      },
      orderBy: {
        version: "desc",
      },
    });

    if (!latestVersion) {
      return {
        book: null,
        error: "No version found for book",
      };
    }

    const bookEventSid = uuidv4();

    // Update book current_page and create book event in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Update book current_page (status remains READING)
      const book = await tx.book.update({
        where: {
          sid: params.bookId,
        },
        data: {
          current_page: params.currentPage,
        },
      });

      // Create book event with PROGRESS type
      await tx.bookEvent.create({
        data: {
          sid: bookEventSid,
          book_sid: params.bookId,
          event_type: BookEventType.PROGRESS,
          date_effective: params.dateEffective,
          page_number: params.currentPage,
          version: latestVersion.version,
        },
      });

      return book;
    });

    return {
      book: new Book(result),
      error: null,
    };
  } catch (error) {
    console.error("Unexpected error updating book progress:", error);
    return {
      book: null,
      error: "An unexpected error occurred while updating book progress",
    };
  }
}
