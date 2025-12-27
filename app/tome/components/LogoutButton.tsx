"use client";

import { Button } from "antd";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function LogoutButton() {
  const queryClient = useQueryClient();
  const { mutate: signOut, isPending } = useMutation({
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
      window.location.href = "/tome/welcome";
    },
  });

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Button onClick={handleLogout} loading={isPending}>
      Logout
    </Button>
  );
}
