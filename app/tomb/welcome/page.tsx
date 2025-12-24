"use client";

import { Button, Typography } from "antd";
import { useRouter } from "next/navigation";

const { Title, Paragraph } = Typography;

export default function WelcomeScreen() {
  const router = useRouter();

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
        onClick={() => router.push("/tomb/login")}
      >
        Login
      </Button>
    </div>
  );
}
