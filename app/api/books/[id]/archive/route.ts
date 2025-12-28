import { headers } from "next/headers";
import { archiveBook } from "@/app/server/books/internals/bookWriter";
import { BookApiEntity } from "@/app/api/books/types";

export async function PATCH(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  if (!userId) {
    return new Response(
      JSON.stringify({ error: "User not authenticated", data: null }),
      { status: 401 }
    );
  }

  const { id: bookId } = await params;

  if (!bookId) {
    return new Response(
      JSON.stringify({ error: "Book ID is required", data: null }),
      { status: 400 }
    );
  }

  const { book, error } = await archiveBook({
    bookId,
    userId,
  });

  if (error || !book) {
    return new Response(
      JSON.stringify({ error: error || "Failed to archive book", data: null }),
      { status: 500 }
    );
  }

  const bookApiEntity = new BookApiEntity(book);

  return new Response(JSON.stringify({ data: bookApiEntity, error: null }), {
    status: 200,
  });
}
