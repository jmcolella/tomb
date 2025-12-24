"use client";

import { theme, Typography } from "antd";
import { UserContext } from "../../providers/UserProvider";
import { useContext } from "react";
import { redirect } from "next/navigation";

export default function HomeClient() {
  const { user } = useContext(UserContext);
  const { token } = theme.useToken();

  if (!user) {
    redirect("/");
  }

  return (
    <div style={{ textAlign: "center", paddingTop: token.paddingXL }}>
      <Typography.Title level={2}>Welcome back!</Typography.Title>
      <Typography.Title level={4} type="secondary">
        Logged in as: {user.email}
      </Typography.Title>
    </div>
  );
}
