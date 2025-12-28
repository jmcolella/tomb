import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookApiEntity } from "@/app/api/books/types";
import { ApiResponse } from "@/app/api/types";

function useArchiveBook() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<BookApiEntity>, Error, string>({
    mutationFn: async (bookId: string) => {
      const response = await fetch(`/api/books/${bookId}/archive`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to archive book");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export default useArchiveBook;
