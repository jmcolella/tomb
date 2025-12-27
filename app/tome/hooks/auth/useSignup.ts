import { useMutation } from "@tanstack/react-query";
import { ROUTE_HOME } from "@/app/tome/routes";

interface SignupCredentials {
  email: string;
  password: string;
}

function useSignup() {
  return useMutation({
    mutationFn: async (credentials: SignupCredentials) => {
      const response = await fetch("/api/auth/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to sign up");
      }

      return response.json();
    },
    onSuccess: () => {
      window.location.href = ROUTE_HOME;
    },
  });
}

export default useSignup;
