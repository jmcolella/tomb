import { useMutation } from "@tanstack/react-query";
import { ROUTE_HOME } from "@/app/tome/routes";

interface LoginCredentials {
  email: string;
  password: string;
}

function useLogin() {
  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await fetch("/api/auth/signIn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to sign in");
      }

      return response.json();
    },
    onSuccess: () => {
      window.location.href = ROUTE_HOME;
    },
  });
}

export default useLogin;
