import type { BookModel } from "@/lib/generated/prisma-client/models/Book";
import convertStringToEnum from "@/app/server/utils/convertStringToEnum";

export enum BookStatus {
  WANT_TO_READ = "WANT_TO_READ",
  READING = "READING",
  READ = "READ",
  ARCHIVED = "ARCHIVED",
}

export enum BookEventType {
  ADD_TO_LIBRARY = "ADD_TO_LIBRARY",
  STARTED = "STARTED",
  PROGRESS = "PROGRESS",
  COMPLETED = "COMPLETED",
  ARCHIVED = "ARCHIVED",
}

export interface BookFilters {
  userId?: string;
  includeStatuses?: BookStatus[];
}

export class Book {
  public readonly sid: BookModel["sid"];
  public readonly title: BookModel["title"];
  public readonly authorName: BookModel["author_name"];
  public readonly datetimeCreated: BookModel["datetime_created"];
  public readonly currentPage: BookModel["current_page"];
  public readonly status: BookStatus;
  public readonly totalPages: BookModel["total_pages"];
  public readonly librarySid: BookModel["library_sid"];
  public readonly userId: BookModel["user_id"];

  constructor(data: BookModel) {
    this.sid = data.sid;
    this.title = data.title;
    this.authorName = data.author_name;
    this.datetimeCreated = data.datetime_created;
    this.status = convertStringToEnum<BookStatus>(
      data.status,
      Object.values(BookStatus)
    );
    this.totalPages = data.total_pages;
    this.currentPage = data.current_page;
    this.librarySid = data.library_sid;
    this.userId = data.user_id;
  }
}
