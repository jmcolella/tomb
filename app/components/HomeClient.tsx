"use client";

import { User, UserContext } from "../providers/UserProvider";
import { useContext, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Spin } from "antd";

interface HomeClientProps {
  user: User | null;
}

export default function HomeClient({ user }: HomeClientProps) {
  const { user: contextUser, setUser } = useContext(UserContext);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (user) {
      setUser({
        email: user.email,
      });
    }

    setRendered(true);
  }, [user, setUser, setRendered]);

  if (!contextUser && !rendered) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  if (contextUser) {
    redirect("/tomb/home");
  } else {
    redirect("/tomb/welcome");
  }

  return null;
}
