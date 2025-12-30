import type { BookModel } from "@/lib/generated/prisma-client/models/Book";
import type { BookEventModel } from "@/lib/generated/prisma-client/models/BookEvent";
import type { BookEventVersionModel } from "@/lib/generated/prisma-client/models/BookEventVersion";
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

export class BookEvent {
  public readonly sid: BookEventModel["sid"];
  public readonly bookSid: BookEventModel["book_sid"];
  public readonly eventType: BookEventType;
  public readonly dateEffective: BookEventModel["date_effective"];
  public readonly pageNumber: BookEventModel["page_number"];
  public readonly version: BookEventModel["version"];
  public readonly datetimeCreated: BookEventModel["datetime_created"];
  public readonly datetimeUpdated: BookEventModel["datetime_updated"];

  constructor(data: BookEventModel) {
    this.sid = data.sid;
    this.bookSid = data.book_sid;
    this.eventType = convertStringToEnum<BookEventType>(
      data.event_type,
      Object.values(BookEventType)
    );
    this.dateEffective = data.date_effective;
    this.pageNumber = data.page_number;
    this.version = data.version;
    this.datetimeCreated = data.datetime_created;
    this.datetimeUpdated = data.datetime_updated;
  }
}

export class BookEventVersion {
  public readonly sid: BookEventVersionModel["sid"];
  public readonly bookSid: BookEventVersionModel["book_sid"];
  public readonly version: BookEventVersionModel["version"];
  public readonly description: BookEventVersionModel["description"];
  public readonly datetimeCreated: BookEventVersionModel["datetime_created"];
  public readonly datetimeUpdated: BookEventVersionModel["datetime_updated"];

  constructor(data: BookEventVersionModel) {
    this.sid = data.sid;
    this.bookSid = data.book_sid;
    this.version = data.version;
    this.description = data.description;
    this.datetimeCreated = data.datetime_created;
    this.datetimeUpdated = data.datetime_updated;
  }
}
