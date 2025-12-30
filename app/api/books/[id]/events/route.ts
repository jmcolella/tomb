import { headers } from "next/headers";
import { getBookById, getBookEvents } from "@/app/server/books/booksService";
import { BookEventApiEntity, BookEventApiOrderBy } from "@/app/api/books/types";

export async function GET(
  request: Request,
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

  try {
    // Parse order_by query parameter
    const url = new URL(request.url);
    const orderByParam = url.searchParams.get("order_by");

    let dateEffectiveOrder: "asc" | "desc";

    try {
      dateEffectiveOrder = convertApiOrderByToBookEventOrderBy(orderByParam);
    } catch (error) {
      return new Response(
        JSON.stringify({
          error:
            error instanceof Error
              ? error.message
              : "Invalid order_by parameter format",
          data: null,
        }),
        { status: 400 }
      );
    }

    // Verify book belongs to user
    const book = await getBookById(bookId);
    if (book.userId !== userId) {
      return new Response(
        JSON.stringify({
          error: "Book not found or access denied",
          data: null,
        }),
        { status: 403 }
      );
    }

    // Get book events at latest version with specified sort order
    const events = await getBookEvents(bookId, dateEffectiveOrder);

    // Convert to API entities
    const eventApiEntities = events.map(
      (event) => new BookEventApiEntity(event)
    );

    return new Response(
      JSON.stringify({ data: eventApiEntities, error: null }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing GET /api/books/[id]/events:", error);
    return new Response(
      JSON.stringify({
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        data: null,
      }),
      { status: 500 }
    );
  }
}

function convertApiOrderByToBookEventOrderBy(
  orderByParam: string | null
): "asc" | "desc" {
  // Default to "desc" if not provided
  if (!orderByParam) {
    return "desc";
  }

  // Validate that the parameter is either "asc" or "desc"
  if (orderByParam !== "asc" && orderByParam !== "desc") {
    throw new Error("order_by must be either 'asc' or 'desc'");
  }

  return orderByParam as BookEventApiOrderBy;
}
