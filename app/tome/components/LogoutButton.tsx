"use client";

import { Button } from "antd";
import useLogout from "@/app/tome/hooks/auth/useLogout";

export default function LogoutButton() {
  const { mutate: signOut, isPending } = useLogout();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Button onClick={handleLogout} loading={isPending}>
      Logout
    </Button>
  );
}
