"use client";

import { useState } from "react";
import { Table, Typography, Tag, Alert, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { BookApiEntity } from "@/app/api/books/types";
import AddBookModal from "@/app/tome/components/AddBookModal";
import ArchiveBookModal from "@/app/tome/components/ArchiveBookModal";
import useGetBooks from "@/app/tome/hooks/books/useGetBooks";

const { Title } = Typography;

export default function BooksListClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookApiEntity | null>(null);
  const { books, isLoading, error } = useGetBooks();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !books) {
    return (
      <Alert
        title="Error loading books"
        description={error?.message || "An error occurred"}
        type="error"
        showIcon
      />
    );
  }

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

  const handleArchiveClick = (book: BookApiEntity) => {
    setSelectedBook(book);
    setIsArchiveModalOpen(true);
  };

  const handleArchiveSuccess = () => {
    setIsArchiveModalOpen(false);
    setSelectedBook(null);
  };

  const handleArchiveClose = () => {
    setIsArchiveModalOpen(false);
    setSelectedBook(null);
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
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: BookApiEntity) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleArchiveClick(record)}
        />
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Your Books
        </Title>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Add Book
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={books}
        rowKey="sid"
        loading={isLoading}
      />
      <AddBookModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => setIsModalOpen(false)}
      />
      {selectedBook && (
        <ArchiveBookModal
          open={isArchiveModalOpen}
          book={selectedBook}
          onClose={handleArchiveClose}
          onSuccess={handleArchiveSuccess}
        />
      )}
    </div>
  );
}
