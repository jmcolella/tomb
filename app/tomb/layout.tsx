"use client";

import { theme, Layout, Typography } from "antd";
import LogoutButton from "../components/LogoutButton";
import { UserContext } from "../providers/UserProvider";
import { useContext } from "react";
import Link from "next/link";

export default function TombLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { token } = theme.useToken();
  const { user } = useContext(UserContext);

  return (
    <Layout style={{ height: "100%" }}>
      <Layout.Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorder}`,
        }}
      >
        <Link href="/tomb/home">
          <Typography.Title level={2} style={{ margin: 0 }}>
            tomb
          </Typography.Title>
        </Link>
        {user && <LogoutButton />}
      </Layout.Header>
      <Layout.Content style={{ padding: token.paddingLG }}>
        {children}
      </Layout.Content>
    </Layout>
  );
}
