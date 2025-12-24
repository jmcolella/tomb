"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, Typography, Tag, Alert, Button, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import { DeleteOutlined } from "@ant-design/icons";
import { getBooks, deleteBookById } from "@/app/server/books/api";
import { Book } from "@/app/server/books/internals/types";

const { Title } = Typography;

export default function BooksListClient() {
  const queryClient = useQueryClient();

  const {
    data: result,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      return await getBooks();
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: deleteBookById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books"] });
    },
  });

  const handleDelete = async (sid: string) => {
    await deleteBookMutation.mutateAsync(sid);
  };

  if (error || result?.error) {
    return (
      <Alert
        message="Error loading books"
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

  const columns: ColumnsType<Book> = [
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
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Book) => (
        <Popconfirm
          title="Delete book"
          description="Are you sure you want to delete this book?"
          onConfirm={() => handleDelete(record.sid)}
          okText="Yes"
          cancelText="No"
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            loading={deleteBookMutation.isPending}
          />
        </Popconfirm>
      ),
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
