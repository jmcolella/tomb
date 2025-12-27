"use client";

import useGetUser from "@/app/tome/hooks/auth/useGetUser";
import { Button, Spin, Typography } from "antd";
import { redirect, useRouter } from "next/navigation";

const { Title, Paragraph } = Typography;

export default function WelcomeScreen() {
  const { user, isLoading } = useGetUser();
  const router = useRouter();

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (user) {
    return redirect("/tome/home");
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100vh - 64px)",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <Title level={1}>Welcome</Title>
      <Paragraph style={{ fontSize: 16, marginBottom: 32, maxWidth: "500px" }}>
        Please log in to access your account and manage your books.
      </Paragraph>
      <Button
        type="primary"
        size="large"
        onClick={() => router.push("/tome/login")}
      >
        Login
      </Button>
    </div>
  );
}
