import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BookApiEntity, AddBookApiInput } from "@/app/api/books/types";
import { ApiResponse } from "@/app/api/types";

function useAddBook() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<BookApiEntity>, Error, AddBookApiInput>({
    mutationFn: async (bookData: AddBookApiInput) => {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to add book");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });
}

export default useAddBook;
