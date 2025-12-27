"use client";

import { ConfigProvider } from "antd";
import { ReactNode } from "react";

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <ConfigProvider
      theme={{
        token: {
          // Primary color
          colorPrimary: "#2E3A59",
          // Success, Error, Warning, Info
          colorSuccess: "#2FBF71",
          colorError: "#D64545",
          colorWarning: "#E6A23C",
          colorInfo: "#3A7BD5",
          // Text colors
          colorText: "#2E3A59",
          colorTextSecondary: "#6B7A99",
          // Background
          colorBgContainer: "#FFFFFF",
          colorBgElevated: "#FFFFFF",
          colorBgLayout: "#FFFFFF",
          // Border
          colorBorder: "#6B7A99",
          // Link
          colorLink: "#2E3A59",
          colorLinkHover: "#FF6F61",
          // Font
          fontFamily:
            "var(--font-montserrat), -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
          paddingXS: 4,
          paddingSM: 8,
          paddingMD: 16,
          paddingLG: 24,
          paddingXL: 32,
        },
        components: {
          Button: {
            colorPrimary: "#2E3A59",
            primaryColor: "#FFFFFF",
            colorLink: "#2E3A59",
            colorLinkHover: "#FF6F61",
          },
          Typography: {
            colorText: "#2E3A59",
            colorTextSecondary: "#6B7A99",
          },
          Input: {
            colorText: "#2E3A59",
            colorTextPlaceholder: "#6B7A99",
            colorBorder: "#6B7A99",
            colorPrimaryHover: "#FF6F61",
          },
          Alert: {
            colorSuccess: "#2FBF71",
            colorError: "#D64545",
            colorWarning: "#E6A23C",
            colorInfo: "#3A7BD5",
          },
          Layout: {
            headerBg: "#FFFFFF",
            bodyBg: "#FFFFFF",
            colorBgContainer: "#FFFFFF",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
