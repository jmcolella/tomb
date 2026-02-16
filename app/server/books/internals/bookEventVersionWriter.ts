"use server";

import { v4 as uuidv4 } from "uuid";
import { BookEventVersion } from "@/app/server/books/types";

export interface CreateBookEventVersionParams {
  bookSid: string;
  version: number;
  description: string;
}

export async function createBookEventVersion(
  params: CreateBookEventVersionParams,
  tx: any
): Promise<BookEventVersion> {
  const data = await tx.bookEventVersion.create({
    data: {
      sid: uuidv4(),
      book_sid: params.bookSid,
      version: params.version,
      description: params.description,
    },
  });

  return new BookEventVersion(data);
}
