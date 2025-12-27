"use client";

import { theme, Layout, Typography } from "antd";
import LogoutButton from "@/app/tome/components/LogoutButton";
import Link from "next/link";
import useGetUser from "@/app/tome/hooks/auth/useGetUser";

export default function TombLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { token } = theme.useToken();
  const { user, isLoading } = useGetUser();

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
        <Link href="/tome/home">
          <Typography.Title level={2} style={{ margin: 0 }}>
            tome
          </Typography.Title>
        </Link>
        {!isLoading && user && <LogoutButton />}
      </Layout.Header>
      <Layout.Content style={{ padding: token.paddingLG }}>
        {children}
      </Layout.Content>
    </Layout>
  );
}
