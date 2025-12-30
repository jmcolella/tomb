import { headers } from "next/headers";
import { getBooks, createBookService } from "@/app/server/books/booksService";
import { BookApiEntity, AddBookApiInput } from "@/app/api/books/types";
import convertStringToEnum from "@/app/server/utils/convertStringToEnum";
import { BookStatus, BookFilters } from "@/app/server/books/types";

export async function GET(request: Request) {
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  if (!userId) {
    return new Response(
      JSON.stringify({ error: "User not authenticated", data: null }),
      { status: 401 }
    );
  }

  try {
    // Parse query parameters
    const url = new URL(request.url);
    const filtersParam = url.searchParams.get("filters");

    let filters: BookFilters;

    try {
      filters = convertApiFiltersToBookFilters(filtersParam, userId);
    } catch (error) {
      return new Response(
        JSON.stringify({
          error:
            error instanceof Error
              ? error.message
              : "Invalid filters parameter format",
          data: null,
        }),
        { status: 400 }
      );
    }

    // getBooks will use default includeStatuses (all except ARCHIVED) if not provided
    const books = await getBooks(filters);

    // Convert Book instances to BookApiEntity instances
    const bookApiEntities = books.map((book) => new BookApiEntity(book));

    return new Response(
      JSON.stringify({ data: bookApiEntities, error: null }),
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing GET /api/books:", error);
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

export async function POST(request: Request) {
  const headersList = await headers();
  const userId = headersList.get("x-user-id");

  if (!userId) {
    return new Response(
      JSON.stringify({ error: "User not authenticated", data: null }),
      { status: 401 }
    );
  }

  try {
    const body: AddBookApiInput = await request.json();

    // Validate required fields
    if (!body.title || !body.author || !body.totalPages) {
      return new Response(
        JSON.stringify({
          error: "Title, author, and totalPages are required",
          data: null,
        }),
        { status: 400 }
      );
    }

    const { book, error } = await createBookService({
      userId,
      title: body.title,
      authorName: body.author,
      totalPages: body.totalPages,
      currentPage: body.currentPage,
    });

    if (error || !book) {
      return new Response(
        JSON.stringify({ error: error || "Failed to create book", data: null }),
        { status: 500 }
      );
    }

    const bookApiEntity = new BookApiEntity(book);

    return new Response(JSON.stringify({ data: bookApiEntity, error: null }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error processing POST /api/books:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process request",
        data: null,
      }),
      { status: 500 }
    );
  }
}

function convertApiFiltersToBookFilters(
  filtersParam: string | null,
  userId: string
): BookFilters {
  const filters: BookFilters = {
    userId,
  };

  if (!filtersParam) {
    return filters;
  }

  const parsed = JSON.parse(filtersParam) as unknown;

  // Type guard to validate the structure
  if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
    const apiFilters = parsed as Record<string, unknown>;

    // Validate include_statuses if present
    if (apiFilters.include_statuses !== undefined) {
      if (!Array.isArray(apiFilters.include_statuses)) {
        throw new Error("include_statuses must be an array");
      }

      // Validate each status is a valid BookApiStatus
      const validStatuses = apiFilters.include_statuses.map((status) =>
        convertStringToEnum<BookStatus>(status, Object.values(BookStatus))
      );

      filters.includeStatuses = validStatuses;
    }

    return filters;
  }

  throw new Error("Provided invalid filters parameter format");
}
