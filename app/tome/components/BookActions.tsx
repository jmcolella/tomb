"use client";

import { useState } from "react";
import { Button, Space } from "antd";
import {
  DeleteOutlined,
  PlayCircleOutlined,
  BookOutlined,
} from "@ant-design/icons";
import { BookApiEntity } from "@/app/api/books/types";
import ArchiveBookModal from "@/app/tome/components/ArchiveBookModal";
import StartBookModal from "@/app/tome/components/StartBookModal";
import UpdateProgressModal from "@/app/tome/components/UpdateProgressModal";

enum ModalType {
  ARCHIVE = "ARCHIVE",
  START = "START",
  PROGRESS = "PROGRESS",
}

interface BookActionsProps {
  book: BookApiEntity;
}

export default function BookActions({ book }: BookActionsProps) {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const openModal = (modalName: ModalType) => {
    setActiveModal(modalName);
  };

  const closeModal = (modalName: ModalType) => {
    if (activeModal === modalName) {
      setActiveModal(null);
    }
  };

  return (
    <>
      <Space>
        {book.status === "WANT_TO_READ" && (
          <Button
            type="text"
            icon={<PlayCircleOutlined />}
            onClick={() => openModal(ModalType.START)}
          />
        )}
        {book.status === "READING" && (
          <Button
            type="text"
            icon={<BookOutlined />}
            onClick={() => openModal(ModalType.PROGRESS)}
          />
        )}
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => openModal(ModalType.ARCHIVE)}
        />
      </Space>
      <ArchiveBookModal
        open={activeModal === ModalType.ARCHIVE}
        book={book}
        onClose={() => closeModal(ModalType.ARCHIVE)}
        onSuccess={() => closeModal(ModalType.ARCHIVE)}
      />
      <StartBookModal
        open={activeModal === ModalType.START}
        book={book}
        onClose={() => closeModal(ModalType.START)}
        onSuccess={() => closeModal(ModalType.START)}
      />
      <UpdateProgressModal
        open={activeModal === ModalType.PROGRESS}
        book={book}
        onClose={() => closeModal(ModalType.PROGRESS)}
        onSuccess={() => closeModal(ModalType.PROGRESS)}
      />
    </>
  );
}
