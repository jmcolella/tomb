import { headers } from "next/headers";
import { readBooksByUserId } from "@/app/server/books/internals/bookReader";
import { BookApiEntity } from "@/app/api/books/types";

export async function GET(_: Request) {
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  if (!userId) {
    return new Response(
      JSON.stringify({ error: "User not authenticated", data: null }),
      { status: 401 }
    );
  }
  const { books, error: booksError } = await readBooksByUserId(userId);

  if (booksError) {
    return new Response(JSON.stringify({ error: booksError, data: null }), {
      status: 500,
    });
  }

  if (!books) {
    return new Response(JSON.stringify({ data: [], error: null }), {
      status: 200,
    });
  }

  // Convert Book instances to BookApiEntity instances
  const bookApiEntities = books.map((book) => new BookApiEntity(book));

  return new Response(JSON.stringify({ data: bookApiEntities, error: null }), {
    status: 200,
  });
}
