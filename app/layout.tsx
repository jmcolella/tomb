import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import QueryProvider from "@/app/tome/providers/QueryProvider";
import ThemeProvider from "@/app/tome/providers/ThemeProvider";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tomb",
  description: "Tomb is a book management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased`}
        style={{ margin: 0, height: "100vh" }}
      >
        <AntdRegistry>
          <ThemeProvider>
            <QueryProvider>{children}</QueryProvider>
          </ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
