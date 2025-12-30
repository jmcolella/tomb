"use client";

import { useState } from "react";
import { Table, Typography, Tag, Alert, Button } from "antd";
import type { ColumnsType } from "antd/es/table";
import { BookApiEntity } from "@/app/api/books/types";
import AddBookModal from "@/app/tome/components/AddBookModal";
import BookActions from "@/app/tome/components/BookActions";
import useGetBooks from "@/app/tome/hooks/books/useGetBooks";

const { Title } = Typography;

enum ModalType {
  ADD = "ADD",
}

export default function BookList() {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
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

  const openModal = (modalName: ModalType) => {
    setActiveModal(modalName);
  };

  const closeModal = (modalName: ModalType) => {
    if (activeModal === modalName) {
      setActiveModal(null);
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
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: BookApiEntity) => (
        <BookActions book={record} />
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
        <Button type="primary" onClick={() => openModal(ModalType.ADD)}>
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
        open={activeModal === ModalType.ADD}
        onClose={() => closeModal(ModalType.ADD)}
        onSuccess={() => closeModal(ModalType.ADD)}
      />
    </div>
  );
}
