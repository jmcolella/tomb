import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookApiEntity } from "@/app/api/books/types";
import { ApiResponse } from "@/app/api/types";

interface StartBookInput {
  bookId: string;
  dateEffective: string; // ISO date string
  currentPage: number;
}

function useStartBook() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<BookApiEntity>, Error, StartBookInput>({
    mutationFn: async ({ bookId, dateEffective, currentPage }) => {
      const response = await fetch(`/api/books/${bookId}/start`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dateEffective, currentPage }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to start book");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export default useStartBook;
