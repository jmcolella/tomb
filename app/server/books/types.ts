import type { BookModel } from "@/lib/generated/prisma-client/models/Book";

export class Book {
  public readonly sid: BookModel["sid"];
  public readonly title: BookModel["title"];
  public readonly authorName: BookModel["author_name"];
  public readonly datetimeCreated: BookModel["datetime_created"];
  public readonly status: BookModel["status"];
  public readonly totalPages: BookModel["total_pages"];
  public readonly librarySid: BookModel["library_sid"];
  public readonly userId: BookModel["user_id"];

  constructor(data: BookModel) {
    this.sid = data.sid;
    this.title = data.title;
    this.authorName = data.author_name;
    this.datetimeCreated = data.datetime_created;
    this.status = data.status;
    this.totalPages = data.total_pages;
    this.librarySid = data.library_sid;
    this.userId = data.user_id;
  }
}
