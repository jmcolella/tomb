import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookApiEntity } from "@/app/api/books/types";
import { ApiResponse } from "@/app/api/types";

interface UpdateProgressInput {
  bookId: string;
  dateEffective: string; // ISO date string
  currentPage: number;
}

function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<BookApiEntity>, Error, UpdateProgressInput>({
    mutationFn: async ({ bookId, dateEffective, currentPage }) => {
      const response = await fetch(`/api/books/${bookId}/progress`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ dateEffective, currentPage }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to update book progress");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export default useUpdateProgress;
