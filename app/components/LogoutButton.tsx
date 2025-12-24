"use client";

import { Button } from "antd";
import { signOut } from "@/app/server/auth/api";
import { useContext, useState } from "react";
import { UserContext } from "../providers/UserProvider";
import { redirect } from "next/navigation";

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(UserContext);

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut();

    setUser(null);
    redirect("/tomb/welcome");
  };

  return (
    <Button onClick={handleLogout} loading={isLoading}>
      Logout
    </Button>
  );
}
