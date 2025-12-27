import { Database } from "@/app/server/database/types";

type BookRow = Database["public"]["Tables"]["books"]["Row"];

export type Book = {
  sid: BookRow["sid"];
  title: BookRow["title"];
  authorName: BookRow["author_name"] | null;
  datetimeCreated: BookRow["datetime_created"];
  status: BookRow["status"];
  totalPages: BookRow["total_pages"] | null;
};

export interface CreateBookInput {
  title: string;
  authorName?: string;
  status: "SHELF" | "READING" | "READ";
  sid: string;
}
