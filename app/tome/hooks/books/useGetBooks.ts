import { BookApiEntity } from "@/app/api/books/types";
import { ApiResponse } from "@/app/api/types";
import { useQuery } from "@tanstack/react-query";

interface UseGetBooksResponse {
  books: BookApiEntity[] | null;
  isLoading: boolean;
  error: Error | null;
}

function useGetBooks(): UseGetBooksResponse {
  const { data, isLoading, error } = useQuery<ApiResponse<BookApiEntity[]>>({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await fetch("/api/books");
      return await res.json();
    },
  });

  if (!data) {
    return {
      books: null,
      isLoading,
      error: new Error("Failed to fetch books"),
    };
  }

  return { books: data.data, isLoading, error };
}

export default useGetBooks;
