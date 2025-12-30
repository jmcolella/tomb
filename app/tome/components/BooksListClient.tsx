"use client";

import { useState } from "react";
import { Table, Typography, Tag, Alert, Button, Space } from "antd";
import {
  DeleteOutlined,
  PlayCircleOutlined,
  BookOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { BookApiEntity } from "@/app/api/books/types";
import AddBookModal from "@/app/tome/components/AddBookModal";
import ArchiveBookModal from "@/app/tome/components/ArchiveBookModal";
import StartBookModal from "@/app/tome/components/StartBookModal";
import UpdateProgressModal from "@/app/tome/components/UpdateProgressModal";
import useGetBooks from "@/app/tome/hooks/books/useGetBooks";

const { Title } = Typography;

enum ModalType {
  ADD = "ADD",
  ARCHIVE = "ARCHIVE",
  START = "START",
  PROGRESS = "PROGRESS",
}

export default function BooksListClient() {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
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

  const openModal = (book: BookApiEntity | null, modalName: ModalType) => {
    setSelectedBook(book);
    setActiveModal(modalName);
  };

  const closeModal = (modalName: ModalType) => {
    if (activeModal === modalName) {
      setActiveModal(null);
      setSelectedBook(null);
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
        <Space>
          {record.status === "WANT_TO_READ" && (
            <Button
              type="text"
              icon={<PlayCircleOutlined />}
              onClick={() => openModal(record, ModalType.START)}
            />
          )}
          {record.status === "READING" && (
            <Button
              type="text"
              icon={<BookOutlined />}
              onClick={() => openModal(record, ModalType.PROGRESS)}
            />
          )}
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => openModal(record, ModalType.ARCHIVE)}
          />
        </Space>
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
        <Button type="primary" onClick={() => openModal(null, ModalType.ADD)}>
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
      {selectedBook && (
        <>
          <ArchiveBookModal
            open={activeModal === ModalType.ARCHIVE}
            book={selectedBook}
            onClose={() => closeModal(ModalType.ARCHIVE)}
            onSuccess={() => closeModal(ModalType.ARCHIVE)}
          />
          <StartBookModal
            open={activeModal === ModalType.START}
            book={selectedBook}
            onClose={() => closeModal(ModalType.START)}
            onSuccess={() => closeModal(ModalType.START)}
          />
          <UpdateProgressModal
            open={activeModal === ModalType.PROGRESS}
            book={selectedBook}
            onClose={() => closeModal(ModalType.PROGRESS)}
            onSuccess={() => closeModal(ModalType.PROGRESS)}
          />
        </>
      )}
    </div>
  );
}
