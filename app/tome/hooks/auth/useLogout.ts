import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ROUTE_WELCOME } from "@/app/tome/routes";

function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/auth/signOut", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to sign out");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", "books"] });
      window.location.href = ROUTE_WELCOME;
    },
  });
}

export default useLogout;
