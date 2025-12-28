import { Book, BookStatus } from "@/app/server/books/types";

export type BookApiStatus = BookStatus;

export interface BookApiFilters {
  include_statuses?: BookApiStatus[];
}

export interface AddBookApiInput {
  title: string;
  author: string;
  totalPages: number;
  currentPage?: number;
}

export class BookApiEntity {
  public readonly sid: string;
  public readonly title: string;
  public readonly authorName: string | null;
  public readonly datetimeCreated: Date;
  public readonly status: BookStatus;
  public readonly totalPages: number | null;
  public readonly currentPage: number | null;
  public readonly librarySid: string | null;
  public readonly userId: string;

  constructor(book: Book) {
    this.sid = book.sid;
    this.title = book.title;
    this.authorName = book.authorName;
    this.datetimeCreated = book.datetimeCreated;
    this.status = book.status;
    this.totalPages = book.totalPages;
    this.currentPage = book.currentPage;
    this.librarySid = book.librarySid;
    this.userId = book.userId;
  }
}
