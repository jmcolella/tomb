"use client";

import { useQuery } from "@tanstack/react-query";
import { Table, Typography, Tag, Alert } from "antd";
import type { ColumnsType } from "antd/es/table";
import { BookApiEntity } from "@/app/api/books/types";
import { ApiResponse } from "@/app/api/types";

const { Title } = Typography;

export default function BooksListClient() {
  const {
    data: result,
    isLoading,
    error,
  } = useQuery<ApiResponse<BookApiEntity[]>>({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await fetch("/api/books");
      return await res.json();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || result?.error || !result?.data) {
    return (
      <Alert
        title="Error loading books"
        description={result?.error || "An error occurred"}
        type="error"
        showIcon
      />
    );
  }

  const books = result?.data || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "READ":
        return "success";
      case "READING":
        return "processing";
      case "SHELF":
        return "default";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<BookApiEntity> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Author",
      dataIndex: "authorName",
      key: "authorName",
      render: (authorName: string | null) => authorName || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string | null) =>
        status ? <Tag color={getStatusColor(status)}>{status}</Tag> : "N/A",
    },
  ];

  return (
    <div>
      <Title level={2}>Your Books</Title>
      <Table
        columns={columns}
        dataSource={books}
        rowKey="sid"
        loading={isLoading}
      />
    </div>
  );
}
