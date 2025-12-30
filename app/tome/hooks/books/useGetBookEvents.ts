import { BookEventApiEntity, BookEventApiOrderBy } from "@/app/api/books/types";
import { ApiResponse } from "@/app/api/types";
import { useQuery } from "@tanstack/react-query";

interface UseGetBookEventsResponse {
  events: BookEventApiEntity[] | null;
  isLoading: boolean;
  error: Error | null;
}

function useGetBookEvents(
  bookId: string,
  orderBy: BookEventApiOrderBy = "desc"
): UseGetBookEventsResponse {
  const { data, isLoading, error } = useQuery<
    ApiResponse<BookEventApiEntity[]>
  >({
    queryKey: ["bookEvents", bookId, orderBy],
    queryFn: async () => {
      const res = await fetch(
        `/api/books/${bookId}/events?order_by=${orderBy}`
      );
      return await res.json();
    },
    enabled: !!bookId,
  });

  if (!data) {
    return {
      events: null,
      isLoading,
      error: new Error("Failed to fetch book events"),
    };
  }

  return { events: data.data, isLoading, error };
}

export default useGetBookEvents;
